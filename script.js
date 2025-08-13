const socket = io();
const chatBox = document.getElementById('chat-box');

// Generate a color for each username
const userColors = {};

function getUserColor(username) {
  if (!userColors[username]) {
    // Assign random pastel color
    userColors[username] = `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
  }
  return userColors[username];
}

// Sound effect for blocked messages
const alertSound = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");

function sendMessage() {
  const user = document.getElementById('username').value.trim();
  const message = document.getElementById('message').value.trim();

  if (user && message) {
    socket.emit('message', { user, message });
    document.getElementById('message').value = '';
  }
}

// Format time as HH:MM AM/PM
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

socket.on('message', (data) => {
  const msg = document.createElement('div');
  msg.classList.add('message');

  const time = getCurrentTime();
  const userColor = getUserColor(data.user);

  if (data.user === 'SYSTEM') {
    msg.classList.add('system-msg');
    msg.innerHTML = `<strong>⚠️ ${data.message}</strong> <span class="text-muted ms-2">[${time}]</span>`;

    // Add animation and sound
    msg.style.animation = 'shake 0.4s';
    alertSound.play();
  } else {
    msg.classList.add('user-msg');
    msg.innerHTML = `<strong style="color:${userColor}">${data.user}:</strong> ${data.message} <span class="text-muted ms-2">[${time}]</span>`;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
});
