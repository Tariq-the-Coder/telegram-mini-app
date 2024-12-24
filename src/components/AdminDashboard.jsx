import React, { useState } from "react";
import { Container, Button, Form, ListGroup } from "react-bootstrap";

const AdminDashboard = () => {
  const [tab, setTab] = useState("pending");

  const renderContent = () => {
    switch (tab) {
      case "pending":
        return <PendingTransactions />;
      case "createSignal":
        return <CreateSignal />;
      case "premiumUsers":
        return <PremiumUsers />;
      default:
        return <PendingTransactions />;
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex">
        <div className="sidebar">
          <ListGroup>
            <ListGroup.Item action onClick={() => setTab("pending")}>
              Pending Transactions
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => setTab("createSignal")}>
              Create Signal
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => setTab("premiumUsers")}>
              Premium Users
            </ListGroup.Item>
          </ListGroup>
        </div>
        <div className="content">{renderContent()}</div>
      </div>
    </Container>
  );
};

const PendingTransactions = () => <div>Pending Transactions Tab</div>;
const CreateSignal = () => <Form>{/* Signal creation form */}</Form>;
const PremiumUsers = () => <div>Premium Users List</div>;

export default AdminDashboard;
