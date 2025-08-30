
export async function sendFaceRecognition(imageBase64) {
  try {

    console.log(imageBase64)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const response = await fetch("http://127.0.0.1:8000/api/ingreso-face/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo: "ingreso",
        image_base64: base64Data
      }),
    });

    if (!response.ok) {
      throw new Error("Error en la API de reconocimiento facial");
    }

    return await response.json();
  } catch (error) {
    console.error("Error enviando la imagen:", error);
    throw error;
  }
}
