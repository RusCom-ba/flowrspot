import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { createSighting, resetState } from '../slices/sightingsSlice'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import mapPlaceholder from '../assets/Map.png';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Modal from 'react-modal';


const SightingContainer = styled.div`
  padding: 0;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const MapContainer = styled.div`
  background-image: url(${mapPlaceholder});
  background-size: cover;
  background-position: center;
  height: 300px;
  width: 100vw;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0px;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  }
`;

const FormContainer = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-top: -100px;
  z-index: 1;
  width: 92%;
  text-align: right;
`;

const Heading = styled.h2`
  font-size: 36px;
  font-weight: bold;
  color: #555;
  margin-bottom: 20px;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #777;
  text-align: center;
`;

const CoordinatesRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
`;

const InputField = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  resize: none;
`;

const Button = styled.button`
  background-color: #ECBCB3;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.5s;

  &:hover {
    background-color: #EAA79E;
    transform: scale(1.05);
  }
`;

const PhotoButton = styled(Button)`
  background-color: #ffffff;
  color: #F47C7C;
  border: 2px solid #F47C7C;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 15px;
  width: auto;
  white-space: nowrap;

  svg {
    margin-right: 8px;
    font-size: 18px;
  }
`;

const NewSightingButton = styled(Button)`
  margin-top: 20px;
  width: 20rem;
  align-self: flex-end;
`;

const ImagePreview = styled.img`
  margin-top: 20px;
  max-width: 100%;
  height: auto;
  border-radius: 10px;
`;

const customModalStyles = {
  overlay: {
    zIndex: 1000, 
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    zIndex: 1100, 
  },
};

const NewSighting = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coordinates: '',
    flower_id: 1,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector((state) => state.sightings); 

  useEffect(() => {
    if (success) {
      alert('Sighting uspješno kreiran!');
      navigate('/sightings');
      dispatch(resetState()); 
    }

    if (error) {
      alert(`Greška: ${error}`);
      dispatch(resetState()); 
    }
  }, [success, error, navigate, dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const [latitude, longitude] = formData.coordinates.split(',');
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('description', formData.description);
    dataToSend.append('latitude', latitude.trim());
    dataToSend.append('longitude', longitude.trim());
    dataToSend.append('flower_id', formData.flower_id);
    if (selectedFile) {
      dataToSend.append('photo', selectedFile);
    }

    
    dispatch(createSighting(dataToSend));
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setSelectedCoordinates({ lat, lng });
    setFormData({ ...formData, coordinates: `${lat}, ${lng}` });
    setIsModalOpen(false);
  };

  return (
    <SightingContainer>
      <MapContainer>
        <Button style={{ position: 'absolute', right: '20px', top: '8rem' }} onClick={() => setIsModalOpen(true)}>
          View on Google Maps
        </Button>
      </MapContainer>

      <FormContainer>
        <Heading>Add New Sighting</Heading>
        <Subtitle>Explore between more than 8,427 sightings</Subtitle>

        <CoordinatesRow>
          <InputField
            type="text"
            name="name"
            placeholder="Title of the sighting"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <InputField
            type="text"
            name="coordinates"
            placeholder="Coordinates of the sighting (latitude, longitude)"
            value={formData.coordinates}
            onChange={handleInputChange}
            required
          />
          <input
            type="file"
            id="file-input"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleFileChange}
          />
          <PhotoButton onClick={() => document.getElementById('file-input').click()}>
            <FontAwesomeIcon icon={faCamera} />
            Add a Photo
          </PhotoButton>
        </CoordinatesRow>

        <TextArea
          name="description"
          placeholder="Write a description..."
          rows="5"
          value={formData.description}
          onChange={handleInputChange}
        />

        {previewUrl && <ImagePreview src={previewUrl} alt="Selected Preview" />}

        <NewSightingButton type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Create New Sighting'}
        </NewSightingButton>
      </FormContainer>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} style={customModalStyles}>
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={{ height: '100%', width: '100%' }}
            center={{ lat: 37.7749, lng: -122.4194 }}
            zoom={10}
            onClick={handleMapClick}
          >
            {selectedCoordinates && (
              <Marker position={selectedCoordinates} />
            )}
          </GoogleMap>
        </LoadScript>
      </Modal>
    </SightingContainer>
  );
};

export default NewSighting;