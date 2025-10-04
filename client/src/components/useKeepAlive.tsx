// src/hooks/useKeepAlive.ts
import { useEffect, useRef } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://testcore-3en7.onrender.com';
const PING_INTERVAL = 6000; // 1 minute in milliseconds

export const useKeepAlive = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const pingBackend = async () => {
      try {
        await axios.get(`${BACKEND_URL}/health`, {
          timeout: 5000, // 5 second timeout
        });
        console.log('Backend ping successful');
      } catch (error) {
        console.error('Backend ping failed:', error);
      }
    };

    // Initial ping
    pingBackend();

    // Set up interval
    intervalRef.current = setInterval(pingBackend, PING_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
};
