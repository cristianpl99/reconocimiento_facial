export function startFaceIdentification(cameraRef) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const duration = 6000; // 6 seconds
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
                const response = await fetch("https://face-api-latest.onrender.com/face-identify", {
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
            } catch (error) {
                console.error("Error during face identification:", error);
                // Continue the loop even if one request fails
            }

            // If not verified, or if there was a non-blocking error, continue the loop
            recognitionLoop();
        };

        // Start the recognition loop
        recognitionLoop();
    });
}
