import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://crypt0.rayyehbalak.com';

interface UserProfile {
  username: string;
  email: string;
  level: number;
  mining_rate: number;
  coins: Array<{
    symbol: string;
    balance: string;
  }>;
}

// Store user data in memory for fallback
let cachedUserData: UserProfile | null = null;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Make sure to use 'Bearer ' prefix
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Adding token to request:', {
          url: config.url,
          token: token.substring(0, 10) + '...' // Log only part of token for security
        });
      } else {
        console.log('No token found for request:', config.url);
      }
      return config;
    } catch (error) {
      console.error('Error adding token to request:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      hasData: !!response.data
    });
    return response;
  },
  async (error: AxiosError) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    });
    
    if (error.response?.status === 401) {
      console.log('Unauthorized access, removing token');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
      cachedUserData = null;
    }
    return Promise.reject(error);
  }
);

// Helper function to store user data
const storeUserData = async (data: UserProfile) => {
  cachedUserData = data;
  await AsyncStorage.setItem('userData', JSON.stringify(data));
};

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/user/login', {
        email,
        password,
      });
      
      if (response.data.token) {
        // Store token without 'Bearer ' prefix
        await AsyncStorage.setItem('token', response.data.token);
        console.log('Token stored successfully');
        
        // Create profile data from login response
        const profileData: UserProfile = {
          username: response.data.username || 'User',
          email: response.data.email || '',
          level: response.data.level || 1,
          mining_rate: response.data.mining_rate || 1.0,
          coins: []
        };
        
        // Store the data
        await storeUserData(profileData);
        
        return {
          ...response.data,
          profile: profileData
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/user/register', {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
};

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      // First try to get cached data from AsyncStorage
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData) as UserProfile;
        cachedUserData = parsedData;
        return parsedData;
      }

      // If no cached data, try API
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching profile with token:', token.substring(0, 10) + '...');
      const response = await api.get('/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Profile response:', response.data);
      
      const profileData: UserProfile = {
        username: response.data.username || 'User',
        email: response.data.email || '',
        level: response.data.level || 1,
        mining_rate: response.data.mining_rate || 1.0,
        coins: response.data.coins || []
      };
      
      // Update cache
      await storeUserData(profileData);
      return profileData;
      
    } catch (error) {
      console.error('Profile fetch error:', error);
      // If API fails, return cached data or default
      if (cachedUserData) {
        return cachedUserData;
      }
      
      // If no cached data, return default
      const defaultProfile: UserProfile = {
        username: 'User',
        email: '',
        level: 1,
        mining_rate: 1.0,
        coins: []
      };
      
      // Store the default profile
      await storeUserData(defaultProfile);
      return defaultProfile;
    }
  },

  updateProfile: async (username: string, email: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.put('/user/update', {
        username,
        email,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update cached data
      if (cachedUserData) {
        const updatedData: UserProfile = {
          ...cachedUserData,
          username,
          email,
        };
        await storeUserData(updatedData);
      }
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  deleteAccount: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.delete('/user/delete', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
      cachedUserData = null;
      return response.data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },
};

export const walletService = {
  getWallet: async () => {
    // Temporarily return empty wallet until backend is ready
    return {
      coins: []
    };
  },

  transferCoins: async (fromCoin: string, toCoin: string, amount: number, receiverId: number) => {
    // Temporarily throw error until backend is ready
    throw new Error('Wallet system is currently under maintenance. Please try again later.');
  },

  addBalance: async (userId: number, coinSymbol: string, amount: number) => {
    // Temporarily throw error until backend is ready
    throw new Error('Wallet system is currently under maintenance. Please try again later.');
  },
};

export const miningService = {
  startMining: async (coinSymbol: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Format the request body with coin symbol
      const requestBody = {
        coinSymbol: coinSymbol,
        duration: "5",
        startTime: new Date().toISOString()
      };

      console.log('Starting mining with request:', requestBody);

      const response = await api.post('/mining/start', requestBody, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Mining start response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Start mining error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
  
      if (error.response?.data?.message?.includes('foreign key constraint')) {
        throw new Error('Invalid coin symbol. Please select a valid coin.');
      }
      
      throw error;
    }
  },

  stopMining: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Stopping mining...');
      const response = await api.post('/mining/stop', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Mining stop response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Stop mining error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  getMiningStatus: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Getting mining status...');
      const response = await api.get('/mining/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Mining status response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get mining status error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }
};

export const referralService = {
  generateCode: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.post('/referral/generate', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Generate referral code error:', error);
      throw error;
    }
  },

  acceptReferral: async (code: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.get(`/referral/${code}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Accept referral error:', error);
      throw error;
    }
  }
};

export const upgradeService = {
  getUpgradePrice: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.get('/upgrade/price', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Get upgrade price error:', error);
      throw error;
    }
  },

  upgrade: async (paymentCoin: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.post('/upgrade', {
        paymentCoin
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Upgrade error:', error);
      throw error;
    }
  }
};

export default api; 