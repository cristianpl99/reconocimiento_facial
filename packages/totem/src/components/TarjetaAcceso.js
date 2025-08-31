import React, { useState, useRef, useEffect } from "react";
import { CameraFeed } from "./CameraFeed";
import { Spinner } from "./Spinner";
import { startFaceIdentification } from "../services/faceRecognitionService";
import iconoOjo from "../assets/icono-ojo.png";
import fondoMetal from "../assets/fondo-metal.png";
import iconoOjoVisor from "../assets/icono-ojo-visor.png";

export const TarjetaAcceso = () => {
  const [status, setStatus] = useState('idle'); // idle, recognizing, verified, failed, clientError
  const [resultData, setResultData] = useState(null);
  const [lastFrame, setLastFrame] = useState(null);
  const cameraRef = useRef();

  useEffect(() => {
    if (status === 'verified' || status === 'failed' || status === 'clientError') {
      const timer = setTimeout(() => {
        setStatus('idle');
      }, 4000); // Revert to idle after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleActivateRecognition = async () => {
    if (status !== 'idle') return;

    setLastFrame(null);
    setStatus('recognizing');
    setResultData(null);

    const result = await startFaceIdentification(cameraRef);

    setLastFrame(result.lastFrame);
    setResultData(result); // Store result data for all outcomes for debugging

    if (result.verified) {
      setStatus('verified');
    } else if (result.error === 'ClientError') {
      setStatus('clientError');
    } else {
      setStatus('failed'); // This will be for timeouts
    }
  };

  const isRecognitionActive = status === 'recognizing';
  const isFeedbackState = status === 'verified' || status === 'failed' || status === 'clientError';

  let buttonText;
  let buttonClasses = "w-full h-16 text-xl font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 flex items-center justify-center";

  if (isFeedbackState) {
    if (status === 'verified') {
      buttonText = "Identidad Verificada";
      buttonClasses += " bg-green-500 text-white cursor-not-allowed";
    } else if (status === 'failed') {
      buttonText = "Identidad No Verificada";
      buttonClasses += " bg-orange-500 text-white cursor-not-allowed";
    } else { // clientError
      buttonText = "Error de Petición";
      buttonClasses += " bg-red-700 text-white cursor-not-allowed";
    }
  } else if (isRecognitionActive) {
    buttonText = (
      <>
        <Spinner />
        <span>Reconociendo...</span>
      </>
    );
    buttonClasses += " bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-not-allowed";
  } else { // idle
    buttonText = "Activar Reconocimiento";
    buttonClasses += " bg-blue-600 hover:bg-blue-700 focus:ring-blue-600";
  }

  return (
    <main
      className="text-white flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${fondoMetal})` }}
    >
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-gray-900 rounded-3xl border border-gray-700 shadow-lg p-6 sm:p-8 flex flex-col items-center text-center">
        <img
          src={iconoOjo}
          alt="Icono de reconocimiento facial"
          className="w-32 h-32 mb-6"
        />
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          Acceso por Reconocimiento Facial
        </h1>
        <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-800 rounded-xl mb-8 flex items-center justify-center overflow-hidden">
          {(() => {
            if (isRecognitionActive) {
              return <CameraFeed ref={cameraRef} />;
            }
            if (isFeedbackState && lastFrame) {
              return <img src={lastFrame} alt="Último fotograma capturado" className="w-full h-full object-cover" />;
            }
            return <img src={iconoOjoVisor} alt="Visor de cámara" className="w-48 h-48" />;
          })()}
        </div>
        <div className="w-full max-w-sm mb-8">
          <button
            className={buttonClasses}
            onClick={handleActivateRecognition}
            disabled={status !== 'idle'}
            type="button"
          >
            {buttonText}
          </button>
        </div>
        <div className="w-full max-w-md mt-4 h-28">
          {resultData && (
            <div className="bg-gray-700 p-2 rounded-xl w-full h-full text-left overflow-auto">
              <h2 className="font-bold text-sm text-white">Respuesta del Backend:</h2>
              <pre className="text-xs text-white whitespace-pre-wrap">
                {JSON.stringify(resultData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};