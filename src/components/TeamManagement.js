import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TeamManagement({ teams, refreshTeams }) {
  const [teamName, setTeamName] = useState('');

  const addTeam = async () => {
    if (teamName.trim()) {
      try {
        const response = await fetch('/api/db?operation=addTeam', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: teamName }),
        });

        if (!response.ok) {
          throw new Error('Failed to add team');
        }

        setTeamName('');
        await refreshTeams(); // Refresh the teams list after adding a new team
      } catch (error) {
        console.error('Error adding team:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  return (
    <div>
      <div className="flex mb-4">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          className="flex-grow px-3 py-2 text-black rounded-l focus:outline-none"
        />
        <motion.button
          onClick={addTeam}
          className="px-4 py-2 text-white bg-blue-500 rounded-r"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Team
        </motion.button>
      </div>
      <ul className="mt-4 space-y-2">
        {Array.isArray(teams) && teams.length > 0 ? (
          teams.map(team => (
            <motion.li
              key={team.id}
              className="p-2 text-white bg-gray-700 rounded"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {team.name}
            </motion.li>
          ))
        ) : (
          <li className="text-gray-400">No teams available</li>
        )}
      </ul>
    </div>
  );
}
