const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "login.html";
}

// Redirect helper
function goToDashboard() {
  if (currentUser.role === "Admin") {
    window.location.href = "admin-dashboard.html";
  } else if (currentUser.role === "DepartmentStaff") {
    window.location.href = "staff-dashboard.html";
  } else if (currentUser.role === "FieldSupervisor") {
    window.location.href = "supervisor-dashboard.html";
  } else {
    window.location.href = "login.html";
  }
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});

// Load overdue issues from localStorage
function loadOverdueIssues() {
  const issues = JSON.parse(localStorage.getItem("issues")) || [];
  const today = new Date();

  // Filter overdue issues
  let overdueIssues = issues.filter(issue => {
    if (!issue.deadline) return false;
    const deadline = new Date(issue.deadline);
    return deadline < today && issue.status !== "Resolved";
  });

  // Role filtering
  if (currentUser.role === "DepartmentStaff") {
    overdueIssues = overdueIssues.filter(i => i.department === currentUser.department);
  } else if (currentUser.role === "FieldSupervisor") {
    overdueIssues = overdueIssues.filter(i => i.assignedTo === currentUser.email);
  }

  const tableBody = document.getElementById("overdueTable");
  tableBody.innerHTML = "";

  if (overdueIssues.length > 0) {
    overdueIssues.forEach(issue => {
      const deadline = new Date(issue.deadline);
      const daysOverdue = Math.ceil((today - deadline) / (1000 * 60 * 60 * 24));

      const row = document.createElement("tr");
      row.className = "overdue";
      row.innerHTML = `
        <td>${issue.id}</td>
        <td>${issue.category}</td>
        <td>${issue.location || "N/A"}</td>
        <td>${issue.department}</td>
        <td>${issue.deadline}</td>
        <td>${daysOverdue}</td>
        <td>${issue.status}</td>
        <td>${issue.escalatedTo || "—"}</td>
      `;
      tableBody.appendChild(row);
    });
  } else {
    tableBody.innerHTML = `<tr><td colspan="8">✅ No overdue issues</td></tr>`;
  }
}

// Load escalation logs
function loadEscalationLogs() {
  const logs = JSON.parse(localStorage.getItem("escalationLogs")) || [];

  // Role filtering
  let filteredLogs = logs;
  if (currentUser.role === "DepartmentStaff") {
    filteredLogs = logs.filter(l => l.department === currentUser.department);
  } else if (currentUser.role === "FieldSupervisor") {
    filteredLogs = logs.filter(l => l.assignedTo === currentUser.email);
  }

  const logList = document.getElementById("escalationLog");
  logList.innerHTML = "";

  if (filteredLogs.length > 0) {
    filteredLogs.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = `${entry.message} (on ${entry.timestamp})`;
      logList.appendChild(li);
    });
  } else {
    logList.innerHTML = `<li>✅ No escalations recorded</li>`;
  }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadOverdueIssues();
  loadEscalationLogs();
});
