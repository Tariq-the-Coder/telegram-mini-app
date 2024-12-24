import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

const PremiumInfo = ({ transactionDetails, expirationDate }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  // Filter out only the completed and expired transactions
  const filteredTransactions = transactionDetails.filter(
    (tx) => tx.status === 'Confirmed' || tx.status === 'Expired'
  );

  return (
    <div className="mt-4">
      {/* Premium Information Card at the top */}
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={3} sx={{ width: '100%' }}>
          <Grid item xs={12} md={6}>
            <Card
              elevation={3}
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: 3,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',  // Ensuring equal height for both cards
              }}
            >
              <CardContent sx={{ padding: 3 }}>
                <Typography variant="h6" gutterBottom>Your Premium Info</Typography>
                <Typography variant="body1" color="textSecondary">
                  Premium status is valid until: <strong>{expirationDate ? formatDate(expirationDate) : 'Not Available'}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Enjoy uninterrupted access to premium features and stay updated with new content.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              elevation={3}
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: 3,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',  // Ensuring equal height for both cards
              }}
            >
              <CardContent sx={{ padding: 3 }}>
                <Typography variant="h6" gutterBottom>Benefits of Premium Access</Typography>
                <Typography variant="body2" color="textSecondary">
                  - Access to exclusive content.<br />
                  - Priority support.<br />
                  - Extended trial periods on new features.<br />
                  - And much more!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Transaction History */}
      <h5>Transaction History:</h5>
      {filteredTransactions.length === 0 ? (
        <p>No completed or expired transactions found.</p>
      ) : (
        filteredTransactions.map((tx, index) => (
          <Card key={index} className="mb-3" sx={{ boxShadow: 'none', borderRadius: 3 }}>
            <CardContent>
              <div style={{ position: 'relative' }}>
                {/* Status Label */}
                <div
                  className={`position-absolute top-0 end-0 badge ${
                    tx.status === 'Confirmed'
                      ? 'bg-success'
                      : tx.status === 'Expired'
                      ? 'bg-danger'
                      : 'bg-warning'
                  }`}
                  style={{ padding: '5px 10px', zIndex: 10 }}
                >
                  {tx.status}
                </div>
                <p><strong>Status:</strong> {tx.status}</p>
                {tx.tx_hash && (
                  <p>
                    <strong>Transaction Hash:</strong>
                    <a
                      href={`https://testnet.tonscan.org/tx/${tx.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on TONScan
                    </a>
                  </p>
                )}
                {tx.msg_hash && (
                  <p><strong>Message Hash:</strong> {tx.msg_hash}</p>
                )}
                <p><strong>Subscription Type:</strong> {tx.subscriptionType}</p>
                <p><strong>Amount:</strong> {tx.amount / 1000000000} TON</p>
                {tx.expirationDate && (
                  <p><strong>Expiration Date:</strong> {formatDate(tx.expirationDate)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default PremiumInfo;
