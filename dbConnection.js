import { PGlite } from "@electric-sql/pglite";

const DB_NAME = "patient_db_sync_v6";
const DB_VERSION = 6;
let dbInstance = null;
const channel = new BroadcastChannel("patient_db_sync");

async function initializeDatabase(db) {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    throw err;
  }
}

async function getDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = new PGlite({
      idbName: DB_NAME,
      idbVersion: DB_VERSION,
      durability: "relaxed",
      idbBackend: "indexeddb" , 
      dataDir: 'idb://my-pgdata'
    });
    

    await dbInstance.ready;
    await initializeDatabase(dbInstance);
    return dbInstance;

  } catch (err) {
    console.error("⚠️ DB connection failed:", err);
    console.warn("🧹 Attempting DB recovery by deleting IndexedDB...");

    await new Promise((resolve) => {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = () => {
        resolve();
      };
      req.onerror = (e) => {
        console.error("❌ Error deleting DB:", e);
        resolve();
      };
    });
    dbInstance = new PGlite({
      idbName: DB_NAME,
      idbVersion: DB_VERSION,
      durability: "relaxed"
    });

    await dbInstance.ready;

    await initializeDatabase(dbInstance);
    return dbInstance;
  }
}

function notifyTabsOfUpdate() {
  channel.postMessage({ type: "db_update" });
}

function setupTabSync(callback) {
  const handler = (event) => {
    if (event.data.type === "db_update") {
      callback();
    }
  };
  channel.addEventListener("message", handler);
  return () => {
    channel.removeEventListener("message", handler);
  };
}

async function queryPatients(sql, params = []) {
  const db = await getDatabase();
  const result = await db.query(sql, params);
  return result.rows || result;
}

export {
  getDatabase,
  notifyTabsOfUpdate,
  setupTabSync,
  queryPatients
};
