import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddExpense = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        ExpenseDate: '',
        ExpenseItem: '',
        ExpenseAmount: '',
    })

    const user_id = localStorage.getItem('user_id')

    useEffect(() => {
        if (!user_id) {
            toast.error('Please login to add an expense.')
            navigate('/login')
        }
    }, [user_id, navigate])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.ExpenseDate || !formData.ExpenseItem || !formData.ExpenseAmount) {
            toast.error('Please fill all fields.')
            return
        }

        const payload = {
            UserId: Number(user_id),
            ExpenseDate: formData.ExpenseDate,
            ExpenseItem: formData.ExpenseItem,
            ExpenseAmount: parseFloat(formData.ExpenseAmount),
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/add_expense/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                toast.success('Expense added successfully!')
                setTimeout(() => navigate('/dashboard'), 1000)
            } else {
                const data = await response.json().catch(() => ({}))
                toast.error(data.message || 'Failed to add expense')
            }
        } catch (error) {
            console.error('Error adding expense:', error)
            toast.error('An error occurred. Please try again later.')
        }
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <div className="text-center mb-5">
                <h1>
                    <i className="fa-solid fa-plus-circle" style={{ color: '#74C0FC' }}></i> Add Expense
                </h1>
                <p className="text-muted">Track your new spending here</p>
            </div>

            <form className="p-5 rounded shadow mx-auto" style={{ maxWidth: '800px' }} onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="form-label">Expense Date</label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="fa-solid fa-calendar-alt" style={{ color: '#74C0FC' }}></i>
                        </span>
                        <input
                            type="date"
                            name="ExpenseDate"
                            className="form-control"
                            onChange={handleChange}
                            value={formData.ExpenseDate}
                            required
                        />
                    </div>
                </div>

                <div className="mb-2">
                    <label className="form-label mt-3">Expense Item</label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="fa-solid fa-shopping-cart" style={{ color: 'rgba(116, 192, 252, 1)' }}></i>
                        </span>
                        <input
                            type="text"
                            name="ExpenseItem"
                            className="form-control"
                            value={formData.ExpenseItem}
                            onChange={handleChange}
                            required
                            placeholder="Enter item name (e.g., Groceries, Rent)"
                        />
                    </div>
                </div>

                <div className="mb-2">
                    <label className="form-label mt-3">Expense Amount</label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="fa-solid fa-indian-rupee-sign" style={{ color: '#74C0FC' }}></i>
                        </span>
                        <input
                            type="number"
                            name="ExpenseAmount"
                            className="form-control"
                            value={formData.ExpenseAmount}
                            onChange={handleChange}
                            required
                            placeholder="Enter expense amount (in ₹)"
                            step="0.01"
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary mt-4 w-100">
                    <i className="fa-solid fa-plus me-2"></i> Add Expense
                </button>
            </form>
            

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

export default AddExpense