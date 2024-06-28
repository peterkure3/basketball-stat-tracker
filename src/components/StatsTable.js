import { motion } from 'framer-motion';

export default function StatsTable({ stats }) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg"
    >
      <h2 className="mb-4 text-2xl font-bold text-white">Game Stats</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#2A2A2A] text-white border-collapse">
          <thead className="bg-[#3A3A3A]">
            <tr>
              <th className="px-4 py-2 text-left">Player</th>
              <th className="px-4 py-2 text-left">Team</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-right">Points</th>
              <th className="px-4 py-2 text-right">Rebounds</th>
              <th className="px-4 py-2 text-right">Assists</th>
              <th className="px-4 py-2 text-right">Steals</th>
              <th className="px-4 py-2 text-right">Blocks</th>
              <th className="px-4 py-2 text-right">Turnovers</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-gray-700 hover:bg-[#3A3A3A] transition-colors"
              >
                <td className="px-4 py-2 font-medium text-left">{stat.player_name}</td>
                <td className="px-4 py-2 text-left">{stat.team_name || 'Independent'}</td>
                <td className="px-4 py-2 text-left">{new Date(stat.game_date).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-right">{stat.points}</td>
                <td className="px-4 py-2 text-right">{stat.rebounds}</td>
                <td className="px-4 py-2 text-right">{stat.assists}</td>
                <td className="px-4 py-2 text-right">{stat.steals}</td>
                <td className="px-4 py-2 text-right">{stat.blocks}</td>
                <td className="px-4 py-2 text-right">{stat.turnovers}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
