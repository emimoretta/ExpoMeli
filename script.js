async function verificarURL() {
    const urlInput = document.getElementById('urlInput').value;
    const itemId = getItemId(urlInput);
    const apiUrl = `https://api.mercadolibre.com/items/${itemId}`;

    const verifyBtn = document.getElementById('verificar');
    document.getElementById('imagen').innerHTML='';
    verifyBtn.innerText = 'Verificando...';

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.status !== 404) {
            const pictures = data.pictures;
            const imageContainer = document.getElementById('imagen');
            verifyBtn.innerText = 'OK';
            verifyBtn.classList.remove('start');
            verifyBtn.classList.add('success');
            document.getElementById('downloadBtnContainer').style.display = 'block'; // Mostrar botón de descarga
            

            for (let picture of pictures) {
                const pictureId = picture.id;
                const pictureApiUrl = `https://api.mercadolibre.com/pictures/${pictureId}`;
                const pictureResponse = await fetch(pictureApiUrl);
                const pictureData = await pictureResponse.json();
                const imageUrl = pictureData.variations[0].url;

                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = 'Imagen del producto';
                imageContainer.appendChild(imgElement);
            }
        } else {
            document.getElementById('status').innerText = 'La URL ingresada no es válida';
            document.getElementById('imagen') = '';
            document.getElementById('downloadBtnContainer').style.display = 'none';
        }
    } catch (error) {
        console.error('Error al verificar la URL:', error);
        document.getElementById('status').innerText = 'Ha ocurrido un error al verificar la URL';
        document.getElementById('imagen').innerHTML = '';
        document.getElementById('downloadBtnContainer').style.display = 'none';
    }
}

function getItemId(url) {
    const regex = /\/MLA-(\d+)\-/; // Expresión regular para capturar el ID del artículo
    const match = url.match(regex); // Buscar coincidencias en la URL
    if (match && match.length > 1) {
        console.log(match[1])
        return "MLA"+match[1]; // El ID es la primera captura del grupo en la expresión regular
    } else {
        return null; // Si no se encuentra un ID válido, devuelve null
    }
}


async function descargarImagenes() {
    const urlInput = document.getElementById('urlInput').value;
    const itemId = getItemId(urlInput);
    const apiUrl = `https://api.mercadolibre.com/items/${itemId}`;

    

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.status !== 404) {
            const pictures = data.pictures;
            const zip = new JSZip();
            

            for (let picture of pictures) {
                const pictureId = picture.id;
                const pictureApiUrl = `https://api.mercadolibre.com/pictures/${pictureId}`;
                const pictureResponse = await fetch(pictureApiUrl);
                const pictureData = await pictureResponse.json();
                const imageUrl = pictureData.variations[0].url;

                const response = await fetch(imageUrl);
                const blob = await response.blob();

                zip.file(`${pictureId}.jpg`, blob);
            }

            zip.generateAsync({ type: "blob" }).then(function (content) {
                saveAs(content, "imagenes.zip");
            });
        } else {
            document.getElementById('status').innerText = 'La URL ingresada no es válida';
        }
    } catch (error) {
        console.error('Error al descargar las imágenes:', error);
        document.getElementById('status').innerText = 'Ha ocurrido un error al descargar las imágenes';
    }
}

function mostrarModal() {
    document.getElementById('myModal').style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('myModal').style.display = 'none';
}

// Función para descargar el .zip
function descargar() {
    // Lógica para descargar el .zip aquí
    cerrarModal(); // Cerrar modal después de descargar
}