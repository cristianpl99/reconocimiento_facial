export function startFaceIdentification(cameraRef) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const duration = 12000; // 12 seconds
        let lastImageBase64 = null;

        const recognitionLoop = async () => {
            if (Date.now() - startTime > duration) {
                resolve({ verified: false, message: "Timeout", lastFrame: lastImageBase64 });
                return;
            }

            const imageBase64 = cameraRef.current?.takeScreenshot();
            if (imageBase64) {
                lastImageBase64 = imageBase64;
            } else {
                // If camera isn't ready, wait a moment and try the loop again.
                setTimeout(recognitionLoop, 100);
                return;
            }

            try {
                const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
                const response = await fetch("https://face-api-latest.onrender.com/api/ingreso-face/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "tipo": "ingreso",
                        "image_base64": base64Data
                    }),
                });

                if (response.status === 201) {
                    const result = await response.json();
                    resolve({ verified: true, data: result, lastFrame: imageBase64 });
                    return; // End the loop on success
                }

                if (response.status === 400 || response.status === 404) {
                    // Hard stop for client errors
                    resolve({ verified: false, error: 'ClientError', message: `Error ${response.status}`, lastFrame: imageBase64 });
                    return;
                }

                if (response.status >= 500) {
                    // Server error, wait 1s and continue loop
                    await new Promise(res => setTimeout(res, 1000));
                    recognitionLoop();
                    return;
                }

            } catch (error) {
                console.error("Error during face identification:", error);
                // Network error, wait 1s and continue loop
                await new Promise(res => setTimeout(res, 1000));
                recognitionLoop();
                return;
            }

            // For any other non-201/4xx/5xx response, continue the loop immediately
            recognitionLoop();
        };

        // Start the recognition loop
        recognitionLoop();
    });
}
