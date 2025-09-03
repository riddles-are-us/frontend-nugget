import { useEffect, useState, useRef } from "react";
import { useWalletContext, getConfig, sendTransaction, queryState, ConnectState } from "zkwasm-minirollup-browser";
// scene/ConnectController.tsx
import { createCommand } from "zkwasm-minirollup-rpc";
import { useAppDispatch, useAppSelector, useViewport } from "../../../app/hooks";
import { selectConnectState, setConnectState } from "../../../data/state";
import LoadingPage from "./LoadingPage";
import WelcomePage from "./WelcomePage";
import { pushError } from "../../../data/errors";
import { useConnectModal } from "zkwasm-minirollup-browser";
import { useLazyImageLoading, filterAssetsForDevice, getConnectionSpeed } from "../common/ResourceManager";

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
  const viewport = useViewport();
  const { preloadImages } = useLazyImageLoading();
  const {
    isConnected,
    isL2Connected,
    l1Account,
    l2Account,
    connectL1,
    connectL2,
    disconnect
  } = useWalletContext();
  const connectState = useAppSelector(selectConnectState);
  const [queryingLogin, setQueryingLogin] = useState(false);

  // RainbowKit connect modal hook
  const { openConnectModal } = useConnectModal();

  const showedModal = useRef(false);

  useEffect(() => {
    if (!isConnected && !showedModal.current) {
      showedModal.current = true;
      openConnectModal?.();
    }
  }, [isConnected, openConnectModal]);

  useEffect(() => {
    if (isConnected && !l1Account) {
      connectL1();
    }
  }, [isConnected, l1Account, connectL1]);

  const prevIsConnected = useRef(isConnected);

  useEffect(() => {
    if (prevIsConnected.current && !isConnected) {
      showedModal.current = false;
      openConnectModal?.();
    }
    prevIsConnected.current = isConnected;
  }, [isConnected, openConnectModal]);


  const loadImages = async () => {
    try {
      // Filter images based on device capabilities
      const filteredImageUrls = filterAssetsForDevice(imageUrls, viewport.device);
      const connectionSpeed = getConnectionSpeed();
      
      // Adjust loading strategy based on connection speed
      const imagesToLoad = connectionSpeed === 'slow' 
        ? filteredImageUrls.slice(0, Math.floor(filteredImageUrls.length * 0.6))
        : filteredImageUrls;
      
      console.log(`Loading ${imagesToLoad.length} images for ${viewport.device} device (${connectionSpeed} connection)`);
      
      await preloadImages(imagesToLoad, viewport.device, (loaded, total) => {
        setProgress(Math.ceil((loaded / total) * 8000) / 100);
      });
      
      console.log(`${imagesToLoad.length} images loaded successfully`);
    } catch (error) {
      const message = "Error loading images: " + error;
      dispatch(pushError(message));
      console.error(message);
    }
  };

  useEffect(() => {
    if (l1Account) {
      if (connectState == ConnectState.Init) {
        dispatch(setConnectState(ConnectState.OnStart));
      }
    }
  }, [l1Account]);

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
          prikey: l2Account!.getPrivateKey(),
        })
      );
    }
  }, [connectState]);

  const onLogin = async () => {
    if (!queryingLogin) {
      await connectL2();
      setQueryingLogin(true);
    }
  };

  const onStartGame = () => {
    if (!l2Account) return;
    dispatch(queryState(l2Account.getPrivateKey()));
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
        isLogin={l2Account != null}
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
