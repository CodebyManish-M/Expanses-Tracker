import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'  

const ManageExpensc = () => {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [formData, setFormData] = useState({
    ExpenseDate: '',
    ExpenseItem: '',
    ExpenseAmount: '',
  })
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const fetchExpenses = async (user_id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/manage_expense/${user_id}/`)
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        toast.error(err.message || 'Failed to fetch expenses')
        return
      }
      const data = await response.json()

      // normalize id field so frontend always has `id`
      const items = (data.expenses || data || []).map((e) => ({
        ...e,
        id: e.id ?? e.pk ?? e.ID ?? e.ExpenseId ?? e.expense_id ?? e.pk_id,
      }))

      // debug: remove or comment out in production
      console.debug('fetched expenses (normalized):', items)

      setExpenses(items)
    } catch (error) {
      console.error('Error fetching expenses:', error)
      toast.error('An error occurred while fetching expenses.')
    }
  }

  useEffect(() => {
    const user_id = localStorage.getItem('user_id')
    if (!user_id) {
      toast.error('Please login to manage expenses.')
      navigate('/login')
      return
    }
    fetchExpenses(user_id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdate = (expense) => {
    setEditingId(expense.id)
    setFormData({
      ExpenseDate: expense.ExpenseDate || '',
      ExpenseItem: expense.ExpenseItem || '',
      ExpenseAmount: expense.ExpenseAmount || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!editingId) {
      toast.error('No expense selected for editing')
      return
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/update_expense/${editingId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        toast.error(err.message || 'Failed to update expense')
        return
      }

      toast.success('Expense updated successfully')
      closeModal()

      // Refresh the expenses list
      const user_id = localStorage.getItem('user_id')
      if (user_id) fetchExpenses(user_id)
    } catch (error) {
      console.error('Error updating expense:', error)
      toast.error('An error occurred while updating the expense.')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({
      ExpenseDate: '',
      ExpenseItem: '',
      ExpenseAmount: '',
    })
  }

  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Invalid expense ID')
      return
    }

    if (!window.confirm('Are you sure you want to delete this expense?')) {
      toast.info('Delete cancelled')
      return
    }

    const toastId = toast.loading('Deleting expense...')

    try {
      console.log('Deleting expense with ID:', id)

      const response = await fetch(`http://127.0.0.1:8000/api/delete_expense/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('Delete response status:', response.status)

      const data = await response.json().catch(() => ({}))
      console.log('Delete response data:', data)

      if (!response.ok) {
        toast.update(toastId, {
          render: data.message || `Failed to delete expense (Status: ${response.status})`,
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        })
        return
      }

      setExpenses((prev) => prev.filter((exp) => exp.id !== id))

      toast.update(toastId, {
        render: 'Expense deleted successfully',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      })
    } catch (err) {
      console.error('Delete error:', err)
      toast.update(toastId, {
        render: 'Network error while deleting expense',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      })
    }
  }

  const formatAmount = (amt) => {
    const n = Number(amt)
    return isNaN(n) ? '—' : `₹${n.toFixed(2)}`
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '80%' }}>
      <div className="text-center mb-5">
        <h1>
          <i className="fa-solid fa-list-check" style={{ color: '#74C0FC' }}></i> Manage Expense
        </h1>
        <p className="text-muted">View, edit or delete your expenses.</p>
      </div>

      <ToastContainer position="top-center" />

      <div className="alert alert-info text-center" role="alert">
        <i className="fa-solid fa-circle-info me-2"></i>
        This feature is under development. Please check back later!
      </div>

      <table className="table table-striped text-center table-bordered">
        <thead className="table-primary">
          <tr>
            <th>Sno.</th>
            <th>Date</th>
            <th>Item</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <tr key={expense.id || index}>
                <td>{index + 1}</td>
                <td>{expense.ExpenseDate || '—'}</td>
                <td>{expense.ExpenseItem || '—'}</td>
                <td>{formatAmount(expense.ExpenseAmount)}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleUpdate(expense)}>
                    <i className="fa-solid fa-edit"></i> Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(expense.id)}>
                    <i className="fa-solid fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                <i className="fa-solid fa-exclamation-circle me-1"></i>No expenses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
        <div className='mt-5'>
        <h5>&copy; 2025 Daily Expense Tracker. All rights reserved.</h5>
      </div>
      <div className='mb-5'>
        <h6>Developed by <i className="fa-solid fa-heart fa-x" style={{ color: "#ff0000" }}></i>Manish Mahato</h6>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(14,13,13,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Edit Expense</h5>
                <button type="button" className="btn-close text-white" onClick={closeModal} />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label className="form-label">Expense Date</label>
                    <div className="input-group">
                      <span className="input-group-text" id="basic-addon1">
                        <i className="fa-solid fa-calendar-alt" style={{ color: '#74C0FC' }}></i>
                      </span>
                      <input type="date" name="ExpenseDate" className="form-control" onChange={handleChange} value={formData.ExpenseDate} />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label mt-3">Expense Item</label>
                    <div className="input-group">
                      <span className="input-group-text" id="basic-addon1">
                        <i className="fa-solid fa-shopping-cart" style={{ color: 'rgba(116,192,252,1)' }}></i>
                      </span>
                      <input type="text" name="ExpenseItem" className="form-control" value={formData.ExpenseItem} onChange={handleChange} required placeholder="e.g., Groceries" />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label mt-3">Expense Amount</label>
                    <div className="input-group">
                      <span className="input-group-text" id="basic-addon1">
                        <i className="fa-solid fa-indian-rupee-sign" style={{ color: '#74C0FC' }}></i>
                      </span>
                      <input type="number" name="ExpenseAmount" className="form-control" value={formData.ExpenseAmount} onChange={handleChange} required step="0.01" />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">Save changes</button>
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          
        </div>
        
      )}
    </div>
  )
}

export default ManageExpensc
