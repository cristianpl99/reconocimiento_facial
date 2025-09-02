import React, { useState } from "react";
import { CameraFeed } from "./CameraFeed";
import { Spinner } from "./Spinner";
import iconoOjoVisor from "../assets/icono-ojo-visor.png";
import iconoPyme from "../assets/icono-pyme.png";

export const Desktop = () => {
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleActivateRecognition = () => {
    if (!isRecognitionActive) {
      setIsRecognitionActive(true);
      setTimeout(() => {
        setIsRecognitionActive(false);
      }, 5000);
    }
  };

  const handleLogin = () => {
    if (username === "cristian" && password === "123") {
      alert("Ingreso Exitoso");
    } else {
      alert("Usuario y/o contraseña invalido");
    }
  };

  const handleHelp = () => {
    console.log("Opening help");
  };

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
            <button
              onClick={handleLogin}
              className="w-full md:w-auto h-12 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              aria-label="Ingresar"
            >
              Ingresar
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
        <section
          className="w-full max-w-2xl mx-auto flex flex-col items-center text-center mt-16 md:mt-24"
          aria-labelledby="facial-recognition-title"
        >
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-6"></div>
          <h1
            id="facial-recognition-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-12"
          >
            Acceso por Reconocimiento Facial
          </h1>
          <div className="w-full max-w-lg h-72 bg-gray-200 rounded-lg mb-8 flex items-center justify-center overflow-hidden">
            {isRecognitionActive ? (
              <CameraFeed />
            ) : (
              <img src={iconoOjoVisor} alt="Visor de cámara" className="w-24 h-24" />
            )}
          </div>
          <button
            onClick={handleActivateRecognition}
            className={`w-full max-w-xs px-8 py-4 rounded-lg text-white font-bold text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center ${
              isRecognitionActive
                ? "bg-green-500 hover:bg-green-600 focus:ring-green-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
            }`}
            aria-pressed={isRecognitionActive}
            disabled={isRecognitionActive}
            aria-label={
              isRecognitionActive
                ? "Reconocimiento en curso"
                : "Activar reconocimiento facial"
            }
          >
            {isRecognitionActive ? (
              <>
                <Spinner />
                <span>Reconocimiento Activo</span>
              </>
            ) : (
              <span>Activar Reconocimiento</span>
            )}
          </button>
        </section>
      </div>
    </main>
  );
};
