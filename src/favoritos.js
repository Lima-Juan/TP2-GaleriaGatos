import './style.css';
import { getCatImages } from "./api.js";
import { getCatById } from "./api.js";

const container = document.getElementById('catContainer');
const originFilter = document.getElementById('originFilter');
const searchInput = document.getElementById('searchInput');
const sortButton = document.getElementById('sortButton');

let favoritos = [];
let filteredCats = [];
let sortAsc = true;

// Carga favoritos desde localStorage y muestra filtros
function loadFavorites() {
  favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  filteredCats = [...favoritos];
  fillOriginFilterOptions(favoritos);
  renderCats(filteredCats);
}

// Renderizado
function renderCats(cats) {
  container.innerHTML = '';

  if (cats.length === 0) {
    container.innerHTML = `<p>No hay gatos favoritos que mostrar.</p>`;
    return;
  }

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
          <button onclick="location.href='../../detail.html?id=${cat.id}'">Ver detalles</button>
          <button class="remove-btn">Eliminar</button>
        </div>
      </div>
    `;

    card.querySelector('.remove-btn').addEventListener('click', () => {
      removeFavorite(cat.id);
    });

    container.appendChild(card);
  });
}

// Eliminar favorito
function removeFavorite(id) {
  favoritos = favoritos.filter(cat => cat.id !== id);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  filteredCats = filteredCats.filter(cat => cat.id !== id);
  renderCats(filteredCats);
}

// Llenar filtro de origen
function fillOriginFilterOptions(cats) {
  const origins = new Set();

  cats.forEach(cat => {
    const breed = cat.breeds && cat.breeds.length > 0 ? cat.breeds[0] : null;
    if (breed?.origin) {
      origins.add(breed.origin);
    }
  });

  const optionsHTML = Array.from(origins).sort()
    .map(origin => `<option value="${origin}">${origin}</option>`)
    .join('');

  originFilter.innerHTML = `<option value="">Filtrar por origen</option>` + optionsHTML;
}

// Búsqueda con debounce
let debounceTimeout;
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    const query = searchInput.value.toLowerCase();
    filteredCats = favoritos.filter(cat =>
      cat.breeds[0]?.name.toLowerCase().includes(query)
    );
    applyFilters();
  }, 500);
});

// Filtro por origen
originFilter.addEventListener('change', () => {
  applyFilters();
});

// Ordenar A-Z/Z-A
sortButton.addEventListener('click', () => {
  sortAsc = !sortAsc;
  sortButton.textContent = sortAsc ? 'Ordenar A-Z' : 'Ordenar Z-A';
  applyFilters();
});

// Aplica todos los filtros y ordena
function applyFilters() {
  const selectedOrigin = originFilter.value;
  const query = searchInput.value.toLowerCase();

  filteredCats = favoritos.filter(cat => {
    const breed = cat.breeds[0];
    const matchOrigin = selectedOrigin === '' || breed?.origin === selectedOrigin;
    const matchSearch = breed?.name.toLowerCase().includes(query);
    return matchOrigin && matchSearch;
  });

  filteredCats.sort((a, b) => {
    const nameA = a.breeds[0]?.name.toLowerCase() || '';
    const nameB = b.breeds[0]?.name.toLowerCase() || '';
    return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  renderCats(filteredCats);
}

loadFavorites();