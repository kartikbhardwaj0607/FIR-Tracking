import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Calendar, 
  Shield,
  Clock,
  CheckCircle,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { firAPI } from '../services/api';
import socketService from '../services/socket';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from './Navbar';
import './FIRDetail.css';

const FIRDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [fir, setFir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    inspectorName: '',
    inspectorBadge: '',
    priority: '',
    isClosed: false,
    documentsRequired: [],
  });

  useEffect(() => {
    fetchFIR();
    
    socketService.connect();
    socketService.joinFIRRoom(id);

    socketService.onFIRUpdated((updatedFIR) => {
      if (updatedFIR._id === id) {
        setFir(updatedFIR);
        toast.success('FIR updated in real-time!');
      }
    });

    return () => {
      socketService.leaveFIRRoom(id);
    };
  }, [id]);

  useEffect(() => {
    if (fir && !editing) {
      setFormData({
        status: fir.status,
        inspectorName: fir.inspectorName,
        inspectorBadge: fir.inspectorBadge,
        priority: fir.priority,
        isClosed: fir.isClosed,
        documentsRequired: fir.documentsRequired,
      });
    }
  }, [fir, editing]);

  const fetchFIR = async () => {
    try {
      const response = await firAPI.getFIRById(id);
      setFir(response.data);
    } catch (error) {
      toast.error('Failed to load FIR');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await firAPI.updateFIR(id, formData);
      setEditing(false);
      toast.success('FIR updated successfully!');
      fetchFIR();
    } catch (error) {
      toast.error('Failed to update FIR');
    }
  };

  const handleDocumentToggle = (index) => {
    const newDocs = [...formData.documentsRequired];
    newDocs[index].signed = !newDocs[index].signed;
    setFormData({ ...formData, documentsRequired: newDocs });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Filed': 'var(--primary-orange)',
      'Under Investigation': 'var(--warning)',
      'Documents Review': '#3b82f6',
      'Action Taken': '#8b5cf6',
      'Closed': 'var(--success)',
    };
    return colors[status] || 'var(--text-secondary)';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!fir) return null;

  return (
    <div className="fir-detail-page">
      <Navbar user={user} onLogout={logout} />

      <div className="fir-detail-content container">
        <motion.button
          className="back-btn"
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </motion.button>

        <div className="fir-detail-grid">
          <motion.div
            className="fir-main-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="fir-header-section">
              <div className="fir-number-badge">
                <FileText size={24} />
                <span>{fir.firNumber}</span>
              </div>
              {isAdmin && (
                <div className="edit-actions">
                  {editing ? (
                    <>
                      <motion.button
                        className="btn btn-primary btn-sm"
                        onClick={handleUpdate}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Save size={16} />
                        Save
                      </motion.button>
                      <motion.button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditing(false)}
                        whileHover={{ scale: 1.05 }}
                      >
                        <X size={16} />
                        Cancel
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      className="btn btn-primary btn-sm"
                      onClick={() => setEditing(true)}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Edit2 size={16} />
                      Edit
                    </motion.button>
                  )}
                </div>
              )}
            </div>

            <h1 className="fir-title-detail">{fir.title}</h1>
            <p className="fir-description-detail">{fir.description}</p>

            <div className="fir-meta-grid">
              <div className="meta-item">
                <User size={18} />
                <div>
                  <span className="meta-label">Client</span>
                  <span className="meta-value">{fir.clientName}</span>
                </div>
              </div>
              <div className="meta-item">
                <Calendar size={18} />
                <div>
                  <span className="meta-label">Filed On</span>
                  <span className="meta-value">{formatDate(fir.createdAt)}</span>
                </div>
              </div>
              <div className="meta-item">
                <FileText size={18} />
                <div>
                  <span className="meta-label">Category</span>
                  <span className="meta-value">{fir.category}</span>
                </div>
              </div>
            </div>

            <div className="status-section">
              <h3>Current Status</h3>
              {editing && isAdmin ? (
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="status-select"
                >
                  <option value="Filed">Filed</option>
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Documents Review">Documents Review</option>
                  <option value="Action Taken">Action Taken</option>
                  <option value="Closed">Closed</option>
                </select>
              ) : (
                <div className="status-display" style={{ borderColor: getStatusColor(fir.status) }}>
                  <div
                    className="status-icon"
                    style={{ background: getStatusColor(fir.status) }}
                  >
                    {fir.isClosed ? <CheckCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <span style={{ color: getStatusColor(fir.status) }}>{fir.status}</span>
                </div>
              )}
            </div>
          </motion.div>

          <div className="fir-sidebar">
            <motion.div
              className="sidebar-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3>
                <Shield size={20} />
                Inspector Details
              </h3>
              {editing && isAdmin ? (
                <>
                  <div className="input-group">
                    <label>Inspector Name</label>
                    <input
                      type="text"
                      value={formData.inspectorName}
                      onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>Badge Number</label>
                    <input
                      type="text"
                      value={formData.inspectorBadge}
                      onChange={(e) => setFormData({ ...formData, inspectorBadge: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="inspector-info">
                    <span className="info-label">Name</span>
                    <span className="info-value">{fir.inspectorName}</span>
                  </div>
                  <div className="inspector-info">
                    <span className="info-label">Badge</span>
                    <span className="info-value">{fir.inspectorBadge}</span>
                  </div>
                </>
              )}
            </motion.div>

            <motion.div
              className="sidebar-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3>Priority Level</h3>
              {editing && isAdmin ? (
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="priority-select"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              ) : (
                <div className={`priority-display priority-${fir.priority.toLowerCase()}`}>
                  {fir.priority}
                </div>
              )}
            </motion.div>

            <motion.div
              className="sidebar-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3>Documents Status</h3>
              <div className="documents-list">
                {formData.documentsRequired.map((doc, index) => (
                  <div key={index} className="document-item">
                    <span>{doc.name}</span>
                    {editing && isAdmin ? (
                      <input
                        type="checkbox"
                        checked={doc.signed}
                        onChange={() => handleDocumentToggle(index)}
                        className="doc-checkbox"
                      />
                    ) : (
                      <span className={`doc-status ${doc.signed ? 'signed' : 'pending'}`}>
                        {doc.signed ? 'Signed' : 'Pending'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="status-timeline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Status Timeline</h3>
          <div className="timeline">
            {fir.statusHistory.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <h4>{item.status}</h4>
                  <p>{item.description}</p>
                  <div className="timeline-meta">
                    <span>{item.updatedBy}</span>
                    <span>{formatDate(item.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FIRDetail;
