import React from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Typography, Button } from '@mui/material';
import { useUserContext } from '../Context/UserContext'; // Importing the context to access transaction details
import { useTonConnectUI } from '@tonconnect/ui-react'; // Import TON Connect for wallet disconnect
import { Navigate } from 'react-router-dom';


const Sidebar = ({ setTabIndex, tabIndex,  }) => {
  const { setTransactionDetails, userFriendlyAddress } = useUserContext();
  const [tonConnectUI] = useTonConnectUI();


  // Logout handler
  const handleLogout = () => {
    if (userFriendlyAddress) {
      try {
        setTransactionDetails([]); // Clear transaction details
        tonConnectUI.disconnect(); // Disconnect the TON wallet
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
    }

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Premium Dashboard</Typography>
      </Box>
      <List>
        {/* Signals Tab */}
        <ListItem
          onClick={() => setTabIndex(0)}
          sx={{
            '&:hover': {
              backgroundColor: '#f0f0f0',
              cursor: 'pointer',
            },
            backgroundColor: tabIndex === 0 ? '#1976d2' : 'transparent', // Active tab color
            color: tabIndex === 0 ? 'white' : 'inherit', // Text color when active
          }}
        >
          <ListItemText primary="Signals" />
        </ListItem>

        {/* Premium Info Tab */}
        <ListItem
          onClick={() => setTabIndex(1)}
          sx={{
            '&:hover': {
              backgroundColor: '#f0f0f0',
              cursor: 'pointer',
            },
            backgroundColor: tabIndex === 1 ? '#1976d2' : 'transparent', // Active tab color
            color: tabIndex === 1 ? 'white' : 'inherit', // Text color when active
          }}
        >
          <ListItemText  primary="Premium Info" />
        </ListItem>

        {/* Support Info Tab */}
        <ListItem
          onClick={() => setTabIndex(2)}
          sx={{
            '&:hover': {
              backgroundColor: '#f0f0f0',
              cursor: 'pointer',
            },
            backgroundColor: tabIndex === 2 ? '#1976d2' : 'transparent', // Active tab color
            color: tabIndex === 2 ? 'white' : 'inherit', // Text color when active
          }}
        >
          <ListItemText  primary="Support" />
        </ListItem>
      </List>


      {/* Logout Button at the bottom */}
      <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <Button
          onClick={handleLogout}
          sx={{
            width: '100%',
            backgroundColor: '#d32f2f',
            color: 'white',
            '&:hover': { backgroundColor: '#c62828' },
            padding: '12px 0',
            borderRadius: '8px',
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
