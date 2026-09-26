import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const BookingSystem = ({ token }) => {
  const [trainers, setTrainers] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTrainers();
    fetchMyBookings();
  }, []);

  const fetchTrainers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/trainers/trainers');
      setTrainers(data);
    } catch (err) {
      console.error('Error fetching trainers', err);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/trainers/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyBookings(data);
    } catch (err) {
      console.error('Error fetching bookings', err);
    }
  };

  const fetchAvailableSlots = async (trainerId, date) => {
    if (!trainerId || !date) return;
    try {
      const { data } = await axios.get(`http://localhost:5000/api/trainers/slots?trainerId=${trainerId}&date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableSlots(data.slots);
    } catch (err) {
      console.error('Error fetching slots', err);
    }
  };

  useEffect(() => {
    if (selectedTrainer && selectedDate) {
      fetchAvailableSlots(selectedTrainer._id, selectedDate);
    }
  }, [selectedTrainer, selectedDate]);

  const handleBookSlot = async () => {
    if (!selectedTrainer || !selectedDate || !selectedSlot) {
      alert('Please select trainer, date and slot');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/trainers/book', {
        trainerId: selectedTrainer._id,
        date: selectedDate,
        slot: selectedSlot,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Booking successful! Your trainer is waiting.');
      setSelectedTrainer(null);
      setSelectedDate('');
      setSelectedSlot('');
      fetchMyBookings();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Booking failed'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/trainers/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyBookings();
    } catch (err) {
      alert('Error cancelling booking');
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Our Expert Trainers</h3>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {trainers.map((trainer) => (
            <motion.div 
              key={trainer._id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedTrainer(trainer)}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                selectedTrainer?._id === trainer._id ? 'border-yellow-400 bg-slate-800' : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              <img src={trainer.profileImage} alt={trainer.name} className="w-20 h-20 rounded-full mb-4 object-cover border-2 border-yellow-400" />
              <h3 className="text-xl font-bold text-white">{trainer.name}</h3>
              <p className="text-yellow-400 text-sm font-medium mb-2">{trainer.specialty}</p>
              <p className="text-slate-400 text-sm">{trainer.bio}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedTrainer && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Book a Session with {selectedTrainer.name}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-slate-400 text-sm">Select Date</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div >
              <div className="space-y-4">
                <label className="block text-slate-400 text-sm">Available Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.length > 0 ? (
                    availableSlots.map(slot => (
                      <button 
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedSlot === slot ? 'bg-yellow-400 text-black' : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs col-span-3 italic">No slots available for this date</p>
                  )}
                </div >
              </div >
            </div >

            <button 
              onClick={handleBookSlot}
              disabled={loading || !selectedSlot}
              className="w-full mt-8 bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 transition-all active:scale-95 shadow-lg shadow-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium"
        >
          {message}
        </motion.div>
      )}

      <div>
        <h3 className="text-2xl font-bold text-white mb-6">My Scheduled Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myBookings.length > 0 ? (
            myBookings.map(booking => (
              <motion.div 
                key={booking._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex justify-between items-center group hover:border-yellow-400 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-400 text-black p-3 rounded-xl font-black text-center min-w-[60px]">
                    <div className="text-xs uppercase">Date</div>
                    <div className="text-sm">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{booking.trainer?.name}</h4>
                    <p className="text-slate-400 text-sm">{booking.slot} | {booking.trainer?.specialty}</p>
                  </div>
                </div >
                <button 
                  onClick={() => handleCancelBooking(booking._id)}
                  className="text-slate-600 hover:text-red-400 transition-colors p-2"
                >
                  🗑️
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-slate-500 italic col-span-2 text-center py-8">You have no upcoming sessions. Book one above!</p>
          )}
        </div >
      </div>
    </div >
  );
};

export default BookingSystem;
