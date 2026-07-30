import React, { useState, useMemo } from 'react';
import { TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, Users } from 'lucide-react';

const PricingDashboard = () => {
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

  const [selectedVehicle, setSelectedVehicle] = useState(vehicleData[0]);
  const [priceAdjustment, setPriceAdjustment] = useState(0);

  // Market Analysis Algorithm
  const marketAnalysis = useMemo(() => {
    const sameType = vehicleData.filter(v => v.type === selectedVehicle.type);
    const sameBrand = vehicleData.filter(v => v.brand === selectedVehicle.brand);
    const samePriceRange = vehicleData.filter(v => 
      Math.abs(v.monthly - selectedVehicle.monthly) <= selectedVehicle.monthly * 0.15
    );

    const avgPriceType = sameType.reduce((a, b) => a + b.monthly, 0) / sameType.length;
    const avgPriceBrand = sameBrand.reduce((a, b) => a + b.monthly, 0) / sameBrand.length;
    const avgPriceRange = samePriceRange.reduce((a, b) => a + b.monthly, 0) / samePriceRange.length;

    const fairMarketPrice = (avgPriceType + avgPriceBrand + avgPriceRange) / 3;
    const priceDifference = selectedVehicle.monthly - fairMarketPrice;
    const percentDiff = (priceDifference / fairMarketPrice) * 100;

    // Demand multiplier based on status and type
    let demandScore = 0.5;
    if (selectedVehicle.status === 'Brand New') demandScore += 0.3;
    if (selectedVehicle.status === 'For Release') demandScore += 0.2;
    if (selectedVehicle.demand === 'very_high') demandScore += 0.4;
    if (selectedVehicle.demand === 'high') demandScore += 0.2;

    // Days to sell calculation
    const daysToSell = Math.max(3, Math.round(30 - (demandScore * 20)));

    // Recommended price for faster sale
    const recommendedPrice = Math.round(fairMarketPrice * 0.98);

    // Buyer unlock analysis
    const potentialBuyersAtNewPrice = vehicleData.filter(v => 
      v.type === selectedVehicle.type && 
      v.monthly <= recommendedPrice + 2000 &&
      v.monthly >= recommendedPrice - 2000
    ).length;

    const currentMatches = samePriceRange.length;

    return {
      fairMarketPrice: Math.round(fairMarketPrice),
      priceDifference: Math.round(priceDifference),
      percentDiff: percentDiff.toFixed(1),
      daysToSell,
      recommendedPrice,
      demandScore: (demandScore * 100).toFixed(0),
      competitorCount: sameType.length,
      sameTypeAvg: Math.round(avgPriceType),
      currentMatches,
      potentialBuyersAtNewPrice
    };
  }, [selectedVehicle]);

  const adjustedPrice = selectedVehicle.monthly + priceAdjustment;
  const priceStatus = selectedVehicle.monthly < marketAnalysis.fairMarketPrice 
    ? 'competitive' 
    : selectedVehicle.monthly > marketAnalysis.fairMarketPrice * 1.05
    ? 'overpriced'
    : 'optimal';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="text-emerald-400" size={40} />
            AI Pricing Intelligence
          </h1>
          <p className="text-slate-400">Pasalo Cars PH Market Analysis Engine</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Vehicle Selector */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <label className="block text-sm font-semibold text-white mb-3">
                Select Vehicle to Analyze
              </label>
              <select 
                value={selectedVehicle.id} 
                onChange={(e) => {
                  const vehicle = vehicleData.find(v => v.id === parseInt(e.target.value));
                  setSelectedVehicle(vehicle);
                  setPriceAdjustment(0);
                }}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-400"
              >
                {vehicleData.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.model} — ₱{vehicle.monthly.toLocaleString()}/mo
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-lg p-6">
            <p className="text-sm text-emerald-300 mb-2">DEMAND SCORE</p>
            <p className="text-3xl font-bold text-emerald-400">{marketAnalysis.demandScore}%</p>
            <p className="text-xs text-slate-400 mt-2">{selectedVehicle.demand.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Current Price Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={18} className="text-blue-400" />
              <span className="text-xs font-semibold text-slate-400">YOUR CURRENT PRICE</span>
            </div>
            <p className="text-2xl font-bold text-white">₱{selectedVehicle.monthly.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-2">{selectedVehicle.status}</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-amber-400" />
              <span className="text-xs font-semibold text-slate-400">FAIR MARKET PRICE</span>
            </div>
            <p className="text-2xl font-bold text-amber-300">₱{marketAnalysis.fairMarketPrice.toLocaleString()}</p>
            <p className={`text-xs mt-2 ${marketAnalysis.priceDifference < 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
              {marketAnalysis.priceDifference < 0 ? '↓' : '↑'} {Math.abs(marketAnalysis.percentDiff)}%
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-purple-400" />
              <span className="text-xs font-semibold text-slate-400">EST. DAYS TO SELL</span>
            </div>
            <p className="text-2xl font-bold text-purple-300">{marketAnalysis.daysToSell}-{marketAnalysis.daysToSell + 5}</p>
            <p className="text-xs text-slate-500 mt-2">At current price</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-cyan-400" />
              <span className="text-xs font-semibold text-slate-400">MARKET POSITION</span>
            </div>
            <p className={`text-2xl font-bold ${priceStatus === 'competitive' ? 'text-emerald-400' : priceStatus === 'optimal' ? 'text-cyan-400' : 'text-orange-400'}`}>
              {priceStatus === 'competitive' ? '📍 GOOD' : priceStatus === 'optimal' ? '✓ OPTIMAL' : '⚠ HIGH'}
            </p>
            <p className="text-xs text-slate-500 mt-2 capitalize">{priceStatus}</p>
          </div>
        </div>

        {/* Price Adjustment Slider */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Price Optimization Tool</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-slate-300">Adjust Price</label>
                <span className="text-2xl font-bold text-emerald-400">₱{adjustedPrice.toLocaleString()}/mo</span>
              </div>
              <input 
                type="range" 
                min={-5000} 
                max={5000} 
                step={100}
                value={priceAdjustment}
                onChange={(e) => setPriceAdjustment(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>-₱5K</span>
                <span>Current: {priceAdjustment > 0 ? '+' : ''}{priceAdjustment === 0 ? 'No change' : `₱${Math.abs(priceAdjustment).toLocaleString()}`}</span>
                <span>+₱5K</span>
              </div>
            </div>

            {/* Insights from price adjustment */}
            {priceAdjustment !== 0 && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertCircle size={18} className="text-blue-400" />
                  Price Adjustment Impact
                </h4>
                <div className="space-y-2 text-sm">
                  {priceAdjustment < 0 ? (
                    <>
                      <p className="text-emerald-400">✓ Price cut attracts budget-conscious buyers</p>
                      <p className="text-slate-300">Estimated faster sale: {Math.max(2, marketAnalysis.daysToSell - Math.floor(Math.abs(priceAdjustment) / 1000))} days</p>
                      <p className="text-slate-300">New buyer matches: +{Math.floor(Math.abs(priceAdjustment) / 500)} potential inquiries</p>
                    </>
                  ) : (
                    <>
                      <p className="text-orange-400">⚠ Price increase reduces buyer pool</p>
                      <p className="text-slate-300">May slow down sale by ~{Math.floor(priceAdjustment / 1000)} days</p>
                      <p className="text-slate-300">Only justified if: brand new condition or unique features</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Recommendation */}
          <div className={`border rounded-lg p-6 ${priceStatus === 'optimal' ? 'bg-emerald-900/20 border-emerald-600/30' : 'bg-amber-900/20 border-amber-600/30'}`}>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              {priceStatus === 'optimal' ? <CheckCircle className="text-emerald-400" size={24} /> : <AlertCircle className="text-amber-400" size={24} />}
              Pricing Recommendation
            </h3>
            <div className="space-y-3 text-sm">
              <p className="text-slate-300">
                <span className="font-semibold">Recommended Price: </span>
                <span className="text-xl font-bold text-emerald-400">₱{marketAnalysis.recommendedPrice.toLocaleString()}/mo</span>
              </p>
              <p className="text-slate-300">
                This price aligns with {selectedVehicle.type} segment and maximizes buyer matches
              </p>
              <p className="text-slate-400 text-xs">
                {selectedVehicle.monthly > marketAnalysis.recommendedPrice 
                  ? `Potential 2-3 day faster sale if reduced by ₱${(selectedVehicle.monthly - marketAnalysis.recommendedPrice).toLocaleString()}`
                  : 'Your current price is competitive'}
              </p>
            </div>
          </div>

          {/* Competitor Analysis */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Competitor Landscape</h3>
            <div className="space-y-3 text-sm">
              <p className="text-slate-300">
                <span className="font-semibold">{selectedVehicle.type} Models: </span>
                <span className="text-white">{marketAnalysis.competitorCount} active listings</span>
              </p>
              <p className="text-slate-300">
                <span className="font-semibold">Avg Price (Same Type): </span>
                <span className="text-white">₱{marketAnalysis.sameTypeAvg.toLocaleString()}/mo</span>
              </p>
              <p className="text-slate-300">
                <span className="font-semibold">Similar Price Range: </span>
                <span className="text-white">{marketAnalysis.currentMatches} comparable units</span>
              </p>
              <p className="text-slate-400 text-xs">
                You're in the {marketAnalysis.currentMatches > 3 ? 'competitive' : 'unique'} segment
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Unlock */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-600/30 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-400" size={24} />
            💰 Revenue Unlock Potential
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">CURRENT MONTHLY</p>
              <p className="text-2xl font-bold text-blue-300">₱{selectedVehicle.monthly.toLocaleString()}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">OPTIMIZED MONTHLY</p>
              <p className="text-2xl font-bold text-emerald-300">₱{marketAnalysis.recommendedPrice.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">
                {marketAnalysis.recommendedPrice > selectedVehicle.monthly 
                  ? `+₱${(marketAnalysis.recommendedPrice - selectedVehicle.monthly).toLocaleString()}/mo` 
                  : `-₱${(selectedVehicle.monthly - marketAnalysis.recommendedPrice).toLocaleString()}/mo`}
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">5-YEAR IMPACT</p>
              <p className="text-2xl font-bold text-purple-300">
                ₱{((marketAnalysis.recommendedPrice - selectedVehicle.monthly) * 60).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">Full term profit/loss</p>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Current Listing Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-400 mb-1">Brand</p>
              <p className="text-white font-semibold">{selectedVehicle.brand}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Type</p>
              <p className="text-white font-semibold">{selectedVehicle.type}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Financing</p>
              <p className="text-white font-semibold">{selectedVehicle.bank}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Term</p>
              <p className="text-white font-semibold">{selectedVehicle.months} months</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Cash Out</p>
              <p className="text-white font-semibold">₱{selectedVehicle.cashout.toLocaleString() || 'None'}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Status</p>
              <p className="text-white font-semibold">{selectedVehicle.status}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Demand</p>
              <p className="text-emerald-400 font-semibold capitalize">{selectedVehicle.demand.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Total Amount</p>
              <p className="text-white font-semibold">₱{(selectedVehicle.monthly * selectedVehicle.months).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>AI Pricing Intelligence v1.0 | Pasalo Cars PH Market Analysis Engine</p>
          <p className="mt-2">Data last updated: July 30, 2026 | {vehicleData.length} vehicles analyzed</p>
        </div>
      </div>
    </div>
  );
};

export default PricingDashboard;