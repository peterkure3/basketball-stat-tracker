async function initDb() {
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
      await db.exec(`ALTER TABLE stats ADD COLUMN ${column} INTEGER`);
    }
  }
}
