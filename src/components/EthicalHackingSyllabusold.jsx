import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ======= ETHICAL HACKING SYLLABUS TREE ======= */
const HACKING_TREE = {
  "Module 1 - Foundations": {
    "1. Introduction to Ethical Hacking": [
      { title: "What is Ethical Hacking and Why It Matters", done: false, completedOn: "", deadline: "" },
      { title: "Types of Hackers: White Hat, Black Hat, Grey Hat", done: false, completedOn: "", deadline: "" },
      { title: "Legal and Ethical Considerations in Pentesting", done: false, completedOn: "", deadline: "" },
      { title: "Career Paths and Certifications (CEH, OSCP, etc.)", done: false, completedOn: "", deadline: "" },
      { title: "Setting Up Your Hacking Lab Environment", done: false, completedOn: "", deadline: "" },
    ],
    "2. Networking Fundamentals": [
      { title: "OSI Model and TCP/IP Stack Deep Dive", done: false, completedOn: "", deadline: "" },
      { title: "IP Addressing, Subnetting, and CIDR Notation", done: false, completedOn: "", deadline: "" },
      { title: "Common Network Protocols (HTTP, FTP, SSH, DNS, SMTP)", done: false, completedOn: "", deadline: "" },
      { title: "Network Devices: Routers, Switches, Firewalls", done: false, completedOn: "", deadline: "" },
      { title: "Understanding Ports and Services", done: false, completedOn: "", deadline: "" },
    ],
    "3. Linux for Hackers": [
      { title: "Linux File System Structure and Navigation", done: false, completedOn: "", deadline: "" },
      { title: "Essential Linux Commands (ls, cd, grep, find, etc.)", done: false, completedOn: "", deadline: "" },
      { title: "File Permissions and User Management", done: false, completedOn: "", deadline: "" },
      { title: "Package Management (apt, yum, pacman)", done: false, completedOn: "", deadline: "" },
      { title: "Bash Scripting for Automation", done: false, completedOn: "", deadline: "" },
      { title: "Setting Up Kali Linux and Essential Tools", done: false, completedOn: "", deadline: "" },
    ],
  },
  "Module 2 - Reconnaissance": {
    "1. Information Gathering Techniques": [
      { title: "Passive vs Active Reconnaissance", done: false, completedOn: "", deadline: "" },
      { title: "OSINT Framework and Methodology", done: false, completedOn: "", deadline: "" },
      { title: "Google Dorking Advanced Techniques", done: false, completedOn: "", deadline: "" },
      { title: "Social Engineering Fundamentals", done: false, completedOn: "", deadline: "" },
      { title: "Harvesting Email Addresses and Metadata", done: false, completedOn: "", deadline: "" },
    ],
    "2. Footprinting and Scanning": [
      { title: "DNS Enumeration with nslookup, dig, and dnsenum", done: false, completedOn: "", deadline: "" },
      { title: "WHOIS Lookups and Domain Research", done: false, completedOn: "", deadline: "" },
      { title: "Subdomain Discovery with Sublist3r and Amass", done: false, completedOn: "", deadline: "" },
      { title: "Network Scanning with Nmap (TCP/SYN/UDP scans)", done: false, completedOn: "", deadline: "" },
      { title: "Service Version Detection and OS Fingerprinting", done: false, completedOn: "", deadline: "" },
    ],
  },
  "Module 3 - Vulnerability Assessment": {
    "1. Vulnerability Scanning": [
      { title: "Using Nessus for Vulnerability Assessment", done: false, completedOn: "", deadline: "" },
      { title: "OpenVAS Setup and Configuration", done: false, completedOn: "", deadline: "" },
      { title: "Understanding CVE Database and Exploit-DB", done: false, completedOn: "", deadline: "" },
      { title: "CVSS Scoring and Risk Prioritization", done: false, completedOn: "", deadline: "" },
    ],
    "2. Service Enumeration": [
      { title: "SMB/NetBIOS Enumeration with enum4linux", done: false, completedOn: "", deadline: "" },
      { title: "SNMP Enumeration and Community Strings", done: false, completedOn: "", deadline: "" },
      { title: "LDAP Enumeration and Active Directory Basics", done: false, completedOn: "", deadline: "" },
      { title: "FTP, SSH, and Telnet Service Exploitation", done: false, completedOn: "", deadline: "" },
    ],
  },
  "Module 4 - Web Application Hacking": {
    "1. Web Application Architecture": [
      { title: "Understanding Client-Server Model", done: false, completedOn: "", deadline: "" },
      { title: "HTTP Methods, Headers, and Status Codes", done: false, completedOn: "", deadline: "" },
      { title: "Cookies, Sessions, and Authentication Mechanisms", done: false, completedOn: "", deadline: "" },
      { title: "Same-Origin Policy and CORS", done: false, completedOn: "", deadline: "" },
    ],
    "2. OWASP Top 10 Vulnerabilities": [
      { title: "SQL Injection: Detection and Exploitation", done: false, completedOn: "", deadline: "" },
      { title: "Cross-Site Scripting (XSS): Reflected, Stored, DOM", done: false, completedOn: "", deadline: "" },
      { title: "Cross-Site Request Forgery (CSRF)", done: false, completedOn: "", deadline: "" },
      { title: "Broken Authentication and Session Management", done: false, completedOn: "", deadline: "" },
      { title: "Sensitive Data Exposure", done: false, completedOn: "", deadline: "" },
      { title: "XML External Entities (XXE)", done: false, completedOn: "", deadline: "" },
      { title: "Broken Access Control", done: false, completedOn: "", deadline: "" },
      { title: "Security Misconfiguration", done: false, completedOn: "", deadline: "" },
      { title: "Using Components with Known Vulnerabilities", done: false, completedOn: "", deadline: "" },
      { title: "Insufficient Logging and Monitoring", done: false, completedOn: "", deadline: "" },
    ],
    "3. Web Testing Tools": [
      { title: "Burp Suite: Proxy, Repeater, Intruder", done: false, completedOn: "", deadline: "" },
      { title: "OWASP ZAP for Automated Scanning", done: false, completedOn: "", deadline: "" },
      { title: "SQLMap for SQL Injection Automation", done: false, completedOn: "", deadline: "" },
      { title: "Nikto Web Server Scanner", done: false, completedOn: "", deadline: "" },
      { title: "Manual Testing with cURL and Postman", done: false, completedOn: "", deadline: "" },
    ],
  },
  "Module 5 - System Hacking": {
    "1. Password Attacks": [
      { title: "Understanding Password Hash Types (MD5, SHA, NTLM)", done: false, completedOn: "", deadline: "" },
      { title: "Dictionary Attacks with Wordlists", done: false, completedOn: "", deadline: "" },
      { title: "Brute Force Attacks: Techniques and Tools", done: false, completedOn: "", deadline: "" },
      { title: "Rainbow Tables and Hash Cracking", done: false, completedOn: "", deadline: "" },
      { title: "John the Ripper and Hashcat Mastery", done: false, completedOn: "", deadline: "" },
      { title: "Password Spraying in Active Directory", done: false, completedOn: "", deadline: "" },
    ],
    "2. Exploitation Techniques": [
      { title: "Metasploit Framework: Basics to Advanced", done: false, completedOn: "", deadline: "" },
      { title: "Exploit Development Fundamentals", done: false, completedOn: "", deadline: "" },
      { title: "Buffer Overflow Attacks (Stack and Heap)", done: false, completedOn: "", deadline: "" },
      { title: "Privilege Escalation: Windows and Linux", done: false, completedOn: "", deadline: "" },
      { title: "Exploiting Misconfigurations and Weak Permissions", done: false, completedOn: "", deadline: "" },
    ],
    "3. Post-Exploitation": [
      { title: "Maintaining Persistent Access (Backdoors)", done: false, completedOn: "", deadline: "" },
      { title: "Covering Tracks and Log Manipulation", done: false, completedOn: "", deadline: "" },
      { title: "Data Exfiltration Techniques", done: false, completedOn: "", deadline: "" },
      { title: "Pivoting and Lateral Movement", done: false, completedOn: "", deadline: "" },
      { title: "Credential Dumping (Mimikatz, etc.)", done: false, completedOn: "", deadline: "" },
    ],
  },
  "Module 6 - Wireless Hacking": {
    "1. Wireless Standards and Security": [
      { title: "Wi-Fi Protocols (WEP, WPA, WPA2, WPA3)", done: false, completedOn: "", deadline: "" },
      { title: "Bluetooth Security and Attacks", done: false, completedOn: "", deadline: "" },
      { title: "RFID and NFC Security", done: false, completedOn: "", deadline: "" },
    ],
    "2. Wireless Network Attacks": [
      { title: "Packet Sniffing with Wireshark", done: false, completedOn: "", deadline: "" },
      { title: "Evil Twin and Rogue Access Point Attacks", done: false, completedOn: "", deadline: "" },
      { title: "WPA/WPA2 Cracking with Aircrack-ng Suite", done: false, completedOn: "", deadline: "" },
      { title: "Deauthentication and Disassociation Attacks", done: false, completedOn: "", deadline: "" },
      { title: "WPS PIN Cracking with Reaver", done: false, completedOn: "", deadline: "" },
    ],
  },
  "Module 7 - Malware Analysis": {
    "1. Malware Types and Behavior": [
      { title: "Viruses, Worms, and Trojans", done: false, completedOn: "", deadline: "" },
      { title: "Ransomware and Cryptojacking", done: false, completedOn: "", deadline: "" },
      { title: "Rootkits and Bootkits", done: false, completedOn: "", deadline: "" },
      { title: "Spyware, Adware, and PUPs", done: false, completedOn: "", deadline: "" },
    ],
    "2. Reverse Engineering": [
      { title: "Static Analysis with IDA Pro and Ghidra", done: false, completedOn: "", deadline: "" },
      { title: "Dynamic Analysis with Debuggers (x64dbg, OllyDbg)", done: false, completedOn: "", deadline: "" },
      { title: "Assembly Language Basics (x86/x64)", done: false, completedOn: "", deadline: "" },
      { title: "Malware Behavior Analysis in Sandbox", done: false, completedOn: "", deadline: "" },
      { title: "Identifying Indicators of Compromise (IOCs)", done: false, completedOn: "", deadline: "" },
    ],
  },
  "Module 8 - Advanced Topics": {
    "1. Cryptography": [
      { title: "Symmetric vs Asymmetric Encryption", done: false, completedOn: "", deadline: "" },
      { title: "Hashing Algorithms (MD5, SHA, bcrypt, Argon2)", done: false, completedOn: "", deadline: "" },
      { title: "Public Key Infrastructure (PKI)", done: false, completedOn: "", deadline: "" },
      { title: "SSL/TLS Handshake and Certificate Analysis", done: false, completedOn: "", deadline: "" },
      { title: "Cryptographic Attacks (Birthday, Rainbow Tables)", done: false, completedOn: "", deadline: "" },
    ],
    "2. Cloud Security": [
      { title: "Cloud Service Models (IaaS, PaaS, SaaS)", done: false, completedOn: "", deadline: "" },
      { title: "AWS Security Best Practices and IAM", done: false, completedOn: "", deadline: "" },
      { title: "Azure Security Center and Policies", done: false, completedOn: "", deadline: "" },
      { title: "Container Security (Docker, Kubernetes)", done: false, completedOn: "", deadline: "" },
      { title: "Cloud Penetration Testing Methodology", done: false, completedOn: "", deadline: "" },
    ],
    "3. Mobile Security": [
      { title: "Android Security Architecture", done: false, completedOn: "", deadline: "" },
      { title: "iOS Security Model and Jailbreaking", done: false, completedOn: "", deadline: "" },
      { title: "Mobile App Penetration Testing", done: false, completedOn: "", deadline: "" },
      { title: "Analyzing APKs with jadx and apktool", done: false, completedOn: "", deadline: "" },
    ],
  },
};

/* ======================= UTILITY FUNCTIONS ======================= */
const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const pathKey = (p) => p.join("__");

/* ======================= MAIN COMPONENT ======================= */
export default function EthicalHackingSyllabus({ dashboardState, updateDashboard }) {
  const [query, setQuery] = useState("");
  const [openModules, setOpenModules] = useState({});
  const [openSections, setOpenSections] = useState({});
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(null);
  const [studyTime, setStudyTime] = useState(120);
  const [suggestions, setSuggestions] = useState([]);
  const [showFilter, setShowFilter] = useState("all"); // all, pending, completed

  // Extract hacking-specific state
  const tree = dashboardState?.ethical_hacking_syllabus || HACKING_TREE;
  const streak = dashboardState?.ethical_hacking_streak || [];
  const lastStudied = dashboardState?.ethical_hacking_lastStudied || "";

  const daySet = useMemo(() => new Set(streak), [streak]);

  // Calculate grand statistics
  const grand = useMemo(() => {
    let total = 0, done = 0, totalTime = 0;
    const traverse = (node) => {
      if (Array.isArray(node)) {
        node.forEach(it => {
          total++;
          if (it.done) done++;
          totalTime += 2.5; // Assume 2.5h per topic
        });
      } else if (typeof node === "object") {
        Object.values(node).forEach(traverse);
      }
    };
    traverse(tree);
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0, totalTime };
  }, [tree]);

  // Calculate module statistics
  const moduleStats = useMemo(() => {
    const stats = {};
    Object.entries(tree).forEach(([moduleKey, sections]) => {
      let total = 0, done = 0, totalTime = 0;
      Object.values(sections).forEach(items => {
        items.forEach(it => {
          total++;
          if (it.done) done++;
          totalTime += 2.5;
        });
      });
      stats[moduleKey] = { 
        total, 
        done, 
        pct: total ? Math.round((done / total) * 100) : 0,
        totalTime 
      };
    });
    return stats;
  }, [tree]);

  // Get closest deadline topics (WORKING LOGIC)
  const deadlineTopics = useMemo(() => {
    const topics = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    Object.entries(tree).forEach(([moduleKey, sections]) => {
      Object.entries(sections).forEach(([secKey, items]) => {
        items.forEach((item, idx) => {
          if (item.deadline && !item.done) {
            const deadlineDate = new Date(item.deadline);
            deadlineDate.setHours(0, 0, 0, 0);
            const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

            topics.push({
              title: item.title,
              deadline: item.deadline,
              path: [moduleKey, secKey],
              idx,
              daysLeft,
              module: moduleKey,
              section: secKey
            });
          }
        });
      });
    });

    return topics.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 6);
  }, [tree]);

  // Generate AI suggestions (WORKING LOGIC)
  const generateSuggestions = useCallback(() => {
    const allTopics = [];
    const topicsPerHour = 60 / 2.5; // ~24 topics per hour (2.5min each)
    const maxTopics = Math.floor((studyTime / 60) * topicsPerHour);

    // Collect all incomplete topics
    Object.entries(tree).forEach(([moduleKey, sections]) => {
      Object.entries(sections).forEach(([secKey, items]) => {
        items.forEach((item, idx) => {
          if (!item.done) {
            // Priority scoring
            let priority = 0;

            // Has deadline = +100 priority
            if (item.deadline) {
              const deadlineDate = new Date(item.deadline);
              const today = new Date();
              const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

              if (daysLeft < 0) priority += 200; // Overdue
              else if (daysLeft === 0) priority += 150; // Due today
              else if (daysLeft <= 3) priority += 100; // Due soon
              else priority += 50;
            }

            // Early modules = higher priority
            const moduleNum = parseInt(moduleKey.match(/\d+/)?.[0] || "0");
            priority += (10 - moduleNum) * 5;

            allTopics.push({
              title: item.title,
              module: moduleKey,
              section: secKey,
              path: [moduleKey, secKey],
              idx,
              priority,
              deadline: item.deadline || null,
              estimatedTime: 2.5
            });
          }
        });
      });
    });

    // Sort by priority (highest first)
    allTopics.sort((a, b) => b.priority - a.priority);

    // Take top N topics that fit in study time
    const selected = allTopics.slice(0, maxTopics);
    setSuggestions(selected);
  }, [tree, studyTime]);

  // Jump to topic from Daily Planner or Suggestions (WORKING LOGIC)
  const jumpToTopic = useCallback((topic) => {
    // Open the module
    setOpenModules(prev => ({ ...prev, [topic.module]: true }));

    // Open the section
    const sectionKey = pathKey(topic.path);
    setOpenSections(prev => ({ ...prev, [sectionKey]: true }));

    // Scroll to section after short delay
    setTimeout(() => {
      const element = document.getElementById(sectionKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, []);

  // Toggle functions
  const toggleModule = (moduleKey) => {
    setOpenModules(prev => ({ ...prev, [moduleKey]: !prev[moduleKey] }));
  };

  const toggleSection = (path) => {
    const key = pathKey(path);
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Mark task
  const markTask = (path, idx, val) => {
    const updatedTree = structuredClone(tree);
    const parentPath = path.slice(0, -1);
    const leafKey = path[path.length - 1];
    const parent = parentPath.reduce((acc, k) => acc?.[k], updatedTree);
    const item = parent?.[leafKey]?.[idx];
    if (!item) return;

    item.done = val;
    item.completedOn = val ? todayISO() : "";

    const updates = { ethical_hacking_syllabus: updatedTree };
    if (val) {
      updates.ethical_hacking_lastStudied = `${item.title} @ ${new Date().toLocaleString("en-IN")}`;
      updates.ethical_hacking_streak = Array.from(new Set([...daySet, todayISO()]));
    }
    updateDashboard(updates);
  };

  // Mark all in section
  const markAllSection = (path, val) => {
    const updatedTree = structuredClone(tree);
    const parentPath = path.slice(0, -1);
    const leafKey = path[path.length - 1];
    const parent = parentPath.reduce((acc, k) => acc?.[k], updatedTree);
    const items = parent?.[leafKey];
    if (!items) return;

    items.forEach(item => {
      item.done = val;
      item.completedOn = val ? todayISO() : "";
    });

    const updates = { ethical_hacking_syllabus: updatedTree };
    if (val) {
      updates.ethical_hacking_streak = Array.from(new Set([...daySet, todayISO()]));
    }
    updateDashboard(updates);
  };

  // Set deadline
  const setDeadline = (path, idx, date) => {
    const updatedTree = structuredClone(tree);
    const parentPath = path.slice(0, -1);
    const leafKey = path[path.length - 1];
    const parent = parentPath.reduce((acc, k) => acc?.[k], updatedTree);
    const item = parent?.[leafKey]?.[idx];
    if (!item) return;

    item.deadline = date ? date.toISOString().split('T')[0] : "";
    updateDashboard({ ethical_hacking_syllabus: updatedTree });
    setShowDeadlinePicker(null);
  };

  // Expand/Collapse All
  const expandAll = () => {
    const allOpen = {};
    Object.keys(tree).forEach(moduleKey => {
      allOpen[moduleKey] = true;
      Object.keys(tree[moduleKey]).forEach(secKey => {
        allOpen[pathKey([moduleKey, secKey])] = true;
      });
    });
    setOpenModules(allOpen);
    setOpenSections(allOpen);
  };

  const collapseAll = () => {
    setOpenModules({});
    setOpenSections({});
  };

  // Export progress
  const exportProgress = () => {
    const data = {
      tree,
      streak,
      lastStudied,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hacking-progress-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import progress
  const importProgress = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        updateDashboard({
          ethical_hacking_syllabus: data.tree,
          ethical_hacking_streak: data.streak || [],
          ethical_hacking_lastStudied: data.lastStudied || "",
        });
        alert("✅ Progress imported successfully!");
      } catch (err) {
        alert("❌ Failed to import: Invalid file format");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 text-slate-100">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-red-950/60 via-orange-950/40 to-red-950/60 backdrop-blur-xl border-b border-red-800/30 sticky top-0 z-40 shadow-2xl">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🔐</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  Ethical Hacking Syllabus 2026
                </h1>
                <p className="text-sm text-slate-400">Structured roadmap with streaks, exports and safe reset.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <div>
                    <div className="text-xs text-emerald-300">Streak</div>
                    <div className="text-lg font-bold text-emerald-400">{streak.length}d</div>
                  </div>
                </div>
              </div>
              <button
                onClick={expandAll}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 border border-blue-400/50 transition"
              >
                Expand
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 hover:bg-slate-600 border border-slate-500/50 transition"
              >
                Collapse
              </button>
              <button
                onClick={() => {
                  if (!confirm("⚠️ Reset ALL progress? This cannot be undone!")) return;
                  updateDashboard({
                    ethical_hacking_syllabus: structuredClone(HACKING_TREE),
                    ethical_hacking_streak: [],
                    ethical_hacking_lastStudied: "",
                  });
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-500 border border-red-400/50 transition"
              >
                Reset
              </button>
              <button
                onClick={exportProgress}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 border border-slate-600 transition"
              >
                📤 Export
              </button>
              <label className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-500 border border-purple-400/50 transition cursor-pointer">
                📥 Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importProgress}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Last Studied */}
          {lastStudied && (
            <div className="mt-3 text-sm text-slate-400 flex items-center gap-2">
              <span className="text-blue-400">📘</span>
              <span>Last studied: <span className="text-slate-300">{lastStudied}</span></span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-slate-400 mb-1">
              <span>{grand.done}/{grand.total} topics</span>
              <span className="text-red-400 font-bold">{grand.pct}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-900/80 overflow-hidden border border-red-900/30">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${grand.pct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-[1800px] mx-auto px-6 mt-6">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">🔍</div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search syllabus topics..."
            className="w-full px-12 py-4 rounded-xl bg-slate-900/80 border border-red-800/30 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 text-slate-400 hover:text-slate-200 text-xl"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

          {/* LEFT SIDE - Syllabus Content */}
          <div className="space-y-4">
            {Object.entries(tree).map(([moduleKey, sections]) => {
              const stats = moduleStats[moduleKey];
              const isModuleOpen = openModules[moduleKey];

              return (
                <motion.div
                  key={moduleKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-red-950/30 border border-red-800/30 overflow-hidden shadow-xl"
                >
                  {/* Module Header */}
                  <div className="p-4 bg-gradient-to-r from-red-950/50 to-transparent border-b border-red-800/30">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleModule(moduleKey)}
                        className="flex items-center gap-3 flex-1"
                      >
                        <motion.div
                          animate={{ rotate: isModuleOpen ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-red-400 text-xl"
                        >
                          ▶
                        </motion.div>
                        <h2 className="text-xl font-bold text-slate-100">{moduleKey}</h2>
                      </button>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-400">
                          {stats.done}/{stats.total} • {stats.pct}% • ≈{stats.totalTime.toFixed(1)}h
                        </span>
                      </div>
                    </div>

                    {/* Module Progress Bar */}
                    <div className="mt-3 h-2 rounded-full bg-slate-900/80 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${stats.pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Sections */}
                  <AnimatePresence>
                    {isModuleOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-3">
                          {Object.entries(sections).map(([secKey, items]) => {
                            const path = [moduleKey, secKey];
                            const sectionKey = pathKey(path);
                            const isSectionOpen = openSections[sectionKey];
                            const secDone = items.filter(it => it.done).length;
                            const secTotal = items.length;
                            const secPct = secTotal ? Math.round((secDone / secTotal) * 100) : 0;
                            const secTime = (secTotal * 2.5).toFixed(1);

                            return (
                              <div
                                key={secKey}
                                id={sectionKey}
                                className="rounded-xl bg-slate-900/50 border border-slate-700/50 overflow-hidden"
                              >
                                {/* Section Header */}
                                <div className="p-3 flex items-center justify-between hover:bg-slate-800/50 transition">
                                  <button
                                    onClick={() => toggleSection(path)}
                                    className="flex items-center gap-2 flex-1"
                                  >
                                    <motion.span
                                      animate={{
                                        rotate: isSectionOpen ? 90 : 0,
                                      }}
                                      className="text-orange-400"
                                    >
                                      ▶
                                    </motion.span>
                                    <span className="font-medium text-slate-200">
                                      {secKey}
                                    </span>
                                  </button>
                                  <div className="flex items-center gap-3 text-sm">
                                    <span className="text-slate-400">
                                      {secDone}/{secTotal} • {secPct}% • ≈
                                      {secTime}h
                                    </span>
                                    <button
                                      onClick={() =>
                                        markAllSection(
                                          path,
                                          secDone !== secTotal
                                        )
                                      }
                                      className="px-2 py-1 rounded text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition"
                                    >
                                      {secDone === secTotal
                                        ? "Undo all"
                                        : "Mark all"}
                                    </button>
                                  </div>
                                </div>

                                {/* Topics */}
                                <AnimatePresence>
                                  {isSectionOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                      }}
                                      className="overflow-hidden"
                                    >
                                      <div className="p-4 space-y-3 bg-gradient-to-b from-slate-800/20 to-transparent">
                                        {items.map((item, idx) => (
                                          <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={`relative group rounded-xl border transition-all duration-300 ${
                                              item.done
                                                ? "bg-slate-800/20 border-slate-700/30 hover:border-slate-600/50"
                                                : "bg-slate-800/40 border-slate-700/50 hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/10"
                                            }`}
                                          >
                                            {/* Progress indicator line */}
                                            {item.done && (
                                              <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-400 rounded-t-xl"
                                              />
                                            )}

                                            {/* MAIN CLICKABLE AREA - everything except action buttons */}
                                            <div
                                              onClick={() =>
                                                markTask(path, idx, !item.done)
                                              }
                                              className="flex items-start gap-4 p-4 cursor-pointer"
                                            >
                                              {/* Custom Animated Checkbox */}
                                              <div className="relative flex items-center justify-center mt-0.5">
                                                <div
                                                  className={`relative flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-300 ${
                                                    item.done
                                                      ? "bg-gradient-to-br from-emerald-500 to-green-500 border-emerald-400 shadow-md shadow-emerald-500/30"
                                                      : "bg-slate-900/50 border-slate-600 group-hover:border-red-400 group-hover:shadow-md group-hover:shadow-red-500/20"
                                                  }`}
                                                >
                                                  {item.done && (
                                                    <motion.svg
                                                      initial={{
                                                        scale: 0,
                                                        rotate: -180,
                                                      }}
                                                      animate={{
                                                        scale: 1,
                                                        rotate: 0,
                                                      }}
                                                      transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                        damping: 20,
                                                      }}
                                                      className="w-3.5 h-3.5 text-white"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke="currentColor"
                                                      strokeWidth="3"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                      />
                                                    </motion.svg>
                                                  )}
                                                </div>
                                              </div>

                                              {/* Content - Now clickable */}
                                              <div className="flex-1 min-w-0">
                                                <div className="relative">
                                                  <span
                                                    className={`block text-sm font-medium transition-all duration-300 ${
                                                      item.done
                                                        ? "text-slate-500"
                                                        : "text-slate-200 group-hover:text-white"
                                                    }`}
                                                  >
                                                    {item.title}
                                                  </span>

                                                  {/* Animated strikethrough */}
                                                  {item.done && (
                                                    <motion.div
                                                      initial={{ scaleX: 0 }}
                                                      animate={{ scaleX: 1 }}
                                                      transition={{
                                                        duration: 0.4,
                                                        ease: "easeOut",
                                                      }}
                                                      className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-500 origin-left"
                                                    />
                                                  )}
                                                </div>

                                                {/* Completion badge */}
                                                {item.completedOn && (
                                                  <motion.div
                                                    initial={{
                                                      opacity: 0,
                                                      y: -10,
                                                    }}
                                                    animate={{
                                                      opacity: 1,
                                                      y: 0,
                                                    }}
                                                    className="flex items-center gap-2 mt-2 text-xs"
                                                  >
                                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                      <svg
                                                        className="w-3 h-3"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                      >
                                                        <path
                                                          fillRule="evenodd"
                                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                          clipRule="evenodd"
                                                        />
                                                      </svg>
                                                      {item.completedOn}
                                                    </span>
                                                  </motion.div>
                                                )}
                                              </div>

                                              {/* Deadline badge - also clickable to toggle */}
                                              {item.deadline && (
                                                <motion.span
                                                  initial={{
                                                    scale: 0.8,
                                                    opacity: 0,
                                                  }}
                                                  animate={{
                                                    scale: 1,
                                                    opacity: 1,
                                                  }}
                                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-br from-blue-950/80 to-blue-900/50 text-blue-300 border border-blue-700/40 text-xs font-medium shadow-sm"
                                                >
                                                  <svg
                                                    className="w-3.5 h-3.5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth="2"
                                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                  </svg>
                                                  {item.deadline}
                                                </motion.span>
                                              )}
                                            </div>

                                            {/* Actions - Separate from clickable area */}
                                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                              {/* Deadline action button */}
                                              <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                  e.stopPropagation(); // Prevent parent div click
                                                  setShowDeadlinePicker(
                                                    `${sectionKey}__${idx}`
                                                  );
                                                }}
                                                className={`p-2 rounded-lg transition-all duration-200 ${
                                                  item.deadline
                                                    ? "opacity-100 bg-slate-700/50 hover:bg-slate-600/70 text-blue-400"
                                                    : "opacity-0 group-hover:opacity-100 bg-slate-700/70 hover:bg-slate-600 text-slate-400 hover:text-blue-400"
                                                }`}
                                                title="Set deadline"
                                              >
                                                <svg
                                                  className="w-4 h-4"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                  />
                                                </svg>
                                              </motion.button>
                                            </div>

                                            {/* Deadline Picker Modal */}
                                            {showDeadlinePicker ===
                                              `${sectionKey}__${idx}` &&
                                              createPortal(
                                                <motion.div
                                                  initial={{ opacity: 0 }}
                                                  animate={{ opacity: 1 }}
                                                  exit={{ opacity: 0 }}
                                                  className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                                                  onClick={() =>
                                                    setShowDeadlinePicker(null)
                                                  }
                                                >
                                                  <motion.div
                                                    initial={{
                                                      scale: 0.9,
                                                      opacity: 0,
                                                      y: 20,
                                                    }}
                                                    animate={{
                                                      scale: 1,
                                                      opacity: 1,
                                                      y: 0,
                                                    }}
                                                    exit={{
                                                      scale: 0.9,
                                                      opacity: 0,
                                                      y: 20,
                                                    }}
                                                    transition={{
                                                      type: "spring",
                                                      damping: 25,
                                                      stiffness: 300,
                                                    }}
                                                    className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-red-800/30 shadow-2xl shadow-red-500/20"
                                                    onClick={(e) =>
                                                      e.stopPropagation()
                                                    }
                                                  >
                                                    <div className="mb-4">
                                                      <h3 className="text-lg font-semibold text-white mb-1">
                                                        Set Deadline
                                                      </h3>
                                                      <p className="text-sm text-slate-400">
                                                        {item.title}
                                                      </p>
                                                    </div>

                                                    <div className="rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/50">
                                                      <DatePicker
                                                        selected={
                                                          item.deadline
                                                            ? new Date(
                                                                item.deadline
                                                              )
                                                            : null
                                                        }
                                                        onChange={(date) =>
                                                          setDeadline(
                                                            path,
                                                            idx,
                                                            date
                                                          )
                                                        }
                                                        inline
                                                        minDate={new Date()}
                                                      />
                                                    </div>

                                                    <div className="flex gap-2 mt-4">
                                                      <button
                                                        onClick={() =>
                                                          setDeadline(
                                                            path,
                                                            idx,
                                                            null
                                                          )
                                                        }
                                                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 hover:text-red-300 text-sm font-medium transition-all duration-200"
                                                      >
                                                        Remove Deadline
                                                      </button>
                                                      <button
                                                        onClick={() =>
                                                          setShowDeadlinePicker(
                                                            null
                                                          )
                                                        }
                                                        className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition-all duration-200"
                                                      >
                                                        Close
                                                      </button>
                                                    </div>
                                                  </motion.div>
                                                </motion.div>,
                                                document.body
                                              )}
                                          </motion.div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT SIDE - Features */}
          <div className="space-y-4">
            {/* Daily Auto Planner - WORKING */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-purple-950/30 border border-purple-800/30 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-100">Daily Auto Planner</h3>
                    <p className="text-xs text-slate-400">Closest-deadline topics not yet done.</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <div className="text-xs text-purple-300">{deadlineTopics.length} Tasks</div>
                  <div className="text-sm font-bold text-purple-400">Sorted by deadline</div>
                </div>
              </div>

              <div className="space-y-2">
                {deadlineTopics.length > 0 ? (
                  deadlineTopics.map((topic, idx) => (
                    <div
                      key={idx}
                      onClick={() => jumpToTopic(topic)}
                      className="p-3 rounded-lg bg-slate-900/70 border border-slate-700/50 hover:border-purple-500/50 transition cursor-pointer"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">📘</span>
                        <div className="flex-1">
                          <div className="text-sm text-slate-300">{topic.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded bg-blue-950/50 text-blue-400 border border-blue-800/30">
                              📅 {topic.deadline}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              topic.daysLeft < 0 ? "bg-red-950/50 text-red-400 border border-red-800/30" :
                              topic.daysLeft === 0 ? "bg-orange-950/50 text-orange-400 border border-orange-800/30" :
                              "bg-emerald-950/50 text-emerald-400 border border-emerald-800/30"
                            }`}>
                              {topic.daysLeft < 0 ? `${Math.abs(topic.daysLeft)}d overdue` :
                               topic.daysLeft === 0 ? "Due today" :
                               `${topic.daysLeft}d left`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <div className="text-4xl mb-2">📭</div>
                    <div className="text-sm">No deadlines set yet</div>
                    <div className="text-xs mt-1">Click 📅 button on topics to set deadlines</div>
                  </div>
                )}
              </div>
            </div>

            {/* Smart Suggest - WORKING */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-pink-950/30 border border-pink-800/30 p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-100">Smart Suggest</h3>
                    <p className="text-xs text-slate-400">AI-powered study planner</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-pink-500/20 text-xs text-pink-400 border border-pink-500/30">
                  AI Powered
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-slate-400">Available Study Time</div>
                <input
                  type="number"
                  value={studyTime}
                  onChange={(e) => setStudyTime(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  placeholder="120"
                  min="0"
                  max="1440"
                />
                <span className="text-xs text-slate-500">minutes (≈{Math.floor(studyTime/2.5)} topics @ 2.5min each)</span>

                <button 
                  onClick={generateSuggestions}
                  className="w-full mt-3 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 font-medium transition"
                >
                  Generate ✨
                </button>

                <div className="mt-4 max-h-[400px] overflow-y-auto space-y-2">
                  {suggestions.length > 0 ? (
                    suggestions.map((topic, idx) => (
                      <div
                        key={idx}
                        onClick={() => jumpToTopic(topic)}
                        className="p-3 rounded-lg bg-slate-900/70 border border-slate-700/50 hover:border-pink-500/50 transition cursor-pointer"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-bold text-pink-400">#{idx + 1}</span>
                          <div className="flex-1">
                            <div className="text-sm text-slate-300">{topic.title}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {topic.module} • ≈{topic.estimatedTime}min
                              {topic.deadline && (
                                <span className="ml-2 text-orange-400">📅 {topic.deadline}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <div className="text-4xl mb-2">📊</div>
                      <div className="text-sm">Click "Generate" to get suggestions</div>
                      <div className="text-xs mt-1">Based on deadlines and priority</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
