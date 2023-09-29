const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');



loginButton.addEventListener('click', () => {
  window.location.href = '/login';

});

async function ToggleButton() {
  try {
    const response = await fetch('/check-session');
    if (response.ok) {
      const data = await response.json();
      if (data.loggedIn) {
        if (logoutButton) {
          logoutButton.style.display = 'block';
          loginButton.style.display ='none';
        }
      } else {

        if (logoutButton) {
          logoutButton.style.display = 'none';
          loginButton.style.display = 'block';
        }
      }
    } else {
      console.error('Error al verificar la sesión');
    }
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
  }
}


ToggleButton();


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

window.addEventListener('load', ToggleButton);