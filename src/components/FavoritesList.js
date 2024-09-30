import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, addFavoriteFlower, removeFavoriteFlower } from '../slices/flowerSlice'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as regularStar, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';

const FavoritesListContainer = styled.div`
  padding: 40px;
  text-align: center;
  max-width: 1200px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    padding: 5px;
    gap: 10px;
    margin-bottom: 10rem;
    margin-top: 2rem; 
  }

  h2 {
    left: 10rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  grid-auto-flow: dense;
  padding: 20px 50px;

 @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    padding: 5px;
    gap: 10px;
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

`;

const FlowerCard = styled.div`
  position: relative;
  font-family: 'Ubuntu', sans-serif;
  border-radius: 5px;
  width: 320px;
  height: 400px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.5s;
  background-color: white;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 180px;
    height: 250px;
  }
  &:hover {
    transform: scale(1.05);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
  }
`;

const FlowerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const FlowerInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 3;
  text-align: center;
  padding: 20px;
`;

const FlowerName = styled.h3`
  font-size: 20px;
  font-weight: 400;
  line-height: 15px;
  color: white;
  margin: 0;
`;

const FlowerLatinName = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  font-style: italic;
  margin: 5px 0;
  opacity: 70%;
`;

const SightingsCount = styled.p`
  font-size: 16px;
  line-height: 12px;
  color: white;
  margin-top: 10px;
  font-weight: 400;
  border-radius: 30px;
  background-color: ${({ $isFavorite }) => ($isFavorite ? '#ECBCB3' : '#00000033')};
  padding: 10px 30px;
`;

const FavoriteIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 4;
  background-color: ${({ $isFavorite }) => ($isFavorite ? '#ECBCB3' : 'white')};
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.5s;

  &:hover {
    background-color: ${({ $isFavorite }) => ($isFavorite ? 'white' : '#ECBCB3')};
    transform: scale(1.2);

    svg {
      color: ${({ $isFavorite }) => ($isFavorite ? '#D4D8D9' : 'white')}; 
    }
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${({ $isFavorite }) => ($isFavorite ? 'white' : '#D4D8D9')}; 
  }
`;



const FavoritesList = () => {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.flowers); 

  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      dispatch(fetchFavorites(authToken)); 
    } else {
      console.error('Missing authentication token');
    }
  }, [dispatch]);

  const toggleFavorite = (flowerId) => {
    const authToken = localStorage.getItem('auth_token');
    if (!authToken) return;

    if (favorites.some(fav => fav.flower.id === flowerId)) {
      dispatch(removeFavoriteFlower({ flowerId, authToken })); 
    } else {
      dispatch(addFavoriteFlower({ flowerId, authToken })); 
    }
  };

  return (
    <FavoritesListContainer>
      <GridContainer>
        {favorites.length > 0 ? (
          favorites.map((favFlower) => (
            <FlowerCard key={favFlower.flower.id}>
              <FavoriteIcon 
                $isFavorite={favorites.some(fav => fav.flower.id === favFlower.flower.id)} 
                onClick={() => toggleFavorite(favFlower.flower.id)}
              >
                <FontAwesomeIcon 
                  icon={favorites.some(fav => fav.flower.id === favFlower.flower.id) ? solidStar : regularStar} 
                />
              </FavoriteIcon>
              <FlowerImage src={favFlower.flower.profile_picture || 'default-flower.png'} alt={favFlower.flower.name} />
              <FlowerInfo>
                <FlowerName>{favFlower.flower.name}</FlowerName>
                <FlowerLatinName>{favFlower.flower.latin_name}</FlowerLatinName>
                <SightingsCount $isFavorite={favorites.some(fav => fav.flower.id === favFlower.flower.id)}>{favFlower.flower.sightings} sightings</SightingsCount>
              </FlowerInfo>
            </FlowerCard>
          ))
        ) : (
          <p>No favorites found</p>
        )}
      </GridContainer>
    </FavoritesListContainer>
  );
};

export default FavoritesList;