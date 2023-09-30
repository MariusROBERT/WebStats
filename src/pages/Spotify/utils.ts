export function clearToken() {
  localStorage.removeItem('jwtToken');
  window.location.href = '/spotify';
}
