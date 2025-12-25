import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const  Login= () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Email: '',
        Password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const response = await fetch("http://127.0.0.1:8000/api/login/", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.status === 200) {
                toast.success(" Login successful! ");
                localStorage.setItem('user_id',data.user_id);
                localStorage.setItem('UserName',data.UserName);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            } else {
                const data = await response.json();
                toast.error(data.message || "Signup failed");
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error("An error occurred during login. Please try again later.");
        }
    };
  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
                <div className="text-center mb-5">
                    <h1>
                        <i className="fa-solid fa-user" style={{ color: "#74C0FC" }}></i> Login
                    </h1>
                    <p className="text-muted">Access your expense dashboard</p>
                </div>
                <form className="p-5 rounded shadow mx-auto" style={{ maxWidth: '600px' }} onSubmit={handleSubmit}>
                 
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
                    
                    <div className="d-grid mt-4">
                        <button type="submit" className="btn btn-primary"> <i class="fa-solid fa-arrow-right-to-bracket" style={{color: "#74C0FC;"}}></i> Login</button>
                    </div>
                    <p className="text-center mt-3">
                        Create your account.  <a href="/SignUp">SignUp</a>
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
    
  

export default Login;
