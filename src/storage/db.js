const DB_NAME = "TerminalNotesDB";
const DB_VERSION = 1;

export function openDatabase() {
  return new Promise((resolve, reject) => {
    // Open (or create) the IndexedDB database
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Runs ONLY if the database version changes or is opened for the first time
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Folders Store (Primary Key: auto-incrementing id)
      if (!db.objectStoreNames.contains("folders")) {
        const folderStore = db.createObjectStore("folders", { keyPath: "id", autoIncrement: true });
        folderStore.createIndex("parentId", "parentId", { unique: false });
        folderStore.createIndex("name", "name", { unique: false });
      }

      // 2. Notes Store (Primary Key: auto-incrementing id)
      if (!db.objectStoreNames.contains("notes")) {
        const noteStore = db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
        noteStore.createIndex("folderId", "folderId", { unique: false });
        noteStore.createIndex("title", "title", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result); // Returns the active IDBDatabase connection
    };

    request.onerror = (event) => {
      reject(`IndexedDB Error: ${event.target.error.message}`);
    };
  });
}


export function addFolder(db, name, parentId = null) {
  return new Promise((resolve, reject) => {
    // 1. Open a readwrite transaction on the "folders" store
    const tx = db.transaction("folders", "readwrite");
    const store = tx.objectStore("folders");

    const folderData = {
      name: name,
      parentId: parentId,
      createdAt: new Date().toISOString()
    };

    // 2. Add record (autoIncrement assigns the id)
    const request = store.add(folderData);

    request.onsuccess = (event) => {
      // Returns generated numeric id (e.g. 1, 2, 3...)
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(`Error creating folder: ${event.target.error.message}`);
    };
  });
}

export function getFoldersByParent(db, parentId = null) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("folders", "readonly");
    const store = tx.objectStore("folders");
    const index = store.index("parentId");

    // Query index for matching parentId
    const request = index.getAll(parentId);

    request.onsuccess = (event) => {
      resolve(event.target.result); // Returns array of matching folder objects
    };

    request.onerror = (event) => {
      reject(`Error fetching folders: ${event.target.error.message}`);
    };
  });
}

export function addNote(db, title, content = "", folderId = "root") {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.error("[DB Error] Database instance (db) is null or undefined!");
      return reject("Database handle not initialized");
    }

    console.log(`[DB] Adding note '${title}' under folderId '${folderId}'`);
    const tx = db.transaction("notes", "readwrite");
    const store = tx.objectStore("notes");

    const noteData = {
      title,
      content,
      folderId: folderId ?? "root",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const request = store.add(noteData);

    request.onsuccess = (event) => {
      console.log(`[DB] Note '${title}' saved with ID ${event.target.result}`);
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error(`[DB Error] Failed to save note '${title}':`, event.target.error);
      reject(event.target.error.message);
    };
  });
}

export function getNotesByFolder(db, folderId = "root") {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("notes", "readonly");
    const store = tx.objectStore("notes");
    const index = store.index("folderId");

    const request = index.getAll(folderId ?? "root");

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error.message);
  });
}