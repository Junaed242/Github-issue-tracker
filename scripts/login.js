document.getElementById("login-btn").addEventListener("click", function () {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  // Logic requirement: Check against default credentials
  if (user === "admin" && pass === "admin123") {
    window.location.href = "main.html";
  } else {
    alert("Invalid Credentials! Use admin / admin123");
  }
});

// Something extra: Allow Enter key to trigger login
// Select the elements
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");

// 1. Move from Username to Password
usernameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    passwordInput.focus();
  }
});

// 2. Trigger Login from Password
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    loginBtn.click(); // This triggers your existing handleLogin function
  }
});
