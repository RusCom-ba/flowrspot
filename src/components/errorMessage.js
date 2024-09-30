import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
`;

const ModalHeader = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #f47c7c;
`;

const ModalMessage = styled.p`
  font-size: 16px;
  margin-bottom: 30px;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ModalButton = styled.button`
  background-color: #ecbcb3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f47c7c;
  }
`;

const ErrorMessage = ({ onClose, LoginModal, onRegister }) => {
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>Attention Required</ModalHeader>
        <ModalMessage>You need to have an account to view flower details.</ModalMessage>
        <ButtonGroup>
          <ModalButton onClick={LoginModal}>Already have an account?</ModalButton>
          <ModalButton onClick={onRegister}>Register</ModalButton>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ErrorMessage;