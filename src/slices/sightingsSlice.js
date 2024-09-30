import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Asinkroni thunk za dohvaćanje sightinga korisnika po ID-u
export const fetchUserSightingsById = createAsyncThunk('sightings/fetchUserSightingsById', async (userId) => {
  const response = await axios.get(`https://flowrspot-api.herokuapp.com/api/v1/users/${userId}/sightings`);
  return response.data.sightings; // Pretpostavljamo da se sightings vraćaju u ovom formatu
});

// Asinkroni thunk za dohvaćanje sightinga
export const fetchSightings = createAsyncThunk('sightings/fetchSightings', async () => {
  const response = await axios.get('https://flowrspot-api.herokuapp.com/api/v1/sightings');
  return response.data.sightings;
});

// Asinkroni thunk za dohvaćanje pojedinačnog sightinga po ID-u
export const fetchSightingById = createAsyncThunk('sightings/fetchSightingById', async (sightingId) => {
  const response = await axios.get(`https://flowrspot-api.herokuapp.com/api/v1/sightings/${sightingId}`);
  return response.data.sighting;
});

// Asinkroni thunk za dohvaćanje komentara po ID-u sightinga
export const fetchCommentsBySightingId = createAsyncThunk('sightings/fetchCommentsBySightingId', async (sightingId) => {
  const response = await axios.get(`https://flowrspot-api.herokuapp.com/api/v1/sightings/${sightingId}/comments`);
  return response.data.comments;
});

// Asinkroni thunk za dodavanje komentara
export const addComment = createAsyncThunk('sightings/addComment', async ({ sightingId, comment }, { getState }) => {
  const authToken = getState().auth.authToken; // Dohvati auth token iz store-a
  const response = await axios.post(
    `https://flowrspot-api.herokuapp.com/api/v1/sightings/${sightingId}/comments`,
    { content: comment },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return { sightingId, comment: response.data.comment };
});

// Asinkroni thunk za dodavanje lajka
export const toggleSightingLike = createAsyncThunk('sightings/toggleLike', async ({ sightingId, authToken }) => {
  const response = await axios.post(
    `https://flowrspot-api.herokuapp.com/api/v1/sightings/${sightingId}/favorites`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  return sightingId;
});

// Asinkroni thunk za kreiranje novog sightinga
export const createSighting = createAsyncThunk('sightings/createSighting', async (sightingData, { rejectWithValue }) => {
  try {
    const response = await axios.post('https://flowrspot-api.herokuapp.com/api/v1/sightings', sightingData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.sighting; // Pretpostavljamo da API vraća kreirani sighting
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const sightingsSlice = createSlice({
  name: 'sightings',
  initialState: {
    sightingsList: [],
    selectedSighting: null,
    comments: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upravljanje dohvaćanjem sightinga
      .addCase(fetchSightings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSightings.fulfilled, (state, action) => {
        state.loading = false;
        state.sightingsList = action.payload;
      })
      .addCase(fetchSightings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Upravljanje dohvaćanjem sightinga korisnika po ID-u
      .addCase(fetchUserSightingsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSightingsById.fulfilled, (state, action) => {
        state.loading = false;
        state.sightingsList = action.payload; // Postavi sightings listu sa podacima korisnika
      })
      .addCase(fetchUserSightingsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Upravljanje dohvaćanjem pojedinačnog sightinga
      .addCase(fetchSightingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSightingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSighting = action.payload;
      })
      .addCase(fetchSightingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Upravljanje dohvaćanjem komentara
      .addCase(fetchCommentsBySightingId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsBySightingId.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsBySightingId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Upravljanje dodavanjem komentara
      .addCase(addComment.fulfilled, (state, action) => {
        const { comment } = action.payload;
        state.comments.push(comment); // Dodaj novi komentar
      })

      // Upravljanje lajkovima (favoriti)
      .addCase(toggleSightingLike.fulfilled, (state, action) => {
        const sightingId = action.payload;
        const sighting = state.sightingsList.find(s => s.id === sightingId);
        if (sighting) {
          sighting.favorites_count += 1; // Povećaj broj lajkova
        }
      })

      // Upravljanje kreiranjem novog sightinga
      .addCase(createSighting.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSighting.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.sightingsList.push(action.payload); // Dodaj novi sighting u listu
      })
      .addCase(createSighting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = sightingsSlice.actions;
export default sightingsSlice.reducer;
