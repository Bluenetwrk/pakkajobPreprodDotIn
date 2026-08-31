import React from "react";

const Modal = ({ isOpen, onOk, onCancel }) => {
  if (!isOpen) return;

  return (
    <>
<div
        style={{
          width: '300px',
          padding: '20px',
          backgroundColor: 'rgb(40,4,99)',
          color: 'white',
          fontSize: '12px',
          borderRadius: '5px',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}        
        > 
      <p>Note: To keep PakkaJob free from fake employeers, please verify your business once using Google business profile.</p>
          <div style={{ marginTop: '15px', display:"flex", justifyContent:"center", gap:"5px" }}>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
              onClick={onOk}>
 Verify your buisness profile with Google

            </button>
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
    </>
  );
};

export default Modal;