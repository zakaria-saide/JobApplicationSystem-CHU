// utils/indexedDB.js
export const openDB = (dbName, storeName) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        reject(`Error opening DB: ${event.target.errorCode}`);
      };
    });
  };
  
  export const saveData = (dbName, storeName, data) => {
    return openDB(dbName, storeName).then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
  
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(`Error saving data: ${event.target.errorCode}`);
      });
    });
  };
  
  export const loadData = (dbName, storeName, id) => {
    return openDB(dbName, storeName).then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(`Error loading data: ${event.target.errorCode}`);
      });
    });
  };
  
  // Clear the IndexedDB for testing
  export const clearDatabase = (dbName) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
  
      request.onsuccess = () => {
        console.log(`Database ${dbName} deleted successfully`);
        resolve();
      };
  
      request.onerror = (event) => {
        console.error(`Error deleting database ${dbName}: ${event.target.errorCode}`);
        reject(`Error deleting database ${dbName}: ${event.target.errorCode}`);
      };
  
      request.onblocked = () => {
        console.warn(`Delete blocked on database ${dbName}`);
        reject(`Delete blocked on database ${dbName}`);
      };
    });
  };
  