import { useState, useEffect } from 'react';
import { decodeJWT } from 'utils/cookies';

const useEmailVerified = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('refresh_token');

      if (token) {
        try {
          const decodedToken = decodeJWT(token);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decodedToken.exp && decodedToken.exp > currentTime) {
            console.log("Token is valid");
            setIsVerified(true);
          } else {
            console.log("Token expired");
            setIsVerified(false);
            localStorage.removeItem('refresh_token');
          }
        } catch (err) {
          console.error('Invalid token format', err);
          setError('Token decoding failed');
          setIsVerified(false);
        }
      } else {
        console.log("Token not found");
        setIsVerified(false);
      }
      setLoading(false); // Ensure loading is only set to false after checks are complete
    };

    checkToken();
  }, []);

  return { isVerified, loading, error };
};

export default useEmailVerified;
