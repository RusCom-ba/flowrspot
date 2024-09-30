import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux'; 
import { logoutUser } from '../slices/authSlice'; 
import { useNavigate } from 'react-router-dom';


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  font-family: 'Ubuntu', sans-serif;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  width: 590px;
  height: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #949EA0;
  cursor: pointer;
  font-size: 40px;
`;

const TopSection = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfilePicture = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 0px;
  padding: 0 5rem;
`;
const InitialsCircle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #ECBCB3;
  margin-right: 1rem;
  margin-left: 5rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
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
  margin: 5px 0 0 0;
`;

const InfoLabel = styled.p`
  color: #949EA0;
  margin: 5px 0;
  font-weight: 600;
  font-size: 10px;
  text-align: left;
  padding: 8px 5rem; 
`;

const InfoValue = styled.p`
  font-weight: bold;
  margin: 5px 0 20px 0;
  text-align: left;
  color: #334144;
  font-size: 18px;
  padding: 0 5rem;   
`;

const LogoutButton = styled.button`
  background-color: #ECBCB3;
  color: white;
  border-radius: 5px;   
  border: none;
  padding: 10px 20px;
  margin-top: 2rem;
  width: 147.5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.5s;

  &:hover {
    background-color: #EAA79E;
    transform: scale(1.2);
  }
`;

const ProfileModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth); 
  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate(''); 
    window.location.reload(); 
  };

  const handleProfileClick = () => {
    navigate('/profile');
    closeModal();
  };

  if (loading) {
    return (
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <p>Loading...</p>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (error) {
    return (
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <h2>Error</h2>
          <p>{error}</p>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (!user) {
    return (
      <ModalOverlay>
        <ModalContent>
          <CloseButton onClick={closeModal}>×</CloseButton>
          <p>No user data available.</p>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={closeModal}>×</CloseButton>
        <TopSection
        onClick={() => handleProfileClick()}
        >
          { user.profile_picture ? 
          (<ProfilePicture src={user.profile_picture} alt="User" />) : 
          (<InitialsCircle>{getInitials(user.first_name, user.last_name)}</InitialsCircle>)}
          <UserInfo>
            <UserName>{user.first_name} {user.last_name}</UserName>
            <SightingCount>{user.sightings_count || 'Unavailable'} sightings</SightingCount>
          </UserInfo>
        </TopSection>

        <InfoLabel>First Name</InfoLabel>
        <InfoValue>{user.first_name}</InfoValue>

        <InfoLabel>Last Name</InfoLabel>
        <InfoValue>{user.last_name}</InfoValue>

        <InfoLabel>Date of Birth</InfoLabel>
        <InfoValue>{user.date_of_birth || 'No information'}</InfoValue>

        <InfoLabel>Email Address</InfoLabel>
        <InfoValue>{user.email || 'No information'}</InfoValue>

        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProfileModal;