// components/HairCare.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import {
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Droplet,
  Pill,
  TrendingDown,
  Camera,
  Check,
  AlertCircle,
  Target,
  Activity,
  Award,
  Flame,
  Clock,
  ImagePlus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Zap,
  Info,
  Download,
  FileText,
  Stethoscope,
  BarChart3,
  Bell,
  Share2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://fitness-backend-laoe.onrender.com/api/state";

// Product definitions
const PRODUCTS = {
  treatments: {
    minoxidil: {
      name: "Minoxidil 5%",
      icon: "💧",
      color: "blue",
      frequency: "daily-night",
      schedule: "Once daily (night)",
      conflict: ["minimalist"],
    },
    minimalist: {
      name: "Minimalist 18% Serum",
      icon: "✨",
      color: "purple",
      frequency: "2-3-weekly",
      schedule: "2-3 nights/week (NOT on minoxidil nights)",
      conflict: ["minoxidil"],
    },
  },
  supplements: {
    biotin: {
      name: "Man Matters Biotin Gummies",
      icon: "🍬",
      color: "pink",
      frequency: "daily",
      schedule: "1 gummy daily",
    },
    supradyn: {
      name: "SupraDyn",
      icon: "💊",
      color: "orange",
      frequency: "daily",
      schedule: "1 tablet daily",
    },
    seeds: {
      name: "Seed Mix (Chia/Sunflower/Flax/Pumpkin)",
      icon: "🌰",
      color: "amber",
      frequency: "daily",
      schedule: "Daily mixture",
    },
  },
  haircare: {
    shampoo: {
      name: "WishCare Multipeptide Shampoo",
      icon: "🧴",
      color: "green",
      frequency: "1-2-weekly",
      schedule: "1-2× per week",
    },
    conditioner: {
      name: "Conditioner (mid-lengths only)",
      icon: "💆",
      color: "emerald",
      frequency: "optional",
      schedule: "Optional, NOT on scalp",
    },
  },
  weekly: {
    oil: {
      name: "Soulflower Rosemary Lavender Oil",
      icon: "🌿",
      color: "teal",
      frequency: "1-weekly",
      schedule: "1× per week max, 2-3 drops diluted",
    },
    herbal: {
      name: "Herbal Powder (Amla/Reetha/Shikakai/Hibiscus/Bhringraj)",
      icon: "🍃",
      color: "lime",
      frequency: "1-weekly",
      schedule: "1× per week max, no vitamin E",
    },
  },
};

const COLOR_SCHEMES = {
  blue: {
    bg: "bg-blue-500/20",
    border: "border-blue-400/60",
    text: "text-blue-300",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    gradient: "from-blue-500/20 to-blue-700/20",
  },
  purple: {
    bg: "bg-purple-500/20",
    border: "border-purple-400/60",
    text: "text-purple-300",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    gradient: "from-purple-500/20 to-purple-700/20",
  },
  pink: {
    bg: "bg-pink-500/20",
    border: "border-pink-400/60",
    text: "text-pink-300",
    glow: "shadow-[0_0_20px_rgba(236,72,153,0.3)]",
    gradient: "from-pink-500/20 to-pink-700/20",
  },
  orange: {
    bg: "bg-orange-500/20",
    border: "border-orange-400/60",
    text: "text-orange-300",
    glow: "shadow-[0_0_20px_rgba(251,146,60,0.3)]",
    gradient: "from-orange-500/20 to-orange-700/20",
  },
  amber: {
    bg: "bg-amber-500/20",
    border: "border-amber-400/60",
    text: "text-amber-300",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]",
    gradient: "from-amber-500/20 to-amber-700/20",
  },
  green: {
    bg: "bg-green-500/20",
    border: "border-green-400/60",
    text: "text-green-300",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]",
    gradient: "from-green-500/20 to-green-700/20",
  },
  emerald: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-400/60",
    text: "text-emerald-300",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    gradient: "from-emerald-500/20 to-emerald-700/20",
  },
  teal: {
    bg: "bg-teal-500/20",
    border: "border-teal-400/60",
    text: "text-teal-300",
    glow: "shadow-[0_0_20px_rgba(20,184,166,0.3)]",
    gradient: "from-teal-500/20 to-teal-700/20",
  },
  lime: {
    bg: "bg-lime-500/20",
    border: "border-lime-400/60",
    text: "text-lime-300",
    glow: "shadow-[0_0_20px_rgba(132,204,22,0.3)]",
    gradient: "from-lime-500/20 to-lime-700/20",
  },
  red: {
    bg: "bg-red-500/20",
    border: "border-red-400/60",
    text: "text-red-300",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    gradient: "from-red-500/20 to-red-700/20",
  },
};

export default function HairCare({ dashboardState, updateDashboard }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [viewMode, setViewMode] = useState("today");
  const [doctorMode, setDoctorMode] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({
    treatments: true,
    supplements: true,
    haircare: true,
    weekly: true,
  });
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [photoNotes, setPhotoNotes] = useState("");
  const [showReminders, setShowReminders] = useState(false);
  const reportRef = useRef(null);

  const hairLogs = dashboardState?.hair_logs || {};
  const hairPhotos = dashboardState?.hair_photos || [];
  const todayLog = hairLogs[selectedDate] || {};

  const [todayData, setTodayData] = useState({
    minoxidil: todayLog.minoxidil || false,
    minimalist: todayLog.minimalist || false,
    biotin: todayLog.biotin || false,
    supradyn: todayLog.supradyn || false,
    seeds: todayLog.seeds || false,
    shampoo: todayLog.shampoo || false,
    conditioner: todayLog.conditioner || false,
    oil: todayLog.oil || false,
    herbal: todayLog.herbal || false,
    hairFallCount: todayLog.hairFallCount || "",
    notes: todayLog.notes || "",
    sideEffects: todayLog.sideEffects || "",
    scalpCondition: todayLog.scalpCondition || "normal",
  });

  useEffect(() => {
    const log = hairLogs[selectedDate] || {};
    setTodayData({
      minoxidil: log.minoxidil || false,
      minimalist: log.minimalist || false,
      biotin: log.biotin || false,
      supradyn: log.supradyn || false,
      seeds: log.seeds || false,
      shampoo: log.shampoo || false,
      conditioner: log.conditioner || false,
      oil: log.oil || false,
      herbal: log.herbal || false,
      hairFallCount: log.hairFallCount || "",
      notes: log.notes || "",
      sideEffects: log.sideEffects || "",
      scalpCondition: log.scalpCondition || "normal",
    });
  }, [selectedDate, hairLogs]);

  const saveLog = (updates = {}) => {
    const finalData = { ...todayData, ...updates };

    if (finalData.minoxidil && finalData.minimalist) {
      alert("⚠️ Don't use Minimalist serum on Minoxidil nights!");
      return;
    }

    updateDashboard({
      hair_logs: {
        ...hairLogs,
        [selectedDate]: {
          ...finalData,
          updatedAt: new Date().toISOString(),
        },
      },
    });
  };

  const toggleProduct = (productKey) => {
    const newValue = !todayData[productKey];
    const product = Object.values(PRODUCTS)
      .flatMap((cat) => Object.entries(cat))
      .find(([key]) => key === productKey)?.[1];

    if (newValue && product?.conflict) {
      const hasConflict = product.conflict.some((c) => todayData[c]);
      if (hasConflict) {
        const conflictNames = product.conflict
          .map(
            (c) =>
              Object.values(PRODUCTS)
                .flatMap((cat) => Object.entries(cat))
                .find(([key]) => key === c)?.[1]?.name
          )
          .filter(Boolean)
          .join(", ");
        alert(
          `⚠️ Conflict detected! Don't use ${product.name} with ${conflictNames} on the same night.`
        );
        return;
      }
    }

    const updated = { ...todayData, [productKey]: newValue };
    setTodayData(updated);
    saveLog(updated);
  };

  // Calculate analytics (30, 90, 180 days)
  const analytics = useMemo(() => {
    const getDaysArray = (days) =>
      Array.from({ length: days }, (_, i) =>
        dayjs().subtract(i, "day").format("YYYY-MM-DD")
      );

    const last30Days = getDaysArray(30);
    const last90Days = getDaysArray(90);
    const last180Days = getDaysArray(180);

    const calculateForPeriod = (days) => {
      const stats = {
        minoxidil: { count: 0, expected: days, target: 100 },
        minimalist: { count: 0, expected: Math.floor(days * 0.33), target: 33 },
        biotin: { count: 0, expected: days, target: 100 },
        supradyn: { count: 0, expected: days, target: 100 },
        seeds: { count: 0, expected: days, target: 100 },
        shampoo: { count: 0, expected: Math.floor(days / 7) * 2, target: 20 },
        oil: { count: 0, expected: Math.floor(days / 7), target: 13 },
        herbal: { count: 0, expected: Math.floor(days / 7), target: 13 },
        hairFall: { total: 0, days: 0, trend: [] },
        streak: 0,
        perfect: 0,
        sideEffects: [],
        notes: [],
      };

      getDaysArray(days).forEach((date) => {
        const log = hairLogs[date];
        if (log) {
          Object.keys(stats).forEach((key) => {
            if (key === "hairFall") {
              if (log.hairFallCount) {
                stats.hairFall.total += parseInt(log.hairFallCount) || 0;
                stats.hairFall.days++;
              }
            } else if (key === "sideEffects") {
              if (log.sideEffects) {
                stats.sideEffects.push({ date, text: log.sideEffects });
              }
            } else if (key === "notes") {
              if (log.notes) {
                stats.notes.push({ date, text: log.notes });
              }
            } else if (log[key]) {
              stats[key].count++;
            }
          });

          const isPerfect =
            (log.minoxidil || log.minimalist) &&
            log.biotin &&
            log.supradyn &&
            log.seeds;
          if (isPerfect) stats.perfect++;
        }
      });

      Object.keys(stats).forEach((key) => {
        if (stats[key].expected) {
          stats[key].compliance = Math.round(
            (stats[key].count / stats[key].expected) * 100
          );
        }
      });

      // Hair fall trend
      const buckets = [];
      for (let i = 0; i < days; i += 7) {
        const weekDays = getDaysArray(days).slice(i, i + 7);
        let total = 0;
        let count = 0;
        weekDays.forEach((d) => {
          const log = hairLogs[d];
          if (log?.hairFallCount) {
            total += parseInt(log.hairFallCount) || 0;
            count++;
          }
        });
        if (count > 0) {
          buckets.push({
            week: Math.floor(i / 7),
            avg: Math.round(total / count),
          });
        }
      }
      stats.hairFall.trend = buckets.reverse();

      stats.hairFall.avg = stats.hairFall.days
        ? Math.round(stats.hairFall.total / stats.hairFall.days)
        : 0;

      return stats;
    };

    // Current streak
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
      const log = hairLogs[date];
      if (log && (log.minoxidil || log.minimalist)) {
        streak++;
      } else {
        break;
      }
    }

    return {
      days30: calculateForPeriod(30),
      days90: calculateForPeriod(90),
      days180: calculateForPeriod(180),
      streak,
    };
  }, [hairLogs]);

  // PDF Export Function
  // Updated PDF Export Function - Matches Screen Design
  const exportToPDF = () => {
    const allLogDates = Object.keys(hairLogs)
      .filter((date) => {
        const log = hairLogs[date];
        return (
          log &&
          Object.keys(log).some(
            (key) =>
              [
                "minoxidil",
                "minimalist",
                "biotin",
                "supradyn",
                "seeds",
                "shampoo",
                "oil",
                "herbal",
              ].includes(key) && log[key]
          )
        );
      })
      .sort();

    const actualStartDate =
      allLogDates.length > 0
        ? dayjs(allLogDates[0])
        : dayjs().subtract(180, "days");
    const actualEndDate = dayjs();
    const totalDays = actualEndDate.diff(actualStartDate, "day") + 1;
    const data = analytics.days180;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dermatologist Report - ${dayjs().format("MMM DD, YYYY")}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Segoe UI Emoji', Arial, sans-serif;
          background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
          padding: 30px;
          color: #1a1a1a;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: linear-gradient(to bottom, #f8f9fa, #ffffff);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        
        /* Header */
        .header {
          margin-bottom: 30px;
        }
        
        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #0f766e;
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .header-subtitle {
          color: #6b7280;
          font-size: 15px;
          font-weight: 500;
        }
        
        /* Info Grid */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          background: #f0fdfa;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          border: 2px solid #5eead4;
        }
        
        .info-item {
          border-left: 3px solid #14b8a6;
          padding-left: 12px;
        }
        
        .info-label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .info-value {
          font-size: 14px;
          color: #0f172a;
          font-weight: 700;
        }
        
        /* Treatment Schedule Box */
        .schedule-box {
          background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%);
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          border: 2px solid #5eead4;
        }
        
        .schedule-title {
          font-size: 12px;
          font-weight: 700;
          color: #0f766e;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .schedule-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          font-size: 12px;
          color: #0f766e;
        }
        
        .schedule-item {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        
        .schedule-item strong {
          font-weight: 700;
        }
        
        /* Section */
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #0f172a;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        
        .section-subtitle {
          color: #6b7280;
          font-size: 13px;
          margin-bottom: 20px;
        }
        
        /* Compliance Grid */
        .compliance-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        
        .stat-card {
          border-radius: 14px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          page-break-inside: avoid;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .stat-card-blue {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border: 2px solid #60a5fa;
        }
        
        .stat-card-purple {
          background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
          border: 2px solid #a855f7;
        }
        
        .stat-card-pink {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
          border: 2px solid #ec4899;
        }
        
        .stat-card-orange {
          background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
          border: 2px solid #f97316;
        }
        
        .stat-card-amber {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #f59e0b;
        }
        
        .stat-card-green {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border: 2px solid #10b981;
        }
        
        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .stat-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          line-height: 1.3;
        }
        
        .stat-sublabel {
          font-size: 12px;
          font-weight: 500;
          margin-top: 2px;
        }
        
        .stat-value {
          font-size: 40px;
          font-weight: 800;
          line-height: 1;
        }
        
        .stat-footer {
          font-size: 12px;
          font-weight: 600;
        }
        
        .stat-progress {
          width: 100%;
          height: 6px;
          background: rgba(0,0,0,0.15);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 4px;
        }
        
        .stat-progress-bar {
          height: 100%;
          border-radius: 3px;
        }
        
        /* Colors */
        .color-blue { color: #2563eb; }
        .color-purple { color: #7c3aed; }
        .color-pink { color: #db2777; }
        .color-orange { color: #ea580c; }
        .color-amber { color: #d97706; }
        .color-green { color: #059669; }
        .color-red { color: #dc2626; }
        
        .bg-blue { background: #2563eb; }
        .bg-purple { background: #7c3aed; }
        .bg-pink { background: #db2777; }
        .bg-orange { background: #ea580c; }
        .bg-amber { background: #d97706; }
        .bg-green { background: #059669; }
        
        /* Chart */
        .chart-container {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
        }
        
        .chart-empty {
          text-align: center;
          padding: 40px;
          color: #94a3b8;
          font-size: 14px;
        }
        
        .chart-empty-icon {
          font-size: 48px;
          margin-bottom: 12px;
          opacity: 0.3;
        }
        
        /* Lists */
        .list {
          list-style: none;
          padding: 0;
        }
        
        .list-item {
          padding: 14px 16px;
          margin-bottom: 10px;
          border-radius: 10px;
          font-size: 13px;
          display: flex;
          gap: 14px;
          page-break-inside: avoid;
        }
        
        .list-item-red {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
        }
        
        .list-item-teal {
          background: #f0fdfa;
          border-left: 4px solid #14b8a6;
        }
        
        .list-date {
          font-weight: 700;
          min-width: 110px;
          font-size: 12px;
        }
        
        .list-date-red { color: #dc2626; }
        .list-date-teal { color: #0f766e; }
        
        .list-text {
          color: #374151;
          flex: 1;
        }
        
        /* Footer */
        .footer {
          margin-top: 40px;
          padding: 20px;
          background: #f3f4f6;
          border-radius: 12px;
          text-align: center;
          border: 2px dashed #9ca3af;
        }
        
        .footer p {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 4px;
        }
        
        @media print {
          body { padding: 10px; background: white; }
          .container { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="header-title">
            🩺 Dermatologist Report
          </div>
          <div class="header-subtitle">
            Clinical Hair Care Progress Summary
          </div>
        </div>
        
        <!-- Patient Info -->
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Patient Name</div>
            <div class="info-value">Jay Sinh Thakur</div>
          </div>
          <div class="info-item">
            <div class="info-label">Treatment Started</div>
            <div class="info-value">${actualStartDate.format(
              "MMM DD, YYYY"
            )}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Current Date</div>
            <div class="info-value">${actualEndDate.format(
              "MMM DD, YYYY"
            )}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Total Duration</div>
            <div class="info-value">${totalDays} days (${Math.floor(
      totalDays / 30
    )} months)</div>
          </div>
          <div class="info-item">
            <div class="info-label">Treatment Protocol</div>
            <div class="info-value">Minoxidil + Minimalist (AM/PM)</div>
          </div>
          <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">${dayjs().format(
              "MMM DD, YYYY • HH:mm A"
            )}</div>
          </div>
        </div>
        
        <!-- Treatment Schedule -->
        <div class="schedule-box">
          <div class="schedule-title">📋 Current Treatment Schedule</div>
          <div class="schedule-grid">
            <div class="schedule-item">• <strong>AM (Morning):</strong> Minimalist 18% Serum</div>
            <div class="schedule-item">• <strong>PM (Night):</strong> Minoxidil 5%</div>
            <div class="schedule-item">• <strong>Daily:</strong> Biotin Gummies + SupraDyn + Seed Mix</div>
            <div class="schedule-item">• <strong>Weekly:</strong> Shampoo (1-2x) + Oil/Herbal (1x each)</div>
          </div>
        </div>
        
        <!-- Treatment Compliance -->
        <div class="section">
          <div class="section-header">📊 Treatment Compliance</div>
          <div class="section-subtitle">${totalDays}-day adherence since treatment started (${actualStartDate.format(
      "MMM DD, YYYY"
    )})</div>
          
          <div class="compliance-grid">
            <!-- Minoxidil -->
            <div class="stat-card stat-card-blue">
              <div class="stat-header">
                <div>
                  <div class="stat-label color-blue">MINOXIDIL 5%</div>
                  <div class="stat-sublabel color-blue">Daily (PM)</div>
                </div>
                <div class="stat-value color-${
                  data.minoxidil.compliance >= 80
                    ? "green"
                    : data.minoxidil.compliance >= 60
                    ? "amber"
                    : "red"
                }">${data.minoxidil.compliance}%</div>
              </div>
              <div class="stat-footer color-blue">${data.minoxidil.count} of ${
      data.minoxidil.expected
    } days</div>
              <div class="stat-progress">
                <div class="stat-progress-bar bg-blue" style="width: ${
                  data.minoxidil.compliance
                }%"></div>
              </div>
            </div>
            
            <!-- Minimalist -->
            <div class="stat-card stat-card-purple">
              <div class="stat-header">
                <div>
                  <div class="stat-label color-purple">MINIMALIST 18% SERUM</div>
                  <div class="stat-sublabel color-purple">Daily (AM + PM)</div>
                </div>
                <div class="stat-value color-${
                  data.minimalist.compliance >= 80
                    ? "green"
                    : data.minimalist.compliance >= 60
                    ? "amber"
                    : "red"
                }">${data.minimalist.compliance}%</div>
              </div>
              <div class="stat-footer color-purple">${
                data.minimalist.count
              } of ${data.minimalist.expected} applications</div>
              <div class="stat-progress">
                <div class="stat-progress-bar bg-purple" style="width: ${
                  data.minimalist.compliance
                }%"></div>
              </div>
            </div>
            
            <!-- Biotin -->
            <div class="stat-card stat-card-pink">
              <div class="stat-header">
                <div>
                  <div class="stat-label color-pink">BIOTIN GUMMIES</div>
                  <div class="stat-sublabel color-pink">Daily supplement</div>
                </div>
                <div class="stat-value color-${
                  data.biotin.compliance >= 80
                    ? "green"
                    : data.biotin.compliance >= 60
                    ? "amber"
                    : "red"
                }">${data.biotin.compliance}%</div>
              </div>
              <div class="stat-footer color-pink">${data.biotin.count} of ${
      data.biotin.expected
    } days</div>
              <div class="stat-progress">
                <div class="stat-progress-bar bg-pink" style="width: ${
                  data.biotin.compliance
                }%"></div>
              </div>
            </div>
            
            <!-- SupraDyn -->
            <div class="stat-card stat-card-orange">
              <div class="stat-header">
                <div>
                  <div class="stat-label color-orange">SUPRADYN</div>
                  <div class="stat-sublabel color-orange">Daily multivitamin</div>
                </div>
                <div class="stat-value color-${
                  data.supradyn.compliance >= 80
                    ? "green"
                    : data.supradyn.compliance >= 60
                    ? "amber"
                    : "red"
                }">${data.supradyn.compliance}%</div>
              </div>
              <div class="stat-footer color-orange">${data.supradyn.count} of ${
      data.supradyn.expected
    } days</div>
              <div class="stat-progress">
                <div class="stat-progress-bar bg-orange" style="width: ${
                  data.supradyn.compliance
                }%"></div>
              </div>
            </div>
            
            <!-- Seed Mix -->
            <div class="stat-card stat-card-amber">
              <div class="stat-header">
                <div>
                  <div class="stat-label color-amber">SEED MIX</div>
                  <div class="stat-sublabel color-amber">Daily nutrition</div>
                </div>
                <div class="stat-value color-${
                  data.seeds.compliance >= 80
                    ? "green"
                    : data.seeds.compliance >= 60
                    ? "amber"
                    : "red"
                }">${data.seeds.compliance}%</div>
              </div>
              <div class="stat-footer color-amber">${data.seeds.count} of ${
      data.seeds.expected
    } days</div>
              <div class="stat-progress">
                <div class="stat-progress-bar bg-amber" style="width: ${
                  data.seeds.compliance
                }%"></div>
              </div>
            </div>
            
            <!-- Perfect Days -->
            <div class="stat-card stat-card-green">
              <div class="stat-header">
                <div>
                  <div class="stat-label color-green">PERFECT COMPLIANCE</div>
                  <div class="stat-sublabel color-green">All protocols followed</div>
                </div>
                <div class="stat-value color-green">${data.perfect}</div>
              </div>
              <div class="stat-footer color-green">${(
                (data.perfect / totalDays) *
                100
              ).toFixed(0)}% of ${totalDays} days 🏆</div>
            </div>
          </div>
        </div>
        
        <!-- Hair Fall -->
        <div class="section">
          <div class="section-header">📉 Hair Fall Progression</div>
          <div class="section-subtitle">Weekly average hair fall count over ${totalDays} days</div>
          
          <div class="chart-container">
            ${
              data.hairFall.avg > 0
                ? `<div style="text-align: center; color: #0f766e; font-size: 14px; font-weight: 600;">
                Average Daily Fall: ${data.hairFall.avg} strands | Total Recorded: ${data.hairFall.total} strands | Data Points: ${data.hairFall.days} days
              </div>`
                : `<div class="chart-empty">
                <div class="chart-empty-icon">📉</div>
                <div>No hair fall data recorded in this period</div>
              </div>`
            }
          </div>
        </div>
        
        <!-- Side Effects -->
        ${
          data.sideEffects.length > 0
            ? `
          <div class="section">
            <div class="section-header">⚠️ Reported Side Effects</div>
            <div class="section-subtitle">${
              data.sideEffects.length
            } incidents reported</div>
            
            <ul class="list">
              ${data.sideEffects
                .slice(0, 10)
                .map(
                  (item) => `
                <li class="list-item list-item-red">
                  <span class="list-date list-date-red">${dayjs(
                    item.date
                  ).format("MMM DD, YYYY")}</span>
                  <span class="list-text">${item.text}</span>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        `
            : ""
        }
        
        <!-- Notes -->
        ${
          data.notes.length > 0
            ? `
          <div class="section">
            <div class="section-header">📝 Patient Observations</div>
            <div class="section-subtitle">${
              data.notes.length
            } progress notes recorded</div>
            
            <ul class="list">
              ${data.notes
                .slice(0, 10)
                .map(
                  (item) => `
                <li class="list-item list-item-teal">
                  <span class="list-date list-date-teal">${dayjs(
                    item.date
                  ).format("MMM DD, YYYY")}</span>
                  <span class="list-text">${item.text}</span>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        `
            : ""
        }
        
        <!-- Footer -->
        <div class="footer">
          <p>⚕️ This report is auto-generated from patient's self-tracked data.</p>
          <p>For clinical use, verify data accuracy with patient consultation. Generated by LifeOS Hair Care Tracker.</p>
        </div>
      </div>
    </body>
    </html>
  `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Compact Calendar
  const renderCompactCalendar = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");

    const days = [];
    let day = startDate;

    while (day.isBefore(endDate) || day.isSame(endDate, "day")) {
      days.push(day);
      day = day.add(1, "day");
    }

    return (
      <div>
        {/* Weekday Headers - Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div
              key={i}
              className="w-10 h-8 flex items-center justify-center text-xs font-semibold text-teal-300/70"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Days - Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dateStr = day.format("YYYY-MM-DD");
            const log = hairLogs[dateStr];
            const isToday = day.isSame(dayjs(), "day");
            const isCurrentMonth = day.month() === currentMonth.month();
            const isSelected = dateStr === selectedDate;
            const isFuture = day.isAfter(dayjs(), "day");

            const hasMinoxidil = log?.minoxidil;
            const hasMinimalist = log?.minimalist;
            const hasBiotin = log?.biotin;
            const hasSupradyn = log?.supradyn;
            const hasSeeds = log?.seeds;

            const isPerfect =
              (hasMinoxidil || hasMinimalist) &&
              hasBiotin &&
              hasSupradyn &&
              hasSeeds;
            const hasPartial =
              hasMinoxidil || hasMinimalist || hasBiotin || hasSupradyn;

            return (
              <motion.button
                key={dateStr}
                onClick={() => !isFuture && setSelectedDate(dateStr)}
                disabled={isFuture}
                whileHover={!isFuture ? { scale: 1.05 } : {}}
                whileTap={!isFuture ? { scale: 0.95 } : {}}
                className={`
            relative w-10 h-10 rounded-lg transition-all
            flex items-center justify-center
            ${isCurrentMonth ? "text-teal-100" : "text-teal-700/40"}
            ${isToday ? "ring-2 ring-cyan-400" : ""}
            ${
              isSelected ? "bg-teal-500/40 ring-2 ring-teal-400" : "bg-black/20"
            }
            ${!isFuture && !isSelected ? "hover:bg-teal-500/10" : ""}
            ${isFuture ? "opacity-30 cursor-not-allowed" : ""}
            ${isPerfect ? "ring-2 ring-green-400/70" : ""}
          `}
              >
                <span className="text-xs font-medium z-10">{day.date()}</span>

                {!isFuture && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2">
                    {isPerfect ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                    ) : hasPartial ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    ) : null}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render product card
  const renderProductCard = (productKey, product, category) => {
    const isActive = todayData[productKey];
    const colors = COLOR_SCHEMES[product.color];
    const hasConflict = isActive && product.conflict?.some((c) => todayData[c]);

    return (
      <motion.button
        key={productKey}
        onClick={() => toggleProduct(productKey)}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative w-full p-4 rounded-xl border transition-all duration-300
          ${
            isActive
              ? `${colors.bg} ${colors.border} ${colors.glow}`
              : "bg-black/20 border-teal-700/30 hover:border-teal-400/40"
          }
          ${hasConflict ? "ring-2 ring-red-500 animate-pulse" : ""}
        `}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 text-left">
            <div className="text-2xl mt-0.5">{product.icon}</div>
            <div className="flex-1">
              <div
                className={`font-semibold ${
                  isActive ? colors.text : "text-teal-100"
                } mb-1`}
              >
                {product.name}
              </div>
              <div className="text-xs text-teal-300/60 leading-relaxed">
                {product.schedule}
              </div>
              {hasConflict && (
                <div className="text-xs text-red-300 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Conflict detected!
                </div>
              )}
            </div>
          </div>
          {isActive && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className={`${colors.text}`}
            >
              <Check size={24} strokeWidth={3} />
            </motion.div>
          )}
        </div>
      </motion.button>
    );
  };

  // Render category
  const renderCategory = (categoryKey, categoryData, title, icon) => {
    const isExpanded = expandedCategories[categoryKey];
    const products = Object.entries(categoryData);
    const completedCount = products.filter(([key]) => todayData[key]).length;
    const totalCount = products.length;
    const progress = (completedCount / totalCount) * 100;

    return (
      <div className="bg-black/30 backdrop-blur-xl border border-teal-700/30 rounded-2xl overflow-hidden">
        <button
          onClick={() =>
            setExpandedCategories((prev) => ({
              ...prev,
              [categoryKey]: !prev[categoryKey],
            }))
          }
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-teal-500/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-teal-200">{title}</h3>
              <div className="text-xs text-teal-400/60">
                {completedCount} of {totalCount} completed
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold text-teal-300">
                {progress.toFixed(0)}%
              </div>
              <div className="w-20 h-1.5 bg-black/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-teal-400 to-cyan-400"
                />
              </div>
            </div>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 pb-6 space-y-3"
            >
              {products.map(([key, product]) =>
                renderProductCard(key, product, categoryKey)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // DOCTOR MODE VIEW
  // DOCTOR MODE VIEW
  if (doctorMode) {
    const data = analytics.days180;

    // ✅ Calculate actual start date from first logged entry
    const allLogDates = Object.keys(hairLogs)
      .filter((date) => {
        const log = hairLogs[date];
        return (
          log &&
          Object.keys(log).some(
            (key) =>
              [
                "minoxidil",
                "minimalist",
                "biotin",
                "supradyn",
                "seeds",
                "shampoo",
                "oil",
                "herbal",
              ].includes(key) && log[key]
          )
        );
      })
      .sort();

    const actualStartDate =
      allLogDates.length > 0
        ? dayjs(allLogDates[0])
        : dayjs().subtract(180, "days");
    const actualEndDate = dayjs();
    const totalDays = actualEndDate.diff(actualStartDate, "day") + 1;

    return (
      <div className="min-h-screen rounded-xl px-4 py-6 pb-20 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setDoctorMode(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors self-start"
                >
                  <ChevronLeft size={18} />
                  Back to App
                </button>
                <div className="hidden sm:block h-8 w-px bg-gray-300" />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-teal-700 flex items-center gap-2 sm:gap-3">
                    <Stethoscope size={24} className="sm:w-7 sm:h-7" />
                    Dermatologist Report
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Clinical Hair Care Progress Summary
                  </p>
                </div>
              </div>
              <button
                onClick={exportToPDF}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                <Download size={18} />
                Export PDF
              </button>
            </div>

            {/* Patient Info Bar - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 pt-4 border-t border-gray-200">
              <div>
                <div className="text-xs text-gray-500 mb-1">Patient Name</div>
                <div className="font-semibold text-gray-900 text-sm">
                  Jay Sinh Thakur
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  Treatment Started
                </div>
                <div className="font-semibold text-gray-900 text-sm">
                  {actualStartDate.format("MMM DD, YYYY")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Current Date</div>
                <div className="font-semibold text-gray-900 text-sm">
                  {actualEndDate.format("MMM DD, YYYY")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Total Duration</div>
                <div className="font-semibold text-gray-900 text-sm">
                  {totalDays} days ({Math.floor(totalDays / 30)}mo)
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  Treatment Protocol
                </div>
                <div className="font-semibold text-gray-900 text-sm">
                  Minoxidil + Minimalist
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Generated On</div>
                <div className="font-semibold text-gray-900 text-sm">
                  {dayjs().format("MMM DD, YYYY")}
                </div>
              </div>
            </div>

            {/* Treatment Schedule Info - Responsive */}
            <div className="mt-4 pt-4 border-t border-gray-200 bg-teal-50 rounded-lg p-3 sm:p-4">
              <div className="text-xs font-semibold text-teal-700 mb-2 flex items-center gap-1">
                📋 Current Treatment Schedule
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-teal-800">
                <div className="flex items-start gap-1">
                  <span>•</span>
                  <span>
                    <strong>AM (Morning):</strong> Minimalist 18% Serum
                  </span>
                </div>
                <div className="flex items-start gap-1">
                  <span>•</span>
                  <span>
                    <strong>PM (Night):</strong> Minoxidil 5%
                  </span>
                </div>
                <div className="flex items-start gap-1">
                  <span>•</span>
                  <span>
                    <strong>Daily:</strong> Biotin + SupraDyn + Seed Mix
                  </span>
                </div>
                <div className="flex items-start gap-1">
                  <span>•</span>
                  <span>
                    <strong>Weekly:</strong> Shampoo (1-2x) + Oil/Herbal (1x)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div id="doctor-report" className="space-y-6">
            {/* PDF Header (hidden on screen, shown in print) */}
            <div className="hidden print:block header">
              <h1>Hair Care Treatment Report</h1>
              <p>
                Patient: Jay Sinh Thakor | Period:{" "}
                {actualStartDate.format("MMM DD, YYYY")} —{" "}
                {actualEndDate.format("MMM DD, YYYY")} ({totalDays} Days) |
                Generated: {dayjs().format("MMMM DD, YYYY")}
              </p>
            </div>

            {/* Treatment Compliance */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <BarChart3 size={22} className="text-teal-600" />
                Treatment Compliance
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {totalDays}-day adherence since treatment started (
                {actualStartDate.format("MMM DD, YYYY")})
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Minoxidil */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
                        Minoxidil 5%
                      </div>
                      <div className="text-sm text-blue-700">Daily (PM)</div>
                    </div>
                    <div
                      className={`text-3xl font-bold ${
                        data.minoxidil.compliance >= 80
                          ? "text-green-600"
                          : data.minoxidil.compliance >= 60
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {data.minoxidil.compliance}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">
                      {data.minoxidil.count} of {data.minoxidil.expected} days
                    </span>
                    <div className="w-16 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${data.minoxidil.compliance}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Minimalist */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">
                        Minimalist 18% Serum
                      </div>
                      <div className="text-sm text-purple-700">
                        Daily (AM + PM)
                      </div>
                    </div>
                    <div
                      className={`text-3xl font-bold ${
                        data.minimalist.compliance >= 80
                          ? "text-green-600"
                          : data.minimalist.compliance >= 60
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {data.minimalist.compliance}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-700">
                      {data.minimalist.count} of {data.minimalist.expected}{" "}
                      applications
                    </span>
                    <div className="w-16 h-1.5 bg-purple-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${data.minimalist.compliance}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Biotin */}
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5 border border-pink-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-medium text-pink-600 uppercase tracking-wide mb-1">
                        Biotin Gummies
                      </div>
                      <div className="text-sm text-pink-700">
                        Daily supplement
                      </div>
                    </div>
                    <div
                      className={`text-3xl font-bold ${
                        data.biotin.compliance >= 80
                          ? "text-green-600"
                          : data.biotin.compliance >= 60
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {data.biotin.compliance}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-pink-700">
                      {data.biotin.count} of {data.biotin.expected} days
                    </span>
                    <div className="w-16 h-1.5 bg-pink-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-600 rounded-full"
                        style={{ width: `${data.biotin.compliance}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* SupraDyn */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">
                        SupraDyn
                      </div>
                      <div className="text-sm text-orange-700">
                        Daily multivitamin
                      </div>
                    </div>
                    <div
                      className={`text-3xl font-bold ${
                        data.supradyn.compliance >= 80
                          ? "text-green-600"
                          : data.supradyn.compliance >= 60
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {data.supradyn.compliance}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-orange-700">
                      {data.supradyn.count} of {data.supradyn.expected} days
                    </span>
                    <div className="w-16 h-1.5 bg-orange-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-600 rounded-full"
                        style={{ width: `${data.supradyn.compliance}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Seed Mix */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-1">
                        Seed Mix
                      </div>
                      <div className="text-sm text-amber-700">
                        Daily nutrition
                      </div>
                    </div>
                    <div
                      className={`text-3xl font-bold ${
                        data.seeds.compliance >= 80
                          ? "text-green-600"
                          : data.seeds.compliance >= 60
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {data.seeds.compliance}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-amber-700">
                      {data.seeds.count} of {data.seeds.expected} days
                    </span>
                    <div className="w-16 h-1.5 bg-amber-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-600 rounded-full"
                        style={{ width: `${data.seeds.compliance}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Perfect Days */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">
                        Perfect Compliance
                      </div>
                      <div className="text-sm text-green-700">
                        All protocols followed
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {data.perfect}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">
                      {((data.perfect / totalDays) * 100).toFixed(0)}% of{" "}
                      {totalDays} days
                    </span>
                    <Award className="text-green-600" size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* Hair Fall Progression */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                <TrendingDown size={22} className="text-teal-600" />
                Hair Fall Progression
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Weekly average hair fall count over 180 days
              </p>

              {data.hairFall.avg > 0 ? (
                <>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                      <div className="text-xs text-red-600 font-medium mb-1">
                        Average Daily Fall
                      </div>
                      <div className="text-3xl font-bold text-red-600">
                        {data.hairFall.avg}
                      </div>
                      <div className="text-sm text-red-700">strands/day</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="text-xs text-blue-600 font-medium mb-1">
                        Total Recorded
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {data.hairFall.total}
                      </div>
                      <div className="text-sm text-blue-700">total strands</div>
                    </div>
                    <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                      <div className="text-xs text-teal-600 font-medium mb-1">
                        Data Points
                      </div>
                      <div className="text-3xl font-bold text-teal-600">
                        {data.hairFall.days}
                      </div>
                      <div className="text-sm text-teal-700">recorded days</div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-end justify-between gap-2 h-64">
                      {data.hairFall.trend.slice(0, 12).map((bucket, idx) => {
                        const maxFall = Math.max(
                          ...data.hairFall.trend.slice(0, 12).map((b) => b.avg)
                        );
                        const height = (bucket.avg / maxFall) * 100;
                        const isRecent = idx >= data.hairFall.trend.length - 3;

                        return (
                          <div
                            key={idx}
                            className="flex-1 flex flex-col items-center gap-2"
                          >
                            <div className="text-xs font-bold text-gray-700">
                              {bucket.avg}
                            </div>
                            <div
                              className={`w-full rounded-t-lg transition-all ${
                                isRecent
                                  ? "bg-gradient-to-t from-teal-500 to-teal-400"
                                  : "bg-gradient-to-t from-gray-400 to-gray-500"
                              }`}
                              style={{ height: `${height}%` }}
                            />
                            <div className="text-[10px] text-gray-500 font-medium">
                              W{bucket.week}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-4">
                      📊 Recent 3 weeks highlighted in teal • Lower values
                      indicate improvement
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <TrendingDown className="mx-auto mb-3 opacity-30" size={48} />
                  <p>No hair fall data recorded in this period</p>
                </div>
              )}
            </div>

            {/* Side Effects */}
            {data.sideEffects.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <AlertCircle size={22} className="text-red-600" />
                  Reported Side Effects
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {data.sideEffects.length} incidents reported
                </p>

                <div className="space-y-2">
                  {data.sideEffects.slice(0, 10).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-100"
                    >
                      <div className="text-xs font-semibold text-red-600 min-w-[100px]">
                        {dayjs(item.date).format("MMM DD, YYYY")}
                      </div>
                      <div className="text-sm text-gray-700 flex-1">
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Notes */}
            {data.notes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <FileText size={22} className="text-teal-600" />
                  Patient Observations
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {data.notes.length} progress notes recorded
                </p>

                <div className="space-y-2">
                  {data.notes.slice(0, 10).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-3 bg-teal-50 rounded-lg border border-teal-100"
                    >
                      <div className="text-xs font-semibold text-teal-600 min-w-[100px]">
                        {dayjs(item.date).format("MMM DD, YYYY")}
                      </div>
                      <div className="text-sm text-gray-700 flex-1">
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="bg-gray-100 rounded-2xl p-6 border border-gray-300 text-center">
              <p className="text-sm text-gray-600 mb-1">
                ⚕️ This report is auto-generated from patient's self-tracked
                data.
              </p>
              <p className="text-xs text-gray-500">
                For clinical use, verify data accuracy with patient
                consultation. Generated by LifeOS Hair Care Tracker.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // NORMAL VIEW (existing code continues...)
  return (
    <div className="min-h-screen px-4 py-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                Hair Care Journey
              </h1>
              <p className="text-teal-300/60 text-sm">
                Minimalist + Minoxidil Protocol • Track every detail
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-2 text-orange-300 mb-1">
                  <Flame size={20} />
                  <span className="text-3xl font-bold">{analytics.streak}</span>
                </div>
                <div className="text-xs text-orange-300/60">Day Streak</div>
              </div>
              <button
                onClick={() => setDoctorMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500/20 border border-teal-400/60 rounded-xl text-teal-100 hover:bg-teal-500/30 transition-colors"
              >
                <Stethoscope size={18} />
                Doctor Mode
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 border border-blue-400/40 rounded-xl p-3">
              <div className="text-blue-300 text-xs mb-1">Minoxidil</div>
              <div className="text-2xl font-bold text-blue-100">
                {analytics.days30.minoxidil.compliance}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 border border-purple-400/40 rounded-xl p-3">
              <div className="text-purple-300 text-xs mb-1">Minimalist</div>
              <div className="text-2xl font-bold text-purple-100">
                {analytics.days30.minimalist.compliance}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-500/20 to-pink-700/20 border border-pink-400/40 rounded-xl p-3">
              <div className="text-pink-300 text-xs mb-1">Perfect Days</div>
              <div className="text-2xl font-bold text-pink-100">
                {analytics.days30.perfect}/30
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-red-700/20 border border-red-400/40 rounded-xl p-3">
              <div className="text-red-300 text-xs mb-1">Avg Fall</div>
              <div className="text-2xl font-bold text-red-100">
                {analytics.days30.hairFall.avg}
              </div>
            </div>
          </div>
        </motion.div>

        {/* View Tabs - Icons only on mobile, full labels on desktop */}
        <div className="mb-6">
          <div className="flex justify-around sm:justify-start overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            {[
              { id: "today", label: "Today", icon: Target },
              { id: "calendar", label: "Calendar", icon: Calendar },
              { id: "analytics", label: "Analytics", icon: Activity },
              { id: "photos", label: "Photos", icon: Camera },
              { id: "history", label: "History", icon: Clock },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`
          flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 min-w-[44px] sm:min-w-auto
          ${
            viewMode === mode.id
              ? "bg-teal-500/30 text-teal-100 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
              : "bg-black/20 text-teal-300/60 border-teal-700/30 hover:bg-teal-500/10 active:bg-teal-500/20"
          }
          border
        `}
              >
                <mode.icon size={18} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TODAY VIEW */}
        {viewMode === "today" && (
          <div className="space-y-6">
            {/* Date selector */}
            <div className="bg-black/30 backdrop-blur-xl border border-teal-700/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() =>
                    setSelectedDate(
                      dayjs(selectedDate)
                        .subtract(1, "day")
                        .format("YYYY-MM-DD")
                    )
                  }
                  className="p-2 hover:bg-teal-500/10 rounded-lg transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-teal-200">
                    {dayjs(selectedDate).format("MMM DD, YYYY")}
                  </h2>
                  <div className="text-sm text-teal-400/60">
                    {dayjs(selectedDate).format("dddd")}
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSelectedDate(
                      dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD")
                    )
                  }
                  disabled={dayjs(selectedDate).isSame(dayjs(), "day")}
                  className="p-2 hover:bg-teal-500/10 rounded-lg transition disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {(todayData.minoxidil || todayData.minimalist) &&
                todayData.biotin &&
                todayData.supradyn &&
                todayData.seeds && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center gap-2 py-3 bg-green-500/20 border border-green-400/60 rounded-xl mb-4"
                  >
                    <Award className="text-green-300" size={20} />
                    <span className="text-green-200 font-semibold">
                      Perfect Day! 🎯
                    </span>
                  </motion.div>
                )}
            </div>

            {/* Categories */}
            <div className="space-y-4">
              {renderCategory(
                "treatments",
                PRODUCTS.treatments,
                "Treatments",
                "💧"
              )}
              {renderCategory(
                "supplements",
                PRODUCTS.supplements,
                "Supplements",
                "💊"
              )}
              {renderCategory("haircare", PRODUCTS.haircare, "Hair Care", "🧴")}
              {renderCategory(
                "weekly",
                PRODUCTS.weekly,
                "Weekly Scalp Care",
                "🌿"
              )}
            </div>

            {/* Additional tracking */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/30 backdrop-blur-xl border border-teal-700/30 rounded-2xl p-6">
                <label className="flex items-center gap-2 text-sm font-medium text-teal-200 mb-3">
                  <TrendingDown size={18} />
                  Hair Fall Count (strands)
                </label>
                <input
                  type="number"
                  value={todayData.hairFallCount}
                  onChange={(e) =>
                    setTodayData({
                      ...todayData,
                      hairFallCount: e.target.value,
                    })
                  }
                  onBlur={saveLog}
                  placeholder="e.g., 15"
                  className="w-full px-4 py-3 bg-black/40 border border-teal-700/40 rounded-xl text-teal-100 text-lg placeholder-teal-400/30 focus:border-teal-400 focus:outline-none transition-colors"
                />
                {analytics.days30.hairFall.avg > 0 && (
                  <div className="text-xs text-teal-300/60 mt-2">
                    Your 30-day average: {analytics.days30.hairFall.avg}{" "}
                    strands/day
                  </div>
                )}
              </div>

              <div className="bg-black/30 backdrop-blur-xl border border-teal-700/30 rounded-2xl p-6">
                <label className="flex items-center gap-2 text-sm font-medium text-teal-200 mb-3">
                  <Activity size={18} />
                  Scalp Condition
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["normal", "dry", "oily", "irritated"].map((condition) => (
                    <button
                      key={condition}
                      onClick={() => {
                        setTodayData({
                          ...todayData,
                          scalpCondition: condition,
                        });
                        saveLog({ scalpCondition: condition });
                      }}
                      className={`
                        px-3 py-2 rounded-lg text-sm capitalize transition-all
                        ${
                          todayData.scalpCondition === condition
                            ? "bg-teal-500/30 text-teal-100 border-teal-400"
                            : "bg-black/20 text-teal-300/60 border-teal-700/30 hover:bg-teal-500/10"
                        }
                        border
                      `}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/30 backdrop-blur-xl border border-teal-700/30 rounded-2xl p-6">
                <label className="flex items-center gap-2 text-sm font-medium text-teal-200 mb-3">
                  <Edit3 size={18} />
                  Daily Notes
                </label>
                <textarea
                  value={todayData.notes}
                  onChange={(e) =>
                    setTodayData({ ...todayData, notes: e.target.value })
                  }
                  onBlur={saveLog}
                  placeholder="Baby hairs visible, less shedding, etc..."
                  rows={4}
                  className="w-full px-4 py-3 bg-black/40 border border-teal-700/40 rounded-xl text-teal-100 placeholder-teal-400/30 focus:border-teal-400 focus:outline-none resize-none transition-colors"
                />
              </div>

              <div className="bg-black/30 backdrop-blur-xl border border-teal-700/30 rounded-2xl p-6">
                <label className="flex items-center gap-2 text-sm font-medium text-red-300 mb-3">
                  <AlertCircle size={18} />
                  Side Effects (if any)
                </label>
                <textarea
                  value={todayData.sideEffects}
                  onChange={(e) =>
                    setTodayData({ ...todayData, sideEffects: e.target.value })
                  }
                  onBlur={saveLog}
                  placeholder="Scalp dryness, itching, forehead breakouts, etc..."
                  rows={4}
                  className="w-full px-4 py-3 bg-black/40 border border-red-700/40 rounded-xl text-teal-100 placeholder-red-400/30 focus:border-red-400 focus:outline-none resize-none transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* COMPACT CALENDAR VIEW */}
        {viewMode === "calendar" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* LEFT:  Calendar*/}
            <div className="bg-black/30 backdrop-blur-xl border border-teal-700/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() =>
                    setCurrentMonth(currentMonth.subtract(1, "month"))
                  }
                  className="p-2 hover:bg-teal-500/10 rounded-xl transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-teal-200">
                  {currentMonth.format("MMMM YYYY")}
                </h2>
                <button
                  onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
                  disabled={currentMonth.isSame(dayjs(), "month")}
                  className="p-2 hover:bg-teal-500/10 rounded-xl transition-colors disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {renderCompactCalendar()}

              {/* Legend */}
              <div className="mt-2 pt-2 border-t border-teal-700/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                    <span className="text-teal-300/70">Perfect Day</span>
                  </div>
                  <span className="text-teal-300/50">
                    {
                      Object.values(hairLogs).filter(
                        (log) =>
                          (log.minoxidil || log.minimalist) &&
                          log.biotin &&
                          log.supradyn &&
                          log.seeds
                      ).length
                    }{" "}
                    days
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-teal-300/70">Partial Compliance</span>
                  </div>
                  <span className="text-teal-300/50">
                    {
                      Object.values(hairLogs).filter(
                        (log) =>
                          (log.minoxidil ||
                            log.minimalist ||
                            log.biotin ||
                            log.supradyn) &&
                          !(
                            (log.minoxidil || log.minimalist) &&
                            log.biotin &&
                            log.supradyn &&
                            log.seeds
                          )
                      ).length
                    }{" "}
                    days
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full border border-cyan-400" />
                    <span className="text-teal-300/70">Today</span>
                  </div>
                  <span className="text-teal-300/50">
                    {dayjs().format("MMM DD")}
                  </span>
                </div>
              </div>

              {/* Quick Stats for Month */}
              <div className="mt-2 pt-6 border-t border-teal-700/30">
                <div className="text-xs font-semibold text-teal-300 mb-3">
                  This Month
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
                    <div className="text-xs text-blue-300/70 mb-1">
                      Logged Days
                    </div>
                    <div className="text-2xl font-bold text-blue-200">
                      {
                        Object.keys(hairLogs).filter((date) =>
                          dayjs(date).isSame(currentMonth, "month")
                        ).length
                      }
                    </div>
                  </div>
                  <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                    <div className="text-xs text-green-300/70 mb-1">
                      Perfect Days
                    </div>
                    <div className="text-2xl font-bold text-green-200">
                      {
                        Object.entries(hairLogs).filter(
                          ([date, log]) =>
                            dayjs(date).isSame(currentMonth, "month") &&
                            (log.minoxidil || log.minimalist) &&
                            log.biotin &&
                            log.supradyn &&
                            log.seeds
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Selected Day Details */}
            <div className="bg-black/30 backdrop-blur-xl border border-teal-700/30 rounded-2xl p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-teal-200 mb-1">
                  {dayjs(selectedDate).format("MMMM DD, YYYY")}
                </h2>
                <p className="text-sm text-teal-400/60">
                  {dayjs(selectedDate).format("dddd")}
                </p>
              </div>

              {hairLogs[selectedDate] ? (
                <div className="space-y-4">
                  {/* Products Used */}
                  <div>
                    <h3 className="text-sm font-semibold text-teal-300 mb-3 flex items-center gap-2">
                      <Check size={16} />
                      Products Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(PRODUCTS).flatMap(([catKey, catData]) =>
                        Object.entries(catData)
                          .filter(
                            ([prodKey]) => hairLogs[selectedDate][prodKey]
                          )
                          .map(([prodKey, product]) => {
                            const colors = COLOR_SCHEMES[product.color];
                            return (
                              <span
                                key={prodKey}
                                className={`flex items-center gap-1.5 px-3 py-2 ${colors.bg} border ${colors.border} rounded-lg text-xs font-medium`}
                              >
                                <span>{product.icon}</span>
                                <span className={colors.text}>
                                  {product.name}
                                </span>
                              </span>
                            );
                          })
                      )}
                      {Object.entries(PRODUCTS)
                        .flatMap(([catKey, catData]) => Object.keys(catData))
                        .every((key) => !hairLogs[selectedDate][key]) && (
                        <span className="text-teal-400/50 text-sm italic">
                          No products logged
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hair Fall Count */}
                  {hairLogs[selectedDate].hairFallCount && (
                    <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4">
                      <div className="text-xs text-red-300/70 mb-1">
                        Hair Fall Count
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="text-3xl font-bold text-red-300">
                          {hairLogs[selectedDate].hairFallCount}
                        </div>
                        <div className="text-sm text-red-300/60 mb-1">
                          strands
                        </div>
                      </div>
                      {analytics.days30.hairFall.avg > 0 && (
                        <div className="text-xs text-red-300/50 mt-2">
                          {hairLogs[selectedDate].hairFallCount >
                          analytics.days30.hairFall.avg
                            ? `↑ Above your 30-day avg (${analytics.days30.hairFall.avg})`
                            : `↓ Below your 30-day avg (${analytics.days30.hairFall.avg})`}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Scalp Condition */}
                  {hairLogs[selectedDate].scalpCondition &&
                    hairLogs[selectedDate].scalpCondition !== "normal" && (
                      <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-4">
                        <div className="text-xs text-amber-300/70 mb-1">
                          Scalp Condition
                        </div>
                        <div className="text-lg font-semibold text-amber-300 capitalize">
                          {hairLogs[selectedDate].scalpCondition}
                        </div>
                      </div>
                    )}

                  {/* Notes */}
                  {hairLogs[selectedDate].notes && (
                    <div className="bg-teal-500/10 border border-teal-400/30 rounded-xl p-4">
                      <div className="text-xs text-teal-300/70 mb-2 font-semibold">
                        Notes
                      </div>
                      <p className="text-sm text-teal-100/90 leading-relaxed">
                        {hairLogs[selectedDate].notes}
                      </p>
                    </div>
                  )}

                  {/* Side Effects */}
                  {hairLogs[selectedDate].sideEffects && (
                    <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4">
                      <div className="text-xs text-red-300/70 mb-2 font-semibold flex items-center gap-1">
                        <AlertCircle size={14} />
                        Side Effects
                      </div>
                      <p className="text-sm text-red-200/90 leading-relaxed">
                        {hairLogs[selectedDate].sideEffects}
                      </p>
                    </div>
                  )}

                  {/* Perfect Day Badge */}
                  {(hairLogs[selectedDate].minoxidil ||
                    hairLogs[selectedDate].minimalist) &&
                    hairLogs[selectedDate].biotin &&
                    hairLogs[selectedDate].supradyn &&
                    hairLogs[selectedDate].seeds && (
                      <div className="flex items-center justify-center gap-2 py-3 bg-green-500/20 border border-green-400/60 rounded-xl">
                        <Award className="text-green-300" size={20} />
                        <span className="text-green-200 font-semibold">
                          Perfect Day! 🎯
                        </span>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar
                    className="mx-auto mb-4 text-teal-400/30"
                    size={48}
                  />
                  <p className="text-teal-300/50 mb-4">No data for this day</p>
                  <button
                    onClick={() => {
                      setViewMode("today");
                      setSelectedDate(dayjs(selectedDate).format("YYYY-MM-DD"));
                    }}
                    className="px-4 py-2 bg-teal-500/30 border border-teal-400 rounded-xl text-teal-100 hover:bg-teal-500/40 transition-colors text-sm"
                  >
                    Log Data for This Day
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ANALYTICS VIEW */}
        {viewMode === "analytics" && (
          <div className="space-y-6">
            {/* Compliance breakdown */}
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(PRODUCTS).map(([catKey, catData]) =>
                Object.entries(catData).map(([prodKey, product]) => {
                  const stat = analytics.days30[prodKey] || {}; // ✅ CHANGED: analytics.days30[prodKey]
                  const colors = COLOR_SCHEMES[product.color];
                  const compliance = stat.compliance || 0;
                  const isGood = compliance >= 80;
                  const isOk = compliance >= 60;

                  return (
                    <motion.div
                      key={prodKey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-gradient-to-br ${colors.gradient} border ${colors.border} rounded-2xl p-6 relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 text-6xl opacity-10">
                        {product.icon}
                      </div>
                      <div className="relative z-10">
                        <div
                          className={`${colors.text} text-sm mb-2 font-medium`}
                        >
                          {product.name}
                        </div>
                        <div className="flex items-end gap-2 mb-3">
                          <div className="text-4xl font-bold text-white">
                            {compliance}%
                          </div>
                          <div className="text-sm text-white/60 mb-1">
                            {stat.count}/{stat.expected}
                          </div>
                        </div>
                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${compliance}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full ${
                              isGood
                                ? "bg-green-400"
                                : isOk
                                ? "bg-amber-400"
                                : "bg-red-400"
                            }`}
                          />
                        </div>
                        <div className="text-xs text-white/50 mt-2">
                          {product.schedule}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Hair fall trend */}
            {analytics.days30?.hairFall?.trend?.length > 0 && ( // ✅ CHANGED: analytics.days30.hairFall
              <div className="bg-black/30 backdrop-blur-xl border border-teal-700/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-teal-200 mb-4 flex items-center gap-2">
                  <TrendingDown size={20} />
                  Hair Fall Trend (Weekly Average - Last 30 Days)
                </h3>
                <div className="flex items-end gap-2 h-64">
                  {analytics.days30.hairFall.trend.map((bucket, idx) => {
                    // ✅ CHANGED
                    const maxFall = Math.max(
                      ...analytics.days30.hairFall.trend.map((b) => b.avg) // ✅ CHANGED
                    );
                    const height = (bucket.avg / maxFall) * 100;
                    const isRecent =
                      idx >= analytics.days30.hairFall.trend.length - 2; // ✅ CHANGED

                    return (
                      <div
                        key={bucket.week}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <div className="text-xs text-teal-300/60 font-bold">
                          {bucket.avg}
                        </div>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.5, delay: idx * 0.1 }}
                          className={`w-full rounded-t-lg ${
                            isRecent
                              ? "bg-gradient-to-t from-cyan-500 to-teal-400"
                              : "bg-gradient-to-t from-teal-600 to-teal-700"
                          }`}
                          title={`Week ${bucket.week}: ${bucket.avg} strands/day`}
                        />
                        <div className="text-[10px] text-teal-400/40">
                          W{bucket.week}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-teal-300/60 mt-4 text-center">
                  Lower is better • Recent weeks highlighted in cyan
                </div>
              </div>
            )}
          </div>
        )}

        {/* PHOTOS VIEW */}
        {viewMode === "photos" && (
          <div className="space-y-6">
            <div className="bg-black/30 backdrop-blur-xl border border-teal-700/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-teal-200">
                  Progress Photos
                </h3>
                <button
                  onClick={() => setShowPhotoUpload(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-500/30 border border-teal-400 rounded-xl text-teal-100 hover:bg-teal-500/40 transition-colors"
                >
                  <Plus size={18} />
                  Add Photo
                </button>
              </div>

              {hairPhotos.length === 0 ? (
                <div className="text-center py-16">
                  <Camera className="mx-auto mb-4 text-teal-400/30" size={64} />
                  <p className="text-teal-300/50 mb-4">
                    No progress photos yet. Take monthly photos to track visible
                    growth!
                  </p>
                  <button
                    onClick={() => setShowPhotoUpload(true)}
                    className="px-6 py-3 bg-teal-500/30 border border-teal-400 rounded-xl text-teal-100 hover:bg-teal-500/40 transition-colors"
                  >
                    Take Your First Photo
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hairPhotos.map((photo, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-black/40 border border-teal-700/30 rounded-xl overflow-hidden"
                    >
                      {/* ✅ Display actual image */}
                      <div className="aspect-video bg-teal-900/20 overflow-hidden">
                        {photo.url ? (
                          <img
                            src={photo.url}
                            alt={`Progress photo from ${dayjs(
                              photo.date
                            ).format("MMM DD, YYYY")}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="text-teal-400/30" size={48} />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-sm text-teal-200 font-medium mb-1">
                          {dayjs(photo.date).format("MMM DD, YYYY")}
                        </div>
                        <div className="text-xs text-teal-400/60">
                          {photo.notes || "No notes"}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-4 flex gap-3">
              <Info className="text-amber-300 flex-shrink-0" size={20} />
              <div className="text-sm text-amber-200/80">
                <strong>Pro tip:</strong> Take photos in the same lighting, same
                angle, same time of day (morning works best). Compare photos
                every 4 weeks to see real progress that daily mirror-checking
                won't show!
              </div>
            </div>
          </div>
        )}

        {/* HISTORY VIEW */}
        {viewMode === "history" && (
          <div className="bg-black/30 backdrop-blur-xl border border-teal-700/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-teal-200 mb-6">
              Complete History
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {Object.keys(hairLogs)
                .sort()
                .reverse()
                .map((date) => {
                  const log = hairLogs[date];
                  const products = [];

                  Object.entries(PRODUCTS).forEach(([catKey, catData]) => {
                    Object.entries(catData).forEach(([prodKey, product]) => {
                      if (log[prodKey]) {
                        products.push({ key: prodKey, ...product });
                      }
                    });
                  });

                  return (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-black/40 border border-teal-700/30 rounded-xl p-5"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-semibold text-teal-200 text-lg">
                            {dayjs(date).format("MMM DD, YYYY")}
                          </div>
                          <div className="text-xs text-teal-400/60">
                            {dayjs(date).format("dddd")}
                          </div>
                        </div>
                        {log.hairFallCount && (
                          <div className="text-right bg-red-500/20 px-3 py-2 rounded-lg border border-red-400/40">
                            <div className="text-2xl font-bold text-red-300">
                              {log.hairFallCount}
                            </div>
                            <div className="text-xs text-red-300/60">
                              strands
                            </div>
                          </div>
                        )}
                      </div>

                      {products.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {products.map((product) => {
                            const colors = COLOR_SCHEMES[product.color];
                            return (
                              <span
                                key={product.key}
                                className={`flex items-center gap-1.5 px-3 py-1.5 ${colors.bg} border ${colors.border} rounded-lg text-xs font-medium`}
                              >
                                <span>{product.icon}</span>
                                <span className={colors.text}>
                                  {product.name}
                                </span>
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {log.scalpCondition &&
                        log.scalpCondition !== "normal" && (
                          <div className="text-sm text-amber-300 mb-2">
                            Scalp:{" "}
                            <span className="capitalize">
                              {log.scalpCondition}
                            </span>
                          </div>
                        )}

                      {log.notes && (
                        <div className="text-sm text-teal-100/80 bg-black/20 p-3 rounded-lg mb-2">
                          <strong className="text-teal-300">Notes:</strong>{" "}
                          {log.notes}
                        </div>
                      )}

                      {log.sideEffects && (
                        <div className="text-sm text-red-300/80 bg-red-500/10 p-3 rounded-lg border border-red-400/20">
                          <strong className="text-red-300">
                            Side Effects:
                          </strong>{" "}
                          {log.sideEffects}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Photo Upload Modal */}
      <AnimatePresence>
        {showPhotoUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPhotoUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-950 border border-teal-400/30 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-teal-200">
                  Add Progress Photo
                </h3>
                <button
                  onClick={() => setShowPhotoUpload(false)}
                  className="p-2 hover:bg-teal-500/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* ✅ FIXED: Added actual file input */}
                <label className="border-2 border-dashed border-teal-400/30 rounded-xl p-8 text-center hover:border-teal-400/60 transition-colors cursor-pointer block">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Convert to base64 for storage
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          // Store base64 in state temporarily
                          setPhotoNotes((prev) => ({
                            ...prev,
                            photoData: reader.result,
                            fileName: file.name,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <ImagePlus
                    className="mx-auto mb-3 text-teal-400/50"
                    size={48}
                  />
                  <div className="text-teal-300/70 text-sm">
                    Click to upload or drag & drop
                  </div>
                  <div className="text-teal-400/40 text-xs mt-1">
                    JPG, PNG up to 5MB
                  </div>
                  {photoNotes?.fileName && (
                    <div className="text-teal-200 text-xs mt-2 font-medium">
                      ✓ {photoNotes.fileName}
                    </div>
                  )}
                </label>

                <div>
                  <label className="block text-sm font-medium text-teal-200 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={
                      typeof photoNotes === "string"
                        ? photoNotes
                        : photoNotes?.notes || ""
                    }
                    onChange={(e) => {
                      if (typeof photoNotes === "object") {
                        setPhotoNotes({ ...photoNotes, notes: e.target.value });
                      } else {
                        setPhotoNotes(e.target.value);
                      }
                    }}
                    placeholder="Describe what you notice: baby hairs, density changes, etc..."
                    rows={3}
                    className="w-full px-4 py-3 bg-black/40 border border-teal-700/40 rounded-xl text-teal-100 placeholder-teal-400/30 focus:border-teal-400 focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={() => {
                    const photoData =
                      typeof photoNotes === "object"
                        ? photoNotes
                        : { notes: photoNotes };

                    updateDashboard({
                      hair_photos: [
                        ...(hairPhotos || []),
                        {
                          date: new Date().toISOString(),
                          notes: photoData.notes || "",
                          url: photoData.photoData || null,
                          fileName: photoData.fileName || null,
                        },
                      ],
                    });
                    setPhotoNotes("");
                    setShowPhotoUpload(false);
                  }}
                  disabled={!photoNotes?.photoData}
                  className="w-full py-3 bg-teal-500/30 border border-teal-400 rounded-xl text-teal-100 font-medium hover:bg-teal-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {photoNotes?.photoData ? "Save Photo" : "Select Photo First"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
