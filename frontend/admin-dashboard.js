// Check session
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "Admin") {
  alert("Access denied! Admins only.");
  window.location.href = "login.html";
}

// Welcome user
document.getElementById("adminName").textContent = currentUser.fullname;

// Load dummy issue stats
let issues = JSON.parse(localStorage.getItem("issues")) || [];

// Count statuses
const total = issues.length;
const open = issues.filter(i => i.status === "Open").length;
const progress = issues.filter(i => i.status === "In Progress").length;
const resolved = issues.filter(i => i.status === "Resolved").length;

document.getElementById("totalIssues").textContent = total;
document.getElementById("openIssues").textContent = open;
document.getElementById("progressIssues").textContent = progress;
document.getElementById("resolvedIssues").textContent = resolved;

// Escalation check (overdue > 3 days, not resolved)
const escalationList = document.getElementById("escalationList");
escalationList.innerHTML = "";
const now = new Date();

let escalated = issues.filter(issue => {
  if (!issue.createdAt) return false;
  let created = new Date(issue.createdAt);
  let diffDays = (now - created) / (1000 * 60 * 60 * 24);
  return issue.status !== "Resolved" && diffDays > 3;
});

if (escalated.length === 0) {
  escalationList.innerHTML = "<li>No escalations yet ✅</li>";
} else {
  escalated.forEach(e => {
    let li = document.createElement("li");
    li.textContent = `${e.title} (Dept: ${e.department}) - Overdue`;
    escalationList.appendChild(li);
  });
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});
