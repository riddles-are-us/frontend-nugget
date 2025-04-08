import React, { useRef, useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBBtn,
} from "mdb-react-ui-kit";
import { selectUserState } from "../data/state";
import { NuggetData } from "../data/model";
import { createCommand } from "zkwasm-minirollup-rpc";
import { getBids, getNugget, getNuggets, sendTransaction } from "./request";
import { selectNuggets, setFocus } from "./p_ui";
import { AccountSlice, ConnectState } from "zkwasm-minirollup-browser";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { NuggetCard } from "./NuggetCard";
import { WithdrawModal } from "./Common";
import { setUIModal, ModalIndicator, selectUIState } from "./p_ui";

const CREATE_NUGGET = 7n;

export const User = () => {
  const userState = useAppSelector(selectUserState);
  const nuggetsState = useAppSelector(selectNuggets);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const dispatch = useAppDispatch();

  const lpanel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    for (let i = 0; i < userState!.player!.data.inventory.length; i++) {
      dispatch(
        getNugget({ index: i, nuggetId: userState!.player!.data.inventory[i] })
      );
    }
    dispatch(getBids(l2account!.getPrivateKey()));
  }, [userState]);

  function setFocusNugget(nugget: NuggetData, index: number | null = null) {
    dispatch(
      setFocus({
        nugget: nugget,
        index: index,
      })
    );
  }

  const pickNugget = () => {
    const command = createCommand(
      BigInt(userState!.player!.nonce),
      CREATE_NUGGET,
      []
    );
    dispatch(
      sendTransaction({
        cmd: command,
        prikey: l2account!.getPrivateKey(),
      })
    );
  };

  function withdraw() {
    dispatch(setUIModal({ modal: ModalIndicator.WITHDRAW }));
  }

  function deposit() {
    dispatch(setUIModal({ modal: ModalIndicator.DEPOSIT }));
  }

  return (
    <>
      <MDBRow>
        <MDBCol md="12">
          <MDBCard>
            <MDBCardHeader>
              <div className="d-flex">
                <h5>Player Avator</h5>
              </div>
            </MDBCardHeader>
            <MDBCardBody>
              <p>{userState?.player?.data.balance}</p>
              <div ref={lpanel} />
              {lpanel.current && (
                <WithdrawModal
                  lpanel={lpanel.current}
                  balanceOf={(a) => a.data.balance}
                  handleClose={() => {
                    return;
                  }}
                ></WithdrawModal>
              )}

              <MDBBtn onClick={() => pickNugget()}>Pick Nugget</MDBBtn>
              <MDBBtn onClick={() => withdraw()}>withdraw </MDBBtn>
              <MDBBtn onClick={() => deposit()}>deposit</MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      <h3 className="mt-2"> Inventory </h3>
      <MDBRow>
        {userState!.player!.data.inventory.map(
          (nuggetId: number, index: number) => {
            if (nuggetsState.inventory[index] != null) {
              const nugget = nuggetsState.inventory[index];
              return (
                <MDBCol md="3" className="mt-3" key={nuggetId}>
                  <NuggetCard nugget={nugget} index={index} />
                </MDBCol>
              );
            } else {
              return <></>;
            }
          }
        )}
      </MDBRow>

      <h3 className="mt-2"> bids </h3>
      <MDBRow>
        {nuggetsState.bid.map((nugget: NuggetData) => {
          return (
            <MDBCol md="3" className="mt-3" key={nugget.id}>
              <NuggetCard nugget={nugget} />
            </MDBCol>
          );
        })}
      </MDBRow>
    </>
  );
};
