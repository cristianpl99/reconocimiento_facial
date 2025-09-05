import React, { useState, useRef, useEffect } from "react";
import { CameraFeed } from "./CameraFeed";
import { Spinner } from "./Spinner";
import { startFaceIdentification } from "../services/faceRecognitionService";
import iconoOjoVisor from "../assets/icono-ojo-visor.png";
import iconoPyme from "../assets/icono-pyme.png";
import mockProduccion from "../assets/mock_produccion.png";

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

import { loginUser } from "../services/authService";
import Swal from 'sweetalert2';

export const Desktop = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    setResultData(result);

    if (result.verified) {
      setStatus('verified');
    } else if (result.error === 'ClientError') {
      setStatus('clientError');
    } else {
      setStatus('failed');
    }
  };

  const resetState = () => {
    setUsername("");
    setPassword("");
    setIsLoggedIn(false);
    setStatus('idle');
    setResultData(null);
    setLastFrame(null);
  };

  const handleLogin = async () => {
    if (isLoggedIn) {
      resetState();
      return;
    }

    try {
      const user = await loginUser(username, password);

      if (!user) {
        Swal.fire({
          title: 'Error',
          text: 'Usuario y/o Contraseña Inválida',
          icon: 'error',
        });
        return;
      }

      Swal.fire({
        title: '¡Éxito!',
        text: 'Ingreso Exitoso',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      if (user.cargo && user.cargo.id_cargo === 1) {
        setIsLoggedIn(true);
      }
      // If cargo is not 1, do nothing else, as per the new flow.

    } catch (error) {
      console.error("Se produjo un error durante el inicio de sesión:", error);
      Swal.fire({
        title: 'Error',
        text: 'Error al intentar iniciar sesión. Por favor, inténtelo de nuevo.',
        icon: 'error',
      });
    }
  };

  const handleHelp = () => {
    console.log("Opening help");
  };

  const isRecognitionActive = status === 'recognizing';
  const isFeedbackState = status === 'verified' || status === 'failed' || status === 'clientError';

  let buttonText;
  let buttonClasses = "w-full max-w-xs px-8 py-4 rounded-lg text-white font-bold text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

  if (isFeedbackState) {
    if (status === 'verified') {
      buttonText = (
        <>
          <CheckIcon className="w-6 h-6 mr-2" />
          <span>Acceso Concedido</span>
        </>
      );
      buttonClasses += " bg-green-500 cursor-not-allowed";
    } else {
      buttonText = (
        <>
          <FailIcon className="w-6 h-6 mr-2" />
          <span>Reconocimiento Invalido</span>
        </>
      );
      buttonClasses += " bg-red-500 cursor-not-allowed";
    }
  } else if (isRecognitionActive) {
    buttonText = (
      <>
        <Spinner />
        <span>Reconociendo...</span>
      </>
    );
    buttonClasses += " bg-red-600 cursor-not-allowed";
  } else { // idle
    buttonText = "Activar Reconocimiento";
    buttonClasses += " bg-blue-600 hover:bg-blue-700 focus:ring-blue-600";
  }

  return (
    <main className="bg-hero bg-cover bg-center flex justify-center min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-screen-xl">
        <header className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mb-8">
          <div className="flex items-center gap-4">
            <img src={iconoPyme} alt="Icono PyME" className="w-16 h-16 md:w-24 md:h-24 rounded-full" />
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-bold">Foodlab</h1>
              <p className="text-sm md:text-base text-gray-600">PyME Alimenticia</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {!isLoggedIn && (
              <>
                <input
                  type="text"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </>
            )}
            <button
              onClick={handleLogin}
              className="w-full md:w-auto h-12 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              aria-label={isLoggedIn ? "Salir" : "Ingresar"}
            >
              {isLoggedIn ? "Salir" : "Ingresar"}
            </button>
            <button
              onClick={handleHelp}
              className="w-full md:w-auto h-12 px-6 bg-red-600 text-white font-bold text-lg rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              aria-label="Ayuda"
            >
              Ayuda
            </button>
          </div>
        </header>
        {isLoggedIn ? (
          <section className="w-full mx-auto flex flex-col items-center text-center mt-16 md:mt-24">
            <div className="w-full flex flex-row flex-wrap gap-4 justify-center">
              <button className="h-12 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 whitespace-nowrap">Desperdicio por tipo de producto</button>
              <button className="h-12 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 whitespace-nowrap">Producción por producto</button>
              <button className="h-12 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 whitespace-nowrap">Eficiencia por turno</button>
              <button className="h-12 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 whitespace-nowrap">Producción real vs. Objetivo diario</button>
            </div>
            <div className="w-full max-w-[1100px] mx-auto mt-8">
              <img src={mockProduccion} alt="Producción" className="w-full h-auto" />
            </div>
          </section>
        ) : (
          <section
            className="w-full max-w-2xl mx-auto flex flex-col items-center text-center mt-16 md:mt-24"
            aria-labelledby="facial-recognition-title"
          >
            <h1
              id="facial-recognition-title"
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-12"
            >
              Acceso por Reconocimiento Facial
            </h1>
            <div className="w-full max-w-lg h-72 bg-gray-200 rounded-lg mb-8 flex items-center justify-center overflow-hidden">
              {(() => {
                if (isRecognitionActive) {
                  return <CameraFeed ref={cameraRef} />;
                }
                if (isFeedbackState && lastFrame) {
                  return (
                    <div className="relative w-full h-full">
                      <img src={lastFrame} alt="Último fotograma capturado" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-20">
                        {status === 'verified' && (
                          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center bg-opacity-90">
                            <CheckIcon className="w-16 h-16 text-white" />
                          </div>
                        )}
                        {(status === 'failed' || status === 'clientError') && (
                          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center bg-opacity-90">
                            <FailIcon className="w-16 h-16 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return <img src={iconoOjoVisor} alt="Visor de cámara" className="w-24 h-24" />;
              })()}
            </div>
            <button
              onClick={handleActivateRecognition}
              className={buttonClasses}
              disabled={status !== 'idle'}
              aria-label={
                isRecognitionActive
                  ? "Reconocimiento en curso"
                  : "Activar reconocimiento facial"
              }
            >
              {buttonText}
            </button>

            <div className="w-full max-w-md mt-4 h-28">
              {status === 'verified' && resultData?.data?.empleado && (
                <div className="bg-gray-100 border border-gray-200 rounded-xl w-full h-full p-4 flex flex-col justify-center items-center text-gray-800">
                  <p className="text-xl font-bold">
                    {resultData.data.empleado.nombre}{" "}
                    {resultData.data.empleado.apellido}
                  </p>
                  <div className="mt-1 text-center text-gray-600">
                    <p>{resultData.data.empleado.cargo.nombre_cargo}</p>
                    <p>Turno: {resultData.data.empleado.turno.nombre_turno}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};
