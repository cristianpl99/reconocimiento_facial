export function startFaceIdentification(cameraRef) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const duration = 4000; // 4 seconds
        const intervalTime = 500; // 500 ms

        const intervalId = setInterval(async () => {
            if (Date.now() - startTime > duration) {
                clearInterval(intervalId);
                resolve({ verified: false, message: "Timeout" });
                return;
            }

            const imageBase64 = cameraRef.current?.takeScreenshot();
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
                    body: JSON.stringify({ "image_base64": base64Data }),
                });

                if (response.ok) {
                    const result = await response.json();
                    // Assuming any successful JSON response is a positive identification
                    if (result) {
                        clearInterval(intervalId);
                        resolve({ verified: true, data: result });
                    }
                }
            } catch (error) {
                console.error("Error during face identification:", error);
                // Continue trying until timeout
            }
        }, intervalTime);
    });
}
