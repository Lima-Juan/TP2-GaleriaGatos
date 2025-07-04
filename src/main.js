import './style.css';
import { getCatImages } from "./api.js";
import { getCatById } from "./api.js";

const container = document.getElementById('catContainer');
const originFilter = document.getElementById('originFilter');

let allCats = [];
let filteredCats = [];
let sortAsc = true;

// Cargamos los gatos
async function showCats() {
  try {
    const cats = await getCatImages(50); // Más variedad

    const uniqueBreeds = new Map();

    cats.forEach(cat => {
      const breed = cat.breeds && cat.breeds.length > 0 ? cat.breeds[0] : null;
      if (breed && !uniqueBreeds.has(breed.id)) {
        uniqueBreeds.set(breed.id, cat);
      }
    });

    allCats = Array.from(uniqueBreeds.values());
    filteredCats = [...allCats];
    renderCats(filteredCats);

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p>Error al cargar los gatos 😿</p>`;
  }

  fillOriginFilterOptions(allCats);
}

// Renderizado
function renderCats(cats) {
  container.innerHTML = '';
  cats.forEach(cat => {
    const breed = cat.breeds && cat.breeds.length > 0 ? cat.breeds[0] : null;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${cat.url}" alt="Gato" />
      <div class="info">
        <h3>${breed?.name || 'Gato Desconocido'}</h3>
        <p>${breed?.origin || 'Origen desconocido'}</p>
        <div class="actions">
          <button onclick="location.href='./detail.html?id=${cat.id}'">Ver detalles</button>
          <button class="fav-btn">❤️ Favorito</button>
        </div>
      </div>
    `;

    // Agregar funcionalidad para guardar como favorito
    card.querySelector('.fav-btn').addEventListener('click', () => addToFavorites(cat));

    container.appendChild(card);
  });
}

// Guardar gato en favoritos (localStorage)
function addToFavorites(cat) {
  const current = JSON.parse(localStorage.getItem("favoritos")) || [];
  const alreadyExists = current.find(c => c.id === cat.id);

  if (!alreadyExists) {
    current.push(cat);
    localStorage.setItem("favoritos", JSON.stringify(current));
    alert("🐱 Gato agregado a favoritos");
  } else {
    alert("Ya está en favoritos");
  }
}

// Filtro por país/origen
function fillOriginFilterOptions(cats) {
  const origins = new Set();

  cats.forEach(cat => {
    const breed = cat.breeds[0];
    if (breed?.origin) {
      origins.add(breed.origin);
    }
  });

  const optionsHTML = Array.from(origins)
    .sort()
    .map(origin => `<option value="${origin}">${origin}</option>`)
    .join('');

  originFilter.innerHTML = `<option value="">Filtrar por origen</option>` + optionsHTML;
}

// Búsqueda con debounce
const searchInput = document.getElementById('searchInput');
let debounceTimeout;

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    const query = searchInput.value.toLowerCase();
    filteredCats = allCats.filter(cat =>
      cat.breeds[0]?.name.toLowerCase().includes(query)
    );
    renderCats(filteredCats);
  }, 1000);
});

// Ordenar A-Z y Z-A
document.getElementById('sortButton').addEventListener('click', () => {
  sortAsc = !sortAsc;
  filteredCats.sort((a, b) => {
    const nameA = a.breeds[0]?.name.toLowerCase() || '';
    const nameB = b.breeds[0]?.name.toLowerCase() || '';
    return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });
  renderCats(filteredCats);
});

// Filtro por origen
originFilter.addEventListener('change', () => {
  const selectedOrigin = originFilter.value;

  filteredCats = allCats.filter(cat => {
    const breed = cat.breeds[0];
    return selectedOrigin === '' || breed?.origin === selectedOrigin;
  });

  renderCats(filteredCats);
});

showCats();