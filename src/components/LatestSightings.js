import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSightings } from '../slices/sightingsSlice'; 
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeadingSubtitleWrapper = styled.div`
  display: flex;
  font-family: 'Ubuntu', sans-serif;
  flex-direction: column;
  text-align: center;
  padding-left: 15%;
  flex-grow: 1;

  @media (max-width: 768px) {
    width: 250px;
    align-items: center;
    padding-left: 0;
  }
`;

const Heading = styled.h2`
  font-size: 40px;
  line-height: 40px;
  font-weight: 300;
  color: #949EA0;

  @media (max-width: 768px) {
    width: 140px;
    font-size: 24px;
    text-align: center;
  }
`;

const Subtitle = styled.p`
  font-size: 17px;
  line-height: 17px;
  font-weight: 300;
  color: #949EA0;
  margin-top: 0px;

  @media (max-width: 768px) {
    width: 240px;
    font-size: 12px;
  }
`;

const AddSightingButton = styled.button`
  background-color: #ECBCB3;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  height: 50px;
  transition: all 0.5s;
  margin-right: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
  &:hover {
    background-color: #EAA79E;
    transform: scale(1.05);
  }
`;

const SightingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 18px;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
  margin: 0px;
  padding: 0 18px;
  margin-bottom: 2rem;
  }
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

  @media (max-width: 768px) {
    width: 360px;
  }
`;

const SightingImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 5px;
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

const SightingUserInfo = styled.div`
  display: flex;
  align-items: start;
  justify-content: flex-start;
  margin-top: 10px;
  width: 100%;
  gap: 10px;
  padding-left: 2rem;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
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


const getInitialsFromFullName = (fullName) => {
  if (!fullName) return 'NN'; 
  const nameParts = fullName.split(' ');
  const firstInitial = nameParts[0]?.charAt(0).toUpperCase();
  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() : '';
  return `${firstInitial}${lastInitial}`;
};

const LatestSightings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { sightingsList, loading, error } = useSelector((state) => state.sightings);

  useEffect(() => {
    dispatch(fetchSightings());
  }, [dispatch]);

  const handleAddSighting = () => {
    navigate('/new-sighting');
  };
  
  if (loading) {
    return <div>Loading sightings...</div>;
  }

  if (error) {
    return <div>Error fetching sightings: {error}</div>;
  }

  return (
    <div>
      <HeaderWrapper>
          <HeadingSubtitleWrapper>
          <Heading>Sighting List</Heading>
          <Subtitle>Explore between more than 8,427 sightings</Subtitle>
          </HeadingSubtitleWrapper>
        <AddSightingButton onClick={handleAddSighting}>
          + Add New Sighting
        </AddSightingButton>
      </HeaderWrapper>
    <SightingGrid>
      {sightingsList.map((sighting) => (
        <SightingCard key={sighting.id}>
          <SightingLocation>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#DF9186' }} />
            <LocationText>{sighting.location || 'No information'}</LocationText>
          </SightingLocation>
          <SightingImage src={sighting.picture || 'default-sighting.png'} alt={sighting.flower.name} />
          <SightingUserInfo>
            {sighting.user.profile_picture ? (
              <ProfileImage src={sighting.user.profile_picture} alt={sighting.user.full_name} />
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
              <FontAwesomeIcon icon={faCommentDots} />
              {sighting.comments_count} Comments
            </IconText>
            <IconText>
              <FontAwesomeIcon icon={faHeart} />
              {sighting.likes_count} Favorites
            </IconText>
          </SightingCommentsAndLikes>
        </SightingCard>
      ))}
    </SightingGrid>
    </div>
  );
};

export default LatestSightings;
