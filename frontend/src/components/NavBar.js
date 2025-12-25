import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');
    const handleLogout = () => {
        localStorage.removeItem('user_id');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg bg-primary navbar-dark px-4">
            <div className="container-fluid">
                <h2>
                    <Link className="navbar-brand" to="/">
                        <i className="fa-solid fa-wallet fa-lg"></i> Expense Tracker
                    </Link>
                </h2>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">
                                <i className="fa-solid fa-home fa-lg"></i> Home
                            </Link>
                        </li>

                        {userId ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">
                                        <i className="fa-solid fa-gauge-high fa-lg"></i> Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/addexpense">
                                        <i className="fa-solid fa-circle-plus fa-lg"></i> Add Expense
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/manageexpense">
                                        <i className="fa-solid fa-list-check fa-lg"></i> Manage Expenses
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/expensereport">
                                        <i className="fa-solid fa-file-alt fa-lg"></i> Expense Report
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/changepassword">
                                        <i className="fa-solid fa-key fa-lg"></i> Change password
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    {/* use a button for logout to avoid navigating to a non-existent route */}
                                    <button
                                        type="button"
                                        className="nav-link btn btn-link text-decoration-none"
                                        onClick={handleLogout}
                                    >
                                        <i className="fa-solid fa-right-from-bracket fa-lg"></i> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup">
                                        <i className="fa-solid fa-user-plus fa-lg"></i> SignUp
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        <i className="fa-solid fa-arrow-right-to-bracket fa-lg"></i> LogIn
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
