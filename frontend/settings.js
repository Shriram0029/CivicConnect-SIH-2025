// Session & Role Check
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "login.html";
} else if (currentUser.role !== "Admin") {
  if (currentUser.role === "DepartmentStaff") {
    window.location.href = "staff-dashboard.html";
  } else if (currentUser.role === "FieldSupervisor") {
    window.location.href = "supervisor-dashboard.html";
  }
}

// --- User Management ---
let users = JSON.parse(localStorage.getItem("users")) || [];

// Render users
function renderUsers() {
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";
  users.forEach((user, index) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="action-btn delete" onclick="deleteUser(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}
renderUsers();

// Add user
document.getElementById("addUserForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("newName").value;
  const email = document.getElementById("newEmail").value;
  const role = document.getElementById("newRole").value;
  const password = document.getElementById("newPassword").value;

  users.push({ name, email, role, password });
  localStorage.setItem("users", JSON.stringify(users));
  e.target.reset();
  renderUsers();
});

function deleteUser(index) {
  users.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  renderUsers();
}

// --- SLA Config ---
let slaConfig = JSON.parse(localStorage.getItem("slaConfig")) || { days: 3 };
document.getElementById("slaDays").value = slaConfig.days;

document.getElementById("slaForm").addEventListener("submit", e => {
  e.preventDefault();
  slaConfig.days = parseInt(document.getElementById("slaDays").value);
  localStorage.setItem("slaConfig", JSON.stringify(slaConfig));
  alert("✅ SLA updated successfully!");
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});
