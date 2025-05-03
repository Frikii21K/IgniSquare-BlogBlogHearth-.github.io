// script.js

// Configuración
const API_KEY = 'AIzaSyC2nSYZCu2yPywS5EU5IYpJx-vfspqEnLI';
const BLOG_URL = 'https://blogheathignisquare.blogspot.com/';

const postsContainer = document.getElementById('posts-container');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

// Obtiene el ID del blog por URL
async function fetchBlogId() {
  const url = `https://www.googleapis.com/blogger/v3/blogs/byurl?url=${encodeURIComponent(BLOG_URL)}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error obteniendo blogId: ${res.status}`);
  const data = await res.json();
  return data.id;
}

// Obtiene todas las entradas y las muestra
async function loadPosts() {
  try {
    const blogId = await fetchBlogId();
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${API_KEY}&maxResults=50`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error fetching posts: ${res.status}`);
    const { items = [] } = await res.json();

    if (items.length === 0) {
      postsContainer.innerHTML = '<p class="col-span-full text-center text-gray-500">No se encontraron entradas.</p>';
    } else {
      renderPosts(items);
    }
  } catch (err) {
    console.error(err);
    postsContainer.innerHTML = `<p class="col-span-full text-center text-red-500">Error al cargar entradas: ${err.message}</p>`;
  }
}

function renderPosts(posts) {
  postsContainer.innerHTML = '';
  posts.forEach(post => {
    const imgSrc = extractFirstImage(post.content);
    const card = document.createElement('article');
    card.className = 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer';
    card.innerHTML = `
      ${imgSrc
        ? `<img loading="lazy" src="${imgSrc}" alt="${post.title}" class="w-full h-48 object-cover">`
        : ''
      }
      <div class="p-4">
        <h2 class="font-semibold text-lg">${post.title}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">${new Date(post.published).toLocaleDateString()}</p>
        <p class="mt-2 line-clamp-3">${stripHtml(post.content).split('\n')[0]}</p>
      </div>
    `;
    card.addEventListener('click', () => openModal(post));
    postsContainer.appendChild(card);
  });
}

function openModal(post) {
  modalContent.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">${post.title}</h2>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
      ${new Date(post.published).toLocaleString()}
    </p>
    ${post.content}
  `;
  modal.classList.remove('hidden');
}

modalClose.addEventListener('click', () => modal.classList.add('hidden'));

// Extrae la primera imagen de un HTML
function extractFirstImage(html) {
  const match = html.match(/<img[^>]+src="([^">]+)"/i);
  return match ? match[1] : null;
}

// Strip HTML helper
function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

// Modo claro/oscuro (igual que antes)
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
}
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(next);
});
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) applyTheme(saved);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
})();

// Carga inicial
document.addEventListener('DOMContentLoaded', loadPosts);
