const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');



loginButton.addEventListener('click', () => {
  window.location.href = '/login';
});

if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/logout');
      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  });
}


window.addEventListener('load', checkSession);