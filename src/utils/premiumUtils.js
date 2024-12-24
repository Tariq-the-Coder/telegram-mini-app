const updateTransactionStatus = async (userAddress, status, expirationDate) => {
  try {
    const response = await fetch("https://tg-app-backend.onrender.com/api/payments/updateTransactionStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userAddress, status, expirationDate }),
    });

    const data = await response.json();
    console.log("Transaction updated:", data);
  } catch (error) {
    console.error("Error updating transaction status:", error);
  }
};


// check premium user with valid access  
export const isUserPremium = async (transactionDetails) => {
  if (!Array.isArray(transactionDetails) || transactionDetails.length === 0) {
    return null; // Ensure transactionDetails is valid and non-empty
  }

  // Find the most relevant premium transaction (confirmed and with expiration date)
  const premiumTransaction = transactionDetails.find(
    (tx) => tx.isPremium === true && tx.status === "Confirmed"
  );  

  // If there's a premium transaction, check its expiration date
  if (premiumTransaction) {
    const currentDate = new Date();
    const expirationDate = new Date(premiumTransaction.expirationDate);
    const userAddress = premiumTransaction.userAddress;

    if (expirationDate < currentDate) {
      // If the transaction is expired, update the status
      await updateTransactionStatus(userAddress, "Confirmed", premiumTransaction.expirationDate);
      return null;
    }

    // Return the expiration date if still valid
    return premiumTransaction;
  }

  return null;
};
