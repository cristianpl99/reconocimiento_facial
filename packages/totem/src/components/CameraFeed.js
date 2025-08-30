import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

export const CameraFeed = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useImperativeHandle(ref, () => ({
    takeScreenshot: () => {
      if (!videoRef.current) return null;

      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      return canvas.toDataURL("image/png"); // devuelve en base64
    }
  }));

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setError("Permission to access camera was denied. Please allow camera access in your browser settings.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setError("No camera found. Please make sure a camera is connected and enabled.");
        } else {
          setError("An error occurred while accessing the camera. Please try again.");
        }
      }
    };

    getCameraStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  if (error) {
    return <div style={{ color: 'red', padding: '1rem' }}>{error}</div>;
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
});