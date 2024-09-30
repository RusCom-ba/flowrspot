import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; 
import sightingsReducer from './slices/sightingsSlice'; 
import flowerReducer from './slices/flowerSlice';  

const store = configureStore({
  reducer: {
    auth: authReducer, 
    sightings: sightingsReducer, 
    flowers: flowerReducer,
    
  },
});

export default store;
