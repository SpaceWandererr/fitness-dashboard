import Dexie from "dexie";

// Create database
export const db = new Dexie("LifeOS_Backups");

// Define schema (version 1)
db.version(1).stores({
  backups: "id, createdAt, tag, label",
});

// Export table
export const backupsTable = db.backups;
