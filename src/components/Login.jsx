import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Card } from "react-bootstrap";
import { useTonConnectUI } from "@tonconnect/ui-react";

const Login = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [adminCredentials, setAdminCredentials] = useState({ id: "", pass: "" });
  const navigate = useNavigate();

  const handleUserLogin = async () => {
    try {
      await tonConnectUI.connectWallet();
      navigate("/premium");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleAdminLogin = () => {
    const { id, pass } = adminCredentials;
    if (id === "admin" && pass === "admin123") {
      navigate("/admin");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <Card className="m-4 p-4">
      <h2>User Login</h2>
      <Button variant="primary" onClick={handleUserLogin}>
        Login with TON Wallet
      </Button>
      <hr />
      <h2>Admin Login</h2>
      <Form>
        <Form.Group controlId="adminId">
          <Form.Label>Admin ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Admin ID"
            onChange={(e) => setAdminCredentials({ ...adminCredentials, id: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="adminPass">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setAdminCredentials({ ...adminCredentials, pass: e.target.value })}
          />
        </Form.Group>
        <Button variant="danger" className="mt-3" onClick={handleAdminLogin}>
          Admin Login
        </Button>
      </Form>
    </Card>
  );
};

export default Login;
