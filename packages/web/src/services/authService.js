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

    if (foundUser && foundUser.cargo === 1) {
      return foundUser; // Devuelve el usuario si las credenciales son correctas y el cargo es 1
    }

    return null; // Devuelve null si el usuario no se encuentra, la contraseña es incorrecta o el cargo no es 1
  } catch (error) {
    console.error("Error de red o de parsing al intentar iniciar sesión:", error);
    return null;
  }
};
