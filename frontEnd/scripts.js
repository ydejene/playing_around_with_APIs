const API_BASE_URL = "http://localhost:3000/api";
const STORAGE_KEY = "ipHealthHistory";

// dome elements stored in variables for easy access
const ipInput = document.getElementById("ipInput");
const checkBtn = document.getElementById("checkBtn");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const resultCard = document.getElementById("resultCard");
const fraudScoreDisplay = document.getElementById("fraudScoreDisplay");
const resultGrid = document.getElementById("resultGrid");
const historyBody = document.getElementById("historyBody");
const searchHistory = document.getElementById("searchHistory");
const filterFraud = document.getElementById("filterFraud");
const sortDate = document.getElementById("sortDate");
const sortScore = document.getElementById("sortScore");
const clearHistory = document.getElementById("clearHistory");
const statsBar = document.getElementById("statsBar");

let allHistory = [];
let currentSortOrder = "date-desc";
let expandedRow = null;

// binding the eventlisteners
checkBtn.addEventListener("click", checkIP);
// allowing accessebility through the keyboard
ipInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") checkIP();
});
searchHistory.addEventListener("input", filterAndDisplayHistory);
filterFraud.addEventListener("change", filterAndDisplayHistory);
sortDate.addEventListener("click", () => sortHistory("date"));
sortScore.addEventListener("click", () => sortHistory("score"));
clearHistory.addEventListener("click", clearAllHistory);

// Load history on page load
loadHistory();
updateStats();

async function checkIP() {
  // remove extra white space with trim
  const ip = ipInput.value.trim();

  // Validate IP format
  const ipv4Pattern =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

  if (!ipv4Pattern.test(ip)) {
    showError("Invalid IP address format.");
    return;
  }
  // loading spinner
  loading.style.display = "block";
  resultCard.style.display = "none";
  errorMessage.style.display = "none";
  checkBtn.disabled = true;

  try {
    if (!ip) {
      showError("Please input Ip address!");
      return;
    }
    //  using ternary operator check if ip exists
    const endpoint = `/lookup?ip=${encodeURIComponent(ip)}`;
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.message || "API returned an error");
    }

    // passing the data returned as an argument to the following fucntions below
    displayResults(data);
    saveToHistory(data);
    // after fetching new data load the history again and update the stats
    loadHistory();
    updateStats();
  } catch (error) {
    console.error("Lookup error:", error);
    // displaying the error to the user on the UI
    showError(`Failed to check IP: ${error.message}`);
  } finally {
    // after data is fetched or error response is returned change the spinner style and make the button enabled
    loading.style.display = "none";
    checkBtn.disabled = false;
  }
}

function displayResults(data) {
  resultCard.style.display = "block";

  // Fraud Score
  const fraudScore = data.fraud_score || 0;
  const scoreClass =
    // checking the risk and frauld level for sorting and labling them with different colors
    fraudScore < 50
      ? "score-low"
      : fraudScore < 75
      ? "score-medium"
      : "score-high";
  const riskLevel =
    fraudScore < 50
      ? "LOW RISK"
      : fraudScore < 75
      ? "MEDIUM RISK"
      : "HIGH RISK";

  fraudScoreDisplay.innerHTML = `
                <div class="${scoreClass}">${fraudScore}</div>
                <div style="font-size: 18px; color: #666;">Fraud Score - ${riskLevel}</div>
            `;

  // Result Grid
  resultGrid.innerHTML = `
                <div class="result-item">
                    <div class="result-label">IP Address</div>
                    <div class="result-value">${data.ip || "N/A"}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Fraud Score</div>
                    <div class="result-value ${scoreClass}">${fraudScore}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Risk Score</div>
                    <div class="result-value">${
                      data.risk_score || data.fraud_score || 0
                    }</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Proxy Detected</div>
                    <div class="result-value">${
                      data.proxy ? "✓ Yes" : "✗ No"
                    }</div>
                </div>
                <div class="result-item">
                    <div class="result-label">VPN Detected</div>
                    <div class="result-value">${
                      data.vpn ? "✓ Yes" : "✗ No"
                    }</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Bot Detected</div>
                    <div class="result-value">${
                      data.bot_status ? "✓ Yes" : "✗ No"
                    }</div>
                </div>
                <div class="result-item">
                    <div class="result-label">ISP</div>
                    <div class="result-value">${data.ISP || "Unknown"}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">ASN</div>
                    <div class="result-value">${data.ASN || "N/A"}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Country</div>
                    <div class="result-value">${
                      data.country_code || "Unknown"
                    }</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Region</div>
                    <div class="result-value">${data.region || "Unknown"}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">City</div>
                    <div class="result-value">${data.city || "Unknown"}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Connection Type</div>
                    <div class="result-value">${
                      data.connection_type || "Unknown"
                    }</div>
                </div>
            `;
}

// history is saved in the local storeage (user side) then different methods can be applied
function saveToHistory(data) {
  const historyItem = {
    id: Date.now(),
    ip: data.ip,
    timestamp: new Date().toISOString(),
    fraud_score: data.fraud_score || 0,
    risk_score: data.risk_score || data.fraud_score || 0,
    proxy: data.proxy || false,
    vpn: data.vpn || false,
    bot: data.bot_status || false,
    isp: data.ISP || "Unknown",
    asn: data.ASN || "N/A",
    country: data.country_code || "Unknown",
    region: data.region || "Unknown",
    city: data.city || "Unknown",
    connection_type: data.connection_type || "Unknown",
  };

  // since the data is stored as key value pair in the local storage, we have created a custom key above
  let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  // an array method to add new element at index 0 here in our cases makes them recent data in our history record
  history.unshift(historyItem);

  // Keep only last 100 entries
  if (history.length > 100) {
    history = history.slice(0, 100);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function loadHistory() {
  allHistory = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  filterAndDisplayHistory();
}

function filterAndDisplayHistory() {
  let filtered = [...allHistory];

  // Search filter
  const searchTerm = searchHistory.value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter((item) =>
      item.ip.toLowerCase().includes(searchTerm)
    );
  }

  // Fraud score filter
  const fraudFilter = filterFraud.value;
  if (fraudFilter !== "all") {
    filtered = filtered.filter((item) => {
      const score = item.fraud_score;
      if (fraudFilter === "low") return score < 50;
      if (fraudFilter === "medium") return score >= 50 && score < 75;
      if (fraudFilter === "high") return score >= 75;
      return true;
    });
  }

  // Sort
  if (currentSortOrder.startsWith("date")) {
    filtered.sort((a, b) => {
      const diff = new Date(b.timestamp) - new Date(a.timestamp);
      return currentSortOrder === "date-desc" ? diff : -diff;
    });
  } else {
    filtered.sort((a, b) => {
      const diff = b.fraud_score - a.fraud_score;
      return currentSortOrder === "score-desc" ? diff : -diff;
    });
  }

  displayHistory(filtered);
}

function displayHistory(history) {
  if (history.length === 0) {
    historyBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="empty-state">
                            <div class="empty-state-text">!Empty</div>
                            <div>No matching results found</div>
                        </td>
                    </tr>
                `;
    statsBar.style.display = "none";
    return;
  }

  statsBar.style.display = "flex";

  historyBody.innerHTML = history
    .map((item) => {
      const riskClass =
        item.fraud_score < 50
          ? "badge-success"
          : item.fraud_score < 75
          ? "badge-warning"
          : "badge-danger";
      const riskLabel =
        item.fraud_score < 50
          ? "Low"
          : item.fraud_score < 75
          ? "Medium"
          : "High";
      const proxyVpn = item.proxy || item.vpn ? "Yes" : "No";
      const date = new Date(item.timestamp);

      return `
                    <tr onclick="toggleDetails(${item.id})" id="row-${item.id}">
                        <td><strong>${item.ip}</strong></td>
                        <td>${date.toLocaleString()}</td>
                        <td><strong>${item.fraud_score}</strong></td>
                        <td><span class="badge ${riskClass}">${riskLabel}</span></td>
                        <td>${proxyVpn}</td>
                        <td>${item.country}</td>
                        <td><button class="btn-secondary btn-small" onclick="event.stopPropagation(); deleteEntry(${
                          item.id
                        })">Delete</button></td>
                    </tr>
                    <tr id="details-${item.id}" style="display: none;">
                        <td colspan="7" class="details-cell">
                            <div class="details-grid">
                                <div class="detail-item">
                                    <div class="result-label">Risk Score</div>
                                    <div>${item.risk_score}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="result-label">Proxy</div>
                                    <div>${item.proxy ? "Yes" : "No"}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="result-label">VPN</div>
                                    <div>${item.vpn ? "Yes" : "No"}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="result-label">Bot</div>
                                    <div>${item.bot ? "Yes" : "No"}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="result-label">ISP</div>
                                    <div>${item.isp}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="result-label">ASN</div>
                                    <div>${item.asn}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="result-label">Region</div>
                                    <div>${item.region}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="result-label">City</div>
                                    <div>${item.city}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="result-label">Connection Type</div>
                                    <div>${item.connection_type}</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
    })
    .join("");
}

function toggleDetails(id) {
  const detailsRow = document.getElementById(`details-${id}`);
  const mainRow = document.getElementById(`row-${id}`);
  // exanding row let's one see the details of the previous ip lookups results
  if (expandedRow && expandedRow !== id) {
    document.getElementById(`details-${expandedRow}`).style.display = "none";
    document
      .getElementById(`row-${expandedRow}`)
      .classList.remove("expandable-row");
  }

  if (detailsRow.style.display === "none") {
    detailsRow.style.display = "table-row";
    mainRow.classList.add("expandable-row");
    expandedRow = id;
  } else {
    detailsRow.style.display = "none";
    mainRow.classList.remove("expandable-row");
    expandedRow = null;
  }
}

function deleteEntry(id) {
  if (!confirm("Delete this entry?")) return;

  let history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  history = history.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

  loadHistory();
  updateStats();
}

function sortHistory(type) {
  if (type === "date") {
    currentSortOrder =
      currentSortOrder === "date-desc" ? "date-asc" : "date-desc";
    sortDate.textContent = `Sort by Date ${
      currentSortOrder === "date-desc" ? "↓" : "↑"
    }`;
  } else {
    currentSortOrder =
      currentSortOrder === "score-desc" ? "score-asc" : "score-desc";
    sortScore.textContent = `Sort by Score ${
      currentSortOrder === "score-desc" ? "↓" : "↑"
    }`;
  }
  filterAndDisplayHistory();
}

// clearing all the history from the user UI
function clearAllHistory() {
  if (
    !confirm(
      "Are you sure you want to clear all history? This cannot be undone."
    )
  )
    return;

  localStorage.removeItem(STORAGE_KEY);
  allHistory = [];
  filterAndDisplayHistory();
  updateStats();
}

function updateStats() {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  document.getElementById("totalLookups").textContent = history.length;
  document.getElementById("highRiskCount").textContent = history.filter(
    (item) => item.fraud_score >= 75
  ).length;
  document.getElementById("proxyCount").textContent = history.filter(
    (item) => item.proxy || item.vpn
  ).length;
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 5000);
}

// Make functions global for onclick (redundant as they are already global but helps for clarity)
window.toggleDetails = toggleDetails;
window.deleteEntry = deleteEntry;
