import React, { useEffect, useState } from "react";
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
import { Nugget } from "../data/model";
import { createCommand } from "zkwasm-minirollup-rpc";
import { sendTransaction, getNugget, getNuggets, getBids } from "./request";
import { selectNuggets, setFocus } from "./p_ui";
import { AccountSlice, ConnectState } from "zkwasm-minirollup-browser";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { NuggetCard } from "./NuggetCard";

export const MarketPage = () => {
  const userState = useAppSelector(selectUserState);
  const nuggetsState = useAppSelector(selectNuggets);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getNuggets(0));
  }, [userState]);

  return (
    <>
      <h3 className="mt-2"> Market Place </h3>
      <MDBRow>
        {nuggetsState.nuggets.map((nugget: Nugget) => {
          return (
            <MDBCol md="3" className="mt-4" key={nugget.id}>
              <NuggetCard nugget={nugget} />
            </MDBCol>
          );
        })}
      </MDBRow>
    </>
  );
};
