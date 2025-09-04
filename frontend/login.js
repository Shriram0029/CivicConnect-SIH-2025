// Toggle password visibility
function togglePassword(fieldId) {
  const input = document.getElementById(fieldId);
  input.type = input.type === "password" ? "text" : "password";
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const message = document.getElementById("message");

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(
    (u) => u.email === email && u.password === password && u.role === role
  );

  if (foundUser) {
    message.style.color = "green";
    message.textContent = `✅ Login successful as ${role}`;

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        fullname: foundUser.fullname,
        email: foundUser.email,
        role: foundUser.role,
      })
    );

    // Redirect based on role
    setTimeout(() => {
      if (role === "Admin") {
        window.location.href = "admin-dashboard.html";
      } else if (role === "DepartmentStaff") {
        window.location.href = "staff-dashboard.html";
      } else if (role === "FieldSupervisor") {
        window.location.href = "supervisor-dashboard.html";
      }
    }, 1200);
  } else {
    message.style.color = "red";
    message.textContent = "❌ Invalid email, password, or role. Please try again.";
  }
});
