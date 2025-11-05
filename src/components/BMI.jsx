import { useState } from "react";
import { load, save } from "../utils/localStorage";

export default function BMI() {
  const [height, setHeight] = useState(176);
  const [weight, setWeight] = useState(85);

  const bmi = weight / Math.pow(height / 100, 2);

  const category =
    bmi < 18.5
      ? "Underweight"
      : bmi < 25
      ? "Normal"
      : bmi < 30
      ? "Overweight"
      : "Obese";

  // Convert to DD-MM-YYYY
  const formatDate = (d) => {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const today = formatDate(new Date());

  const [bmiLogs, setBmiLogs] = useState(() => load("bmi_logs", []));

  // Save BMI manually
  const saveBMI = () => {
    const newEntry = {
      date: today,
      bmi: +bmi.toFixed(1),
      weight: +weight,
    };

    const updated = [
      ...bmiLogs.filter((e) => e.date !== today), // Prevent duplicate for same date
      newEntry,
    ];

    setBmiLogs(updated);
    save("bmi_logs", updated);
  };

  // Delete a BMI log entry
  const deleteBMI = (date) => {
    const updated = bmiLogs.filter((entry) => entry.date !== date);
    setBmiLogs(updated);
    save("bmi_logs", updated);
  };

  return (
    <div className="max-w-md mx-auto border rounded-2xl p-4">
      <h2 className="font-semibold mb-3">BMI Calculator</h2>

      {/* Input fields (dark mode fix added) */}
      <div className="space-y-3">
        <label className="block">
          Height (cm)
          <input
            type="number"
            className="w-full border rounded p-2 bg-gray-200 dark:bg-gray-700 dark:text-white"
            value={height}
            onChange={(e) => setHeight(+e.target.value)}
          />
        </label>
        <label className="block">
          Weight (kg)
          <input
            type="number"
            className="w-full border rounded p-2 bg-gray-200 dark:bg-gray-700 dark:text-white"
            value={weight}
            onChange={(e) => setWeight(+e.target.value)}
          />
        </label>
      </div>

      {/* BMI display */}
      <div className="mt-4 p-3 rounded bg-gray-300 dark:bg-gray-800">
        <div className="text-xl font-semibold">BMI: {bmi.toFixed(1)}</div>
        <div className="opacity-80">{category}</div>
        <div className="text-sm opacity-70">Date: {today}</div>
      </div>

      {/* Save button */}
      <button
        onClick={saveBMI}
        className="mt-3 w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Save BMI
      </button>

      {/* BMI history with delete */}
      <h3 className="mt-5 font-semibold">BMI History</h3>
      <ul className="text-sm mt-2 space-y-1 max-h-40 overflow-y-auto">
        {bmiLogs.map((entry, i) => (
          <li
            key={i}
            className="flex justify-between items-center border-b py-1"
          >
            <span>
              {entry.date} – {entry.bmi} (Wt: {entry.weight}kg)
            </span>
            <button
              onClick={() => deleteBMI(entry.date)}
              className="text-red-500 hover:text-red-700"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
