<<<<<<< HEAD
# 🏋️ WebDev Fitness Dashboard

A personal **fitness + coding lifestyle tracker** built using **React + Vite + Tailwind CSS**.  
It helps you track your **workouts, BMI, weight progress, calories burned, streaks**, and more — all stored locally in your browser.

---

## ✅ Features

### 🧠 **Fitness & Progress Tracking**
- ✅ Weekly workout plan (Monday → Saturday)
- ✅ Mark exercises as done / Not done
- ✅ Save calories burned + daily weight via pop-up
- ✅ Track workout completion percentage
- ✅ Streak counter (e.g., 7-day streak, no-skip week)

### ⚖️ **BMI + Weight Management**
- ✅ BMI calculator with category detection (Underweight / Normal / Overweight / Obese)
- ✅ Weight & BMI auto saved with date
- ✅ Progress bar with 🏃‍♂️ emoji running from Current Weight → Target Weight  
- ✅ Runner animation moves **right → left** as you progress towards your goal  
- ✅ Supports Target Weight & tracks how far you are!

### 📅 **Calendar & History**
- ✅ Mini calendar to show:
  - ✅ Green = Workout complete
  - ❌ Red = Missed day
  - ⏳ Grey = Future day
- ✅ Clicking any date shows:
  - Calories burned that day  
  - Weight & BMI on that day  
  - Whether workout was done or skipped

### 📊 **Charts & Visual Stats**
- ✅ Line chart for Weight & BMI over time (Recharts)
- ✅ Daily summary box beside the calendar
- ✅ Goal vs Current weight progress bar

### 🏆 **Achivement Badges**
- Earn locked/unlocked badges like:
  - ⭐ 7-Day Streak
  - ⭐ No-Skip Week
  - ⭐ 10/25/50 Workouts Completed  
- Badges stay **visible & locked** or **earned**

---

## 🔧 **Tech Stack**

| Tech        | Used For |
|-------------|-----------|
| React + Vite | Frontend framework & dev server |
| Tailwind CSS | Styling & layout |
| LocalStorage | Saving progress, weight, calories, BMI |
| Recharts     | Weight & BMI graphs |
| Day.js       | Date formatting & handling |
 
---

## Model configuration

- **Config file**: `config/models.json` — contains model toggles and the default model.
- **Enabled**: `Claude Haiku 4.5` (`claude-haiku-4.5`) is set to enabled for all clients in `config/models.json`.
- **How to apply**: Services must read `config/models.json` at startup or on reload to pick up changes.

Note: This repository change only adds a configuration artifact. Enabling models in external provider consoles (for example, Anthropic) is separate and requires the provider account or deployment configuration.

