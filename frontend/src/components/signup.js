import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        FullName: '',
        Email: '',
        Password: '',
        ConfirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const response = await fetch("http://127.0.0.1:8000/api/signup/", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.status === 200) {
                toast.success("Signup successful! Redirecting to login...");
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                const data = await response.json();
                toast.error(data.message || "Signup failed");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            toast.error("An error occurred during signup. Please try again later.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <div className="text-center mb-5">
                <h1>
                    <i className="fa-solid fa-user-plus" style={{ color: "#74C0FC" }}></i> SignUp
                </h1>
                <p className="text-muted">Create your account to start tracking expence.</p>
            </div>
            <form className="p-5 rounded shadow mx-auto" style={{ maxWidth: '800px' }} onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="form-label">Full Name</label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="fa-solid fa-user" style={{ color: "#74C0FC" }}></i>
                        </span>
                        <input
                            type="text"
                            name="FullName"
                            className="form-control"
                            onChange={handleChange}
                            value={formData.FullName}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>
                </div>
                <div className="mb-2">
                    <label className="form-label mt-3">Email</label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="fa-solid fa-envelope" style={{ color: "rgba(116, 192, 252, 1)" }}></i>
                        </span>
                        <input
                            type="email"
                            name="Email"
                            className="form-control"
                            value={formData.Email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                </div>
                <div className="mb-2">
                    <label className="form-label mt-3">Password</label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="fa-solid fa-lock" style={{ color: "#74C0FC" }}></i>
                        </span>
                        <input
                            type="password"
                            name="Password"
                            className="form-control"
                            value={formData.Password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                </div>
                <div className="mb-2">
                    <label className="form-label mt-3">Confirm Password</label>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                            <i className="fa-solid fa-lock" style={{ color: "#74C0FC" }}></i>
                        </span>
                        <input
                            type="password"
                            name="ConfirmPassword"
                            className="form-control"
                            value={formData.ConfirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>
                </div>
                <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary">   <i className="fa-solid fa-user-plus" style={{ color: "#f6f8faff" }}></i> SignUp</button>
                </div>
                <p className="text-center mt-3">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
              <div className='mt-5'>
        <h5>&copy; 2025 Daily Expense Tracker. All rights reserved.</h5>
      </div>
      <div className='mb-5'>
        <h6>Developed by <i className="fa-solid fa-heart fa-x" style={{ color: "#ff0000" }}></i>Manish Mahato</h6>
      </div>
            <ToastContainer />
        </div>
    )
}

export default SignUp
