import React, { useState, useEffect } from 'react';
import { CreateEmployeeForm } from '../components/CreateEmployeeForm';

export const AdminView = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("AdminView: useEffect triggered");
    const fetchData = async () => {
      try {
        console.log("AdminView: Fetching data...");
        const [ingresosResponse, empleadosResponse] = await Promise.all([
          fetch('https://face-api-latest.onrender.com/api/ingresos-egresos/'),
          fetch('https://face-api-latest.onrender.com/api/empleados/')
        ]);

        if (!ingresosResponse.ok || !empleadosResponse.ok) {
          throw new Error('Error al obtener los datos');
        }

        const ingresosData = await ingresosResponse.json();
        console.log("AdminView: Ingresos Data received:", ingresosData);
        const empleadosData = await empleadosResponse.json();
        console.log("AdminView: Empleados Data received:", empleadosData);

        const empleadosMap = new Map(empleadosData.map(emp => [emp.id_empleado, emp]));
        console.log("AdminView: Empleados Map created:", empleadosMap);

        const mergedData = ingresosData.map(ingreso => {
          const empleadoDetails = empleadosMap.get(ingreso.empleado.id_empleado);
          return {
            ...ingreso,
            empleado: {
              ...ingreso.empleado,
              ...empleadoDetails
            }
          };
        });
        console.log("AdminView: Merged Data created:", mergedData);

        setIngresos(mergedData);
      } catch (error) {
        console.error("AdminView: Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("Rendering AdminView");
  return (
    <section className="w-full mx-auto flex flex-col md:flex-row items-stretch justify-center gap-8 mt-16 md:mt-24">
      {/* Left side: Create Employee Form */}
      <div className="w-full md:w-1/2 flex-1">
        <CreateEmployeeForm />
      </div>

      {/* Right side: List of entries */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg flex flex-col flex-1">
        <h2 className="text-2xl font-bold mb-4 flex-shrink-0">Ingresos y Egresos</h2>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-y-auto flex-grow">
            <ul className="divide-y divide-gray-200">
              {ingresos.map(ingreso => (
                <li key={ingreso.id} className="py-4">
                  <p><span className="font-semibold">ID Empleado:</span> {ingreso.empleado.id_empleado}</p>
                  <p><span className="font-semibold">Nombre:</span> {ingreso.empleado.nombre} {ingreso.empleado.apellido}</p>
                  <p><span className="font-semibold">Departamento:</span> {ingreso.empleado.departamento.nombre_departamento}</p>
                  <p><span className="font-semibold">Ingreso:</span> {new Date(ingreso.ingreso).toLocaleString()}</p>
                  <p><span className="font-semibold">Egreso:</span> {ingreso.egreso ? new Date(ingreso.egreso).toLocaleString() : 'N/A'}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
