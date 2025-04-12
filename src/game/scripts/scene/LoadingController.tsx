import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectConnectState,
  selectNullableConfig,
  selectNullableUserState,
} from "../../../data/state";
import Gameplay from "./Gameplay";
import { queryInitialState } from "zkwasm-minirollup-browser/src/connect";
import { ConnectState } from "zkwasm-minirollup-browser";
import { ConnectController } from "./ConnectController";
import { setUIState, UIStateType } from "../../../data/ui";
import { getBids, getNugget, getNuggets } from "../request";
import { AccountSlice } from "zkwasm-minirollup-browser";

export function LoadingController() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectNullableUserState);
  const config = useAppSelector(selectNullableConfig);
  const connectState = useAppSelector(selectConnectState);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const [inc, setInc] = useState(0);

  // update State
  function updateState() {
    if (connectState == ConnectState.Init && userState == null) {
      dispatch(queryInitialState("1"));
    }
    setInc(inc + 1);
  }

  useEffect(() => {
    setTimeout(() => {
      updateState();
    }, 5000);
  }, [inc]);

  const requireContext = require.context(
    "../../images",
    true,
    /\.(png|jpg|jpeg|gif)$/
  );
  const imageUrls = requireContext.keys().map(requireContext) as string[];

  const onStart = async () => {
    /* */
  };

  const onStartGameplay = () => {
    dispatch(setUIState({ type: UIStateType.Idle }));
  };

  useEffect(() => {
    if (userState) {
      dispatch(getNuggets(0));
      dispatch(getBids(l2account!.getPrivateKey()));
      for (let i = 0; i < userState!.player!.data.inventory.length; i++) {
        dispatch(
          getNugget({
            index: i,
            nuggetId: userState!.player!.data.inventory[i],
          })
        );
      }
    }
  }, [userState]);

  if (
    config &&
    userState?.player &&
    Object.keys(userState.player!).length > 0
  ) {
    return <Gameplay />;
  } else {
    return (
      <ConnectController
        imageUrls={imageUrls}
        onStart={onStart}
        onStartGameplay={onStartGameplay}
      />
    );
  }
}
