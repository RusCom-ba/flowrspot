import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux'; 
import { loginUser } from '../slices/authSlice'; 
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  height: 100vh;
  padding: 50% 1.25rem;
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #334144;
  font-weight: 600;
  margin-bottom: 30px;
`;

const InputField = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 16px;
  font-family: 'Ubuntu', sans-serif;
  color: #555;

  &:focus {
    outline: none;
    border-color: #F47C7C;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  max-width: 400px;
  padding: 15px;
  background-color: #ECBCB3;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-family: 'Ubuntu', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #EAA79E;
  }
`;

function LoginMobile() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth); 

  const handleLogin = (e) => {
    e.preventDefault();

    
    dispatch(loginUser({ email, password })).then((response) => {
      if (response.meta.requestStatus === 'fulfilled') {
        
        navigate('/');
      }
    });
  };

  return (
    <LoginContainer>
      <Title>Welcome Back</Title>
      {error && <p style={{ color: 'red' }}>{error}</p>} 
      <InputField
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <InputField
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <LoginButton onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login to your Account'}
      </LoginButton>
    </LoginContainer>
  );
}

export default LoginMobile;