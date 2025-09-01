import React, { useState, useRef, useEffect } from "react";
import { CameraFeed } from "./CameraFeed";
import { Spinner } from "./Spinner";
import { startFaceIdentification } from "../services/faceRecognitionService";
import iconoOjo from "../assets/icono-ojo.png";
import fondoMetal from "../assets/fondo-metal.png";
import iconoOjoVisor from "../assets/icono-ojo-visor.png";

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

const FailIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

export const TarjetaAcceso = () => {
  const [status, setStatus] = useState('idle'); // idle, recognizing, verified, failed, clientError
  const [resultData, setResultData] = useState(null);
  const [lastFrame, setLastFrame] = useState(null);
  const cameraRef = useRef();

  useEffect(() => {
    if (status === 'verified' || status === 'failed' || status === 'clientError') {
      const timer = setTimeout(() => {
        setStatus('idle');
      }, 6000); // Revert to idle after 6 seconds

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
  let buttonClasses = "w-full h-16 text-xl font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-150 flex items-center justify-center";

  if (isFeedbackState) {
    if (status === 'verified') {
      buttonText = (
        <>
          <CheckIcon className="w-6 h-6 mr-2" />
          <span>Acceso Concedido</span>
        </>
      );
      buttonClasses += " bg-green-500 text-white cursor-not-allowed border-b-4 border-green-700";
    } else if (status === 'failed' || status === 'clientError') {
      buttonText = (
        <>
          <FailIcon className="w-6 h-6 mr-2" />
          <span>Reconocimiento Invalido</span>
        </>
      );
      buttonClasses += " bg-red-500 text-white cursor-not-allowed border-b-4 border-red-700";
    }
  } else if (isRecognitionActive) {
    buttonText = (
      <>
        <Spinner />
        <span>Reconociendo...</span>
      </>
    );
    buttonClasses += " bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-not-allowed border-b-4 border-red-800";
  } else { // idle
    buttonText = "Activar Reconocimiento";
    buttonClasses += " bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-600 border-b-4 border-blue-700 active:translate-y-1 active:border-b-0";
  }

  return (
    <main
      className="text-white flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${fondoMetal})` }}
    >
      <div className="relative pt-12"> {/* Wrapper for positioning icon */}
        <img
          src={iconoOjo}
          alt="Icono de reconocimiento facial"
          className="w-24 h-24 absolute top-0 left-1/2 -translate-x-1/2 z-20"
        />
        <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl bg-gray-900 rounded-3xl border border-gray-700 shadow-lg overflow-hidden" style={{ minHeight: '48rem' }}>
          {/* Background Layer */}
          {isFeedbackState && lastFrame && (
            <img src={lastFrame} alt="Fondo de reconocimiento" className="absolute inset-0 w-full h-full object-cover grayscale" />
          )}
          <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${isFeedbackState && lastFrame ? 'bg-opacity-60' : 'bg-opacity-0'}`}></div>

          {/* Content Layer */}
          <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center h-full">
            {/* Top Content: This will hold the title and camera view. We add pt-12 to push it down from the top of the card to clear the icon */}
            <div className="w-full pt-12">
              {isFeedbackState ? (
                <div className="animate-pop-in flex items-center justify-center" style={{height: '24rem'}}>
                  {status === 'verified' && (
                    <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center bg-opacity-90">
                      <CheckIcon className="w-24 h-24 text-white" />
                    </div>
                  )}
                  {(status === 'failed' || status === 'clientError') && (
                    <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center bg-opacity-90">
                      <FailIcon className="w-24 h-24 text-white" />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold mb-8">
                    Acceso por Reconocimiento Facial
                  </h1>
                  {status === 'idle' && (
                    <p className="text-gray-400 text-sm mb-4">Por favor, mire a la cámara</p>
                  )}
                  <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                    {isRecognitionActive ? <CameraFeed ref={cameraRef} /> : <img src={iconoOjoVisor} alt="Visor de cámara" className="w-48 h-48 animate-pulse-opacity" />}
                  </div>
                </>
              )}
            </div>

            {/* Spacer to push bottom content down */}
            <div className="flex-grow"></div>

            {/* Bottom Content Group */}
            <div className="w-full max-w-sm">
              <div className="h-16 mb-4">
                <button
                  className={buttonClasses}
                  onClick={handleActivateRecognition}
                  disabled={status !== 'idle'}
                  type="button"
                >
                  {buttonText}
                </button>
              </div>
              <div className="mt-4 h-28">
                {status === 'verified' && resultData?.data?.empleado && (
                  <div className="bg-slate-800 border border-slate-600 rounded-xl w-full h-full p-4 flex flex-col justify-center items-center text-white animate-pop-in">
                    <p className="text-2xl font-bold">
                      {resultData.data.empleado.nombre}{" "}
                      {resultData.data.empleado.apellido}
                    </p>
                    <div className="mt-2 text-center text-slate-300 font-light">
                      <p>{resultData.data.empleado.cargo.nombre_cargo}</p>
                      <p>Turno: {resultData.data.empleado.turno.nombre_turno}</p>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="w-40 h-8 mt-6 text-sm font-bold rounded-xl text-white bg-blue-500 hover:bg-blue-600 border-b-4 border-blue-700 active:translate-y-1 active:border-b-0 transition-all duration-150"
                onClick={() => alert('El equipo de Mantenimiento ya fue avisado del problema.')}
              >
                Ayuda
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};