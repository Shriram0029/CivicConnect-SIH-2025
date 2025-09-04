// Utility: Get query param (issue ID from URL)
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const issueId = getQueryParam("id");
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "login.html";
}

// Role-based dashboard navigation
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

// Fetch issue details from localStorage (instead of API for now)
function fetchIssueDetails() {
  const issues = JSON.parse(localStorage.getItem("issues")) || [];
  const issue = issues.find(i => i.id === issueId);

  if (!issue) {
    document.getElementById("issueTitle").textContent = "Issue not found";
    return;
  }

  // Enforce department restriction for Staff
  if (
    currentUser.role === "DepartmentStaff" &&
    issue.department !== currentUser.department
  ) {
    alert("Access denied! This issue is not in your department.");
    goToDashboard();
    return;
  }

  // Enforce supervisor restriction
  if (
    currentUser.role === "FieldSupervisor" &&
    issue.assignedTo !== currentUser.email
  ) {
    alert("Access denied! This issue is not assigned to you.");
    goToDashboard();
    return;
  }

  // Populate UI
  document.getElementById("issueId").textContent = issue.id;
  document.getElementById("issueCategory").textContent = issue.category;
  document.getElementById("issueStatus").textContent = issue.status;
  document.getElementById("issuePriority").textContent = issue.priority;
  document.getElementById("issueDepartment").textContent = issue.department;
  document.getElementById("issueLocation").textContent = issue.location || "N/A";
  document.getElementById("issueDescription").textContent =
    issue.description || "No description provided";
  document.getElementById("issueTitle").textContent = issue.title || "Issue";
  if (issue.imageUrl) {
    document.getElementById("issueImage").src = issue.imageUrl;
  }

  // Map
  if (issue.lat && issue.lng && typeof google !== "undefined") {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: issue.lat, lng: issue.lng },
      zoom: 15,
    });
    new google.maps.Marker({
      position: { lat: issue.lat, lng: issue.lng },
      map,
    });
  }

  // Role-based buttons
  if (currentUser.role === "Admin") {
    // all buttons visible
  } else if (currentUser.role === "DepartmentStaff") {
    // Can assign + escalate, not update status directly
    document.getElementById("updateStatusBtn").classList.add("hidden");
  } else if (currentUser.role === "FieldSupervisor") {
    // Can update status only
    document.getElementById("assignBtn").classList.add("hidden");
    document.getElementById("escalateBtn").classList.add("hidden");
  }
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});

// Button handlers
document.getElementById("assignBtn").addEventListener("click", () => {
  alert("Assign Task functionality here.");
});

document.getElementById("updateStatusBtn").addEventListener("click", () => {
  alert("Update Status functionality here.");
});

document.getElementById("escalateBtn").addEventListener("click", () => {
  alert("Escalation triggered!");
});

fetchIssueDetails();
