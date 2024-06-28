import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Leaderboard({ stats }) {
  const [leaderboardStat, setLeaderboardStat] = useState('points');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Calculate leaderboard
    const statTotals = stats.reduce((acc, stat) => {
      if (!acc[stat.player_name]) {
        acc[stat.player_name] = { ...stat, team_name: stat.team_name };
      } else {
        Object.keys(stat).forEach(key => {
          if (typeof stat[key] === 'number') {
            acc[stat.player_name][key] = (acc[stat.player_name][key] || 0) + stat[key];
          }
        });
      }
      return acc;
    }, {});

    const sortedLeaderboard = Object.entries(statTotals)
      .map(([player_name, stats]) => ({
        player_name,
        team_name: stats.team_name,
        total: stats[leaderboardStat],
      }))
      .sort((a, b) => b.total - a.total);

    setLeaderboard(sortedLeaderboard);
  }, [stats, leaderboardStat]);

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#2A2A2A] p-4 sm:p-6 rounded-lg shadow-lg"
    >
      <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">Leaderboard Table</h2>
      <div className="mb-4">
        <label htmlFor="leaderboard-stat" className="block mb-2 text-sm text-white">Select Stat:</label>
        <select
          id="leaderboard-stat"
          value={leaderboardStat}
          onChange={(e) => setLeaderboardStat(e.target.value)}
          className="w-full bg-[#3A3A3A] text-white p-2 rounded text-sm"
        >
          <option value="points">Points</option>
          <option value="rebounds">Rebounds</option>
          <option value="assists">Assists</option>
          <option value="steals">Steals</option>
          <option value="blocks">Blocks</option>
          <option value="turnovers">Turnovers</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-white border-collapse sm:text-base">
          <thead className="bg-[#3A3A3A]">
            <tr>
              <th className="px-2 py-2 text-left sm:px-4">Rank</th>
              <th className="px-2 py-2 text-left sm:px-4">Player</th>
              <th className="px-2 py-2 text-left sm:px-4">Team</th>
              <th className="px-2 py-2 text-right sm:px-4">Total {leaderboardStat}</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <motion.tr
                key={player.player_name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-gray-700 hover:bg-[#3A3A3A] transition-colors"
              >
                <td className="px-2 py-2 text-left sm:px-4">{index + 1}</td>
                <td className="px-2 py-2 font-medium text-left sm:px-4">{player.player_name}</td>
                <td className="px-2 py-2 text-left sm:px-4">{player.team_name || 'Independent'}</td>
                <td className="px-2 py-2 font-bold text-right sm:px-4">{player.total.toFixed(2)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}