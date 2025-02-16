import React from 'react';
import { getNugget, setFocus, selectNuggets } from '../data/ui';
import { selectUserState, Nugget } from '../data/state';
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { sendTransaction } from "../request";
import { AccountSlice, ConnectState } from "zkwasm-minirollup-browser";
import { createCommand } from "zkwasm-minirollup-rpc";

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

const EXPLORE_NUGGET = 4n;
const SELL_NUGGET = 5n;
const BID_NUGGET = 6n;
const CREATE_NUGGET = 7n;

const Modal = () => {
  const userState = useAppSelector(selectUserState);
  const nuggetsState = useAppSelector(selectNuggets);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const dispatch = useAppDispatch();


  const exploreNugget = (index: number) => {
    const command = createCommand(BigInt(userState!.player!.nonce), EXPLORE_NUGGET, [BigInt(index)]);
    dispatch(sendTransaction({
      cmd: command,
      prikey: l2account!.getPrivateKey()
    }));
  }

  const sellNugget = (index: number) => {
    const command = createCommand(BigInt(userState!.player!.nonce), SELL_NUGGET, [BigInt(index)]);
    dispatch(sendTransaction({
      cmd: command,
      prikey: l2account!.getPrivateKey()
    }));
  }

  const bidNugget = (index: number) => {
    const command = createCommand(BigInt(userState!.player!.nonce), BID_NUGGET, [BigInt(index), 1n]);
    dispatch(sendTransaction({
      cmd: command,
      prikey: l2account!.getPrivateKey()
    }));
  }

  function ButtonGroup() {
    if (nuggetsState.focus!.index != null) {
      const index = nuggetsState.focus!.index;
      const nugget = nuggetsState.focus!.nugget;
      return <>
        <MDBBtn onClick={()=>exploreNugget(index)}>Explore Nugget</MDBBtn>
        <MDBBtn onClick={()=>sellNugget(index)}>Sell Nugget</MDBBtn>
      </>
    } else {
      const nugget = nuggetsState.focus!.nugget;
      return <MDBBtn onClick={()=>bidNugget(nugget.id)}>Bid Nugget</MDBBtn>
    }
  }

  function closeFocusNugget() {
    dispatch(setFocus(null));
  }



  if (nuggetsState.focus == null) {
    return <></>
  } else {
    const nugget = nuggetsState.focus.nugget;
    return (
    <MDBModal open={true} onClose={() => closeFocusNugget()} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Nugget ID: {nugget.id}</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={closeFocusNugget}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
            <p>Recycle Price: {nugget.sysprice}</p>
            <p>Attributes: {nugget.attributes}</p>
            <p>cycle: {nugget.cycle}</p>
            <p>Bid: {nugget.bid ? nugget.bid?.bidprice : "NA"}</p>
            </MDBModalBody>
            <MDBModalFooter>
              <ButtonGroup></ButtonGroup>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    )
  }
};

export default Modal;
