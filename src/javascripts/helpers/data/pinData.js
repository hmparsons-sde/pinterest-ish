/* eslint-disable camelcase */
import firebase from 'firebase/app';
import 'firebase/auth';
import axios from 'axios';
import firebaseConfig from '../auth/apiKeys';

const dbUrl = firebaseConfig.databaseURL;
// GET PINS
const getPins = (uid) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/pins.json?orderBy="uid"&equalTo="${uid}"`)
    .then((response) => {
      if (response.data) {
        resolve(Object.values(response.data));
      } else {
        resolve([]);
      }
    }).catch((error) => reject(error));
});
// DELETE PINS
const deletePin = (firebaseKey, uid) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/pins/${firebaseKey}.json`)
    .then(() => getPins(uid).then((pinsArray) => resolve(pinsArray)))
    .catch((error) => reject(error));
});
// CREATE NEW PIN
const createPin = (pinObject, uid) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/pins.json`, pinObject)
    .then((response) => {
      const body = { firebaseKey: response.data.name };
      axios.patch(`${dbUrl}/pins/${response.data.name}.json`, body)
        .then(() => {
          getPins(uid).then((pinsArray) => resolve(pinsArray));
        });
      console.warn(response.data.name);
    }).catch((error) => reject(error));
});
// RETRIEVE A SINGLE PIN IN ORDER TO EDIT/UPDATE
const getSinglePin = (firebaseKey) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/pins/${firebaseKey}.json`)
    .then((response) => resolve(response.data))
    .catch((error) => reject(error));
});
// SPEAKING OF... UPDATE A PIN'S INFO IN REAL TIME
const updatePin = (firebaseKey, pinObject) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}/pins/${firebaseKey}.json`, pinObject)
    .then(() => {
      getPins(firebase.auth().currentUser.uid).then((pinsArray) => resolve(pinsArray))
        .catch((error) => reject(error));
    });
});
// GET PINS THAT BELONG TO SINGLE BOARD
const getBoardPins = (boardId) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/pins.json?orderBy="board_id"&equalTo="${boardId}"`)
    .then((response) => resolve(Object.values(response.data)))
    .catch((error) => reject(error));
});
// GET PINS WITH FAVORITE BOOLEAN EQUAL TO TRUE
const getFavoritePins = () => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/pins.json?orderBy="favorite"&equalTo=true`)
    .then((response) => {
      const favoritePinsArray = Object.values(response.data);
      resolve(favoritePinsArray);
    }).catch((error) => reject(error));
});
// SEARCH PINS
const searchPins = (uid, searchValue) => new Promise((resolve, reject) => {
  getPins(uid).then((response) => {
    resolve(response.filter((pin) => pin.title.toLowerCase().includes(searchValue)));
  })
    .catch((error) => reject(error));
});
// PUBLIC PINS
const publicPins = () => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/pins.json?orderBy="public"&equalTo=true`)
    .then((response) => resolve(Object.values(response.data)))
    .catch((error) => reject(error));
});
const getPublicPins = () => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/pins.json?orderBy="public"&equalTo=true`)
    .then((response) => resolve(Object.values(response.data)))
    .catch((error) => reject(error));
});
// ADD PUBLIC PINS
const addPublicPin = (firebaseKey, pinObject) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}/pins/${firebaseKey}.json`, pinObject)
    .then(() => publicPins().then((pinsArray) => resolve(pinsArray)))
    .catch((error) => reject(error));
});

export {
  getPins,
  deletePin,
  createPin,
  getSinglePin,
  updatePin,
  getBoardPins,
  getFavoritePins,
  searchPins,
  publicPins,
  addPublicPin,
  getPublicPins
};
