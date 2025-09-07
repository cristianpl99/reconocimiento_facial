import React, { useState, useEffect } from 'react';
import recibo from '../assets/recibo.jpg';

export const OperarioView = ({ currentUser }) => {
  const [ingresos, setIngresos] = useState([]);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const response = await fetch('https://face-api-latest.onrender.com/api/ingresos-egresos/');
        const data = await response.json();
        if (currentUser) {
          const userIngresos = data.filter(ingreso => ingreso.empleado.id_empleado === currentUser.id_empleado);
          setIngresos(userIngresos);
        }
      } catch (error) {
        console.error("Error fetching ingresos:", error);
      }
    };

    fetchIngresos();
  }, [currentUser]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = recibo;
    link.download = 'recibo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full mx-auto flex flex-col md:flex-row items-start justify-center gap-8 mt-16 md:mt-24">
      {/* Left side: List of entries */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Mis Ingresos y Egresos</h2>
        <ul className="divide-y divide-gray-200">
          {ingresos.map(ingreso => (
            <li key={ingreso.id} className="py-4 flex justify-between">
              <div>
                <p className="font-semibold">Ingreso:</p>
                <p>{new Date(ingreso.ingreso).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold">Egreso:</p>
                <p>{ingreso.egreso ? new Date(ingreso.egreso).toLocaleString() : 'N/A'}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side: Image and download button */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Recibo de Sueldo</h2>
        <img src={recibo} alt="Recibo de sueldo" className="w-full h-auto rounded-lg mb-4" />
        <button
          onClick={handleDownload}
          className="h-12 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Descargar Recibo
        </button>
      </div>
    </section>
  );
};
