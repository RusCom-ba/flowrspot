import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import { fetchFlowers, addFavoriteFlower, removeFavoriteFlower } from '../slices/flowerSlice'; 
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import ErrorMessage from './errorMessage'; 
import blackImage from '../assets/blackImage.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as regularStar, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const PaginationButton = styled.button`
  background-color: ${({ $isActive }) => ($isActive ? '#ECBCB3' : '#FFF')};
  color: ${({ $isActive }) => ($isActive ? 'white' : '#333')};
  border: 1px solid #ccc;
  padding: 10px;
  margin: 0 5px;
  cursor: pointer;
  &:hover {
    background-color: #EAA79E;
  }
`;


const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 40px;
  padding: 20px 50px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    padding: 10px;
    gap: 10px;
    margin-bottom: 10rem;
  }
`;

const FlowerCard = styled(motion.div)`
  position: relative;
  font-family: 'Ubuntu', sans-serif;
  border-radius: 5px;
  width: 280px;
  height: 350px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 180px;
    height: 250px;
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
  font-size: 12px;
  line-height: 12px;
  color: white;
  width: 73px;
  height: 12px;
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
  z-index: 4;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin-bottom: 20px;
`;

const ModalButton = styled.button`
  background-color: #ECBCB3;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  margin: 10px;
  transition: all 0.5s;

  &:hover {
    background-color: #EAA79E;
    transform: scale(1.2);
  }
`;

const FlowerGrid = ({ searchTerm }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pages, favorites, loading, error } = useSelector((state) => state.flowers);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(1);
  const totalPages = 20; 

  const authToken = localStorage.getItem('auth_token');

  useEffect(() => {
    if (!pages[currentPage]) {
      dispatch(fetchFlowers({ page: currentPage, searchTerm }));
    }
    
    const nextPage = currentPage + 1;
    if (!pages[nextPage] && currentPage < 5) { 
      dispatch(fetchFlowers({ page: nextPage, searchTerm }));
    }
  }, [dispatch, currentPage, searchTerm, pages]);

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage && newPage > 0 && newPage <= totalPages) {
      setDirection(newPage > currentPage ? 1 : -1); 
      setCurrentPage(newPage);
      navigate(`?page=${newPage}`);
    }
  };

  const handleFlowerClick = (flowerId) => {
    if (!authToken) {
      setShowLoginModal(true);
    } else {
      navigate(`/flowers/${flowerId}`);
    }
  };

  const getPaginationButtons = () => {
    const pageNumbers = [];
    const totalPages = 20;

    pageNumbers.push(1);

    if (currentPage > 3) {
        pageNumbers.push('...');
    }

    let startPage = Math.max(currentPage - 1, 2);
    let endPage = Math.min(currentPage + 1, totalPages - 1);

    for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
            pageNumbers.push(i);
        }
    }

    if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
    }

    if (totalPages > 1) {
        pageNumbers.push(totalPages);
    }

    return [...new Set(pageNumbers)];
};



  const toggleFavorite = (flowerId) => {
    if (!authToken) {
      setShowLoginModal(true);
      return;
    }

    if (favorites.some(fav => fav.flower.id === flowerId)) {
      dispatch(removeFavoriteFlower({ flowerId, authToken }));
    } else {
      dispatch(addFavoriteFlower({ flowerId, authToken }));
    }
  };

  const animationVariants = {
    enter: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100, 
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100, 
    }),
  };

  const closeModal = () => setShowLoginModal(false);

  const currentFlowers = pages[currentPage] || []; 

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <>
      <AnimatePresence mode="wait" custom={direction}>
        <GridContainer
          key={currentPage} 
          as={motion.div} 
          initial="enter"
          animate="center"
          exit="exit"
          variants={animationVariants}
          custom={direction} 
          transition={{ duration: 0.5 }}
        >
          {currentFlowers.map((flower, index) => (
            <FlowerCard 
              key={flower.id || `flower-${index}`}
              onClick={() => handleFlowerClick(flower.id)}
              initial="enter"
              animate="center"
              exit="exit"
              variants={animationVariants}
              custom={direction} 
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }} 
            >
              <FavoriteIcon 
                $isFavorite={favorites.some(fav => fav.flower.id === flower.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(flower.id);
                }}
              >
                <FontAwesomeIcon 
                  icon={favorites.some(fav => fav.flower.id === flower.id) ? solidStar : regularStar} 
                />
              </FavoriteIcon>
              <FlowerImage src={flower.profile_picture || blackImage} alt={flower.name} />
              <FlowerInfo>
                <FlowerName>{flower.name}</FlowerName>
                <FlowerLatinName>{flower.latin_name}</FlowerLatinName>
                <SightingsCount $isFavorite={favorites.some(fav => fav.flower.id === flower.id)}>{flower.sightings} sightings</SightingsCount>
              </FlowerInfo>
            </FlowerCard>
          ))}
        </GridContainer>
      </AnimatePresence>
      <PaginationContainer>
    <PaginationButton 
        onClick={() => handlePageChange(currentPage - 1)} 
        disabled={currentPage === 1}
    >
        Prev
    </PaginationButton>
    {getPaginationButtons().map((page, index) => {
        if (page === '...') {
            return <span key={`dots-${index}`} style={{ padding: '0 10px' }}>...</span>;
        }
        return (
            <PaginationButton 
                key={`page-${page}`} 
                onClick={() => handlePageChange(page)}
                $isActive={currentPage === page}
            >
                {page}
            </PaginationButton>
        );
    })}
    <PaginationButton 
        onClick={() => handlePageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
    >
        Next
    </PaginationButton>
</PaginationContainer>
      {showLoginModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>You need an account to view flower details</ModalTitle>
            <ModalButton onClick={() => navigate('/login')}>I have an account</ModalButton>
            <ModalButton onClick={() => navigate('/register')}>Register</ModalButton>
            <ModalButton onClick={closeModal}>Close</ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default FlowerGrid;