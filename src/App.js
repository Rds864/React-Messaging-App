import react, { useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import 'firebase/firestore';
import 'firebase/auth';

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; 

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({

  apiKey: "AIzaSyAFuJ_nMzCUNUVw_dc6mgtyOqYHaNGzVfI",
  authDomain: "officialmegachat.firebaseapp.com",
  projectId: "officialmegachat",
  storageBucket: "officialmegachat.appspot.com",
  messagingSenderId: "1086599014389",
  appId: "1:1086599014389:web:87096bf8a1d108b62762bc",
  measurementId: "G-JHDZ00J524"

})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>

      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);

  }
  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}
function SignOut(){
  return auth.currentUser && (

    <button onClick={() => auth.SignOut()}>Sign Out</button>
  )
}
function ChatRoom(){

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const[formValue, setFormValue] = useState('');

  const dummy =useRef();

const sendMessage =async(e) =>{

  e.preventDefault();

  const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
     });

     setFormValue('');

     dummy.current.scrollIntoView({behavior: 'smooth'});
 }

  return(
    <>
    <div>
    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    
    <div ref={dummy}></div>
    </div>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
    <button type="submit"> # </button>
    </form>
    </>
  )
}

function ChatMessage(props){
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return(
  <div className={'message ${messageClass}'}>
    <img src={photoURL} />
    <p>{text}</p>
  </div>
  )

}
export default App;
