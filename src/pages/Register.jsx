import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as apiRegister } from '../api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const ROLES = [
  { value: 'farmer', label: 'Farmer', icon: '🧑🌾', desc: 'Individual farmer selling produce' },
  { value: 'fpo', label: 'FPO', icon: '🏘️', desc: 'Farmer Producer Organisation' },
  { value: 'buyer', label: 'Buyer', icon: '🏢', desc: 'Processor, Exporter, Retail Chain or Govt Agency' },
];

const ENTITY_TYPES = ['Processor', 'Exporter', 'Retail Chain', 'Govt Agency'];

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    district: '',
    gst_number: '',
    fssai_number: '',
    entity_type: 'Processor',
  });

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const errs = {};
    if (step === 1 && !form.role) errs.role = 'Please select a role';
    if (step === 2) {
      if (!form.name) errs.name = 'Name is required';
      if (!form.email) errs.email = 'Email is required';
      if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
      if (!form.phone) errs.phone = 'Phone is required';
      if (!form.district) errs.district = 'District is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const maxStep = form.role === 'buyer' ? 3 : 2;

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await apiRegister(form);
      const user = await login(form.email, form.password);
      toast.success('Registration successful! Welcome to KisanSetu.');
      if (user.role === 'farmer' || user.role === 'fpo') navigate('/farmer/dashboard');
      else if (user.role === 'buyer') navigate('/buyer/dashboard');
      else navigate('/');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed';
      toast.error(msg);
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="flex items-start justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg border border-gray-100">
          <h1 className="text-2xl font-bold text-primary mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm mb-6">Join KisanSetu — किसान का डिजिटल मंडी</p>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, ...(form.role === 'buyer' ? [3] : [])].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < maxStep && <div className={`flex-1 h-1 rounded ${ step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div>
              <h2 className="font-semibold text-lg text-gray-800 mb-4">Select Your Role</h2>
              <div className="space-y-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => update('role', r.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left ${
                      form.role === r.value
                        ? 'border-primary bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl">{r.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{r.label}</p>
                      <p className="text-sm text-gray-500">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-red-500 text-sm mt-2">{errors.role}</p>}
            </div>
          )}

          {/* Step 2: Basic Info */}
          {step === 2 && (
            <div>
              <h2 className="font-semibold text-lg text-gray-800 mb-4">Basic Information</h2>
              <div className="space-y-4">
                {[
                  { field: 'name', label: 'Full Name', type: 'text', placeholder: 'Ramesh Jadhav' },
                  { field: 'email', label: 'Email Address', type: 'email', placeholder: 'you@email.com' },
                  { field: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
                  { field: 'phone', label: 'Phone Number', type: 'tel', placeholder: '9876543210' },
                  { field: 'district', label: 'District', type: 'text', placeholder: 'Nashik' },
                ].map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type={type}
                      value={form[field]}
                      onChange={(e) => update(field, e.target.value)}
                      placeholder={placeholder}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Buyer Details */}
          {step === 3 && form.role === 'buyer' && (
            <div>
              <h2 className="font-semibold text-lg text-gray-800 mb-4">Buyer Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                  <select
                    value={form.entity_type}
                    onChange={(e) => update('entity_type', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {ENTITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    value={form.gst_number}
                    onChange={(e) => update('gst_number', e.target.value)}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">FSSAI Number <span className="text-gray-400">(optional)</span></label>
                  <input
                    type="text"
                    value={form.fssai_number}
                    onChange={(e) => update('fssai_number', e.target.value)}
                    placeholder="12345678901234"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  📄 Document verification will be done by admin within 24 hours. You can browse lots after verification.
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            {step < maxStep ? (
              <button
                onClick={handleNext}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-green-900 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-accent text-white py-2.5 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            )}
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
