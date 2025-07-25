// In MyModal.tsx
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

interface MyModalProps {
  show: boolean;
  handleClose: () => void;
}

const MyModal: React.FC<MyModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add a Class</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Enter your GitHub Repo Link to create a class
        <div className="input-group mb-3 mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="e.g. https://github.com/username/repo.git"

          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={handleClose}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyModal;
