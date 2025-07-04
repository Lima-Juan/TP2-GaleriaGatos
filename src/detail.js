import './style.css'
import { getCatById } from "./api.js";

const container = document.getElementById('detailContainer');
const params = new URLSearchParams(window.location.search);
const catId = params.get('id');

//Aqui donde se realiza la muestra de detalles en la pagina con una derivacion a wikipedia para mas informacion.
async function showCatDetail(id) {
  try {
    const cat = await getCatById(id);
    const breed = cat.breeds && cat.breeds.length > 0 ? cat.breeds[0] : null;

    container.innerHTML = `
      <div class="detail-card">
        <img src="${cat.url}" alt="Gato" />
        <div class="info">
          <h2>${breed?.name || 'Gato sin raza definida'}</h2>
          ${
            breed
              ? `<p><strong>Origen:</strong> ${breed.origin}</p>
                 <p><strong>Temperamento:</strong> ${breed.temperament}</p>
                 <p><strong>Descripción:</strong> ${breed.description}</p>
                 <a href="${breed.wikipedia_url}" target="_blank">🔗 Wikipedia</a>`
              : '<p>No hay información de raza disponible.</p>'
          }
          <button onclick="location.href='./index.html'">Volver</button>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p>Error al obtener los detalles del gato.</p>';
  }
}

if (catId) {
  showCatDetail(catId);
} else {
  container.innerHTML = '<p>ID del gato no proporcionado.</p>';
}
