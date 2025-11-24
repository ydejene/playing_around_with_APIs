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

