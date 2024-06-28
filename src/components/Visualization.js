import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Visualization({ stats }) {
  const [selectedStat, setSelectedStat] = useState('points');
  const [chartWidth, setChartWidth] = useState('100%');
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChartWidth('100%');
        setChartHeight(400);
      } else {
        setChartWidth('100%');
        setChartHeight(300);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Group stats by player and calculate averages
  const playerStats = stats.reduce((acc, stat) => {
    if (!acc[stat.player_name]) {
      acc[stat.player_name] = {
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        gamesPlayed: 0,
      };
    }
    
    acc[stat.player_name].points += stat.points;
    acc[stat.player_name].rebounds += stat.rebounds;
    acc[stat.player_name].assists += stat.assists;
    acc[stat.player_name].steals += stat.steals;
    acc[stat.player_name].blocks += stat.blocks;
    acc[stat.player_name].turnovers += stat.turnovers;
    acc[stat.player_name].gamesPlayed += 1;

    return acc;
  }, {});

  // Calculate averages
  Object.keys(playerStats).forEach(player => {
    const games = playerStats[player].gamesPlayed;
    Object.keys(playerStats[player]).forEach(stat => {
      if (stat !== 'gamesPlayed') {
        playerStats[player][stat] = playerStats[player][stat] / games;
      }
    });
  });

  const data = {
    labels: Object.keys(playerStats),
    datasets: [
      {
        label: `Average ${selectedStat.charAt(0).toUpperCase() + selectedStat.slice(1)}`,
        data: Object.values(playerStats).map(player => player[selectedStat]),
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          boxWidth: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: `Average ${selectedStat.charAt(0).toUpperCase() + selectedStat.slice(1)} per Player`,
        color: 'white',
        font: {
          size: 14,
        },
      },
    },
    scales: {
      y: {
        ticks: { 
          color: 'white',
          font: {
            size: 10,
          },
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { 
          color: 'white',
          autoSkip: true,
          maxRotation: 90,
          minRotation: 90,
          font: {
            size: 10,
          },
        },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#2A2A2A] p-4 rounded-lg shadow-lg"
    >
      <div className="mb-4">
        <label htmlFor="stat-select" className="block mb-2 text-sm text-white">Select Stat:</label>
        <select
          id="stat-select"
          value={selectedStat}
          onChange={(e) => setSelectedStat(e.target.value)}
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
      <div style={{ width: chartWidth, height: chartHeight }}>
        <Bar data={data} options={options} />
      </div>
    </motion.div>
  );
}

export default Visualization;
