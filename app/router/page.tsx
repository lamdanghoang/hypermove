'use client'

import { useState } from 'react'
import { BTCFI_DATA, Protocol } from '@/data/btcfi-data'

export default function RouteOptimizerPage() {
  const [activeTab, setActiveTab] = useState('native')

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

  const getProtocolsForTab = () => {
    if (activeTab === 'native') {
      return BTCFI_DATA.native_btc
    } else if (activeTab === 'wrapped') {
      return BTCFI_DATA.wrapped_btc
    } else {
      return [...BTCFI_DATA.native_btc, ...BTCFI_DATA.wrapped_btc]
    }
  }

  const protocols = getProtocolsForTab()

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
          BTCFi Route Optimizer
        </h1>
        <p className="text-slate-400">Maximize your Bitcoin returns across native and wrapped protocols</p>
      </header>

      {/* Route Input Section */}
      <div className="mb-8">
        <div className="bg-slate-800/50 rounded-lg shadow-lg">
          <div className="p-6 border-b border-slate-700/50">
            <h3 className="text-xl font-bold">Route Configuration</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label">BTC Amount</label>
                  <input type="number" className="form-control" defaultValue="5.0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Risk Tolerance</label>
                  <select className="form-control">
                    <option value="conservative">Conservative</option>
                    <option value="balanced" selected>Balanced</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Time Horizon</label>
                  <select className="form-control">
                    <option value="30">1 Month</option>
                    <option value="90">3 Months</option>
                    <option value="180">6 Months</option>
                    <option value="365" selected>1 Year</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-900/50 rounded-lg">
                <div className="filter-group">
                  <label className="form-label">Bitcoin Type</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-teal-500 focus:ring-teal-500" />
                      <span>Native BTC</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-teal-500 focus:ring-teal-500" />
                      <span>Wrapped BTC</span>
                    </label>
                  </div>
                </div>
                <div className="filter-group">
                  <label className="form-label">Min APY</label>
                  <div className="flex items-center space-x-4">
                    <input type="range" min="0" max="20" defaultValue="0" className="w-full" />
                    <span className="text-teal-400 font-semibold">0%</span>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary btn-lg self-center">
                🎯 Generate Optimized Routes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Comparison Engine */}
      <div className="mb-8">
        <div className="bg-slate-800/50 rounded-lg shadow-lg">
          <div className="p-6 border-b border-slate-700/50">
            <h3 className="text-xl font-bold">Protocol Comparison Engine</h3>
          </div>
          <div className="p-6">
            <div className="flex space-x-2 bg-slate-900/50 p-1 rounded-lg mb-4">
              <TabButton
                label="Native BTC"
                isActive={activeTab === 'native'}
                onClick={() => handleTabClick('native')}
              />
              <TabButton
                label="Wrapped BTC"
                isActive={activeTab === 'wrapped'}
                onClick={() => handleTabClick('wrapped')}
              />
              <TabButton
                label="All Protocols"
                isActive={activeTab === 'all'}
                onClick={() => handleTabClick('all')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {protocols.map((protocol) => (
                <ProtocolComparisonCard key={protocol.protocol} protocol={protocol} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabButton({ label, isActive, onClick }: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
        isActive ? 'bg-teal-500 text-white' : 'text-slate-400 hover:bg-slate-700/50'
      }`}>
      {label}
    </button>
  )
}

function ProtocolComparisonCard({ protocol }: { protocol: Protocol }) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4">
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-2xl">{protocol.logo}</div>
        <div>
          <h4 className="font-bold">{protocol.protocol}</h4>
          <p className="text-sm text-slate-400">{protocol.type}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Current APY</span>
          <span className="font-semibold text-green-400">{protocol.current_apy}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">APY Range</span>
          <span className="font-semibold">{protocol.apy_min}% - {protocol.apy_max}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">TVL</span>
          <span className="font-semibold">{protocol.tvl}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Risk Level</span>
          <span className={`font-semibold ${protocol.risk_level.toLowerCase().includes('low')
              ? 'text-green-400'
              : protocol.risk_level.toLowerCase().includes('medium')
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}>{protocol.risk_level}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Security Score</span>
          <span className="font-semibold">{protocol.security_score}/10</span>
        </div>
      </div>
    </div>
  )
}
