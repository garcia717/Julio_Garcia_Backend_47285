document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('message-form');
    const userField = document.getElementById('user');
    const messageField = document.getElementById('message');
    const messageBox = document.getElementById('message-box');
    const socket = io();
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const user = userField.value;
      const message = messageField.value;
  

      socket.emit('chatMessage', { user, message });
  

      messageField.value = '';
    });
  

    socket.on('chatMessage', (data) => {
      const message = document.createElement('p');
      message.textContent = `${data.user}: ${data.message} ${data.postTime}`;
      messageBox.appendChild(message);
    });
  });