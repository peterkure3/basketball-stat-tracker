import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import TeamManagement from '../components/TeamManagement';
import PlayerManagement from '../components/PlayerManagement';
import GameData from '../components/GameData';
import StatsTable from '../components/StatsTable';
import Visualization from '../components/Visualization';
import Leaderboard from '../components/Leaderboard';

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (operation) => {
    try {
      const response = await fetch(`/api/db?operation=${operation}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Failed to fetch ${operation}:`, error);
      return [];
    }
  };

  const refreshTeams = useCallback(async () => {
    const teamsData = await fetchData('getTeams');
    setTeams(teamsData);
  }, []);

  const refreshPlayers = useCallback(async () => {
    const playersData = await fetchData('getPlayers');
    setPlayers(playersData);
  }, []);

  const refreshStats = useCallback(async () => {
    const statsData = await fetchData('getStats');
    setStats(statsData);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        await Promise.all([refreshTeams(), refreshPlayers(), refreshStats()]);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Failed to load initial data. Please try refreshing the page.");
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [refreshTeams, refreshPlayers, refreshStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-gray-200 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl font-bold">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-gray-200 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl font-bold text-red-500">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200">
      <header className="bg-[#1E1E1E] py-16">
        
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold text-white"
          >
            Basketball Stat Tracker
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl text-gray-300"
          >
            Track and analyze your team's performance with ease.
          </motion.p>
        </div>
      </header>

      <main className="container px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div 
            key="team-management"
            className="bg-[#2A2A2A] rounded-lg shadow-lg p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-white">Team Management</h2>
            <TeamManagement teams={teams} refreshTeams={refreshTeams} />
            {teams.length === 0 && (
              <p className="mt-4 text-gray-400">No teams added yet. Add a team to get started.</p>
            )}
          </motion.div>
          <motion.div 
            key="player-management"
            className="bg-[#2A2A2A] rounded-lg shadow-lg p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-white">Player Management</h2>
            <PlayerManagement players={players} teams={teams} refreshPlayers={refreshPlayers} />
            {players.length === 0 && (
              <p className="mt-4 text-gray-400">No players added yet. Add players to your teams.</p>
            )}
          </motion.div>
          <motion.div 
            key="game-data"
            className="bg-[#2A2A2A] rounded-lg shadow-lg p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-white">Game Data</h2>
            <GameData players={players} refreshStats={refreshStats} />
            {stats.length === 0 && (
              <p className="mt-4 text-gray-400">No game data available. Enter game stats to see results.</p>
            )}
          </motion.div>
          <motion.div 
            key="stats-table"
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#2A2A2A] rounded-lg shadow-lg p-6"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-white">Stats Table</h2>
            <StatsTable stats={stats} />
            {stats.length === 0 && (
              <p className="mt-4 text-gray-400">No statistics available. Enter game data to populate this table.</p>
            )}
          </motion.div>
          <motion.div 
            key="visualization"
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#2A2A2A] rounded-lg shadow-lg p-6"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-white">Visualization</h2>
            <Visualization stats={stats} />
            {stats.length === 0 && (
              <p className="mt-4 text-gray-400">No data to visualize. Add game stats to see charts and graphs.</p>
            )}
          </motion.div>
          <motion.div 
            key="leaderboard"
            className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#2A2A2A] rounded-lg shadow-lg p-6"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-white">Leaderboard</h2>
            <Leaderboard stats={stats} />
            {stats.length === 0 && (
              <p className="mt-4 text-gray-400">Leaderboard is empty. Add game data to see top performers.</p>
            )}
          </motion.div>
        </div>
      </main>

      <footer className="bg-[#1E1E1E] py-8">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <p className="text-gray-400">© 2024 Basketball Stat Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
