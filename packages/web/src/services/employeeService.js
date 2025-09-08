const API_URL = "https://face-api-latest.onrender.com/api/empleados/";

export const createEmployee = async (employeeData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    if (response.ok) {
      return await response.json(); // Devuelve los datos del empleado creado en caso de éxito
    } else {
      // Intenta leer el cuerpo del error para dar más detalles
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido en el servidor.' }));
      console.error("Error al crear empleado:", response.status, errorData);
      // Lanza un error con el mensaje del servidor si está disponible
      throw new Error(errorData.message || 'Error al crear el empleado.');
    }
  } catch (error) {
    console.error("Error de red o al procesar la petición:", error);
    // Relanza el error para que el componente que llama pueda manejarlo
    throw error;
  }
};

export const getAllEmployees = async () => {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido en el servidor.' }));
      console.error("Error al obtener empleados:", response.status, errorData);
      throw new Error(errorData.message || 'Error al obtener los empleados.');
    }
  } catch (error) {
    console.error("Error de red o al procesar la petición:", error);
    throw error;
  }
};
