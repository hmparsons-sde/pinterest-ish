import firebase from 'firebase/app';
import 'firebase/auth';
import { showBoards } from '../components/boards';
import { createBoard } from '../helpers/data/boardData';
import addBoardForm from '../components/forms/newBoardForm';
import {
  createPin, deletePin, getSinglePin, updatePin
} from '../helpers/data/pinData';
import { showPins } from '../components/pins';
import addPinForm from '../components/forms/newPinForm';
import formModal from '../components/forms/formModal';
import editPinForm from '../components/forms/editPinForm';
import boardInfo from '../components/boardInfo';
import { boardsAndPins, deleteBoardsPins } from '../helpers/data/boardsAndPins';

const domEvents = (uid) => {
  document.querySelector('body').addEventListener('click', (e) => {
    // DELETE PIN
    if (e.target.id.includes('delete-pin')) {
      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure?')) {
        const firebaseKey = e.target.id.split('--')[1];
        deletePin(firebaseKey, uid).then((pinsArray) => showPins(pinsArray));
      }
    }
    // TOGGLE CREATE PIN FORM
    if (e.target.id.includes('add-pin-btn')) {
      formModal('Create New Pin');
      addPinForm();
      $('#formModal').modal('toggle');
    }
    // SUBMIT CREATE PIN FORM
    if (e.target.id.includes('submit-pin')) {
      e.preventDefault();
      const pinObject = {
        title: document.querySelector('#title').value,
        image: document.querySelector('#image').value,
        url: document.querySelector('#article').value,
        favorite: document.querySelector('#favorite').checked,
        board_id: document.querySelector('#board').value,
        uid: firebase.auth().currentUser.uid
      };
      createPin(pinObject, uid).then((pinsArray) => showPins(pinsArray));
      $('#formModal').modal('toggle');
    }
    // TOGGLE EDIT PIN FORM
    if (e.target.id.includes('edit-pin')) {
      const firebaseKey = e.target.id.split('--')[1];
      formModal('Edit Pin');
      getSinglePin(firebaseKey).then((pinObject) => editPinForm(pinObject));
    }
    // EDIT PINS FORM SUBMIT
    if (e.target.id.includes('update-pin')) {
      const firebaseKey = e.target.id.split('--')[1];
      e.preventDefault();
      const pinObject = {
        title: document.querySelector('#title').value,
        image: document.querySelector('#image').value,
        article: document.querySelector('#article-url').value,
        favorite: document.querySelector('#favorite').checked,
        board_id: document.querySelector('#board').value,
        uid: firebase.auth().currentUser.uid
      };
      updatePin(firebaseKey, pinObject).then((pinsArray) => showPins(pinsArray));
      $('#formModal').modal('toggle');
    }
    // DELETE A BOARD & ALL OF ITS PINS
    if (e.target.id.includes('delete-board')) {
      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure?')) {
        const firebaseKey = e.target.id.split('--')[1];
        deleteBoardsPins(firebaseKey, uid).then((boardsArray) => showBoards(boardsArray));
      }
    }
    // TOGGLE CREATE BOARD FORM
    if (e.target.id.includes('add-board-btn')) {
      formModal('Create New Board');
      addBoardForm();
      $('#formModal').modal('toggle');
    }
    // SUBMIT FORM TO CREATE NEW BOARD
    if (e.target.id.includes('submit-board')) {
      e.preventDefault();
      const boardObject = {
        title: document.querySelector('#title').value,
        cover_photo: document.querySelector('#image').value,
        article: document.querySelector('#article').value,
        uid: firebase.auth().currentUser.uid
      };
      createBoard(boardObject, uid).then((boardsArray) => showBoards(boardsArray));
      $('#formModal').modal('toggle');
    }
    // NAVIGATE TO SINGLE BOARD VIEW
    if (e.target.id.includes('board-title')) {
      const boardId = e.target.id.split('--')[1];
      boardsAndPins(boardId).then((boardPinsObject) => {
        showPins(boardPinsObject.pins);
        boardInfo(boardPinsObject.board);
      });
    }
  });
};

export default domEvents;
