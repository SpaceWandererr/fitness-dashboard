import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

/* ======= ETHICAL HACKING SYLLABUS TREE ======= */
const HACKING_TREE = {
  "EP - 1 Foundation": {
    "1. Introduction to Ethical Hacking": [
      {
        title: "What is Ethical Hacking and Why it's Important",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title:
          "Difference between Ethical Hacking, Black Hat, White Hat, and Grey Hat",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Career Opportunities in Cybersecurity and Ethical Hacking",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Legal and Ethical Considerations in Hacking",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title:
          "Understanding Information Security CIA Triad (Confidentiality, Integrity, Availability)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Types of Cyber Attacks and Threat Landscape",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title:
          "Phases of Ethical Hacking (Reconnaissance, Scanning, Gaining Access, Maintaining Access, Covering Tracks)",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "2. Computer Networking Fundamentals": [
      {
        title: "Understanding OSI and TCP/IP Models",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "IP Addressing (IPv4, IPv6, Subnetting, CIDR)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title:
          "Network Protocols (HTTP, HTTPS, FTP, SSH, DNS, DHCP, SMTP, POP3)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Understanding Ports and Common Port Numbers",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Routers, Switches, Firewalls, and Network Devices",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Network Topologies and Architectures",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Understanding VPNs, Proxies, and Tor",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "3. Linux Operating System for Hackers": [
      {
        title: "Introduction to Linux and Why Hackers Use It",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Installing Kali Linux or Parrot OS (Virtual Machine Setup)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Linux File System Structure and Navigation",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title:
          "Essential Linux Commands (ls, cd, pwd, cat, grep, find, chmod, chown)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "File Permissions and User Management",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Linux Package Management (apt, apt-get, dpkg)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Text Editors (nano, vim)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Bash Scripting Basics for Automation",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "4. Python Programming for Ethical Hackers": [
      {
        title: "Why Python for Cybersecurity",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Python Basics (Variables, Data Types, Operators)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Control Flow (if-else, loops, functions)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Working with Lists, Tuples, Dictionaries, and Sets",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "File Handling in Python",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Python Modules and Libraries (os, sys, socket, requests)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Building Simple Scripts (Port Scanner, Password Generator)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Exception Handling and Debugging",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
  },
  "EP - 2 Reconnaissance & Scanning": {
    "1. Footprinting and Reconnaissance": [
      {
        title: "Introduction to Information Gathering",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Passive Reconnaissance vs Active Reconnaissance",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "OSINT (Open Source Intelligence) Techniques",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Google Dorking and Advanced Search Operators",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "WHOIS Lookup and DNS Enumeration",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Using Tools - theHarvester, Maltego, Shodan, Recon-ng",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Social Media Intelligence Gathering",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Website Footprinting and Metadata Extraction",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "2. Scanning Networks": [
      {
        title: "Network Scanning Techniques and Methodologies",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Port Scanning (TCP Connect, SYN, UDP, FIN, Xmas)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Mastering Nmap - Port Scanning and Service Detection",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "OS Fingerprinting and Banner Grabbing",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Network Discovery and Host Detection",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Vulnerability Scanning with Nessus and OpenVAS",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Firewall and IDS Evasion Techniques",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "3. Enumeration": [
      {
        title: "What is Enumeration and Its Importance",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "NetBIOS Enumeration",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "SNMP Enumeration",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "LDAP and Active Directory Enumeration",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "SMB and RPC Enumeration",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "DNS Zone Transfer and Enumeration",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Using Enum4linux, SMBMap, and RPCClient",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "4. Vulnerability Analysis": [
      {
        title: "Understanding Vulnerabilities and CVEs",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "CVSS Scoring System",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Common Vulnerability Databases (NVD, Exploit-DB)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Automated Vulnerability Scanning",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Manual Vulnerability Assessment",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Analyzing Scan Results and Prioritizing Risks",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
  },
  "EP - 3 Exploitation & Post-Exploitation": {
    "1. System Hacking": [
      {
        title:
          "Password Cracking Techniques (Dictionary, Brute Force, Rainbow Tables)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Using John the Ripper and Hashcat",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Privilege Escalation (Vertical and Horizontal)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Exploiting Misconfigurations",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Windows Exploitation Techniques",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Linux Exploitation Techniques",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Clearing Logs and Covering Tracks",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "2. Malware and Trojans": [
      {
        title:
          "Understanding Malware Types (Virus, Worm, Trojan, Ransomware, Spyware)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "How Malware Works and Infection Vectors",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Creating Payloads with Metasploit (msfvenom)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Backdoors and Remote Access Trojans (RATs)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Malware Analysis Basics (Static and Dynamic)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Anti-Virus Evasion Techniques",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "3. Metasploit Framework": [
      {
        title: "Introduction to Metasploit Framework",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title:
          "Metasploit Architecture (Exploits, Payloads, Auxiliaries, Encoders)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Using msfconsole and Basic Commands",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Searching and Selecting Exploits",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Payload Generation and Delivery",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Post-Exploitation with Meterpreter",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Privilege Escalation and Persistence",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Pivoting and Lateral Movement",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "4. Social Engineering": [
      {
        title: "Understanding Social Engineering Attacks",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Phishing, Spear Phishing, and Whaling",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Pretexting, Baiting, and Tailgating",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Creating Fake Login Pages",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Using Social Engineering Toolkit (SET)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Human Psychology in Security",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "5. Sniffing and Man-in-the-Middle Attacks": [
      {
        title: "Understanding Network Sniffing",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Packet Analysis with Wireshark",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "ARP Spoofing and ARP Poisoning",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Man-in-the-Middle (MITM) Attacks",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "DNS Spoofing and Cache Poisoning",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Using Ettercap and Bettercap",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "SSL Stripping Attacks",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
  },
  "EP - 4 Web & Application Hacking": {
    "1. Web Application Security Fundamentals": [
      {
        title: "How Web Applications Work (Client-Server Architecture)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Understanding HTTP/HTTPS Protocols",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Cookies, Sessions, and Authentication Mechanisms",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "OWASP Top 10 Vulnerabilities",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Web Application Security Testing Methodology",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "2. SQL Injection": [
      {
        title: "Understanding SQL and Database Basics",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Types of SQL Injection (In-band, Blind, Out-of-band)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Detecting SQL Injection Vulnerabilities",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Manual SQL Injection Exploitation",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Using SQLMap for Automated Exploitation",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "SQL Injection Prevention and Mitigation",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "3. Cross-Site Scripting (XSS)": [
      {
        title: "Understanding XSS Vulnerabilities",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Types of XSS (Reflected, Stored, DOM-based)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Identifying XSS Vulnerabilities",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Crafting XSS Payloads",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Cookie Stealing and Session Hijacking via XSS",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "XSS Prevention Techniques",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "4. Other Web Vulnerabilities": [
      {
        title: "Cross-Site Request Forgery (CSRF)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Insecure Direct Object References (IDOR)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Local File Inclusion (LFI) and Remote File Inclusion (RFI)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Command Injection and OS Command Execution",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "XML External Entity (XXE) Attacks",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Server-Side Request Forgery (SSRF)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Broken Authentication and Session Management",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "5. Web Application Testing Tools": [
      {
        title:
          "Burp Suite - Complete Guide (Proxy, Repeater, Intruder, Scanner)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "OWASP ZAP (Zed Attack Proxy)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Nikto Web Server Scanner",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "DirBuster and Gobuster for Directory Enumeration",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Browser Developer Tools for Security Testing",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "6. API Security Testing": [
      {
        title: "Understanding REST APIs and GraphQL",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "API Authentication Mechanisms (JWT, OAuth, API Keys)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Common API Vulnerabilities",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Testing APIs with Postman and Burp Suite",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "API Fuzzing and Rate Limiting Bypass",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
  },
  "EP - 5 Advanced Top. & Specializations": {
    "1. Wireless Network Hacking": [
      {
        title: "Understanding Wireless Network Security (WEP, WPA, WPA2, WPA3)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Wireless Reconnaissance and Network Discovery",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Cracking WEP and WPA/WPA2 Passwords",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Evil Twin and Rogue Access Point Attacks",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Using Aircrack-ng Suite",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Wireless Packet Sniffing and Analysis",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Bluetooth Hacking Basics",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "2. Mobile Application Security": [
      {
        title: "Introduction to Mobile Security (Android and iOS)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Android Security Architecture",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Setting Up Android Testing Environment (ADB, Emulators)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Reverse Engineering Android APKs",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Common Mobile Vulnerabilities (OWASP Mobile Top 10)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Mobile Application Penetration Testing",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Using MobSF and Drozer",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "3. Cloud Security": [
      {
        title: "Introduction to Cloud Computing Security",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "AWS, Azure, and GCP Security Basics",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Cloud Security Misconfigurations",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "S3 Bucket Enumeration and Exploitation",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "IAM (Identity and Access Management) Vulnerabilities",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Container Security (Docker, Kubernetes)",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "4. IoT Security": [
      {
        title: "Introduction to IoT and Security Challenges",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "IoT Device Architecture and Communication Protocols",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Common IoT Vulnerabilities",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Firmware Analysis and Reverse Engineering",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "IoT Penetration Testing Methodology",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "5. Cryptography for Ethical Hackers": [
      {
        title: "Introduction to Cryptography",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Symmetric vs Asymmetric Encryption",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Understanding Hash Functions (MD5, SHA, bcrypt)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Public Key Infrastructure (PKI) and Digital Certificates",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "SSL/TLS and HTTPS Security",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Cryptographic Attacks (Rainbow Tables, Birthday Attack)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Implementing Encryption in Python",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "6. Security Evasion Techniques": [
      {
        title: "Evading IDS/IPS Systems",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Bypassing Firewalls and Network Filters",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Understanding Honeypots and How to Detect Them",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Anti-Forensics Techniques",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Obfuscation and Packing",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
  },
  "EP - 6 Professional Skills & Career": {
    "1. Penetration Testing Methodology": [
      {
        title: "Understanding Penetration Testing Lifecycle",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Types of Penetration Testing (Black Box, White Box, Grey Box)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Rules of Engagement and Scoping",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Writing Professional Penetration Testing Reports",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Risk Assessment and CVSS Scoring",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Remediation Recommendations",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "2. Bug Bounty Hunting": [
      {
        title: "Introduction to Bug Bounty Programs",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Popular Bug Bounty Platforms (HackerOne, Bugcrowd, Synack)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Reconnaissance for Bug Bounties",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Finding and Exploiting Vulnerabilities",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Writing Effective Bug Reports",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Building Your Bug Bounty Reputation",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "3. Capture The Flag (CTF) Challenges": [
      {
        title: "What are CTF Competitions",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Types of CTF Challenges (Jeopardy, Attack-Defense)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Practicing on TryHackMe, HackTheBox, PentesterLab",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title:
          "Common CTF Categories (Web, Binary, Crypto, Forensics, Reversing)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Building CTF Problem-Solving Skills",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "4. Certifications and Career Path": [
      {
        title: "CompTIA Security+ Certification",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Certified Ethical Hacker (CEH) Certification",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Offensive Security Certified Professional (OSCP)",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "CISSP - Certified Information Systems Security Professional",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "eJPT and eCPPT Certifications",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Career Paths in Cybersecurity",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Building Your Cybersecurity Portfolio",
        done: false,
        completedOn: "",
        deadline: "",
      },
    ],
    "5. Continuous Learning and Community": [
      {
        title: "Staying Updated with Latest Vulnerabilities and Exploits",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Following Security Blogs and Researchers",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Joining Cybersecurity Communities and Forums",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Contributing to Open Source Security Projects",
        done: false,
        completedOn: "",
        deadline: "",
      },
      {
        title: "Attending Security Conferences (DEF CON, Black Hat)",
        done: false,
        completedOn: "",
        deadline: "",
      },
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
export default function EthicalHackingSyllabus({
  dashboardState,
  updateDashboard,
}) {
  const [query, setQuery] = useState("");
  const [openModules, setOpenModules] = useState({});
  const [openSections, setOpenSections] = useState({});
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(null);
  const [showSectionDeadlinePicker, setShowSectionDeadlinePicker] =
    useState(null); // NEW: Section deadline
  const [studyTime, setStudyTime] = useState(120);
  const [suggestions, setSuggestions] = useState([]);

  // Extract hacking-specific state
  const tree = dashboardState?.ethical_hacking_syllabus || HACKING_TREE;
  const streak = dashboardState?.ethical_hacking_streak || [];
  const lastStudied = dashboardState?.ethical_hacking_lastStudied || "";

  const daySet = useMemo(() => new Set(streak), [streak]);
  const [showResetModal, setShowResetModal] = useState(false);

  // Calculate grand statistics
  const grand = useMemo(() => {
    let total = 0,
      done = 0,
      totalTime = 0;

    // Directly iterate through the structure
    Object.values(tree).forEach((module) => {
      if (module && typeof module === "object") {
        Object.values(module).forEach((section) => {
          if (Array.isArray(section)) {
            section.forEach((topic) => {
              total++;
              if (topic.done) {
                done++;
                totalTime += 2.5;
              }
            });
          }
        });
      }
    });

    return {
      total,
      done,
      pct: total ? Math.round((done / total) * 100) : 0,
      totalTime,
    };
  }, [tree]);

  // Calculate module statistics
  const moduleStats = useMemo(() => {
    const stats = {};
    Object.entries(tree).forEach(([moduleKey, sections]) => {
      let total = 0,
        done = 0,
        totalTime = 0;
      Object.values(sections).forEach((items) => {
        items.forEach((it) => {
          total++;
          if (it.done) done++;
          totalTime += 2.5;
        });
      });
      stats[moduleKey] = {
        total,
        done,
        pct: total ? Math.round((done / total) * 100) : 0,
        totalTime,
      };
    });
    return stats;
  }, [tree]);

  // Get closest deadline topics
  const deadlineTopics = useMemo(() => {
    const topicsWithDeadline = [];
    const topicsWithoutDeadline = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    Object.entries(tree).forEach(([moduleKey, sections]) => {
      Object.entries(sections).forEach(([secKey, items]) => {
        items.forEach((item, idx) => {
          if (!item.done) {
            const topicData = {
              title: item.title,
              deadline: item.deadline || null,
              path: [moduleKey, secKey],
              idx,
              module: moduleKey,
              section: secKey,
            };

            if (item.deadline) {
              const deadlineDate = new Date(item.deadline);
              deadlineDate.setHours(0, 0, 0, 0);
              const daysLeft = Math.ceil(
                (deadlineDate - today) / (1000 * 60 * 60 * 24)
              );
              topicData.daysLeft = daysLeft;
              topicsWithDeadline.push(topicData); // ✅ Fixed: was wrong before
            } else {
              topicsWithoutDeadline.push(topicData); // ✅ Fixed: was wrong before
            }
          }
        });
      });
    });

    // Sort topics with deadlines by date
    topicsWithDeadline.sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline)
    );

    // Combine: deadline topics first, then topics without deadlines
    const allTopics = [...topicsWithDeadline, ...topicsWithoutDeadline];

    return allTopics.slice(0, 6);
  }, [tree]);

  // Generate AI suggestions
  const generateSuggestions = useCallback(() => {
    const allTopics = [];
    const topicsPerHour = 60 / 30;
    const maxTopics = Math.floor((studyTime / 60) * topicsPerHour);

    Object.entries(tree).forEach(([moduleKey, sections]) => {
      Object.entries(sections).forEach(([secKey, items]) => {
        items.forEach((item, idx) => {
          if (!item.done) {
            let priority = 0;

            if (item.deadline) {
              const deadlineDate = new Date(item.deadline);
              const today = new Date();
              const daysLeft = Math.ceil(
                (deadlineDate - today) / (1000 * 60 * 60 * 24)
              );

              if (daysLeft < 0) priority += 200;
              else if (daysLeft === 0) priority += 150;
              else if (daysLeft <= 3) priority += 100;
              else priority += 50;
            }

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
              estimatedTime: 30,
            });
          }
        });
      });
    });

    allTopics.sort((a, b) => b.priority - a.priority);
    const selected = allTopics.slice(0, maxTopics);
    setSuggestions(selected);
  }, [tree, studyTime]);

  // Jump to topic
  const jumpToTopic = useCallback((topic) => {
    setOpenModules((prev) => ({ ...prev, [topic.module]: true }));
    const sectionKey = pathKey(topic.path);
    setOpenSections((prev) => ({ ...prev, [sectionKey]: true }));

    setTimeout(() => {
      const element = document.getElementById(sectionKey);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  }, []);

  // Toggle functions
  const toggleModule = (moduleKey) => {
    setOpenModules((prev) => ({ ...prev, [moduleKey]: !prev[moduleKey] }));
  };

  const toggleSection = (path) => {
    const key = pathKey(path);
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
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
      updates.ethical_hacking_lastStudied = `${
        item.title
      } @ ${new Date().toLocaleString("en-IN")}`;
      updates.ethical_hacking_streak = Array.from(
        new Set([...daySet, todayISO()])
      );
    } else {
      // Unmarking - find the most recent completed topic
      let mostRecentTopic = null;
      let mostRecentDate = null;

      Object.entries(updatedTree).forEach(([moduleKey, sections]) => {
        if (sections && typeof sections === "object") {
          Object.entries(sections).forEach(([secKey, items]) => {
            if (Array.isArray(items)) {
              items.forEach((topic) => {
                if (topic.done && topic.completedOn) {
                  const topicDate = new Date(topic.completedOn);
                  if (!mostRecentDate || topicDate > mostRecentDate) {
                    mostRecentDate = topicDate;
                    mostRecentTopic = topic.title;
                  }
                }
              });
            }
          });
        }
      });

      if (mostRecentTopic) {
        updates.ethical_hacking_lastStudied = `${mostRecentTopic} @ ${mostRecentDate.toLocaleString(
          "en-IN"
        )}`;
      } else {
        updates.ethical_hacking_lastStudied = "";
      }
    }

    updateDashboard(updates);

    if (val) {
      toast.success(`✅ ${item.title}`);
    } else {
      toast(`Unmarked: ${item.title}`, {
        icon: "↩️",
        style: {
          background: "#1e293b",
          color: "#94a3b8",
        },
      });
    }
  };

  // Mark all in section
  const markAllSection = (path, val) => {
    const updatedTree = structuredClone(tree);
    const parentPath = path.slice(0, -1);
    const leafKey = path[path.length - 1];
    const parent = parentPath.reduce((acc, k) => acc?.[k], updatedTree);
    const items = parent?.[leafKey];
    if (!items) return;

    items.forEach((item) => {
      item.done = val;
      item.completedOn = val ? todayISO() : "";
    });

    const updates = { ethical_hacking_syllabus: updatedTree };
    if (val) {
      updates.ethical_hacking_streak = Array.from(
        new Set([...daySet, todayISO()])
      );
    }
    updateDashboard(updates);

    // Toast
    const sectionName = path[path.length - 1] || "section";
    if (val) {
      toast.success(`Marked all in ${sectionName}`);
    } else {
      toast(`Unmarked all in ${sectionName}`, {
        icon: "↩️",
        style: {
          background: "#020617",
          color: "#e5e7eb",
        },
      });
    }
  };

  // Set deadline for individual topic
  const setDeadline = (path, idx, date) => {
    const updatedTree = structuredClone(tree);
    const parentPath = path.slice(0, -1);
    const leafKey = path[path.length - 1];
    const parent = parentPath.reduce((acc, k) => acc?.[k], updatedTree);
    const item = parent?.[leafKey]?.[idx];
    if (!item) return;

    item.deadline = date ? date.toISOString().split("T")[0] : "";
    updateDashboard({ ethical_hacking_syllabus: updatedTree });
    setShowDeadlinePicker(null);
  };

  // NEW: Set deadline for ALL topics in a section
  const setSectionDeadline = (path, date) => {
    const updatedTree = structuredClone(tree);
    const parentPath = path.slice(0, -1);
    const leafKey = path[path.length - 1];
    const parent = parentPath.reduce((acc, k) => acc?.[k], updatedTree);
    const items = parent?.[leafKey];
    if (!items) return;

    const dateString = date ? date.toISOString().split("T")[0] : "";
    items.forEach((item) => {
      item.deadline = dateString;
    });

    updateDashboard({ ethical_hacking_syllabus: updatedTree });
    setShowSectionDeadlinePicker(null);
    if (date) {
      toast.success(`📅 Deadline set for ${items.length} topics!`);
    } else {
        toast(`🗑️ Deadlines removed`, {
          icon: "↩️",
          style: {
            background: "#1e293b",
            color: "#94a3b8",
          },
        });
    }
  };

  // Expand/Collapse All
  const expandAll = () => {
    const allOpen = {};
    Object.keys(tree).forEach((moduleKey) => {
      allOpen[moduleKey] = true;
      Object.keys(tree[moduleKey]).forEach((secKey) => {
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

  // Export/Import
  const exportProgress = () => {
    const data = {
      tree,
      streak,
      lastStudied,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hacking-progress-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  // Reset Confirmation Modal
  const ResetModal = () => {
    if (!showResetModal) return null;

    return createPortal(
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => setShowResetModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-red-700/40 shadow-2xl shadow-red-500/20 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Warning Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-center bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Reset ALL Progress?
          </h3>
          <p className="text-sm text-slate-400 text-center mb-6">
            This will permanently delete all your progress, deadlines, and
            completion dates. This action{" "}
            <span className="text-red-400 font-semibold">
              cannot be undone!
            </span>
          </p>

          {/* Stats to be lost */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="text-xs text-red-300 mb-2">You will lose:</div>
            <div className="space-y-1 text-sm text-slate-300">
              <div>• {grand.done} completed topics</div>
              <div>• {streak.length} day streak</div>
              <div>• All deadlines and dates</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                updateDashboard({
                  ethical_hacking_syllabus: structuredClone(HACKING_TREE),
                  ethical_hacking_streak: [],
                  ethical_hacking_lastStudied: "",
                });
                setShowResetModal(false);
                toast.success("Progress reset successfully");
              }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
            >
              Yes, Reset Everything
            </button>
            <button
              onClick={() => setShowResetModal(false)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>,
      document.body
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 text-slate-100
      md:mt-10 lg:mt-0 rounded-xl"
    >
      {/* Header */}
      <header className="rounded-xl w-full bg-gradient-to-r from-red-950/60 via-orange-950/40 to-red-950/60 backdrop-blur-xl border-b border-red-800/30 sticky top-0 z-40 shadow-2xl">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          {/* Top Row: Title + Main Actions */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Left: Icon + Title */}
            <div className="flex items-start sm:items-center gap-3 whitespace-nowrap">
              <div className="text-3xl sm:text-4xl shrink-0">🔐</div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent leading-tight">
                  Ethical Hacking Syllabus 2026
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Structured roadmap with streaks, exports and safe reset.
                </p>
              </div>
            </div>

            {/* Right: Streak + Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {/* Streak Card */}
              <div className="px-3 py-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl">🔥</span>

                  <div className="text-[10px] sm:text-xs text-emerald-300 font-medium">
                    Streak
                  </div>
                  <div className="text-base sm:text-lg font-bold text-emerald-400">
                    {streak.length}d
                  </div>
                </div>
              </div>

              {/* Action Buttons - Wrap on mobile */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={expandAll}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-blue-600 hover:bg-blue-500 border border-blue-400/50 transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
                >
                  Expand
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-700 hover:bg-slate-600 border border-slate-500/50 transition-all hover:shadow-lg active:scale-95"
                >
                  Collapse
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-red-600 hover:bg-red-500 border border-red-400/50 transition-all hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
                >
                  🔄 Reset
                </button>
                <button
                  onClick={exportProgress}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all hover:shadow-lg active:scale-95"
                >
                  📤 Export
                </button>
                <label className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium bg-purple-600 hover:bg-purple-500 border border-purple-400/50 transition-all hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 cursor-pointer">
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
          </div>

          {/* Middle Row: Last Studied (only when exists) */}
          {lastStudied && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-blue-950/30 border border-blue-800/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-blue-400 text-base sm:text-lg shrink-0">
                  📘
                </span>
                <span className="text-slate-400">
                  Last studied:{" "}
                  <span className="text-slate-200 font-medium">
                    {lastStudied}
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Bottom Row: Progress Bar */}
          <div className="mt-3 sm:mt-4">
            <div className="flex justify-between text-xs sm:text-sm text-slate-400 mb-1.5">
              <span className="font-medium">
                {grand.done}/{grand.total} topics
              </span>
              <span className="text-red-400 font-bold">{grand.pct}%</span>
            </div>
            <div className="h-2.5 sm:h-3 rounded-full bg-slate-900/80 overflow-hidden border border-red-900/30 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${grand.pct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-[1800px] mx-auto px-6 mt-6">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
            🔍
          </div>
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

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT SIDE - Syllabus Content */}
          <div className="space-y-4 w-full lg:w-[60%]">
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
                  <div className="p-3 sm:p-4 bg-gradient-to-r from-red-950/50 to-transparent border-b border-red-800/30">
                    {/* Row: icon + title + right meta (responsive) */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                      {/* Left: icon + title */}
                      <button
                        onClick={() => toggleModule(moduleKey)}
                        className="flex items-center gap-3 flex-shrink-0"
                      >
                        <motion.div
                          animate={{ rotate: isModuleOpen ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-red-400 text-xl shrink-0"
                        >
                          ▶
                        </motion.div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-100 text-left break-words">
                          {moduleKey}
                        </h2>
                      </button>

                      {/* Right: compact stats & meta pills */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-200">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md
                   bg-gradient-to-r from-emerald-500/15 to-emerald-500/5
                   border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]
                   whitespace-nowrap"
                        >
                          <span className="text-[10px]">📚</span>
                          <span className="font-semibold">
                            {stats.done}/{stats.total} topics
                          </span>
                        </span>

                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md
                   bg-gradient-to-r from-sky-500/15 to-sky-500/5
                   border border-sky-500/40 shadow-[0_0_10px_rgba(56,189,248,0.15)]
                   whitespace-nowrap"
                        >
                          <span className="text-[10px]">📈</span>
                          <span className="font-semibold">
                            {stats.pct}% complete
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
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
                            const secDone = items.filter(
                              (it) => it.done
                            ).length;
                            const secTotal = items.length;
                            const secPct = secTotal
                              ? Math.round((secDone / secTotal) * 100)
                              : 0;
                            const secTime = (secTotal * 2.5).toFixed(1);

                            return (
                              <div
                                key={secKey}
                                id={sectionKey}
                                className="rounded-xl bg-slate-900/50 border border-slate-700/50 overflow-hidden "
                              >
                                {/* Section Header */}
                                <div className="p-3 sm:p-4 hover:bg-slate-800/50 transition">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                                    {/* Left: icon + title */}
                                    <button
                                      onClick={() => toggleSection(path)}
                                      className="flex items-center gap-2 flex-shrink-0"
                                    >
                                      <motion.span
                                        animate={{
                                          rotate: isSectionOpen ? 90 : 0,
                                        }}
                                        className="text-orange-400 shrink-0"
                                      >
                                        ▶
                                      </motion.span>
                                      <span className="font-medium text-slate-200 text-sm sm:text-base text-left break-words">
                                        {secKey}
                                      </span>
                                    </button>

                                    {/* Right: stats + buttons (inline with title on desktop, below on mobile) */}
                                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                                      <span className="text-slate-400 whitespace-nowrap">
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
                                        className="px-2 py-1 rounded text-[11px] sm:text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition whitespace-nowrap"
                                      >
                                        {secDone === secTotal
                                          ? "Undo all"
                                          : "Mark all"}
                                      </button>

                                      {(() => {
                                        const sectionHasDeadline = items.some(
                                          (item) => item.deadline
                                        );
                                        const earliestDeadline =
                                          sectionHasDeadline
                                            ? items
                                                .filter((item) => item.deadline)
                                                .map(
                                                  (item) =>
                                                    new Date(item.deadline)
                                                )
                                                .sort((a, b) => a - b)[0]
                                            : null;

                                        return (
                                          <button
                                            onClick={() =>
                                              setShowSectionDeadlinePicker(
                                                sectionKey
                                              )
                                            }
                                            className={`px-2 py-1 rounded text-[11px] sm:text-xs border transition whitespace-nowrap flex items-center gap-1 ${
                                              sectionHasDeadline
                                                ? "bg-blue-950/50 text-blue-400 border-blue-800/30 hover:bg-blue-900/50"
                                                : "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300"
                                            }`}
                                          >
                                            <span className="text-sm">📅</span>
                                            <span className="hidden xs:inline">
                                              {sectionHasDeadline
                                                ? earliestDeadline.toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                      day: "2-digit",
                                                      month: "short",
                                                    }
                                                  )
                                                : "Set"}
                                            </span>
                                          </button>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>

                                {/* Section Deadline Picker Modal */}
                                {showSectionDeadlinePicker === sectionKey &&
                                  createPortal(
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                      onClick={() =>
                                        setShowSectionDeadlinePicker(null)
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
                                        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl border
                                        border-purple-700/40 shadow-2xl shadow-purple-500/20 w-fit flex flex-col
                                        items-center"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {/* Header */}
                                        <div className="mb-4">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xl">📅</span>
                                            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                              Set Section Deadline
                                            </h3>
                                          </div>
                                          <p className="text-xs text-slate-400">
                                            Apply the same deadline to all{" "}
                                            <span className="text-purple-400 font-semibold">
                                              {secTotal} topics
                                            </span>
                                          </p>
                                          <p className="text-xs text-slate-500 mt-0.5">
                                            Section:{" "}
                                            <span className="text-slate-300">
                                              {secKey}
                                            </span>
                                          </p>
                                        </div>

                                        {/* DatePicker Container */}
                                        <div
                                          className="rounded-xl overflow-hidden border border-slate-700/50 bg-slate-950/50 mb-4
                                          flex  w-fit "
                                        >
                                          <DatePicker
                                            selected={null}
                                            onChange={(date) =>
                                              setSectionDeadline(path, date)
                                            }
                                            inline
                                            minDate={new Date()}
                                            calendarClassName="dark"
                                          />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 justify-between w-full px-4">
                                          <button
                                            onClick={() =>
                                              setSectionDeadline(path, null)
                                            }
                                            className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500
                                            hover:to-red-600 text-white text-xs font-medium transition-all duration-200 shadow-lg shadow-red-500/20
                                            hover:shadow-red-500/40 flex items-center justify-center gap-1.5 whitespace-nowrap"
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
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                            Remove Deadline
                                          </button>
                                          <button
                                            onClick={() =>
                                              setShowSectionDeadlinePicker(null)
                                            }
                                            className="flex-1 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-all duration-200"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </motion.div>
                                    </motion.div>,
                                    document.body
                                  )}
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
                                                ? "bg-slate-800/20 border-emerald-700/30 hover:border-emerald-600/50 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                                                : "bg-slate-800/40 border-slate-700/50 hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/10"
                                            }`}
                                          >
                                            {/* MAIN CLICKABLE AREA */}
                                            <div
                                              onClick={() =>
                                                markTask(path, idx, !item.done)
                                              }
                                              className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 cursor-pointer"
                                            >
                                              {/* Custom Animated Checkbox */}
                                              <div className="relative flex items-center justify-center mt-0.5 flex-shrink-0">
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

                                              {/* Content */}
                                              <div className="flex-1 min-w-0 pr-10 sm:pr-12">
                                                <div className="relative">
                                                  <span
                                                    className={`block text-sm font-medium transition-all duration-300 break-words ${
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

                                                {/* Date badges container */}
                                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
                                                  {/* Completion badge */}
                                                  {item.completedOn && (
                                                    <motion.span
                                                      initial={{
                                                        opacity: 0,
                                                        y: -10,
                                                      }}
                                                      animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                      }}
                                                      className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium"
                                                    >
                                                      <svg
                                                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                      >
                                                        <path
                                                          fillRule="evenodd"
                                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                          clipRule="evenodd"
                                                        />
                                                      </svg>
                                                      <span className="text-[9px] sm:text-[10px] font-semibold opacity-70 hidden sm:inline">
                                                        COMPLETED:
                                                      </span>
                                                      <span className="text-[10px] sm:text-xs whitespace-nowrap">
                                                        {new Date(
                                                          item.completedOn
                                                        ).toLocaleDateString(
                                                          "en-GB",
                                                          {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                          }
                                                        )}
                                                      </span>
                                                    </motion.span>
                                                  )}

                                                  {/* Deadline badge */}
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
                                                      className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-gradient-to-br from-blue-950/80 to-blue-900/50 text-blue-300 border border-blue-700/40 text-xs font-medium shadow-sm"
                                                    >
                                                      <svg
                                                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                      >
                                                        <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                      </svg>
                                                      <span className="text-[9px] sm:text-[10px] font-semibold opacity-70 hidden sm:inline">
                                                        DEADLINE:
                                                      </span>
                                                      <span className="text-[10px] sm:text-xs whitespace-nowrap">
                                                        {new Date(
                                                          item.deadline
                                                        ).toLocaleDateString(
                                                          "en-GB",
                                                          {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                          }
                                                        )}
                                                      </span>
                                                    </motion.span>
                                                  )}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Deadline action button - positioned absolutely */}
                                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                                              <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setShowDeadlinePicker(
                                                    `${sectionKey}__${idx}`
                                                  );
                                                }}
                                                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                                                  item.deadline
                                                    ? "opacity-100 bg-slate-700/50 hover:bg-slate-600/70 text-blue-400"
                                                    : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 bg-slate-700/70 hover:bg-slate-600 text-slate-400 hover:text-blue-400"
                                                }`}
                                                title="Set deadline"
                                              >
                                                <svg
                                                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                                                  className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
                                                    className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl border border-purple-700/40 shadow-2xl shadow-purple-500/20 w-fit max-w-md flex flex-col items-center"
                                                    onClick={(e) =>
                                                      e.stopPropagation()
                                                    }
                                                  >
                                                    {/* Header */}
                                                    <div className="mb-4 w-fit">
                                                      <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xl">
                                                          📅
                                                        </span>
                                                        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                          Set Topic Deadline
                                                        </h3>
                                                      </div>
                                                      <p className="text-xs text-slate-400">
                                                        Apply a deadline to:
                                                      </p>
                                                      <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                                                        {item.title}
                                                      </p>
                                                    </div>

                                                    {/* DatePicker */}
                                                    <div className="rounded-xl overflow-hidden border border-slate-700/50 bg-slate-950/50 mb-4 w-fit flex justify-center">
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
                                                        dateFormat="dd-MMM-yyyy"
                                                        calendarClassName="dark"
                                                      />
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2 w-fit">
                                                      <button
                                                        onClick={() =>
                                                          setDeadline(
                                                            path,
                                                            idx,
                                                            null
                                                          )
                                                        }
                                                        className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-medium transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 flex items-center justify-center gap-1.5 whitespace-nowrap"
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
                                                            d="M6 18L18 6M6 6l12 12"
                                                          />
                                                        </svg>
                                                        Remove Deadline
                                                      </button>
                                                      <button
                                                        onClick={() =>
                                                          setShowDeadlinePicker(
                                                            null
                                                          )
                                                        }
                                                        className="flex-1 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-all duration-200"
                                                      >
                                                        Cancel
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
          <div className="space-y-4 w-full lg:w-[40%]">
            {/* Daily Auto Planner */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-purple-950/30 border border-purple-800/30 p-4 sm:p-5 shadow-xl">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs sm:text-sm text-slate-400 max-w-[60%]">
                  Closest-deadline hacking topics not yet done.
                </p>

                <div className="flex items-center gap-1.5">
                  <span className="text-lg">🎯</span>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-bold text-purple-300">
                      {deadlineTopics.length}{" "}
                      {deadlineTopics.length === 1 ? "Task" : "Tasks"}
                    </p>
                    <p className="text-[9px] text-slate-500">
                      Sorted by deadline
                    </p>
                  </div>
                </div>
              </div>

              {/* List */}
              <ul className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {deadlineTopics.length > 0 ? (
                  deadlineTopics.map((topic, idx) => {
                    const deadline = topic.deadline
                      ? new Date(topic.deadline)
                      : null;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    let urgencyIcon = "📅";
                    let urgencyBadge =
                      "bg-emerald-900/30 text-emerald-300 border-emerald-700/40";
                    let cardBg = "from-slate-900/70 to-slate-950/80";
                    let borderColor = "border-slate-700/60";
                    let glowColor = "shadow-purple-900/0";
                    let progressColor = "bg-emerald-500";
                    let daysLeft = null;
                    let daysLeftText = "";

                    if (deadline) {
                      const diff = deadline.getTime() - today.getTime();
                      const daysRemaining = Math.ceil(
                        diff / (24 * 60 * 60 * 1000)
                      );
                      daysLeft = daysRemaining;

                      if (diff < 0) {
                        urgencyIcon = "⏰";
                        urgencyBadge =
                          "bg-red-900/40 text-red-300 border-red-600/50";
                        cardBg = "from-red-950/25 to-slate-950/80";
                        borderColor = "border-red-700/50";
                        glowColor = "shadow-red-900/20";
                        progressColor = "bg-red-500";
                        daysLeftText = `${Math.abs(daysRemaining)}d late`;
                      } else if (daysRemaining === 0) {
                        urgencyIcon = "⚡";
                        urgencyBadge =
                          "bg-orange-900/40 text-orange-300 border-orange-600/50";
                        cardBg = "from-orange-950/25 to-slate-950/80";
                        borderColor = "border-orange-700/50";
                        glowColor = "shadow-orange-900/20";
                        progressColor = "bg-orange-500";
                        daysLeftText = "Today";
                      } else if (daysRemaining <= 3) {
                        urgencyIcon = "⏰";
                        urgencyBadge =
                          "bg-yellow-900/40 text-yellow-300 border-yellow-600/50";
                        cardBg = "from-yellow-950/25 to-slate-950/80";
                        borderColor = "border-yellow-700/50";
                        glowColor = "shadow-yellow-900/20";
                        progressColor = "bg-yellow-500";
                        daysLeftText = `${daysRemaining}d left`;
                      } else {
                        daysLeftText = `${daysRemaining}d left`;
                      }
                    }

                    return (
                      <li
                        key={idx}
                        onClick={() => jumpToTopic(topic)}
                        className={`
              group relative
              bg-gradient-to-br ${cardBg}
              rounded-lg
              border ${borderColor}
              overflow-hidden
              transition-all duration-200
              hover:brightness-110
              hover:shadow-md ${glowColor}
              cursor-pointer
            `}
                      >
                        {/* Left accent bar */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-0.5 ${progressColor} opacity-60 group-hover:opacity-100 transition-opacity`}
                        />

                        <div className="p-2 pl-2.5">
                          <div className="flex items-center justify-between gap-2">
                            {/* Icon + title */}
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <span className="text-sm shrink-0">
                                {urgencyIcon}
                              </span>
                              <span className="text-xs text-slate-200/80 font-medium truncate group-hover:text-white transition-colors">
                                {topic.title}
                              </span>
                            </div>

                            {/* Date + badge */}
                            {deadline && (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <div className="flex items-center gap-0.5 opacity-70">
                                  <span className="text-[9px]">📆</span>
                                  <span className="text-[9px] text-slate-300 font-medium hidden sm:inline">
                                    {deadline.toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>

                                {daysLeftText && (
                                  <span
                                    className={`
                          text-[9px] font-bold px-1.5 py-0.5 rounded
                          border ${urgencyBadge}
                          whitespace-nowrap
                          ${
                            urgencyBadge.includes("bg-red-")
                              ? "animate-pulse"
                              : ""
                          }
                        `}
                                  >
                                    {daysLeftText}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Small progress bar for near deadlines */}
                          {deadline &&
                            daysLeft !== null &&
                            daysLeft > 0 &&
                            daysLeft < 30 && (
                              <div className="mt-1.5 ml-6">
                                <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${progressColor} rounded-full transition-all duration-500`}
                                    style={{
                                      width: `${(() => {
                                        const maxDays = 30;
                                        return Math.min(
                                          95,
                                          Math.max(
                                            5,
                                            ((maxDays - daysLeft) / maxDays) *
                                              100
                                          )
                                        );
                                      })()}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </li>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    <div className="text-3xl mb-1">📭</div>
                    <div className="text-sm">No tasks pending</div>
                    <div className="text-xs mt-1 text-slate-600">
                      Click 📅 Deadline button to set deadlines
                    </div>
                  </div>
                )}
              </ul>
            </div>

            {/* Smart Suggest */}
            <div
              className="
    rounded-2xl border border-pink-800/40
    bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950
    p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)]
    transition-all duration-300
    hover:shadow-[0_0_30px_rgba(244,114,182,0.25)]
  "
            >
              {/* ===== Header ===== */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400/70 to-pink-500/90 flex items-center justify-center shadow-lg border border-pink-300/60">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-50">
                      Smart Suggest
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      AI-powered hacking study planner
                    </p>
                  </div>
                </div>

                <span
                  className="
        text-[10px] px-3 py-1.5 rounded-full
        bg-gradient-to-r from-pink-500 to-fuchsia-500
        text-black font-bold
        border border-pink-300/60
        whitespace-nowrap
      "
                >
                  ✨ AI Powered
                </span>
              </div>

              {/* ===== Input ===== */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  Available Study Time
                </label>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={studyTime}
                      onChange={(e) =>
                        setStudyTime(parseInt(e.target.value) || 0)
                      }
                      className="
            w-full px-4 py-2.5 text-sm rounded-xl border 
            bg-slate-900/80 border-slate-700
            text-slate-100 outline-none
            focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500/60
          "
                      placeholder="120"
                      min="0"
                      max="1440"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                      minutes
                    </span>
                  </div>

                  <button
                    onClick={generateSuggestions}
                    className="
          px-5 py-2.5 rounded-xl 
          bg-gradient-to-r from-pink-500 to-fuchsia-500
          hover:from-pink-400 hover:to-fuchsia-400
          text-black font-bold text-sm
          shadow-[0_0_12px_rgba(244,114,182,0.45)]
          transition-all duration-200
        "
                  >
                    Generate ✨
                  </button>
                </div>

                <p className="mt-1.5 text-[11px] text-slate-500">
                  ≈ {Math.floor(studyTime / 30)} topics @ 30 min each
                </p>
              </div>

              {/* ===== Suggestions ===== */}
              <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {suggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-1 block">📊</span>
                    <p className="text-sm text-slate-400">
                      Click{" "}
                      <span className="text-pink-400 font-medium">
                        Generate
                      </span>{" "}
                      to get suggestions
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Based on deadlines, priority and time left
                    </p>
                  </div>
                ) : (
                  suggestions.map((topic, idx) => {
                    const hasDeadline = !!topic.deadline;
                    const now = new Date();
                    const deadlineDate = hasDeadline
                      ? new Date(topic.deadline)
                      : null;

                    let urgency = {
                      badgeBg: "bg-emerald-500/15",
                      badgeText: "text-emerald-300",
                      badgeBorder: "border-emerald-500/40",
                    };

                    if (deadlineDate && deadlineDate < now) {
                      urgency = {
                        badgeBg: "bg-red-500/15",
                        badgeText: "text-red-300",
                        badgeBorder: "border-red-500/40",
                      };
                    }

                    return (
                      <div
                        key={`${topic.title}-${idx}`}
                        onClick={() => jumpToTopic(topic)}
                        className={`
              group relative rounded-xl border p-3 text-sm
              bg-slate-900/70 border-slate-700/60
              hover:border-pink-500/60 hover:bg-slate-900/90
              transition-all duration-250 overflow-hidden
              cursor-pointer
            `}
                      >
                        {/* Left accent bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-fuchsia-500 opacity-80" />

                        <div className="pl-3">
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-bold text-pink-400 mt-0.5">
                              #{idx + 1}
                            </span>

                            <div className="flex-1 min-w-0">
                              <div className="text-xs sm:text-sm text-slate-200 group-hover:text-white transition-colors">
                                {topic.title}
                              </div>

                              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                                <span className="whitespace-nowrap">
                                  {topic.module} • ≈{topic.estimatedTime}min
                                </span>

                                {hasDeadline && (
                                  <span
                                    className={`
                          inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                          ${urgency.badgeBg} ${urgency.badgeText} border ${urgency.badgeBorder}
                          text-[10px] whitespace-nowrap
                        `}
                                  >
                                    📅{" "}
                                    {deadlineDate.toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Shine overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    );
                  })
                )}
              </div>

              {/* ===== Footer ===== */}
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
                {suggestions.length > 0
                  ? "Tap a suggestion to jump directly to that topic in the syllabus."
                  : "Tell the AI how many minutes you have, then generate a focused plan."}
              </div>
            </div>
          </div>
          
        </div>
      </div>
      <ResetModal />
    </div>
  );
}
