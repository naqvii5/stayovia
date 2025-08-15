// src/api/booking.js
import { axiosInstanceWithToken } from './axiosInstance';
import { ENDPOINTS } from './endPoints';

// Takes hotelId + rest of booking data as input

export const featuredHotels = async () => {
  try {
    const response = await axiosInstanceWithToken.get(
      ENDPOINTS.FEATURED_HOTELS
    );

    return response.data;
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};
