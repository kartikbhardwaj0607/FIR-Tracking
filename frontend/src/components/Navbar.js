import React from 'react';
import { motion } from 'framer-motion';
import { Shield, LogOut, User } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content container">
        <motion.div 
          className="navbar-brand"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="brand-icon">
            <Shield size={28} />
          </div>
          <div>
            <h2>FIR Tracker</h2>
            <p>Real-time Tracking System</p>
          </div>
        </motion.div>

        <motion.div 
          className="navbar-actions"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
          
          <motion.button
            className="btn btn-secondary"
            onClick={onLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
