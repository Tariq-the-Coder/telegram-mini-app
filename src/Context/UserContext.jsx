import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import axios from 'axios';
const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [transactionDetails, setTransactionDetails] = useState([]);
  const userFriendlyAddress = useTonAddress();

// console.log(userFriendlyAddress);

//  Fetch Transactions
const fetchPendingTransactions = useCallback(async () => {
  try {
    console.log("Fetching for User Address:", userFriendlyAddress);
    if (!userFriendlyAddress) return;

    const response = await axios.get(
      `https://tg-app-backend.onrender.com/api/payments/getPendingTransactions?address=${userFriendlyAddress}`
    );

    const pendingTransactions = response.data.pendingTransactions;

    console.log("API Response:", pendingTransactions);

    if (pendingTransactions && pendingTransactions.length > 0) {
      setTransactionDetails((prevDetails) => {
        // Combine and sort transactions by txsendtime (latest first)
        const combinedTransactions = [
          ...pendingTransactions,
          ...prevDetails.filter(
            (tx) =>
              !pendingTransactions.some((ptx) => ptx.msg_hash === tx.msg_hash)
          ),
        ];

        return combinedTransactions.sort(
          (a, b) => new Date(b.txsendtime) - new Date(a.txsendtime)
        );
      });
    }
  } catch (error) {
    console.error("Failed to fetch pending transactions:", error);
  }
});

useEffect(() => {
  if (userFriendlyAddress) {
    fetchPendingTransactions();
  }
}, [userFriendlyAddress]);

  return (
    <UserContext.Provider value={{ transactionDetails, setTransactionDetails, fetchPendingTransactions, userFriendlyAddress }}>
      {children}
    </UserContext.Provider>
  );
};
