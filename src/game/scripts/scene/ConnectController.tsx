import { useEffect, useState } from "react";
import { AccountSlice, ConnectState } from "zkwasm-minirollup-browser";
import {
  getConfig,
  sendTransaction,
  queryState,
} from "zkwasm-minirollup-browser/src/connect";
import { createCommand } from "zkwasm-minirollup-rpc";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectConnectState, setConnectState } from "../../../data/state";
import LoadingPage from "./LoadingPage";
import WelcomePage from "./WelcomePage";

const CREATE_PLAYER = 1n;

interface Props {
  imageUrls: string[];
  onStart: () => Promise<void>;
  onStartGameplay: () => void;
}

export function ConnectController({
  imageUrls,
  onStart,
  onStartGameplay,
}: Props) {
  const dispatch = useAppDispatch();
  const [progress, setProgress] = useState(0);
  const l1account = useAppSelector(AccountSlice.selectL1Account);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const connectState = useAppSelector(selectConnectState);
  const [queryingLogin, setQueryingLogin] = useState(false);

  async function preloadImages(imageUrls: string[]): Promise<void> {
    let loadedCount = 0;
    const loadImage = (url: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          loadedCount++;
          setProgress(Math.ceil((loadedCount / imageUrls.length) * 8000) / 100);
          resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      });
    };

    const promises = imageUrls.map((url) => loadImage(url));
    await Promise.all(promises);
  }

  const loadImages = async () => {
    try {
      await preloadImages(imageUrls);
      console.log(`${imageUrls.length} images loaded`);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  useEffect(() => {
    dispatch(AccountSlice.loginL1AccountAsync());
  }, []);

  useEffect(() => {
    if (connectState == ConnectState.Init) {
      dispatch(setConnectState(ConnectState.OnStart));
    }
  }, [l1account]);

  useEffect(() => {
    console.log("connectState", connectState);
    if (connectState == ConnectState.OnStart) {
      onStart().then(() => {
        dispatch(setConnectState(ConnectState.Preloading));
      });
    } else if (connectState == ConnectState.Preloading) {
      loadImages().then(() => {
        dispatch(getConfig());
      });
    } else if (connectState == ConnectState.InstallPlayer) {
      const command = createCommand(0n, CREATE_PLAYER, []);
      dispatch(
        sendTransaction({
          cmd: command,
          prikey: l2account!.getPrivateKey(),
        })
      );
    }
  }, [connectState]);

  const onLogin = () => {
    if (!queryingLogin) {
      dispatch(
        AccountSlice.loginL2AccountAsync("ZKWASM-BEAT")
      ); /* create player */
      setQueryingLogin(true);
    }
  };

  const onStartGame = () => {
    dispatch(queryState(l2account!.getPrivateKey()));
    onStartGameplay();
  };

  if (connectState == ConnectState.Init) {
    return <LoadingPage message={"Initialising"} progress={0} />;
  } else if (connectState == ConnectState.OnStart) {
    return <LoadingPage message={"Starting"} progress={0} />;
  } else if (connectState == ConnectState.Preloading) {
    return <LoadingPage message={"Preloading Textures"} progress={progress} />;
  } else if (connectState == ConnectState.Idle) {
    return (
      <WelcomePage
        isLogin={l2account != null}
        onLogin={onLogin}
        onStartGame={onStartGame}
      />
    );
  } else if (connectState == ConnectState.QueryConfig) {
    return <LoadingPage message={"Querying Config"} progress={0} />;
  } else if (connectState == ConnectState.QueryState) {
    return <LoadingPage message={"Querying State"} progress={0} />;
  } else if (connectState == ConnectState.ConnectionError) {
    return <LoadingPage message={"Error"} progress={0} />;
  } else {
    return <LoadingPage message={"Loading"} progress={0} />;
  }
}
