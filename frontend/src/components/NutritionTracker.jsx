import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const NutritionTracker = ({ token }) => {
  const [meals, setMeals] = useState([]);
  const [form, setForm] = useState({ foodName: '', calories: '', protein: '', carbs: '', fats: '' });
  const [loading, setLoading] = useState(false);
  const [foodImage, setFoodImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [portionHint, setPortionHint] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [savingAnalysis, setSavingAnalysis] = useState(false);

  const fetchMeals = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/nutrition', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeals(data);
    } catch (err) {
      console.error('Error fetching meals', err);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [token]);

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const handleAddMeal = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/nutrition', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ foodName: '', calories: '', protein: '', carbs: '', fats: '' });
      fetchMeals();
    } catch (err) {
      alert('Error adding meal');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const nextImage = event.target.files?.[0];
    if (!nextImage) return;

    if (nextImage.size > 5 * 1024 * 1024) {
      setAnalysisError('Choose an image smaller than 5MB.');
      return;
    }

    setFoodImage(nextImage);
    setImagePreview(URL.createObjectURL(nextImage));
    setAnalysis(null);
    setAnalysisError('');
  };

  const clearFoodImage = () => {
    setFoodImage(null);
    setImagePreview('');
    setPortionHint('');
    setAnalysis(null);
    setAnalysisError('');
  };

  const handleAnalyzeFood = async () => {
    if (!foodImage) {
      setAnalysisError('Choose a food image before estimating its nutrition.');
      return;
    }

    setAnalysisLoading(true);
    setAnalysisError('');
    setAnalysis(null);

    try {
      const data = new FormData();
      data.append('image', foodImage);
      data.append('portionHint', portionHint);
      const response = await axios.post('http://localhost:5000/api/nutrition/analyze-image', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalysis(response.data);
    } catch (err) {
      setAnalysisError(err.response?.data?.message || 'Unable to estimate this food right now.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const updateAnalysisItem = (index, field, value) => {
    setAnalysis((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (
        itemIndex === index
          ? { ...item, [field]: ['calories', 'protein', 'carbs', 'fats'].includes(field) ? value : value }
          : item
      ))
    }));
  };

  const handleSaveAnalysis = async () => {
    if (!analysis?.items?.length) return;

    setSavingAnalysis(true);
    setAnalysisError('');
    try {
      await axios.post('http://localhost:5000/api/nutrition/batch', {
        items: analysis.items.map(({ foodName, calories, protein, carbs, fats }) => ({
          foodName,
          calories: Number(calories),
          protein: Number(protein),
          carbs: Number(carbs),
          fats: Number(fats),
        }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      clearFoodImage();
      await fetchMeals();
    } catch (err) {
      setAnalysisError(err.response?.data?.message || 'Unable to save this estimate.');
    } finally {
      setSavingAnalysis(false);
    }
  };

  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + Number(meal.calories),
    protein: acc.protein + Number(meal.protein),
    carbs: acc.carbs + Number(meal.carbs),
    fats: acc.fats + Number(meal.fats),
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="nutrition-photo-card bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl"
      >
        <div className="nutrition-photo-heading">
          <div>
            <p className="nutrition-photo-kicker">Photo estimate // Beta</p>
            <h3 className="text-xl font-bold text-yellow-400">Analyze a Food Photo</h3>
          </div>
          <span className="nutrition-photo-note">Review before logging</span>
        </div>

        <div className="nutrition-photo-grid">
          <div>
            {imagePreview ? (
              <div className="nutrition-photo-preview">
                <img src={imagePreview} alt="Selected food to analyze" />
                <button type="button" onClick={clearFoodImage} className="nutrition-photo-remove" aria-label="Remove selected food photo">×</button>
              </div>
            ) : (
              <label className="nutrition-photo-dropzone" htmlFor="food-image-upload">
                <span className="nutrition-photo-icon">⌁</span>
                <strong>Upload food photo</strong>
                <span>JPEG, PNG, or WebP · 5MB max</span>
                <input
                  id="food-image-upload"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="nutrition-photo-actions">
            <label className="nutrition-photo-label" htmlFor="portion-hint">Portion details <span>optional</span></label>
            <textarea
              id="portion-hint"
              className="nutrition-photo-textarea"
              value={portionHint}
              onChange={(event) => setPortionHint(event.target.value)}
              placeholder="e.g. one bowl, two slices, cooked with olive oil"
              maxLength={300}
            />
            <button
              type="button"
              onClick={handleAnalyzeFood}
              disabled={analysisLoading || !foodImage}
              className="nutrition-photo-analyze bg-yellow-400 text-black font-bold"
            >
              {analysisLoading ? 'Analyzing food...' : 'Estimate nutrition  ↗'}
            </button>
            <p className="nutrition-photo-disclaimer">Estimates can vary by recipe and portion. Check the numbers before saving.</p>
          </div>
        </div>

        {analysisError && <p className="nutrition-photo-error" role="alert">{analysisError}</p>}

        {analysis && (
          <div className="nutrition-analysis-review">
            <div className="nutrition-analysis-header">
              <div>
                <p className="nutrition-photo-kicker">Detected meal</p>
                <h4>Review the estimate</h4>
              </div>
              <span>{analysis.items.length} {analysis.items.length === 1 ? 'item' : 'items'}</span>
            </div>

            <div className="nutrition-analysis-items">
              {analysis.items.map((item, index) => (
                <div className="nutrition-analysis-item" key={`${item.foodName}-${index}`}>
                  <div className="nutrition-analysis-main">
                    <label>
                      <span>Food</span>
                      <input
                        value={item.foodName}
                        onChange={(event) => updateAnalysisItem(index, 'foodName', event.target.value)}
                        maxLength={120}
                      />
                    </label>
                    <label>
                      <span>Portion</span>
                      <input
                        value={item.estimatedPortion}
                        onChange={(event) => updateAnalysisItem(index, 'estimatedPortion', event.target.value)}
                        maxLength={120}
                      />
                    </label>
                  </div>
                  <div className="nutrition-analysis-macros">
                    {[
                      ['calories', 'kcal'],
                      ['protein', 'P g'],
                      ['carbs', 'C g'],
                      ['fats', 'F g'],
                    ].map(([field, label]) => (
                      <label key={field}>
                        <span>{label}</span>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={item[field]}
                          onChange={(event) => updateAnalysisItem(index, field, event.target.value)}
                        />
                      </label>
                    ))}
                  </div>
                  <span className={`nutrition-confidence is-${item.confidence}`}>{item.confidence} confidence</span>
                </div>
              ))}
            </div>

            {analysis.notes && <p className="nutrition-analysis-notes">{analysis.notes}</p>}
            <button
              type="button"
              onClick={handleSaveAnalysis}
              disabled={savingAnalysis}
              className="nutrition-analysis-save bg-yellow-400 text-black font-bold"
            >
              {savingAnalysis ? 'Saving estimate...' : 'Confirm & add to today  ↗'}
            </button>
          </div>
        )}
      </motion.section>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl"
      >
        <h3 className="text-xl font-bold mb-4 text-yellow-400">Log Daily Nutrition</h3>
        <form onSubmit={handleAddMeal} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400 col-span-1 md:col-span-1"
            placeholder="Food Item"
            value={form.foodName}
            onChange={(e) => setForm({...form, foodName: e.target.value})}
            required
          />
          <input 
            type="number"
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:border-yellow-400"
            placeholder="Calories"
            value={form.calories}
            onChange={(e) => setForm({...form, calories: e.target.value})}
            required
          />
          <div className="grid grid-cols-3 gap-2">
            <input 
              type="number"
              className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white outline-none focus:border-yellow-400 text-center"
              placeholder="P(g)"
              value={form.protein}
              onChange={(e) => setForm({...form, protein: e.target.value})}
            />
            <input 
              type="number"
              className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white outline-none focus:border-yellow-400 text-center"
              placeholder="C(g)"
              value={form.carbs}
              onChange={(e) => setForm({...form, carbs: e.target.value})}
            />
            <input 
              type="number"
              className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white outline-none focus:border-yellow-400 text-center"
              placeholder="F(g)"
              value={form.fats}
              onChange={(e) => setForm({...form, fats: e.target.value})}
            />
          </div >
        </form>
        <button 
          onClick={handleAddMeal}
          disabled={loading}
          className="w-full mt-4 bg-yellow-400 text-black font-bold py-2 rounded-xl hover:bg-yellow-300 transition-all active:scale-95"
        >
          {loading ? 'Adding...' : 'Add Meal'}
        </button>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Calories', value: totals.calories, unit: 'kcal', color: 'text-white' },
          { label: 'Protein', value: totals.protein, unit: 'g', color: 'text-yellow-400' },
          { label: 'Carbs', value: totals.carbs, unit: 'g', color: 'text-yellow-400' },
          { label: 'Fats', value: totals.fats, unit: 'g', color: 'text-yellow-400' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center"
          >
            <p className="text-slate-400 text-xs uppercase font-bold mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}<span className="text-sm ml-1">{stat.unit}</span></p>
          </motion.div>
        ))}
      </div >

      <div className="space-y-4">
        {meals.map((meal, index) => (
          <motion.div 
            key={meal._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex justify-between items-center"
          >
            <div>
              <h4 className="font-bold text-white">{meal.foodName}</h4>
              <p className="text-slate-400 text-xs">{meal.calories} kcal | P: {meal.protein}g C: {meal.carbs}g F: {meal.fats}g</p>
            </div >
            <span className="text-yellow-400 font-bold">{meal.calories} kcal</span>
          </motion.div>
        ))}
      </div >
    </div >
  );
};

export default NutritionTracker;
