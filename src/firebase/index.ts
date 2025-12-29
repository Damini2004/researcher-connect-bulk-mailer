import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { firebaseConfig } from "./config";

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function initializeFirebase() {
    if (!getApps().length) {
        firebaseApp = initializeApp(firebaseConfig);
        auth = getAuth(firebaseApp);
        firestore = getFirestore(firebaseApp);
    }
    return { firebaseApp, auth, firestore };
}

export { initializeFirebase };
export * from "./provider";
export * from "./firestore/use-collection";
export * from "./firestore/use-doc";
export * from "./auth/use-user";
