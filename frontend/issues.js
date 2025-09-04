// Role-based access
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "login.html";
}

// Redirect dashboard based on role
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

// Load issues from storage
let allIssues = JSON.parse(localStorage.getItem("issues")) || [];

// Staff → only their department
let visibleIssues = currentUser.role === "Admin"
  ? allIssues
  : allIssues.filter(i => i.department === currentUser.department);

// Render issues
function loadIssues(issues) {
  const tableBody = document.getElementById("issueList");
  tableBody.innerHTML = "";

  if (!issues || issues.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8">No issues found</td></tr>`;
    return;
  }

  issues.forEach(issue => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="rowSelect" data-id="${issue.id}"></td>
      <td>${issue.id}</td>
      <td>${issue.category}</td>
      <td>${issue.location}</td>
      <td>${issue.status}</td>
      <td>${issue.priority}</td>
      <td>${issue.department}</td>
      <td>
        <button onclick="viewIssue('${issue.id}')">View</button>
        <button onclick="assignIssue('${issue.id}')">Assign</button>
        <button onclick="changeStatus('${issue.id}')">Change Status</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// View issue
function viewIssue(id) {
  window.location.href = `issue-details.html?id=${id}`;
}

// Assign issue
function assignIssue(id) {
  alert("Assign flow for Issue #" + id + " (to be implemented)");
}

// Change status
function changeStatus(id) {
  alert("Change status flow for Issue #" + id + " (to be implemented)");
}

// Bulk assign
document.getElementById("assignBulk").addEventListener("click", () => {
  const selected = getSelected();
  if (selected.length === 0) return alert("No issues selected.");

  if (currentUser.role === "Admin" || currentUser.role === "DepartmentStaff") {
    alert("Assigning issues: " + selected.join(", "));
    // TODO: implement assigning logic
  } else {
    alert("You are not allowed to bulk assign.");
  }
});

// Bulk escalate
document.getElementById("escalateBulk").addEventListener("click", () => {
  const selected = getSelected();
  if (selected.length === 0) return alert("No issues selected.");

  if (currentUser.role === "Admin" || currentUser.role === "DepartmentStaff") {
    alert("Escalating issues: " + selected.join(", "));
    // TODO: implement escalation logic
  } else {
    alert("You are not allowed to escalate issues.");
  }
});

// Select all checkbox
document.getElementById("selectAll").addEventListener("change", function () {
  document.querySelectorAll(".rowSelect").forEach(cb => cb.checked = this.checked);
});

// Collect selected IDs
function getSelected() {
  return Array.from(document.querySelectorAll(".rowSelect:checked")).map(cb => cb.dataset.id);
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});

// Filters
document.getElementById("applyFilters").addEventListener("click", () => {
  const search = document.getElementById("searchBox").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const ward = document.getElementById("wardFilter").value;
  const sla = document.getElementById("slaFilter").value;

  let filtered = [...visibleIssues];

  if (search) {
    filtered = filtered.filter(i =>
      i.title?.toLowerCase().includes(search) ||
      i.location?.toLowerCase().includes(search)
    );
  }
  if (category) filtered = filtered.filter(i => i.category === category);
  if (ward) filtered = filtered.filter(i => i.ward === ward);
  if (sla) filtered = filtered.filter(i => i.slaStatus === sla);

  loadIssues(filtered);
});

// Init
loadIssues(visibleIssues);
