import firebase from 'firebase/app';
import axios from 'axios';
import 'firebase/auth';
import firebaseConfig from '../auth/apiKeys';

const dbUrl = firebaseConfig.databaseURL;
// GET THE BOARDS
const getBoards = (uid) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/boards.json?orderBy="uid"&equalTo="${uid}"`)
    .then((response) => {
      if (response.data) {
        const boardsArray = Object.values(response.data);
        resolve(boardsArray);
      } else {
        resolve([]);
      }
    }).catch((error) => reject(error));
});
// DELETE THOSE BOARDS
const deleteBoard = (firebaseKey, uid) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/boards/${firebaseKey}.json `)
    .then(() => getBoards(uid).then((boardsArray) => resolve(boardsArray)))
    .catch((error) => reject(error));
});
// CREATE NEW BOARD
const createBoard = (boardObject, uid) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/boards.json`, boardObject)
    .then((response) => {
      const body = { firebaseKey: response.data.name };
      axios.patch(`${dbUrl}/boards/${response.data.name}.json`, body)
        .then(() => {
          getBoards(uid).then((boardsArray) => resolve(boardsArray));
        });
    }).catch((error) => reject(error));
});
// ACCESS SINGLE BOARD
const getSingleBoard = (firebaseKey) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/boards/${firebaseKey}.json`)
    .then((response) => resolve(response.data))
    .catch((error) => reject(error));
});
// UPDATE A BOARD'S INFO IN REAL TIME
const updateBoards = (firebaseKey, boardObject) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}/boards/${firebaseKey}.json`, boardObject)
    .then(() => {
      getBoards(firebase.auth().currentUser.uid).then((boardsArray) => resolve(boardsArray))
        .catch((error) => reject(error));
    });
});
// GET FAVORITE BOARDS
const getFavoriteBoards = () => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/boards.json?orderBy="favorite"&equalTo=true`)
    .then((response) => {
      const favoriteBoardsArray = Object.values(response.data);
      resolve(favoriteBoardsArray);
    }).catch((error) => reject(error));
});
// SEARCH BOARDS
const searchBoards = (uid, searchValue) => new Promise((resolve, reject) => {
  getBoards(uid).then((response) => {
    resolve(response.filter((board) => board.title.toLowerCase().includes(searchValue)));
  })
    .catch((error) => reject(error));
});
export {
  getBoards,
  deleteBoard,
  createBoard,
  getSingleBoard,
  updateBoards,
  getFavoriteBoards,
  searchBoards,
};
