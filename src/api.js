const API_KEY = 'live_6ndep7zH6yq8cOTSvmYMOMAS6H9cVXewywTVCMeca1Iibu1hRQa4CLlcK44h7URQ';
const BASE_URL = "https://api.thecatapi.com/v1";

const headers = API_KEY ? { 'x-api-key': API_KEY } : {};

export async function getCatImages(limit = 30) {
  const res = await fetch(`${BASE_URL}/images/search?limit=${limit}&has_breeds=1`, { headers });
  if (!res.ok) throw new Error('Error al obtener gatos');
  return await res.json();
}

export async function getCatById(id) {
  const res = await fetch(`${BASE_URL}/images/${id}`, { headers });
  if (!res.ok) throw new Error('Error al obtener detalle del gato');
  return await res.json();
}
