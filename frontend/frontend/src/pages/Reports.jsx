import { useEffect, useState } from "react";
import api from "../services/api";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import "./Reports.css";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState({});
  const [view, setView] = useState("month"); // month, day, category

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/expenses");
      setExpenses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load expenses:", err);
      setError("Failed to load expense data. Please try again.");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const [year, month] = selectedMonth.split("-").map(Number);

  const monthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month - 1;
  });

  const dailyData = monthExpenses.reduce((acc, e) => {
    const dateStr = e.date.split("T")[0];
    if (!acc[dateStr]) {
      acc[dateStr] = { date: dateStr, items: [], total: 0 };
    }
    acc[dateStr].items.push(e);
    acc[dateStr].total += e.amount;
    return acc;
  }, {});

  const sortedDays = Object.values(dailyData).sort((a, b) => new Date(b.date) - new Date(a.date));

  const categoryData = monthExpenses.reduce((acc, e) => {
    const cat = e.category?.name || "Uncategorized";
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += e.amount;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [{
      label: "Expenses by Category",
      data: Object.values(categoryData),
      backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"],
    }]
  };

  const monthlyExpenses = {};
  expenses.forEach(e => {
    const monthKey = e.date.slice(0, 7);
    if (!monthlyExpenses[monthKey]) monthlyExpenses[monthKey] = 0;
    monthlyExpenses[monthKey] += e.amount;
  });

  const months = Object.keys(monthlyExpenses).sort();
  const barData = {
    labels: months.map(m => {
      const [y, mo] = m.split("-");
      return new Date(y, mo - 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    }),
    datasets: [{
      label: "Monthly Expenses",
      data: months.map(m => monthlyExpenses[m]),
      backgroundColor: "#4F46E5",
      borderRadius: 6,
    }]
  };

  const getDaysInMonth = (y, m) => new Date(y, m, 0).getDate();
  const firstDay = new Date(y, month - 1, 1).getDay();
  const daysInMonth = getDaysInMonth(y, month);

  const dayNotes = notes[selectedMonth] || {};

  const handleAddNote = (date, note) => {
    setNotes(prev => ({
      ...prev,
      [selectedMonth]: {
        ...(prev[selectedMonth] || {}),
        [date]: note
      }
    }));
  };

  const selectedDateData = selectedDate ? dailyData[selectedDate] : null;

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>📊 Expense Reports & Analytics</h1>
        <p>Track spending patterns, analyze by category, and view daily breakdowns</p>
      </div>

      {error && (
        <div className="error-box">
          <p>{error}</p>
        </div>
      )}

      {loading && <p>Loading reports...</p>}

      {!loading && (
        <div className="reports-content">
          {/* View Selector */}
          <div className="view-selector">
            <button
              className={`view-btn ${view === "month" ? "active" : ""}`}
              onClick={() => setView("month")}
            >
              📅 Month View
            </button>
            <button
              className={`view-btn ${view === "category" ? "active" : ""}`}
              onClick={() => setView("category")}
            >
              🏷️ Category Analysis
            </button>
            <button
              className={`view-btn ${view === "day" ? "active" : ""}`}
              onClick={() => setView("day")}
            >
              📆 Daily Details
            </button>
          </div>

          {/* Month View */}
          {view === "month" && (
            <div className="month-view">
              <div className="month-selector">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="month-input"
                />
                <span className="month-total">
                  Total: ₹{monthExpenses.reduce((s, e) => s + e.amount, 0).toFixed(2)}
                </span>
              </div>

              <div className="calendar-grid">
                <div className="calendar-container">
                  <h2>{new Date(year, month - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h2>
                  <div className="calendar">
                    <div className="weekdays">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                        <div key={d} className="weekday">{d}</div>
                      ))}
                    </div>
                    <div className="days">
                      {Array(firstDay).fill(null).map((_, i) => (
                        <div key={`empty-${i}`} className="day empty" />
                      ))}
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const day = i + 1;
                        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const dayExpense = dailyData[dateStr];
                        const isSelected = selectedDate === dateStr;
                        return (
                          <div
                            key={day}
                            className={`day ${dayExpense ? "has-expense" : ""} ${isSelected ? "selected" : ""}`}
                            onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                          >
                            <div className="day-number">{day}</div>
                            {dayExpense && (
                              <div className="day-amount">₹{dayExpense.total.toFixed(0)}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {selectedDateData && (
                  <div className="date-detail-panel">
                    <h3>{new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
                    <div className="date-expenses">
                      {selectedDateData.items.map((e, idx) => (
                        <div key={idx} className="expense-row">
                          <div className="expense-info">
                            <span className="expense-cat">{e.category?.name || "-"}</span>
                            <span className="expense-title">{e.title}</span>
                          </div>
                          <span className="expense-amt">₹{e.amount.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="date-total">₹{selectedDateData.total.toFixed(2)}</div>
                    </div>
                    <div className="note-section">
                      <label>Add Note</label>
                      <textarea
                        placeholder="Add notes for this day..."
                        value={dayNotes[selectedDate] || ""}
                        onChange={(e) => handleAddNote(selectedDate, e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Daily List */}
              <div className="daily-list">
                <h3>💸 Daily Breakdown</h3>
                <div className="daily-items">
                  {sortedDays.map((day) => (
                    <div
                      key={day.date}
                      className={`daily-item ${selectedDate === day.date ? "active" : ""}`}
                      onClick={() => setSelectedDate(selectedDate === day.date ? null : day.date)}
                    >
                      <div className="daily-date">
                        {new Date(day.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      </div>
                      <div className="daily-items-count">{day.items.length} expense(s)</div>
                      <div className="daily-amount">₹{day.total.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Category Analysis View */}
          {view === "category" && (
            <div className="category-view">
              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Expenses by Category (This Month)</h3>
                  {Object.keys(categoryData).length > 0 ? (
                    <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: true }} />
                  ) : (
                    <p className="no-data">No expenses this month</p>
                  )}
                </div>
                <div className="chart-card">
                  <h3>Monthly Trend</h3>
                  {months.length > 0 ? (
                    <Bar data={barData} options={{ responsive: true, maintainAspectRatio: true, indexAxis: undefined }} />
                  ) : (
                    <p className="no-data">No expense history</p>
                  )}
                </div>
              </div>

              <div className="category-breakdown">
                <h3>Category Summary</h3>
                <table className="data-table">
                  <thead>
                    <tr><th>Category</th><th>Amount</th><th>% of Total</th></tr>
                  </thead>
                  <tbody>
                    {Object.entries(categoryData)
                      .sort(([, a], [, b]) => b - a)
                      .map(([cat, amt]) => {
                        const total = Object.values(categoryData).reduce((s, x) => s + x, 0);
                        const pct = total > 0 ? ((amt / total) * 100).toFixed(1) : 0;
                        return (
                          <tr key={cat}>
                            <td>{cat}</td>
                            <td>₹{amt.toFixed(2)}</td>
                            <td>{pct}%</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Daily Details View */}
          {view === "day" && (
            <div className="day-view">
              <h3>All Expenses (Sorted by Date)</h3>
              <table className="data-table">
                <thead>
                  <tr><th>Date</th><th>Category</th><th>Title</th><th>Amount</th></tr>
                </thead>
                <tbody>
                  {expenses
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((e, idx) => (
                      <tr key={idx}>
                        <td>{new Date(e.date).toLocaleDateString()}</td>
                        <td>{e.category?.name || "-"}</td>
                        <td>{e.title}</td>
                        <td>₹{e.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

