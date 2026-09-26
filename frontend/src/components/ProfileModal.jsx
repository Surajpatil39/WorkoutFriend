import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    goal: user?.goal || '',
    weight: user?.weight || '',
    height: user?.height || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    injuries: user?.injuries || '',
    emergencyContact: user?.emergencyContact || '',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('workoutBuddyToken');
      await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error updating profile';
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-800 p-8 rounded-3xl border border-slate-700 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Your Profile Settings</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
        </div >
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-slate-400 text-sm">Full Name</label>
              <input 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div >
            <div className="space-y-1">
              <label className="block text-slate-400 text-sm">Phone Number</label>
              <input 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div >
            <div className="space-y-1">
              <label className="block text-slate-400 text-sm">Fitness Goal</label>
              <input 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400"
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
              />
            </div >
            <div className="space-y-1">
              <label className="block text-slate-400 text-sm">Gender</label>
              <select 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div >
            <div className="space-y-1">
              <label className="block text-slate-400 text-sm">Weight (kg)</label>
              <input 
                type="number"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
            </div >
            <div className="space-y-1">
              <label className="block text-slate-400 text-sm">Height (cm)</label>
              <input 
                type="number"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400"
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
              />
            </div >
          </div >

          <div className="space-y-1">
            <label className="block text-slate-400 text-sm">Previous Injuries / Medical History</label>
            <textarea 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400 h-24 resize-none"
              value={formData.injuries}
              onChange={(e) => setFormData({...formData, injuries: e.target.value})}
              placeholder="Any past injuries or conditions we should know about..."
            />
          </div >

          <div className="space-y-1">
            <label className="block text-slate-400 text-sm">Emergency Contact (Name & Phone)</label>
            <input 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
              placeholder="e.g. Jane Doe - +1 234 567 890"
            />
          </div >

          <div className="flex gap-3 mt-8">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all active:scale-95"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div >
        </form>
      </motion.div>
    </div >
  );
};

export default ProfileModal;
