import firebase from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyAbwWnrarghjL-hXLpPDfOb9J-FPm-Wb1s",
  authDomain: "rock-paper-scissors-9da14.firebaseapp.com",
  projectId: "rock-paper-scissors-9da14",
  storageBucket: "rock-paper-scissors-9da14.appspot.com",
  messagingSenderId: "166567719677",
  appId: "1:166567719677:web:2cb2412c65055531fc4494",
  measurementId: "G-H0M0NP7V68",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
export default firebase;
