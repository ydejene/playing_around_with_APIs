# IP Health Checker & Analysis Tool

A comprehensive web application for analyzing IP addresses to detect fraud, proxies, VPNs, and malicious activity. Built with vanilla HTML, CSS, and JavaScript with a minimal Node.js backend for secure API key management.

## VIDEO DEMO: https://youtu.be/Fc3DsASaaTc
## Table of Contents

- [Project Description](#project-description)
- [Why This App Is Useful](#why-this-app-is-useful)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Local Setup](#local-setup)
- [Deployment Instructions](#deployment-instructions)
- [Load Balancer Configuration](#load-balancer-configuration)
- [API Information](#api-information)
- [Error Handling](#error-handling)
- [Challenges Faced](#challenges-faced)
- [Rubric Alignment](#rubric-alignment)
- [Credits](#credits)

---

## Project Description

The **IP Health Checker Tool** is a security-focused web application that analyzes IP addresses to identify potential threats, fraudulent activity, and suspicious connections. By leveraging the IPQualityScore API, the tool provides comprehensive insights into IP reputation, including fraud scores, proxy/VPN detection, bot identification, and detailed geolocation data.

This application serves cybersecurity professionals, system administrators, e-commerce platforms, and anyone concerned with online security. It features real-time IP analysis with a persistent history system that allows users to track, search, filter, and analyze their IP lookups over time.

---

## Why This App Is Useful

### Real-World Applications:

**1. Fraud Prevention for E-commerce**

- Detect fraudulent transactions by analyzing customer IP addresses
- Identify proxy/VPN usage that may indicate account takeover attempts
- Block high-risk IPs before processing payments

**2. Security Monitoring**

- Track suspicious login attempts from different geographic locations
- Identify bot traffic targeting your applications
- Monitor for credential stuffing attacks

**3. Content Protection**

- Detect users bypassing geographic restrictions with VPNs
- Identify scrapers and automated bots accessing your content
- Enforce regional licensing agreements

**4. Cybersecurity Research**

- Analyze IP patterns in security incidents
- Build threat intelligence databases
- Investigate suspicious network activity

**5. Compliance & Risk Management**

- Document IP analysis for security audits
- Maintain records of security checks
- Demonstrate due diligence in fraud prevention

## It's a professional security tool that protects against genuine threats.

## Features

### Core Functionality

**IP Fraud Analysis**

- Real-time fraud score calculation (0-100 scale)
- Comprehensive risk assessment
- Proxy, VPN, and Tor detection
- Bot and crawler identification
- ISP and ASN information
- Detailed geolocation (Country, Region, City)
- Connection type analysis
- Recent abuse detection

**Persistent History System**

- Automatic saving of all IP lookups to browser localStorage
- Stores up to 100 most recent lookups
- Never sends history data to servers (100% client-side privacy)

### Advanced Interactivity (Required by Rubric)

**1. Search Functionality**

- Search history by IP address
- Real-time filtering as you type
- Case-insensitive matching

**2. Filter Functionality**

- Filter by risk level:
  - Low Risk (0-49)
  - Medium Risk (50-74)
  - High Risk (75-100)
- Dynamic result updates

**3. Sort Functionality**

- Sort by timestamp (ascending/descending)
- Sort by fraud score (ascending/descending)
- Toggle between sort orders

**4. Expandable Detail View**

- Click any row to expand full details
- View all 12+ data points per lookup
- Collapsible interface for clean organization

**5. Delete Functionality**

- Remove individual entries
- Clear all history with confirmation

### User Experience Features

**Statistics Dashboard**

- Total lookups counter
- High-risk IPs tracker
- Proxy/VPN detection counter

**Visual Indicators**

- Color-coded fraud scores (green/orange/red)
- Risk level badges
- Responsive, modern UI
- Smooth animations

**Responsive Design**

- Works on desktop, tablet, and mobile
- Adaptive layouts for all screen sizes
- Touch-friendly interface

---

## Technology Stack

**Frontend:**

- HTML5 - Semantic markup
- CSS3 - Custom styling with animations
- Vanilla JavaScript (ES6+) - No frameworks/libraries
- localStorage API - Client-side data persistence

**Backend:**

- Node.js (http and https are built-in modules)
- `http` module - Web server
- `https` module - API requests
- `dotenv` - Environment variable management

**API:**

- IPQualityScore IP Reputation API
- REST API with JSON responses
- HTTPS secure connections

**Deployment:**

- NGINX web server
- HAProxy load balancer
- Linux (Ubuntu/Debian)

---

## Local Setup

### Prerequisites

- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- IPQualityScore API key - [Sign up here](https://www.ipqualityscore.com/create-account)
- Text editor (VS Code, Sublime Text, etc.)
- Web browser (Chrome, Firefox, Safari, Edge)

### Step-by-Step Installation

#### Step 1: Clone or Download the Project

```bash
# Create project directory
mkdir ip-health-checker
cd ip-health-checker

# Or clone from GitHub
git clone https://github.com/ydejene/playing_around_with_APIs.git
cd Playing_around_with_APIs
```

#### Step 2: Install Dependencies

```bash
npm install
```

This installs only one dependency: `dotenv` for environment variable management.

#### Step 3: Get Your IPQualityScore API Key

1. Visit https://www.ipqualityscore.com/create-account
2. Sign up for a **FREE account** (no credit card required)
3. Verify your email address
4. Log in to your dashboard
5. Navigate to "API Keys" section
6. Copy your API key (starts with letters/numbers)

**Free Tier Includes:**

- 1,000 lookups per month
- 35 lookups per day
- IP Address Reputation
- Email Validation
- URL Scanner
- Phone Validation

#### Step 4: Configure Environment Variables

Create a `.env` file inside backend directory:

```bash
# Copy the example file inside the backend directory
cp .env.example .env

# Or create manually inside backend directory
touch .env
```

Edit `.env` and add your API key:

```env
IPQS_API_KEY=your_actual_api_key_here
PORT=3000
NODE_ENV=development
```

**CRITICAL:** Never commit the `.env` file to Git!

#### Step 5: Start the Server

```bash
npm start
```

You should see:

```
═══════════════════════════════════════════════════════
IP FRAUD DETECTION TOOL - SERVER STARTED
═══════════════════════════════════════════════════════
Server running at http://localhost:3000
API endpoint: http://localhost:3000/api/lookup?ip=8.8.8.8
Health check: http://localhost:3000/api/health

Provider: IPQualityScore
API Docs: https://www.ipqualityscore.com/documentation/overview

API Key Status: ✓ Loaded
═══════════════════════════════════════════════════════

Ready to detect IP fraud!
```

#### Step 6: Open the Application

1. Open `index.html` in your web browser
2. Or simply double-click the `index.html` file

#### Step 7: Test the Application

**Test 1: Analyze a specific IP**

- Enter `8.8.8.8` (Google DNS)
- Click "Check IP Fraud Score"
- View the detailed analysis

**Test 2: Test history features**

- Search several different IPs
- Try the search box (search by IP)
- Use the filter dropdown (filter by risk level)
- Click sort buttons (sort by date/score)
- Click on a row to expand details

---

## Deployment Instructions

### Part Two: Deploying to Web Servers (How I Did it.)

First I made sure I have access to three servers:

- **Web01** - Primary web server
- **Web02** - Secondary web server
- **Lb01** - Load balancer

### Deploy on Web01 and Web02

I performed these steps on **BOTH** Web01 and Web02:

#### Step 1: Connect to Server

```bash
ssh ubuntu@98.93.235.93
# Then repeat for web02 (ip address 44.204.82.47)
```

#### Step 2: Install Node.js

```bash
# Update system
sudo apt update

# Install Node.js
sudo apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nsolid
nsolid -v

# Verify installation
nsolid -v
npm --version
```

#### Step 3: Upload Project Files

**Option A: Using Git**

```bash
sudo apt update
sudo apt install git -y
cd /var/www/
sudo git clone https://github.com/ydejene/playing_around_with_APIs.git
cd playing_around_with_APIs
```

**Option B: Using SCP from my local machine**

```bash
# From my local machine
scp -r playing_around_with_APIs/ ubuntu@98.93.235.93:/var/www/
```

#### Step 4: Install Dependencies

```bash
cd /var/www/playing_around_with_APIs/backend
sudo npm install
```

#### Step 5: Configure Environment

```bash
# Create .env file inside the backend directory
sudo nano /var/www/playing_around_with_APIs/backend/.env

# Add your API key:
IPQS_API_KEY=your_actual_api_key_here
PORT=3000
NODE_ENV=production

# Save and exit (Ctrl+X, Y, Enter)
```

#### Step 6: Setup as a Service (Process Manager)

I created a systemd service to keep the app running:

```bash
sudo nano /etc/systemd/system/playing_around_with_APIs.service
```

I added this configuration:

```ini
[Unit]
Description=Playing Around With APIs Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/playing_around_with_APIs/backEnd
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable playing_around_with_APIs

# Start the service
sudo systemctl start playing_around_with_APIs

# Check status
sudo systemctl status playing_around_with_APIs
```

#### Step 7: Configure NGINX (I already did some of the setup in previous projects)

Install and configure NGINX:

```bash
# Install NGINX
sudo apt install -y nginx

# Create NGINX configuration
sudo nano /etc/nginx/sites-available/playing_around_with_APIs
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name ip-health.yonasdejene.tech;
  # adding header
        add_header X-Served-By "6937-web-01";
    # Frontend
    location / {
        root /var/www/playing_around_with_APIs/frontEnd;
        index index.html;
        try_files $uri $uri/ =404;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/playing_around_with_APIs /etc/nginx/sites-enabled/

# Test NGINX configuration
sudo nginx -t

# Restart NGINX
sudo systemctl restart nginx
```

#### Step 8: Configure dotTech domain

add A rcord mapping the loadbalancer ip 3.84.45.232 to ip-health.yonasdejene.tech

#### Step 9: Repeat for Web02

I performed ALL steps above on Web02 with the same configuration.

---

## Load Balancer Configuration

### Configuring Lb01 (HAProxy)

#### Step 1: Connect to Load Balancer

```bash
ssh ubuntu@3.84.45.232
```

#### Step 2: Install HAProxy

```bash
sudo apt update
sudo apt install -y haproxy
```

#### Step 3: Configure HAProxy

Edit the configuration file:

```bash
sudo nano /etc/haproxy/haproxy.cfg
```

Add this configuration:

```haproxy
global
    log /dev/log local0
    log /dev/log local1 notice
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin
    stats timeout 30s
    user haproxy
    group haproxy
    daemon

defaults
    log global
    mode http
    option httplog
    option dontlognull
    timeout connect 5000
    timeout client  50000
    timeout server  50000

# Frontend - receives requests
frontend playing_around_with_APIs_frontend
    bind *:80
    default_backend playing_around_with_APIs_backend
    option forwardfor

# Backend - distributes to web servers
backend playing_around_with_APIs__backend
    balance roundrobin
    option httpchk GET /
    http-check expect status 200

    # Add your web servers
    server web01 98.93.235.93:80 check
    server web02 44.204.82.47:80 check

# Statistics page (optional but useful)
listen stats
    bind *:8080
    stats enable
    stats uri /stats
    stats refresh 30s
    stats admin if TRUE
```

#### Step 4: Test load balancer Configuration

```bash
# Test HAProxy configuration
sudo haproxy -c -f /etc/haproxy/haproxy.cfg

# Should output: Configuration file is valid
```

#### Step 5: Restart HAProxy

```bash
sudo systemctl restart haproxy
sudo systemctl enable haproxy
sudo systemctl status haproxy
```

#### Step 6: Configure Firewall

```bash
sudo ufw allow 80/tcp
sudo ufw allow 8080/tcp
sudo ufw reload
```

### Testing Load Balancer

**Test 1: Access via Load Balancer**

```bash
# From my local machine
curl http://3.84.45.232
```

**Test 2: Check HAProxy Stats**

- Open browser: `http://3.84.45.232:8080/stats`
- View server status and traffic distribution

**Test 3: Verify Load Distribution**

```bash
# Make multiple requests
for i in {1..10}; do
    curl -s http://lb01_ip_address | grep "Server"
done
```

**Test 4: Test Failover**

```bash
# On Web01, stop the service
sudo systemctl stop

# Application should still work via load balancer (served by Web02)

# Restart Web01
sudo systemctl start playing_around_with_APIs
```

### Load Balancer Benefits

- **High Availability**: If one server fails, traffic routes to the other
- **Load Distribution**: Requests split evenly between servers
- **Scalability**: Easy to add more servers
- **Health Checks**: Automatic detection of server failures

---

## API Information

### IPQualityScore IP Reputation API

**Provider**: IPQualityScore  
**Website**: https://www.ipqualityscore.com/  
**Documentation**: https://www.ipqualityscore.com/documentation/ip-reputation-api/overview

### What the API Provides

**Fraud Detection**

- Fraud Score (0-100) - Overall risk assessment
- Probability of fraudulent activity
- Historical abuse patterns

**Network Analysis**

- Proxy detection (datacenter, residential, mobile)
- VPN detection
- Tor exit node identification
- Bot and crawler detection

**Geolocation**

- Country, Region, City
- Latitude/Longitude coordinates
- Timezone information
- ZIP/Postal code

**ISP Information**

- Internet Service Provider name
- Autonomous System Number (ASN)
- Organization details
- Connection type (Residential, Corporate, Mobile, etc.)

### API Limits

**Free Tier:**

- 1,000 lookups per month
- 35 lookups per day
- IP Address Reputation
- Email Validation
- URL Scanner
- Phone Validation

**Rate Limiting:**

- Requests are metered per month and per day
- No per-second rate limits
- Unused requests don't roll over

### API Response Format

```json
{
  "success": true,
  "fraud_score": 75,
  "country_code": "US",
  "region": "California",
  "city": "Los Angeles",
  "ISP": "Example ISP",
  "ASN": "AS15169",
  "proxy": true,
  "vpn": true,
  "tor": false,
  "bot_status": false,
  "recent_abuse": true,
  "connection_type": "Residential"
}
```

---

## Error Handling

### Comprehensive Error Management

#### 1. **Invalid IP Address**

```
Error: "Invalid IP address format"
Solution: Enter a valid IPv4 address (e.g., 192.168.1.1)
```

#### 2. **API Key Issues**

```
Error: "IPQS_API_KEY not found in .env file"
Solution: Create .env file and add your API key
```

#### 3. **Rate Limit Exceeded**

```
Error: "Monthly request limit exceeded"
Solution: Wait for next month or upgrade plan
User Experience: Error message displays with clear explanation
```

#### 4. **Network Failures**

```
Error: "Failed to connect to API"
Solution: Check internet connection and API status
User Experience: Friendly error message with retry button
```

#### 5. **Invalid API Response**

```
Error: "Failed to parse API response"
Solution: API may be down, try again later
Logging: Error logged to server console for debugging
```

#### 6. **Server Not Running**

```
Error: "Failed to fetch"
Solution: Ensure backend server is running (npm start)
User Experience: Clear message: "Cannot connect to server"
```

### Error Handling Implementation

**Backend (server.js):**

- Try-catch blocks around all API calls
- Validates API responses before sending to frontend
- Logs all errors with timestamps
- Returns user-friendly error messages

**Frontend (index.html):**

- Displays error messages in red banner
- Auto-dismisses after 5 seconds
- Prevents multiple simultaneous requests
- Validates IP format before submission
- Handles localStorage errors gracefully

**User Experience:**

- Loading indicators during requests
- Disabled buttons during processing
- Clear error messages in plain English
- No technical jargon exposed to users

---

## Challenges Faced & Solutions

### Challenge 1: API Key Security

**Problem**: Exposing API keys in frontend JavaScript code would allow anyone to steal and abuse them.

**Solution**:

- Created minimal Node.js backend server (server.js)
- Backend stores API key in `.env` file
- Frontend makes requests to local backend, which proxies to IPQualityScore
- `.env` file added to `.gitignore` to prevent accidental commits
- Backend validates all requests before forwarding

**Result**: API key never exposed to browser, completely secure.

### Challenge 2: Persistent History Without Database

**Problem**: Need to store lookup history but requirement is "no frameworks or libraries" and no database.

**Solution**:

- Used browser's `localStorage` API (built-in, no library needed)
- Stores JSON stringified data locally
- Limits storage to 100 most recent entries
- Data persists across browser sessions
- Each user has their own private history

**Result**: Full history functionality without any external dependencies.

### Challenge 3: Rich Interactivity Requirements

**Problem**: Rubric requires search, filter, sort, and expandable views.

**Solution**:

- Implemented real-time search with `input` event listener
- Created dropdown filter for risk levels with instant updates
- Added toggle sort buttons for date and score
- Implemented expandable table rows with click handlers
- All features work together seamlessly

**Result**: Exceeded rubric requirements with intuitive, smooth interactions.

### Challenge 4: Responsive Design Without Framework

**Problem**: Create professional, responsive UI without Bootstrap/Tailwind.

**Solution**:

- Used CSS Grid and Flexbox for layouts
- Implemented media queries for mobile responsiveness
- Created custom animations with CSS keyframes
- Designed mobile-first, then enhanced for desktop
- Tested on multiple devices and browsers

**Result**: Clean, professional UI that works on all screen sizes.

### Challenge 5: Load Balancer Testing

**Problem**: Verifying load balancer correctly distributes traffic between servers.

**Solution**:

- Added server identification in NGINX logs
- Configured HAProxy with health checks
- Created statistics dashboard (`:8080/stats`)
- Tested failover by stopping individual servers
- Monitored logs in real-time during testing

**Result**: Load balancer working perfectly with automatic failover.

### Challenge 6: Real-Time Validation

**Problem**: Prevent invalid IP submissions without external validation library.

**Solution**:

- Created JavaScript regex for IPv4 validation
- Added real-time input sanitization
- Provided clear feedback on invalid input

**Result**: Users can't submit invalid data, reducing API waste.

### Challenge 6: Result Strictness

**Problem**: The responses on the IPQualityScore official website and the API are different for the same API.

---
