import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";  // Fixed: was { data, useNavigate }
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";    
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Add expenses state - this was missing!
  const [expenses, setExpenses] = useState([]);

  // Totals state
  const [todayTotal, setTodayTotal] = useState(0);
  const [yesterdayTotal, setYesterdayTotal] = useState(0);
  const [last7DaysTotal, setLast7DaysTotal] = useState(0);
  const [last30DaysTotal, setLast30DaysTotal] = useState(0);
  const [currentYearTotal, setCurrentYearTotal] = useState(0);
  const [overallTotal, setOverallTotal] = useState(0);

  const [UserName, setUserName] = useState(
    localStorage.getItem("UserName") || "User"
  );

  // Fixed pieData2 - now uses expenses state and correct structure
  const pieData2 = {
    labels: expenses.map(expense => expense.item),
    datasets: [
      {
        label: 'Expense Distribution',
        data: expenses.map(expense => expense.amount),
        backgroundColor: expenses.map((_, index) => `hsl(${index * 60}, 70%, 50%)`),
      }
    ]
  };

  const pieData = {
    labels: [
      "Today's Expense",
      "Yesterday's Expense",
      "Last 7 Days Expense",
      "Last 30 Days Expense",
      "Current Year Expense", 
    ],
    datasets: [
      {
        data: [
          todayTotal,
          yesterdayTotal,
          last7DaysTotal,
          last30DaysTotal,
          currentYearTotal,
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };  

  // Normalize date
  const normalizeToStartOfDay = useCallback((date) => {
    if (!date) return null;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  // Parse expense date safely
  const parseExpenseDate = useCallback(
    (dateStr) => {
      if (!dateStr) return null;
      return normalizeToStartOfDay(dateStr);
    },
    [normalizeToStartOfDay]
  );

  // Calculate expense totals with debug logs
  const computeTotals = useCallback(
    (items) => {
      if (!items || items.length === 0) {
        toast.info("No expenses found for your account.");
        setTodayTotal(0);
        setYesterdayTotal(0);
        setLast7DaysTotal(0);
        setLast30DaysTotal(0);
        setCurrentYearTotal(0);
        setOverallTotal(0);
        return;
      }

      const today = normalizeToStartOfDay(new Date());
      const yesterdayStart = today - 86400000;
      const yesterdayEnd = today - 1;

      const last7Start = today - 7 * 86400000;
      const last30Start = today - 30 * 86400000;
      const startYear = normalizeToStartOfDay(
        new Date(new Date().getFullYear(), 0, 1)
      );

      let todaySum = 0;
      let yesterdaySum = 0;
      let last7Sum = 0;
      let last30Sum = 0;
      let yearSum = 0;
      let overallSum = 0;

      items.forEach((exp) => {
        let d = parseExpenseDate(exp.date);

        if (d === null) {
          console.warn("Skipping expense with invalid date:", exp);
          return;
        }

        d = normalizeToStartOfDay(new Date(d));
        const amount = parseFloat(exp.amount) || 0;

        overallSum += amount;

        if (d === today) {
          todaySum += amount;
        }

        if (d >= yesterdayStart && d <= yesterdayEnd) {
          yesterdaySum += amount;
        }

        if (d >= last7Start && d < today) {
          last7Sum += amount;
        }

        if (d >= last30Start && d < today) {
          last30Sum += amount;
        }

        if (d >= startYear && d <= today) {
          yearSum += amount;
        }
      });

      setTodayTotal(todaySum);
      setYesterdayTotal(yesterdaySum);
      setLast7DaysTotal(last7Sum);
      setLast30DaysTotal(last30Sum);
      setCurrentYearTotal(yearSum);
      setOverallTotal(overallSum);

      console.log("Expenses totals computed:", {
        todaySum,
        yesterdaySum,
        last7Sum,
        last30Sum,
        yearSum,
        overallSum,
      });
    },
    [normalizeToStartOfDay, parseExpenseDate]
  );

  // Verify login and set username
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const user_name = localStorage.getItem("UserName");

    if (!user_id) {
      toast.error("Please login to access the dashboard.");
      navigate("/login");
      return;
    }
    if (user_name) setUserName(user_name);
  }, [navigate]);

  // Fetch expenses from backend
  const fetchExpenses = useCallback(
    async (user_id) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/manage_expense/${user_id}/`
        );
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          toast.error(err.message || "Failed to fetch expenses");
          return;
        }
        const data = await response.json();

        console.log("Raw API response:", data);

        const items = (data.expenses || []).map((e) => ({
          id: e.id,
          date: e.ExpenseDate,
          amount: parseFloat(e.ExpenseAmount) || 0,
          item: e.ExpenseItem,
        }));

        console.log("Parsed expenses:", items);

        // FIXED: Save to state AND compute totals
        setExpenses(items);
        computeTotals(items);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("An error occurred while fetching expenses.");
      }
    },
    [computeTotals]
  );

  // Load expenses on mount
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (user_id) fetchExpenses(user_id);
  }, [fetchExpenses]);

  return (
    <div className="container text-center mt-5">
      <ToastContainer />
      <h1>
        Welcome to your Dashboard, <span className="text-primary">{UserName}</span>
      </h1>

      <p className="text-muted">Here's a quick overview of your account and recent activity.</p>

      <div className="mt-5">
        <div className="row">
          {[
            {
              title: "Today's Expense",
              icon: "fa-calendar-day",
              bg: "bg-primary",
              amount: todayTotal,
            },
            {
              title: "Yesterday's Expense",
              icon: "fa-calendar-alt",
              bg: "bg-success",
              amount: yesterdayTotal,
            },
            {
              title: "Last 7 Days Expense",
              icon: "fa-calendar-week",
              bg: "bg-warning",
              amount: last7DaysTotal,
            },
            {
              title: "Last 30 Days Expense",
              icon: "fa-calendar",
              bg: "bg-danger",
              amount: last30DaysTotal,
            },
            {
              title: "Current Year Expense",
              icon: "fa-calendar-check",
              bg: "bg-info",
              amount: currentYearTotal,
            },
            {
              title: "Total Expense",
              icon: "fa-wallet",
              bg: "bg-secondary",
              amount: overallTotal,
            },
          ].map(({ title, icon, bg, amount }, idx) => (
            <div key={idx} className="col-md-4 mb-3">
              <div className={`card shadow-sm`}>
                <div className={`card-body ${bg} text-white`}>
                  <h5 className="card-title">
                    <i className={`fa-solid ${icon}`}></i> {title}
                  </h5>
                  <p className="card-text display-6">
                    ₹
                    {amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 row">
          <div className="col-md-6">
        <h3><u>Expense Distribution</u></h3>
        <div className="d-flex justify-content-center mt-4">
          <div style={{ width: "400px", height: "400px" }}>
            <Pie data={pieData} />
          </div>
        </div>
        </div>
        <div className="col-md-6 mt-4 mt-md-0">
        <h3><u>Expense Item Distribution</u></h3>
        <div className="d-flex justify-content-center mt-4">
          <div style={{ width: "400px", height: "400px" }}>
            {expenses.length > 0 ? (
              <Pie data={pieData2} />
            ) : (
              <p className="text-muted">No expense items to display yet.</p>
            )}
          </div>
        </div>
        </div>
        </div>
      <div className="mt-5">
        <h5>&copy; {new Date().getFullYear()} Daily Expense Tracker. All rights reserved.</h5>
      </div>

      <div className="mb-5">
        <h6>
          Developed by{" "}
          <i className="fa-solid fa-heart" style={{ color: "#ff0000" }}></i> Manish
          Mahato
        </h6>
      </div>
    </div>
  );
};

export default Dashboard;
