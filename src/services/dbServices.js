import {
  ref,
  get,
  update,
  set,
  remove,
} from "firebase/database";

import { database, storage } from "../firebase/firebaseConfig";

import {
  ref as ref_storage,
  uploadBytes,
  deleteObject,
  listAll
} from "firebase/storage";

export const getData = (path) => {
 
  return new Promise((resolve) => {
    get(ref(database, path)).then((snapshot) => {
      console.log(snapshot)
      let data = snapshot.val();
      console.log(data)
      resolve(data);
    });
  });
};

export const saveData = (path, data) => {
  return new Promise((resolve) => {
    
    update(ref(database, path), data);
    resolve("success");
  });
};

export const setData = (path, value) => {
  return new Promise((resolve) => {
    set(ref(database, path), value);
    resolve("success");
  });
};

export const RemoveData = (path) => {
  return new Promise((resolve) => {
    remove(ref(database, path));
    resolve("success");
  });
};

export const getLastKey = (path, val) => {
  return new Promise((resolve) => {
    if (!val) {
      get(ref(database, path)).then((snapshot) => {
        let lastKey = 1;
        if (snapshot.val() != null) {
          lastKey += Number(snapshot.val());
        }
        resolve(lastKey);
      });
    } else {
      resolve(val);
    }
  });
};

export const uploadFileToStorage = async (imageUri, filepath) => {
  return new Promise(async (resolve) => {
    try {
      let path = getImageStoragePath() + filepath;
      let storageref = ref_storage(storage, path);
      await uploadBytes(storageref, imageUri);
      resolve(`success`);
    } catch (error) {
      console.warn(error);
      resolve(error);
    }
  });
};

export const deleteDirectory = async (directoryPath) => {
  return new Promise((resolve, reject) => {
    const listRef = ref_storage(storage, directoryPath);

    listAll(listRef)
      .then((res) => {
        if (res.items.length > 0) {
          // Create an array of delete promises
          const deletePromises = res.items.map((itemRef) => deleteObject(itemRef));

          // Wait for all delete operations to complete
          Promise.all(deletePromises)
            .then(() => {
              resolve("success");
            })
            .catch((error) => {
              reject("fail");
              console.error("Error while deleting items: ", error);
            });
        } else {
          resolve("success");
        }
      })
      .catch((error) => {
        reject("fail");
        console.error("Error while listing items: ", error);
      });
  });
};

export const RemoveStorageData = (path) => {
  return new Promise((resolve, reject) => {
    deleteObject(ref_storage(storage, path)).then(() => {
      resolve("success");
    }).catch((err) => {
      reject(err.message);
    })
  })
}

export const getImageStoragePath = () => {
  let path = `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/`;
  return path;
};

