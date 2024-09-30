import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Asinkroni thunk za dohvaćanje cvjetova (s paginacijom i pretragom)
export const fetchFlowers = createAsyncThunk('flowers/fetchFlowers', async ({ page, searchTerm }, { getState }) => {
  const state = getState();
  
  // Provjeri da li već imamo cvjetove za ovu stranicu
  if (state.flowers.pages[page]) {
    return { flowers: state.flowers.pages[page], page };
  }
  
  // Ako nemamo podatke za traženu stranicu, pošalji zahtjev
  const url = searchTerm === ''
    ? `https://flowrspot-api.herokuapp.com/api/v1/flowers/random?page=${page}&limit=10`
    : `https://flowrspot-api.herokuapp.com/api/v1/flowers/search?query=${searchTerm}&page=${page}&limit=10`;

  const response = await axios.get(url);
  return { flowers: response.data.flowers, page };
});

// Asinkroni thunk za dohvaćanje favorita
export const fetchFavorites = createAsyncThunk('flowers/fetchFavorites', async (authToken) => {
  const response = await axios.get('https://flowrspot-api.herokuapp.com/api/v1/flowers/favorites', {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data.fav_flowers || [];
});

// Asinkroni thunk za dohvaćanje detalja cvijeta
export const fetchFlowerDetail = createAsyncThunk('flowers/fetchFlowerDetail', async (flowerId) => {
  const response = await axios.get(`https://flowrspot-api.herokuapp.com/api/v1/flowers/${flowerId}`);
  return response.data.flower;  // Osiguraj da vraćaš ispravan objekat
});

// Asinkroni thunk za dodavanje cvijeta u favorite
export const addFavoriteFlower = createAsyncThunk('flowers/addFavoriteFlower', async ({ flowerId, authToken }) => {
  const response = await axios.post(`https://flowrspot-api.herokuapp.com/api/v1/flowers/${flowerId}/favorites`, {}, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return { flowerId };
});

// Koordinate koje su useri stavljali su netačne, međutim u spodnjem dijelu koda je
// stavljena provjera da li su koordinate ispravne, ali postoji problem apija koji dohvaća lokaciju
// i treba da se plati jer je free opcija za reverse geocoding preslaba te ne dozvoljava više zahtjeva
// istovremeno... 

// // Funkcija za validaciju koordinata
// const isValidCoordinates = (latitude, longitude) => {
//   return (
//     latitude >= -90 && latitude <= 90 &&
//     longitude >= -180 && longitude <= 180
//   );
// };

// // Dohvaćanje lokacije
// export const fetchLocation = createAsyncThunk(
//   'flowers/fetchLocation',
//   async ({ latitude, longitude, sightingId }) => {
//     if (!isValidCoordinates(latitude, longitude)) {
//       // Ako su koordinate neispravne, vrati defaultnu poruku i ID sightinga
//       return { location: 'Invalid coordinates', sightingId };
//     }

//     // Ako su koordinate ispravne, pošalji API zahtjev
//     const apiKey = 'pk.296b527fe759cd07dd97ce3e29dc43bd'; // API ključ
//     const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`;

//     const response = await axios.get(url);
//     const { city, town, village, state } = response.data.address;

//     // Vraća grad, selo, ili državu uz ID sighting-a
//     return { location: city || town || village || state || 'Unknown location', sightingId };
//   }
// );

// Kreiraj lajk za opažanje
export const likeSighting = createAsyncThunk('sightings/likeSighting', async ({ sightingId, authToken }) => {
  const response = await axios.post(`https://flowrspot-api.herokuapp.com/api/v1/sightings/${sightingId}/likes`, {}, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return { sightingId };
});

// Ukloni lajk s opažanja
export const unlikeSighting = createAsyncThunk('sightings/unlikeSighting', async ({ sightingId, authToken }) => {
  await axios.delete(`https://flowrspot-api.herokuapp.com/api/v1/sightings/${sightingId}/likes`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return { sightingId };
});

// Asinkroni thunk za dohvaćanje sightings o cvijeću
export const fetchSightings = createAsyncThunk('flowers/fetchSightings', async (flowerId, { getState }) => {
  const authToken = getState().auth.token; 
  const response = await axios.get(`https://flowrspot-api.herokuapp.com/api/v1/flowers/${flowerId}/sightings`, {
    headers: {
      Authorization: `Bearer ${authToken}`, 
    }
  });
  return response.data.sightings; 
});


// Dodaj novi thunk za dohvaćanje detalja sightinga
export const fetchSightingDetail = createAsyncThunk(
  'flowers/fetchSightingDetail',
  async (sightingId) => {
    const response = await axios.get(`https://flowrspot-api.herokuapp.com/api/v1/sightings/${sightingId}`);
    return response.data.sighting;
  }
);


// Asinkroni thunk za uklanjanje cvijeta iz favorita
export const removeFavoriteFlower = createAsyncThunk('flowers/removeFavoriteFlower', async ({ flowerId, authToken }) => {
  await axios.delete(`https://flowrspot-api.herokuapp.com/api/v1/flowers/${flowerId}/favorites/${flowerId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return flowerId;
});

const flowerSlice = createSlice({
  name: 'flowers',
  initialState: {
    flowerList: [],
    pages: {},
    favorites: [],
    flowerDetail: null, 
    sightingDetail: null, 
    sightings: [],
    locations: {}, 
    loading: false,
    error: null,
    hasMoreFlowers: true,
  },
  reducers: {
    resetFlowerList: (state) => {
      state.flowerList = [];
      state.pages = {};
      state.hasMoreFlowers = true;
    },
    resetFlowerDetail: (state) => { 
      state.flowerDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlowers.fulfilled, (state, action) => {
        state.loading = false;
        
        state.pages[action.payload.page] = action.payload.flowers;

        state.flowerList = Object.values(state.pages).flat();

        state.hasMoreFlowers = action.payload.flowers.length >= 10;
      })
      .addCase(fetchFlowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Dodavanje lajka
    .addCase(likeSighting.fulfilled, (state, action) => {
      const sightingIndex = state.sightings.findIndex(s => s.id === action.payload.sightingId);
      if (sightingIndex !== -1) {
        state.sightings[sightingIndex].likes_count += 1; 
        state.sightings[sightingIndex].liked_by_user = true; 
      }
    })

    // Uklanjanje lajka
    .addCase(unlikeSighting.fulfilled, (state, action) => {
      const sightingIndex = state.sightings.findIndex(s => s.id === action.payload.sightingId);
      if (sightingIndex !== -1) {
        state.sightings[sightingIndex].likes_count -= 1; 
        state.sightings[sightingIndex].liked_by_user = false; 
      }
    })

      // Problem sa apijem

      // // Dohvaćanje lokacije
      // .addCase(fetchLocation.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(fetchLocation.fulfilled, (state, action) => {
      //   state.loading = false;
      //   // Pohrani lokaciju uz ID sightinga
      //   state.locations = {
      //     ...state.locations,
      //     [action.payload.sightingId]: action.payload.location,
      //   };
      // })
      // .addCase(fetchLocation.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message;
      // })

      // Upravljanje dohvaćanjem favorita
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Upravljanje dohvaćanjem detalja cvijeta
      .addCase(fetchFlowerDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlowerDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.flowerDetail = action.payload;
      })
      .addCase(fetchFlowerDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Dohvaćanje sightin details 
      .addCase(fetchSightingDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSightingDetail.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload) {
            state.error = 'Invalid sighting detail';
            return;
        }
        const flowerId = action.payload.flower_id; 
        if (flowerId === state.flowerDetail.id) {
            const sightingIndex = state.sightings.findIndex(s => s.id === action.payload.id);
            if (sightingIndex !== -1) {
                state.sightings[sightingIndex] = { ...state.sightings[sightingIndex], ...action.payload };
            } else {
                state.sightings.push(action.payload); 
            }
        }
    })    
      .addCase(fetchSightingDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Dohvaćanje sightingsa
      .addCase(fetchSightings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSightings.fulfilled, (state, action) => {
        state.loading = false;
        state.sightings = action.payload;
      })
      .addCase(fetchSightings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Dodavanje u favorite
      .addCase(addFavoriteFlower.fulfilled, (state, action) => {
        state.favorites.push({ flower: { id: action.payload.flowerId } });
      })

      // Uklanjanje iz favorita
      .addCase(removeFavoriteFlower.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(fav => fav.flower.id !== action.payload);
      });
  },
});

export const { resetFlowerList, resetFlowerDetail } = flowerSlice.actions;
export default flowerSlice.reducer;
