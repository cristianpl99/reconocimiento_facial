import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createEmployee } from '../services/employeeService';
import { getDepartamentos, getCargos } from '../services/dataService';
import './CreateEmployeeForm.css'; // Import custom CSS
import { FaUser, FaIdCard, FaCalendarAlt, FaKey, FaDollarSign, FaBuilding, FaBriefcase, FaClock } from 'react-icons/fa';

export const CreateEmployeeForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_contratacion: '',
    username: '',
    password: '',
    salario: '',
    departamento: '',
    cargo: '',
    turno: 1,
    imagen_base64: '',
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const deps = await getDepartamentos();
        setDepartamentos(deps);
        const cgs = await getCargos();
        setCargos(cgs);
      } catch (error) {
        Swal.fire('Error', 'No se pudieron cargar los datos de departamentos y cargos.', 'error');
      }
    };
    loadData();
  }, []);

  const validateField = (name, value) => {
    if (!value) {
      return 'Este campo es requerido.';
    }
    if (name === 'password' && value.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    return '';
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imagen_base64: reader.result });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, imagen_base64: '' });
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
        Swal.fire('Error de Validación', 'Por favor, corrige los campos marcados en rojo.', 'error');
        return;
    }

    // Ensure the date is in YYYY-MM-DD format, handling potential timezone issues.
    const date = new Date(formData.fecha_contratacion);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const correctedDate = new Date(date.getTime() + userTimezoneOffset);
    const formattedDate = correctedDate.toISOString().split('T')[0];

    const employeeData = {
      ...formData,
      fecha_contratacion: formattedDate,
      salario: parseFloat(formData.salario),
      departamento: parseInt(formData.departamento, 10),
      cargo: parseInt(formData.cargo, 10),
      turno: parseInt(formData.turno, 10),
      imagen_base64: formData.imagen_base64.split(',')[1] || '',
    };

    try {
      await createEmployee(employeeData);
      Swal.fire('¡Éxito!', 'Empleado creado correctamente.', 'success');
      setFormData({
        nombre: '', apellido: '', fecha_contratacion: '', username: '',
        password: '', salario: '', departamento: '', cargo: '', turno: 1, imagen_base64: '',
      });
      setImagePreview(null);
      setErrors({});
      e.target.reset();
    } catch (error) {
      Swal.fire('Error', error.message || 'No se pudo crear el empleado.', 'error');
    }
  };

  return (
    <div className="font-sans bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Registrar Nuevo Empleado</h2>
      <form onSubmit={handleSubmit} className="space-y-10" noValidate>

        <fieldset className="border p-6 rounded-lg shadow-sm">
          <legend className="text-xl font-semibold text-gray-700 px-2">Datos Personales</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-4">
            <div>
              <div className="floating-label-group">
                <FaUser className="floating-label-icon" />
                <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleInputChange} onBlur={handleBlur} className={`floating-label-input block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.nombre ? 'input-error' : 'border-gray-300'}`} placeholder=" "/>
                <label htmlFor="nombre" className="floating-label">Nombre</label>
              </div>
              {errors.nombre && <p className="error-message">{errors.nombre}</p>}
            </div>
            <div>
              <div className="floating-label-group">
                <FaIdCard className="floating-label-icon" />
                <input type="text" name="apellido" id="apellido" value={formData.apellido} onChange={handleInputChange} onBlur={handleBlur} className={`floating-label-input block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.apellido ? 'input-error' : 'border-gray-300'}`} placeholder=" "/>
                <label htmlFor="apellido" className="floating-label">Apellido</label>
              </div>
              {errors.apellido && <p className="error-message">{errors.apellido}</p>}
            </div>
            <div>
              <div className="floating-label-group">
                <FaCalendarAlt className="floating-label-icon" />
                <input type="date" name="fecha_contratacion" id="fecha_contratacion" value={formData.fecha_contratacion} onChange={handleInputChange} onBlur={handleBlur} className={`floating-label-input block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.fecha_contratacion ? 'input-error' : 'border-gray-300'}`} placeholder=" "/>
                <label htmlFor="fecha_contratacion" className="floating-label">Fecha de Contratación</label>
              </div>
              {errors.fecha_contratacion && <p className="error-message">{errors.fecha_contratacion}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset className="border p-6 rounded-lg shadow-sm">
          <legend className="text-xl font-semibold text-gray-700 px-2">Credenciales</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-4">
            <div>
              <div className="floating-label-group">
                <FaUser className="floating-label-icon" />
                <input type="text" name="username" id="username" value={formData.username} onChange={handleInputChange} onBlur={handleBlur} className={`floating-label-input block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.username ? 'input-error' : 'border-gray-300'}`} placeholder=" "/>
                <label htmlFor="username" className="floating-label">Username</label>
              </div>
              {errors.username && <p className="error-message">{errors.username}</p>}
            </div>
            <div>
              <div className="floating-label-group">
                <FaKey className="floating-label-icon" />
                <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} onBlur={handleBlur} className={`floating-label-input block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'input-error' : 'border-gray-300'}`} placeholder=" "/>
                <label htmlFor="password" className="floating-label">Password</label>
              </div>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset className="border p-6 rounded-lg shadow-sm">
          <legend className="text-xl font-semibold text-gray-700 px-2">Datos Laborales</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            <div>
              <div className="floating-label-group">
                <FaDollarSign className="floating-label-icon" />
                <input type="number" name="salario" id="salario" value={formData.salario} onChange={handleInputChange} onBlur={handleBlur} className={`floating-label-input block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.salario ? 'input-error' : 'border-gray-300'}`} placeholder=" "/>
                <label htmlFor="salario" className="floating-label">Salario</label>
              </div>
              {errors.salario && <p className="error-message">{errors.salario}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Departamento</label>
              <select name="departamento" value={formData.departamento} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccione un departamento</option>
                {departamentos.map(dep => <option key={dep.id_departamento} value={dep.id_departamento}>{dep.nombre_departamento}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Cargo</label>
              <select name="cargo" value={formData.cargo} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="">Seleccione un cargo</option>
                {cargos.map(cargo => <option key={cargo.id_cargo} value={cargo.id_cargo}>{cargo.nombre_cargo}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Turno</label>
              <select name="turno" value={formData.turno} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                {[1, 2, 3].map(n => <option key={n} value={n}>{`Turno ${n}`}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="border p-6 rounded-lg shadow-sm">
          <legend className="text-xl font-semibold text-gray-700 px-2">Imagen del Empleado</legend>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">Subir foto</label>
            <input type="file" name="image" onChange={handleImageChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            {imagePreview && <img src={imagePreview} alt="Previsualización" className="mt-4 h-32 w-32 object-cover rounded-lg shadow-md" />}
          </div>
          {errors.imagen_base64 && <p className="error-message">{errors.imagen_base64}</p>}
        </fieldset>

        <div className="text-center pt-4">
          <button type="submit" className="w-full max-w-md h-12 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
            Registrar Empleado
          </button>
        </div>
      </form>
    </div>
  );
};
