import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux'; 
import { loginUser } from '../slices/authSlice'; 
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
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const ModalTitle = styled.h2`
  text-align: center;
  color: #333;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #ECBCB3;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.5s;

  &:hover {
    background-color: #EAA79E;
    transform: scale(1.05);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #F47C7C;
  cursor: pointer;
  margin-top: 20px;
  text-align: center;
`;

function LoginModal({ closeModal, onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    dispatch(loginUser({ email: formData.email, password: formData.password })).then((response) => {
      if (response.meta.requestStatus === 'fulfilled') {
        onLogin(response.payload.user); 
        navigate('/profile'); 
        closeModal(); 
      }
    });
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>Welcome Back</ModalTitle>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <InputField 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <InputField 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login to your Account'}
          </SubmitButton>
        </form>
        <CloseButton onClick={closeModal}>I don’t want to Login</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
}

export default LoginModal;