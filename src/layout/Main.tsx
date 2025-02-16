/* eslint-disable */
import React, { useEffect, useState } from "react";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style.scss";
import { selectConnectState, selectUserState } from "../data/state";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { AccountSlice, ConnectState } from "zkwasm-minirollup-browser";
import { queryInitialState, queryState, sendTransaction } from "../request";
import { createCommand } from "zkwasm-minirollup-rpc";
import { getNuggets }  from "../data/ui";
import { MarketPage } from "../components/MarketPage";
import Footer from "../components/Foot";
import Nav from "../components/Nav";
import NuggetModal from "../components/NuggetModal";

const REGISTER_PLAYER = 1n;

export function Main() {
  const connectState = useAppSelector(selectConnectState);
  const userState = useAppSelector(selectUserState);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const dispatch = useAppDispatch();
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
    dispatch(getNuggets(0))
  }, [l2account]);

  /*
  useEffect(() => {
    setTimeout(() => {
      updateState();
    }, 3000);
  }, [inc]);
  */

  useEffect(() => {
    if (connectState == ConnectState.InstallPlayer) {
      const command = createCommand(0n, REGISTER_PLAYER, []);
      dispatch(sendTransaction({
        cmd: command,
        prikey: l2account!.getPrivateKey()
      }));
    }
  }, [connectState]);

  return (
    <>
      <Nav />
      {userState?.player &&
      <MarketPage />
      }
      {userState?.player &&
      <NuggetModal/>
      }
      
      <Footer />
    </>
  );
}
