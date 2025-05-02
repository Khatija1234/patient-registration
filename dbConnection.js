import { PGlite } from "@electric-sql/pglite";

const DB_NAME = "patient_db_sync_v6";
const DB_VERSION = 6;
let dbInstance = null;
const channel = new BroadcastChannel("patient_db_sync");

async function initializeDatabase(db) {
  try {
    console.log("🔧 Initializing database schema...");
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
    console.log("✅ Schema initialized or already exists.");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    throw err;
  }
}

async function getDatabase() {
  if (dbInstance) {
    console.log("🔄 Reusing existing DB instance");
    return dbInstance;
  }

  try {
    console.log("🚀 Attempting to connect to PGlite DB:", DB_NAME);
    dbInstance = new PGlite({
      idbName: DB_NAME,
      idbVersion: DB_VERSION,
      durability: "relaxed",
      idbBackend: "indexeddb" , 
      dataDir: 'idb://my-pgdata'
    });
    

    await dbInstance.ready;
    console.log("✅ DB connected successfully");

    await initializeDatabase(dbInstance);
    return dbInstance;

  } catch (err) {
    console.error("⚠️ DB connection failed:", err);
    console.warn("🧹 Attempting DB recovery by deleting IndexedDB...");

    await new Promise((resolve) => {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = () => {
        console.log("🗑️ Old DB deleted");
        resolve();
      };
      req.onerror = (e) => {
        console.error("❌ Error deleting DB:", e);
        resolve();
      };
    });

    console.log("🔁 Retrying DB initialization...");
    dbInstance = new PGlite({
      idbName: DB_NAME,
      idbVersion: DB_VERSION,
      durability: "relaxed"
    });

    await dbInstance.ready;
    console.log("✅ DB reinitialized after recovery");

    await initializeDatabase(dbInstance);
    return dbInstance;
  }
}

function notifyTabsOfUpdate() {
  console.log("🔔 Broadcasting update to other tabs");
  channel.postMessage({ type: "db_update" });
}

function setupTabSync(callback) {
  const handler = (event) => {
    console.log("📡 Sync event received:", event.data);
    if (event.data.type === "db_update") {
      callback();
    }
  };
  channel.addEventListener("message", handler);
  return () => {
    console.log("🛑 Removing sync listener");
    channel.removeEventListener("message", handler);
  };
}

async function queryPatients(sql, params = []) {
  const db = await getDatabase();
  console.log("📥 Executing SQL:", sql);
  console.log("📦 With parameters:", params);

  const result = await db.query(sql, params);
  console.log("📤 Query result:", result.rows || result);

  return result.rows || result;
}

export {
  getDatabase,
  notifyTabsOfUpdate,
  setupTabSync,
  queryPatients
};
