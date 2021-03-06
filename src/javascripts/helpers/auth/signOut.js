import firebase from 'firebase/app';
import 'firebase/auth';
// eslint-disable-next-line import/no-cycle
import domEvents from '../../events/domEvents';

const signOut = () => {
  document.querySelector('body').removeEventListener('click', domEvents);
  firebase.auth().signOut();
};

export default signOut;
