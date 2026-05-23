import React from 'react';
import { Bug, Trophy, Zap, MessageSquare, Terminal, Medal, Star, Code2 } from 'lucide-react';
import RightSidebar from '../components/RightSidebar/RightSidebar';

function AboutApp() {
  return (
    <div className="grid grid-cols-3">
      <div className="col-span-2 py-6 pr-8 pl-4 h-[calc(100vh-85px)] overflow-y-auto custom-scrollbar">
        
        {/* HERO SECTION */}
        <div className="bg-gradient-to-br from-[#0b1d35] to-[#050c1a] rounded-3xl p-8 md:p-12 border border-indigo-500/30 mb-10 relative overflow-hidden shadow-2xl shadow-indigo-500/10">
          <div className="absolute -top-10 -right-10 p-8 opacity-5 text-indigo-300 transform rotate-12 scale-150">
            <Terminal size={250} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-6 border border-indigo-500/30 shadow-inner shadow-indigo-500/20">
              <Code2 size={14} /> DEBuzzer Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
              Squash Bugs.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">
                Become a Grandmaster.
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl leading-relaxed font-medium">
              DEBuzzer is the ultimate collaborative platform for developers. Post your nastiest bugs, solve issues for others, earn XP, and climb the global leaderboard.
            </p>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mb-10">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Zap className="text-yellow-400 fill-yellow-400" size={28} /> How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#081221] p-6 rounded-2xl border border-gray-800/80 hover:border-indigo-500/50 hover:bg-[#0b182b] transition-all duration-300 shadow-lg hover:shadow-indigo-500/10 group">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Bug className="text-orange-400" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Post a Bug</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Stuck on a tricky error? Post it to the Explore feed. Attach screenshots, select your OS, and let the community help you debug it in real-time.
              </p>
            </div>

            <div className="bg-[#081221] p-6 rounded-2xl border border-gray-800/80 hover:border-blue-500/50 hover:bg-[#0b182b] transition-all duration-300 shadow-lg hover:shadow-blue-500/10 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="text-blue-400" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Provide Solutions</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Browse the Explore tab for Unsolved Bugs. Write a detailed solution and submit it. The original author can then accept your fix.
              </p>
            </div>

            <div className="bg-[#081221] p-6 rounded-2xl border border-gray-800/80 hover:border-yellow-500/50 hover:bg-[#0b182b] transition-all duration-300 shadow-lg hover:shadow-yellow-500/10 group">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="text-yellow-400 fill-yellow-400/20" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Earn XP & Ratings</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                When you provide a solution, users can rate it from 1 to 5 stars. Every star you earn multiplies your total XP on the platform!
              </p>
            </div>

            <div className="bg-[#081221] p-6 rounded-2xl border border-gray-800/80 hover:border-green-500/50 hover:bg-[#0b182b] transition-all duration-300 shadow-lg hover:shadow-green-500/10 group">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="text-green-400" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">4. Climb the Leaderboard</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Compete against developers worldwide. Amass XP and accepted solutions to climb the global rankings from Novice to Grandmaster.
              </p>
            </div>
          </div>
        </div>

        {/* RANKING TIERS */}
        <div className="bg-[#050c1a] p-8 rounded-3xl border border-gray-800/80 shadow-xl mb-8">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <Medal className="text-indigo-400" size={28} /> Ranking Tiers
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-[#081221] rounded-2xl border border-gray-800/60 hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-2 h-10 rounded-full bg-gray-500"></div>
                <div>
                  <h4 className="font-bold text-white text-base">Novice Debugger</h4>
                  <p className="text-xs text-gray-500">Getting started</p>
                </div>
              </div>
              <div className="text-sm font-mono text-gray-400 font-medium bg-gray-500/10 px-3 py-1.5 rounded-lg">0 - 100 XP</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#081221] rounded-2xl border border-gray-800/60 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-2 h-10 rounded-full bg-blue-500"></div>
                <div>
                  <h4 className="font-bold text-white text-base">Advanced Debugger</h4>
                  <p className="text-xs text-blue-500/70">Proven problem solver</p>
                </div>
              </div>
              <div className="text-sm font-mono text-blue-400 font-medium bg-blue-500/10 px-3 py-1.5 rounded-lg">100 - 400 XP</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#081221] rounded-2xl border border-gray-800/60 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-2 h-10 rounded-full bg-purple-500"></div>
                <div>
                  <h4 className="font-bold text-white text-base">Master Debugger</h4>
                  <p className="text-xs text-purple-500/70">Elite contributor</p>
                </div>
              </div>
              <div className="text-sm font-mono text-purple-400 font-medium bg-purple-500/10 px-3 py-1.5 rounded-lg">400 - 1000 XP</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#081221] to-yellow-900/20 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/60 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.05)] relative overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-yellow-500/10 to-transparent"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-2 h-10 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]"></div>
                <div>
                  <h4 className="font-bold text-yellow-400 text-base flex items-center gap-2">Grandmaster <Star size={14} className="fill-yellow-400" /></h4>
                  <p className="text-xs text-yellow-500/70">Legendary status</p>
                </div>
              </div>
              <div className="text-sm font-mono text-yellow-400 font-black bg-yellow-500/10 px-3 py-1.5 rounded-lg relative z-10 border border-yellow-500/20">1000+ XP</div>
            </div>
          </div>
        </div>

      </div>

      <div className="col-span-1">
        <RightSidebar />
      </div>
    </div>
  );
}

export default AboutApp;
