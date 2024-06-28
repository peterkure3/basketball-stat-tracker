import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PlayerManagement({ players, refreshPlayers, teams }) {
  const [playerName, setPlayerName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  const addPlayer = async () => {
    if (playerName.trim() && selectedTeam) {
      try {
        const response = await fetch('/api/db?operation=addPlayer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ playerName, teamId: selectedTeam }),
        });

        if (!response.ok) {
          throw new Error('Failed to add player');
        }

        await refreshPlayers(); // Refresh the players list after adding a new player
        setPlayerName('');
        setSelectedTeam('');
      } catch (error) {
        console.error('Error adding player:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter player name"
        className="w-full px-3 py-2 bg-[#3A3A3A] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 mb-2"
      />
      <select
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
        className="w-full px-3 py-2 bg-[#3A3A3A] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
      >
        <option value="">Select a team</option>
        {Array.isArray(teams) && teams.length > 0 ? (
          teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))
        ) : (
          <option disabled>No teams available</option>
        )}
      </select>
      <motion.button
        onClick={addPlayer}
        className="px-6 py-3 mt-4 text-white transition duration-300 bg-blue-600 rounded-full hover:bg-blue-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!playerName.trim() || !selectedTeam}
      >
        Add Player
      </motion.button>
      <ul className="mt-4 space-y-2">
        {Array.isArray(players) && players.length > 0 ? (
          players.map(player => (
            <motion.li
              key={player.id}
              className="text-white bg-[#3A3A3A] p-2 rounded"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {player.name} - {Array.isArray(teams) ? (teams.find(t => t.id === player.team_id)?.name || 'Unknown Team') : 'Unknown Team'}
            </motion.li>
          ))
        ) : (
          <li className="text-gray-400">No players available</li>
        )}
      </ul>
    </div>
  );
}
