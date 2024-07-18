"use client";
import React, { useState, useEffect } from 'react';

interface ToastNotificationProps {
  visible: boolean;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ visible, onClose }) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (visible) {
      timeoutId = setTimeout(() => {
        onClose();
      }, 4000);
    }

    return () => clearTimeout(timeoutId);
  }, [visible, onClose]);

  return (
    <>
      {visible && (
        <div
          id="toast"
          style={{
          }}
        >
          <div className="container-1" style={{ alignSelf: 'center' }}>
            <i className="fas fa-check-square" style={{ fontSize: '40px', color: '#545CEB' }}></i>
          </div>
          <div className="container-2">
            <p style={{ color: '#545CEB', fontWeight: 600, fontSize: '16px' }}>Success</p>
            <p style={{ fontSize: '12px', color: '#545CEB', fontWeight: 400 }}>
              You will be notified when the scan is done
            </p>
          </div>
          <button
            id="close"
            onClick={onClose}
            style={{ alignSelf: 'flex-start', backgroundColor: 'transparent', fontSize: '25px', lineHeight: 0, color: '#656565' }}
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
};
// rgb(150, 121, 224)
export default ToastNotification;
