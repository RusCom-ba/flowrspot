import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetAuthState } from '../slices/authSlice';
import styled from 'styled-components';


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

function SignupModal({ closeModal, openLoginModal }) {
  const dispatch = useDispatch();
  const { success, error, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (success) {
      closeModal();
      openLoginModal();
    }

    return () => {
      dispatch(resetAuthState());
    };
  }, [success, closeModal, openLoginModal, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>Create an Account</ModalTitle>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <InputField 
            type="text" 
            name="firstName" 
            placeholder="First Name" 
            value={formData.firstName} 
            onChange={handleChange} 
            required 
          />
          <InputField 
            type="text" 
            name="lastName" 
            placeholder="Last Name" 
            value={formData.lastName} 
            onChange={handleChange} 
            required 
          />
          <InputField 
            type="date" 
            name="dob" 
            value={formData.dob} 
            onChange={handleChange} 
            required 
          />
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </form>
        <CloseButton onClick={closeModal}>I don’t want to register</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
}

export default SignupModal;