import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          // Prefer back camera
          const backCamera = devices.find((device) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("environment")
          );
          const cameraId = backCamera ? backCamera.id : devices[0].id;

          html5QrCode
            .start(
              cameraId,
              {
                fps: 10,
                qrbox: { width: 300, height: 300 },
              },
              (decodedText) => {
                // Stop scanning and redirect
                html5QrCode.stop().then(() => html5QrCode.clear());

                try {
                  const url = new URL(decodedText); // Validate URL
                  window.location.href = url.href;   // Redirect
                } catch (err) {
                  alert(`Scanned content is not a valid link: ${decodedText}`);
                  navigate("/");
                }
              },
              (errorMessage) => {
                console.warn("Scan error:", errorMessage);
              }
            );
        }
      })
      .catch((err) => {
        alert("Camera access was denied or not available.");
        console.error("Camera error:", err);
        navigate("/");
      });

    // Cleanup on unmount
    return () => {
      html5QrCode.stop().then(() => html5QrCode.clear()).catch(() => {});
    };
  }, [navigate]);

  return (
    <>
    <button  style={{
    backgroundColor: 'rgb(40, 4, 99)',
    color: 'white',
    border: 'none',
    padding: '0px 10px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '10px',
    fontWeight: 500,
    fontSize: '1.0rem',
    marginLeft: '20px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
    marginBottom:"2px"
  }}
            onClick={() => {
               if (window.history.length > 1) {
                  navigate(-1);
                 } else {
                    navigate('/'); 
                  }
             }}>
                <div style={{fontSize:"12px", fontWeight:"800px"}}>Back</div>
          </button>
    <div
      id="reader"
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
      }}
    ></div>
    </>
  );
};

export default QRScanner;
