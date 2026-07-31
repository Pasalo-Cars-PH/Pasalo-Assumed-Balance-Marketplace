import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  TrendingUp, 
  Award, 
  Car, 
  CheckCircle2, 
  FileText, 
  UserCheck, 
  Clock, 
  ArrowRight,
  Sparkles,
  Users,
  Filter
} from 'lucide-react';

// Sample mock data for existing listings
const MOCK_VEHICLES = [
  {
    id: '1',
    name: '2026 Toyota Fortuner G A/T',
    plateEnding: '8',
    location: 'Quezon City',
    cashout: 350000,
    monthly: 28500,
    monthsLeft: 36,
    bank: 'BDO Unibank',
    trustScore: 100,
    orcrStatus: 'Verified',
    sellerStatus: 'ID Verified',
    photosCount: 8,
    issues: 'None'
  },
  {
    id: '2',
    name: '2025 Mitsubishi Montero Sport GLS',
    plateEnding: '3',
    location: 'Cebu City',
    cashout: 280000,
    monthly: 26000,
    monthsLeft: 42,
    bank: 'EastWest Bank',
    trustScore: 85,
    orcrStatus: 'Pending Verification',
    sellerStatus: 'ID Verified',
    photosCount: 5,
    issues: 'Minor Scratch'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'fraud' | 'search' | 'boost' | 'intake'>('intake');
  const [selectedVehicle, setSelectedVehicle] = useState(MOCK_VEHICLES[0]);

  // Buyer Intake Form State
  const [buyerName, setBuyerName] = useState('');
  const [budgetCashout, setBudgetCashout] = useState('');
  const [preferredModel, setPreferredModel] = useState('');
  const [locationPref, setLocationPref] = useState('');
  const [intakeSubmitted, setIntakeSubmitted] = useState(false);

  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIntakeSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl text-white shadow-lg shadow-red-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Pasalo Cars PH
              </h1>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live System v3.5
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('intake')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'intake'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              Buyer Match Intake
            </button>
            <button
              onClick={() => setActiveTab('fraud')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'fraud'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Fraud Detector
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'search'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-4 h-4" />
              Market Search
            </button>
            <button
              onClick={() => setActiveTab('boost')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'boost'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Seller Boost
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* TAB 1: BUYER MATCH INTAKE */}
        {activeTab === 'intake' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-red-500" />
                Smart Buyer Match Intake
              </h2>
              <p className="text-slate-400 text-sm">
                Hanapan natin ng tamang pasalo car ang budget at preference mo.
              </p>
            </div>

            {intakeSubmitted ? (
              <div className="bg-slate-900 border border-emerald-500/30 p-8 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Salamat, {buyerName}!</h3>
                <p className="text-slate-300 text-sm">
                  Narehistro na ang iyong mga preference. Hahanapan ka ng system ng verified sellers na tumutugma sa iyong budget!
                </p>
                <button
                  onClick={() => setIntakeSubmitted(false)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-all"
                >
                  Mag-submit ng Bagong Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleIntakeSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Pangalan (Full Name)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Juan Dela Cruz"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-red-500 transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Max Cashout Budget (PHP)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 300000"
                      value={budgetCashout}
                      onChange={(e) => setBudgetCashout(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-red-500 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Preferred Location
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Metro Manila / Cebu"
                      value={locationPref}
                      onChange={(e) => setLocationPref(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-red-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Preferred Vehicle / Model
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUV, Fortuner, Vios, MPV"
                    value={preferredModel}
                    onChange={(e) => setPreferredModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-red-500 transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  Mag-hanap ng Verified Match
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: FRAUD DETECTOR */}
        {activeTab === 'fraud' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Listing Trust & Fraud Analysis</h2>
              <p className="text-slate-400 text-sm">Select a vehicle to inspect system-identified risk factors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Select Vehicle To Inspect
                </label>
                <div className="space-y-2">
                  {MOCK_VEHICLES.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVehicle(v)}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                        selectedVehicle.id === v.id
                          ? 'border-red-500 bg-red-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-semibold">{v.name}</div>
                      <div className="text-xs text-slate-500">Trust Score: {v.trustScore}/100</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedVehicle.name}</h3>
                    <p className="text-sm text-slate-400">{selectedVehicle.location} • Plate Ending: {selectedVehicle.plateEnding}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-emerald-400">{selectedVehicle.trustScore}</span>
                    <span className="text-xs text-slate-400 block">/ 100 Trust Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-xs block">OR/CR Document</span>
                    <span className="font-medium text-emerald-400 flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-4 h-4" /> {selectedVehicle.orcrStatus}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-xs block">Seller Identity</span>
                    <span className="font-medium text-emerald-400 flex items-center gap-1 mt-1">
                      <UserCheck className="w-4 h-4" /> {selectedVehicle.sellerStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MARKET SEARCH */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Market Search & Comparison</h2>
                <p className="text-slate-400 text-sm">Tingnan ang lahat ng available na pasalo cars.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_VEHICLES.map((v) => (
                <div key={v.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-white">{v.name}</h3>
                      <span className="text-xs text-slate-400">{v.location}</span>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium">
                      {v.trustScore}% Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-lg text-center text-xs">
                    <div>
                      <span className="text-slate-500 block">Cashout</span>
                      <span className="font-bold text-white text-sm">₱{v.cashout.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Monthly</span>
                      <span className="font-bold text-white text-sm">₱{v.monthly.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Remaining</span>
                      <span className="font-bold text-white text-sm">{v.monthsLeft} mos</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SELLER BOOST */}
        {activeTab === 'boost' && (
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Seller Boost Services</h2>
            <p className="text-slate-400 text-sm">
              Gusto mo bang maibenta agad ang iyong pasalo car? I-verify ang OR/CR at mag-apply para sa Certified Buyer Match!
            </p>
            <button className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-red-600/20">
              Submit Vehicle Listing
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Pasalo Cars PH Platform Engine © 2026 | Built for High-Trust Auto Marketplace
      </footer>
    </div>
  );
}
