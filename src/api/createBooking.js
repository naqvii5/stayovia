// src/api/booking.js
import { axiosInstanceWithToken } from './axiosInstance';
import { ENDPOINTS } from './endPoints';

// Takes hotelId + rest of booking data as input

export const createBooking = async (payload) => {
  try {
    const response = await axiosInstanceWithToken.post(
      ENDPOINTS.CREATE_BOOKING,
      payload
    );

    return response.data;
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
};
