import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Grid, Card, CardContent } from '@mui/material';
import Sidebar from '../components/Sidebar';
import { useUserContext } from '../Context/UserContext';
import { isUserPremium } from '../utils/premiumUtils';
import PremiumInfo from './PremiumInfo';

const PremiumDashboard = () => {
  const { transactionDetails } = useUserContext();
  const [expirationDate, setExpirationDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0); // Track the selected tab index

  useEffect(() => {
    const checkPremiumStatus = async () => {
      const premiumTransaction = await isUserPremium(transactionDetails);
      if (premiumTransaction && premiumTransaction.expirationDate) {
        setExpirationDate(new Date(premiumTransaction.expirationDate)); // Convert the expiration date to a Date object
      } else {
        console.log('No expiration date found or premiumExpiration is null');
        setExpirationDate(null); // Set to null if there's no valid expiration date
      }
      setLoading(false);
    };

    checkPremiumStatus();
  }, [transactionDetails]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#fafafa',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f4f6f9' }}>
      {/* Pass tabIndex and setTabIndex to Sidebar */}
      <Sidebar setTabIndex={setTabIndex} tabIndex={tabIndex} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 3 }}>
        {/* Expiration Date Box */}
        {expirationDate && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: '#e3f2fd',
              padding: '10px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Premium expires on: {expirationDate.toLocaleString()} {/* Format the Date */}
            </Typography>
          </Box>
        )}

        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 2 }}>
          {tabIndex === 0 && (
            <Box sx={{ padding: 2 }}>
              <Grid container spacing={3} sx={{ width: '100%' }}>
                {/* Demo Signal 1 */}
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ backgroundColor: '#ffffff', borderRadius: 3, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'all 0.3s ease', height: '100%' }}>
                    <CardContent sx={{ padding: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Demo Bitcoin Signal</Typography>
                        <Typography variant="body2" sx={{ color: '#ff9800' }}>BTC/USD</Typography>
                      </Box>
                      <Typography variant="body1" color="textSecondary" sx={{ marginTop: 1 }}>
                        <strong>Entry Price:</strong> $50,000
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        <strong>Target Price:</strong> $55,000
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        <strong>Stop Loss:</strong> $48,000
                      </Typography>
                      <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Signal Strength: <strong>High</strong></Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Active</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Demo Signal 2 */}
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ backgroundColor: '#ffffff', borderRadius: 3, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', transition: 'all 0.3s ease', height: '100%' }}>
                    <CardContent sx={{ padding: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Demo Ethereum Signal</Typography>
                        <Typography variant="body2" sx={{ color: '#ff9800' }}>ETH/USD</Typography>
                      </Box>
                      <Typography variant="body1" color="textSecondary" sx={{ marginTop: 1 }}>
                        <strong>Entry Price:</strong> $4,000
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        <strong>Target Price:</strong> $4,500
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        <strong>Stop Loss:</strong> $3,800
                      </Typography>
                      <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Signal Strength: <strong>Medium</strong></Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Active</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {tabIndex === 1 && (
            <Box sx={{ padding: 2 }}>
              <PremiumInfo transactionDetails={transactionDetails} expirationDate={expirationDate} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PremiumDashboard;
