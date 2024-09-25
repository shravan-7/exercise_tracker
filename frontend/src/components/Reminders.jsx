import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ text: "", time: "" });

  const fetchReminders = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_REACT_URL}/api/reminders/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        },
      );
      setReminders(response.data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_REACT_URL}/api/reminders/`,
        newReminder,
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        },
      );
      setReminders((prev) => [...prev, response.data]);
      setNewReminder({ text: "", time: "" });
    } catch (error) {
      console.error("Error adding reminder:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Workout Reminders
      </h1>
      <form onSubmit={handleAddReminder} className="mb-6 space-y-4">
        <div>
          <label
            htmlFor="reminderText"
            className="block text-sm font-medium text-gray-700"
          >
            Reminder Text
          </label>
          <input
            type="text"
            id="reminderText"
            value={newReminder.text}
            onChange={(e) =>
              setNewReminder({ ...newReminder, text: e.target.value })
            }
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="reminderTime"
            className="block text-sm font-medium text-gray-700"
          >
            Reminder Time
          </label>
          <input
            type="time"
            id="reminderTime"
            value={newReminder.time}
            onChange={(e) =>
              setNewReminder({ ...newReminder, time: e.target.value })
            }
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Reminder
        </button>
      </form>
      <ul className="space-y-2">
        {reminders.map((reminder) => (
          <li
            key={reminder.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded"
          >
            <span>{reminder.text}</span>
            <span>{reminder.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reminders;
