import { openOrCreate } from '@nativescript-community/sqlite'
import { knownFolders } from '@nativescript/core'

let db: ReturnType<typeof openOrCreate> | null = null

export function getDb() {
  if (!db) {
    const dbPath = knownFolders.documents().path + '/app.db'
    db = openOrCreate(dbPath)
  }
  return db
}

export async function deleteLevel(levelId: number) {
  await getDb().execute('DELETE FROM levels WHERE level_id = ?', [levelId])
}

export async function updateLevel(levelId: number, levelName: string, levelOrder: number) {
  await getDb().execute(
    'UPDATE levels SET level_name = ?, level_order = ? WHERE level_id = ?',
    [levelName, levelOrder, levelId]
  )
}

export async function addLevel(levelName: string, levelOrder: number) {
  await getDb().execute(
    'INSERT INTO levels (level_name, level_order) VALUES (?, ?)',
    [levelName, levelOrder]
  )
}

export async function getRooms(levelId: number) {
  return getDb().select(
    'SELECT room_id, room_name, room_order FROM rooms WHERE level_id = ? ORDER BY room_order ASC',
    [levelId]
  )
}

export async function addRoom(levelId: number, roomName: string, roomOrder: number) {
  await getDb().execute(
    'INSERT INTO rooms (level_id, room_name, room_order) VALUES (?, ?, ?)',
    [levelId, roomName, roomOrder]
  )
}

export async function updateRoom(roomId: number, roomName: string, roomOrder: number) {
  await getDb().execute(
    'UPDATE rooms SET room_name = ?, room_order = ? WHERE room_id = ?',
    [roomName, roomOrder, roomId]
  )
}

export async function deleteRoom(roomId: number) {
  await getDb().execute('DELETE FROM rooms WHERE room_id = ?', [roomId])
}

export async function getItems(roomId: number) {
  return getDb().select(
    'SELECT item_id, photo_path, thumbnail_path FROM items WHERE room_id = ? ORDER BY item_id ASC',
    [roomId]
  )
}

export async function getItem(itemId: number) {
  const rows = await getDb().select(
    'SELECT item_id, photo_path, notes, year_acquired FROM items WHERE item_id = ?',
    [itemId]
  )
  return rows[0]
}

export async function addItem(
  levelId: number,
  roomId: number,
  photoPath: string,
  thumbnailPath: string
) {
  await getDb().execute(
    'INSERT INTO items (level_id, room_id, photo_path, thumbnail_path) VALUES (?, ?, ?, ?)',
    [levelId, roomId, photoPath, thumbnailPath]
  )
}

export async function updateItem(itemId: number, notes: string, yearAcquired: string) {
  await getDb().execute(
    'UPDATE items SET notes = ?, year_acquired = ? WHERE item_id = ?',
    [notes, yearAcquired, itemId]
  )
}

export async function initDatabase() {
  const database = getDb()

  await database.execute(`
    CREATE TABLE IF NOT EXISTS levels (
      level_id INTEGER PRIMARY KEY AUTOINCREMENT,
      level_name TEXT NOT NULL,
      level_order INTEGER NOT NULL
    )
  `)

  await database.execute(`
    CREATE TABLE IF NOT EXISTS rooms (
      room_id INTEGER PRIMARY KEY AUTOINCREMENT,
      level_id INTEGER NOT NULL,
      room_name TEXT NOT NULL,
      room_order INTEGER NOT NULL,
      FOREIGN KEY (level_id) REFERENCES levels (level_id)
    )
  `)

  await database.execute(`
    CREATE TABLE IF NOT EXISTS items (
      item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      level_id INTEGER NOT NULL,
      room_id INTEGER NOT NULL,
      photo_path TEXT NOT NULL,
      thumbnail_path TEXT NOT NULL,
      FOREIGN KEY (level_id) REFERENCES levels (level_id),
      FOREIGN KEY (room_id) REFERENCES rooms (room_id)
    )
  `)

  // Migrate: add notes and year_acquired to items if not present
  const itemCols = await database.select('PRAGMA table_info(items)')
  const colNames = itemCols.map((c: any) => c.name)
  if (!colNames.includes('notes')) {
    await database.execute("ALTER TABLE items ADD COLUMN notes TEXT DEFAULT ''")
  }
  if (!colNames.includes('year_acquired')) {
    await database.execute("ALTER TABLE items ADD COLUMN year_acquired TEXT DEFAULT ''")
  }

  const existing = await database.select('SELECT COUNT(*) as count FROM levels')
  if (existing[0].count === 0) {
    await database.transaction(async () => {
      await database.execute('INSERT INTO levels (level_name, level_order) VALUES (?, ?)', ['Basement', 1])
      await database.execute('INSERT INTO levels (level_name, level_order) VALUES (?, ?)', ['First Floor', 2])
      await database.execute('INSERT INTO levels (level_name, level_order) VALUES (?, ?)', ['Second Floor', 3])
    })
  }
}
