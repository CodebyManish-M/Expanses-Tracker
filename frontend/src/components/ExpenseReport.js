import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ExpenseReport = () => {
    const navigate = useNavigate()
    const user_id = localStorage.getItem('user_id')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(false)
    const [grandTotal, setGrandTotal] = useState(0)

    // Redirect to login if not logged in
    useEffect(() => {
        if (!user_id) {
            toast.error('Please login to view your expenses.')
            navigate('/login')
        }
    }, [user_id, navigate])

    // Handle Search Submit
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!fromDate || !toDate) {
            toast.error('Please select both dates.')
            return
        }

        if (fromDate > toDate) {
            toast.error('From date cannot be later than To date.')
            return
        }

        setLoading(true)
        setExpenses([])

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/search_expense/${user_id}/?from=${fromDate}&to=${toDate}`,
                { method: 'GET' }
            )

            const data = await response.json()

            if (response.ok) {
                setExpenses(data.expenses || [])
                setGrandTotal(data.total || 0)
                toast.success('Expenses fetched successfully!')
            } else {
                toast.error(data.message || 'Failed to fetch expenses')
            }
        } catch (error) {
            console.error('Error fetching expenses:', error)
            toast.error('An error occurred. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mt-5">
            <div className="text-center mb-5">
                <h1>
                    <i className="fas fa-file-invoice-dollar" style={{ color: '#74C0FC' }}></i>{' '}
                    Datewise Expense Report
                </h1>
                <p className="text-muted">Search and view your expenses by date range</p>
            </div>

            {/* Search Form */}
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fa-solid fa-calendar-alt" style={{ color: '#74C0FC' }}></i>
                        </span>
                        <input
                            type="date"
                            className="form-control"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            required
                            max={toDate || undefined}
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fa-solid fa-calendar-alt" style={{ color: '#74C0FC' }}></i>
                        </span>
                        <input
                            type="date"
                            className="form-control"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            required
                            min={fromDate || undefined}
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        <i className="fa-solid fa-search me-2"></i>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {/* Expense Table */}
            {!loading && expenses.length > 0 && (
                <div className="mt-5">
                    <h3 className='text-center'><i className='fa'></i><u>Expense Results</u></h3>
                    <table className="table table-striped mt-3 table-bordered">
                        <thead className="table-primary">
                            <tr>
                                <th>S.No</th>
                                <th>Date</th>
                                <th>Item</th>
                                <th>Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense, index) => (
                                <tr key={expense.id ?? index}>
                                    <td>{index + 1}</td>
                                    <td>{new Date(expense.ExpenseDate).toLocaleDateString()}</td>
                                    <td>{expense.ExpenseItem}</td>
                                    <td>₹{Number(expense.ExpenseAmount).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className='text-end fw-bold' colspan="3">
                                    Grand Total:{' '}</td>
                                <td className='fw-bold text-success'> ₹{Number(grandTotal).toFixed(2)}</td>

                            </tr>
                        </tfoot>
                    </table>

                </div>
            )}

            {/* No Data Message */}
            {!loading && expenses.length === 0 && (
                <p className="text-center text-muted mt-5">No expenses found for the selected date range.</p>
            )}

            <ToastContainer />
            
              <div className='mt-5'>
        <h5>&copy; 2025 Daily Expense Tracker. All rights reserved.</h5>
      </div>
      <div className='mb-5'>
        <h6>Developed by <i className="fa-solid fa-heart fa-x" style={{ color: "#ff0000" }}></i>Manish Mahato</h6>
      </div>
        </div>
    )
}

export default ExpenseReport
