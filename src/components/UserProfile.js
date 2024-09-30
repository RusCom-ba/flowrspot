import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSightingsById } from '../slices/sightingsSlice';
import { fetchUserProfile } from '../slices/authSlice';

const ProfileContainer = styled.div`
  padding: 40px;
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  padding-left: 2rem;
  padding-right: 5rem;
`;

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
`;

const ProfilePicture = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
`;

const InitialsCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #ECBCB3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  font-weight: bold;
  margin-right: 20px;
`;

const UserInfo = styled.div`
  text-align: left;
`;

const UserName = styled.h2`
  margin: 0;
  color: #334144;
`;

const SightingCount = styled.p`
  color: #949EA0;
  margin: 5px 0;
`;

const ReportButton = styled.button`
  background-color: #ECBCB3;
  color: white;
  width: 110px;
  height: 40px;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #EAA79E;
    transform: scale(1.05);
  }
`;

const SightingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const SightingCard = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    border-radius: 10px;
  }

  h3 {
    margin-top: 10px;
  }

  p {
    color: #777;
  }
`;

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector((state) => state.auth);
  const { sightings, loading: sightingsLoading } = useSelector((state) => state.sightings);

  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    
    if (authToken) {
      dispatch(fetchUserProfile(authToken)).then((action) => {
        if (action.payload && action.payload.id) {
          dispatch(fetchUserSightingsById(action.payload.id));
        }
      });
    } else {
      console.error('No auth token found');
    }
  }, [dispatch]);

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (userLoading || sightingsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <UserHeader>
        <UserInfoSection>
          {user.profile_picture ? 
            (<ProfilePicture src={user.profile_picture} alt="User" />) :
            (<InitialsCircle>{getInitials(user.first_name, user.last_name)}</InitialsCircle>)}
          <UserInfo>
            <UserName>{user.first_name} {user.last_name}</UserName>
            <SightingCount>{user.sightings_count || '0'} sightings</SightingCount>
          </UserInfo>
        </UserInfoSection>
        <ReportButton>Report</ReportButton>
      </UserHeader>

      <SightingsGrid>
        {sightings && sightings.length > 0 ? (
          sightings.map((sighting) => (
            <SightingCard key={sighting.id}>
              <img src={sighting.flower.profile_picture || 'default-flower.png'} alt="Flower" />
              <h3>{sighting.flower.name}</h3>
              <p>{sighting.location}</p>
              <p>{sighting.comments_count} Comments | {sighting.favorites_count} Favorites</p>
            </SightingCard>
          ))
        ) : (
          <p>No sightings found</p>
        )}
      </SightingsGrid>
    </ProfileContainer>
  );
};

export default UserProfile;