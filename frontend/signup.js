// Toggle password visibility (eye icon stays same)
function togglePassword(fieldId) {
  const input = document.getElementById(fieldId);
  input.type = input.type === "password" ? "text" : "password";
}

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const message = document.getElementById("message");

  // Get existing users or create empty array
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if email already registered
  if (users.some((user) => user.email === email)) {
    message.style.color = "red";
    message.textContent = "❌ Email already registered.";
    return;
  }

  // Save new user
  users.push({ fullname, email, password, role });
  localStorage.setItem("users", JSON.stringify(users));

  message.style.color = "green";
  message.textContent = "✅ Signup successful! Redirecting to login...";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
});
