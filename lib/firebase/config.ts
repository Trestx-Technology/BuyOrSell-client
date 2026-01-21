import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getMessaging, getToken, Messaging } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy initialization - only initialize when accessed on client side
let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;
let _storage: FirebaseStorage | null = null;
let _messaging: Messaging | null = null;

function ensureClientSide() {
  if (typeof window === "undefined") {
    throw new Error("Firebase should only be initialized on the client side");
  }
}

function getApp(): FirebaseApp {
  ensureClientSide();

  if (!_app) {
    if (getApps().length === 0) {
      _app = initializeApp(firebaseConfig);
    } else {
      _app = getApps()[0];
    }
  }

  return _app;
}

function getDb(): Firestore {
  ensureClientSide();
  if (!_db) {
    _db = getFirestore(getApp());
  }
  return _db;
}

function getAuthInstance(): Auth {
  ensureClientSide();
  if (!_auth) {
    _auth = getAuth(getApp());
  }
  return _auth;
}

function getStorageInstance(): FirebaseStorage {
  ensureClientSide();
  if (!_storage) {
    _storage = getStorage(getApp());
  }
  return _storage;
}

function getMessagingInstance(): Messaging {
  ensureClientSide();
  if (!_messaging) {
    _messaging = getMessaging(getApp());
  }
  return _messaging;
}

const fetchToken = async () => {
  try {
    const fcmMessaging = getMessagingInstance();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

// ONLY export the getter functions - do NOT export direct access
export const getFirebaseApp = getApp;
export const getFirebaseDb = getDb;
export const getFirebaseAuth = getAuthInstance;
export const getFirebaseStorage = getStorageInstance;
export const getFirebaseMessaging = getMessagingInstance;

// Alternative: Export as namespace object (if you prefer this style)
export const firebase = {
  getApp,
  getDb: getDb,
  getAuth: getAuthInstance,
  getStorage: getStorageInstance,
  getMessaging: getMessagingInstance,
  getFCMToken: fetchToken,
};

// Helper to get FCM Token safely

