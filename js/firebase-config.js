import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBptGoX94xU29pPMvs9D3EJBWTYffVUnYE",
  authDomain: "studymap-dbb27.firebaseapp.com",
  projectId: "studymap-dbb27",
  storageBucket: "studymap-dbb27.firebasestorage.app",
  messagingSenderId: "649146908608",
  appId: "1:649146908608:web:4145f598f7d79d1756d225",
  measurementId: "G-5QMQDFE47W",
};

// Initialize Firebase (safe to call multiple times — returns cached app)
const app = initializeApp(firebaseConfig);

// Export shared service instances used throughout the app
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
