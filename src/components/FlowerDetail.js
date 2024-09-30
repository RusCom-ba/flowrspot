import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { /*fetchLocation,*/likeSighting, unlikeSighting,  fetchFlowerDetail, fetchSightings, fetchSightingDetail, removeFavoriteFlower, addFavoriteFlower } from '../slices/flowerSlice'; 
import { faMapMarkerAlt, faHeart, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as regularStar, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import blurImage from '../assets/pl-hero1.png';

const FlowerDetailContainer = styled.div`
  position: relative;
`;

const BackgroundBlur = styled.div`
  width: 100%;
  height: 350px;
  background: url(${blurImage});
  background-size: cover;
  filter: blur(1px);
  position: relative;
`;

const FlowerContent = styled.div`
  display: flex;
  flex-direction: row;
  background-color: transparent;
  border-radius: 10px;
  padding: 20px;
  padding-bottom: 0;
  margin-top: -320px;
  z-index: 2;
  position: relative;
`;

const FlowerImage = styled.img`
  width: 280px;
  height: 350px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FlowerInfo = styled.div`
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FlowerTitle = styled.h1`
  font-size: 36px;
  margin: 0;
  font-family: 'Ubuntu', sans-serif;
  font-weight: 300;
  color: #FFFFFF;
`;

const FlowerLatinName = styled.h2`
  font-size: 14px;
  font-family: 'Ubuntu', sans-serif;
  font-weight: 300;
  opacity: 70%;
  color: #FFFFFF;
  font-style: italic;
`;

const FlowerStats = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  gap: 10px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 300;
  font-family: 'Ubuntu', sans-serif;
  color: white;
  background-color: #00000033;
  border-radius: 20px;
  padding: 8px 20px;
`;

const AddSightingButton = styled.button`
  background-color: #ECBCB3;
  color: white;
  display: flex;
  justify-content: center;
  margin-right: 3rem;
  margin-left: auto;
  margin-top: 12rem;
  position: relative;
  align-items: center;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  height: 50px;
  width: 188px;
  transition: all 0.5s;

  &:hover {
    background-color: #EAA79E;
    transform: scale(1.05);
  }
`;

const FavoriteIcon = styled.div`
  position: relative;
  background-color: ${({ $isFavorite }) => ($isFavorite ? '#ECBCB3' : '#FFFFFF')};
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.5s;

  &:hover {
    background-color: ${({ $isFavorite }) => ($isFavorite ? '#FFFFFF' : '#ECBCB3')};
    transform: scale(1.2);

    svg {
      color: ${({ $isFavorite }) => ($isFavorite ? '#D4D8D9' : '#FFFFFF')};
    }
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${({ $isFavorite }) => ($isFavorite ? '#FFFFFF' : '#D4D8D9')};
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  gap: 10rem; 
  margin-top: 0;
`;

const TaxonomyInfo = styled.div`
  font-family: 'Ubuntu', sans-serif;
  font-size: 13px;
  margin-left: 1.3rem;
  margin-top: 2rem;
  color: #949EA0;
  display: flex;
  flex-direction: column;
  width: fit-content; 
`;

const TaxonomyItem = styled.p`
  font-weight: bold;
  margin-top: 2px;
`;

const FlowerDescription = styled.div`
  width: 60%; 
  font-size: 16px;
  text-align: justify;
  color: #666;
  line-height: 1.6;
`;

const SightingGrid = styled.div`
  display: grid;
  border-top: 1px solid #E8E9ED;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 18px;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  margin-top: 40px;
  margin-bottom: 2rem;
`;

const SightingCard = styled.div`
  background-color: white;
  margin-top: 3rem;
  margin-right: 0rem;
  width: 280px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;  
`;

const SightingImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 5px;
`;

const SightingInfo = styled.div`
  margin-top: 10px;
  text-align: center;
`;

const SightingLocation = styled.div`
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  color: white;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 14px;
  font-weight: bold;
  position: absolute;
  top: 10px;    
  left: 10px;   
  z-index: 10;  
`;

const LocationText = styled.span`
  margin-left: 5px;  
  margin-top: 5px;
  color: #DF9186;
  font-family: 'Ubuntu', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
`;

const SightingDetails = styled.p`
  font-size: 14px;
  color: #777;
`;

const InitialsCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ECBCB3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  font-weight: bold;
`;

const ProfileImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
`

const SightingTitle = styled.h3`
  font-size: 15px;
  line-height: 15px;
  font-family: 'Ubuntu', sans-serif;
  color: #334144;
  font-weight: 400;
  margin: 0px 0 0 0;
  text-align: left;
`;

const SightingByline = styled.p`
  font-size: 12px;
  line-height: 12px;
  font-style: italic;
  font-family: 'Ubuntu', sans-serif;
  font-weight: 400;
  color: #949EA0;
  margin: 5px 0;
  text-align: left;
`;

const SightingUserInfo = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-top: 10px;
  padding-left: 2rem;
  justify-content: flex-start;
  width: 100%; 
  gap: 10px;
`;


const SightingDescription = styled.p`
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  color: #949EA0;
  text-align: justify;
  padding-top: 5px;
  border-bottom: 1px solid #E8E9ED;
  width: 92%;
  padding-bottom: 0.5rem;
`;

const SightingCommentsAndLikes = styled.div`
  display: flex;
  width: 100%;
  padding-bottom: 1rem;
  padding-left: 3rem;
  gap: 15px;
  padding-top: 0.3rem;
`;

const IconText = styled.span`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #777;
  margin-right: 10px;

  svg {
    margin-right: 5px;
    color: #DF9186;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.5s;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const FlowerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { flowerDetail, favorites, sightings, loading, error, locations } = useSelector((state) => state.flowers);
  const authToken = localStorage.getItem('auth_token');

  useEffect(() => {
    dispatch(fetchFlowerDetail(id));
    dispatch(fetchSightings(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (sightings.length > 0) {
      sightings.forEach((sighting) => {
        dispatch(fetchSightingDetail(sighting.id));  
      });
    }
  }, [sightings, dispatch]);

  const getInitialsFromFullName = (fullName) => {
    if (!fullName) return 'NN'; 
    const nameParts = fullName.split(' '); 
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase(); 
    const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : ''; 
    return `${firstInitial}${lastInitial}`; 
  };
  
  

  useEffect(() => {
    sightings.forEach(sighting => {
      dispatch(fetchSightingDetail(sighting.id));  
    });
  }, [sightings, dispatch]);
  

  // useEffect koji dohvaća sve sightingse lokacije od flowera, trenutno zablokiran zbog apija..

  // useEffect(() => {
  //   const fetchLocationsForSightings = async () => {
  //     for (const sighting of sightings) {
  //       if (
  //         sighting.latitude && sighting.longitude &&
  //         !isNaN(sighting.latitude) && !isNaN(sighting.longitude) &&
  //         !locations[sighting.id]  
  //       ) {
  //         await dispatch(fetchLocation({ 
  //           latitude: sighting.latitude, 
  //           longitude: sighting.longitude, 
  //           sightingId: sighting.id 
  //         }));
  //       }
  //     }
  //   };
  
  //   if (sightings.length > 0) {
  //     fetchLocationsForSightings();
  //   }
  // }, [sightings, dispatch, locations]);


  const handleAddSighting = () => {
    navigate('/new-sighting');
  };

  const toggleFavorite = (flowerId) => {
    if (favorites.some(fav => fav.flower.id === flowerId)) {
      dispatch(removeFavoriteFlower({ flowerId, authToken }));
    } else {
      dispatch(addFavoriteFlower({ flowerId, authToken }));
    }
  };

  const toggleLike = (sightingId, likedByUser) => {
    if (likedByUser) {
      dispatch(unlikeSighting({ sightingId, authToken }));
    } else {
      dispatch(likeSighting({ sightingId, authToken }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!flowerDetail) {
    return <div>No details found</div>;
  }

  const isFavorite = favorites.some(fav => fav.flower.id === flowerDetail.id);

  return (
    <FlowerDetailContainer>
      <BackgroundBlur />
      <FlowerContent>
        <FlowerImage src={flowerDetail.profile_picture || 'default-flower.png'} alt={flowerDetail.name} />
        <FlowerInfo>
          <FlowerStats>
            <FavoriteIcon
              $isFavorite={isFavorite}
              onClick={() => toggleFavorite(flowerDetail.id)}
            >
              <FontAwesomeIcon 
                icon={isFavorite ? solidStar : regularStar} 
              />
            </FavoriteIcon>
            <StatItem>
              <strong>{flowerDetail.sightings} sightings</strong>
            </StatItem>
          </FlowerStats>
          <FlowerTitle>{flowerDetail.name}</FlowerTitle>
          <FlowerLatinName>{flowerDetail.latin_name}</FlowerLatinName>
        </FlowerInfo>
        <AddSightingButton onClick={handleAddSighting}>+ Add New Sighting</AddSightingButton>
      </FlowerContent>

      <InfoWrapper>
        <TaxonomyInfo>
          <TaxonomyItem>Kingdom: {flowerDetail.kingdom || 'No information'}</TaxonomyItem>
          <TaxonomyItem>Order: {flowerDetail.order || 'No information'}</TaxonomyItem>
          <TaxonomyItem>Family: {flowerDetail.family || 'No information'}</TaxonomyItem>
          <TaxonomyItem>Species: {flowerDetail.species || 'No information'}</TaxonomyItem>
        </TaxonomyInfo>

        <FlowerDescription>{flowerDetail.description || 'No information available'}</FlowerDescription>
      </InfoWrapper>

      <SightingGrid>
        {sightings.length > 0 ? (
          sightings.map((sighting) => (
            <SightingCard 
            key={sighting.id}
            onClick={() => navigate(`/sightings/${sighting.id}`)} 
          >
            <SightingLocation>
              <FontAwesomeIcon 
                icon={faMapMarkerAlt}
                style={{ color: '#DF9186' }}
              />
              <LocationText>No information</LocationText>
            </SightingLocation>
            <SightingImage src={sighting.picture || 'default-sighting.png'} alt={sighting.name} />
            <SightingUserInfo>
              {sighting.user.profile_picture ? (
                <ProfileImage src={sighting.user.profile_picture} alt="User" />
              ) : (
                <InitialsCircle>{getInitialsFromFullName(sighting.user.full_name)}</InitialsCircle>
              )}
              <div style={{ textAlign: 'center' }}>
                <SightingTitle>{sighting.name || 'Flower Name'}</SightingTitle>
                <SightingByline>by {sighting.user.full_name}</SightingByline>
              </div>
            </SightingUserInfo>
            <SightingDescription>{sighting.description}</SightingDescription>
            <SightingCommentsAndLikes>
              <IconText>
                <FontAwesomeIcon icon={faCommentDots} style={{ color: '#D4D8D9' }} />
                {sighting.comments_count} Comments
              </IconText>
              <IconText>
                <FontAwesomeIcon 
                  icon={faHeart} 
                  style={{ color: sighting.liked_by_user ? '#DF9186' : '#D4D8D9' }}
                  onClick={() => toggleLike(sighting.id, sighting.liked_by_user)}
                />
                {sighting.likes_count} Favorites
              </IconText>
            </SightingCommentsAndLikes>
          </SightingCard>
          
          ))
        ) : (
          <p>No sightings found for this flower.</p>
        )}
      </SightingGrid>
    </FlowerDetailContainer>
  );
};

export default FlowerDetail;