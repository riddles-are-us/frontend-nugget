import React from 'react';
import { selectLastError, setLastTransactionError } from '../data/state';
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { AccountSlice } from "zkwasm-minirollup-browser";

import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
//import './Modal.css'; // Optional: for styling the modal
//

const Modal = () => {
  const lastError = useAppSelector(selectLastError);
  const dispatch = useAppDispatch();

  function clearLastError() {
    //console.log(setLastTransactionError);
    dispatch(setLastTransactionError(null));
  }

  return (
  <MDBModal open={true} onClose={() => clearLastError()} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Error Occurred</MDBModalTitle>
          </MDBModalHeader>
          <MDBModalBody>
            {lastError?.errorInfo}
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  )
};

export default Modal;
