// Check session
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "DepartmentStaff") {
  alert("Access denied! Department Staff only.");
  window.location.href = "login.html";
}

document.getElementById("deptName").textContent = currentUser.fullname;

// Load issues (dummy data from localStorage)
let issues = JSON.parse(localStorage.getItem("issues")) || [];

// Filter only department issues
let deptIssues = issues.filter(i => i.department === currentUser.department);

// Stats
const open = deptIssues.filter(i => i.status === "Open").length;
const progress = deptIssues.filter(i => i.status === "In Progress").length;
const resolved = deptIssues.filter(i => i.status === "Resolved").length;

// Overdue check (older than 3 days)
const now = new Date();
const overdueIssues = deptIssues.filter(issue => {
  if (!issue.createdAt) return false;
  let created = new Date(issue.createdAt);
  let diffDays = (now - created) / (1000 * 60 * 60 * 24);
  return issue.status !== "Resolved" && diffDays > 3;
});

document.getElementById("openIssues").textContent = open;
document.getElementById("progressIssues").textContent = progress;
document.getElementById("resolvedIssues").textContent = resolved;
document.getElementById("overdueIssues").textContent = overdueIssues.length;

// Issue list
const issueTable = document.getElementById("departmentIssues");
issueTable.innerHTML = "";

if (deptIssues.length === 0) {
  issueTable.innerHTML = "<tr><td colspan='4'>No issues assigned yet ✅</td></tr>";
} else {
  deptIssues.forEach((issue, idx) => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${issue.title}</td>
      <td>${issue.status}</td>
      <td>${issue.assignedTo || "Unassigned"}</td>
      <td>
        <button class="assign" onclick="assignToSupervisor(${idx})">Assign</button>
        <button class="progress" onclick="updateStatus(${idx}, 'In Progress')">Start</button>
        <button class="resolve" onclick="updateStatus(${idx}, 'Resolved')">Resolve</button>
      </td>
    `;
    issueTable.appendChild(row);
  });
}

// Assign to supervisor
function assignToSupervisor(index) {
  let supervisor = prompt("Enter Supervisor Name to assign:");
  if (supervisor) {
    deptIssues[index].assignedTo = supervisor;
    localStorage.setItem("issues", JSON.stringify(issues));
    location.reload();
  }
}

// Update status
function updateStatus(index, newStatus) {
  deptIssues[index].status = newStatus;
  localStorage.setItem("issues", JSON.stringify(issues));
  location.reload();
}

// Workload panel
const workloadList = document.getElementById("workloadList");
workloadList.innerHTML = "";
let workload = {};
deptIssues.forEach(issue => {
  let sup = issue.assignedTo || "Unassigned";
  workload[sup] = (workload[sup] || 0) + 1;
});
if (Object.keys(workload).length === 0) {
  workloadList.innerHTML = "<li>No supervisors assigned yet.</li>";
} else {
  for (let sup in workload) {
    let li = document.createElement("li");
    li.textContent = `${sup}: ${workload[sup]} issue(s)`;
    workloadList.appendChild(li);
  }
}

// Escalation panel
const overdueList = document.getElementById("overdueList");
overdueList.innerHTML = "";
if (overdueIssues.length === 0) {
  overdueList.innerHTML = "<li>No overdue issues 🎉</li>";
} else {
  overdueIssues.forEach(issue => {
    let li = document.createElement("li");
    li.textContent = `${issue.title} - ${issue.status}`;
    overdueList.appendChild(li);
  });
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});
