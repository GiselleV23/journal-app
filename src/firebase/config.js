import {getAuth} from 'firebase/auth'; //añadidos
import {getFirestore} from 'firebase/firestore/lite';//añadidos


import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCy6Gqq0cKOycI-pUpf2WpgoYN47SUJGTE",
  authDomain: "react-curso-7eab7.firebaseapp.com",
  projectId: "react-curso-7eab7",
  storageBucket: "react-curso-7eab7.appspot.com",
  messagingSenderId: "518889905406",
  appId: "1:518889905406:web:6ed4dd12dc3678300a99af"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);//cambios export y el nombre

export const FirebaseAuth = getAuth(FirebaseApp);//añadidos. esto contiene todas las funcionalidades de autenticacion
export const FirebaseDB = getFirestore(FirebaseApp);//añadidos.esto es todo lo relacionado con la base de datos