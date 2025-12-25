// React ChangePassword component
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        if (!userId) {
            toast.error('Please login to change your password.');
            navigate('/login');
        }
    }, [userId, navigate]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New Password and Confirm Password do not match.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/change_password/${userId}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    old_password: formData.oldPassword,
                    new_password: formData.newPassword,
                    confirm_password: formData.confirmPassword
                }),
            });

            if (response.status === 200) {
                toast.success("Change Password Successful! Please login again.");
                setTimeout(() => navigate('/login'), 2000);
            } else {
                const data = await response.json();
                toast.error(data.message || "Change Password failed");
            }
        } catch {
            toast.error("An error occurred during Change Password. Please try again later.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <div className="text-center mb-5">
                <h1><i className="fa-solid fa-key" style={{ color: "#74C0FC" }}></i> Change Password</h1>
                <p className="text-muted">Change your password to keep your account secure.</p>
            </div>
            <form className="p-5 rounded shadow mx-auto" style={{ maxWidth: '800px' }} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="oldPassword" className="form-label">Old Password</label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="fa-solid fa-lock" style={{ color: '#74C0FC' }}></i>
                        </span>
                    <input
                        type="password"
                        className="form-control"
                        id="oldPassword"
                        name="oldPassword"
                        placeholder='Old Password'
                        value={formData.oldPassword}
                        onChange={handleChange}
                        required
                    />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="fa-solid fa-lock-open" style={{ color: '#74C0FC' }}></i>
                        </span>
                        <input
                            type="password"
                            className="form-control"
                            id="newPassword"
                            name="newPassword"
                            placeholder='New Password'
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="fa-solid fa-lock-open" style={{ color: '#74C0FC' }}></i>
                        </span>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder='Confirm New Password'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100"><i className='fa-solid fa-key me-2'></i>  Change Password</button>


            </form>
              <div className='mt-5'>
        <h5>&copy; 2025 Daily Expense Tracker. All rights reserved.</h5>
      </div>
      <div className='mb-5'>
        <h6>Developed by <i className="fa-solid fa-heart fa-x" style={{ color: "#ff0000" }}></i>Manish Mahato</h6>
      </div>
            <ToastContainer />
        </div>
    );
};

export default ChangePassword;
