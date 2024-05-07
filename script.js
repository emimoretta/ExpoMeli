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
            document.getElementById('downloadBtnContainer').style.display = 'block'; // Mostrar bot�n de descarga


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
    const regex = /\/MLA-(\d+)\-/; // Expresi�n regular para capturar el ID del art�culo
    const match = url.match(regex); // Buscar coincidencias en la URL
    if (match && match.length > 1) {
        console.log(match[1])
        return "MLA"+match[1]; // El ID es la primera captura del grupo en la expresi�n regular
    } else {
        return null; // Si no se encuentra un ID v�lido, devuelve null
    }
}

function limpiar(){
    const urlInput = document.getElementById('urlInput').value = '';
    document.getElementById('imagen').innerHTML = '';
    document.getElementById('downloadBtnContainer').style.display = 'none';
    document.getElementById('verificar').innerText = 'Verificar';
    document.getElementById('verificar').classList.remove('success');
    document.getElementById('verificar').classList.add('start');

}


async function descargarImagenes() {
    document.getElementById('downloadBtnContainer').style.display = 'none';
    const loading = document.getElementById('loading').style.display = 'block';
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
                const imageUrl = pictureData.variations[0].url.replace(/^http:/, 'https:');

                const response = await fetch(imageUrl);
                const blob = await response.blob();

                zip.file(`${pictureId}.jpg`, blob);
            }

            zip.generateAsync({ type: "blob" }).then(function (content) {
                
                document.getElementById('loading').style.display = 'none';
                saveAs(content, itemId+".zip");
                document.getElementById('downloadBtnContainer').style.display = 'block';
            });
        } else {
            document.getElementById('status').innerText = 'La URL ingresada no es válida';
          
        }
    } catch (error) {
        console.error('Error al descargar las imágenes:', error);
        document.getElementById('status').innerText = 'Ha ocurrido un error al descargar las imágenes';
        console.log
        
    }
}

function mostrarModal() {
    document.getElementById('myModal').style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('myModal').style.display = 'none';
}

// Funci�n para descargar el .zip
function descargar() {
    // L�gica para descargar el .zip aqu�
    cerrarModal(); // Cerrar modal despu�s de descargar
}