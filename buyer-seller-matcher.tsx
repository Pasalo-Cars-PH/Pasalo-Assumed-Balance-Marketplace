import React, { useState, useMemo } from 'react';
import { Users, Target, Zap, TrendingUp, AlertCircle, CheckCircle, Heart, MapPin, DollarSign } from 'lucide-react';

const BuyerSellerMatcher = () => {
  const vehicleData = [
    { id: 1, model: '2026 Toyota Fortuner G A/T', monthly: 38767, bank: 'TFS', months: 60, cashout: 0, brand: 'Toyota', type: 'SUV', status: 'Brand New', demand: 'high' },
    { id: 2, model: '2026 Ford Everest Titanium 4x2', monthly: 47000, bank: 'BPI', months: 60, cashout: 0, brand: 'Ford', type: 'SUV', status: 'For Release', demand: 'high' },
    { id: 3, model: '2026 Toyota Raize G A/T', monthly: 18639, bank: 'TFS', months: 60, cashout: 180000, brand: 'Toyota', type: 'SUV', status: 'Brand New', demand: 'very_high' },
    { id: 4, model: '2026 Toyota Land Cruiser 300 ZX', monthly: 122000, bank: 'Direct', months: 60, cashout: 0, brand: 'Toyota', type: 'Full-Size SUV', status: 'Brand New', demand: 'medium' },
    { id: 5, model: '2026 Nissan Patrol 3.5L V6 4x4 A/T', monthly: 111099, bank: 'Direct', months: 60, cashout: 0, brand: 'Nissan', type: 'Full-Size SUV', status: 'Brand New', demand: 'medium' },
    { id: 6, model: '2026 Hilux Tamaraw FX DSL M/T', monthly: 26883, bank: 'TFS', months: 60, cashout: 170000, brand: 'Toyota', type: 'Pickup', status: 'Brand New', demand: 'high' },
    { id: 7, model: '2025 Honda Civic V CVT A/T', monthly: 33800, bank: 'BDO', months: 43, cashout: 0, brand: 'Honda', type: 'Sedan', status: 'Assume Balance', demand: 'high' },
    { id: 8, model: '2025 Toyota Hilux GR-S 4x4 A/T', monthly: 43232, bank: 'BDO', months: 46, cashout: 0, brand: 'Toyota', type: 'Pickup', status: 'Assume Balance', demand: 'high' },
    { id: 9, model: '2026 Mitsubishi Xpander Cross A/T', monthly: 28878, bank: 'EastWest', months: 60, cashout: 0, brand: 'Mitsubishi', type: 'MPV', status: 'For Release', demand: 'high' },
    { id: 10, model: '2026 Toyota Wigo G CVT', monthly: 15513, bank: 'TFS', months: 60, cashout: 145000, brand: 'Toyota', type: 'Hatchback', status: 'Brand New', demand: 'very_high' },
    { id: 11, model: '2026 Toyota Yaris Cross Hybrid', monthly: 29789, bank: 'TFS', months: 60, cashout: 0, brand: 'Toyota', type: 'Crossover', status: 'For Release', demand: 'high' },
    { id: 12, model: '2026 Toyota Innova Zenix Q HEV', monthly: 43243, bank: 'SRP', months: 60, cashout: 0, brand: 'Toyota', type: 'MPV', status: 'For Release', demand: 'high' },
    { id: 13, model: '2026 Ford Ranger Raptor 4x4 A/T', monthly: 54000, bank: 'BPI', months: 60, cashout: 0, brand: 'Ford', type: 'Pickup', status: 'For Release', demand: 'medium' },
    { id: 14, model: '2025 BAIC B60 TDi Hybrid', monthly: 45357, bank: 'Direct', months: 48, cashout: 0, brand: 'BAIC', type: 'SUV', status: 'Assume Balance', demand: 'medium' },
    { id: 15, model: '2026 Mitsubishi Montero Sport GLS', monthly: 39891, bank: 'BDO', months: 60, cashout: 0, brand: 'Mitsubishi', type: 'SUV', status: 'Brand New', demand: 'high' },
    { id: 16, model: '2026 MG 4 AT Electric Vehicle', monthly: 27619, bank: 'Direct', months: 60, cashout: 0, brand: 'MG', type: 'Crossover', status: 'Brand New', demand: 'medium' },
    { id: 17, model: '2026 Suzuki Ertiga Hybrid AT', monthly: 24457, bank: 'PSBank', months: 60, cashout: 0, brand: 'Suzuki', type: 'MPV', status: 'For Release', demand: 'high' },
    { id: 18, model: '2026 Toyota Avanza E CVT', monthly: 22476, bank: 'TFS', months: 60, cashout: 0, brand: 'Toyota', type: 'MPV', status: 'Assume Balance', demand: 'high' },
    { id: 19, model: '2026 Jetour X70 i-DM A/T', monthly: 32251, bank: 'RCBC', months: 60, cashout: 350000, brand: 'Jetour', type: 'SUV', status: 'Brand New', demand: 'medium' },
    { id: 20, model: '2026 Toyota Avanza 1.3 E CVT', monthly: 23245, bank: 'TFS', months: 60, cashout: 170000, brand: 'Toyota', type: 'MPV', status: 'For Release', demand: 'high' },
    { id: 21, model: '2026 MG 5 Core A/T', monthly: 15309, bank: 'Direct', months: 60, cashout: 100000, brand: 'MG', type: 'Sedan', status: 'Brand New', demand: 'high' },
    { id: 22, model: '2026 Toyota Vios XLE CVT A/T', monthly: 17966, bank: 'TFS', months: 60, cashout: 120000, brand: 'Toyota', type: 'Sedan', status: 'Brand New', demand: 'high' },
    { id: 23, model: '2026 Ford Mustang Mach-E A/T', monthly: 54287, bank: 'Direct', months: 60, cashout: 1200000, brand: 'Ford', type: 'Performance SUV', status: 'Brand New', demand: 'low' },
    { id: 24, model: '2026 Nissan Terra VL 4x2 A/T', monthly: 45800, bank: 'Direct', months: 56, cashout: 350000, brand: 'Nissan', type: 'SUV', status: 'Assume Balance', demand: 'medium' },
    { id: 25, model: '2026 Toyota Hiace GL Grandia A/T', monthly: 49890, bank: 'Direct', months: 57, cashout: 608000, brand: 'Toyota', type: 'Van', status: 'Assume Balance', demand: 'medium' },
    { id: 26, model: '2021 Mitsubishi Montero GLX M/T', monthly: 35352, bank: 'SAFC', months: 21, cashout: 195000, brand: 'Mitsubishi', type: 'SUV', status: 'Assume Balance', demand: 'medium' },
    { id: 27, model: '2025 Dongfeng Forthing U-Tour 1.5T Luxury A/T', monthly: 28608, bank: 'Direct', months: 42, cashout: 190000, brand: 'Dongfeng', type: 'SUV', status: 'Assume Balance', demand: 'medium' },
    { id: 28, model: '2025 Mitsubishi Montero Sport GLX M/T', monthly: 29000, bank: 'EastWest', months: 45, cashout: 0, brand: 'Mitsubishi', type: 'SUV', status: 'Assume Balance', demand: 'high' },
    { id: 29, model: '2022 Geely Emgrand Comfort A/T', monthly: 19367, bank: 'Direct', months: 18, cashout: 150000, brand: 'Geely', type: 'Sedan', status: 'Assume Balance', demand: 'medium' },
    { id: 30, model: '2026 Mitsubishi Triton GLX A/T', monthly: 29000, bank: 'Direct', months: 56, cashout: 220000, brand: 'Mitsubishi', type: 'Pickup', status: 'Assume Balance', demand: 'high' }
  ];

  const buyerProfiles = [
    { name: 'First-Time Buyer', budgetMin: 12000, budgetMax: 25000, preference: ['Sedan', 'Hatchback', 'Crossover'], weight: 0.25 },
    { name: 'OFW (Overseas Worker)', budgetMin: 25000, budgetMax: 50000, preference: ['SUV', 'MPV', 'Pickup'], weight: 0.30 },
    { name: 'Family Oriented', budgetMin: 20000, budgetMax: 45000, preference: ['MPV', 'SUV', 'Crossover'], weight: 0.20 },
    { name: 'Luxury/Premium', budgetMin: 50000, budgetMax: 150000, preference: ['Full-Size SUV', 'Performance SUV', 'Van'], weight: 0.10 },
    { name: 'Budget Conscious', budgetMin: 10000, budgetMax: 20000, preference: ['Sedan', 'Hatchback'], weight: 0.15 },
  ];

  const [selectedVehicle, setSelectedVehicle] = useState(vehicleData[0]);
  const [view, setView] = useState('seller');
  const [buyerBudget, setBuyerBudget] = useState(25000);

  const calculateBuyerMatches = (vehicle) => {
    const matches = buyerProfiles.map(profile => {
      const budgetMatch = vehicle.monthly >= profile.budgetMin && vehicle.monthly <= profile.budgetMax;
      const typeMatch = profile.preference.includes(vehicle.type);
      
      let score = 0;
      if (budgetMatch) score += 40;
      if (typeMatch) score += 30;
      if (vehicle.demand === 'very_high' || vehicle.demand === 'high') score += 20;
      if (vehicle.status === 'Brand New') score += 10;
      
      const estimatedBuyers = Math.floor(Math.random() * 15) + 5;
      
      return {
        profile: profile.name,
        score: Math.min(100, score),
        budgetMatch,
        typeMatch,
        estimatedBuyers: Math.floor(estimatedBuyers * profile.weight * 100),
        budgetMin: profile.budgetMin,
        budgetMax: profile.budgetMax,
      };
    });

    return matches.sort((a, b) => b.score - a.score);
  };

  const buyerMatches = useMemo(() => calculateBuyerMatches(selectedVehicle), [selectedVehicle]);

  const vehiclesForBuyer = useMemo(() => {
    return vehicleData
      .filter(v => v.monthly <= buyerBudget + 3000 && v.monthly >= buyerBudget - 3000)
      .map(v => {
        let matchScore = 50;
        const priceDiff = Math.abs(v.monthly - buyerBudget);
        matchScore += Math.max(0, 30 - (priceDiff / 100));
        if (v.demand === 'very_high' || v.demand === 'high') matchScore += 15;
        if (v.status === 'Brand New') matchScore += 5;
        
        return {
          ...v,
          matchScore: Math.min(100, Math.round(matchScore)),
          relevance: Math.abs(v.monthly - buyerBudget) <= 1000 ? 'EXACT MATCH' : Math.abs(v.monthly - buyerBudget) <= 3000 ? 'CLOSE MATCH' : 'ALTERNATIVE'
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [buyerBudget]);

  const totalBuyerEstimate = buyerMatches.reduce((sum, m) => sum + m.estimatedBuyers, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="text-blue-400" size={40} />
            AI Buyer-Seller Matcher
          </h1>
          <p className="text-slate-400">Connect your vehicles to the right buyers instantly</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setView('seller')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'seller'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-blue-500'
            }`}
          >
            🚗 Seller View
          </button>
          <button
            onClick={() => setView('buyer')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'buyer'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-blue-500'
            }`}
          >
            👤 Buyer View
          </button>
        </div>

        {view === 'seller' && (
          <div className="space-y-8">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <label className="block text-sm font-semibold text-white mb-3">
                Select Vehicle to Find Buyers
              </label>
              <select 
                value={selectedVehicle.id} 
                onChange={(e) => setSelectedVehicle(vehicleData.find(v => v.id === parseInt(e.target.value)))}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
              >
                {vehicleData.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.model} — ₱{vehicle.monthly.toLocaleString()}/mo
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">TOTAL BUYER MATCHES</p>
                <p className="text-3xl font-bold text-blue-300">{totalBuyerEstimate}</p>
                <p className="text-xs text-slate-500 mt-2">Active inquiries possible</p>
              </div>
              <div className="bg-emerald-900/30 border border-emerald-600/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">BEST MATCH SEGMENT</p>
                <p className="text-xl font-bold text-emerald-300">{buyerMatches[0]?.profile}</p>
                <p className="text-xs text-slate-500 mt-2">{buyerMatches[0]?.score}% match score</p>
              </div>
              <div className="bg-purple-900/30 border border-purple-600/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">VEHICLE PRICE</p>
                <p className="text-lg font-bold text-purple-300">₱{selectedVehicle.monthly.toLocaleString()}/mo</p>
                <p className="text-xs text-slate-500 mt-2">{selectedVehicle.status}</p>
              </div>
              <div className="bg-orange-900/30 border border-orange-600/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">INQUIRY RATE</p>
                <p className="text-3xl font-bold text-orange-300">
                  {selectedVehicle.demand === 'very_high' ? '↑ HIGH' : selectedVehicle.demand === 'high' ? '→ GOOD' : '↓ LOW'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Target size={28} className="text-blue-400" />
                Buyer Segment Matches
              </h2>
              
              {buyerMatches.map((match, idx) => (
                <div key={idx} className={`border rounded-lg p-5 ${
                  match.score >= 80 
                    ? 'bg-emerald-900/20 border-emerald-600/30' 
                    : match.score >= 60 
                    ? 'bg-blue-900/20 border-blue-600/30' 
                    : 'bg-slate-800 border-slate-700'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{match.profile}</h3>
                      <p className="text-sm text-slate-400 mt-1">Budget: ₱{Math.floor(match.budgetMin/1000)}K - ₱{Math.floor(match.budgetMax/1000)}K</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-300">{match.score}%</div>
                      <div className="text-sm text-slate-400">Match Score</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-700">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Est. Buyers</p>
                      <p className="text-2xl font-bold text-white">{match.estimatedBuyers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Status</p>
                      <div className="flex gap-2">
                        {match.budgetMatch && <span className="px-2 py-1 bg-emerald-600/30 text-emerald-300 text-xs rounded">Budget ✓</span>}
                        {match.typeMatch && <span className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded">Type ✓</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded font-semibold">
                        Target →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'buyer' && (
          <div className="space-y-8">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <label className="block text-sm font-semibold text-white mb-4">
                Your monthly budget? (₱)
              </label>
              <div className="space-y-4">
                <input 
                  type="range" 
                  min={10000} 
                  max={130000} 
                  step={1000}
                  value={buyerBudget}
                  onChange={(e) => setBuyerBudget(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">₱10K</span>
                  <span className="text-3xl font-bold text-blue-300">₱{buyerBudget.toLocaleString()}/mo</span>
                  <span className="text-slate-400 text-sm">₱130K</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Perfect Matches for Your Budget ({vehiclesForBuyer.length} vehicles)
              </h2>

              {vehiclesForBuyer.length > 0 ? (
                vehiclesForBuyer.map((vehicle) => (
                  <div key={vehicle.id} className={`border rounded-lg p-5 ${
                    vehicle.relevance === 'EXACT MATCH'
                      ? 'bg-emerald-900/20 border-emerald-600/30'
                      : vehicle.relevance === 'CLOSE MATCH'
                      ? 'bg-blue-900/20 border-blue-600/30'
                      : 'bg-slate-800 border-slate-700'
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-white">{vehicle.model}</h3>
                        <p className="text-sm text-slate-400 mt-1">{vehicle.status}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-slate-400 mb-1">Monthly</p>
                        <p className="text-2xl font-bold text-white">₱{vehicle.monthly.toLocaleString()}</p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-slate-400 mb-1">Match</p>
                        <p className="text-3xl font-bold text-blue-300">{vehicle.matchScore}%</p>
                      </div>

                      <div className="text-center">
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
                          View →
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
                  <p className="text-slate-400">No exact matches. Try adjusting ±₱5K</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-12 text-slate-500 text-sm border-t border-slate-700 pt-8">
          <p>AI Buyer-Seller Matcher v1.0 | Pasalo Cars PH</p>
        </div>
      </div>
    </div>
  );
};

export default BuyerSellerMatcher;
