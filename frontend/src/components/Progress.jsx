import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaCalendar, FaDumbbell, FaFire, FaClock } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

function Progress() {
  const [progressData, setProgressData] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState("completedExercises");
  const [summaryData, setSummaryData] = useState({});
  const metrics = [
    {
      key: "completedExercises",
      label: "Completed Exercises",
      color: "#8884d8",
    },
    { key: "totalWorkoutTime", label: "Total Workout Time", color: "#82ca9d" },
    { key: "caloriesBurned", label: "Calories Burned", color: "#ffc658" },
  ];

  const fetchProgress = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/progress/?start_date=${startDate.toISOString().split("T")[0]}&end_date=${endDate.toISOString().split("T")[0]}`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      setProgressData(response.data.progress);
      setSummaryData(response.data.summary);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const renderCustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded shadow">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Your Progress</h1>

      <div className="mb-6 flex flex-wrap items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FaCalendar className="text-blue-500" />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="border rounded p-2"
          />
        </div>
        <div className="flex items-center space-x-2">
          <FaCalendar className="text-blue-500" />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="border rounded p-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <FaDumbbell className="text-3xl text-blue-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Total Workouts</p>
            <p className="text-2xl font-bold">
              {summaryData.totalWorkouts || 0}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <FaFire className="text-3xl text-orange-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Calories Burned</p>
            <p className="text-2xl font-bold">
              {summaryData.totalCaloriesBurned || 0}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <FaClock className="text-3xl text-green-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Total Workout Time</p>
            <p className="text-2xl font-bold">
              {summaryData.totalWorkoutTime || 0} min
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex items-center">
          <FaDumbbell className="text-3xl text-purple-500 mr-4" />
          <div>
            <p className="text-sm text-gray-500">Exercises Completed</p>
            <p className="text-2xl font-bold">
              {summaryData.totalExercisesCompleted || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">Progress Over Time</h2>
        <div className="mb-4">
          {metrics.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`mr-2 px-4 py-2 rounded ${
                selectedMetric === metric.key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={progressData}>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={renderCustomTooltip} />
            <Legend />
            {metrics.map((metric) => (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                stroke={metric.color}
                strokeWidth={selectedMetric === metric.key ? 3 : 1}
                dot={selectedMetric === metric.key}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Workout Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summaryData.workoutDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {summaryData.workoutDistribution &&
                  summaryData.workoutDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Weekly Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summaryData.weeklyProgress}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="workouts" fill="#8884d8" />
              <Bar dataKey="exercises" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Progress;
