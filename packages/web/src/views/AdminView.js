import React, { useState, useEffect } from 'react';
import { CreateEmployeeForm } from '../components/CreateEmployeeForm';

export const AdminView = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const response = await fetch('https://face-api-latest.onrender.com/api/ingresos-egresos/');
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        setIngresos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, []);

  return (
    <section className="w-full mx-auto flex flex-col md:flex-row items-start justify-center gap-8 mt-16 md:mt-24">
      {/* Left side: Create Employee Form */}
      <div className="w-full md:w-1/2">
        <CreateEmployeeForm />
      </div>

      {/* Right side: List of entries */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Ingresos y Egresos</h2>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <ul className="divide-y divide-gray-200">
            {ingresos.map(ingreso => (
              <li key={ingreso.id} className="py-4">
                <p><span className="font-semibold">ID Empleado:</span> {ingreso.empleado.id_empleado}</p>
                <p><span className="font-semibold">Ingreso:</span> {new Date(ingreso.ingreso).toLocaleString()}</p>
                <p><span className="font-semibold">Egreso:</span> {ingreso.egreso ? new Date(ingreso.egreso).toLocaleString() : 'N/A'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
