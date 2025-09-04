// 🔹 Role-based redirection
const user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) {
  window.location.href = "login.html";
}
if (user.role !== "Admin" && user.role !== "DepartmentStaff" && user.role !== "FieldSupervisor") {
   window.location.href = "login.html";
}
// ---- Map (Leaflet) ----
const map = L.map('map').setView([13.0827, 80.2707], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function loadMapData(issues) {
  issues.forEach(issue => {
    L.marker([issue.lat, issue.lng]).addTo(map)
      .bindPopup(`<b>${issue.category}</b><br>Status: ${issue.status}`);
  });
}

// ---- Charts (Chart.js) ----
function loadResolutionChart(data) {
  new Chart(document.getElementById("resolutionChart"), {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [{
        label: "Avg Resolution Time (hrs)",
        data: data.values,
        backgroundColor: "#3498db"
      }]
    }
  });
}

function loadDeptChart(data) {
  new Chart(document.getElementById("deptChart"), {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [{
        label: "Resolved Issues",
        data: data.values,
        backgroundColor: ["#27ae60", "#f39c12", "#8e44ad", "#d35400"]
      }]
    }
  });
}

function loadCategoryChart(data) {
  new Chart(document.getElementById("categoryChart"), {
    type: "pie",
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: ["#e74c3c", "#2ecc71", "#f1c40f", "#3498db"]
      }]
    }
  });
}

// ---- Reports ----
document.getElementById("downloadCSV").addEventListener("click", async () => {
  const res = await fetch("/api/analytics/export/csv?role=" + user.role + "&dept=" + user.department);
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "analytics_report.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
});

document.getElementById("downloadPDF").addEventListener("click", async () => {
  const res = await fetch("/api/analytics/export/pdf?role=" + user.role + "&dept=" + user.department);
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "analytics_report.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
});

// ---- Load Analytics ----
async function initAnalytics() {
  try {
    const res = await fetch(`/api/analytics?role=${user.role}&dept=${user.department}`);
    const data = await res.json();

    loadMapData(data.mapData);
    loadResolutionChart(data.resolutionData);
    loadDeptChart(data.deptData);
    loadCategoryChart(data.categoryData);

  } catch (err) {
    console.error("Error loading analytics:", err);
  }
}

initAnalytics();
