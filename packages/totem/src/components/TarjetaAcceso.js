import React, { useState, useRef } from "react";
import { CameraFeed } from "./CameraFeed";
import { Spinner } from "./Spinner";
import { sendFaceRecognition } from "../services/faceRecognitionService";
import iconoOjo from "../assets/icono-ojo.png";
import fondoMetal from "../assets/fondo-metal.png";
import iconoOjoVisor from "../assets/icono-ojo-visor.png";

export const TarjetaAcceso = () => {
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [result, setResult] = useState(null);
  const cameraRef = useRef();

  const handleActivateRecognition = async () => {
    if (!isRecognitionActive) {
      setIsRecognitionActive(true);
      try {
        // Esperamos un poquito a que la cámara prenda bien
        setTimeout(async () => {
          const screenshot = cameraRef.current.takeScreenshot();
          if (screenshot) {
            const response = await sendFaceRecognition(screenshot);
            setResult(response); // guardás lo que devuelve tu API
          }
          setIsRecognitionActive(false);
        }, 3000);
      } catch (error) {
        console.error("Error en reconocimiento:", error);
        setIsRecognitionActive(false);
      }
    }
  };

  const handleHelp = () => {
    console.log("Help requested");
  };

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
          {isRecognitionActive ? (
            <CameraFeed ref={cameraRef} />
          ) : (
            <img src={iconoOjoVisor} alt="Visor de cámara" className="w-48 h-48" />
          )}
        </div>
        <div className="w-full max-w-sm mb-8">
          <button
            className={`w-full h-16 text-xl font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 flex items-center justify-center ${
              isRecognitionActive
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
            }`}
            onClick={handleActivateRecognition}
            disabled={isRecognitionActive}
            type="button"
          >
            {isRecognitionActive ? (
              <>
                <Spinner />
                <span>Reconociendo...</span>
              </>
            ) : (
              <span>Activar Reconocimiento</span>
            )}
          </button>
        </div>
        {result && (
          <div className="bg-gray-700 p-4 rounded-xl w-full text-left">
            <h2 className="font-bold">Resultado:</h2>
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
        <div className="w-full max-w-xs mt-4">
          <button
            className="w-full h-14 bg-red-600 text-lg font-bold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
            onClick={handleHelp}
            type="button"
          >
            Ayuda
          </button>
        </div>
      </div>
    </main>
  );
};