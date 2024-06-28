import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = null;

async function openDb() {
  if (!db) {
    db = await open({
      filename: './basketball.sqlite',
      driver: sqlite3.Database
    });
    await initDb();
  }
  return db;
}

async function initDb() {
  console.log('Initializing database...');
  await db.exec(`
    CREATE TABLE IF NOT EXISTS team (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS player (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      team_id INTEGER,
      FOREIGN KEY (team_id) REFERENCES team(id)
    );

    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER,
      game_date TEXT,
      points INTEGER,
      rebounds INTEGER,
      assists INTEGER,
      steals INTEGER,
      blocks INTEGER,
      turnovers INTEGER,
      FOREIGN KEY (player_id) REFERENCES player(id)
    );
  `);

  // Check if the columns exist, and if not, add them
  const columns = ['steals', 'blocks', 'turnovers'];
  for (const column of columns) {
    const columnExists = await db.get(`PRAGMA table_info(stats)`).then(info => 
      info.some(col => col.name === column)
    );
    if (!columnExists) {
      console.log(`Adding column ${column} to stats table`);
      await db.exec(`ALTER TABLE stats ADD COLUMN ${column} INTEGER`);
    }
  }
  console.log('Database initialization complete.');
}

export default async function handler(req, res) {
  try {
    const db = await openDb();
    const { method } = req;
    const { operation } = req.query;

    console.log(`Received ${method} request for operation: ${operation}`);

    switch (method) {
      case 'GET':
        let result;
        switch (operation) {
          case 'getTeams':
            result = await db.all('SELECT * FROM team');
            break;
          case 'getPlayers':
            result = await db.all('SELECT player.*, team.name as team_name FROM player LEFT JOIN team ON player.team_id = team.id');
            break;
          case 'getStats':
            result = await db.all(`
              SELECT stats.*, player.name as player_name, team.name as team_name
              FROM stats
              JOIN player ON stats.player_id = player.id
              LEFT JOIN team ON player.team_id = team.id
            `);
            break;
          default:
            return res.status(400).json({ error: 'Invalid operation' });
        }
        res.status(200).json(result);
        break;

      case 'POST':
        let newItem;
        switch (operation) {
          case 'addTeam':
            const { name } = req.body;
            if (!name) return res.status(400).json({ error: 'Team name is required' });
            try {
              const teamResult = await db.run('INSERT INTO team (name) VALUES (?)', [name]);
              newItem = await db.get('SELECT * FROM team WHERE id = ?', teamResult.lastID);
            } catch (error) {
              if (error.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: 'Team name already exists' });
              }
              throw error;
            }
            break;
          case 'addPlayer':
            const { playerName, teamId } = req.body;
            if (!playerName) return res.status(400).json({ error: 'Player name is required' });
            const playerResult = await db.run('INSERT INTO player (name, team_id) VALUES (?, ?)', [playerName, teamId]);
            newItem = await db.get('SELECT * FROM player WHERE id = ?', playerResult.lastID);
            break;
          case 'addStats':
            const { player_id, game_date, points, rebounds, assists, steals, blocks, turnovers } = req.body;
            console.log('Received stats data:', { player_id, game_date, points, rebounds, assists, steals, blocks, turnovers });
            if (!player_id || !game_date) return res.status(400).json({ error: 'Player ID and game date are required' });
            const statResult = await db.run(
              `INSERT INTO stats (player_id, game_date, points, rebounds, assists, steals, blocks, turnovers)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [player_id, game_date, points, rebounds, assists, steals, blocks, turnovers]
            );
            newItem = await db.get('SELECT * FROM stats WHERE id = ?', statResult.lastID);
            break;
          default:
            return res.status(400).json({ error: 'Invalid operation' });
        }
        res.status(201).json(newItem);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database operation failed:', error);
    res.status(500).json({ error: 'Database operation failed', details: error.message, stack: error.stack });
  }
}
