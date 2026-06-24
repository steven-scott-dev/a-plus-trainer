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
    objective: "Understand traffic flow (LAN
