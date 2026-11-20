import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  reauthenticateWithPopup,
  User as FirebaseUser,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { UserProfile, UserConsentSettings, Language, Region } from '../types';

export const USER_PROFILE_STORAGE_KEY = 'deepcortex_user_profile_v1';
export const PATIENT_RECORDS_KEY = 'deepcortex_patient_records_v1';
export const SUPPORT_TICKETS_KEY = 'deepcortex_support_tickets_v2';

// Client Firebase configuration (configured with user project credentials)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDWeHRBA2sUJgVtcy0o5lfEH1NLz76vVJQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'deepcortex-ai.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'deepcortex-ai',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'deepcortex-ai.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '444447744977',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:444447744977:web:f21fa632e6b05246e936f0',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-CTVKYYFRV6',
};

const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: any = null;
let auth: any = null;
let firestore: any = null;
let googleProvider: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
  }
}

/**
 * Safe Non-Blocking Firestore helpers with strict timeout protection.
 * These ensure that if Cloud Firestore is pending database creation or has connectivity issues,
 * it will NEVER freeze or block the user interface.
 */
export async function safeFirestoreSetDoc(
  collectionName: string,
  docId: string,
  data: any,
  timeoutMs = 6000
): Promise<boolean> {
  if (!firestore) return false;
  try {
    const fullPath = collectionName.includes('/') ? `${collectionName}/${docId}` : `${collectionName}/${docId}`;
    const docRef = doc(firestore, fullPath);
    const firestorePromise = setDoc(docRef, data, { merge: true });
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore sync timed out')), timeoutMs)
    );
    await Promise.race([firestorePromise, timeoutPromise]);
    console.info(`[Firestore] Document synced: ${fullPath}`);
    return true;
  } catch (err: any) {
    console.warn(`[Firestore] Sync note for ${collectionName}/${docId}:`, err?.message || err);
    return false;
  }
}

export async function safeFirestoreDeleteDoc(
  collectionName: string,
  docId: string,
  timeoutMs = 6000
): Promise<boolean> {
  if (!firestore) return false;
  try {
    const fullPath = collectionName.includes('/') ? `${collectionName}/${docId}` : `${collectionName}/${docId}`;
    const docRef = doc(firestore, fullPath);
    const firestorePromise = deleteDoc(docRef);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore delete timed out')), timeoutMs)
    );
    await Promise.race([firestorePromise, timeoutPromise]);
    console.info(`[Firestore] Document deleted: ${fullPath}`);
    return true;
  } catch (err: any) {
    console.warn(`[Firestore] Delete note for ${collectionName}/${docId}:`, err?.message || err);
    return false;
  }
}

export const DEFAULT_CONSENT_SETTINGS: UserConsentSettings = {
  longitudinalTracking: true,
  clinicalHandover: false,
  employerZeroAccess: true, // Strictly locked ON
};

export const createDefaultGuestProfile = (
  preferredLanguage: Language = 'en',
  preferredRegion: Region = 'abu-dhabi'
): UserProfile => ({
  id: 'guest-' + Math.random().toString(36).substring(2, 9),
  isGuest: true,
  name: 'Temporary Guest',
  email: '',
  authProvider: 'guest',
  educationLevel: 'secondary',
  preferredLanguage,
  preferredRegion,
  latestMemoryScore: null,
  brainProtectionScore: null,
  personalScansCount: 0,
  savedReportsCount: 0,
  submittedTicketsCount: 0,
  consentSettings: { ...DEFAULT_CONSENT_SETTINGS },
  isCloudSynced: false,
});

export const loadStoredProfile = (
  currentLanguage: Language = 'en',
  currentRegion: Region = 'abu-dhabi'
): UserProfile => {
  try {
    const raw = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id) {
        // Enforce employer zero-access shield is strictly true
        parsed.consentSettings = {
          ...DEFAULT_CONSENT_SETTINGS,
          ...(parsed.consentSettings || {}),
          employerZeroAccess: true,
        };
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse user profile from localStorage', e);
  }
  return createDefaultGuestProfile(currentLanguage, currentRegion);
};

export const saveProfileLocally = (profile: UserProfile): void => {
  try {
    localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('LocalStorage save profile error', e);
  }

  // If user is authenticated and Firestore is active, safe-sync profile to Firestore doc non-blockingly
  if (firestore && !profile.isGuest && profile.id) {
    safeFirestoreSetDoc('users', profile.id, {
      ...profile,
      lastSyncedAt: new Date().toISOString(),
    });
  }
};

export const saveStoredProfile = saveProfileLocally;

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  if (auth) {
    return onAuthStateChanged(auth, callback);
  }
  return () => {};
};

/**
 * Sign In with Google
 * Uses Firebase Auth popup with real authentication.
 * Never creates dummy accounts on failure.
 */
export async function signInWithGoogleService(
  currentProfile: UserProfile
): Promise<UserProfile> {
  if (!auth) {
    throw new Error('Firebase Authentication is not available.');
  }

  try {
    const provider = googleProvider || new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const updated: UserProfile = {
      ...currentProfile,
      id: user.uid,
      isGuest: false,
      name: user.displayName || user.email?.split('@')[0] || 'Google User',
      email: user.email || '',
      avatar: user.photoURL || undefined,
      authProvider: 'google',
      isCloudSynced: true,
      lastSyncedAt: new Date().toISOString(),
    };

    saveProfileLocally(updated);

    // Sync full profile and all saved scans/history to Firestore
    syncAllLocalDataToFirestore(user.uid);

    return updated;
  } catch (firebaseErr: any) {
    console.error('Firebase Google Sign-In error:', firebaseErr);
    let msg = firebaseErr?.message || 'Google Sign-In failed.';
    if (
      firebaseErr?.code === 'auth/popup-closed-by-user' ||
      firebaseErr?.code === 'auth/cancelled-popup-request'
    ) {
      msg = 'Google Sign-In popup was closed before completion. Please try again or use Email & Password below.';
    } else if (firebaseErr?.code === 'auth/popup-blocked') {
      msg = 'The Google sign-in popup was blocked by your browser. Please allow popups or use Email & Password below.';
    } else if (firebaseErr?.code === 'auth/operation-not-allowed') {
      msg = 'Google provider is not enabled in your Firebase Authentication console. Please enable Google under Authentication > Sign-in method, or sign in with Email & Password.';
    } else if (firebaseErr?.code === 'auth/unauthorized-domain') {
      msg = 'This domain is not authorized in Firebase. Please add this domain under Authentication > Settings > Authorized domains in your Firebase Console, or sign in with Email & Password.';
    }
    throw new Error(msg);
  }
}

/**
 * Sign In or Sign Up with Email and Password
 * Creates or logs in real user in Firebase Auth.
 * Never hangs on pending Firestore connection.
 */
export async function signInWithEmailService(
  email: string,
  pass: string,
  isSignUp: boolean,
  name: string,
  currentProfile: UserProfile
): Promise<UserProfile> {
  const cleanEmail = email.trim();
  const cleanName = name.trim() || cleanEmail.split('@')[0] || 'Registered User';

  if (!auth) {
    throw new Error('Firebase Authentication is not available.');
  }

  try {
    let user: FirebaseUser;
    if (isSignUp) {
      const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      user = res.user;
    } else {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      user = res.user;
    }

    const updated: UserProfile = {
      ...currentProfile,
      id: user.uid,
      isGuest: false,
      name: cleanName,
      email: user.email || cleanEmail,
      authProvider: 'email',
      isCloudSynced: true,
      lastSyncedAt: new Date().toISOString(),
    };

    // Save locally immediately so UI state and storage are updated without blocking!
    saveProfileLocally(updated);

    // Sync full profile and all saved scans/history to Firestore
    syncAllLocalDataToFirestore(user.uid);

    return updated;
  } catch (fbErr: any) {
    console.error('Firebase Email Auth error:', fbErr);
    let msg = fbErr?.message || 'Authentication failed.';
    if (fbErr?.code === 'auth/email-already-in-use') {
      msg = 'This email address is already registered. Please click "Sign In" instead.';
    } else if (fbErr?.code === 'auth/weak-password') {
      msg = 'Password is too weak. Please use at least 6 characters.';
    } else if (fbErr?.code === 'auth/invalid-email') {
      msg = 'Please enter a valid email address.';
    } else if (
      fbErr?.code === 'auth/user-not-found' ||
      fbErr?.code === 'auth/wrong-password' ||
      fbErr?.code === 'auth/invalid-credential'
    ) {
      msg = 'Invalid email or password. Please verify your credentials or click "Sign Up" if you are a new user.';
    }
    throw new Error(msg);
  }
}

/**
 * Sign Out
 */
export async function signOutUserService(
  currentProfile: UserProfile
): Promise<UserProfile> {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signout error', e);
    }
  }

  const guest = createDefaultGuestProfile(
    currentProfile.preferredLanguage,
    currentProfile.preferredRegion
  );
  saveProfileLocally(guest);
  return guest;
}

/**
 * Wipe all personal clinical data while keeping account logged in
 */
export async function clearClinicalDataService(
  currentProfile: UserProfile
): Promise<UserProfile> {
  try {
    // 1. Wipe only personal records, keep reference cases
    const raw = localStorage.getItem(PATIENT_RECORDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const demoOnly = parsed.filter(
          (r: any) => r.isDemo || r.id.startsWith('rec-mri-101') || r.id.startsWith('rec-mri-204')
        );
        localStorage.setItem(PATIENT_RECORDS_KEY, JSON.stringify(demoOnly));
      }
    }
  } catch (e) {
    console.warn('Error clearing patient records', e);
  }

  // Update profile counters to 0
  const updated: UserProfile = {
    ...currentProfile,
    personalScansCount: 0,
    latestMemoryScore: null,
    savedReportsCount: 0,
    submittedTicketsCount: 0,
    lastSyncedAt: new Date().toISOString(),
  };

  saveProfileLocally(updated);

  // Safe non-blocking sync to Firestore
  if (!currentProfile.isGuest && currentProfile.id) {
    safeFirestoreSetDoc('patients', currentProfile.id, {
      ...updated,
      updatedAt: new Date().toISOString(),
    });
    safeFirestoreSetDoc('users', currentProfile.id, {
      personalScansCount: 0,
      latestMemoryScore: null,
      savedReportsCount: 0,
      submittedTicketsCount: 0,
      lastSyncedAt: new Date().toISOString(),
    });
  }

  return updated;
}

/**
/**
 * Sync entire local profile, scans, and clinical history to Firestore
 */
export async function syncAllLocalDataToFirestore(userId: string): Promise<boolean> {
  if (!firestore || !userId) return false;
  try {
    // 1. Sync User Profile
    const profileRaw = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (profileRaw) {
      const p = JSON.parse(profileRaw);
      await safeFirestoreSetDoc('users', userId, {
        ...p,
        lastSyncedAt: new Date().toISOString(),
      });
      await safeFirestoreSetDoc('patients', userId, {
        ...p,
        lastSyncedAt: new Date().toISOString(),
      });
    }

    // 2. Sync Patient History Records (Scans & Encounters)
    const recordsRaw = localStorage.getItem(PATIENT_RECORDS_KEY);
    if (recordsRaw) {
      const records = JSON.parse(recordsRaw);
      if (Array.isArray(records)) {
        for (const rec of records) {
          if (rec.id && rec.isPersonal) {
            await safeFirestoreSetDoc(`users/${userId}/records`, rec.id, rec);
          }
        }
      }
    }
    return true;
  } catch (e) {
    console.warn('Firestore sync batch note:', e);
    return false;
  }
}

/**
 * Delete Entire Account & All Records
 */
export async function deleteEntireAccountService(
  currentProfile: UserProfile
): Promise<UserProfile> {
  const userId = currentProfile.id;

  // 1. Delete user from Firebase Authentication
  if (auth) {
    if (typeof (auth as any).authStateReady === 'function') {
      try {
        await (auth as any).authStateReady();
      } catch {}
    }
    if (auth.currentUser) {
      try {
        await auth.currentUser.delete();
      } catch (authErr: any) {
      console.warn('Auth user delete notice:', authErr);
      if (authErr?.code === 'auth/requires-recent-login') {
        // If Google provider, attempt reauthentication popup so user is truly removed from Firebase Auth console
        if (currentProfile.authProvider === 'google') {
          try {
            const provider = googleProvider || new GoogleAuthProvider();
            await reauthenticateWithPopup(auth.currentUser, provider);
            await auth.currentUser.delete();
          } catch (reauthErr) {
            console.error('Re-authentication before deletion failed:', reauthErr);
            throw new Error('For security, Google requires you to sign in again before permanently deleting your account.');
          }
        } else {
          throw new Error('For security, please sign in again before deleting your account.');
        }
      } else {
        throw new Error(authErr?.message || 'Could not delete account from Firebase Authentication. Please try again.');
      }
    }
  }
}

  // 2. Safe non-blocking delete from Firestore
  if (!currentProfile.isGuest && userId) {
    safeFirestoreDeleteDoc('users', userId);
    safeFirestoreDeleteDoc('patients', userId);
  }

  // 3. Clean all local session stores
  try {
    localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
    localStorage.removeItem(PATIENT_RECORDS_KEY);
    localStorage.removeItem('deepcortex_doctor_signoff');
    localStorage.removeItem(SUPPORT_TICKETS_KEY);
    sessionStorage.removeItem('deepcortex_session_id');
  } catch (e) {
    console.warn('Error wiping local storage', e);
  }

  const freshGuest = createDefaultGuestProfile(
    currentProfile.preferredLanguage,
    currentProfile.preferredRegion
  );
  saveProfileLocally(freshGuest);
  return freshGuest;
}
