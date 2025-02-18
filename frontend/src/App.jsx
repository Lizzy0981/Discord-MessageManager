import React, { useState } from 'react'
import DiscordDashboard from './components/DiscordDashboard'
import MessageSchedulerDashboard from './components/MessageSchedulerDashboard'

export default function App() {
  const [currentView, setCurrentView] = useState('discord') 

  return (
    <div className="app">
      <nav className="fixed top-0 left-0 right-0 bg-[#5865F2] p-4 z-50">
        <div className="max-w-6xl mx-auto flex justify-center gap-4">
          <button 
            onClick={() => setCurrentView('discord')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              currentView === 'discord' 
                ? 'bg-white text-[#5865F2] shadow-lg' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            Dashboard Principal
          </button>
          <button 
            onClick={() => setCurrentView('scheduler')}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              currentView === 'scheduler' 
                ? 'bg-white text-[#5865F2] shadow-lg' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            Mensajes Programados
          </button>
        </div>
      </nav>

      <div className="pt-20">
        {currentView === 'discord' ? (
          <DiscordDashboard />
        ) : (
          <MessageSchedulerDashboard />
        )}
      </div>
    </div>
  )
}