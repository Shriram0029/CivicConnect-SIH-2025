// ✅ Check session
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "FieldSupervisor") {
  alert("Access denied! Field Supervisors only.");
  window.location.href = "login.html";
}

// ✅ Load issues
let issues = JSON.parse(localStorage.getItem("issues")) || [];

// Filter for current supervisor
let assigned = issues.filter(i => i.assignedTo === currentUser.email);

// Stats
const assignedCount = assigned.length;
const resolvedCount = assigned.filter(i => i.status === "Resolved").length;
const pendingCount = assigned.filter(i => i.status !== "Resolved").length;

document.getElementById("assignedCount").textContent = assignedCount;
document.getElementById("resolvedCount").textContent = resolvedCount;
document.getElementById("pendingCount").textContent = pendingCount;

// Render issues
const issueList = document.getElementById("assignedIssues");
issueList.innerHTML = "";

if (assigned.length === 0) {
  issueList.innerHTML = "<li>No issues assigned yet ✅</li>";
} else {
  assigned.forEach(issue => {
    let li = document.createElement("li");
    li.innerHTML = `
      <strong>${issue.title}</strong> - <em>${issue.status}</em>
      <br><small>Deadline: ${issue.deadline || "N/A"}</small>
      <br>
      <button class="action-btn onsite" onclick="updateStatus('${issue.id}', 'On-Site')">On-Site</button>
      <button class="action-btn progress" onclick="updateStatus('${issue.id}', 'In Progress')">In Progress</button>
      <button class="action-btn resolve" onclick="updateStatus('${issue.id}', 'Resolved')">Resolved</button>
      <br>
      <label class="file-upload">Upload Before/After Photo:
        <input type="file" accept="image/*" onchange="uploadPhoto('${issue.id}', this)">
      </label>
    `;
    issueList.appendChild(li);
  });
}

// ✅ Update status
function updateStatus(issueId, newStatus) {
  issues = issues.map(issue => {
    if (issue.id === issueId) {
      issue.status = newStatus;
      issue.updatedAt = new Date().toISOString();
    }
    return issue;
  });

  localStorage.setItem("issues", JSON.stringify(issues));
  location.reload();
}

// ✅ Upload photo
function uploadPhoto(issueId, input) {
  const file = input.files[0];
  if (!file) return;

  issues = issues.map(issue => {
    if (issue.id === issueId) {
      if (!issue.photos) issue.photos = [];
      issue.photos.push(file.name); // store only filename for now
    }
    return issue;
  });

  localStorage.setItem("issues", JSON.stringify(issues));
  alert("Photo uploaded for issue " + issueId);
}

// ✅ Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});
