import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, AlertCircle } from 'lucide-react';
import './Modal.css';

const CreateFIRModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Theft',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <FileText size={24} />
            <h2>File New FIR</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label htmlFor="title">FIR Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a brief title for your FIR"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Theft">Theft</option>
              <option value="Assault">Assault</option>
              <option value="Fraud">Fraud</option>
              <option value="Cybercrime">Cybercrime</option>
              <option value="Missing Person">Missing Person</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about the incident"
              rows="5"
              required
            />
          </div>

          <div className="info-box">
            <AlertCircle size={20} />
            <p>Your FIR will be assigned to an inspector shortly. You'll receive real-time updates on the progress.</p>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Filing...' : 'File FIR'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateFIRModal;
