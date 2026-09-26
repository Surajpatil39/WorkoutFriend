import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import WorkoutTracker from '../components/WorkoutTracker';
import BookingSystem from '../components/BookingSystem';
import NutritionTracker from '../components/NutritionTracker';
import CommunityFeed from '../components/CommunityFeed';
import ProfileModal from '../components/ProfileModal';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('workouts');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(user);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('workoutBuddyToken');
      const { data } = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileUser(data);
    } catch (err) {
      setProfileUser(user);
    }
  };

  const handleProfileUpdate = async () => {
    await fetchUserProfile();
  };

  if (!user) {
    return <div className="wb-loading">Loading your training desk...</div>;
  }

  const token = localStorage.getItem('workoutBuddyToken');

  return (
    <div className="wb-app">
      <nav className="wb-app-header">
        <Link to="/" className="wb-brand" aria-label="Workout Buddy home">
          <span className="wb-brand-mark">WB</span>
          <span className="wb-brand-copy">Workout Buddy // 01</span>
        </Link>
        <div className="wb-header-actions">
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="wb-user-button"
          >
            <div className="wb-user-initial">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <span>{user.name}</span>
          </button>
          {user.role === 'admin' && (
            <button 
              onClick={() => navigate('/admin')}
              className="wb-header-button"
            >
              Admin
            </button>
          )}
          <button 
            onClick={() => { logout(); navigate('/'); }} 
            className="wb-logout-button"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="wb-main">
        <section className="wb-dashboard-intro">
          <div>
            <p className="wb-eyebrow">Training Console // Live</p>
            <h1 className="wb-dashboard-title">Your <span>work.</span><br />Logged.</h1>
          </div>
          <p className="wb-dashboard-copy">Build momentum one session at a time. Track your training, nutrition, coaching, and community in one place.</p>
        </section>

        <div className="wb-tabs" role="tablist" aria-label="Training tools">
          {[
            { id: 'workouts', label: 'Workouts' },
            { id: 'booking', label: 'Book Trainer' },
            { id: 'nutrition', label: 'Nutrition' },
            { id: 'community', label: 'Community' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`wb-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="wb-panel-content"
        >
          {activeTab === 'workouts' && <WorkoutTracker token={token} />}
          {activeTab === 'booking' && <BookingSystem token={token} />}
          {activeTab === 'nutrition' && <NutritionTracker token={token} />}
          {activeTab === 'community' && <CommunityFeed token={token} user={user} />}
        </motion.div>
      </main>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={profileUser} 
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default Dashboard;
