
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { fetchFlowers, resetFlowerList } from '../slices/flowerSlice'; 
import heroImage from '../assets/pl-hero.png';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import FlowerGrid from './FlowerGrid';  


const HeroContainer = styled.div`
  height: 400px;
  background-image: url(${heroImage});
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 20px;

  @media (max-width: 768px) {
    height: 300px;
  }
`;


const Title = styled.h1`
  font-size: 40px;
  line-height: 40px;
  font-weight: 600;
  margin: 0;
  font-family: 'Monserrat', sans-serif;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  margin: 10px 0 30px;
  font-size: 17px;
  font-family: 'Playfair Display', sans-serif;
  line-height: 17px;
  font-weight: 400;
  opacity: 70%;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SearchBox = styled.div`
  background-color: white;
  border-radius: 3px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  width: 600px;

  @media (max-width: 768px) {
    width: 300px;
    border-radius: 5px;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  padding: 10px;
  font-size: 16px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  color: #F47C7C;
  font-size: 20px;
`;

function Home() {
  const [searchTerm, setSearchTerm] = useState(''); 
  const dispatch = useDispatch();
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm); 

  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); 

    return () => {
      clearTimeout(handler); 
    };
  }, [searchTerm]);

  
  useEffect(() => {
    if (debouncedTerm === '') {
      
      dispatch(resetFlowerList());
      dispatch(fetchFlowers({ page: 1, searchTerm: '' }));
    } else {
      
      dispatch(resetFlowerList()); 
      dispatch(fetchFlowers({ page: 1, searchTerm: debouncedTerm }));
    }
  }, [debouncedTerm, dispatch]);

  return (
    <>
      <HeroContainer>
        <Title>Discover flowers around you</Title>
        <Subtitle>Explore between more than 8,427 sightings</Subtitle>
        <SearchBox>
          <SearchInput
            placeholder="Looking for something specific?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <SearchIcon icon={faSearch} onClick={() => {}} />  {/* Ikona za pretragu, samo vizualna */}
        </SearchBox>
      </HeroContainer>

      <FlowerGrid searchTerm={debouncedTerm} />
    </>
  );
}

export default Home;