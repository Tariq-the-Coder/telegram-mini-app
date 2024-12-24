import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../Context/UserContext';
import { isUserPremium } from '../utils/premiumUtils';
import { CircularProgress, Box, Typography } from '@mui/material';

const RedirectIfPremium = ({ children }) => {
  const { transactionDetails } = useUserContext();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (transactionDetails && transactionDetails.length > 0) {
        const premiumTransaction = await isUserPremium(transactionDetails);
        if (premiumTransaction && premiumTransaction.expirationDate) {
          const expirationDate = new Date(premiumTransaction.expirationDate);
          setIsPremium(expirationDate > new Date()); // User has valid premium access
        } else {
          setIsPremium(false); // No valid premium transaction
        }
      } else {
        setIsPremium(false); // No transactions found
      }
      setTimeout(() => {
        setLoading(false);
        
      }, 800);
    };

    checkPremiumStatus();
  }, [transactionDetails]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Checking your subscription status...
        </Typography>
      </Box>
    );
  }

  if (isPremium) {
    return <Navigate to="/premium-dashboard" />;
  }

  return children;
};

export default RedirectIfPremium;
