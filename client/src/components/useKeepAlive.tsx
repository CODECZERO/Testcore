// src/hooks/useKeepAlive.ts
import { useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/api.config';

const PING_INTERVAL = 6000; // 6 seconds in milliseconds

export const useKeepAlive = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const pingBackend = async () => {
      try {
        // Using fetch directly for health check to avoid apiClient overhead
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        if (response.ok) {
          console.log('Backend ping successful');
        }
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
