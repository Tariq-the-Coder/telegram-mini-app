import axios from "axios";
import BASE_URL from "../config";

// Create a subscription
export const createSubscription = async (userAddress, tier, msg_hash) => {
  const response = await axios.post(`${BASE_URL}/payments/create-subscription`, {
    userAddress,
    tier,
    msg_hash,
  });
  return response.data;
};

// Fetch trading calls
export const getTradingCalls = async () => {
  const response = await axios.get(`${BASE_URL}/admin/get-calls`);
  return response.data.calls;
};

// Add a new trading call (admin)
export const addTradingCall = async (title, description, callDetails, adminKey) => {
  const response = await axios.post(
    `${BASE_URL}/admin/add-call`,
    { title, description, callDetails },
    { headers: { adminKey } }
  );
  return response.data;
};
