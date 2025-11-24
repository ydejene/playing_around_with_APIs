// server.js - Simple backend for IPQualityScore API
require("dotenv").config();
const http = require("http");
const https = require("https");
const url = require("url");

// Configuration
const CONFIG = {
  IPQS_API_KEY: process.env.IPQS_API_KEY,
  PORT: process.env.PORT || 3000,
};

// Validate API key
if (!CONFIG.IPQS_API_KEY) {
  console.error("ERROR: IPQS_API_KEY not found in .env file!");
  console.error("Please create a .env file with your IPQualityScore API key.");
  console.error(
    "Get your free API key at: https://www.ipqualityscore.com/create-account"
  );
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // Enable CORS-cross orgin resource sharing
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);

  // Route: /api/lookup - IP Healthe Checker
  if (parsedUrl.pathname === "/api/lookup" && req.method === "GET") {
    const ipAddress = parsedUrl.query.ip || "";

    // console.log(`Looking up IP: ${ipAddress || 'auto-detect'}`);

    lookupIP(ipAddress)
      .then((data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Lookup Error:", error.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: true,
            message: error.message,
          })
        );
      });
  }
  // Health check endpoint
  else if (parsedUrl.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        message: "IP Health Checker API Server",
        provider: "IPQualityScore",
      })
    );
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

// IPQualityScore IP Lookup
function lookupIP(ipAddress) {
  return new Promise((resolve, reject) => {
    // IPQualityScore API endpoint
    const apiUrl = `https://ipqualityscore.com/api/json/ip/${CONFIG.IPQS_API_KEY}/${ipAddress}`;

    const options = {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPad; CPU OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1/1.0",
      },
    };

    https
      .get(apiUrl, options, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
          data += chunk;
        });

        apiRes.on("end", () => {
          try {
            const parsed = JSON.parse(data);

            // Check if API returned an error
            if (parsed.success === false) {
              reject(new Error(parsed.message || "API request failed"));
              return;
            }

            // Transform response to our format
            const result = {
              success: true,
              ip: parsed.host || ipAddress,
              fraud_score: parsed.fraud_score || 0,
              risk_score: parsed.fraud_score || 0, // IPQS uses fraud_score as primary metric
              country_code: parsed.country_code || "Unknown",
              region: parsed.region || "Unknown",
              city: parsed.city || "Unknown",
              ISP: parsed.ISP || "Unknown",
              ASN: parsed.ASN || "N/A",
              organization: parsed.organization || "Unknown",
              latitude: parsed.latitude || null,
              longitude: parsed.longitude || null,
              timezone: parsed.timezone || "Unknown",
              proxy: parsed.proxy || false,
              vpn: parsed.vpn || false,
              tor: parsed.tor || false,
              bot_status: parsed.bot_status || false,
              recent_abuse: parsed.recent_abuse || false,
              connection_type: parsed.connection_type || "Unknown",
              abuse_velocity: parsed.abuse_velocity || "none",
              zip_code: parsed.zip_code || "N/A",
              is_crawler: parsed.is_crawler || false,
              mobile: parsed.mobile || false,
            };

            // console.log(
            //   `IP ${result.ip} - Fraud Score: ${result.fraud_score}`
            // );
            resolve(result);
          } catch (error) {
            console.error("Parse error:", error);
            reject(new Error("Failed to parse API response"));
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

server.listen(CONFIG.PORT, () => {
  console.log("═══════════════════════════════════════════════════════");
  console.log("IP Health Checker DETECTION TOOL - SERVER STARTED");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`Server running at http://localhost:${CONFIG.PORT}`);
  console.log(
    `API endpoint: http://localhost:${CONFIG.PORT}/api/lookup?ip=8.8.8.8`
  );
});
