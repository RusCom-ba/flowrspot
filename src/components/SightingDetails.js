import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'; 
import { fetchSightingDetail, likeSighting, unlikeSighting } from '../slices/flowerSlice';
import styled from 'styled-components';

const SightingDetail = () => {
    const { sightingId } = useParams(); 
    const dispatch = useDispatch();
    const sightingDetail = useSelector((state) => state.flowers.sightingDetail);
    const [loading, setLoading] = useState(true);   

    
    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            await dispatch(fetchSightingDetail(sightingId));
            setLoading(false);
        };
        fetchDetails();
    }, [dispatch, sightingId]);
    const authToken = localStorage.getItem('auth_token');

    
    const handleLike = () => {
        if (sightingDetail.liked_by_user) {
            dispatch(unlikeSighting({ sightingId, authToken })); 
        } else {
            dispatch(likeSighting({ sightingId, authToken }));
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!sightingDetail) {
        return <p>Sighting not found.</p>;
    }

    return (
        <SightingDetailWrapper>
            <ImageWrapper>
                <img src={sightingDetail.image_url} alt="Sighting" />
            </ImageWrapper>
            <SightingInfo>
                <h2>{sightingDetail.title}</h2>
                <p>{sightingDetail.description}</p>
                <SightingMeta>
                    <span>By: {sightingDetail.user.username}</span>
                    <span>{new Date(sightingDetail.created_at).toLocaleDateString()}</span>
                </SightingMeta>
                <LikeButton onClick={handleLike}>
                    {sightingDetail.liked_by_user ? 'Unlike' : 'Like'} ({sightingDetail.likes_count})
                </LikeButton>
            </SightingInfo>
        </SightingDetailWrapper>
    );
};

export default SightingDetail;


const SightingDetailWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const ImageWrapper = styled.div`
    width: 100%;
    max-width: 600px;
    img {
        width: 100%;
        border-radius: 8px;
    }
`;

const SightingInfo = styled.div`
    width: 80%;
    margin-top: 20px;
`;

const SightingMeta = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 0.9em;
    color: #555;
`;

const LikeButton = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background-color: #0056b3;
    }
`;
