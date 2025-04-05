/* eslint-disable */
import React, { useRef, useEffect, useState } from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MDBModal } from "mdb-react-ui-kit";
import {
  selectConnectState,
  selectUserState,
  selectLastError,
} from "../data/state";
import { setUIModal, ModalIndicator, selectUIState } from "../data/p_ui";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { AccountSlice, ConnectState } from "zkwasm-minirollup-browser";
import {
  getNuggets,
  queryInitialState,
  queryState,
  sendTransaction,
} from "../components/request";
import { createCommand } from "zkwasm-minirollup-rpc";
import { MarketPage } from "../components/MarketPage";
import { User } from "../components/User";
import Footer from "../components/Foot";
import Nav from "../components/Nav";
import NuggetModal from "../components/NuggetModal";
import ErrorModal from "../components/ErrorModal";
import { WithdrawModal } from "../components/Common";
import { MDBBtn, MDBContainer } from "mdb-react-ui-kit";

const REGISTER_PLAYER = 1n;

export function Main() {
  const connectState = useAppSelector(selectConnectState);
  const userState = useAppSelector(selectUserState);
  const lastError = useAppSelector(selectLastError);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const dispatch = useAppDispatch();
  const uiState = useAppSelector(selectUIState);
  const [inc, setInc] = useState(0);

  function updateState() {
    if (connectState == ConnectState.Idle) {
      dispatch(queryState(l2account!.getPrivateKey()));
    } else if (connectState == ConnectState.Init) {
      dispatch(queryInitialState("1"));
    }
    setInc(inc + 1);
  }

  useEffect(() => {
    if (l2account && connectState == ConnectState.Init) {
      dispatch(queryState(l2account!.getPrivateKey()));
    } else {
      dispatch(queryInitialState("1"));
    }
    dispatch(getNuggets(0));
  }, [l2account]);

  useEffect(() => {
    if (connectState == ConnectState.InstallPlayer) {
      const command = createCommand(0n, REGISTER_PLAYER, []);
      dispatch(
        sendTransaction({
          cmd: command,
          prikey: l2account!.getPrivateKey(),
        })
      );
    }
  }, [connectState]);

  return (
    <>
      <Nav />
      <MDBContainer className="mt-5">
        {userState?.player && <User />}
        <MarketPage />
      </MDBContainer>
      {userState?.player && lastError == null && <NuggetModal />}
      {lastError && <ErrorModal />}
      <Footer />
    </>
  );
}
