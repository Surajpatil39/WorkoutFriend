import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', goal: ''
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, formData);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="wb-auth">
      <aside className="wb-auth-aside">
        <Link to="/" className="wb-brand">
          <span className="wb-brand-mark">WB</span>
          <span className="wb-brand-copy">Workout Buddy // 01</span>
        </Link>
        <div className="wb-auth-aside-copy">
          <p className="wb-eyebrow">The work starts here</p>
          <h1 className="wb-auth-aside-heading">Track.<br /><span>Train.</span><br />Repeat.</h1>
          <p>One focused system for the sessions, habits, and people that move your progress forward.</p>
        </div>
        <span className="wb-auth-aside-footer">14,000+ athletes in motion</span>
      </aside>
      <main className="wb-auth-main">
      <motion.section 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="wb-auth-panel"
      >
        <div className="wb-auth-topline">
          <span className="wb-eyebrow">Member access // 01</span>
          <Link to="/" className="wb-meta">← Back home</Link>
        </div>
        <h2 className="wb-auth-title">
          {isLogin ? <>Welcome <span>back.</span></> : <>Start the <span>work.</span></>}
        </h2>
        <p className="wb-auth-subtitle">{isLogin ? 'Log in to continue building your momentum.' : 'Create your account and make every session count.'}</p>

        <form onSubmit={handleSubmit} className="wb-auth-form">
          {!isLogin && (
            <motion.label className="wb-auth-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <span>Full Name</span>
              <input 
                type="text" 
                placeholder="John Doe"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </motion.label>
          )}

          <label className="wb-auth-field">
            <span>Email Address</span>
            <input 
              type="email" 
              placeholder="name@example.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </label>

          <label className="wb-auth-field">
            <span>Password</span>
            <input 
              type="password" 
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </label>

          {!isLogin && (
            <motion.label className="wb-auth-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <span>Fitness Goal</span>
              <select 
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
              >
                <option value="">Select Goal</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
              </select>
            </motion.label>
          )}

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="wb-auth-error"
            >
              {error}
            </motion.p>
          )}

          <button className="wb-primary-action">
            {isLogin ? 'Sign In  ↗' : 'Create Account  ↗'}
          </button>
        </form>

        <div className="wb-auth-switch">
          <p>
            {isLogin ? "Don't have an account?" : "Already a member?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </motion.section>
      </main>
    </div>
  );
};

export default Auth;
