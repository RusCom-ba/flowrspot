import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserProfile = createAsyncThunk('auth/fetchUserProfile', async (_, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        throw new Error('No auth token found');
      }
      const response = await axios.get('https://flowrspot-api.herokuapp.com/api/v1/users/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching user profile');
    }
  });
  
// Asinkroni thunk za login korisnika
export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    // API zahtjev za login
    const response = await axios.post('https://flowrspot-api.herokuapp.com/api/v1/users/login', {
      email,
      password,
    });

    // Dohvati auth_token iz odgovora
    const authToken = response.data.auth_token;

    // Spremi auth_token u localStorage
    localStorage.setItem('auth_token', authToken);

    // Dohvati podatke o korisniku
    const userResponse = await axios.get('https://flowrspot-api.herokuapp.com/api/v1/users/me', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    // Spremi korisničke podatke u localStorage
    localStorage.setItem('user', JSON.stringify(userResponse.data.user));

    return { authToken, user: userResponse.data.user };
  } catch (error) {
    // Vraćanje greške ako autentifikacija nije uspjela
    return rejectWithValue(error.response.data || 'Error during login');
  }
});

// Asinkroni thunk za registraciju korisnika
export const registerUser = createAsyncThunk('auth/registerUser', async (formData, { rejectWithValue }) => {
  try {
    // Formatiraj datum u 'YYYY-MM-DD'
    const formattedDob = new Date(formData.dob).toISOString().split('T')[0];

    // API zahtjev za registraciju
    const response = await axios.post('https://flowrspot-api.herokuapp.com/api/v1/users/register', {
      first_name: formData.firstName,
      last_name: formData.lastName,
      date_of_birth: formattedDob,
      email: formData.email,
      password: formData.password,
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error during registration');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authToken: localStorage.getItem('auth_token') || null, 
    user: JSON.parse(localStorage.getItem('user')) || null, 
    loading: false,
    error: null,
    success: false, 
  },
  reducers: {
    logoutUser: (state) => {
      state.authToken = null;
      state.user = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    },
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authToken = action.payload.authToken;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed. Please try again.';
      })
      
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed. Please try again.';
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user profile.';
      });
  },
});

export const { logoutUser, resetAuthState } = authSlice.actions;
export default authSlice.reducer;