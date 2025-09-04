// Check session (Only Department Staff allowed)
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "DepartmentStaff") {
  alert("Access denied! Department Staff only.");
  window.location.href = "login.html";
}

// Load issues and users
let issues = JSON.parse(localStorage.getItem("issues")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];

// Filter only department issues that are unassigned
let deptIssues = issues.filter(i => i.department === currentUser.department);
let unassignedIssues = deptIssues.filter(i => !i.assignedTo);

// Supervisors of this department
let supervisors = users.filter(u => u.role === "FieldSupervisor" && u.department === currentUser.department);

// Render unassigned issues
const issueTableBody = document.getElementById("issueTableBody");
issueTableBody.innerHTML = "";

if (unassignedIssues.length === 0) {
  issueTableBody.innerHTML = `<tr><td colspan="7">No unassigned issues 🎉</td></tr>`;
} else {
  unassignedIssues.forEach(issue => {
    let row = document.createElement("tr");
    row.innerHTML = `
      <td>${issue.id}</td>
      <td>${issue.title}</td>
      <td>${issue.category || "-"}</td>
      <td>${issue.priority || "Normal"}</td>
      <td>${issue.deadline || "N/A"}</td>
      <td>${issue.status}</td>
      <td>
        <select id="assignSelect-${issue.id}">
          <option value="">-- Select Supervisor --</option>
          ${supervisors.map(s => `<option value="${s.email}">${s.fullname}</option>`).join("")}
        </select>
        <button class="assign-btn" onclick="assignIssue('${issue.id}')">Assign</button>
      </td>
    `;
    issueTableBody.appendChild(row);
  });
}

// Assign issue to supervisor
function assignIssue(issueId) {
  let select = document.getElementById(`assignSelect-${issueId}`);
  let supervisorEmail = select.value;

  if (!supervisorEmail) {
    alert("Please select a supervisor!");
    return;
  }

  issues = issues.map(issue => {
    if (issue.id === issueId) {
      issue.assignedTo = supervisorEmail;
      issue.status = "Assigned";
      issue.updatedAt = new Date().toISOString();
    }
    return issue;
  });

  localStorage.setItem("issues", JSON.stringify(issues));

  // Add to live updates
  addLiveUpdate(`Issue #${issueId} assigned to ${supervisorEmail}`);

  location.reload();
}

// Render team workload
const teamList = document.getElementById("teamList");
teamList.innerHTML = "";

if (supervisors.length === 0) {
  teamList.innerHTML = "<p>No supervisors registered for this department.</p>";
} else {
  supervisors.forEach(sup => {
    let supIssues = deptIssues.filter(i => i.assignedTo === sup.email);
    let open = supIssues.filter(i => i.status !== "Resolved").length;
    let resolved = supIssues.filter(i => i.status === "Resolved").length;

    let card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `
      <h3>${sup.fullname}</h3>
      <p>Assigned: ${supIssues.length}</p>
      <p>Open: ${open}</p>
      <p>Resolved: ${resolved}</p>
    `;
    teamList.appendChild(card);
  });
}

// Live updates list
const updatesList = document.getElementById("updatesList");
let updates = JSON.parse(localStorage.getItem("liveUpdates")) || [];

// Render live updates
function renderUpdates() {
  updatesList.innerHTML = "";
  if (updates.length === 0) {
    updatesList.innerHTML = "<li>No updates yet.</li>";
  } else {
    updates.slice(-10).forEach(u => {
      let li = document.createElement("li");
      li.textContent = `${u.time} - ${u.text}`;
      updatesList.appendChild(li);
    });
  }
}
renderUpdates();

// Add update
function addLiveUpdate(text) {
  const update = {
    text,
    time: new Date().toLocaleString()
  };
  updates.push(update);
  localStorage.setItem("liveUpdates", JSON.stringify(updates));
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});
