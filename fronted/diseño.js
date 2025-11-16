const generateBtn = document.getElementById('generateBtn');
        const promptInput = document.getElementById('promptInput');
        const messageDisplay = document.getElementById('message');
        const resultArea = document.getElementById('resultArea');
        const imgResult = document.getElementById('imgResult');
        const loadingImage = document.getElementById('loadingImage');
        
        // ** CAMBIO CLAVE **
        // Usamos gemini-2.5-flash-image-preview con el método generateContent, que es más estable aquí.
        const modelName = "gemini-2.5-flash-image-preview";
        const apiKey = ""; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        
        // --- Funciones de Utilidad ---
        
        function updateUI(state, msg = '') {
            resultArea.classList.remove('visible');
            messageDisplay.textContent = '';
            messageDisplay.classList.remove('error', 'success');
            loadingImage.classList.remove('visible');
            
            if (state === 'loading') {
                // Usamos innerHTML para incluir el SVG del spinner de carga en el mensaje
                messageDisplay.innerHTML = `<svg class="spinner-svg inline-block" style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem; vertical-align: bottom;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Solicitando a Gemini AI... Esto puede tardar unos segundos.`;
                loadingImage.classList.add('visible');
                imgResult.src = ''; 
            } else if (state === 'error') {
                messageDisplay.textContent = '❌ Error de generación de imagen. Detalle: ' + msg;
                messageDisplay.classList.add('error');
            } else if (state === 'ready') {
                messageDisplay.textContent = '✅ Imagen generada con éxito.';
                messageDisplay.classList.add('success');
                resultArea.classList.add('visible');
            } else {
                messageDisplay.textContent = msg;
            }
        }

        async function fetchWithBackoff(url, options, retries = 3) {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(url, options);
                    if (!response.ok) {
                        const errorBody = await response.text();
                        throw new Error(`API error ${response.status}: ${errorBody}`);
                    }
                    return response;
                } catch (error) {
                    if (i < retries - 1) {
                        // Espera exponencial
                        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                        await new Promise(resolve => setTimeout(resolve, delay));
                    } else {
                        throw error; 
                    }
                }
            }
        }

        // --- Lógica de Generación de Imagen ---
        
        generateBtn.addEventListener('click', async () => {
            const userPrompt = promptInput.value.trim();

            if (!userPrompt) {
                updateUI('initial', 'Por favor, introduce una descripción para tu lámpara.');
                return;
            }
            
            updateUI('loading');
            
            // Prompt mejorado para calidad de diseño
            const fullPrompt = `Lámpara de diseño profesional en un ambiente interior moderno. Render 8K, fotorrealista, enfoque en iluminación y materiales: ${userPrompt}`;

            // ** CAMBIO CLAVE: Nueva estructura de Payload para generateContent **
            const payload = { 
                contents: [{ parts: [{ text: fullPrompt }] }],
                generationConfig: {
                    responseModalities: ['TEXT', 'IMAGE']
                }
            };

            try {
                const response = await fetchWithBackoff(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                
                // ** CAMBIO CLAVE: Nueva extracción de datos para generateContent **
                const candidate = result?.candidates?.[0];
                const base64Data = candidate?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
                
                if (!base64Data) {
                    const errorMsg = result?.error?.message || "No se pudo extraer la imagen. La respuesta de la API fue válida pero no contenía datos de imagen.";
                    throw new Error(errorMsg);
                }

                const imageUrl = `data:image/png;base64,${base64Data}`;
                imgResult.src = imageUrl;
                
                updateUI('ready');

            } catch (error) {
                console.error('Error durante la generación de imagen:', error);
                
                let friendlyMessage = 'Fallo al comunicarse con la IA. Consulta la consola para detalles.';
                if (error.message.includes('403') || error.message.includes('permission')) {
                     // Aunque cambiamos de modelo, mantenemos una advertencia genérica por si falla de nuevo
                     friendlyMessage = 'Error de Permisos (403). Inténtalo de nuevo o con una descripción diferente.';
                }
                
                updateUI('error', friendlyMessage);
            }
        });

        // Inicialización
        document.addEventListener('DOMContentLoaded', () => {
            updateUI('initial', 'Esperando tu descripción...');
        });