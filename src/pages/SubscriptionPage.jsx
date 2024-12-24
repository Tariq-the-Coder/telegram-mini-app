import React, { useState, useEffect } from "react";
import { useUserContext } from '../Context/UserContext'; // Import UserContext
import { Button, Container, Card, Row, Col } from "react-bootstrap";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; //
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";

const SubscriptionPage = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [loadingState, setLoadingState] = useState({
    day: false,
    week: false,
    month: false,
  });
  const [statusLoadingState, setStatusLoadingState] = useState({});
  const { transactionDetails, setTransactionDetails, fetchPendingTransactions } = useUserContext(); // Use the context here
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userFriendlyAddress = useTonAddress();
  const navigate = useNavigate(); 
  const backendurl= "https://tg-app-backend.onrender.com";

  useEffect(() => {
    if (userFriendlyAddress) {
      setIsLoggedIn(true);
    }
  }, [userFriendlyAddress]);

  // console.log(tonConnectUI);
  

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const notifyWarning = (message) => toast.warning(message);

  const handleLogin = async () => {
    try {
      await tonConnectUI.connectWallet();
      notifySuccess("Logged in successfully!");
    } catch (error) {
      console.error("Login failed:", error);
      notifyError("Login failed. Please try again.");
    }
  };

  const handleLogout = () => {
    try {
      setTransactionDetails([])
      tonConnectUI.disconnect();
      setIsLoggedIn(false);
      notifySuccess("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      notifyError("Logout failed. Please try again.");
    }
  };
 

  // Handle Send Transaction
  const handleSubscription = async (tier) => {
    setLoadingState((prevState) => ({
      ...prevState,
      [tier]: true,
    }));

    try {
      const amount =
        tier === "day"
          ? "10000000"
          : tier === "week"
          ? "400000000"
          : "1000000000";

      // Transaction initiation
      const response = await tonConnectUI.sendTransaction({
        messages: [
          {
            address: "UQBcd-RqNKrlQhUECVWDodvQj1qFpW13wSa2GF73wPxYHc6v",
            amount: amount,
            payload: "",
          },
        ],
        validUntil: Math.floor(Date.now() / 1000) + 300,
      });

      const boc = response.boc;
      if (!boc)
        throw new Error("Transaction failed: No response (boc) received.");

      const msgHashResponse = await axios.post(
        "https://testnet.toncenter.com/api/v2/sendBocReturnHash",
        { boc: boc }, {
          headers: { 
            accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-KEY': "c1cdff35eaf5028f4f735974d989e7553ee20b30bdf7523b450a22e54b9bc94e"
           },
        }
      );

      const msgHash = msgHashResponse.data.result.hash;
      const newTransaction = {
        userAddress: userFriendlyAddress,
        subscriptionType: tier,
        amount: amount,
        txsendtime: new Date().toISOString(),
        boc: boc,
        msg_hash: msgHash,
        status: "Pending",
      };

      const res = await axios.post(
        `${backendurl}/api/payments/saveTransaction`,
        newTransaction,
        {
          headers: { 
            accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-KEY': "c1cdff35eaf5028f4f735974d989e7553ee20b30bdf7523b450a22e54b9bc94e"
           },
        }
      );

      if (res.data.success) {
        setTransactionDetails((prevDetails) => [
          newTransaction,
          ...prevDetails,
        ]);
        notifySuccess(
          "Transaction sent successfully! Waiting for confirmation."
        );
        // Fetch updated pending transactions
        fetchPendingTransactions();
      } else {
        localStorage.setItem(
          "pendingTransaction",
          JSON.stringify(newTransaction)
        );
        notifyWarning(
          "Transaction saved locally due to a backend error. We'll retry saving it after verification."
        );
      }
    } catch (error) {
      console.error("Error during transaction:", error);
      notifyError(
        error.message ||
          "An error occurred while processing the transaction. Please try again later."
      );
    } finally {
      setLoadingState((prevState) => ({
        ...prevState,
        [tier]: false,
      }));
    }
  };

  const verifyTransactionStatus = async (msg_hash) => {

    try{
      const response = await axios.get(
        `https://testnet.toncenter.com/api/v3/transactionsByMessage?msg_hash=${encodeURIComponent(msg_hash)}&direction=in`, 
        {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-KEY': "c1cdff35eaf5028f4f735974d989e7553ee20b30bdf7523b450a22e54b9bc94e"
            }
        }
    );

  
      const result = response.data;
      console.log("Transaction verification response:", result);
  
      if (result.transactions && result.transactions.length > 0) {
        const transaction = result.transactions[0];
  
        // Check confirmation status
        const isConfirmed =
          transaction.end_status === "active" &&
          transaction.description &&
          transaction.description.action &&
          transaction.description.action.success;
  
        const txHash = transaction.hash; // Extract the transaction hash
  
        if (isConfirmed) {
          console.log("Transaction is confirmed:", transaction);
          return { txHash, status: "Confirmed" }; // Return transaction hash and status
        } else {
          console.log("Transaction found but not yet confirmed.");
          return { txHash, status: "Pending" }; // Still pending
        }
      } else {
        console.error("No transaction details found.");
        return { txHash: null, status: "Not Found" };
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
      return { txHash: null, status: "Error" };
    }
  };

  const checkTransactionStatus = async (msg_hash) => {
    // Set loading state for the specific transaction
    setStatusLoadingState((prevState) => ({
      ...prevState,
      [msg_hash]: true, // Mark this transaction as loading
    }));

    console.log("Checking status for transaction:", msg_hash);

    // Call the function to verify the transaction status
    const { txHash, status } = await verifyTransactionStatus(msg_hash);

    console.log("txHash:", txHash);
    console.log("status:", status);

    if (txHash) {
      setTransactionDetails((prevDetails) => {
        const updatedTransactions = prevDetails.map((txn) => {
          if (txn.msg_hash === msg_hash) {
            return {
              ...txn,
              tx_hash: txHash,
              status: status, // Update status
            };
          }
          return txn;
        });
        return updatedTransactions;
      });

      // Send the updated data to the backend using axios
      const updateData = {
        userAddress: userFriendlyAddress, // Assuming msg_hash is unique to the user and serves as userAddress
        msg_hash: msg_hash, // Assuming msg_hash is unique to the user and serves as userAddress
        status: status,
        tx_hash: txHash,
      };

      console.log("Sending updateData to backend:", updateData); // Log the data being sent

      try {
        // Make the API call to update transaction status
        const backendResponse = await axios.post(
          `${backendurl}/api/payments/check-status`,
          updateData
        );

        if (backendResponse.data.success) {
          notifySuccess(
            `Transaction Updated:\nHash: ${txHash}\nStatus: ${status}`
          );
         await fetchPendingTransactions()
          navigate('/premium-dashboard');
        } else {
          notifyWarning("Failed to update transaction status.");
        }
      } catch (error) {
        console.error("Error updating transaction status:", error);
        notifyWarning(
          "An error occurred while updating the transaction status."
        );
      }
    } else {
      notifyWarning("Transaction not found or still pending.");
    }

    // Reset the loading state for the transaction after checking
    setStatusLoadingState((prevState) => ({
      ...prevState,
      [msg_hash]: false, // Mark this transaction as no longer loading
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert the ISO string to a Date object
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Specify the format
    return date.toLocaleDateString('en-US', options); // Format the date as 'Month Day, Year'
  };
  return (
    <Container className="mt-5">
  <ToastContainer position="top-right" autoClose={3000} />
  <Card className="shadow">
    <Card.Header className="bg-primary text-white text-center">
      <h2>Premium Plans</h2>
    </Card.Header>
    <Card.Body>
      {isLoggedIn ? (
        <div>
          <h5>Welcome, {userFriendlyAddress}</h5>
          <p>Select a subscription plan:</p>
          <Row className="text-center mb-4">
            <Col>
              <Button
                variant="primary"
                onClick={() => handleSubscription("day")}
                disabled={loadingState.day}
              >
                {loadingState.day ? (
                  <CircularProgress size={20} />
                ) : (
                  "0.01 TON - 1 Day"
                )}
              </Button>
            </Col>
            <Col>
              <Button
                variant="success"
                onClick={() => handleSubscription("week")}
                disabled={loadingState.week}
              >
                {loadingState.week ? (
                  <CircularProgress size={20} />
                ) : (
                  "0.4 TON - 7 Days"
                )}
              </Button>
            </Col>
            <Col>
              <Button
                variant="warning"
                onClick={() => handleSubscription("month")}
                disabled={loadingState.month}
              >
                {loadingState.month ? (
                  <CircularProgress size={20} />
                ) : (
                  "1 TON - 1 Month"
                )}
              </Button>
            </Col>
          </Row>
          <Button variant="danger" className="w-100" onClick={handleLogout}>
            Logout
          </Button>
          <div className="mt-4">
            <h5>Transaction History:</h5>
            {transactionDetails.length === 0 ? (
              <p>No transactions found.</p>
            ) : (
              transactionDetails.map((tx, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
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
                        {tx.status || 'Pending'}
                      </div>
                      <p>
                        <strong>Status:</strong> {tx.status || "Pending"}
                      </p>
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
                        <p>
                          <strong>Message Hash:</strong> {tx.msg_hash}
                        </p>
                      )}
                      <p>
                        <strong>Subscription Type:</strong>{" "}
                        {tx.subscriptionType}
                      </p>
                      <p>
                        <strong>Amount:</strong> {tx.amount / 1000000000} TON
                      </p>
                      {tx.expirationDate && (
                        <p>
                          <strong>ExpirationDate: </strong>
                          {formatDate(tx.expirationDate)}
                        </p>
                      )}
                      {/* Only show Check Status button if status is Pending */}
                      {tx.status === "Pending" && (
                        <Button
                          variant="info"
                          onClick={() => checkTransactionStatus(tx.msg_hash)}
                          disabled={statusLoadingState[tx.msg_hash]}
                        >
                          {statusLoadingState[tx.msg_hash] ? (
                            <CircularProgress size={20} />
                          ) : (
                            "Check Status"
                          )}
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p>Please log in to access your dashboard.</p>
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </div>
      )}
    </Card.Body>
  </Card>
</Container>

  

  
  );
};

export default SubscriptionPage;
