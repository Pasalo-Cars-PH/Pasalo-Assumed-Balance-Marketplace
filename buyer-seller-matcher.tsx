import React, { useState, useMemo } from 'react';

interface Vehicle {
  id: number;
  model: string;
  monthly: number;
  bank: string;
  months: number;
  cashout: number;
  brand: string;
  type: string;
  status: string;
  demand: string;
  mileage: number;
  year: number;
  issues: string[];
  documents: boolean;
  photos: number;
}

const initialVehicles: Vehicle[] = [
  { id: 1, model: '2026 Toyota Fortuner G A/T', monthly: 38767, bank: 'TFS', months: 60, cashout: 150000, brand: 'Toyota', type: 'SUV', status: 'Assume Balance', demand: 'high', mileage: 12000, year: 2026, issues: [], documents: true, photos: 8 },
  { id: 2, model: '2026 Ford Everest Titanium 4x2', monthly: 47000, bank: 'BPI', months: 60, cashout: 280000, brand: 'Ford', type: 'SUV', status: 'Assume Balance', demand: 'high', mileage: 8500, year: 2026, issues: [], documents: true, photos: 7 },
  { id: 3, model: '2026 Toyota Raize 1.0 Turbo CVT', monthly: 18639, bank: 'TFS', months: 60, cashout: 120000, brand: 'Toyota', type: 'SUV', status: 'Assume Balance', demand: 'very_high', mileage: 14000, year: 2026, issues: [], documents: true, photos: 9 },
  { id: 4, model: '2025 Toyota Vios 1.3 XLE CVT', monthly: 14500, bank: 'BDO', months: 48, cashout: 85000, brand: 'Toyota', type: 'Sedan', status: 'Assume Balance', demand: 'high', mileage: 18000, year: 2025, issues: [], documents: true, photos: 6 },
  { id: 5, model: '2026 Mitsubishi Xpander Cross A/T', monthly: 28878, bank: 'EastWest', months: 60, cashout: 160000, brand: 'Mitsubishi', type: 'MPV', status: 'Assume Balance', demand: 'high', mileage: 5000, year: 2026, issues: [], documents: true, photos: 7 },
  { id: 6, model: '2025 Toyota Hilux Conquest 4x4 A/T', monthly: 43232, bank: 'BDO', months: 46, cashout: 320000, brand: 'Toyota', type: 'Pickup', status: 'Assume Balance', demand: 'high', mileage: 21000, year: 2025, issues: [], documents: true, photos: 8 },
  { id: 7, model: '2026 Nissan Terra VL 4x2 A/T', monthly: 42800, bank: 'PSBank', months: 54, cashout: 250000, brand: 'Nissan', type: 'SUV', status: 'Assume Balance', demand: 'medium', mileage: 11000, year: 2026, issues: ['AC filter needs clean'], documents: true, photos: 5 },
  { id: 8, model: '2024 Toyota Hiace Commuter Deluxe M/T', monthly: 29890, bank: 'Metrobank', months: 36, cashout: 380000, brand: 'Toyota', type: 'Van', status: 'Assume Balance', demand: 'medium', mileage: 45000, year: 2024, issues: ['Minor dent on rear door'], documents: false, photos: 3 }
];

export default function App() {
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(initialVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(initialVehicles[0]);
  const [activeTab, setActiveTab] = useState<'detector' | 'browse' | 'seller' | 'add' | 'intake'>('intake'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  // Form State para sa Add New Listing
  const [newModel, setNewModel] = useState('');
  const [newBrand, setNewBrand] = useState('Toyota');
  const [newMonthly, setNewMonthly] = useState('');
  const [newCashout, setNewCashout] = useState('');
  const [newBank, setNewBank] = useState('BDO');
  const [newPhotos, setNewPhotos] = useState('6');
  const [newDocs, setNewDocs] = useState(true);
  const [newIssues, setNewIssues] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Form State para sa Buyer Match Intake
  const [intakeForm, setIntakeForm] = useState({
    fullname: '',
    mobile: '',
    email: '',
    location: '',
    budget_min: '',
    budget_max: '',
    downpayment: '',
    preferred_brand: '',
    body_type: '',
    transmission: '',
    unit_status: '',
    urgency: '',
    message: ''
  });
  const [intakeStatus, setIntakeStatus] = useState<{ type: 'ok' | 'err' | null; message: string }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateQualityScore = (vehicle: Vehicle) => {
    let score = 100;
    let flags: { severity: string; message: string; impact: number }[] = [];

    if (!vehicle.documents) {
      score -= 20;
      flags.push({ severity: 'critical', message: 'Missing OR/CR or Bank Clearance Documents', impact: 20 });
    }

    if (vehicle.photos < 5) {
      score -= 15;
      flags.push({ severity: 'high', message: `Insufficient photos (${vehicle.photos} uploaded, 6+ recommended)`, impact: 15 });
    } else if (vehicle.photos < 6) {
      score -= 5;
      flags.push({ severity: 'medium', message: 'Adding more photos increases buyer trust', impact: 5 });
    }

    if (vehicle.issues && vehicle.issues.length > 0) {
      const issueImpact = Math.min(vehicle.issues.length * 5, 15);
      score -= issueImpact;
      vehicle.issues.forEach(issue => {
        flags.push({ severity: 'medium', message: `Reported Condition Note: ${issue}`, impact: 5 });
      });
    }

    return {
      score: Math.max(0, score),
      flags: flags.sort((a, b) => (b.impact - a.impact))
    };
  };

  const qualityData = useMemo(() => calculateQualityScore(selectedVehicle), [selectedVehicle]);

  const processedVehicles = useMemo(() => {
    return vehicleList
      .map(v => ({ ...v, quality: calculateQualityScore(v) }))
      .filter(v => {
        const matchesSearch = v.model.toLowerCase().includes(searchQuery.toLowerCase()) || v.brand.toLowerCase().includes(searchQuery.toLowerCase());
        if (riskFilter === 'high') return matchesSearch && v.quality.score >= 90;
        if (riskFilter === 'medium') return matchesSearch && v.quality.score >= 60 && v.quality.score < 90;
        if (riskFilter === 'low') return matchesSearch && v.quality.score < 60;
        return matchesSearch;
      })
      .sort((a, b) => sortBy === 'score' ? b.quality.score - a.quality.score : a.quality.score - b.quality.score);
  }, [vehicleList, searchQuery, riskFilter, sortBy]);

  const toggleDocuments = (id: number) => {
    setVehicleList(prev => prev.map(v => v.id === id ? { ...v, documents: !v.documents } : v));
    if (selectedVehicle.id === id) {
      setSelectedVehicle(prev => ({ ...prev, documents: !prev.documents }));
    }
  };

  const addPhotos = (id: number) => {
    setVehicleList(prev => prev.map(v => v.id === id ? { ...v, photos: v.photos + 2 } : v));
    if (selectedVehicle.id === id) {
      setSelectedVehicle(prev => ({ ...prev, photos: prev.photos + 2 }));
    }
  };

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel || !newMonthly || !newCashout) return;

    const newVehicleObj: Vehicle = {
      id: Date.now(),
      model: newModel,
      brand: newBrand,
      monthly: Number(newMonthly),
      cashout: Number(newCashout),
      bank: newBank,
      months: 60,
      type: 'SUV/Sedan',
      status: 'Assume Balance',
      demand: 'high',
      mileage: 10000,
      year: 2026,
      issues: newIssues ? [newIssues] : [],
      documents: newDocs,
      photos: Number(newPhotos)
    };

    setVehicleList(prev => [newVehicleObj, ...prev]);
    setSelectedVehicle(newVehicleObj);
    setFormSuccess(true);

    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('detector');
      setNewModel('');
      setNewMonthly('');
      setNewCashout('');
      setNewIssues('');
    }, 1500);
  };

  // Lead Scoring Function
  const scoreLead = (data: typeof intakeForm) => {
    let score = 0;
    if (data.urgency === 'asap') score += 40;
    else if (data.urgency === 'this_month') score += 25;
    else if (data.urgency === '1_3_months') score += 10;

    if (data.downpayment && Number(data.downpayment) >= 100000) score += 20;
    else if (data.downpayment && Number(data.downpayment) >= 50000) score += 10;

    if (data.budget_max && Number(data.budget_max) >= 20000) score += 15;
    if (data.email) score += 5;
    if (data.preferred_brand) score += 5;
    if (data.body_type) score += 5;
    if (data.message && data.message.trim().length > 10) score += 10;

    if (score >= 60) return '🔥 HOT LEAD';
    if (score >= 30) return '⚡ WARM LEAD';
    return '❄️ COLD LEAD';
  };

  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIntakeStatus({ type: null, message: '' });

    const leadPriority = scoreLead(intakeForm);

    setTimeout(() => {
      setIsSubmitting(false);
      setIntakeStatus({
        type: 'ok',
        message: `Salamat ${intakeForm.fullname}! Natanggap na ang request mo (${leadPriority}). May makokontact ka sa ${intakeForm.mobile} within 24 hours.`
      });
      setIntakeForm({
        fullname: '',
        mobile: '',
        email: '',
        location: '',
        budget_min: '',
        budget_max: '',
        downpayment: '',
        preferred_brand: '',
        body_type: '',
        transmission: '',
        unit_status: '',
        urgency: '',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 p-2 rounded-lg border border-red-500/30 text-red-500 font-bold text-xl">
              🛡️
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none text-white">Pasalo Cars PH</h1>
              <span className="text-xs text-emerald-400 font-bold">✨ Live System v3.5</span>
            </div>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700 w-full sm:w-auto justify-center overflow-x-auto">
            <button 
              onClick={() => setActiveTab('intake')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition whitespace-nowrap ${activeTab === 'intake' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              📋 Buyer Match Intake
            </button>
            <button 
              onClick={() => setActiveTab('detector')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition whitespace-nowrap ${activeTab === 'detector' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🛡️ Fraud Detector
            </button>
            <button 
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition whitespace-nowrap ${activeTab === 'browse' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🔍 Market Search
            </button>
            <button 
              onClick={() => setActiveTab('seller')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition whitespace-nowrap ${activeTab === 'seller' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              ⚡ Seller Boost
            </button>
            <button 
              onClick={() => setActiveTab('add')}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition whitespace-nowrap ${activeTab === 'add' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'}`}
            >
              ➕ Add Listing
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {activeTab === 'intake' && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-slate-800 border border-red-500/40 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">
                🛡️
              </div>
              <h2 className="text-2xl font-bold">Pasalo Cars PH</h2>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mt-1">✨ Buyer Match Intake</p>
            </div>

            <form onSubmit={handleIntakeSubmit} className="space-y-4 bg-slate-800/80 border border-slate-700/80 p-5 md:p-7 rounded-2xl shadow-xl">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Tell us what you're looking for</h3>
                <p className="text-slate-400 text-xs mb-4">Ang mga sagot mo dito ang gagamitin para i-match ka sa pinaka-angkop na unit.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Juan Dela Cruz"
                  value={intakeForm.fullname}
                  onChange={(e) => setIntakeForm({ ...intakeForm, fullname: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Mobile Number *</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="09XXXXXXXXX"
                    value={intakeForm.mobile}
                    onChange={(e) => setIntakeForm({ ...intakeForm, mobile: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="juan@email.com"
                    value={intakeForm.email}
                    onChange={(e) => setIntakeForm({ ...intakeForm, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Location (City/Province) *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Silang, Cavite"
                  value={intakeForm.location}
                  onChange={(e) => setIntakeForm({ ...intakeForm, location: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-2">
                <h3 className="text-base font-bold text-white mb-2">Budget & Financing</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Monthly Budget (Min)</label>
                    <input 
                      type="number" 
                      placeholder="15000"
                      value={intakeForm.budget_min}
                      onChange={(e) => setIntakeForm({ ...intakeForm, budget_min: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Monthly Budget (Max)</label>
                    <input 
                      type="number" 
                      placeholder="35000"
                      value={intakeForm.budget_max}
                      onChange={(e) => setIntakeForm({ ...intakeForm, budget_max: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Available Downpayment / Cashout</label>
                  <input 
                    type="number" 
                    placeholder="150000"
                    value={intakeForm.downpayment}
                    onChange={(e) => setIntakeForm({ ...intakeForm, downpayment: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-base font-bold text-white mb-2">Vehicle Preference</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Preferred Brand</label>
                    <select 
                      value={intakeForm.preferred_brand}
                      onChange={(e) => setIntakeForm({ ...intakeForm, preferred_brand: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="">Any</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Ford">Ford</option>
                      <option value="Mitsubishi">Mitsubishi</option>
                      <option value="Nissan">Nissan</option>
                      <option value="Honda">Honda</option>
                      <option value="Isuzu">Isuzu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Body Type</label>
                    <select 
                      value={intakeForm.body_type}
                      onChange={(e) => setIntakeForm({ ...intakeForm, body_type: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="">Any</option>
                      <option value="SUV">SUV</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Sedan">Sedan</option>
                      <option value="MPV/Van">MPV/Van</option>
                      <option value="Hatchback">Hatchback</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Transmission</label>
                    <select 
                      value={intakeForm.transmission}
                      onChange={(e) => setIntakeForm({ ...intakeForm, transmission: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="">Any</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Unit Condition</label>
                    <select 
                      value={intakeForm.unit_status}
                      onChange={(e) => setIntakeForm({ ...intakeForm, unit_status: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="">Any</option>
                      <option value="Brand New">Brand New</option>
                      <option value="For Release">For Release</option>
                      <option value="Used - Like New">Used - Like New</option>
                      <option value="Used">Used</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">When do you plan to get a unit? *</label>
                <select 
                  required
                  value={intakeForm.urgency}
                  onChange={(e) => setIntakeForm({ ...intakeForm, urgency: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Select one</option>
                  <option value="asap">ASAP / Within a week</option>
                  <option value="this_month">Within this month</option>
                  <option value="1_3_months">1–3 months</option>
                  <option value="just_looking">Just looking around</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Additional Notes</label>
                <textarea 
                  placeholder="Any specific unit, color, or concern?"
                  value={intakeForm.message}
                  onChange={(e) => setIntakeForm({ ...intakeForm, message: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-base transition shadow-lg shadow-red-600/30"
              >
                {isSubmitting ? 'Submitting...' : 'Find My Match'}
              </button>

              {intakeStatus.type === 'ok' && (
                <div className="bg-emerald-950/80 border border-emerald-500/80 text-emerald-400 p-4 rounded-xl text-xs sm:text-sm text-center font-semibold">
                  {intakeStatus.message}
                </div>
              )}
            </form>
          </div>
        )}

        {activeTab === 'detector' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Listing Trust & Fraud Analysis</h2>
              <p className="text-slate-400 text-xs md:text-sm">Select a vehicle to inspect system-identified risk factors.</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Select Vehicle to Inspect
              </label>
              <select 
                value={selectedVehicle.id} 
                onChange={(e) => {
                  const found = vehicleList.find(v => v.id === parseInt(e.target.value));
                  if (found) setSelectedVehicle(found);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 truncate"
              >
                {vehicleList.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.model} - ₱{v.cashout.toLocaleString()} Cashout (Trust Score: {calculateQualityScore(v).score})
                  </option>
                ))}
              </select>
            </div>

            <div className={`border rounded-xl p-5 md:p-6 mb-6 ${
              qualityData.score >= 90 ? 'bg-emerald-950/40 border-emerald-600/40' :
              qualityData.score >= 60 ? 'bg-amber-950/40 border-amber-600/40' :
              'bg-red-950/40 border-red-600/40'
            }`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Trust Score</p>
                  <span className={`text-5xl md:text-6xl font-black ${
                    qualityData.score >= 90 ? 'text-emerald-400' :
                    qualityData.score >= 60 ? 'text-amber-400' : 'text-red-400'
                  }`}>{qualityData.score}</span>
                  <span className="text-xl md:text-2xl font-bold text-slate-500"> / 100</span>
                </div>

                <div className="space-y-2 text-xs md:text-sm text-slate-300">
                  <p className="flex items-center gap-2">
                    <span>{selectedVehicle.documents ? '✅' : '❌'}</span>
                    <span>OR/CR & Financing Papers: <strong>{selectedVehicle.documents ? 'Verified Attached' : 'Missing Documents'}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>{selectedVehicle.photos >= 6 ? '✅' : '⚠️'}</span>
                    <span>Photos Uploaded: <strong>{selectedVehicle.photos} photos</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>{selectedVehicle.issues.length === 0 ? '✅' : '⚠️'}</span>
                    <span>Reported Issues: <strong>{selectedVehicle.issues.length === 0 ? 'None' : selectedVehicle.issues.join(', ')}</strong></span>
                  </p>
                </div>
              </div>
            </div>

            {qualityData.flags.length > 0 && (
              <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-5 mb-6">
                <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2 text-sm md:text-base">
                  ⚠️ Risk Flags & Fraud Alerts
                </h3>
                <div className="space-y-2">
                  {qualityData.flags.map((flag, idx) => (
                    <div key={idx} className="bg-red-900/30 border border-red-700/40 p-3 rounded-lg flex justify-between items-center text-xs md:text-sm">
                      <span className="font-semibold">{flag.message}</span>
                      <span className="text-red-400 font-bold">-{flag.impact} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'browse' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Marketplace Listings</h2>
              <p className="text-slate-400 text-xs md:text-sm">Filter listings by risk status and keywords.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <input 
                type="text" 
                placeholder="Search by brand or model..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-red-500"
              />

              <select 
                value={riskFilter} 
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="all">All Risk Levels</option>
                <option value="high">🟢 Verified (90+ Score)</option>
                <option value="medium">🟡 Caution (60-89 Score)</option>
                <option value="low">🔴 High Risk (&lt;60 Score)</option>
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="score">Sort by Quality Score (High to Low)</option>
                <option value="risk">Sort by Risk (Low Score First)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {processedVehicles.map((v) => (
                <div key={v.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-base md:text-lg text-white">{v.model}</h4>
                    <p className="text-xs text-slate-400">Cashout: <strong className="text-emerald-400">₱{v.cashout.toLocaleString()}</strong> | Monthly: ₱{v.monthly.toLocaleString()} | Bank: {v.bank}</p>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <div className="text-right">
                      <span className={`text-xl md:text-2xl font-black ${
                        v.quality.score >= 90 ? 'text-emerald-400' :
                        v.quality.score >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>{v.quality.score}</span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Trust Score</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedVehicle(v); setActiveTab('detector'); }}
                      className="bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'seller' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Seller Score Improvement Simulator</h2>
              <p className="text-slate-400 text-xs md:text-sm">See how adding documents and photos directly boosts your listing score in real-time.</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 md:p-6">
              <h3 className="font-bold text-base md:text-lg mb-1">{selectedVehicle.model}</h3>
              <p className="text-xs md:text-sm text-slate-400 mb-5">Current Trust Score: <strong className="text-red-400">{qualityData.score}/100</strong></p>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-700 gap-3">
                  <div>
                    <p className="font-semibold text-xs md:text-sm">Official Documents (OR/CR & ID)</p>
                    <p className="text-[11px] text-slate-400">{selectedVehicle.documents ? 'Attached (+20 pts)' : 'Missing (-20 pts penalty)'}</p>
                  </div>
                  <button 
                    onClick={() => toggleDocuments(selectedVehicle.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold ${selectedVehicle.documents ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}
                  >
                    {selectedVehicle.documents ? 'Attached (Click to Remove)' : 'Upload Documents (+20 pts)'}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-700 gap-3">
                  <div>
                    <p className="font-semibold text-xs md:text-sm">Vehicle Photo Gallery</p>
                    <p className="text-[11px] text-slate-400">Currently: {selectedVehicle.photos} Photos uploaded</p>
                  </div>
                  <button 
                    onClick={() => addPhotos(selectedVehicle.id)}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-xs font-bold"
                  >
                    Add +2 Photos (+15 pts)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold mb-1">➕ Post New Pasalo Listing</h2>
              <p className="text-slate-400 text-xs md:text-sm">Submit your vehicle details to generate an instant Trust & Quality Score.</p>
            </div>

            {formSuccess ? (
              <div className="bg-emerald-950/80 border border-emerald-500 p-6 rounded-xl text-center">
                <p className="text-2xl mb-2">🎉</p>
                <h3 className="text-lg font-bold text-emerald-400">Listing Posted Successfully!</h3>
                <p className="text-xs text-slate-300">Redirecting to Fraud Detector to inspect your score...</p>
              </div>
            ) : (
              <form onSubmit={handleAddListing} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Vehicle Model & Year</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 2026 Toyota Fortuner V A/T" 
                      value={newModel}
                      onChange={(e) => setNewModel(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Brand</label>
                    <select 
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Toyota">Toyota</option>
                      <option value="Ford">Ford</option>
                      <option value="Mitsubishi">Mitsubishi</option>
                      <option value="Nissan">Nissan</option>
                      <option value="Honda">Honda</option>
                      <option value="Isuzu">Isuzu</option>
                      <option value="Hyundai">Hyundai</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Cashout Required (₱)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 150000" 
                      value={newCashout}
                      onChange={(e) => setNewCashout(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Monthly Amortization (₱)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 25000" 
                      value={newMonthly}
                      onChange={(e) => setNewMonthly(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Financing Bank</label>
                    <select 
                      value={newBank}
                      onChange={(e) => setNewBank(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="TFS">TFS (Toyota Financial)</option>
                      <option value="BDO">BDO Unibank</option>
                      <option value="BPI">BPI Drive</option>
                      <option value="PSBank">PSBank</option>
                      <option value="EastWest">EastWest Bank</option>
                      <option value="Metrobank">Metrobank</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Uploaded Photos Count</label>
                    <select 
                      value={newPhotos}
                      onChange={(e) => setNewPhotos(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="2">2 Photos (Low Score Penalty)</option>
                      <option value="4">4 Photos (Fair)</option>
                      <option value="6">6 Photos (Recommended)</option>
                      <option value="8">8+ Photos (High Score)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Documents Attached?</label>
                  <div className="flex items-center gap-4 bg-slate-900 p-2.5 rounded-lg border border-slate-700">
                    <label className="flex items-center gap-2 text-xs">
                      <input 
                        type="radio" 
                        name="docs" 
                        checked={newDocs === true}
                        onChange={() => setNewDocs(true)}
                      /> Complete OR/CR & Authorization Papers
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input 
                        type="radio" 
                        name="docs" 
                        checked={newDocs === false}
                        onChange={() => setNewDocs(false)}
                      /> Incomplete / Missing Papers
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Known Issues / Condition Notes (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Minor scratches on side door" 
                    value={newIssues}
                    onChange={(e) => setNewIssues(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-sm transition"
                >
                  🚀 Publish Listing & Calculate Trust Score
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      <footer className="text-center text-slate-500 text-xs py-8 border-t border-slate-800">
        Pasalo Cars PH Platform Engine © 2026 | Built for High-Trust Auto Marketplace
      </footer>
    </div>
  );
}
