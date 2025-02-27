import axios from 'axios';
import {API_BASE_URL, ENDPOINTS} from '../config/apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const chatbotAPI = {
  sendMessage: async (data: {
    query: string;
    patient_id: number;
    session_id: number;
  }) => {
    try {
      console.log('Sending request to:', `${API_BASE_URL}${ENDPOINTS.CHATBOT}`);
      console.log('Request data:', data);

      const response = await api.post(ENDPOINTS.CHATBOT, data);

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    } catch (error) {
      console.error('Full error:', error);

      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        throw {
          status: error.response?.status || 500,
          message: errorData?.error || 'An error occurred',
          details: errorData?.details || null,
        };
      }

      throw {
        status: 500,
        message: error.message || 'An unexpected error occurred',
        details: null,
      };
    }
  },
};

export const PatientDetailAPI = {
  getPatientDetails: async (data: {userID: string}) => {
    try {
      console.log(
        'Sending request to:',
        `${API_BASE_URL}${ENDPOINTS.PATIENTDETAILS}/${data.userID}`,
      );

      const response = await api.get(
        `${ENDPOINTS.PATIENTDETAILS}/${data.userID}`,
      );

      console.log('got the response = ', response);
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    } catch (error) {
      console.error('Full error:', error);

      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        throw {
          status: error.response?.status || 500,
          message: errorData?.error || 'An error occurred',
          details: errorData?.details || null,
        };
      }

      throw {
        status: 500,
        message: error.message || 'An unexpected error occurred',
        details: null,
      };
    }
  },
  getDoctorDetails: async (data: {userID: string}) => {
    try {
      console.log(
        'Sending request to:',
        `${API_BASE_URL}${ENDPOINTS.DOCTORPATIENTDETAILS}/${data.userID}`,
      );

      const response = await api.get(
        `${ENDPOINTS.DOCTORPATIENTDETAILS}/${data.userID}`,
      );

      console.log('got the response = ', response);
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    } catch (error) {
      console.error('Full error:', error);

      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        throw {
          status: error.response?.status || 500,
          message: errorData?.error || 'An error occurred',
          details: errorData?.details || null,
        };
      }

      throw {
        status: 500,
        message: error.message || 'An unexpected error occurred',
        details: null,
      };
    }
  },
};

export const DoctorDetailAPI = {
  getDoctorDetails: async (data: {userID: string}) => {
    try {
      console.log(
        'Sending request to:',
        `${API_BASE_URL}${ENDPOINTS.DOCTORDETAILS}/${data.userID}`,
      );

      const response = await api.get(
        `${ENDPOINTS.DOCTORDETAILS}/${data.userID}`,
      );

      console.log('got the response = ', response);
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    } catch (error) {
      console.error('Full error:', error);

      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        throw {
          status: error.response?.status || 500,
          message: errorData?.error || 'An error occurred',
          details: errorData?.details || null,
        };
      }

      throw {
        status: 500,
        message: error.message || 'An unexpected error occurred',
        details: null,
      };
    }
  },
};

export const AuthAPI = {
  login: async (data: {email: string; password: string}) => {
    try {
      console.log('Sending request to:', `${API_BASE_URL}${ENDPOINTS.LOGIN}`);
      console.log('Request data:', data);

      const response = await api.post(ENDPOINTS.LOGIN, data);

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    } catch (error) {
      console.error('Full error:', error);

      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        throw {
          status: error.response?.status || 500,
          message: errorData?.error || 'An error occurred',
          details: errorData?.details || null,
        };
      }

      throw {
        status: 500,
        message: error.message || 'An unexpected error occurred',
        details: null,
      };
    }
  },
};
// import axios from 'axios';
// import { API_BASE_URL, ENDPOINTS } from '../config/apiConfig';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const chatbotAPI = {
//     sendMessage: async (data: {
//       query: string;
//       patient_id: number;
//       session_id: number;
//     }) => {
//       try {
//         const response = await api.post(ENDPOINTS.CHATBOT, data);
//         return response.data;
//       } catch (error) {
//         throw handleError(error);
//       }
//     },
//   };

//   const handleError = (error: any) => {
//     if (error.response) {
//       // Server responded with error
//       return {
//         status: error.response.status,
//         message: error.response.data.message || 'An error occurred',
//         data: error.response.data,
//       };
//     } else if (error.request) {
//       // Request made but no response
//       return {
//         status: 503,
//         message: 'Service unavailable',
//         data: null,
//       };
//     } else {
//       // Something else happened
//       return {
//         status: 500,
//         message: error.message || 'Unknown error occurred',
//         data: null,
//       };
//     }
//   };
