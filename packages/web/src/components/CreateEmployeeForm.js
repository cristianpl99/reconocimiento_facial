import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createEmployee } from '../services/employeeService';

export const CreateEmployeeForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_contratacion: '',
    username: '',
    password: '',
    salario: '',
    departamento: 1,
    cargo: 1,
    turno: 1,
    imagen_base64: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // The result includes the 'data:image/jpeg;base64,' prefix, which we might need to remove depending on backend expectations.
        // For now, we'll send the whole string.
        setFormData({ ...formData, imagen_base64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for submission, ensuring numeric types are correct
    const employeeData = {
      ...formData,
      salario: parseFloat(formData.salario),
      departamento: parseInt(formData.departamento, 10),
      cargo: parseInt(formData.cargo, 10),
      turno: parseInt(formData.turno, 10),
      // The backend might expect the base64 string without the data URL prefix
      imagen_base64: formData.imagen_base64.split(',')[1] || '',
    };

    try {
      await createEmployee(employeeData);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Empleado creado correctamente.',
        icon: 'success',
      });
      // Optionally, reset the form
      setFormData({
        nombre: '', apellido: '', fecha_contratacion: '', username: '',
        password: '', salario: '', departamento: 1, cargo: 1, turno: 1, imagen_base64: '',
      });
      // Clear the file input if possible (this is tricky, usually requires resetting the form element)
      e.target.reset();
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo crear el empleado.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registrar Nuevo Empleado</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Personal Data */}
        <fieldset className="border p-4 rounded-lg">
          <legend className="text-lg font-semibold text-gray-700 px-2">Datos Personales</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Nombre</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Apellido</label>
              <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Fecha de Contratación</label>
              <input type="date" name="fecha_contratacion" value={formData.fecha_contratacion} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </fieldset>

        {/* Credentials */}
        <fieldset className="border p-4 rounded-lg">
          <legend className="text-lg font-semibold text-gray-700 px-2">Credenciales</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </fieldset>

        {/* Work Data */}
        <fieldset className="border p-4 rounded-lg">
          <legend className="text-lg font-semibold text-gray-700 px-2">Datos Laborales</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Salario</label>
              <input type="number" name="salario" value={formData.salario} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Departamento (1-5)</label>
              <select name="departamento" value={formData.departamento} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Cargo (1-5)</label>
              <select name="cargo" value={formData.cargo} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Turno (1-3)</label>
              <select name="turno" value={formData.turno} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                {[1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Image Upload */}
        <fieldset className="border p-4 rounded-lg">
          <legend className="text-lg font-semibold text-gray-700 px-2">Imagen del Empleado</legend>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">Subir foto</label>
            <input type="file" name="image" onChange={handleImageChange} accept="image/*" required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
        </fieldset>

        <div className="text-center">
          <button type="submit" className="w-full max-w-xs h-12 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
            Registrar Empleado
          </button>
        </div>
      </form>
    </div>
  );
};
