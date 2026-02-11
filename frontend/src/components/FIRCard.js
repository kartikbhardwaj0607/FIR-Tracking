import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  User, 
  Calendar, 
  Shield,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import './FIRCard.css';

const FIRCard = ({ fir, index }) => {
  const navigate = useNavigate();

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

  const getPriorityBadge = (priority) => {
    const badges = {
      'Low': 'badge-success',
      'Medium': 'badge-warning',
      'High': 'badge-error',
      'Critical': 'badge-error',
    };
    return badges[priority] || 'badge-primary';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      className="fir-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/fir/${fir._id}`)}
      whileHover={{ y: -5 }}
    >
      <div className="fir-card-header">
        <div className="fir-number">
          <FileText size={20} />
          <span>{fir.firNumber}</span>
        </div>
        <span className={`badge ${getPriorityBadge(fir.priority)}`}>
          {fir.priority}
        </span>
      </div>

      <h3 className="fir-title">{fir.title}</h3>
      <p className="fir-description">{fir.description}</p>

      <div className="fir-info">
        <div className="info-item">
          <Shield size={16} />
          <span>{fir.inspectorName}</span>
        </div>
        <div className="info-item">
          <Calendar size={16} />
          <span>{formatDate(fir.createdAt)}</span>
        </div>
      </div>

      <div className="fir-status">
        <div className="status-indicator" style={{ background: getStatusColor(fir.status) }}>
          {fir.isClosed ? <CheckCircle size={16} /> : <Clock size={16} />}
        </div>
        <span className="status-text">{fir.status}</span>
      </div>

      <div className="fir-progress">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(fir.statusHistory.length / 5) * 100}%` 
            }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            style={{ background: getStatusColor(fir.status) }}
          />
        </div>
        <span className="progress-text">
          {fir.statusHistory.length}/5 Updates
        </span>
      </div>
    </motion.div>
  );
};

export default FIRCard;
