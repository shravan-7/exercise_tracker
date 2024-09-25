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
  AreaChart,
  Area,
} from "recharts";
import {
  FaCalendar,
  FaDumbbell,
  FaFire,
  FaClock,
  FaTrophy,
  FaChartLine,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

function Progress() {
  const [progressData, setProgressData] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState("completedExercises");
  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(true);

  const metrics = [
    {
      key: "completedExercises",
      label: "Completed Exercises",
      color: "#3B82F6",
      icon: FaDumbbell,
    },
    {
      key: "totalWorkoutTime",
      label: "Total Workout Time",
      color: "#10B981",
      icon: FaClock,
    },
    {
      key: "caloriesBurned",
      label: "Calories Burned",
      color: "#F59E0B",
      icon: FaFire,
    },
  ];

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_REACT_URL}/api/progress/?start_date=${startDate.toISOString().split("T")[0]}&end_date=${endDate.toISOString().split("T")[0]}`,
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
    setLoading(false);
  }, [startDate, endDate]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const renderCustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Your Fitness Journey
      </h1>

      <div className="mb-8 flex flex-wrap justify-center items-center space-x-4">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <FaCalendar className="text-blue-500" />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            icon: FaDumbbell,
            label: "Total Workouts",
            value: summaryData.totalWorkouts || 0,
            color: "blue",
          },
          {
            icon: FaFire,
            label: "Calories Burned",
            value: summaryData.totalCaloriesBurned || 0,
            color: "orange",
          },
          {
            icon: FaClock,
            label: "Total Workout Time",
            value: `${summaryData.totalWorkoutTime || 0} min`,
            color: "green",
          },
          {
            icon: FaTrophy,
            label: "Exercises Completed",
            value: summaryData.totalExercisesCompleted || 0,
            color: "purple",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl"
          >
            <div className={`text-4xl text-${item.color}-500 mb-4`}>
              <item.icon />
            </div>
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="text-3xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="bg-white p-8 rounded-xl shadow-md mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Progress Over Time
            </h2>
            <div className="mb-6 flex flex-wrap justify-center">
              {metrics.map((metric) => (
                <button
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key)}
                  className={`flex items-center m-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedMetric === metric.key
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <metric.icon className="mr-2" />
                  {metric.label}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={progressData}>
                <defs>
                  {metrics.map((metric) => (
                    <linearGradient
                      key={metric.key}
                      id={`color${metric.key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={metric.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={metric.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={renderCustomTooltip} />
                <Legend />
                {metrics.map((metric) => (
                  <Area
                    key={metric.key}
                    type="monotone"
                    dataKey={metric.key}
                    stroke={metric.color}
                    fillOpacity={1}
                    fill={`url(#color${metric.key})`}
                    strokeWidth={selectedMetric === metric.key ? 3 : 1}
                    dot={selectedMetric === metric.key}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Workout Distribution
              </h2>
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
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Weekly Progress
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summaryData.weeklyProgress}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="workouts" fill="#3B82F6" />
                  <Bar dataKey="exercises" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Personal Bests
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Longest Workout",
                  value: "90 minutes",
                  icon: FaClock,
                },
                {
                  label: "Most Calories Burned",
                  value: "750 kcal",
                  icon: FaFire,
                },
                {
                  label: "Most Exercises in a Day",
                  value: "25",
                  icon: FaDumbbell,
                },
                {
                  label: "Longest Streak",
                  value: "14 days",
                  icon: FaChartLine,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg text-center"
                >
                  <div className="text-3xl text-blue-500 mb-2">
                    <item.icon />
                  </div>
                  <p className="text-sm text-gray-600">{item.label}</p>
                  <p className="text-xl font-bold text-gray-800">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Progress;
