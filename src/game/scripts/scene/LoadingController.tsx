import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectConnectState,
  selectNullableConfig,
  selectNullableUserState,
} from "../../../data/state";
import Gameplay from "./Gameplay";
import { useWalletContext, queryInitialState, queryState, ConnectState } from "zkwasm-minirollup-browser";
import { ConnectController } from "./ConnectController";
import { setUIState, UIStateType } from "../../../data/ui";


export function LoadingController() {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectNullableUserState);
  const { l2Account } = useWalletContext();
  const config = useAppSelector(selectNullableConfig);
  const connectState = useAppSelector(selectConnectState);
  const [inc, setInc] = useState(0);

  // update State
  function updateState() {
    if (connectState == ConnectState.Init && userState == null) {
      dispatch(queryInitialState("1"));
    } else if (l2Account) {
      dispatch(queryState(l2Account.getPrivateKey()));
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
