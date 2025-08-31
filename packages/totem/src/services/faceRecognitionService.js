export function startFaceIdentification(cameraRef) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const duration = 6000; // 6 seconds
        const intervalTime = 500; // 500 ms
        let lastImageBase64 = null;

        const intervalId = setInterval(async () => {
            const imageBase64 = cameraRef.current?.takeScreenshot();
            if (imageBase64) {
                lastImageBase64 = imageBase64;
            }

            if (Date.now() - startTime > duration) {
                clearInterval(intervalId);
                resolve({ verified: false, message: "Timeout", lastFrame: lastImageBase64 });
                return;
            }

            if (!imageBase64) {
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
                    clearInterval(intervalId);
                    resolve({ verified: true, data: result, lastFrame: imageBase64 });
                }
            } catch (error) {
                console.error("Error during face identification:", error);
            }
        }, intervalTime);
    });
}
