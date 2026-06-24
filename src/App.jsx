import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// HARD-CODED 7-DAY CURRICULUM DATA
// ============================================================

const CURRICULUM = {
  1: {
    day: 1,
    title: "Network Foundations",
    objective: "Instant DHCP vs DNS separation",
    topics: ["DHCP", "DNS", "IP Address", "Subnet Mask", "Default Gateway"],
    flashcards: [
      { id: "f1_1", front: "DHCP", back: "Dynamic Host Configuration Protocol — automatically assigns IP address, subnet mask, default gateway, and DNS server to devices on a network.", difficulty: "medium", category: "Networking" },
      { id: "f1_2", front: "DNS", back: "Domain Name System — translates human-readable domain names (google.com) into IP addresses. Like a phone book for the internet.", difficulty: "medium", category: "Networking" },
      { id: "f1_3", front: "IP Address", back: "A unique numerical label (e.g. 192.168.1.10) assigned to each device on a network. Used for identification and routing.", difficulty: "easy", category: "Networking" },
      { id: "f1_4", front: "Subnet Mask", back: "Defines which portion of an IP address is the network vs. host. Common: 255.255.255.0 (/24). Used to determine if traffic stays local or goes to gateway.", difficulty: "hard", category: "Networking" },
      { id: "f1_5", front: "Default Gateway", back: "The router's IP address on the local network. Traffic destined for outside the subnet is sent here first.", difficulty: "easy", category: "Networking" },
      { id: "f1_6", front: "APIPA", back: "Automatic Private IP Addressing — when DHCP fails, Windows assigns itself a 169.254.x.x address so local communication is still possible.", difficulty: "hard", category: "Networking" },
      { id: "f1_7", front: "What range is APIPA?", back: "169.254.0.1 – 169.254.255.254 with a /16 subnet mask (255.255.0.0). Assigned automatically when DHCP server is unreachable.", difficulty: "hard", category: "Networking" },
      { id: "f1_8", front: "What does DHCP assign?", back: "Four things: (1) IP address, (2) Subnet mask, (3) Default gateway, (4) DNS server address.", difficulty: "medium", category: "Networking" },
    ],
    quiz: [
      { id: "q1_1", question: "A workstation shows an IP of 169.254.45.12. What is the most likely cause?", options: ["DNS server is down", "DHCP server is unreachable", "Default gateway is misconfigured", "Subnet mask is wrong"], answer: 1, explanation: "169.254.x.x is an APIPA address — Windows self-assigns this when it cannot reach a DHCP server. The device has no valid IP lease." },
      { id: "q1_2", question: "Which service is responsible for translating 'google.com' into an IP address?", options: ["DHCP", "DNS", "Default Gateway", "Subnet Mask"], answer: 1, explanation: "DNS (Domain Name System) resolves domain names to IP addresses. DHCP handles IP assignment, not name resolution." },
      { id: "q1_3", question: "A user can ping 8.8.8.8 but cannot reach google.com. Which service is failing?", options: ["DHCP", "Default Gateway", "DNS", "Subnet Mask"], answer: 2, explanation: "Pinging an IP works (routing is fine), but the domain name fails to resolve — this is a DNS failure. DHCP is not involved in name resolution." },
      { id: "q1_4", question: "What does the Default Gateway provide?", options: ["IP address assignment", "Name resolution", "A path to reach networks outside the local subnet", "Encryption for traffic"], answer: 2, explanation: "The default gateway (typically the router) provides the exit point for traffic destined outside the local network segment." },
      { id: "q1_5", question: "Which protocol automatically provides IP configuration to client devices?", options: ["DNS", "HTTP", "DHCP", "FTP"], answer: 2, explanation: "DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses and network configuration to clients." },
      { id: "q1_6", question: "A subnet mask of 255.255.255.0 means:", options: ["All 32 bits are host bits", "First 24 bits are network, last 8 are host", "First 8 bits are network, last 24 are host", "The address is a class B network"], answer: 1, explanation: "255.255.255.0 = /24. First 3 octets (24 bits) define the network, last octet (8 bits) = up to 254 usable hosts." },
    ],
    scenarios: [
      { id: "s1_1", title: "169.254.x.x Address", situation: "A user calls saying their computer shows an IP address of 169.254.88.42 and they cannot access anything on the network. Wi-Fi shows as connected.", question: "What is the root cause and what should you check first?", answer: "This is an APIPA address — the device failed to get a lease from the DHCP server. Check: (1) Is the DHCP server running? (2) Is the network cable/Wi-Fi actually connected to the correct network? (3) Try: ipconfig /release then ipconfig /renew. If DHCP responds, you'll get a valid IP. If not, the DHCP server or the path to it is down.", keyPoints: ["APIPA = DHCP failure", "169.254.x.x = self-assigned", "Fix: ipconfig /release + /renew", "Check DHCP server status"] },
      { id: "s1_2", title: "Wi-Fi Connected, No Internet", situation: "A laptop shows Wi-Fi connected with full bars. The user can see other computers on the local network, but no websites load and internet apps time out.", question: "Walk through your diagnosis. What are the three layers you check?", answer: "Layer 1 — Physical/IP: Run ipconfig. Does the device have a valid IP (not 169.254.x.x)? Layer 2 — Gateway: Ping the default gateway. If it fails, traffic can't leave the LAN. Layer 3 — DNS: Ping 8.8.8.8 (Google's IP). If that works but google.com doesn't, DNS is failing. Fix DNS by changing DNS server or running ipconfig /flushdns.", keyPoints: ["Check IP first (ipconfig)", "Ping default gateway", "Ping 8.8.8.8 to isolate DNS vs routing", "DNS failure = can ping IPs but not domains"] },
    ],
  },
  2: {
    day: 2,
    title: "Network Devices + Flow",
    objective: "Understand traffic flow (LAN vs WAN)",
    topics: ["Router", "Switch", "Modem", "Access Point", "Firewall"],
    flashcards: [
      { id: "f2_1", front: "Router", back: "Routes traffic BETWEEN networks (LAN to WAN). Operates at Layer 3 (Network). Assigns local IPs via DHCP and connects your network to the internet.", difficulty: "easy", category: "Devices" },
      { id: "f2_2", front: "Switch", back: "Connects devices WITHIN a LAN. Operates at Layer 2 (Data Link). Uses MAC addresses to forward frames only to the correct port. More efficient than a hub.", difficulty: "easy", category: "Devices" },
      { id: "f2_3", front: "Modem", back: "Modulates/demodulates signal between your ISP and your local network. Converts analog (cable/DSL) to digital. Connects WAN to your router.", difficulty: "medium", category: "Devices" },
      { id: "f2_4", front: "Access Point (AP)", back: "Extends a wired network wirelessly. Connects to a switch via Ethernet and broadcasts Wi-Fi. Does NOT route — it bridges wireless clients to the LAN.", difficulty: "medium", category: "Devices" },
      { id: "f2_5", front: "Firewall", back: "Monitors and controls incoming/outgoing network traffic based on rules. Can be hardware or software. Protects network from unauthorized access.", difficulty: "medium", category: "Devices" },
      { id: "f2_6", front: "Hub", back: "Layer 1 device that broadcasts data to ALL ports (creates collisions). Obsolete — replaced by switches. No MAC address intelligence.", difficulty: "easy", category: "Devices" },
      { id: "f2_7", front: "What layer does a Switch operate on?", back: "Layer 2 — Data Link. Uses MAC addresses. Contrast with Router (Layer 3, uses IP addresses).", difficulty: "hard", category: "Devices" },
      { id: "f2_8", front: "LAN vs WAN", back: "LAN (Local Area Network) = your internal network. WAN (Wide Area Network) = external/internet. Router is the bridge between them.", difficulty: "easy", category: "Devices" },
    ],
    quiz: [
      { id: "q2_1", question: "Which device connects your internal network to the internet?", options: ["Switch", "Access Point", "Router", "Hub"], answer: 2, explanation: "The router connects LAN to WAN (internet). It operates at Layer 3 and routes traffic between different networks." },
      { id: "q2_2", question: "A switch forwards data based on which address type?", options: ["IP Address", "MAC Address", "Domain Name", "Port Number"], answer: 1, explanation: "Switches operate at Layer 2 and use MAC addresses to forward frames to the correct port within a LAN." },
      { id: "q2_3", question: "What is the role of a modem in a home network?", options: ["Assign IP addresses to local devices", "Connect wireless devices to the LAN", "Convert ISP signal to usable digital data", "Filter malicious traffic"], answer: 2, explanation: "A modem modulates/demodulates signals between your ISP (cable, DSL, fiber) and your local network equipment." },
      { id: "q2_4", question: "A wireless access point is connected to a switch. What does it do?", options: ["Routes traffic to the internet", "Assigns IP addresses", "Extends the LAN wirelessly", "Filters packets by IP"], answer: 2, explanation: "An AP bridges wireless clients to the existing wired LAN. It does not route — it operates at Layer 2." },
      { id: "q2_5", question: "All computers on a network lose internet but can still see each other. Which device is most likely failing?", options: ["Switch", "Access Point", "NIC", "Router/Modem"], answer: 3, explanation: "Local communication (LAN) works fine = the switch is OK. Internet is down = the WAN-facing device (router or modem) has failed." },
      { id: "q2_6", question: "Which device would you replace a hub with to reduce network collisions?", options: ["Router", "Switch", "Modem", "Firewall"], answer: 1, explanation: "Switches replaced hubs. Unlike hubs (which broadcast to all ports), switches forward frames only to the destination MAC address port — eliminating collisions." },
    ],
    scenarios: [
      { id: "s2_1", title: "Entire Network Down", situation: "All 15 computers in an office lose internet access simultaneously. Users can still print to the network printer and access shared drives.", question: "What device has failed and why do you suspect it?", answer: "The router or modem has failed. Evidence: LAN communication works (switch is fine), but WAN (internet) is dead for all devices. The switch connects local devices — it's working since printing/shared drives work. The router/modem is the single point of failure for internet access. Steps: (1) Check router/modem lights, (2) Restart modem first, then router, (3) Contact ISP if modem shows no WAN signal.", keyPoints: ["LAN works = switch is OK", "Internet dead = router/modem failure", "All devices affected = single WAN device failed", "Restart modem before router"] },
      { id: "s2_2", title: "Only Local Network Working", situation: "One user's computer cannot reach the internet but can ping other devices on the LAN. Running ipconfig shows a valid 192.168.1.x IP address.", question: "Systematically diagnose where the fault lies.", answer: "Valid IP means DHCP worked. Can reach LAN = NIC and switch connection fine. Can't reach internet = check default gateway. Run: ping [default gateway IP]. If gateway ping fails — NIC config issue or routing problem. If gateway ping succeeds — ping 8.8.8.8. If that fails = router/ISP issue. If 8.8.8.8 works but websites don't load = DNS failure. Check DNS settings with ipconfig /all.", keyPoints: ["Valid IP = DHCP OK", "LAN reachable = local hardware OK", "Ping gateway → ping 8.8.8.8 → ping domain name", "Isolates: routing vs DNS"] },
    ],
  },
  3: {
    day: 3,
    title: "Ports + Protocols",
    objective: "Instant port recall under 3 seconds",
    topics: ["HTTP:80", "HTTPS:443", "DNS:53", "SSH:22", "RDP:3389", "SMTP:25", "POP3:110", "IMAP:143"],
    flashcards: [
      { id: "f3_1", front: "Port 80", back: "HTTP — HyperText Transfer Protocol. Unencrypted web traffic. Default port for web servers.", difficulty: "easy", category: "Ports" },
      { id: "f3_2", front: "Port 443", back: "HTTPS — HTTP Secure. Encrypted web traffic using TLS/SSL. Always use this for sensitive data.", difficulty: "easy", category: "Ports" },
      { id: "f3_3", front: "Port 53", back: "DNS — Domain Name System. Both UDP (queries) and TCP (zone transfers). Name resolution traffic.", difficulty: "medium", category: "Ports" },
      { id: "f3_4", front: "Port 22", back: "SSH — Secure Shell. Encrypted remote terminal access. Replaced Telnet (port 23). Used for secure remote management.", difficulty: "easy", category: "Ports" },
      { id: "f3_5", front: "Port 3389", back: "RDP — Remote Desktop Protocol. Microsoft's graphical remote access. Allows full desktop control remotely.", difficulty: "medium", category: "Ports" },
      { id: "f3_6", front: "Port 25", back: "SMTP — Simple Mail Transfer Protocol. Used for SENDING email between mail servers. Outgoing mail.", difficulty: "medium", category: "Ports" },
      { id: "f3_7", front: "Port 110", back: "POP3 — Post Office Protocol v3. Downloads email from server to client and (usually) deletes from server. Offline access.", difficulty: "hard", category: "Ports" },
      { id: "f3_8", front: "Port 143", back: "IMAP — Internet Message Access Protocol. Syncs email between server and client. Leaves mail on server. Multi-device friendly.", difficulty: "hard", category: "Ports" },
      { id: "f3_9", front: "SMTP vs POP3 vs IMAP", back: "SMTP (25) = SEND mail. POP3 (110) = RECEIVE + download + delete from server. IMAP (143) = RECEIVE + sync + keep on server.", difficulty: "hard", category: "Ports" },
      { id: "f3_10", front: "SSH vs Telnet", back: "SSH (22) = encrypted, secure. Telnet (23) = unencrypted, insecure. Always use SSH for remote access.", difficulty: "medium", category: "Ports" },
    ],
    quiz: [
      { id: "q3_1", question: "A technician needs to remotely access a Linux server's command line securely. Which port must be open?", options: ["23", "22", "3389", "443"], answer: 1, explanation: "SSH uses port 22 and provides encrypted terminal access. Port 23 (Telnet) is insecure. Port 3389 is RDP (Windows GUI)." },
      { id: "q3_2", question: "Which port does HTTPS use?", options: ["80", "8080", "443", "53"], answer: 2, explanation: "HTTPS uses port 443. HTTP uses port 80. HTTPS encrypts traffic with TLS/SSL." },
      { id: "q3_3", question: "A user can't send email but can receive it. Which port/protocol is most likely blocked?", options: ["POP3 / 110", "IMAP / 143", "SMTP / 25", "DNS / 53"], answer: 2, explanation: "SMTP (port 25) handles outgoing/sending email. POP3 and IMAP handle receiving. If sending fails, check SMTP/port 25." },
      { id: "q3_4", question: "What is the difference between POP3 and IMAP?", options: ["POP3 is encrypted; IMAP is not", "POP3 downloads and deletes from server; IMAP syncs and keeps on server", "POP3 is for sending; IMAP is for receiving", "POP3 uses port 143; IMAP uses port 110"], answer: 1, explanation: "POP3 (110) downloads mail to local client and typically deletes from server. IMAP (143) syncs mail and keeps it on the server for multi-device access." },
      { id: "q3_5", question: "Which port is used for RDP connections to a Windows machine?", options: ["22", "443", "3389", "80"], answer: 2, explanation: "RDP (Remote Desktop Protocol) uses port 3389. SSH uses 22. These are the two main remote access protocols on the exam." },
      { id: "q3_6", question: "DNS queries primarily use which port and transport protocol?", options: ["Port 53 / TCP", "Port 53 / UDP", "Port 80 / TCP", "Port 443 / UDP"], answer: 1, explanation: "DNS uses port 53. Standard queries use UDP for speed. TCP is used for zone transfers or large responses." },
      { id: "q3_7", question: "A web server is running but users get connection refused on port 443. HTTP on port 80 works. What is the issue?", options: ["DNS is not configured", "The website certificate is expired", "HTTPS/TLS is not configured or port 443 is blocked", "The server has no internet connection"], answer: 2, explanation: "Port 80 (HTTP) works but 443 (HTTPS) is refused — HTTPS isn't configured on the server, or port 443 is blocked by a firewall." },
    ],
    scenarios: [
      { id: "s3_1", title: "Secure Connection Failure", situation: "Users report that https://intranet.company.com shows 'Connection Refused' but http://intranet.company.com loads fine. The server is online.", question: "What port is failing and what are the likely causes?", answer: "Port 443 (HTTPS) is not responding. Causes: (1) HTTPS/TLS not configured on the web server — only HTTP is running. (2) Firewall rule blocking inbound port 443. (3) SSL certificate issue causing the service to not start. Diagnosis: Try telnet intranet.company.com 443 or check firewall rules. Fix: Configure TLS on the web server or open port 443 in the firewall.", keyPoints: ["Port 443 = HTTPS", "Port 80 = HTTP", "Connection refused = port blocked or service not running", "Check firewall rules"] },
      { id: "s3_2", title: "Remote Access Blocked", situation: "An IT admin is working from home and tries to RDP into an office workstation. The connection times out. SSH to a Linux server in the same office also fails.", question: "What ports need to be open and what is likely blocking them?", answer: "RDP needs port 3389. SSH needs port 22. Both are timing out — this points to the office firewall blocking inbound connections on these ports. Home → Office: traffic hits the office firewall/router. Fix: (1) Open port 3389 for RDP and port 22 for SSH in the firewall, or (2) Better security practice: use a VPN into the office network first, then connect via internal IP. Direct RDP exposure to internet is a security risk.", keyPoints: ["RDP = port 3389", "SSH = port 22", "Timeout = likely firewall blocking", "VPN is best practice for remote access"] },
    ],
  },
  4: {
    day: 4,
    title: "Windows Tools",
    objective: "Correct tool selection instantly",
    topics: ["ipconfig", "ping", "tracert", "Task Manager", "Device Manager", "Event Viewer", "msconfig", "Safe Mode"],
    flashcards: [
      { id: "f4_1", front: "ipconfig", back: "Shows current IP configuration: IP address, subnet mask, default gateway, MAC. ipconfig /all shows DNS and DHCP details. ipconfig /release and /renew reset DHCP lease.", difficulty: "easy", category: "Tools" },
      { id: "f4_2", front: "ping", back: "Tests connectivity to a host by sending ICMP echo packets. ping 8.8.8.8 tests internet routing. ping [hostname] tests DNS. -t flag pings continuously.", difficulty: "easy", category: "Tools" },
      { id: "f4_3", front: "tracert", back: "Traces the route packets take to a destination, showing each hop (router) and latency. Identifies WHERE a connection fails. tracert google.com", difficulty: "medium", category: "Tools" },
      { id: "f4_4", front: "Task Manager", back: "Monitor CPU, RAM, disk, network usage. Kill unresponsive processes. View startup programs (Startup tab). Check running services. Open: Ctrl+Shift+Esc or Ctrl+Alt+Del.", difficulty: "easy", category: "Tools" },
      { id: "f4_5", front: "Device Manager", back: "View, manage, and troubleshoot hardware devices and drivers. Yellow exclamation = driver error. Red X = disabled device. Roll back, update, or uninstall drivers here.", difficulty: "medium", category: "Tools" },
      { id: "f4_6", front: "Event Viewer", back: "Windows log system. Three key logs: Application, Security, System. Use to find crash causes, driver failures, security events. Run: eventvwr.msc", difficulty: "hard", category: "Tools" },
      { id: "f4_7", front: "msconfig", back: "System Configuration tool. Manage startup mode (Normal/Selective/Diagnostic). Configure boot options. Enable/disable startup services. Run: msconfig", difficulty: "medium", category: "Tools" },
      { id: "f4_8", front: "Safe Mode", back: "Boots Windows with minimal drivers. Used to remove malware, fix driver issues, or diagnose problems. F8 during boot (or Shift+Restart). Safe Mode with Networking allows internet access.", difficulty: "medium", category: "Tools" },
      { id: "f4_9", front: "What shows a driver problem in Device Manager?", back: "Yellow exclamation mark (!) = driver error or conflict. Red X = device disabled. No icon = device working normally.", difficulty: "hard", category: "Tools" },
      { id: "f4_10", front: "ipconfig /all vs ipconfig", back: "ipconfig = basic IP, subnet, gateway. ipconfig /all = adds: MAC address, DHCP server IP, DNS server IPs, DHCP lease times, hostname.", difficulty: "medium", category: "Tools" },
    ],
    quiz: [
      { id: "q4_1", question: "A technician needs to find the DHCP server's IP address on a Windows machine. Which command works?", options: ["ping /dhcp", "ipconfig", "ipconfig /all", "tracert /dhcp"], answer: 2, explanation: "ipconfig /all shows DHCP Server IP, DNS servers, MAC address, and lease information. Basic ipconfig only shows IP, subnet, and gateway." },
      { id: "q4_2", question: "A device has a yellow exclamation mark in Device Manager. What does this indicate?", options: ["The device is working correctly", "The device is disabled", "There is a driver error or conflict", "The device needs a firmware update"], answer: 2, explanation: "Yellow exclamation (!) = driver problem or device conflict. Red X = disabled. No icon = healthy." },
      { id: "q4_3", question: "A system crashes repeatedly with a Blue Screen of Death. Which tool should you use to find the cause?", options: ["Task Manager", "msconfig", "Event Viewer", "ipconfig"], answer: 2, explanation: "Event Viewer (System log) captures BSOD events, error codes, and crash details. Look for Critical events around the time of the crash." },
      { id: "q4_4", question: "A user's PC is unresponsive and a program is frozen. What is the fastest way to kill the frozen process?", options: ["Restart the computer", "Open Task Manager and End Task", "Run msconfig and disable the startup item", "Open Device Manager"], answer: 1, explanation: "Task Manager (Ctrl+Shift+Esc) → select the frozen process → End Task. No reboot needed." },
      { id: "q4_5", question: "You need to see where exactly a connection is dropping between your PC and a remote server. Which tool?", options: ["ping", "ipconfig", "tracert", "netstat"], answer: 2, explanation: "tracert traces each hop (router) between you and the destination. You'll see exactly which hop stops responding — identifying the failure point." },
      { id: "q4_6", question: "A new driver installation causes Windows to boot loop. What is the best recovery option?", options: ["Reinstall Windows", "Run sfc /scannow", "Boot into Safe Mode and roll back the driver", "Run msconfig"], answer: 2, explanation: "Safe Mode loads minimal drivers — the problematic driver won't load. From Safe Mode, open Device Manager and roll back the driver." },
      { id: "q4_7", question: "Which tool would you use to disable non-Microsoft startup services to diagnose a slow boot?", options: ["Task Manager", "msconfig", "Event Viewer", "Device Manager"], answer: 1, explanation: "msconfig → Services tab → 'Hide all Microsoft services' → uncheck third-party services. This performs a clean boot for diagnosis." },
    ],
    scenarios: [
      { id: "s4_1", title: "Frozen System Diagnosis", situation: "A user's Windows PC becomes sluggish then freezes completely about 30 minutes after boot. No BSOD. The system is responsive after a restart but freezes again.", question: "Which tools do you use, in what order, and why?", answer: "Step 1: Task Manager (Ctrl+Shift+Esc) — Watch CPU/RAM/Disk usage after boot. If one resource hits 100% before freezing, you've found the culprit. Step 2: Event Viewer (System/Application logs) — Look for errors or warnings in the 30 minutes before each freeze. Step 3: If a process causes it → kill it with Task Manager. Step 4: If it's a startup program → use msconfig or Task Manager Startup tab to disable it. Step 5: If disk at 100% → check for malware or failing drive.", keyPoints: ["Task Manager first = live resource monitoring", "Event Viewer = historical crash/error logs", "msconfig = control what runs at startup", "Disk at 100% = hardware or malware issue"] },
      { id: "s4_2", title: "Driver Failure Recovery", situation: "After installing a new GPU driver, Windows fails to boot properly — it shows a black screen after the Windows logo.", question: "How do you recover without reinstalling Windows?", answer: "Boot into Safe Mode: (1) Force 3 hard reboots to trigger WinRE, or hold Shift and click Restart. (2) Advanced Options → Startup Settings → Safe Mode. In Safe Mode: open Device Manager → Display Adapters → right-click GPU → Roll Back Driver. If no rollback available: Uninstall the driver, restart normally, let Windows install a generic driver. Alternatively: System Restore to pre-driver install point.", keyPoints: ["Safe Mode = boots with minimal drivers", "Device Manager → Roll Back Driver", "Force WinRE: 3 failed boots", "System Restore as backup plan"] },
    ],
  },
  5: {
    day: 5,
    title: "Troubleshooting Logic",
    objective: "Correct first-step logic every time",
    topics: ["OSI Physical Layer", "OSI Network Layer", "DNS Layer", "One vs All Devices", "Isolation Logic"],
    flashcards: [
      { id: "f5_1", front: "Troubleshooting Layer 1 (Physical)", back: "Check: cables, NICs, lights on switch/router, Wi-Fi signal, power to devices. Ask: Is it physically connected? Are link lights on?", difficulty: "easy", category: "Troubleshooting" },
      { id: "f5_2", front: "Troubleshooting Layer 3 (Network)", back: "Check: IP address (valid? APIPA?), subnet mask, default gateway. Run ipconfig. Can you ping the gateway? Can you ping 8.8.8.8?", difficulty: "medium", category: "Troubleshooting" },
      { id: "f5_3", front: "Troubleshooting DNS Layer", back: "If ping 8.8.8.8 works but websites don't load — DNS is failing. Check: DNS server setting (ipconfig /all), try nslookup, flush with ipconfig /flushdns.", difficulty: "hard", category: "Troubleshooting" },
      { id: "f5_4", front: "One Device vs All Devices", back: "ONE device = problem is local to that device (NIC, cable, driver, IP config). ALL devices = problem is shared infrastructure (router, switch, ISP, DHCP server).", difficulty: "hard", category: "Troubleshooting" },
      { id: "f5_5", front: "Troubleshooting Order", back: "CompTIA's 6-step process: (1) Identify problem, (2) Establish theory, (3) Test theory, (4) Plan of action, (5) Implement fix, (6) Document.", difficulty: "medium", category: "Troubleshooting" },
      { id: "f5_6", front: "What to check when one device has no internet", back: "(1) Physical: cable/Wi-Fi connected? (2) IP config: valid IP? Run ipconfig. (3) Ping gateway. (4) Ping 8.8.8.8. (5) Ping google.com. Each step isolates the layer.", difficulty: "hard", category: "Troubleshooting" },
      { id: "f5_7", front: "DHCP vs DNS failure symptoms", back: "DHCP failure: 169.254.x.x address, can't reach anything. DNS failure: Valid IP, can ping IPs (8.8.8.8), but domain names fail. These are completely different problems.", difficulty: "hard", category: "Troubleshooting" },
    ],
    quiz: [
      { id: "q5_1", question: "All 20 computers in an office lose internet simultaneously. Local network still works. What do you check FIRST?", options: ["Each computer's DNS settings", "The network cables on every PC", "The router and modem (shared WAN equipment)", "Windows firewall on each PC"], answer: 2, explanation: "All devices affected simultaneously = shared infrastructure failure. The router/modem is the single point of failure for internet. Check it first — don't waste time on individual PCs." },
      { id: "q5_2", question: "One user cannot access the internet. Other users on the same network are fine. What does this tell you?", options: ["The router is failing", "The DHCP server is down", "The ISP has an outage", "The problem is local to that specific device"], answer: 3, explanation: "If only ONE device is affected and others are fine, the shared infrastructure (router, DHCP, ISP) is working. The issue is local — check that device's cable, IP config, or NIC." },
      { id: "q5_3", question: "A user can ping 8.8.8.8 successfully but typing google.com in a browser shows 'server not found'. What is failing?", options: ["Default gateway", "DHCP", "DNS", "Network cable"], answer: 2, explanation: "Can ping an IP = routing works. Can't reach domain name = DNS is failing. These are separate. DNS translates names to IPs." },
      { id: "q5_4", question: "What is the FIRST step in CompTIA's troubleshooting methodology?", options: ["Test a theory of probable cause", "Establish a theory", "Identify the problem", "Document findings"], answer: 2, explanation: "Step 1: Identify the problem (gather info, ask user what changed, reproduce the issue). You can't form a theory until you understand the problem." },
      { id: "q5_5", question: "A computer has IP 169.254.10.5. You check and the network cable is unplugged. After plugging it in, what should you run?", options: ["ipconfig /flushdns", "ping 127.0.0.1", "ipconfig /release then ipconfig /renew", "tracert 8.8.8.8"], answer: 2, explanation: "The device has an APIPA address from a previous DHCP failure. After reconnecting, run ipconfig /release then ipconfig /renew to force a new DHCP request and get a valid IP." },
      { id: "q5_6", question: "Which action best distinguishes a DNS failure from a routing failure?", options: ["Run tracert to the gateway", "Ping an IP address (8.8.8.8) AND then ping a domain name (google.com)", "Check the subnet mask", "Restart the router"], answer: 1, explanation: "Ping 8.8.8.8 (IP) — if this works, routing is fine. Then ping google.com (domain) — if this fails, DNS is failing. This single test isolates the exact layer." },
    ],
    scenarios: [
      { id: "s5_1", title: "One Device vs All Devices", situation: "Monday morning: 3 users call in — they have no internet. You check and find that ALL 45 computers in the building have no internet, but network shares and printing still work.", question: "What is your diagnostic logic and first action?", answer: "Scope tells you everything. ALL devices affected = shared WAN infrastructure problem. LAN works (shares/printing) = switch is fine. WAN is dead = router or modem. First action: Go directly to the router/modem — check lights (WAN light should be solid). Try: restart modem first, then router. If modem shows no WAN link → call ISP. Do NOT check individual computers — that's wasted time when the scope tells you it's shared infrastructure.", keyPoints: ["Scope = all devices = shared failure", "LAN works = switch OK", "WAN dead = router/modem/ISP", "Don't waste time on individual PCs"] },
      { id: "s5_2", title: "Layered DNS vs DHCP Diagnosis", situation: "A user says 'internet is broken.' You remote in and see: IP address is 192.168.1.45, subnet mask 255.255.255.0, default gateway 192.168.1.1. Google.com won't load. Gmail app shows 'no connection'.", question: "Using the layered approach, diagnose step by step.", answer: "Layer 1 Physical: IP is valid (not APIPA) — physical connection and DHCP are fine. Layer 2 Gateway: Ping 192.168.1.1 (gateway). If it fails → routing problem locally. If it succeeds → Layer 3. Layer 3 Internet: Ping 8.8.8.8. If it fails → router isn't forwarding to internet (ISP issue or router config). If 8.8.8.8 succeeds → Layer 4. Layer 4 DNS: Ping google.com. Fails = DNS issue. Run: ipconfig /flushdns. Change DNS to 8.8.8.8 manually. Test again.", keyPoints: ["Valid IP = DHCP OK", "Ping gateway → ping 8.8.8.8 → ping domain", "8.8.8.8 works but google.com fails = DNS only", "Fix: change DNS server or flush DNS cache"] },
    ],
  },
  6: {
    day: 6,
    title: "Mixed Exam Simulation",
    objective: "70–85% consistency under pressure",
    topics: ["All Topics", "Mixed Questions", "Timed Mode", "Weak Areas"],
    flashcards: [],
    quiz: [
      { id: "q6_1", question: "A user receives an IP of 169.254.33.21. Wi-Fi shows connected. What is the cause?", options: ["DNS server is unreachable", "DHCP server is unreachable", "Default gateway is wrong", "Subnet mask mismatch"], answer: 1, explanation: "169.254.x.x = APIPA. The device self-assigned because DHCP didn't respond. DNS is irrelevant here — DHCP provides the IP." },
      { id: "q6_2", question: "Which port does SSH use?", options: ["21", "22", "23", "443"], answer: 1, explanation: "SSH = port 22. FTP=21, Telnet=23, HTTPS=443. SSH replaced Telnet with encryption." },
      { id: "q6_3", question: "You need to view the full path a packet takes to reach a website. Which command?", options: ["ping", "ipconfig /all", "tracert", "netstat"], answer: 2, explanation: "tracert (trace route) shows each hop from your PC to the destination, with latency. Ping only shows if the destination is reachable." },
      { id: "q6_4", question: "A device can access local file shares but not the internet. Other devices work fine. First check?", options: ["Replace the router", "Check the device's default gateway setting", "Call the ISP", "Reinstall Windows"], answer: 1, explanation: "Only one device affected = local issue. LAN works but internet doesn't = gateway might be misconfigured on this device. Run ipconfig and verify the gateway." },
      { id: "q6_5", question: "Which Windows tool shows you why a computer blue-screened yesterday?", options: ["Task Manager", "Device Manager", "Event Viewer", "msconfig"], answer: 2, explanation: "Event Viewer → Windows Logs → System. Look for Critical events near the BSOD time. It logs stop codes and driver failures." },
      { id: "q6_6", question: "Port 3389 is used by which protocol?", options: ["SSH", "HTTPS", "RDP", "SMTP"], answer: 2, explanation: "RDP (Remote Desktop Protocol) uses port 3389. SSH=22, HTTPS=443, SMTP=25." },
      { id: "q6_7", question: "A switch connects devices within a LAN using which address type?", options: ["IP addresses", "MAC addresses", "Domain names", "Port numbers"], answer: 1, explanation: "Switches operate at Layer 2 (Data Link) and use MAC addresses to forward frames to the correct port." },
      { id: "q6_8", question: "What does ipconfig /renew do?", options: ["Clears the DNS cache", "Requests a new IP address from DHCP", "Shows detailed IP configuration", "Releases the current IP permanently"], answer: 1, explanation: "ipconfig /renew sends a DHCPREQUEST to the DHCP server to get a new (or renew the existing) IP address lease." },
      { id: "q6_9", question: "IMAP uses which port?", options: ["25", "110", "143", "993"], answer: 2, explanation: "IMAP = port 143 (unencrypted) or 993 (encrypted). POP3 = 110. SMTP = 25. IMAP keeps mail on server and syncs across devices." },
      { id: "q6_10", question: "After installing a driver, Windows won't boot. Best recovery?", options: ["Reinstall Windows", "Use System Restore only", "Boot Safe Mode, roll back driver in Device Manager", "Run SFC from command prompt"], answer: 2, explanation: "Safe Mode loads without the problematic driver. Device Manager → Roll Back Driver removes the bad driver. Fastest fix without data loss." },
      { id: "q6_11", question: "Which device connects a LAN to the internet (WAN)?", options: ["Switch", "Hub", "Access Point", "Router"], answer: 3, explanation: "The router connects LAN to WAN. It operates at Layer 3, routes between networks, and typically runs DHCP for local devices." },
      { id: "q6_12", question: "What is the FIRST step of CompTIA's troubleshooting methodology?", options: ["Establish a theory", "Identify the problem", "Test the theory", "Document findings"], answer: 1, explanation: "Step 1 is always: Identify the problem. Gather information, ask what changed, reproduce the issue. You cannot theorize without understanding the problem first." },
    ],
    scenarios: [
      { id: "s6_1", title: "Mixed Scenario: Email Down", situation: "Users cannot send email but can receive it. Webmail works fine. The company uses Outlook with a local mail server.", question: "Which protocol and port is failing? What do you check?", answer: "Sending email = SMTP (port 25). Receiving works = POP3/IMAP is fine. Webmail works = the mail server itself is online. Issue: Outlook's SMTP connection is failing. Check: (1) Is port 25 blocked by ISP or firewall? (2) Are Outlook's SMTP server settings correct? (3) Try alternate SMTP ports: 587 (submission) or 465 (SMTPS). Many ISPs block port 25 outbound to prevent spam.", keyPoints: ["SMTP = sending = port 25", "POP3/IMAP = receiving only", "Webmail works = server online", "Port 25 often blocked by ISPs"] },
      { id: "s6_2", title: "Mixed Scenario: New PC No Network", situation: "A brand new PC was just set up. It shows Wi-Fi connected but has IP 169.254.x.x. Other laptops on the same Wi-Fi work fine.", question: "What is wrong and how do you fix it in order?", answer: "Single device with APIPA = DHCP request not being fulfilled for this device. Other devices work = DHCP server and Wi-Fi AP are fine. Cause: This device's DHCP request isn't reaching the server (Wi-Fi association issue) or a DHCP lease conflict. Steps: (1) ipconfig /release → ipconfig /renew. (2) If still 169.254: forget and rejoin the Wi-Fi network. (3) Check if DHCP server has run out of addresses (lease pool). (4) As test: set a manual static IP — if internet works, DHCP is the issue.", keyPoints: ["Single device APIPA = DHCP not responding to THIS device", "Other devices fine = server OK", "Release/renew first", "Try static IP to confirm DHCP issue"] },
    ],
  },
  7: {
    day: 7,
    title: "Full Exam Simulation",
    objective: "85%+ readiness — final assessment",
    topics: ["All Domains", "Full Mix", "No Hints"],
    flashcards: [],
    quiz: [
      { id: "q7_1", question: "Which IP range indicates an APIPA self-assigned address?", options: ["192.168.0.0/16", "10.0.0.0/8", "169.254.0.0/16", "172.16.0.0/12"], answer: 2, explanation: "169.254.0.0/16 is the APIPA range. Assigned automatically when DHCP fails." },
      { id: "q7_2", question: "A user can ping 192.168.1.1 but not google.com. Which service is most likely failing?", options: ["DHCP", "Default Gateway", "DNS", "Firewall"], answer: 2, explanation: "Gateway ping works = routing is fine. Domain name fails = DNS. These are separate layers." },
      { id: "q7_3", question: "Which port does SMTP use?", options: ["110", "143", "25", "53"], answer: 2, explanation: "SMTP = port 25 (sending mail). POP3 = 110. IMAP = 143. DNS = 53." },
      { id: "q7_4", question: "A switch operates at which OSI layer?", options: ["Layer 1 - Physical", "Layer 2 - Data Link", "Layer 3 - Network", "Layer 4 - Transport"], answer: 1, explanation: "Switch = Layer 2, uses MAC addresses. Router = Layer 3, uses IP addresses. Hub = Layer 1 (broadcasts everything)." },
      { id: "q7_5", question: "You need to diagnose intermittent packet loss between two sites. Which tool?", options: ["ipconfig", "ping -t", "tracert", "netstat"], answer: 2, explanation: "tracert shows all hops and latency. ping -t only shows if the end host responds. tracert isolates WHICH hop is dropping packets." },
      { id: "q7_6", question: "Port 22 is associated with which protocol?", options: ["HTTP", "FTP", "SSH", "RDP"], answer: 2, explanation: "SSH = port 22. Secure encrypted terminal access. FTP = 21. HTTP = 80. RDP = 3389." },
      { id: "q7_7", question: "What does a yellow exclamation mark in Device Manager indicate?", options: ["Device is working correctly", "Device is disabled", "Driver error or resource conflict", "Device needs a firmware update"], answer: 2, explanation: "Yellow ! = driver error or conflict. Needs attention — update, rollback, or reinstall the driver." },
  
      { id: "q7_8", question: "An entire office has no internet but local shares work. What is the most efficient first step?", options: ["Check each PC's IP configuration", "Restart every computer", "Check the router and modem", "Run SFC on the server"], answer: 2, explanation: "All devices + LAN works = WAN device failure. Check router/modem first. Don't waste time on individual PCs when scope shows shared infrastructure." },
      { id: "q7_9", question: "Which command releases the current IP and requests a new one from DHCP?", options: ["ipconfig /flushdns", "ipconfig /all", "ipconfig /release then /renew", "ipconfig /reset"], answer: 2, explanation: "ipconfig /release drops current IP. ipconfig /renew requests new lease from DHCP. /flushdns clears DNS cache, different function." },
      { id: "q7_10", question: "POP3 uses which port?", options: ["25", "110", "143", "587"], answer: 1, explanation: "POP3 = port 110. Downloads email and typically deletes from server. IMAP (143) keeps email on server." },
      { id: "q7_11", question: "Safe Mode boots Windows with:", options: ["Full driver support and networking", "Minimal drivers, often no network", "Only Microsoft-signed apps", "A clean install environment"], answer: 1, explanation: "Safe Mode loads minimal drivers. Problematic drivers don't load. Safe Mode with Networking adds basic network drivers." },
      { id: "q7_12", question: "Which device bridges wireless clients to a wired LAN?", options: ["Router", "Switch", "Wireless Access Point", "Modem"], answer: 2, explanation: "Access Point bridges Wi-Fi clients to the LAN. It does not route — it operates at Layer 2." },
      { id: "q7_13", question: "Event Viewer is used to:", options: ["Manage device drivers", "View system and application error logs", "Configure startup programs", "Monitor real-time CPU usage"], answer: 1, explanation: "Event Viewer logs: System events, Application errors, Security events. Best tool for post-crash investigation." },
      { id: "q7_14", question: "What is the subnet mask for a /24 network?", options: ["255.255.0.0", "255.0.0.0", "255.255.255.0", "255.255.255.128"], answer: 2, explanation: "255.255.255.0 = /24. First 24 bits = network. Last 8 bits = host (up to 254 usable hosts)." },
      { id: "q7_15", question: "A new driver causes a boot loop. No rollback option exists. Best next step?", options: ["Reinstall Windows", "Boot Safe Mode, uninstall driver, let Windows install generic driver", "Run chkdsk", "Replace the hardware"], answer: 1, explanation: "Safe Mode → Device Manager → Uninstall driver → restart. Windows loads generic driver. Faster than reinstalling OS." },
      { id: "q7_16", question: "Which troubleshooting step comes AFTER establishing a theory of probable cause?", options: ["Identify the problem", "Document the findings", "Test the theory", "Establish a plan of action"], answer: 2, explanation: "CompTIA's order: (1) Identify, (2) Establish theory, (3) TEST THE THEORY, (4) Plan, (5) Implement, (6) Document." },
      { id: "q7_17", question: "HTTPS traffic uses which port?", options: ["80", "8080", "443", "8443"], answer: 2, explanation: "HTTPS = port 443. HTTP = 80. The 'S' means TLS/SSL encryption is in use." },
      { id: "q7_18", question: "A modem's primary function is to:", options: ["Assign IP addresses to LAN devices", "Route traffic between networks", "Convert ISP signal to usable data", "Filter malicious traffic"], answer: 2, explanation: "Modem = modulate/demodulate. Converts cable/DSL/fiber signal from ISP to Ethernet for your router. Not a router — doesn't route." },
      { id: "q7_19", question: "msconfig is used to:", options: ["View crash logs", "Manage device drivers", "Configure boot options and startup services", "Monitor network traffic"], answer: 2, explanation: "msconfig = System Configuration. Manage boot options, startup mode (selective/diagnostic), and startup services. Useful for clean boot troubleshooting." },
      { id: "q7_20", question: "DNS primarily uses which transport protocol for standard queries?", options: ["TCP", "UDP", "ICMP", "HTTP"], answer: 1, explanation: "DNS queries use UDP (port 53) for speed. TCP is used for zone transfers or when UDP responses exceed 512 bytes." },
    ],
    scenarios: [
      { id: "s7_1", title: "Exam Scenario: Complete Diagnosis", situation: "A remote worker calls: 'Nothing works. I can't access our company VPN, emails won't send, and websites don't load. I'm on Wi-Fi at home.'", question: "Walk through your complete diagnostic logic from Layer 1 to application layer.", answer: "Step 1 Physical: Is Wi-Fi connected? Check signal strength. Any other devices connected? Step 2 IP: Run ipconfig. Valid IP (192.168.x.x) or APIPA (169.254.x.x)? If APIPA → DHCP issue → reconnect to Wi-Fi / restart router. Step 3 Gateway: Ping home router (default gateway). If fails → local network issue. Step 4 Internet routing: Ping 8.8.8.8. If fails → ISP or router issue. Step 5 DNS: Ping google.com. If 8.8.8.8 works but this fails → DNS. Fix: change DNS to 8.8.8.8 or flush DNS. Step 6 VPN: If all above works but VPN fails → VPN port blocked (check ports 1194/UDP or 443/TCP for VPN). Email sending fails → SMTP port 25 may be blocked by ISP.", keyPoints: ["Layer 1→7 systematically", "APIPA = DHCP fail", "8.8.8.8 works = routing OK, check DNS", "VPN/SMTP = specific port issues"] },
    ],
  },
};

const ALL_FLASHCARDS = Object.values(CURRICULUM).flatMap(d => d.flashcards);

const getStorage = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const setStorage = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const S = {
  app: { minHeight: "100vh", background: "#080c10", color: "#e2e8f0", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", maxWidth: "640px", margin: "0 auto", padding: "0" },
  header: { background: "#0a0f15", borderBottom: "1px solid #1a2535", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
  logo: { fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontSize: "13px", color: "#39ff14", letterSpacing: "0.08em", fontWeight: 700 },
  dayBadge: { fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#39ff14", background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.25)", padding: "3px 10px", letterSpacing: "0.1em" },
  page: { padding: "20px" },
  sectionLabel: { fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#39ff14", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "8px" },
  h1: { fontSize: "22px", fontWeight: 700, color: "#f0f4f8", lineHeight: 1.2, margin: "0 0 6px 0" },
  body: { fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, margin: 0 },
  card: { background: "#0d1520", border: "1px solid #1a2535", padding: "20px", marginBottom: "12px" },
  cardAlt: { background: "#0a1018", border: "1px solid #1e2d42", padding: "20px", marginBottom: "12px" },
  btn: { background: "#39ff14", color: "#080c10", border: "none", padding: "14px 24px", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em", width: "100%", marginBottom: "10px", textTransform: "uppercase" },
  btnOutline: { background: "transparent", color: "#39ff14", border: "1px solid #39ff14", padding: "12px 24px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em", width: "100%", marginBottom: "10px", textTransform: "uppercase" },
  btnGhost: { background: "transparent", color: "#64748b", border: "1px solid #1a2535", padding: "10px 20px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", width: "100%", marginBottom: "8px" },
  optionBtn: (selected, correct, incorrect, idle) => ({ background: correct ? "rgba(57,255,20,0.12)" : incorrect ? "rgba(255,60,60,0.12)" : selected ? "rgba(57,255,20,0.06)" : "#0d1520", color: correct ? "#39ff14" : incorrect ? "#ff4444" : "#e2e8f0", border: `1px solid ${correct ? "#39ff14" : incorrect ? "#ff4444" : "#1a2535"}`, padding: "14px 16px", fontSize: "14px", cursor: idle ? "pointer" : "default", textAlign: "left", width: "100%", marginBottom: "8px", fontFamily: "inherit", lineHeight: 1.4 }),
  progressBar: () => ({ height: "3px", background: "#1a2535", marginBottom: "20px", position: "relative", overflow: "hidden" }),
  progressFill: (pct) => ({ position: "absolute", top: 0, left: 0, height: "100%", width: `${pct}%`, background: "#39ff14", transition: "width 0.3s ease" }),
  tag: () => ({ display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#39ff14", background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)", padding: "2px 8px", marginRight: "6px", letterSpacing: "0.1em" }),
  mono: { fontFamily: "'JetBrains Mono', monospace", color: "#39ff14", fontSize: "13px" },
  monoLarge: { fontFamily: "'JetBrains Mono', monospace", color: "#39ff14", fontSize: "28px", fontWeight: 700 },
  explanation: { background: "rgba(57,255,20,0.06)", border: "1px solid rgba(57,255,20,0.2)", padding: "14px 16px", marginTop: "12px", fontSize: "13px", color: "#a0c878", lineHeight: 1.6 },
  scenarioBlock: { background: "#060a0e", border: "1px solid #1e2d42", borderLeft: "3px solid #39ff14", padding: "16px", marginBottom: "12px", fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 },
  answerReveal: { background: "rgba(57,255,20,0.04)", border: "1px solid rgba(57,255,20,0.15)", padding: "16px", marginTop: "12px", fontSize: "14px", color: "#cbd5e1", lineHeight: 1.7 },
  keyPoint: { fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#39ff14", background: "rgba(57,255,20,0.06)", padding: "4px 10px", marginBottom: "6px", display: "block", borderLeft: "2px solid #39ff14" },
  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" },
  statCard: { background: "#0d1520", border: "1px solid #1a2535", padding: "14px", textAlign: "center" },
  statNum: { fontFamily: "'JetBrains Mono', monospace", fontSize: "24px", fontWeight: 700, color: "#39ff14" },
  statLabel: { fontSize: "11px", color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase" },
};

function FlashcardView({ cards, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ratings, setRatings] = useState({});
  const [done, setDone] = useState(false);
  const [startTime] = useState(Date.now());
  const card = cards[idx];
  const rate = (r) => {
    const newRatings = { ...ratings, [card.id]: r };
    setRatings(newRatings);
    if (idx < cards.length - 1) { setIdx(idx + 1); setFlipped(false); }
    else { onComplete({ ratings: newRatings, elapsed: Math.round((Date.now() - startTime) / 1000), total: cards.length }); setDone(true); }
  };
  if (done) return null;
  return (
    <div>
      <div style={S.progressBar()}><div style={S.progressFill((idx / cards.length) * 100)} /></div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <span style={S.sectionLabel}>FLASHCARD MODE</span>
        <span style={{ ...S.mono, fontSize: "12px" }}>{idx + 1} / {cards.length}</span>
      </div>
      <div onClick={() => setFlipped(!flipped)} style={{ ...S.card, minHeight: "200px", display: "flex", flexDirection: "column", justifyContent: "center", cursor: "pointer", borderColor: flipped ? "#39ff14" : "#1a2535", transition: "border-color 0.2s", marginBottom: "16px", position: "relative" }}>
        {!flipped && <div style={{ position: "absolute", top: "12px", right: "12px", ...S.mono, fontSize: "10px", opacity: 0.4 }}>TAP TO FLIP</div>}
        <div style={{ ...S.tag(), marginBottom: "12px", display: "inline-block", width: "fit-content" }}>{card.category}</div>
        {!flipped ? (
          <div>
            <div style={{ ...S.sectionLabel, marginBottom: "8px" }}>TERM</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "20px", color: "#f0f4f8", fontWeight: 700 }}>{card.front}</div>
          </div>
        ) : (
          <div>
            <div style={{ ...S.sectionLabel, marginBottom: "8px" }}>DEFINITION</div>
            <div style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.7 }}>{card.back}</div>
          </div>
        )}
      </div>
      {flipped && (
        <div>
          <div style={{ ...S.sectionLabel, marginBottom: "10px" }}>HOW WELL DID YOU KNOW THIS?</div>
          <button onClick={() => rate("easy")} style={{ ...S.btn, marginBottom: "8px" }}>✓ GOT IT — EASY</button>
          <button onClick={() => rate("medium")} style={{ ...S.btnOutline, marginBottom: "8px" }}>≈ KNEW IT — MEDIUM</button>
          <button onClick={() => rate("hard")} style={{ ...S.btnGhost, color: "#ff7070", borderColor: "#ff4444" }}>✗ MISSED IT — HARD</button>
        </div>
      )}
      {!flipped && <button onClick={() => setFlipped(true)} style={S.btn}>REVEAL ANSWER</button>}
    </div>
  );
}

function QuizView({ questions, timed = false, noHints = false, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timed ? 30 : null);
  const timerRef = useRef(null);
  const q = questions[idx];

  useEffect(() => {
    if (!timed) return;
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); if (!answered) handleAnswer(-1); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx]);

  const handleAnswer = (optIdx) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setSelected(optIdx);
    setAnswered(true);
    setResults(r => [...r, { questionId: q.id, correct: optIdx === q.answer, category: q.category || "General" }]);
  };

  const next = () => {
    if (idx < questions.length - 1) { setIdx(idx + 1); setSelected(null); setAnswered(false); }
    else { onComplete([...results]); setDone(true); }
  };

  if (done) return null;

  return (
    <div>
      <div style={S.progressBar()}><div style={S.progressFill((idx / questions.length) * 100)} /></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={S.sectionLabel}>QUIZ MODE</span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {timed && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "20px", fontWeight: 700, color: timeLeft <= 10 ? "#ff4444" : "#39ff14" }}>{String(timeLeft).padStart(2, "0")}s</span>}
          <span style={{ ...S.mono, fontSize: "12px" }}>{idx + 1}/{questions.length}</span>
        </div>
      </div>
      <div style={{ ...S.card, marginBottom: "16px" }}>
        <div style={{ fontSize: "15px", color: "#f0f4f8", lineHeight: 1.6, fontWeight: 500 }}>{q.question}</div>
      </div>
      {q.options.map((opt, i) => {
        const isCorrect = answered && i === q.answer;
        const isWrong = answered && i === selected && i !== q.answer;
        return (
          <button key={i} onClick={() => handleAnswer(i)} style={S.optionBtn(selected === i, isCorrect, isWrong, !answered)}>
            <span style={{ ...S.mono, fontSize: "11px", marginRight: "10px", opacity: 0.6 }}>{String.fromCharCode(65 + i)}</span>
            {opt}
          </button>
        );
      })}
      {answered && !noHints && (
        <div style={S.explanation}>
          <div style={{ ...S.sectionLabel, marginBottom: "6px" }}>{selected === q.answer ? "✓ CORRECT" : selected === -1 ? "⏱ TIME UP" : "✗ INCORRECT"}</div>
          {q.explanation}
        </div>
      )}
      {answered && <button onClick={next} style={{ ...S.btn, marginTop: "12px" }}>{idx < questions.length - 1 ? "NEXT QUESTION →" : "SEE RESULTS"}</button>}
    </div>
  );
        }
function ScenarioView({ scenarios, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selfScore, setSelfScore] = useState(null);
  const [scores, setScores] = useState([]);
  const s = scenarios[idx];

  const score = (val) => {
    setSelfScore(val);
    const newScores = [...scores, { id: s.id, score: val }];
    setScores(newScores);
    setTimeout(() => {
      if (idx < scenarios.length - 1) { setIdx(idx + 1); setRevealed(false); setSelfScore(null); }
      else { onComplete(newScores); }
    }, 400);
  };

  return (
    <div>
      <div style={S.progressBar()}><div style={S.progressFill((idx / scenarios.length) * 100)} /></div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <span style={S.sectionLabel}>SCENARIO DRILL</span>
        <span style={{ ...S.mono, fontSize: "12px" }}>{idx + 1}/{scenarios.length}</span>
      </div>
      <div style={{ ...S.card, marginBottom: "12px" }}>
        <div style={{ ...S.sectionLabel, marginBottom: "8px" }}>SITUATION</div>
        <div style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.7 }}>{s.situation}</div>
      </div>
      <div style={S.scenarioBlock}>
        <div style={{ ...S.sectionLabel, marginBottom: "8px", color: "#f59e0b" }}>YOUR TASK</div>
        <div style={{ color: "#f0f4f8", fontWeight: 500 }}>{s.question}</div>
      </div>
      {!revealed && <button onClick={() => setRevealed(true)} style={S.btn}>REVEAL SOLUTION</button>}
      {revealed && (
        <div>
          <div style={S.answerReveal}>
            <div style={{ ...S.sectionLabel, marginBottom: "10px" }}>SOLUTION</div>
            <div style={{ marginBottom: "16px" }}>{s.answer}</div>
            {s.keyPoints.map((kp, i) => <span key={i} style={S.keyPoint}>→ {kp}</span>)}
          </div>
          {!selfScore && (
            <div style={{ marginTop: "16px" }}>
              <div style={{ ...S.sectionLabel, marginBottom: "10px" }}>HOW DID YOU DO?</div>
              <button onClick={() => score("full")} style={{ ...S.btn, marginBottom: "8px" }}>✓ NAILED IT</button>
              <button onClick={() => score("partial")} style={{ ...S.btnOutline, marginBottom: "8px" }}>≈ PARTIAL</button>
              <button onClick={() => score("missed")} style={{ ...S.btnGhost, color: "#ff7070", borderColor: "#ff4444" }}>✗ MISSED KEY POINTS</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultsView({ quizResults, flashResults, day, onContinue }) {
  const total = quizResults.length;
  const correct = quizResults.filter(r => r.correct).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const wrongCategories = {};
  quizResults.filter(r => !r.correct).forEach(r => { const cat = r.category || "General"; wrongCategories[cat] = (wrongCategories[cat] || 0) + 1; });
  const weakAreas = Object.entries(wrongCategories).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <div style={S.sectionLabel}>DAY {day} RESULTS</div>
      <div style={{ ...S.h1, marginBottom: "20px" }}>Mission Complete</div>
      <div style={S.statGrid}>
        <div style={S.statCard}>
          <div style={{ ...S.statNum, color: pct >= 80 ? "#39ff14" : pct >= 60 ? "#f59e0b" : "#ff4444" }}>{pct}%</div>
          <div style={S.statLabel}>Quiz Score</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statNum}>{correct}/{total}</div>
          <div style={S.statLabel}>Correct</div>
        </div>
        {flashResults && (
          <>
            <div style={S.statCard}>
              <div style={S.statNum}>{flashResults.total}</div>
              <div style={S.statLabel}>Cards Studied</div>
            </div>
            <div style={S.statCard}>
              <div style={{ ...S.statNum, color: "#f59e0b" }}>{Object.values(flashResults.ratings).filter(r => r === "hard").length}</div>
              <div style={S.statLabel}>Weak Cards</div>
            </div>
          </>
        )}
      </div>
      {weakAreas.length > 0 && (
        <div style={{ ...S.card, marginBottom: "16px" }}>
          <div style={{ ...S.sectionLabel, marginBottom: "10px" }}>WEAK AREAS DETECTED</div>
          {weakAreas.map(([cat, count]) => (
            <div key={cat} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "14px" }}>{cat}</span>
              <span style={{ ...S.mono, color: "#ff7070" }}>{count} wrong</span>
            </div>
          ))}
        </div>
      )}
      {pct >= 80 && <div style={{ ...S.explanation, marginBottom: "16px" }}><span style={S.sectionLabel}>STRONG PERFORMANCE</span><br />Above 80%. You're on track for exam readiness.</div>}
      {pct < 60 && total > 0 && <div style={{ background: "rgba(255,60,60,0.06)", border: "1px solid rgba(255,60,60,0.2)", padding: "14px", marginBottom: "16px", fontSize: "13px", color: "#ff9090" }}><div style={{ ...S.sectionLabel, color: "#ff4444", marginBottom: "6px" }}>BELOW TARGET</div>Review weak areas before moving on.</div>}
      <button onClick={onContinue} style={S.btn}>{day < 7 ? `START DAY ${day + 1} →` : "VIEW FINAL REPORT"}</button>
    </div>
  );
}

function DayDashboard({ day, progress, onStart }) {
  const data = CURRICULUM[day];
  const p = progress[day] || {};
  const phases = ["flashcards", "quiz", "scenarios"];
  const currentPhase = phases.find(ph => !p[ph]) || null;
  const completed = phases.filter(ph => p[ph]);

  return (
    <div>
      <div style={S.sectionLabel}>MISSION BRIEFING</div>
      <div style={S.h1}>{data.title}</div>
      <div style={{ ...S.body, marginBottom: "20px" }}>Objective: {data.objective}</div>
      <div style={S.card}>
        <div style={{ ...S.sectionLabel, marginBottom: "10px" }}>TODAY'S TOPICS</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {data.topics.map(t => <span key={t} style={S.tag()}>{t}</span>)}
        </div>
      </div>
      <div style={{ ...S.card, marginBottom: "16px" }}>
        <div style={{ ...S.sectionLabel, marginBottom: "12px" }}>MISSION PHASES</div>
        {[
          { id: "flashcards", label: "Phase 1: Flashcards", time: "10 min", desc: "Forced recall — term to definition" },
          { id: "quiz", label: "Phase 2: Quiz", time: "10 min", desc: "Multiple choice under pressure" },
          { id: "scenarios", label: "Phase 3: Scenarios", time: "10 min", desc: "Real-world diagnostic drills" },
        ].map((ph, i) => {
          const done = p[ph.id];
          const active = currentPhase === ph.id;
          return (
            <div key={ph.id} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 0", borderBottom: i < 2 ? "1px solid #1a2535" : "none", opacity: done || active || i === 0 ? 1 : 0.4 }}>
              <div style={{ width: "24px", height: "24px", flexShrink: 0, background: done ? "#39ff14" : active ? "rgba(57,255,20,0.15)" : "#1a2535", border: `1px solid ${done ? "#39ff14" : active ? "#39ff14" : "#2a3548"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "12px", color: done ? "#080c10" : "#39ff14" }}>
                {done ? "✓" : i + 1}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: done ? "#64748b" : "#f0f4f8", textDecoration: done ? "line-through" : "none" }}>{ph.label}</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>{ph.time} — {ph.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
      {currentPhase ? (
        <button onClick={() => onStart(currentPhase)} style={S.btn}>
          {completed.length === 0 ? "BEGIN MISSION" : `CONTINUE → ${currentPhase.toUpperCase()}`}
        </button>
      ) : (
        <div style={S.explanation}><div style={S.sectionLabel}>DAY {day} COMPLETE</div>All phases finished.</div>
      )}
    </div>
  );
}

function HomeScreen({ progress, onSelectDay, currentDay }) {
  const titles = ["Network Foundations", "Devices + Flow", "Ports + Protocols", "Windows Tools", "Troubleshooting Logic", "Mixed Simulation", "Full Exam"];
  return (
    <div>
      <div style={{ ...S.card, marginBottom: "20px", borderColor: "#39ff14" }}>
        <div style={S.sectionLabel}>7-DAY TRAINING PROGRAM</div>
        <div style={S.h1}>CompTIA A+ Core 1</div>
        <div style={S.body}>220-1101 Exam Prep — Recall-First Training</div>
      </div>
      {[1,2,3,4,5,6,7].map(d => {
        const p = progress[d] || {};
        const done = ["flashcards","quiz","scenarios"].filter(ph => p[ph]).length;
        const unlocked = d <= currentDay;
        const complete = done === 3;
        return (
          <button key={d} onClick={() => unlocked && onSelectDay(d)} style={{ ...S.cardAlt, cursor: unlocked ? "pointer" : "default", opacity: unlocked ? 1 : 0.35, display: "flex", alignItems: "center", gap: "16px", border: d === currentDay && !complete ? "1px solid #39ff14" : "1px solid #1e2d42", padding: "16px 20px", width: "100%", textAlign: "left", marginBottom: "8px", background: complete ? "#080c10" : d === currentDay ? "#0d1a26" : "#0a1018" }}>
            <div style={{ width: "36px", height: "36px", flexShrink: 0, background: complete ? "rgba(57,255,20,0.15)" : d === currentDay ? "rgba(57,255,20,0.1)" : "#0d1520", border: `1px solid ${complete ? "#39ff14" : d === currentDay ? "rgba(57,255,20,0.5)" : "#1a2535"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", fontWeight: 700, color: complete ? "#39ff14" : d === currentDay ? "#39ff14" : "#64748b" }}>
              {complete ? "✓" : `D${d}`}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "14px", color: complete ? "#64748b" : "#f0f4f8" }}>{titles[d-1]}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{!unlocked ? "🔒 Locked" : complete ? "Complete" : `${done}/3 phases`}</div>
            </div>
            {d === currentDay && !complete && <div style={{ ...S.mono, fontSize: "10px" }}>ACTIVE →</div>}
          </button>
        );
      })}
    </div>
  );
}

function FinalReport({ allProgress, onReset }) {
  const allQuizResults = Object.values(allProgress).flatMap(p => p.quizResults || []);
  const total = allQuizResults.length;
  const correct = allQuizResults.filter(r => r.correct).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const categories = {};
  allQuizResults.forEach(r => {
    const cat = r.category || "General";
    if (!categories[cat]) categories[cat] = { total: 0, correct: 0 };
    categories[cat].total++;
    if (r.correct) categories[cat].correct++;
  });

  return (
    <div>
      <div style={S.sectionLabel}>TRAINING COMPLETE</div>
      <div style={{ ...S.h1, marginBottom: "8px" }}>7-Day Report</div>
      <div style={{ ...S.body, marginBottom: "24px" }}>CompTIA A+ Core 1 Readiness Assessment</div>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ ...S.monoLarge, fontSize: "64px" }}>{pct}%</div>
        <div style={{ color: "#64748b", fontSize: "13px", letterSpacing: "0.1em" }}>OVERALL READINESS</div>
        <div style={{ marginTop: "8px", fontSize: "14px", color: pct >= 85 ? "#39ff14" : pct >= 70 ? "#f59e0b" : "#ff4444" }}>
          {pct >= 85 ? "EXAM READY ✓" : pct >= 70 ? "NEAR READY — REVIEW WEAK AREAS" : "NEEDS MORE STUDY"}
        </div>
      </div>
      <div style={{ ...S.card, marginBottom: "16px" }}>
        <div style={{ ...S.sectionLabel, marginBottom: "12px" }}>CATEGORY BREAKDOWN</div>
        {Object.entries(categories).map(([cat, data]) => {
          const cpct = Math.round((data.correct / data.total) * 100);
          return (
            <div key={cat} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>{cat}</span>
                <span style={{ ...S.mono, fontSize: "12px", color: cpct >= 80 ? "#39ff14" : cpct >= 60 ? "#f59e0b" : "#ff4444" }}>{cpct}%</span>
              </div>
              <div style={{ height: "2px", background: "#1a2535" }}>
                <div style={{ height: "100%", width: `${cpct}%`, background: cpct >= 80 ? "#39ff14" : cpct >= 60 ? "#f59e0b" : "#ff4444" }} />
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={onReset} style={S.btnOutline}>RESET & START OVER</button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [currentDay, setCurrentDay] = useState(() => getStorage("currentDay", 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const [activePhase, setActivePhase] = useState(null);
  const [progress, setProgress] = useState(() => getStorage("progress", {}));

  const saveProgress = useCallback((newProg) => { setProgress(newProg); setStorage("progress", newProg); }, []);
  const updateCurrentDay = useCallback((day) => { setCurrentDay(day); setStorage("currentDay", day); }, []);

  const handleSelectDay = (d) => { setSelectedDay(d); setScreen("day"); };
  const handleStartPhase = (phase) => { setActivePhase(phase); setScreen("phase"); };

  const handlePhaseComplete = (phase, result) => {
    const newProgress = { ...progress, [selectedDay]: { ...(progress[selectedDay] || {}), [phase]: true, [`${phase}Results`]: result } };
    if (phase === "quiz") newProgress[selectedDay].quizResults = result;
    saveProgress(newProgress);
    const phases = ["flashcards", "quiz", "scenarios"];
    const donePrev = phases.filter(ph => (progress[selectedDay] || {})[ph]);
    const justCompleted = [...new Set([...donePrev, phase])];
    if (justCompleted.length === 3) {
      if (selectedDay >= currentDay) updateCurrentDay(Math.min(selectedDay + 1, 7));
      if (selectedDay === 7) { setScreen("finalReport"); } else { setScreen("results"); }
    } else {
      setScreen("day");
    }
  };

  const handleResultsContinue = () => {
    if (selectedDay < 7) { setSelectedDay(selectedDay + 1); setScreen("day"); }
    else { setScreen("finalReport"); }
  };

  const handleReset = () => { setProgress({}); setStorage("progress", {}); updateCurrentDay(1); setSelectedDay(null); setScreen("home"); };

  const getDayData = () => {
    const data = CURRICULUM[selectedDay];
    if (!data) return { cards: [], questions: [], scenarios: [] };
    let cards = data.flashcards;
    if (selectedDay >= 6) {
      const hardIds = new Set();
      Object.values(progress).forEach(p => { const ratings = p.flashcardsResults?.ratings || {}; Object.entries(ratings).forEach(([id, r]) => { if (r === "hard") hardIds.add(id); }); });
      const weakCards = ALL_FLASHCARDS.filter(c => hardIds.has(c.id));
      cards = weakCards.length > 3 ? shuffle(weakCards).slice(0, 10) : shuffle(ALL_FLASHCARDS).slice(0, 8);
    }
    return { cards: shuffle(cards), questions: selectedDay >= 6 ? shuffle(data.quiz) : data.quiz, scenarios: data.scenarios };
  };

  const renderPhase = () => {
    const { cards, questions, scenarios } = getDayData();
    if (activePhase === "flashcards") {
      const finalCards = cards.length > 0 ? cards : shuffle(ALL_FLASHCARDS).slice(0, 8);
      return <FlashcardView cards={finalCards} onComplete={(r) => handlePhaseComplete("flashcards", r)} />;
    }
    if (activePhase === "quiz") return <QuizView questions={questions} timed={selectedDay >= 6} noHints={selectedDay === 7} onComplete={(r) => handlePhaseComplete("quiz", r)} />;
    if (activePhase === "scenarios") {
      const useScenarios = scenarios.length > 0 ? scenarios : Object.values(CURRICULUM).flatMap(d => d.scenarios).slice(0, 2);
      return <ScenarioView scenarios={useScenarios} onComplete={(r) => handlePhaseComplete("scenarios", r)} />;
    }
  };

  const dayProgress = progress[selectedDay] || {};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #080c10; }
        button { transition: opacity 0.15s; }
        button:hover { opacity: 0.85; }
        button:active { opacity: 0.7; transform: scale(0.99); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080c10; }
        ::-webkit-scrollbar-thumb { background: #1a2535; }
      `}</style>
      <div style={S.app}>
        <div style={S.header}>
          <div style={S.logo}>A+_CORE1</div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {screen !== "home" && <button onClick={() => setScreen(screen === "phase" ? "day" : "home")} style={{ ...S.btnGhost, width: "auto", padding: "6px 12px", margin: 0, fontSize: "12px" }}>← BACK</button>}
            <div style={S.dayBadge}>DAY {currentDay}/7</div>
          </div>
        </div>
        <div style={S.page}>
          {screen === "home" && <HomeScreen progress={progress} onSelectDay={handleSelectDay} currentDay={currentDay} />}
          {screen === "day" && selectedDay && <DayDashboard day={selectedDay} progress={progress} onStart={handleStartPhase} />}
          {screen === "phase" && activePhase && renderPhase()}
          {screen === "results" && <ResultsView quizResults={dayProgress.quizResults || []} flashResults={dayProgress.flashcardsResults || null} day={selectedDay} onContinue={handleResultsContinue} />}
          {screen === "finalReport" && <FinalReport allProgress={progress} onReset={handleReset} />}
        </div>
      </div>
    </>
  );
          }
