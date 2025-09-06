const API_BASE_URL = "https://face-api-latest.onrender.com/api";

const handleResponse = async (response) => {
  if (response.ok) {
    return await response.json();
  } else {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido en el servidor.' }));
    console.error("Error en la petición a la API:", response.status, errorData);
    throw new Error(errorData.message || 'Error en la petición a la API.');
  }
};

export const getDepartamentos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/departamentos/`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error al obtener departamentos:", error);
    throw error;
  }
};

export const getTurnos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/turnos/`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error al obtener turnos:", error);
    throw error;
  }
};

export const getCargos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cargos/`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error al obtener cargos:", error);
    throw error;
  }
};
