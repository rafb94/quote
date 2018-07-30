
import firebase from 'firebase'
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
    apiKey: "AIzaSyArFYBuC3PekSrCsy-geqmvKPVntG9mBIE",
    authDomain: "cotizador-92b14.firebaseapp.com",
    databaseURL: "https://cotizador-92b14.firebaseio.com",
    projectId: "cotizador-92b14",
    storageBucket: "cotizador-92b14.appspot.com",
    messagingSenderId: "661476248332"
};
var fire = firebase.initializeApp(config);
export default fire;