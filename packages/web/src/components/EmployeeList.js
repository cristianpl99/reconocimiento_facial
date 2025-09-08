import React, { useState, useEffect } from 'react';
import { getAllEmployees } from '../services/employeeService';
import Swal from 'sweetalert2';

export const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getAllEmployees();
        setEmployees(data);
      } catch (error) {
        setError(error.message);
        Swal.fire('Error', 'No se pudo cargar la lista de empleados.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg flex flex-col">
      <h2 className="text-2xl font-bold mb-4 flex-shrink-0">Listado de Empleados</h2>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="overflow-y-auto overflow-x-auto" style={{ maxHeight: '500px' }}>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Nombre</th>
                <th className="py-2 px-4 border-b">Apellido</th>
                <th className="py-2 px-4 border-b">Departamento</th>
                <th className="py-2 px-4 border-b">Cargo</th>
                <th className="py-2 px-4 border-b">Turno</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="py-2 px-4 border-b">{employee.nombre}</td>
                  <td className="py-2 px-4 border-b">{employee.apellido}</td>
                  <td className="py-2 px-4 border-b">{employee.departamento.nombre_departamento}</td>
                  <td className="py-2 px-4 border-b">{employee.cargo.nombre_cargo}</td>
                  <td className="py-2 px-4 border-b">{employee.turno.nombre_turno}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
