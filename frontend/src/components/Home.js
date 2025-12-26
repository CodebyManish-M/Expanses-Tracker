import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const userId = localStorage.getItem("user_id");

  return (
    <div className='container text-center mt-5'>
            <img src={photo1} alt="Banner" style={{ width: '300px', height: 'auto' }} />
      <h1>Welcome to <span className='text-primary'>Daily Expense Tracker</span></h1>
      <p className='lead'>Your personal expense management solution.</p>
      <div className='mt-4'>
        <i className="fa-solid fa-wallet fa-10x text-primary fa-beat-fade"></i>
      </div>
      <div className='mt-4'>
        <h3>Track your expenses effortlessly and stay within your budget!</h3>
        <h4>Join us today to take control of your finances.</h4>
        <h4>Manage your expenses anytime, anywhere.</h4>
        <h4>Secure and user-friendly platform.</h4>
        <h3 className='text-primary'>Simple  Efficient Reliable.</h3>
      </div>
      <div className='mt-4'>
        {
          userId ? (
            <><Link to="/Dashboard" className='btn btn-outline-success btn-lg ms-3'> <i className='fa-solid fa-gauge'></i>  Go TO Dashboard</Link></>
          ) : (<><Link to="/signup" className='btn btn-primary btn-lg me-3'>Get Started</Link>
            <Link to="/login" className='btn btn-outline-primary btn-lg'>Login</Link></>)
        }
      </div>
      <div className='mt-5'>
        <h4>Features:</h4>
        <ul className='list-unstyled'>
          <li><i className="fa-solid fa-check text-success me-2"></i>Easy Expense Logging</li>
          <li><i className="fa-solid fa-check text-success me-2"></i>Comprehensive Dashboard</li>
          <li><i className="fa-solid fa-check text-success me-2"></i>Detailed Expense Reports</li>
          <li><i className="fa-solid fa-check text-success me-2"></i>Secure User Authentication</li>
        </ul>
      </div>
      <div className='mt-5'>
        <h5>&copy; 2025 Daily Expense Tracker. All rights reserved.</h5>
      </div>
      <div className='mb-5'>
        <h6>Developed by <i className="fa-solid fa-heart fa-x" style={{ color: "#ff0000" }}></i>Manish Mahato</h6>
      </div>



    </div>
  )
}

export default Home
