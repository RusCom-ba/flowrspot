import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux'; 
import { logoutUser } from '../slices/authSlice'; 
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import ProfileModal from './ProfileModal';
import LogoIcon from '../assets/old.png';
import { useNavigate } from 'react-router-dom';

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Ubuntu', sans-serif;

  img {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Logo = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #F47C7C;
  font-family: 'Lobster', cursive;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  margin-left: auto;
  padding: 0 5rem;

  a {
    text-decoration: none;
    color: #949EA0;
    font-weight: bold;
    font-size: 18px;
    transition: all 0.5s;

    &:hover {
      color: #ECBCB3;
      transform: scale(1.05);
    }
  }

 
  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: absolute;
    top: 70px;
    left: 0;
    background-color: #fff;
    height: 100vh;
    z-index: 999;
    width: 100%;
    align-items: center;
    padding: 20px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    a {
      display: block;
      padding: 1.8rem 0;
      padding-left: 2rem;
      padding-top: 2.5rem;
      text-align: start;
    }
    a:last-of-type {
      color: #E19184;
      margin-bottom: 2.5rem;
    }

   
    button {
      display: block;
      background-color: #ECBCB3;
      color: white;
      width: 140px;
      height: 40px;
      border-radius: 10rem;
      border: none;
      padding: 10px 20px;
      margin-left: 2rem;
      margin-top: 1rem;

      &:hover {
        background-color: #EAA79E;
      }
    }
  }
  
 
  @media (min-width: 769px) {
     a[href="/setting"], 
     a[href="/loginmobile"], 
    button {
      display: none;
    }
  }
`;

const Hamburger = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }

  div {
    width: 25px;
    height: 2px;
    background-color: #949EA0;
    margin: 5px 0;
    transition: 0.3s;
  }
  &.open div:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  &.open div:nth-child(2) {
    opacity: 0;
  }

  &.open div:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.5s;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.5s;

    &:hover {
     color: #ECBCB3;
     transform: scale(1.05);
    }
  }

  span {
    font-size: 18px;
    color: #949EA0;
    font-weight: bold;
    transition: all 0.5s;

    &:hover {
   color: #ECBCB3;
   transform: scale(1.05);
  }
}

  @media (max-width: 768px) {
    display: none;
  }
`;
const MobileUserSection = styled.div`
  display: flex;
  align-items: center;
  
  @media (min-width: 768px) {
    display:none;
  }
  
  span {
  font-size: 18px;
  color: #949EA0;
  font-weight: bold;
  padding: 20px 0;
  padding-left: 2rem;
  }

  img {
  width: 70px;
  height: 70px;
  padding: 20px 0;
  margin-left: 1rem;
  border-radius: 50%;
  }
`
const InitialsCircle = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #ECBCB3;
  margin-left: 2rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  transition: all 0.5s;

  &:hover {
   transform: scale(1.05);
  }

  font-weight: bold;
    @media (min-width: 768px) {
      height: 40px;
      width: 40px;
      padding: 0;
      margin-left: 1rem;
      font-size: 20px;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 15px;

  button {
    padding: 10px 20px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
  }

  .login {
    background: none;
    color: #ECBCB3;
    transition: all 0.5s;

    &:hover {
      color: #EAA79E;
      transform: scale(1.2);
    }
  }

  .signup {
    background-color: #ECBCB3;
    color: #fff;
    transition: all 0.5s;

    &:hover {
      background-color: #EAA79E;
      transform: scale(1.2);
    }
  }

 
  @media (max-width: 768px) {
    display: none;
  }
`;

function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth); 

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  const handleLogout = () => {
    dispatch(logoutUser());  
    navigate('/');  
    setMenuOpen(false);
  };
  
  return (
    <>
      <NavbarContainer>
        <img src={LogoIcon} alt={Logo} onClick={() => navigate('/')} />
        <Hamburger className={menuOpen ? "open" : ""} onClick={() => setMenuOpen(!menuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </Hamburger>

        {user ? (
          <NavLinks $isOpen={menuOpen}>
            <MobileUserSection>
              {user.profile_picture ? 
              (<img src={user.profile_picture} alt="User" />) :
              (<InitialsCircle>{getInitials(user.first_name, user.last_name)}</InitialsCircle>)}
              <span>{user.first_name} {user.last_name}</span>
            </MobileUserSection>
            <a href="/flowers">Flowers</a>
            <a href="/latest-sightings">Latest Sightings</a>
            <a href="/favorites">Favorites</a>
            <a href="/setting">Settings</a>
            <button onClick={handleLogout}>Logout</button>
          </NavLinks>
        ) : (
          <NavLinks $isOpen={menuOpen}>
            <a href="/flowers">Flowers</a>
            <a href="/latest-sightings">Latest Sightings</a>
            <a href="/favorites">Favorites</a>
            <a href="/loginmobile">Login</a>
            <button onClick={() => setIsSignupOpen(true)}>New Account</button>
          </NavLinks>
        )}

        {user ? (
          <UserSection onClick={() => setIsProfileOpen(true)}>
            <span>{user.first_name} {user.last_name}</span>
            {user.profile_picture ? 
              (<img src={user.profile_picture} alt="User" />) :
              (<InitialsCircle>{getInitials(user.first_name, user.last_name)}</InitialsCircle>)}
          </UserSection>
        ) : (
          <AuthButtons>
            <button className="login" onClick={() => setIsLoginOpen(true)}>Login</button>
            <button className="signup" onClick={() => setIsSignupOpen(true)}>New Account</button>
          </AuthButtons>
        )}
      </NavbarContainer>

      {isLoginOpen && <LoginModal closeModal={() => setIsLoginOpen(false)} onLogin={(user) => console.log("Logged in user:", user)} />}
      {isSignupOpen && <SignUpModal closeModal={() => setIsSignupOpen(false)} />}
      {isProfileOpen && <ProfileModal closeModal={() => setIsProfileOpen(false)} />}
    </>
  );
}

export default Navbar;