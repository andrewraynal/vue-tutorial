import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/firestore';

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyAZtVPidnF6Kmf2y4Z52PclMjb3R0iwM6U',
  authDomain: 'amazeballs-vue.firebaseapp.com',
  databaseURL: 'https://amazeballs-vue.firebaseio.com',
  projectId: 'amazeballs-vue',
  storageBucket: 'amazeballs-vue.appspot.com',
  messagingSenderId: '1099319000324'
};
firebase.initializeApp(config);

// The shared state object that any vue component can get access to.
// Has some placeholders that we’ll use further on!
export const store = {
  ballsInFeed: null,
  currentUser: null,
  writeBall: message => {
    const dt = {
      createdOn: new Date(),
      author: store.currentUser.uid,
      author_name: store.currentUser.displayName,
      author_image: store.currentUser.photoURL,
      message
    };
    return ballsCollection
      .add(dt)
      .catch(e => console.error('error inserting', dt, e));
  }
};

// a reference to the Balls collection
const ballsCollection = firebase.firestore().collection('balls');
// onSnapshot is executed every time the data
// in the underlying firestore collection changes
// It will get passed an array of references to
// the documents that match your query
ballsCollection
  .orderBy('createdOn', 'desc')
  .limit(5)
  .onSnapshot(ballsRef => {
    const balls = [];
    ballsRef.forEach(doc => {
      const ball = doc.data();
      ball.id = doc.id;
      balls.push(ball);
    });
    console.log('Received Balls feed:', balls);
    store.ballsInFeed = balls;
  });

// When a user logs in or out, save that in the store
firebase.auth().onAuthStateChanged(user => {
  console.log('Logged in as:', user);
  store.currentUser = user;
});
