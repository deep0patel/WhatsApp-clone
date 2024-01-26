import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3vYcAnADUKpCr2py51d7VAG-jr3fyQxI",
  authDomain: "whatsapp-clone-e24e7.firebaseapp.com",
  projectId: "whatsapp-clone-e24e7",
  storageBucket: "whatsapp-clone-e24e7.appspot.com",
  messagingSenderId: "50416203441",
  appId: "1:50416203441:web:8812d365667d49df009490"
};
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export { db }