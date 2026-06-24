const DIFFICULTY_PLAN = [
  ["beginner", 4],
  ["intermediate", 4],
  ["exam-level", 2],
];

const QUESTION_TYPES = [
  "multiple-choice",
  "true-false",
  "fill-in-the-blank",
  "scenario-based",
  "troubleshooting",
];

const PORT_PROTOCOLS = [
  { name: "FTP data", protocol: "FTP", ports: "20", transport: "TCP", secure: false, role: "carries file data in active FTP sessions", tip: "legacy file transfer; credentials are not encrypted" },
  { name: "FTP control", protocol: "FTP", ports: "21", transport: "TCP", secure: false, role: "controls FTP authentication and commands", tip: "use SFTP or FTPS when credentials must be protected" },
  { name: "SSH", protocol: "SSH", ports: "22", transport: "TCP", secure: true, role: "provides encrypted remote CLI administration", tip: "common secure replacement for Telnet" },
  { name: "Telnet", protocol: "Telnet", ports: "23", transport: "TCP", secure: false, role: "provides unencrypted remote CLI access", tip: "avoid on production networks because credentials are clear text" },
  { name: "SMTP", protocol: "SMTP", ports: "25", transport: "TCP", secure: false, role: "transfers email between mail servers", tip: "used for sending mail, not reading a mailbox" },
  { name: "DNS", protocol: "DNS", ports: "53", transport: "TCP/UDP", secure: false, role: "resolves host names to IP addresses", tip: "UDP is common for queries; TCP is used for zone transfers and large replies" },
  { name: "DHCP server", protocol: "DHCP", ports: "67", transport: "UDP", secure: false, role: "receives client lease requests", tip: "servers listen on UDP 67" },
  { name: "DHCP client", protocol: "DHCP", ports: "68", transport: "UDP", secure: false, role: "receives DHCP offers and acknowledgments", tip: "clients listen on UDP 68" },
  { name: "TFTP", protocol: "TFTP", ports: "69", transport: "UDP", secure: false, role: "performs simple unauthenticated file transfers", tip: "often used for PXE boot files and device firmware" },
  { name: "HTTP", protocol: "HTTP", ports: "80", transport: "TCP", secure: false, role: "serves unencrypted web traffic", tip: "HTTPS is preferred for sensitive web sessions" },
  { name: "POP3", protocol: "POP3", ports: "110", transport: "TCP", secure: false, role: "downloads email from a mailbox to a client", tip: "often removes mail from the server after download unless configured otherwise" },
  { name: "NTP", protocol: "NTP", ports: "123", transport: "UDP", secure: false, role: "synchronizes clocks across network devices", tip: "time drift can break authentication and logging correlation" },
  { name: "IMAP", protocol: "IMAP", ports: "143", transport: "TCP", secure: false, role: "keeps email synchronized on the mail server", tip: "better than POP3 for multiple devices using one mailbox" },
  { name: "LDAP", protocol: "LDAP", ports: "389", transport: "TCP/UDP", secure: false, role: "queries directory services", tip: "commonly associated with centralized identity directories" },
  { name: "HTTPS", protocol: "HTTPS", ports: "443", transport: "TCP", secure: true, role: "serves encrypted web traffic", tip: "uses TLS to protect web sessions" },
  { name: "SMB", protocol: "SMB", ports: "445", transport: "TCP", secure: false, role: "supports Windows file and printer sharing", tip: "do not expose SMB directly to the internet" },
  { name: "RDP", protocol: "RDP", ports: "3389", transport: "TCP/UDP", secure: true, role: "provides graphical remote desktop access", tip: "protect with VPN, MFA, and restricted firewall rules" },
  { name: "SIP", protocol: "SIP", ports: "5060/5061", transport: "TCP/UDP", secure: true, role: "sets up and tears down VoIP calls", tip: "5061 is commonly used for SIP over TLS" },
  { name: "SNMP manager", protocol: "SNMP", ports: "161", transport: "UDP", secure: false, role: "queries and manages network devices", tip: "SNMPv3 adds authentication and encryption" },
  { name: "SNMP trap", protocol: "SNMP", ports: "162", transport: "UDP", secure: false, role: "receives device alerts called traps", tip: "monitoring systems listen for traps on UDP 162" },
];

const NETWORK_DEVICES = [
  { name: "Router", layer: "Layer 3", role: "forwards traffic between IP networks", examTip: "default gateways are usually router interfaces", symptom: "users can reach local devices but not another subnet" },
  { name: "Switch", layer: "Layer 2", role: "forwards frames by MAC address", examTip: "switches reduce collisions by creating separate collision domains", symptom: "one switch port or VLAN can isolate a workstation" },
  { name: "Hub", layer: "Layer 1", role: "repeats bits to every connected port", examTip: "hubs are half-duplex and create one collision domain", symptom: "collisions and poor performance increase as devices are added" },
  { name: "Bridge", layer: "Layer 2", role: "connects and filters network segments", examTip: "bridges are an older way to divide collision domains", symptom: "incorrect placement can allow unnecessary traffic between segments" },
  { name: "Repeater", layer: "Layer 1", role: "regenerates a signal to extend distance", examTip: "repeaters do not inspect MAC or IP addresses", symptom: "weak signal improves after adding a repeater within distance limits" },
  { name: "Modem", layer: "WAN edge", role: "modulates provider signals for internet access", examTip: "cable and DSL connections require a compatible modem", symptom: "all local devices lose internet when the modem loses provider sync" },
  { name: "Firewall", layer: "Layer 3/4/7", role: "permits or blocks traffic by policy", examTip: "host and network firewalls can both block required ports", symptom: "service works locally but fails from another network" },
  { name: "Access Point", layer: "Layer 2", role: "connects wireless clients to a wired LAN", examTip: "AP placement and channel selection affect coverage", symptom: "users report low signal or roaming drops" },
  { name: "Load Balancer", layer: "Layer 4/7", role: "distributes client requests across servers", examTip: "improves availability and performance for server farms", symptom: "one failed server is hidden if health checks remove it" },
  { name: "Proxy", layer: "Application", role: "acts as an intermediary for client requests", examTip: "proxies can cache, filter, and log web traffic", symptom: "web access fails only when proxy settings are wrong" },
  { name: "IDS", layer: "Security", role: "detects suspicious traffic and alerts", examTip: "IDS is passive detection", symptom: "alerts are generated but traffic is not automatically blocked" },
  { name: "IPS", layer: "Security", role: "detects and blocks suspicious traffic inline", examTip: "IPS can stop traffic but may affect availability if tuned poorly", symptom: "legitimate traffic may be dropped after a signature update" },
  { name: "NAS", layer: "Storage", role: "provides file storage over the network", examTip: "clients commonly access NAS shares through SMB or NFS", symptom: "users can browse the network but cannot access shared files" },
  { name: "Patch Panel", layer: "Cabling", role: "terminates and organizes horizontal cabling", examTip: "patch panels do not switch or route traffic", symptom: "a mislabeled patch causes the wrong wall jack to connect" },
  { name: "PoE Device", layer: "Power/Data", role: "receives power and data over Ethernet", examTip: "phones, cameras, and APs commonly use PoE", symptom: "device fails when connected to a non-PoE port or insufficient power budget" },
];

const IP_TOPICS = [
  { name: "IPv4", detail: "32-bit dotted decimal addressing such as 192.168.1.10", key: "supports subnet masks and private address ranges" },
  { name: "IPv6", detail: "128-bit hexadecimal addressing such as 2001:db8::10", key: "uses shortened notation and has a much larger address space" },
  { name: "Public IP", detail: "globally routable address assigned for internet communication", key: "must be unique on the public internet" },
  { name: "Private IP", detail: "RFC 1918 address used inside private networks", key: "10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 are private" },
  { name: "APIPA", detail: "automatic 169.254.0.0/16 address used when DHCP fails", key: "a client with APIPA usually cannot reach routed networks" },
  { name: "Loopback", detail: "local test address for the host IP stack", key: "IPv4 loopback is 127.0.0.1 and IPv6 loopback is ::1" },
  { name: "Gateway", detail: "router address a host uses to leave its local network", key: "wrong gateway breaks off-subnet communication" },
  { name: "DNS", detail: "name resolution service that maps names to addresses", key: "wrong DNS can make internet access look broken while ping by IP still works" },
  { name: "DHCP", detail: "service that automatically leases IP configuration", key: "leases include IP address, subnet mask, gateway, and DNS servers" },
  { name: "Subnet Mask", detail: "identifies the network and host portions of an IPv4 address", key: "255.255.255.0 equals /24" },
  { name: "CIDR", detail: "slash notation that represents prefix length", key: "/24 means the first 24 bits are the network portion" },
  { name: "Network Portion", detail: "address bits shared by hosts on the same subnet", key: "devices must share the same network portion to communicate locally" },
  { name: "Host Portion", detail: "address bits that identify a device within a subnet", key: "all-zero host bits identify the network address" },
  { name: "NAT", detail: "translates private addresses to a routable address", key: "used at the network edge to conserve public IPv4 addresses" },
  { name: "PAT", detail: "maps many internal hosts to one public address using port numbers", key: "also called NAT overload" },
];

const CABLING_TOPICS = [
  { name: "Cat5e", medium: "copper twisted pair", use: "1 Gbps Ethernet up to 100 meters", tip: "common baseline for Gigabit Ethernet" },
  { name: "Cat6", medium: "copper twisted pair", use: "1 Gbps to 100 meters and 10 Gbps at shorter distances", tip: "better crosstalk control than Cat5e" },
  { name: "Cat6a", medium: "copper twisted pair", use: "10 Gbps Ethernet up to 100 meters", tip: "augmented cable for higher-speed copper runs" },
  { name: "Cat7", medium: "shielded copper", use: "high-speed shielded Ethernet environments", tip: "less commonly tested in real deployments than Cat6a" },
  { name: "Cat8", medium: "shielded copper", use: "25/40 Gbps short data center runs", tip: "intended for short high-speed switch links" },
  { name: "Single Mode Fiber", medium: "fiber", use: "long-distance, high-bandwidth links", tip: "uses a small core and laser light" },
  { name: "Multi Mode Fiber", medium: "fiber", use: "shorter-distance fiber links inside buildings or campuses", tip: "uses a larger core and is often less expensive for short runs" },
  { name: "RJ45", medium: "connector", use: "terminates twisted-pair Ethernet cables", tip: "standard connector for copper Ethernet patch cables" },
  { name: "LC", medium: "connector", use: "small form-factor fiber connections", tip: "common on modern fiber transceivers" },
  { name: "SC", medium: "connector", use: "push-pull fiber connections", tip: "larger square fiber connector" },
  { name: "ST", medium: "connector", use: "bayonet-style fiber connections", tip: "older round fiber connector" },
  { name: "F Connector", medium: "connector", use: "coaxial cable for cable broadband or TV", tip: "threaded connector used with coax" },
];

const WIRELESS_TOPICS = [
  { name: "802.11a", band: "5 GHz", speed: "up to 54 Mbps", tip: "older 5 GHz standard with shorter range than 2.4 GHz" },
  { name: "802.11b", band: "2.4 GHz", speed: "up to 11 Mbps", tip: "legacy standard that can slow mixed networks" },
  { name: "802.11g", band: "2.4 GHz", speed: "up to 54 Mbps", tip: "backward compatible with 802.11b" },
  { name: "802.11n", band: "2.4 GHz and 5 GHz", speed: "up to 600 Mbps", tip: "uses MIMO to improve throughput" },
  { name: "802.11ac", band: "5 GHz", speed: "multi-gigabit theoretical speeds", tip: "Wi-Fi 5 standard focused on 5 GHz" },
  { name: "802.11ax", band: "2.4 GHz, 5 GHz, and 6 GHz with Wi-Fi 6E support", speed: "higher efficiency and throughput", tip: "Wi-Fi 6 improves dense environments" },
  { name: "2.4 GHz", band: "2.4 GHz", speed: "longer range and lower throughput", tip: "more prone to interference from Bluetooth, microwaves, and crowded channels" },
  { name: "5 GHz", band: "5 GHz", speed: "higher throughput and shorter range", tip: "offers more non-overlapping channels than 2.4 GHz" },
  { name: "6 GHz", band: "6 GHz", speed: "high throughput with less congestion", tip: "requires Wi-Fi 6E capable clients and APs" },
  { name: "WPA2", band: "wireless security", speed: "AES-based encryption", tip: "stronger than WEP and WPA when configured with a strong passphrase" },
  { name: "WPA3", band: "wireless security", speed: "modern authentication protections", tip: "improves password-based security with SAE" },
];

const TOOL_TOPICS = [
  { name: "ping", platform: "Windows/Linux/macOS", purpose: "tests basic IP reachability with ICMP", example: "ping 8.8.8.8" },
  { name: "tracert", platform: "Windows", purpose: "shows router hops to a destination", example: "tracert example.com" },
  { name: "pathping", platform: "Windows", purpose: "combines route tracing with packet loss statistics", example: "pathping example.com" },
  { name: "ipconfig", platform: "Windows", purpose: "displays and renews TCP/IP configuration", example: "ipconfig /all" },
  { name: "netstat", platform: "Windows/Linux/macOS", purpose: "shows active connections, listening ports, and protocol statistics", example: "netstat -ano" },
  { name: "arp", platform: "Windows/Linux/macOS", purpose: "views or manages the IP-to-MAC address cache", example: "arp -a" },
  { name: "nslookup", platform: "Windows/Linux/macOS", purpose: "queries DNS records and tests name resolution", example: "nslookup comptia.org" },
  { name: "dig", platform: "Linux/macOS", purpose: "performs detailed DNS lookups", example: "dig comptia.org" },
  { name: "ifconfig", platform: "Linux/macOS legacy", purpose: "views or configures network interfaces on Unix-like systems", example: "ifconfig" },
  { name: "tcpdump", platform: "Linux/macOS", purpose: "captures and filters network packets", example: "tcpdump port 53" },
];

const SECTION_CONFIG = {
  ports: { label: "Ports and Protocols", category: "Networking - Ports and Protocols", topics: PORT_PROTOCOLS, flashcards: 100, quizzes: 150, scenarios: 10 },
  devices: { label: "Network Devices", category: "Networking - Network Devices", topics: NETWORK_DEVICES, flashcards: 75, quizzes: 100, scenarios: 10 },
  ip: { label: "IP Addressing", category: "Networking - IP Addressing", topics: IP_TOPICS, flashcards: 100, quizzes: 150, scenarios: 15 },
  cabling: { label: "Network Cabling", category: "Networking - Network Cabling", topics: CABLING_TOPICS, flashcards: 75, quizzes: 100, scenarios: 10 },
  wireless: { label: "Wireless Networking", category: "Networking - Wireless Networking", topics: WIRELESS_TOPICS, flashcards: 75, quizzes: 100, scenarios: 10 },
  tools: { label: "Network Tools", category: "Networking - Network Tools", topics: TOOL_TOPICS, flashcards: 50, quizzes: 100, scenarios: 10 },
};

const rotate = (items, index) => items[index % items.length];

const topicAnswer = (sectionKey, topic) => {
  if (sectionKey === "ports") return `${topic.protocol} uses ${topic.transport} port ${topic.ports} for ${topic.role}.`;
  if (sectionKey === "devices") return `${topic.name} operates as ${topic.layer} equipment that ${topic.role}. ${topic.examTip}.`;
  if (sectionKey === "ip") return `${topic.name}: ${topic.detail}. ${topic.key}.`;
  if (sectionKey === "cabling") return `${topic.name} is ${topic.medium} used for ${topic.use}. ${topic.tip}.`;
  if (sectionKey === "wireless") return `${topic.name} uses ${topic.band}; ${topic.tip}.`;
  return `${topic.name} is a ${topic.platform} tool that ${topic.purpose}. Example: ${topic.example}.`;
};

const flashcardFronts = [
  (section, topic) => `What should you remember about ${topic.name} for ${section.label}?`,
  (section, topic) => `In ${section.label}, when is ${topic.name} the best answer?`,
  (section, topic) => `Which exam clue points to ${topic.name}?`,
  (section, topic) => `What problem does ${topic.name} help solve?`,
  (section, topic) => `What is a common troubleshooting clue for ${topic.name}?`,
  (section, topic) => `How does ${topic.name} fit into a small office network?`,
  (section, topic) => `What is the key risk or limitation of ${topic.name}?`,
  (section, topic) => `What should a technician verify when working with ${topic.name}?`,
  (section, topic) => `What distinguishes ${topic.name} from similar networking options?`,
  (section, topic) => `What is the practical A+ takeaway for ${topic.name}?`,
];

const makeFlashcards = (sectionKey) => {
  const section = SECTION_CONFIG[sectionKey];
  return Array.from({ length: section.flashcards }, (_, index) => {
    const topic = rotate(section.topics, index);
    const template = rotate(flashcardFronts, Math.floor(index / section.topics.length));
    return {
      front: `${template(section, topic)} Study cue ${index + 1}.`,
      back: topicAnswer(sectionKey, topic),
      category: section.category,
    };
  });
};

const distractorsFor = (sectionKey, topic, index) => {
  const topics = SECTION_CONFIG[sectionKey].topics;
  if (sectionKey === "ports") {
    return topics.filter((item) => item.ports !== topic.ports).slice(index % 6, (index % 6) + 3).map((item) => item.ports);
  }
  return topics.filter((item) => item.name !== topic.name).slice(index % 5, (index % 5) + 3).map((item) => item.name);
};

const normalizeChoices = (correct, distractors) => {
  const pool = [...new Set([correct, ...distractors])].filter(Boolean);
  while (pool.length < 4) pool.push(`Not ${correct} option ${pool.length}`);
  return pool.slice(0, 4);
};

const quizQuestion = (sectionKey, topic, index, difficulty, type) => {
  const section = SECTION_CONFIG[sectionKey];
  if (sectionKey === "ports") {
    const secureAnswer = topic.secure ? "True" : "False";
    const portChoices = normalizeChoices(topic.ports, distractorsFor(sectionKey, topic, index));
    const questions = {
      "multiple-choice": {
        question: `Which port is associated with ${topic.name}?`,
        choices: portChoices,
        correctAnswer: topic.ports,
        explanation: `${topic.protocol} uses ${topic.transport} port ${topic.ports}; ${topic.tip}.`,
      },
      "true-false": {
        question: `${topic.name} is appropriate when encrypted protection is required by default.`,
        choices: ["True", "False"],
        correctAnswer: secureAnswer,
        explanation: topic.secure ? `${topic.name} is normally associated with encrypted sessions.` : `${topic.name} is not encrypted by default; choose a secure alternative when credentials or sensitive data are involved.`,
      },
      "fill-in-the-blank": {
        question: `Fill in the blank: ${topic.protocol} commonly uses port ____ for ${topic.role}.`,
        choices: portChoices,
        correctAnswer: topic.ports,
        explanation: `${topic.name} maps to ${topic.transport} port ${topic.ports}.`,
      },
      "scenario-based": {
        question: `A firewall rule must allow traffic that ${topic.role}. Which service should be allowed?`,
        choices: normalizeChoices(topic.protocol, distractorsFor(sectionKey, topic, index).map((port) => rotate(PORT_PROTOCOLS, Number.parseInt(port, 10) || index).protocol)),
        correctAnswer: topic.protocol,
        explanation: `${topic.protocol} is the protocol for this task and is tied to port ${topic.ports}.`,
      },
      troubleshooting: {
        question: `A service using ${topic.protocol} is blocked after a firewall change. Which port should the technician verify first?`,
        choices: portChoices,
        correctAnswer: topic.ports,
        explanation: `The first check is the documented ${topic.protocol} port: ${topic.ports}/${topic.transport}.`,
      },
    };
    return { ...questions[type], difficulty, type, domain: "CompTIA A+ 220-1101 Domain 2", category: section.category };
  }

  const answer = topic.name;
  const choices = normalizeChoices(answer, distractorsFor(sectionKey, topic, index));
  const fact = topicAnswer(sectionKey, topic);
  const trueStatement = index % 2 === 0;
  const questions = {
    "multiple-choice": {
      question: `Which ${section.label.toLowerCase()} item best matches this description: ${fact}`,
      choices,
      correctAnswer: answer,
      explanation: fact,
    },
    "true-false": {
      question: trueStatement ? `${answer} is correctly described as: ${fact}` : `${answer} should be selected primarily for an unrelated email mailbox problem.`,
      choices: ["True", "False"],
      correctAnswer: trueStatement ? "True" : "False",
      explanation: trueStatement ? fact : `${answer} is tested in ${section.label}, not as a generic mailbox fix unless the scenario specifically involves its networking role.`,
    },
    "fill-in-the-blank": {
      question: `Fill in the blank: The best match for "${fact}" is ____.`,
      choices,
      correctAnswer: answer,
      explanation: `${answer} is the correct match because ${fact}`,
    },
    "scenario-based": {
      question: `A technician sees this clue: ${sectionKey === "devices" ? topic.symptom : fact} What should be considered first?`,
      choices,
      correctAnswer: answer,
      explanation: `${answer} fits the clue. ${fact}`,
    },
    troubleshooting: {
      question: `During troubleshooting, which option should be checked when the symptom points to ${answer}?`,
      choices,
      correctAnswer: answer,
      explanation: `The symptom maps to ${answer}. ${fact}`,
    },
  };
  return { ...questions[type], difficulty, type, domain: "CompTIA A+ 220-1101 Domain 2", category: section.category };
};

const makeQuizzes = (sectionKey) => {
  const section = SECTION_CONFIG[sectionKey];
  return Array.from({ length: section.quizzes }, (_, index) => {
    const difficulty = DIFFICULTY_PLAN[Math.floor((index % 10) / 2.5)]?.[0] || rotate(DIFFICULTY_PLAN, index)[0];
    const planIndex = index % 10;
    const plannedDifficulty = planIndex < 4 ? "beginner" : planIndex < 8 ? "intermediate" : "exam-level";
    return quizQuestion(sectionKey, rotate(section.topics, index), index, plannedDifficulty, rotate(QUESTION_TYPES, index));
  });
};

const scenarioLibrary = {
  ports: [
    ["Port Mismatch on Secure Remote Access", "A technician can ping a Linux server but cannot open a secure remote terminal after a firewall replacement.", ["Verify the service is SSH, not Telnet.", "Confirm TCP 22 is allowed from the admin subnet.", "Test from an approved management workstation.", "Document the firewall rule and retest login."], "Allow SSH on TCP 22 only from approved management sources.", "intermediate"],
    ["Blocked Web Checkout", "Users can browse an internal catalog over HTTP but checkout fails when the site redirects to a secure page.", ["Confirm HTTPS is required for checkout.", "Verify TCP 443 is open to the web server.", "Check the certificate after connectivity is restored.", "Retest from a client outside the server VLAN."], "Permit HTTPS on TCP 443 and verify TLS access.", "beginner"],
    ["Email Send Failure", "A scanner can receive network settings but cannot send scan-to-email through the mail relay.", ["Identify the relay protocol.", "Test TCP 25 from the scanner VLAN.", "Check relay permissions for the scanner IP.", "Send a test scan after the rule change."], "Allow SMTP TCP 25 to the approved relay and authorize the device.", "intermediate"],
    ["VoIP Registration Failure", "New desk phones receive DHCP leases but cannot register with the call server.", ["Check DHCP scope options for voice VLAN settings.", "Verify SIP ports 5060 and 5061 between phones and call server.", "Confirm phones are on the correct VLAN.", "Place a test call."], "Restore SIP access on 5060/5061 and correct the voice VLAN settings.", "exam-level"],
    ["Monitoring Alerts Missing", "A network monitor can poll switches but no longer receives unsolicited device alerts.", ["Confirm SNMP polling on UDP 161 still works.", "Check whether traps are sent to the monitor.", "Allow UDP 162 to the monitoring server.", "Generate a test trap."], "Permit SNMP traps on UDP 162 to the monitoring system.", "intermediate"],
    ["DNS Query Failure", "Users can ping 8.8.8.8 but cannot resolve host names.", ["Check configured DNS server addresses.", "Test UDP/TCP 53 to the DNS resolver.", "Flush the client DNS cache after correcting settings.", "Retest name resolution."], "Restore DNS service reachability on port 53 and correct client DNS settings.", "beginner"],
    ["DHCP Lease Failure", "Clients on one VLAN start assigning themselves 169.254 addresses.", ["Confirm the DHCP server is online.", "Verify DHCP relay or helper configuration.", "Check UDP 67 and 68 between the VLAN and server.", "Renew a client lease."], "Restore DHCP relay and allow UDP 67/68.", "exam-level"],
    ["File Share Blocked", "A Windows file share works locally on the server but not from workstations.", ["Verify the share and NTFS permissions.", "Check firewall rules for SMB.", "Allow TCP 445 from the client subnet.", "Map the share by name and IP."], "Allow SMB TCP 445 and confirm permissions.", "intermediate"],
    ["Time Sync Drift", "Domain clients show authentication errors and event logs have inconsistent timestamps.", ["Check client time source.", "Verify NTP reachability.", "Allow UDP 123 to the time source.", "Force time sync and retry authentication."], "Restore NTP over UDP 123.", "exam-level"],
    ["Legacy TFTP Boot Issue", "PXE devices receive addresses but fail while downloading the boot file.", ["Confirm DHCP points to the correct boot server.", "Verify TFTP service status.", "Check UDP 69 between client VLAN and server.", "Retry PXE boot."], "Restore TFTP UDP 69 and correct boot options.", "intermediate"],
  ],
  devices: [
    ["Switch vs Hub Diagnosis", "A small office still uses a hub and users report collisions and slow transfers when everyone arrives.", ["Identify the hub as a Layer 1 repeater.", "Replace it with a switch.", "Verify each device negotiates full duplex.", "Retest file transfer performance."], "Replace the hub with a switch to create separate collision domains.", "beginner"],
    ["Wrong Default Gateway", "Users can print locally but cannot reach cloud services after a router replacement.", ["Check client IP, mask, gateway, and DNS.", "Verify the router interface address.", "Correct DHCP gateway option.", "Renew leases and retest internet access."], "Correct the router/default gateway configuration.", "intermediate"],
    ["AP Coverage Gap", "Wireless users lose connection in a conference room far from the wiring closet.", ["Survey signal strength.", "Check AP placement and channel use.", "Install or reposition an access point.", "Validate coverage with client testing."], "Improve AP placement or add an AP with proper channel planning.", "intermediate"],
    ["Firewall Rule Blocks App", "An internal app works from the server but remote clients time out.", ["Identify the application port.", "Review firewall allow rules.", "Add the least-privilege rule.", "Confirm logs show permitted traffic."], "Update the firewall policy to allow required traffic only from approved sources.", "exam-level"],
    ["Proxy Misconfiguration", "Only web browsing fails on one workstation after browser settings were changed.", ["Compare proxy settings to a working client.", "Disable incorrect manual proxy or set the approved proxy.", "Test HTTP and HTTPS.", "Document the setting source."], "Correct the workstation proxy configuration.", "beginner"],
    ["IPS False Positive", "A new IPS signature blocks a business application after an update.", ["Confirm the block in IPS logs.", "Identify the matching signature.", "Tune or create an exception for the application.", "Monitor for repeated events."], "Tune the IPS rule while maintaining protection.", "exam-level"],
    ["NAS Share Access", "Users can ping a NAS but cannot open department shares.", ["Verify SMB service status.", "Check share and user permissions.", "Confirm TCP 445 is reachable.", "Map the share with a test account."], "Restore SMB/share permissions on the NAS.", "intermediate"],
    ["Patch Panel Label Error", "A desk jack activates the wrong switch port after a move.", ["Trace the wall jack to the patch panel.", "Check patch cable placement.", "Correct the patch and label.", "Test link from the desk."], "Correct the patch panel connection and labeling.", "beginner"],
    ["PoE Camera Offline", "A new IP camera powers off immediately after being connected.", ["Check whether the switch port supports PoE.", "Review PoE budget.", "Move to a PoE-capable port or injector.", "Verify link and camera boot."], "Provide sufficient PoE power to the device.", "intermediate"],
    ["Load Balancer Health Check", "Users intermittently hit an unavailable web server behind a load balancer.", ["Review backend health checks.", "Remove the failed server from rotation.", "Fix the backend service.", "Return it after health checks pass."], "Configure health checks so failed servers are not served to clients.", "exam-level"],
  ],
  ip: [
    ["User Receives APIPA Address", "A laptop shows 169.254.22.9 and cannot reach the internet.", ["Confirm the address is APIPA.", "Check physical or wireless connectivity.", "Verify DHCP server or relay availability.", "Renew the DHCP lease."], "Restore DHCP connectivity so the client receives a valid lease.", "beginner"],
    ["Wrong Subnet Mask", "Two PCs have 192.168.10.x addresses but one uses 255.255.0.0 and reaches unexpected local hosts.", ["Compare settings to a working PC.", "Identify the intended CIDR prefix.", "Correct the subnet mask.", "Retest local and gateway connectivity."], "Set the correct subnet mask for the subnet.", "intermediate"],
    ["DNS Failure", "A user can ping a public IP address but cannot browse to websites by name.", ["Test name resolution.", "Check DNS server settings.", "Use nslookup against the configured resolver.", "Correct DNS and flush cache."], "Correct DNS settings or restore resolver access.", "beginner"],
    ["Bad Default Gateway", "A workstation reaches same-subnet printers but no remote resources.", ["Check IP configuration.", "Compare gateway to the subnet router.", "Correct the gateway manually or in DHCP.", "Renew and test off-subnet access."], "Configure the correct default gateway.", "beginner"],
    ["CIDR Planning", "A small office needs a subnet for about 50 hosts without wasting a /24.", ["Estimate host count.", "Select a prefix with enough usable addresses.", "Document network, gateway, and DHCP range.", "Test client leases."], "Use an appropriately sized subnet such as /26 for up to 62 usable IPv4 hosts.", "exam-level"],
    ["NAT Misconfiguration", "Internal clients have private IPs but cannot browse the internet after an edge router change.", ["Verify clients use private addresses.", "Check default route to the edge.", "Review NAT rule on the router.", "Test outbound traffic after applying NAT."], "Restore NAT on the edge router.", "intermediate"],
    ["PAT Exhaustion Symptom", "Many clients share one public IP, but only some new sessions fail during peak usage.", ["Check NAT/PAT translations.", "Review session table limits.", "Clear stale translations if appropriate.", "Increase capacity or adjust timeout settings."], "Resolve PAT translation exhaustion or timeout issues.", "exam-level"],
    ["Duplicate IP Address", "A workstation intermittently loses connectivity and Windows reports an IP conflict.", ["Disconnect or identify the conflicting device.", "Check DHCP scope exclusions.", "Remove incorrect static assignment.", "Renew the affected clients."], "Eliminate the duplicate address and reserve or exclude static IPs properly.", "intermediate"],
    ["IPv6 Loopback Test", "A technician wants to verify the local IPv6 stack without sending traffic to the LAN.", ["Use the IPv6 loopback address.", "Ping ::1.", "If it fails, check local TCP/IP stack.", "Continue with NIC and network tests only after local stack passes."], "Use ::1 to test the local IPv6 stack.", "beginner"],
    ["Private vs Public Addressing", "A home router WAN interface receives 192.168.1.20 from the ISP device and port forwarding fails.", ["Identify 192.168.1.20 as private.", "Check for double NAT.", "Place ISP device in bridge mode or adjust forwarding on both devices.", "Retest inbound access if required."], "Resolve double NAT or request a public WAN address if inbound access is needed.", "exam-level"],
    ["DHCP Scope Exhausted", "New devices fail to obtain addresses, but existing clients remain online.", ["Check DHCP scope utilization.", "Shorten lease duration if appropriate.", "Expand the scope or add a subnet.", "Renew a new client lease."], "Free or expand DHCP scope capacity.", "intermediate"],
    ["Incorrect Static DNS", "Only one manually configured workstation cannot access internal sites by name.", ["Compare DNS settings to a DHCP client.", "Replace the wrong static DNS server.", "Flush DNS cache.", "Retest internal and external names."], "Correct the static DNS configuration.", "beginner"],
    ["Network vs Host Address", "A technician tries to assign 192.168.5.0/24 to a printer and it will not accept the address.", ["Identify the network address.", "Choose a usable host address.", "Reserve the address in DHCP if needed.", "Print a network configuration page."], "Use a valid host address, not the network address.", "intermediate"],
    ["Wrong VLAN IP Range", "A PC moved to a new VLAN keeps an old static address and loses access to local resources.", ["Identify the VLAN subnet.", "Update IP address, mask, gateway, and DNS.", "Prefer DHCP where possible.", "Retest local and routed access."], "Configure an address valid for the new VLAN.", "intermediate"],
    ["IPv4 to IPv6 Confusion", "A user sees an IPv6 address and assumes IPv4 DHCP failed.", ["Check both IPv4 and IPv6 configuration.", "Verify whether IPv4 has a valid lease.", "Test name resolution and gateway reachability.", "Educate that IPv6 may coexist with IPv4."], "Confirm dual-stack settings before declaring DHCP failure.", "beginner"],
  ],
  cabling: [
    ["Cable Selection Problem", "A data center needs a short copper uplink capable of very high throughput between adjacent racks.", ["Confirm speed and distance.", "Compare cable categories.", "Select Cat8 for short 25/40 Gbps copper use.", "Certify the link after installation."], "Use Cat8 for short high-speed data center copper runs.", "exam-level"],
    ["Gigabit Desktop Run", "A 70-meter office run needs reliable 1 Gbps Ethernet at reasonable cost.", ["Measure the run length.", "Confirm it is under 100 meters.", "Select Cat5e or better.", "Test the cable after termination."], "Use Cat5e or better for 1 Gbps up to 100 meters.", "beginner"],
    ["10 Gbps to Work Area", "A workstation area requires 10 Gbps over a full 100-meter copper run.", ["Validate the distance.", "Select Cat6a.", "Use proper termination practices.", "Certify the cable for 10 Gbps."], "Use Cat6a for 10 Gbps to 100 meters.", "intermediate"],
    ["Long Building Link", "Two buildings need a high-bandwidth link beyond copper distance limits.", ["Measure distance and pathway.", "Choose fiber instead of copper.", "Use single mode for long distance.", "Test light levels and link status."], "Use single mode fiber for long-distance links.", "intermediate"],
    ["Fiber Patch Mismatch", "A new switch transceiver has small duplex fiber ports, but the available patch cable has square SC ends.", ["Identify the transceiver connector.", "Select the correct LC patch cable.", "Verify fiber type matches.", "Check link lights."], "Use the correct LC fiber connector for the transceiver.", "beginner"],
    ["Coax Broadband Issue", "A cable modem has a damaged threaded connector on the incoming line.", ["Identify the media as coax.", "Replace or reterminate the F connector.", "Check modem signal lock.", "Retest internet access."], "Repair the coax F connector.", "beginner"],
    ["Crosstalk on Copper", "A cable test reports excessive crosstalk on a new high-speed copper run.", ["Inspect untwist length at terminations.", "Check cable category.", "Re-terminate to standard.", "Certify again."], "Correct termination and use the proper cable category.", "intermediate"],
    ["Wrong Fiber Type", "A long fiber link using multimode optics fails across a campus distance.", ["Check distance and optical type.", "Compare single mode and multimode limits.", "Install matching single mode optics and cable.", "Verify receive levels."], "Use single mode fiber and matching optics for the long run.", "exam-level"],
    ["Damaged RJ45 Clip", "A workstation link drops when the patch cable is touched.", ["Inspect the RJ45 connector.", "Replace the patch cable.", "Confirm switch port stability.", "Retest while moving the cable gently."], "Replace the damaged RJ45 patch cable.", "beginner"],
    ["Old ST Fiber Panel", "A legacy fiber panel uses round twist-lock connectors.", ["Identify the connector as ST.", "Use an ST-compatible patch cable or adapter.", "Verify fiber polarity.", "Check link status."], "Use the proper ST fiber connector or adapter.", "intermediate"],
  ],
  wireless: [
    ["Wireless Interference", "Users near a break room report drops whenever the microwave runs.", ["Identify the affected band.", "Move clients to 5 GHz or 6 GHz when supported.", "Adjust AP placement and channels.", "Retest during interference."], "Reduce 2.4 GHz interference by using cleaner bands and better channel planning.", "intermediate"],
    ["Secure Wi-Fi Deployment", "A small business replaces an old WPA2-PSK network and wants stronger password protection.", ["Confirm client compatibility.", "Enable WPA3-Personal where supported.", "Use a strong passphrase.", "Provide a transition SSID only if required."], "Deploy WPA3 when supported, with WPA2 transition only for legacy clients.", "intermediate"],
    ["Legacy Client Slowness", "A very old 802.11b device causes poor performance on a 2.4 GHz WLAN.", ["Identify the legacy standard.", "Separate or retire the 802.11b client.", "Use modern standards for production devices.", "Retest throughput."], "Remove or isolate 802.11b clients.", "exam-level"],
    ["5 GHz Range Complaint", "A user says 5 GHz Wi-Fi is faster near the AP but drops sooner than 2.4 GHz.", ["Explain range and frequency tradeoffs.", "Check signal levels.", "Add AP coverage if needed.", "Use band steering carefully."], "Improve coverage while recognizing 5 GHz has shorter range than 2.4 GHz.", "beginner"],
    ["Wi-Fi 6 Upgrade", "A crowded office has many clients and needs better efficiency.", ["Check client support.", "Deploy 802.11ax APs.", "Plan channels and power.", "Validate performance in dense areas."], "Use 802.11ax to improve efficiency in dense wireless environments.", "intermediate"],
    ["6 GHz Compatibility", "A new 6 GHz SSID is invisible to several laptops.", ["Confirm Wi-Fi 6E client support.", "Update drivers if supported.", "Use 5 GHz for older clients.", "Document compatibility limits."], "Use 6 GHz only with compatible clients and APs.", "beginner"],
    ["Wrong Security Mode", "Some older devices fail after WPA3-only mode is enabled.", ["Identify client security support.", "Use a transition mode if policy allows.", "Upgrade or replace unsupported clients.", "Retest authentication."], "Match WPA mode to security requirements and client capability.", "intermediate"],
    ["Channel Congestion", "An apartment office has many neighboring 2.4 GHz networks.", ["Survey channels.", "Use non-overlapping 2.4 GHz channels.", "Prefer 5 GHz or 6 GHz when possible.", "Retest latency and throughput."], "Move clients to less congested bands and plan channels.", "exam-level"],
    ["802.11ac Expectation", "A user expects Wi-Fi 5 performance on 2.4 GHz only.", ["Identify 802.11ac as a 5 GHz standard.", "Connect to a 5 GHz SSID.", "Check client and AP capability.", "Retest speed near the AP."], "Use 5 GHz for 802.11ac clients.", "beginner"],
    ["Roaming Drop", "Warehouse scanners drop when moving between APs.", ["Check AP overlap.", "Adjust power levels.", "Verify security settings match across APs.", "Test roaming path."], "Tune AP coverage and consistent SSID/security settings.", "exam-level"],
  ],
  tools: [
    ["Slow Network Path", "A user reports a slow cloud app and the technician must find where delay begins.", ["Ping the destination.", "Run tracert to view hops.", "Use pathping for loss over time.", "Escalate with hop and loss details."], "Use tracert and pathping to identify latency or packet loss along the route.", "intermediate"],
    ["Check Local IP Settings", "A Windows laptop cannot connect after moving networks.", ["Run ipconfig /all.", "Check IP, mask, gateway, and DNS.", "Renew DHCP if needed.", "Retest connectivity."], "Use ipconfig to inspect and renew Windows TCP/IP settings.", "beginner"],
    ["DNS Record Test", "A technician needs to verify whether a hostname resolves to the expected address.", ["Run nslookup or dig.", "Query the configured DNS server.", "Compare the returned record.", "Flush cache or correct DNS as needed."], "Use nslookup or dig to test DNS resolution.", "beginner"],
    ["Port Listening Check", "A service should be accepting client connections on a server.", ["Run netstat.", "Find the listening port.", "Match the process ID when needed.", "Check firewall rules if not listening."], "Use netstat to confirm listening ports and active connections.", "intermediate"],
    ["ARP Cache Issue", "A PC reaches the wrong device after an IP address was reassigned.", ["View the ARP cache.", "Clear the stale entry if needed.", "Ping the correct host.", "Verify the MAC address updates."], "Use arp to inspect or clear stale IP-to-MAC mappings.", "intermediate"],
    ["Packet Capture DNS", "DNS queries leave a Linux workstation but no replies return.", ["Use tcpdump with a DNS filter.", "Capture traffic to the resolver.", "Check for outbound queries and inbound replies.", "Use results to isolate firewall or resolver issues."], "Use tcpdump to capture and filter DNS packets.", "exam-level"],
    ["Unix Interface Check", "A legacy Linux system needs its interface address verified.", ["Run ifconfig.", "Check interface address and status.", "Compare to expected network settings.", "Update configuration if incorrect."], "Use ifconfig on legacy Unix-like systems to view interface settings.", "beginner"],
    ["Basic Reachability", "A technician wants the quickest test that an IP host responds.", ["Use ping.", "Test the gateway first.", "Test an external IP.", "Remember firewalls may block ICMP."], "Use ping for a basic ICMP reachability test.", "beginner"],
    ["Route Stops at ISP", "Only external destinations fail and route tracing stops after the provider edge.", ["Run tracert.", "Record the last responding hop.", "Compare with another connection.", "Escalate to ISP with evidence."], "Use tracert output to support ISP escalation.", "intermediate"],
    ["Combined Loss Analysis", "Intermittent loss appears after several hops and a single ping test is inconclusive.", ["Run pathping.", "Wait for statistics to complete.", "Identify hop with sustained loss.", "Correlate with user symptoms."], "Use pathping for route and packet loss statistics.", "exam-level"],
  ],
};

const makeScenarios = (sectionKey) => {
  const section = SECTION_CONFIG[sectionKey];
  return scenarioLibrary[sectionKey].slice(0, section.scenarios).map(([title, problem, expectedSteps, correctResolution, difficulty]) => ({
    title,
    problem,
    expectedSteps,
    correctResolution,
    difficulty,
    category: section.category,
    domain: "CompTIA A+ 220-1101 Domain 2",
  }));
};

export const NETWORKING_FLASHCARDS = [
  ...makeFlashcards("ports"),
  ...makeFlashcards("devices"),
  ...makeFlashcards("ip"),
  ...makeFlashcards("cabling"),
  ...makeFlashcards("wireless"),
  ...makeFlashcards("tools"),
];

export const NETWORKING_QUIZZES = [
  ...makeQuizzes("ports"),
  ...makeQuizzes("devices"),
  ...makeQuizzes("ip"),
  ...makeQuizzes("cabling"),
  ...makeQuizzes("wireless"),
  ...makeQuizzes("tools"),
];

export const NETWORKING_SCENARIOS = [
  ...makeScenarios("ports"),
  ...makeScenarios("devices"),
  ...makeScenarios("ip"),
  ...makeScenarios("cabling"),
  ...makeScenarios("wireless"),
  ...makeScenarios("tools"),
];

const validateNetworkingModule = () => {
  const flashcardFrontsSeen = new Set(NETWORKING_FLASHCARDS.map((card) => card.front));
  const scenarioTitlesSeen = new Set(NETWORKING_SCENARIOS.map((scenario) => scenario.title));
  const difficultyCounts = NETWORKING_QUIZZES.reduce((counts, quiz) => {
    counts[quiz.difficulty] = (counts[quiz.difficulty] || 0) + 1;
    return counts;
  }, {});

  const expected = {
    flashcards: 475,
    quizzes: 700,
    scenarios: 65,
    beginner: 280,
    intermediate: 280,
    "exam-level": 140,
  };

  if (
    NETWORKING_FLASHCARDS.length !== expected.flashcards ||
    NETWORKING_QUIZZES.length !== expected.quizzes ||
    NETWORKING_SCENARIOS.length !== expected.scenarios ||
    flashcardFrontsSeen.size !== NETWORKING_FLASHCARDS.length ||
    scenarioTitlesSeen.size !== NETWORKING_SCENARIOS.length ||
    difficultyCounts.beginner !== expected.beginner ||
    difficultyCounts.intermediate !== expected.intermediate ||
    difficultyCounts["exam-level"] !== expected["exam-level"]
  ) {
    throw new Error("Networking module content validation failed.");
  }
};

validateNetworkingModule();

export const NETWORKING_MODULE = {
  id: "comptia-a-plus-220-1101-domain-2-networking",
  exam: "CompTIA A+ Core 1 220-1101",
  domain: "Domain 2: Networking",
  estimatedStudyHours: "20-30",
  sections: Object.values(SECTION_CONFIG).map(({ label, category, flashcards, quizzes, scenarios }) => ({
    label,
    category,
    flashcards,
    quizzes,
    scenarios,
  })),
  flashcards: NETWORKING_FLASHCARDS,
  quizzes: NETWORKING_QUIZZES,
  scenarios: NETWORKING_SCENARIOS,
};
