export const loginUser = async (username, password) => {
  try {
    const response = await fetch("https://face-api-latest.onrender.com/api/empleados");
    if (!response.ok) {
      console.error("Error al obtener la lista de empleados. Status:", response.status);
      return null;
    }

    const employees = await response.json();
    console.log("Datos de empleados recibidos del backend:", employees);

    const foundUser = employees.find(
      (employee) => employee.username === username && employee.password === password
    );

    return foundUser || null; // Devuelve el objeto de usuario si las credenciales son correctas, de lo contrario null.
  } catch (error) {
    console.error("Error de red o de parsing al intentar iniciar sesión:", error);
    return null;
  }
};
