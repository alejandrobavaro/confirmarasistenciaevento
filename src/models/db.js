// src/models/db.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Config de tu proyecto (esta la copias desde Firebase Console → Configuración del proyecto)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "confirmarasistenciaevento.firebaseapp.com",
  databaseURL: import.meta.env.VITE_DATABASEURL,
  projectId: "confirmarasistenciaevento",
  storageBucket: "confirmarasistenciaevento.firebasestorage.app",
  messagingSenderId: "374007904021",
  appId: "1:374007904021:web:36c08e4bc9afff828a5b1c",
  measurementId: "G-73GMSX7SPC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
