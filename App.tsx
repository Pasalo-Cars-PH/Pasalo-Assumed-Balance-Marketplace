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

interface BuyerProfile {
  fullname: string;
  mobile: string;
  email: string;
  location: string;
  budgetMin: string;
  budgetMax: string;
  downpayment: string;
  brand: string;
  type: string;
  urgency: string;
}

const initialVehicles: Vehicle[] = [
  { id: 1, model: '2026 Toyota Fortuner G A/T', monthly: 38767, bank: 'TFS', months: 60, cashout: 0, brand: 'Toyota', type: 'SUV', status: 'Brand New', demand: 'high', mileage: 0, year: 2026, issues: [], documents: true, photos: 8 },
  { id: 2, model: '2026 Ford Everest Titanium 4x2', monthly: 47000, bank: 'BPI', months: 60, cashout: 0, brand: 'Ford', type: 'SUV', status: 'For Release', demand: 'high', mileage: 0, year: 2026, issues: [], documents: true, photos: 7 },
  { id: 3, model: '2026 Toyota Raize G A/T', monthly: 18639, bank: 'TFS', months: 60, cashout: 180000, brand: 'Toyota', type: 'SUV', status: 'Brand New', demand: 'very_high', mileage: 0, year: 2026, issues: [], documents: true, photos: 9 },
  { id: 4, model: '2026 Toyota Land Cruiser 300 ZX', monthly: 122000, bank: 'Direct', months: 60, cashout: 0, brand: 'Toyota', type: 'Full-Size SUV', status: 'Brand New', demand: 'medium', mileage: 0, year: 2026, issues: [], documents: true, photos: 10 },
  { id: 5, model: '2026 Nissan Patrol 3.5L V6 4x4 A/T', monthly: 111099, bank: 'Direct', months: 60, cashout: 0, brand: 'Nissan', type: 'Full-Size SUV', status: 'Brand New', demand: 'medium', mileage: 0, year: 2026, issues: [], documents: true, photos: 8 },
  { id: 6, model: '2026 Hilux Tamaraw FX DSL M/T', monthly: 26883, bank: 'TFS', months: 60, cashout: 170000, brand: 'Toyota', type: 'Pickup', status: 'Brand New', demand: 'high', mileage: 0, year: 2026, issues: [], documents: true, photos: 7 },
  { id: 7, model: '2025 Honda Civic V CVT A/T', monthly: 33800, bank: 'BDO', months: 43, cashout: 0, brand: 'Honda', type: 'Sedan', status: 'Assume Balance', demand: 'high', mileage: 5200, year: 2025, issues: [], documents: true, photos: 6 },
  { id: 8, model: '2025 Toyota Hilux GR-S 4x4 A/T', monthly: 43232, bank: 'BDO', months: 46, cashout: 0, brand: 'Toyota', type: 'Pickup', status: 'Assume Balance', demand: 'high', mileage: 8900, year: 2025, issues: [], documents: true, photos: 8 },
  { id: 9, model: '2026 Mitsubishi Xpander Cross A/T', monthly: 28878, bank: 'EastWest', months: 60, cashout: 0, brand: 'Mitsubishi', type: 'MPV', status: 'For Release', demand: 'high', mileage: 0, year: 2026, issues: [], documents: true, photos: 7 },
  { id: 10, model: '2026 Toyota Wigo G CVT', monthly: 15513, bank: 'TFS', months: 60, cashout: 145000, brand: 'Toyota', type: 'Hatchback', status: 'Brand New', demand: 'very_high', mileage: 0, year: 2026, issues: [], documents: true, photos: 9 },
  { id: 19, model: '2026 Jetour X70 i-DM A/T', monthly: 32251, bank: 'RCBC', months: 60, cashout: 350000, brand: 'Jetour', type: 'SUV', status: 'Brand New', demand: 'medium', mileage: 0, year: 2026, issues: [], documents: false, photos: 4 },
  { id: 24, model: '2026 Nissan Terra VL 4x2 A/T', monthly: 45800, bank: 'Direct', months: 56, cashout: 350000, brand: 'Nissan', type: 'SUV', status: 'Assume Balance', demand: 'medium', mileage: 15000, year: 2025, issues: ['AC needs service'], documents: false, photos: 3 },
  { id: 25, model: '2026 Toyota Hiace GL Grandia A/T', monthly: 49890, bank: 'Direct', months: 57, cashout: 608000, brand: 'Toyota', type: 'Van', status: 'Assume Balance', demand: 'medium', mileage: 22000, year: 2024, issues: ['Rear bumper damage', 'Engine warning light'], documents: true, photos: 4 }
];

// Fill in from Supabase: Settings > API Keys (Project URL already matches your project ref)
const SUPABASE_URL = 'https://nhssuoytlanpfdsqhjhy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oc3N1b3l0bGFucGZkc3Foamh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NTY3NTYsImV4cCI6MjEwMDAzMjc1Nn0.yOhTwkKmrHzbN1b-TZ-VNzNTdPEoLPZx4rp9s7T_s_0';

const emptyBuyerForm: BuyerProfile = {
  fullname: '', mobile: '', email: '', location: '',
  budgetMin: '', budgetMax: '', downpayment: '', brand: '', type: '', urgency: ''
};

export default function App() {
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(initialVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(initialVehicles[0]);
  const [activeTab, setActiveTab] = useState<'detector' | 'browse' | 'seller' | 'buyer'>('detector');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  // Buyer Match state
  const [buyerForm, setBuyerForm] = useState<BuyerProfile>(emptyBuyerForm);
  const [buyerSubmitted, setBuyerSubmitted] = useState(false);
  const [buyerSaving, setBuyerSaving] = useState(false);
  const [buyerSaveNote, setBuyerSaveNote] = useState('');

  const calculateQualityScore = (vehicle: Vehicle) => {
    let score = 100;
    let flags: { severity: string; message: string; impact: number }[] = [];

    if (!vehicle.documents) {
      score -= 20;
      flags.push({ severity: 'critical', message: 'Missing documentation (docs not attached)', impact: 20 });
    }
    if (vehicle.photos < 5) {
      score -= 15;
      flags.push({ severity: 'high', message: `Insufficient photos (${vehicle.photos} vs 6+ recommended)`, impact: 15 });
    } else if (vehicle.photos < 6) {
      score -= 5;
      flags.push({ severity: 'medium', message: 'Could add more photos for better appeal', impact: 5 });
    }
    if (vehicle.issues && vehicle.issues.length > 0) {
      const issueImpact = Math.min(vehicle.issues.length * 5, 15);
      score -= issueImpact;
      vehicle.issues.forEach(issue => {
        flags.push({ severity: 'medium', message: `Issue reported: ${issue}`, impact: 5 });
      });
    }
    return { score: Math.max(0, score), flags: flags.sort((a, b) => (b.impact - a.impact)) };
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

  // --- Buyer Match scoring ---
  const calculateMatchScore = (vehicle: Vehicle, profile: BuyerProfile) => {
    let score = 0;
    const reasons: string[] = [];
    const min = profile.budgetMin ? Number(profile.budgetMin) : null;
    const max = profile.budgetMax ? Number(profile.budgetMax) : null;
    const downpayment = profile.downpayment ? Number(profile.downpayment) : 0;

    if (max !== null) {
      if (vehicle.monthly <= max && (min === null || vehicle.monthly >= min)) {
        score += 40;
        reasons.push('Within monthly budget');
      } else if (vehicle.monthly <= max * 1.15) {
        score += 20;
        reasons.push('Slightly above budget but close');
      }
    } else {
      score += 15;
    }

    if (!profile.brand || vehicle.brand.toLowerCase() === profile.brand.toLowerCase()) {
      score += 20;
      if (profile.brand) reasons.push('Matches preferred brand');
    }

    if (!profile.type || vehicle.type.toLowerCase().includes(profile.type.toLowerCase())) {
      score += 20;
      if (profile.type) reasons.push('Matches preferred body type');
    }

    if (vehicle.cashout <= downpayment) {
      score += 10;
      if (vehicle.cashout > 0) reasons.push('Cashout within your budget');
    } else if (vehicle.cashout <= downpayment * 1.2) {
      score += 5;
    }

    const q = calculateQualityScore(vehicle).score;
    score += Math.round(q / 10);
    if (q >= 90) reasons.push('High trust score listing');

    return { score, reasons, quality: q };
  };

  const buyerMatches = useMemo(() => {
    if (!buyerSubmitted) return [];
    return vehicleList
      .map(v => ({ vehicle: v, match: calculateMatchScore(v, buyerForm) }))
      .sort((a, b) => b.match.score - a.match.score)
      .slice(0, 5);
  }, [buyerSubmitted, buyerForm, vehicleList]);

  const leadStatus = (score: number) => {
    if (score >= 60) return { label: 'HOT', color: 'text-red-400' };
    if (score >= 30) return { label: 'WARM', color: 'text-amber-400' };
    return { label: 'COLD', color: 'text-slate-400' };
  };

  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuyerSubmitted(true);
    setBuyerSaving(true);
    setBuyerSaveNote('');

    const topMatch = [...vehicleList]
      .map(v => ({ vehicle: v, match: calculateMatchScore(v, buyerForm) }))
      .sort((a, b) => b.match.score - a.match.score)[0];

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          fullname: buyerForm.fullname,
          mobile: buyerForm.mobile,
          email: buyerForm.email || null,
          location: buyerForm.location || null,
          vehicle_id: topMatch ? topMatch.vehicle.id : null
        })
      });
      if (!res.ok) {
        setBuyerSaveNote('Na-compute na yung match, pero hindi na-save sa leads table (check Supabase anon key / column names).');
      }
    } catch (err) {
      setBuyerSaveNote('Na-compute na yung match, pero walang connection sa Supabase para i-save.');
    } finally {
      setBuyerSaving(false);
    }
  };

  const resetBuyerForm = () => {
    setBuyerForm(emptyBuyerForm);
    setBuyerSubmitted(false);
    setBuyerSaveNote('');
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
              <span className="text-xs text-emerald-400 font-bold">✨ Live Updated</span>
            </div>
          </div>
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700 w-full sm:w-auto justify-center flex-wrap">
            <button
              onClick={() => setActiveTab('detector')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition ${activeTab === 'detector' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🛡️ Fraud Detector
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition ${activeTab === 'browse' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🔍 Market Search
            </button>
            <button
              onClick={() => setActiveTab('seller')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition ${activeTab === 'seller' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              ⚡ Seller Boost
            </button>
            <button
              onClick={() => setActiveTab('buyer')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition ${activeTab === 'buyer' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🎯 Buyer Match
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
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
                    {v.model} (Score: {calculateQualityScore(v).score})
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
                    <p className="text-xs text-slate-400">Monthly: ₱{v.monthly.toLocaleString()} | Bank: {v.bank} | Status: {v.status}</p>
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

        {activeTab === 'buyer' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Find Your Match</h2>
              <p className="text-slate-400 text-xs md:text-sm">Sagutan mo lang, ipapakita namin ang top units na bagay sa'yo.</p>
            </div>

            {!buyerSubmitted && (
              <form onSubmit={handleBuyerSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-5 md:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                    <input
                      required
                      value={buyerForm.fullname}
                      onChange={(e) => setBuyerForm(prev => ({ ...prev, fullname: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      placeholder="Juan Dela Cruz"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Mobile Number</label>
                    <input
                      required
                      value={buyerForm.mobile}
                      onChange={(e) => setBuyerForm(prev => ({ ...prev, mobile: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      placeholder="09XXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Email (optional)</label>
                    <input
                      type="email"
                      value={buyerForm.email}
                      onChange={(e) => setBuyerForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      placeholder="juan@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Location</label>
                    <input
                      value={buyerForm.location}
                      onChange={(e) => setBuyerForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      placeholder="Silang, Cavite"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Monthly Budget (Min)</label>
                    <input
                      type="number"
                      value={buyerForm.budgetMin}
                      onChange={(e) => setBuyerForm(prev => ({ ...prev, budgetMin: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Monthly Budget (Max)</label>
                    <input
                      type="number"
                      value={buyerForm.budgetMax}
                      onChange={(e) => setBuyerForm(prev => ({ ...prev, budgetMax: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      placeholder="45000"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Available Cashout/Downpayment</label>
                    <input
                      type="number"
                      value={buyerForm.downpayment}
                      onChange={(e) => setBuyerForm(prev => ({ ...prev, downpayment: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      placeholder="150000"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Preferred Brand</label>
                    <select
                      value={buyerForm.brand}
                      onChange={(e) => setBuyerForm(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="">Any</option>
                      <option>Toyota</option>
                      <option>Ford</option>
                      <option>Nissan</option>
                      <option>Honda</option>
                      <option>Mitsubishi</option>
                      <option>Jetour</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Body Type</label>
                    <select
                      value={buyerForm.type}
                      onChange={(e) => setBuyerForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="">Any</option>
                      <option>SUV</option>
                      <option>Pickup</option>
                      <option>Sedan</option>
                      <option>MPV</option>
                      <option>Van</option>
                      <option>Hatchback</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">When do you plan to get a unit?</label>
                    <select
                      required
                      value={buyerForm.urgency}
                      onChange={(e) => setBuyerForm(prev => ({ ...prev, urgency: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="">Select one</option>
                      <option value="asap">ASAP / Within a week</option>
                      <option value="this_month">Within this month</option>
                      <option value="1_3_months">1–3 months</option>
                      <option value="just_looking">Just looking around</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-red-600 hover:bg-red-500 py-3 rounded-lg text-sm font-bold">
                  Find My Match
                </button>
              </form>
            )}

            {buyerSubmitted && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <p className="text-slate-400 text-xs md:text-sm">
                    {buyerSaving ? 'Saving your info...' : buyerSaveNote ? buyerSaveNote : 'Naka-save na sa system yung info mo. Ito ang top matches:'}
                  </p>
                  <button onClick={resetBuyerForm} className="text-xs font-semibold text-red-400 hover:text-red-300 underline">
                    Start over
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {buyerMatches.map(({ vehicle, match }) => {
                    const status = leadStatus(match.score);
                    return (
                      <div key={vehicle.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                          <div>
                            <h4 className="font-bold text-base md:text-lg text-white">{vehicle.model}</h4>
                            <p className="text-xs text-slate-400">Monthly: ₱{vehicle.monthly.toLocaleString()} | Bank: {vehicle.bank} | Status: {vehicle.status}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xl md:text-2xl font-black text-emerald-400">{match.score}</span>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Match Score</p>
                          </div>
                        </div>
                        {match.reasons.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {match.reasons.map((r, i) => (
                              <span key={i} className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{r}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
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
