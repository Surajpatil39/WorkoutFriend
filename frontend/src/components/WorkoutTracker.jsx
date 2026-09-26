import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WORKOUT_PLANS } from '../constants/workoutPlans';

const WorkoutTracker = ({ token }) => {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ exercise: '', sets: '', reps: '', weight: '' });
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const fetchWorkouts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts(data);
    } catch (err) {
      console.error('Error fetching workouts', err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [token]);

  const handleAddWorkout = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/workouts', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ exercise: '', sets: '', reps: '', weight: '' });
      fetchWorkouts();
    } catch (err) {
      alert('Error adding workout');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWorkouts();
    } catch (err) {
      alert('Error deleting workout');
    }
  };

  const chartData = workouts.slice().reverse().map(w => ({
    date: new Date(w.date).toLocaleDateString(),
    weight: w.weight
  }));

  return (
    <div className="space-y-8">
      {/* Plan Selector */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl"
      >
        <h3 className="text-xl font-bold mb-4 text-yellow-400">Quick-Start Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {WORKOUT_PLANS.map(plan => (
            <button 
              key={plan.id}
              onClick={() => { setSelectedPlan(plan); setSelectedDay(null); }}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                selectedPlan?.id === plan.id ? 'border-yellow-400 bg-slate-700' : 'border-slate-700 bg-slate-900 hover:border-slate-600'
              }`}
            >
              <div className="font-bold text-white">{plan.name}</div>
              <div className="text-xs text-slate-400">{plan.description}</div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {selectedPlan && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(selectedPlan.days).map(day => (
                  <button 
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
                      selectedDay === day ? 'bg-yellow-400 text-black' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div >
              
              {selectedDay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedPlan.days[selectedDay].exercises.map((ex, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setForm({...form, exercise: ex})}
                      className="text-left px-4 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm text-slate-300 transition-all flex justify-between items-center group"
                    >
                      <span>{ex}</span>
                      <span className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">Add +</span>
                    </button>
                  ))}
                </div >
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Log Workout Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-yellow-400">Log New Exercise</h3>
          <button 
            onClick={() => { setSelectedPlan(null); setSelectedDay(null); setForm({ exercise: '', sets: '', reps: '', weight: '' }); }}
            className="text-xs text-slate-400 hover:text-white underline"
          >
            Clear All
          </button>
        </div>
        <form onSubmit={handleAddWorkout} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input 
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400"
            placeholder="Exercise (e.g. Bench Press)"
            value={form.exercise}
            onChange={(e) => setForm({...form, exercise: e.target.value})}
            required
          />
          <input 
            type="number"
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400"
            placeholder="Sets"
            value={form.sets}
            onChange={(e) => setForm({...form, sets: e.target.value})}
            required
          />
          <input 
            type="number"
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400"
            placeholder="Reps"
            value={form.reps}
            onChange={(e) => setForm({...form, reps: e.target.value})}
            required
          />
          <input 
            type="number"
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400"
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={(e) => setForm({...form, weight: e.target.value})}
            required
          />
          <button 
            disabled={loading}
            className="bg-yellow-400 text-black font-bold py-2 rounded-xl hover:bg-yellow-300 transition-all active:scale-95"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>
      </motion.div>

      {/* Progress Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl"
      >
        <h3 className="text-xl font-bold mb-6 text-white">Strength Progress</h3>
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111111', border: '1px solid #303030', borderRadius: '0', color: '#fff' }}
                  itemStyle={{ color: '#c8ff00' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#c8ff00" strokeWidth={3} dot={{ r: 5, fill: '#c8ff00' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 italic">
              No data yet. Log some workouts to see your progress!
            </div>
          )}
        </div >
      </motion.div>

      {/* Workout List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workouts.map((w, index) => (
          <motion.div 
            key={w._id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex justify-between items-center group hover:border-yellow-400 transition-all"
          >
            <div>
              <h4 className="font-bold text-white">{w.exercise}</h4>
              <p className="text-slate-400 text-sm">
                {w.sets} sets × {w.reps} reps @ {w.weight}kg
              </p>
            </div >
            <button 
              onClick={() => handleDelete(w._id)}
              className="text-slate-600 hover:text-red-400 transition-colors p-2"
            >
              🗑️
            </button>
          </motion.div>
        ))}
      </div >
    </div >
  );
};

export default WorkoutTracker;
