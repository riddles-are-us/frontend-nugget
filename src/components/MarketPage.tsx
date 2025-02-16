import React, { useEffect, useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBTable, MDBTableBody, MDBTableHead, MDBBtn } from 'mdb-react-ui-kit';
import { selectUserState, Nugget } from '../data/state';
import { createCommand } from "zkwasm-minirollup-rpc";
import { sendTransaction } from "../request";
import { getNugget, selectNuggets, setFocus } from '../data/ui';
import { AccountSlice, ConnectState } from "zkwasm-minirollup-browser";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import "./style.scss";

const EXPLORE_NUGGET = 4n;
const SELL_NUGGET = 5n;
const BID_NUGGET = 6n;
const CREATE_NUGGET = 7n;

export const MarketPage = () => {
  const userState = useAppSelector(selectUserState);
  const nuggetsState = useAppSelector(selectNuggets);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const dispatch = useAppDispatch();


  useEffect(() => {
    for (let i = 0; i<userState!.player!.data.inventory.length; i++) {
      dispatch(getNugget({index: i, nuggetId: userState!.player!.data.inventory[i]}));
    }
  }, [userState]);


  function setFocusNugget(nugget: Nugget, index: number | null = null) {
    dispatch(setFocus({
      nugget: nugget,
      index: index 
    }));
  }

  const pickNugget = () => {
    const command = createCommand(BigInt(userState!.player!.nonce), CREATE_NUGGET, []);
    dispatch(sendTransaction({
      cmd: command,
      prikey: l2account!.getPrivateKey()
    }));
  }


  return (
    <MDBContainer className="mt-5">
      <MDBRow>
        <MDBCol md="12">
          <MDBCard>
            <MDBCardHeader>
              <div className="d-flex">
                <h5>
                  Player Avator
                </h5>
              </div>
            </MDBCardHeader>
            <MDBCardBody>
                <p>{userState?.player?.data.balance}</p>
                <MDBBtn onClick={()=>pickNugget()}>Pick Nugget</MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      <h3 className="mt-2"> Inventory </h3>
      <MDBRow>
          {
          userState!.player!.data.inventory.map((nuggetId:number, index: number) => {
            if (nuggetsState.inventory[index] != null) {
              const nugget = nuggetsState.inventory[index];
              return (
                <MDBCol md="3" className="mt-3" key={nuggetId}>
                  <MDBCard>
                    <MDBCardHeader>
                      <div className="d-flex">
                        <h5>NuggetID :
                         {nuggetId}
                        </h5>
                      </div>
                    </MDBCardHeader>
                    <MDBCardBody>
                      <p>Recycle Price: {nugget.sysprice}</p>
                      <p>Attributes: {nugget.attributes}</p>
                      <p>cycle: {nugget.cycle}</p>
                      <p>Bid: {nugget.bid ? nugget.bid?.bidprice : "NA"}</p>
                      <MDBBtn onClick={()=>setFocusNugget(nugget, index)}>more</MDBBtn>
                    </MDBCardBody>

                  </MDBCard>
                </MDBCol>
              );
            } else {
              return <></>
            }
          })
              }
      </MDBRow>

      <h3 className="mt-2"> Market Place </h3>
      <MDBRow>
      {
          nuggetsState.nuggets.map((nugget:Nugget) => {
            return (
              <MDBCol md="3" className="mt-4" key={nugget.id}>
                <MDBCard>
                  <MDBCardHeader>
                    <div className="d-flex">
                      <h5> NuggetID:
                       {nugget.id}
                      </h5>
                    </div>
                  </MDBCardHeader>
                  <MDBCardBody>
                      <p>Recycle Price: {nugget.sysprice}</p>
                      <p>Attributes: {nugget.attributes}</p>
                      <p>cycle: {nugget.cycle}</p>
                      <p>Bid: {nugget.bid ? nugget.bid?.bidprice : "NA"}</p>
                      <MDBBtn onClick={()=>setFocusNugget(nugget)}>more</MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            );
          })
      }
      </MDBRow>
    </MDBContainer>
  );
};
