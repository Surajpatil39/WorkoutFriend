import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminPanel = ({ token }) => {
  const [stats, setStats] = useState({ userCount: 0, trainerCount: 0, bookingCount: 0 });
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, trainersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/admin/trainers', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setTrainers(trainersRes.data);
      } catch (err) {
        console.error('Admin fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return <div className="wb-loading">Loading control center...</div>;

  return (
    <div className="wb-admin">
      <nav className="wb-app-header">
        <Link to="/" className="wb-brand" aria-label="Workout Buddy home">
          <span className="wb-brand-mark">WB</span>
          <span className="wb-brand-copy">Workout Buddy // 01</span>
        </Link>
        <Link to="/dashboard" className="wb-header-button">Training desk</Link>
      </nav>
      <div className="wb-admin-inner">
        <div className="wb-admin-head">
          <div>
            <p className="wb-eyebrow">Admin // System status</p>
            <motion.h1 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="wb-admin-title"
        >
          Gym <span>control</span><br />center.
        </motion.h1>
          </div>
          <p>Monitor the member base, trainer roster, and booked sessions from one focused operating view.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
          {[
            { label: 'Total Members', value: stats.userCount, color: 'bg-blue-500' },
            { label: 'Active Trainers', value: stats.trainerCount, color: 'bg-green-500' },
            { label: 'Total Bookings', value: stats.bookingCount, color: 'bg-purple-500' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`wb-stat-card p-7 text-white ${stat.color}`}
            >
              <p className="text-sm font-bold uppercase opacity-80">{stat.label}</p>
              <p className="text-5xl font-black">{stat.value}</p>
            </motion.div>
          ))}
        </div >

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
            <h3 className="text-2xl font-bold mb-6">Member Directory</h3>
            <div className="space-y-4 overflow-y-auto max-h-96">
              {users.map(u => (
                <div key={u._id} className="flex justify-between items-center p-4 bg-slate-900 rounded-xl border border-slate-700">
                  <div>
                    <p className="font-bold">{u.name}</p>
                    <p className="text-slate-400 text-xs">{u.email}</p>
                  </div >
                  <span className="text-xs bg-slate-700 px-2 py-1 rounded uppercase font-bold">{u.role}</span>
                </div >
              ))}
            </div >
          </div >

          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
            <h3 className="text-2xl font-bold mb-6">Trainer Roster</h3>
            <div className="space-y-4 overflow-y-auto max-h-96">
              {trainers.map(t => (
                <div key={t._id} className="flex justify-between items-center p-4 bg-slate-900 rounded-xl border border-slate-700">
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-yellow-400 text-xs">{t.specialty}</p>
                  </div >
                  <p className="text-slate-400 text-xs">{t.experience} Years Exp</p>
                </div >
              ))}
            </div >
          </div >
        </div >
      </div >
    </div >
  );
};

export default AdminPanel;
