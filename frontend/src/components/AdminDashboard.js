import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, CheckCircle, Clock, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { firAPI } from '../services/api';
import socketService from '../services/socket';
import toast from 'react-hot-toast';
import Navbar from './Navbar';
import './Dashboard.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [firs, setFirs] = useState([]);
  const [stats, setStats] = useState({
    totalFIRs: 0,
    openFIRs: 0,
    closedFIRs: 0,
    underInvestigation: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
    
    socketService.connect();

    socketService.onFIRCreated((newFIR) => {
      setFirs((prevFirs) => [newFIR, ...prevFirs]);
      fetchStats();
      toast.success('New FIR filed!', { icon: '📝' });
    });

    socketService.onFIRListUpdated((updatedFIR) => {
      setFirs((prevFirs) =>
        prevFirs.map((fir) =>
          fir._id === updatedFIR._id ? updatedFIR : fir
        )
      );
      fetchStats();
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchFIRs(), fetchStats()]);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFIRs = async () => {
    const response = await firAPI.getAllFIRs();
    setFirs(response.data);
  };

  const fetchStats = async () => {
    const response = await firAPI.getStats();
    setStats(response.data);
  };

  const handleLogout = () => {
    logout();
    socketService.disconnect();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const getFilteredFIRs = () => {
    switch (filter) {
      case 'open':
        return firs.filter(fir => !fir.isClosed);
      case 'closed':
        return firs.filter(fir => fir.isClosed);
      case 'investigation':
        return firs.filter(fir => fir.status === 'Under Investigation');
      default:
        return firs;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'var(--success)',
      'Medium': 'var(--warning)',
      'High': 'var(--error)',
      'Critical': '#dc2626',
    };
    return colors[priority] || 'var(--text-secondary)';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
            <h1>Admin Dashboard</h1>
            <p>Manage and track all FIRs in the system</p>
          </div>
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
              <h2 className="stat-value">{stats.totalFIRs}</h2>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)' }}>
              <Clock size={24} color="var(--warning)" />
            </div>
            <div>
              <p className="stat-label">Open Cases</p>
              <h2 className="stat-value">{stats.openFIRs}</h2>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
              <CheckCircle size={24} color="var(--success)" />
            </div>
            <div>
              <p className="stat-label">Closed Cases</p>
              <h2 className="stat-value">{stats.closedFIRs}</h2>
            </div>
          </motion.div>

          <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
              <Users size={24} color="#3b82f6" />
            </div>
            <div>
              <p className="stat-label">Under Investigation</p>
              <h2 className="stat-value">{stats.underInvestigation}</h2>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="admin-table-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="table-header">
            <h2 className="section-title">All FIRs</h2>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
                onClick={() => setFilter('open')}
              >
                Open
              </button>
              <button
                className={`filter-btn ${filter === 'investigation' ? 'active' : ''}`}
                onClick={() => setFilter('investigation')}
              >
                Investigation
              </button>
              <button
                className={`filter-btn ${filter === 'closed' ? 'active' : ''}`}
                onClick={() => setFilter('closed')}
              >
                Closed
              </button>
            </div>
          </div>

          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>FIR Number</th>
                  <th>Client</th>
                  <th>Title</th>
                  <th>Inspector</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredFIRs().map((fir) => (
                  <motion.tr
                    key={fir._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'var(--card-hover)' }}
                  >
                    <td className="fir-number-cell">{fir.firNumber}</td>
                    <td>{fir.clientName}</td>
                    <td className="title-cell">{fir.title}</td>
                    <td>{fir.inspectorName}</td>
                    <td>
                      <span
                        className="priority-badge"
                        style={{ 
                          background: `${getPriorityColor(fir.priority)}20`,
                          color: getPriorityColor(fir.priority)
                        }}
                      >
                        {fir.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${fir.isClosed ? 'closed' : 'open'}`}>
                        {fir.status}
                      </span>
                    </td>
                    <td>{formatDate(fir.createdAt)}</td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => navigate(`/admin/fir/${fir._id}`)}
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
