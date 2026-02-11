import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { firAPI } from '../services/api';
import socketService from '../services/socket';
import toast from 'react-hot-toast';
import FIRCard from './FIRCard';
import CreateFIRModal from './CreateFIRModal';
import Navbar from './Navbar';
import './Dashboard.css';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchFIRs();
    
    // Connect to socket
    socketService.connect();

    // Listen for real-time updates
    socketService.onFIRUpdated((updatedFIR) => {
      setFirs((prevFirs) =>
        prevFirs.map((fir) =>
          fir._id === updatedFIR._id ? updatedFIR : fir
        )
      );
      toast.success('FIR status updated!', {
        icon: '🔔',
      });
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchFIRs = async () => {
    try {
      const response = await firAPI.getAllFIRs();
      setFirs(response.data);
    } catch (error) {
      toast.error('Failed to load FIRs');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    socketService.disconnect();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleCreateFIR = async (firData) => {
    try {
      const response = await firAPI.createFIR(firData);
      setFirs([response.data, ...firs]);
      setShowCreateModal(false);
      toast.success('FIR filed successfully!');
    } catch (error) {
      toast.error('Failed to create FIR');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="dashboard-content container">
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Welcome, {user.name}</h1>
            <p>Track and manage your FIR submissions</p>
          </div>
          <motion.button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            File New FIR
          </motion.button>
        </motion.div>

        <div className="stats-grid">
          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon" style={{ background: 'rgba(255, 107, 53, 0.15)' }}>
              <FileText size={24} color="var(--primary-orange)" />
            </div>
            <div>
              <p className="stat-label">Total FIRs</p>
              <h2 className="stat-value">{firs.length}</h2>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
              <Bell size={24} color="var(--warning)" />
            </div>
            <div>
              <p className="stat-label">Active Cases</p>
              <h2 className="stat-value">
                {firs.filter((fir) => !fir.isClosed).length}
              </h2>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <FileText size={24} color="var(--success)" />
            </div>
            <div>
              <p className="stat-label">Closed Cases</p>
              <h2 className="stat-value">
                {firs.filter((fir) => fir.isClosed).length}
              </h2>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="firs-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="section-title">Your FIRs</h2>
          
          {firs.length === 0 ? (
            <div className="empty-state">
              <FileText size={64} color="var(--text-secondary)" />
              <h3>No FIRs Filed Yet</h3>
              <p>Click the button above to file your first FIR</p>
            </div>
          ) : (
            <div className="firs-grid">
              <AnimatePresence>
                {firs.map((fir, index) => (
                  <FIRCard key={fir._id} fir={fir} index={index} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreateFIRModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateFIR}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientDashboard;
