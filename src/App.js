import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';  
import store from './store';  
import Home from './components/Home';
import UserProfile from './components/UserProfile';  
import FlowerList from './components/FlowerList';
import FlowerDetail from './components/FlowerDetail';  
import FavoritesList from './components/FavoritesList';
import Navbar from './components/Navbar';
import NewSighting from './components/NewSighting'; 
import LatestSightings from './components/LatestSightings';
import SightingDetail from './components/SightingDetails';
import LoginMobile from './components/LoginMobile';

function App() {
  return (
    <Provider store={store}>  
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flowers" element={<FlowerList />} />
          <Route path="/sightings/:id" element={<SightingDetail />} />  
          <Route path="/flowers/:id" element={<FlowerDetail />} />
          <Route path="/favorites" element={<FavoritesList />} />
          <Route path="/new-sighting" element={<NewSighting />} /> 
          <Route path="/latest-sightings" element={<LatestSightings />} /> 
          <Route path="/sightings/:sightingId" component={SightingDetail} />
          <Route path="/profile" element={<UserProfile />} />  
          <Route path='/loginmobile' element={<LoginMobile />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
