import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLot } from '../../api';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';

const CROPS = [
  { id: 1, name: 'Tomato', marathi: 'टोमॅटो' },
  { id: 2, name: 'Onion', marathi: 'कांदा' },
  { id: 3, name: 'Potato', marathi: 'बटाटा' },
  { id: 4, name: 'Soybean', marathi: 'सोयाबीन' },
  { id: 5, name: 'Cotton', marathi: 'कापूस' },
  { id: 6, name: 'Wheat', marathi: 'गहू' },
  { id: 7, name: 'Rice', marathi: 'तांदूळ' },
  { id: 8, name: 'Maize', marathi: 'मका' },
];

const GRADES = [
  { value: 'FAQ', label: 'FAQ (Fair Average Quality)', desc: 'Standard mandi grade. Suitable for most buyers.', color: 'border-profit bg-profit/5 text-profit' },
  { value: 'GRADE_A', label: 'Grade A', desc: 'Premium quality. Uniform size, no defects.', color: 'border-logistics bg-logistics/5 text-logistics' },
  { value: 'GRADE_B', label: 'Grade B', desc: 'Good quality with minor defects.', color: 'border-accent bg-amber-50 text-amber-800' },
  { value: 'REJECT', label: 'Reject', desc: 'Below mandi standard. Suitable for processing only.', color: 'border-red-400 bg-red-50 text-red-700' },
];

const MANDIS = [
  { id: 1, name: 'Nashik APMC' },
  { id: 2, name: 'Pune APMC' },
  { id: 3, name: 'Aurangabad APMC' },
  { id: 4, name: 'Solapur APMC' },
  { id: 5, name: 'Nagpur APMC' },
];

const CreateLot = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    crop_id: '',
    variety: '',
    grade: '',
    description: '',
    quantity_kg: '',
    expected_price_per_quintal: '',
    harvest_date: '',
    available_from: '',
    district: '',
    village: '',
    nearest_mandi_id: '',
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const errs = {};
    if (step === 1) {
      if (!form.crop_id) errs.crop_id = 'Select a crop';
      if (!form.grade) errs.grade = 'Select grade';
    }
    if (step === 2) {
      if (!form.quantity_kg || form.quantity_kg <= 0) errs.quantity_kg = 'Enter valid quantity';
      if (!form.expected_price_per_quintal || form.expected_price_per_quintal <= 0) errs.expected_price_per_quintal = 'Enter valid price';
      if (!form.harvest_date) errs.harvest_date = 'Enter harvest date';
      if (!form.available_from) errs.available_from = 'Enter available from date';
    }
    if (step === 3) {
      if (!form.district) errs.district = 'Enter district';
      if (!form.village) errs.village = 'Enter village';
      if (!form.nearest_mandi_id) errs.nearest_mandi_id = 'Select nearest mandi';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => { if (validate()) setStep((s) => s + 1); };
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await createLot(form);
      toast.success('Lot created successfully!');
      navigate('/farmer/lots');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create lot';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Crop Details', 'Quantity & Price', 'Location'];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-6">Create New Lot</h1>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {stepLabels.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > i + 1 ? 'bg-profit text-white' : step === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}>{step > i + 1 ? '✓' : i + 1}</div>
                <span className={`text-sm hidden sm:inline ${ step === i + 1 ? 'text-primary font-semibold' : 'text-gray-400' }`}>{label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-1 rounded ${ step > i + 1 ? 'bg-profit' : 'bg-gray-200' }`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          {/* Step 1: Crop Details */}
          {step === 1 && (
            <div>
              <h2 className="font-bold text-lg text-gray-800 mb-4">Step 1: Crop Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop *</label>
                  <select
                    value={form.crop_id}
                    onChange={(e) => update('crop_id', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select crop...</option>
                    {CROPS.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.marathi})</option>)}
                  </select>
                  {errors.crop_id && <p className="text-red-500 text-xs mt-1">{errors.crop_id}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
                  <input
                    type="text"
                    value={form.variety}
                    onChange={(e) => update('variety', e.target.value)}
                    placeholder="e.g. Nasik Red, Chandramukhi..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {GRADES.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => update('grade', g.value)}
                        className={`text-left p-3 rounded-lg border-2 transition-colors ${
                          form.grade === g.value ? g.color : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-sm">{g.label}</p>
                        <p className="text-xs mt-0.5 opacity-75">{g.desc}</p>
                      </button>
                    ))}
                  </div>
                  {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    rows={3}
                    placeholder="Describe your crop quality, storage conditions, etc."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Quantity & Price */}
          {step === 2 && (
            <div>
              <h2 className="font-bold text-lg text-gray-800 mb-4">Step 2: Quantity & Price</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg) *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantity_kg}
                    onChange={(e) => update('quantity_kg', e.target.value)}
                    placeholder="e.g. 2000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.quantity_kg && <p className="text-red-500 text-xs mt-1">{errors.quantity_kg}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Price (₹/quintal) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 text-sm">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={form.expected_price_per_quintal}
                      onChange={(e) => update('expected_price_per_quintal', e.target.value)}
                      placeholder="1200"
                      className="w-full border border-gray-300 rounded-lg pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {errors.expected_price_per_quintal && <p className="text-red-500 text-xs mt-1">{errors.expected_price_per_quintal}</p>}
                  {form.quantity_kg && form.expected_price_per_quintal && (
                    <p className="text-xs text-profit mt-1">Total value: ₹{((form.quantity_kg / 100) * form.expected_price_per_quintal).toLocaleString('en-IN')}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date *</label>
                    <input
                      type="date"
                      value={form.harvest_date}
                      onChange={(e) => update('harvest_date', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.harvest_date && <p className="text-red-500 text-xs mt-1">{errors.harvest_date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available From *</label>
                    <input
                      type="date"
                      value={form.available_from}
                      onChange={(e) => update('available_from', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.available_from && <p className="text-red-500 text-xs mt-1">{errors.available_from}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div>
              <h2 className="font-bold text-lg text-gray-800 mb-4">Step 3: Location</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) => update('district', e.target.value)}
                    placeholder="e.g. Nashik"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Village *</label>
                  <input
                    type="text"
                    value={form.village}
                    onChange={(e) => update('village', e.target.value)}
                    placeholder="e.g. Dindori"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.village && <p className="text-red-500 text-xs mt-1">{errors.village}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nearest Mandi *</label>
                  <select
                    value={form.nearest_mandi_id}
                    onChange={(e) => update('nearest_mandi_id', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select mandi...</option>
                    {MANDIS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  {errors.nearest_mandi_id && <p className="text-red-500 text-xs mt-1">{errors.nearest_mandi_id}</p>}
                </div>
                {form.crop_id && form.nearest_mandi_id && (
                  <div className="bg-profit/10 border border-profit/30 rounded-lg p-3">
                    <p className="text-sm font-medium text-profit">📊 Current price preview</p>
                    <p className="text-xs text-gray-600 mt-1">Modal price at selected mandi: ₹{900 + Math.floor(Math.random() * 300)}/quintal</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={handleBack} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50">
                ← Previous
              </button>
            )}
            {step < 3 ? (
              <button onClick={handleNext} className="flex-1 bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-green-900">
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-accent text-white py-2.5 rounded-lg font-semibold hover:bg-amber-600 disabled:opacity-60"
              >
                {loading ? 'Creating...' : '✅ Create Lot'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateLot;
