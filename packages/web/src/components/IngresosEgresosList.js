import React, { useState, useEffect } from 'react';

export const IngresosEgresosList = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingresosResponse, empleadosResponse] = await Promise.all([
          fetch('https://face-api-latest.onrender.com/api/ingresos-egresos/'),
          fetch('https://face-api-latest.onrender.com/api/empleados/')
        ]);

        if (!ingresosResponse.ok || !empleadosResponse.ok) {
          throw new Error('Error al obtener los datos');
        }

        const ingresosData = await ingresosResponse.json();
        const empleadosData = await empleadosResponse.json();

        const empleadosMap = new Map(empleadosData.map(emp => [emp.id_empleado, emp]));

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

        setIngresos(mergedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg flex flex-col">
      <h2 className="text-2xl font-bold mb-4 flex-shrink-0">Ingresos y Egresos</h2>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
          <table id="ingresos-table" className="w-full text-left table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">ID Empleado</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Departamento</th>
                <th className="px-4 py-2">Ingreso</th>
                <th className="px-4 py-2">Egreso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ingresos.map(ingreso => (
                <tr key={ingreso.id}>
                  <td className="px-4 py-2">{ingreso.empleado.id_empleado}</td>
                  <td className="px-4 py-2">{ingreso.empleado.nombre} {ingreso.empleado.apellido}</td>
                  <td className="px-4 py-2">{ingreso.empleado.departamento.nombre_departamento}</td>
                  <td className="px-4 py-2">{new Date(ingreso.ingreso).toLocaleString()}</td>
                  <td className="px-4 py-2">{ingreso.egreso ? new Date(ingreso.egreso).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
