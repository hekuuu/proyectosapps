const form = document.getElementById('searchForm');
const usernameInput = document.getElementById('usernameInput');
const searchButton = document.getElementById('searchButton');
const formError = document.getElementById('formError');
const status = document.getElementById('status');
const result = document.getElementById('result');

const githubUserApi = 'https://api.github.com/users';

function setFormError(message) {
  formError.textContent = message || '';
}

function setStatus(type, message) {
  status.className = `status ${type}`;
  status.textContent = message;
}

function clearStatus() {
  status.textContent = '';
  status.className = 'status hidden';
}

function validateUsername(value) {
  const username = value.trim();

  if (!username) {
    return 'Debes ingresar un nombre de usuario.';
  }

  if (username.length < 2 || username.length > 39) {
    return 'El usuario debe tener entre 2 y 39 caracteres.';
  }

  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(username)) {
    return 'Usa solo letras, números o guiones, sin espacios ni caracteres especiales.';
  }

  return '';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderUserCard(data) {
  const bio = data.bio ? escapeHtml(data.bio) : 'Este usuario aún no ha añadido una biografía.';
  const location = data.location ? escapeHtml(data.location) : 'Ubicación no disponible';
  const company = data.company ? escapeHtml(data.company) : 'Empresa no disponible';
  const blog = data.blog ? `<a href="${escapeHtml(data.blog)}" target="_blank" rel="noopener noreferrer">${escapeHtml(data.blog)}</a>` : 'No disponible';

  result.innerHTML = `
    <article class="user-card">
      <img class="avatar" src="${escapeHtml(data.avatar_url)}" alt="Avatar de ${escapeHtml(data.login)}" />
      <div class="user-info">
        <div class="user-top">
          <div>
            <h2 class="user-name">${escapeHtml(data.name || data.login)}</h2>
            <p class="user-login">@${escapeHtml(data.login)}</p>
          </div>
          <a class="user-link" href="${escapeHtml(data.html_url)}" target="_blank" rel="noopener noreferrer">Ver perfil</a>
        </div>

        <p class="user-bio">${bio}</p>

        <div class="user-metrics">
          <div class="metric">
            <span class="metric-label">Repos</span>
            <span class="metric-value">${Number(data.public_repos ?? 0).toLocaleString()}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Seguidores</span>
            <span class="metric-value">${Number(data.followers ?? 0).toLocaleString()}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Siguiendo</span>
            <span class="metric-value">${Number(data.following ?? 0).toLocaleString()}</span>
          </div>
        </div>

        <div class="user-meta">
          <span>📍 ${location}</span>
          <span>🏢 ${company}</span>
          <span>🔗 ${blog}</span>
        </div>
      </div>
    </article>
  `;
}

async function fetchGithubUser(username) {
  const response = await fetch(`${githubUserApi}/${encodeURIComponent(username)}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('No se encontró ningún usuario con ese nombre.');
    }

    throw new Error('La API de GitHub no respondió correctamente. Intenta nuevamente.');
  }

  return response.json();
}

async function handleSearch(username) {
  const validationError = validateUsername(username);

  if (validationError) {
    setFormError(validationError);
    setStatus('error', validationError);
    result.innerHTML = '';
    return;
  }

  setFormError('');
  setStatus('loading', 'Buscando usuario...');
  searchButton.disabled = true;
  searchButton.textContent = 'Buscando...';
  result.innerHTML = '';

  try {
    const data = await fetchGithubUser(username);
    renderUserCard(data);
    setStatus('success', 'Datos obtenidos correctamente.');
  } catch (error) {
    result.innerHTML = '';
    setStatus('error', error.message || 'Ocurrió un error al consultar la API.');
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = 'Buscar';
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSearch(usernameInput.value);
});

window.addEventListener('DOMContentLoaded', () => {
  usernameInput.value = 'octocat';
  handleSearch('octocat');
});
