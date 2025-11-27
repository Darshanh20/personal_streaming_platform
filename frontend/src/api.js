const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchData = async () => {
  try {
    const response = await fetch(`${API_URL}/data`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};
