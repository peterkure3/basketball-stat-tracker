import { useState } from 'react';
import { motion } from 'framer-motion';

export default function GameData({ players, refreshStats }) {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [gameDate, setGameDate] = useState('');
  const [points, setPoints] = useState(0);
  const [rebounds, setRebounds] = useState(0);
  const [assists, setAssists] = useState(0);
  const [steals, setSteals] = useState(0);
  const [blocks, setBlocks] = useState(0);
  const [turnovers, setTurnovers] = useState(0);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!selectedPlayer || !gameDate) {
      setError("Please select a player and game date.");
      return;
    }

    try {
      const res = await fetch('/api/db?operation=addStats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: parseInt(selectedPlayer),
          game_date: gameDate,
          points,
          rebounds,
          assists,
          steals,
          blocks,
          turnovers,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const newStats = await res.json();
      console.log('New stats added:', newStats);

      // Call the refreshStats function passed from the parent component
      refreshStats();

      // Reset form
      setSelectedPlayer('');
      setGameDate('');
      setPoints(0);
      setRebounds(0);
      setAssists(0);
      setSteals(0);
      setBlocks(0);
      setTurnovers(0);

    } catch (error) {
      console.error('Error adding game stats:', error);
      setError("Failed to add game stats. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg"
    >
      <h2 className="mb-4 text-2xl font-bold text-white">Game Data</h2>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-red-500"
        >
          {error}
        </motion.p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="player" className="block mb-1 text-sm font-medium text-gray-300">
            Select Player
          </label>
          <select
            id="player"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full px-3 py-2 bg-[#3A3A3A] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          >
            <option value="">Select Player</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="gameDate" className="block mb-1 text-sm font-medium text-gray-300">
            Game Date
          </label>
          <input
            id="gameDate"
            type="date"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
            className="w-full px-3 py-2 bg-[#3A3A3A] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Points', value: points, setter: setPoints },
            { label: 'Rebounds', value: rebounds, setter: setRebounds },
            { label: 'Assists', value: assists, setter: setAssists },
            { label: 'Steals', value: steals, setter: setSteals },
            { label: 'Blocks', value: blocks, setter: setBlocks },
            { label: 'Turnovers', value: turnovers, setter: setTurnovers },
          ].map((stat) => (
            <div key={stat.label}>
              <label htmlFor={stat.label.toLowerCase()} className="block mb-1 text-sm font-medium text-gray-300">
                {stat.label}
              </label>
              <input
                id={stat.label.toLowerCase()}
                type="number"
                value={stat.value}
                onChange={(e) => stat.setter(parseInt(e.target.value) || 0)}
                placeholder={stat.label}
                className="w-full px-3 py-2 bg-[#3A3A3A] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
              />
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full px-6 py-3 font-semibold text-white transition duration-300 bg-blue-600 rounded-full hover:bg-blue-700"
        >
          Add Stats
        </motion.button>
      </form>
    </motion.div>
  );
}
