import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../Context/UserContext';
import { isUserPremium } from '../utils/premiumUtils';

const PrivateRoute = ({ children }) => {
  const { transactionDetails } = useUserContext();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        console.log('Checking premium status...');
        console.log('Transaction Details:', transactionDetails);
        const premiumTransaction = await isUserPremium(transactionDetails);
        console.log('Premium Transaction:', premiumTransaction);
  
        if (premiumTransaction && premiumTransaction.expirationDate) {
          const expirationDate = new Date(premiumTransaction.expirationDate);
          console.log('Expiration Date:', expirationDate);
          if (expirationDate > new Date()) {
            setIsPremium(true);
            console.log('User has valid premium access.');
          } else {
            setIsPremium(false);
            console.log('User subscription expired.');
          }
        } else {
          setIsPremium(false);
          console.log('No valid premium transaction.');
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      } finally {
        setLoading(false);
        console.log('Finished checking premium status.');
      }
    };
  
    checkPremiumStatus();
  }, [transactionDetails]);

  if (loading) {
    // Optional: Add a loading spinner or fallback UI here
    return <div>Loading...</div>;
  }

  if (!isPremium) {
    console.log('User is not premium or subscription expired. Redirecting to subscription page...');
    return <Navigate to="/" />;
  }

  console.log('User is premium. Access granted to premium content.');
  return children;
};

export default PrivateRoute;
