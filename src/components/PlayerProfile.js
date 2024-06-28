import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

function PlayerProfile({ stats }) {
  const { playerName } = useParams();
  
  // Filter stats for the specific player
  const playerStats = stats.filter(stat => stat.player_name === playerName);

  // Calculate career averages
  const careerAverages = playerStats.reduce((acc, game) => {
    Object.keys(game).forEach(key => {
      if (typeof game[key] === 'number') {
        acc[key] = (acc[key] || 0) + game[key];
      }
    });
    return acc;
  }, {});

  Object.keys(careerAverages).forEach(key => {
    careerAverages[key] = (careerAverages[key] / playerStats.length).toFixed(2);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg text-white"
    >
      <h2 className="mb-4 text-2xl font-bold">{playerName}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xl font-semibold">Career Averages</h3>
          <ul>
            <li>Points: {careerAverages.points}</li>
            <li>Rebounds: {careerAverages.rebounds}</li>
            <li>Assists: {careerAverages.assists}</li>
            <li>Steals: {careerAverages.steals}</li>
            <li>Blocks: {careerAverages.blocks}</li>
            <li>Turnovers: {careerAverages.turnovers}</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-xl font-semibold">Recent Games</h3>
          <ul>
            {playerStats.slice(-5).reverse().map((game, index) => (
              <li key={index} className="mb-2">
                <span className="font-medium">{new Date(game.game_date).toLocaleDateString()}</span>: 
                {game.points} pts, {game.rebounds} reb, {game.assists} ast
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default PlayerProfile;
