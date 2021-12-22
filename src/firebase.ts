import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
  EmailAuthProvider,
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  remove,
  child,
  off,
  onValue,
  onChildAdded,
  onChildRemoved,
  onDisconnect,
} from 'firebase/database';

import { config } from './firebase-config';

const app = initializeApp(config);
const auth = getAuth(app);
const db = getDatabase(app);
setPersistence(auth, browserSessionPersistence);

function getRef(path: string) {
  return ref(db, path);
}
export {
  auth,
  EmailAuthProvider,
  getRef,
  get,
  set,
  push,
  remove,
  child,
  off,
  onValue,
  onChildAdded,
  onChildRemoved,
  onDisconnect,
};
