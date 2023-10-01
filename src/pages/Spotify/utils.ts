export function clearToken() {
  localStorage.removeItem('spotifyJwt');
  window.location.href = '/spotify';
}
