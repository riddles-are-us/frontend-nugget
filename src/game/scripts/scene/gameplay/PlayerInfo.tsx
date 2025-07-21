import { useEffect, useRef, useState } from "react";
import DefaultButton from "../../buttons/DefaultButton";
import "./PlayerInfo.css";
import {
  addressAbbreviation,
  getTextShadowStyle,
  PICK_NUGGET_COST,
} from "../../common/Utility";
import { useWalletContext, sendTransaction } from "zkwasm-minirollup-browser";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectUserState } from "../../../../data/state";
import { setUIState, UIStateType } from "../../../../data/ui";
import { getCreateNuggetTransactionCommandArray } from "../../request";
import treasure_image from "../../../images/scene/gameplay/top_container/treasure.png";
import cash_image from "../../../images/scene/gameplay/top_container/cash.png";
import available_image from "../../../images/scene/gameplay/top_container/available.png";
import {
  LoadingType,
  pushError,
  selectIsLoading,
  setLoadingType,
} from "../../../../data/errors";
import { setNuggetsForceUpdate } from "../../../../data/nuggets";
import LeaderRankButton from "../../buttons/LeaderRankButton";
import PlayerTreasureInfo from "./PlayerTreasureInfo";
import EarningRankButton from "../../buttons/EarningRankButton";
import { AnyAction } from "@reduxjs/toolkit";
import { title } from "process";

const PlayerInfo = () => {
  const dispatch = useAppDispatch();
  const { l2Account } = useWalletContext();
  const playerId = addressAbbreviation("0x" + l2Account!.pubkey, 20);
  const userState = useAppSelector(selectUserState);
  const coin = userState.player!.data.balance;
  const treasure = userState.state!.treasure;
  const cash = userState.state!.cash;
  const available = treasure - cash;
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [treasureFontSize, setTreasureFontSize] = useState<number>(0);
  const [pickNuggetCoinFontSize, setPickNuggetCoinFontSize] =
    useState<number>(0);
  const isLoading = useAppSelector(selectIsLoading);

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 10);
      setTreasureFontSize(containerRef.current.offsetHeight / 13);
      setPickNuggetCoinFontSize(containerRef.current.offsetHeight / 16);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, []);

  const onClickDeposit = () => {
    dispatch(setUIState({ type: UIStateType.DepositPopup }));
  };
  const onClickWithdraw = () => {
    dispatch(setUIState({ type: UIStateType.WithdrawPopup }));
  };

  const onClickPickNugget = () => {
    if (!isLoading) {
      dispatch(setLoadingType(LoadingType.PickNugget));
      dispatch(
        sendTransaction({
          cmd: getCreateNuggetTransactionCommandArray(userState!.player!.nonce),
          prikey: l2Account!.getPrivateKey(),
        })
      ).then(async (action: AnyAction) => {
        if (sendTransaction.fulfilled.match(action)) {
          console.log("pick nugget successed");
          dispatch(setNuggetsForceUpdate(true));
          dispatch(setLoadingType(LoadingType.None));
        } else if (sendTransaction.rejected.match(action)) {
          const message = "pick nugget Error: " + action.payload;
          dispatch(pushError(message));
          console.error(message);
          dispatch(setLoadingType(LoadingType.None));
        }
      });
    }
  };

  const onClickLeaderRank = () => {
    dispatch(setUIState({ type: UIStateType.LeaderRankPopup }));
  };

  const onClickEarningRank = () => {
    dispatch(setUIState({ type: UIStateType.EarningRankPopup }));
  };

  return (
    <div ref={containerRef} className="player-info-container">
      <p
        className="player-info-player-id-text"
        style={{
          fontSize: titleFontSize,
          ...getTextShadowStyle(titleFontSize / 15),
        }}
      >
        Player ID:
      </p>
      <p
        className="player-info-player-id-value-text"
        style={{
          fontSize: titleFontSize,
          ...getTextShadowStyle(titleFontSize / 15),
        }}
      >
        {playerId}
      </p>
      <p
        className="player-info-coin-text"
        style={{
          fontSize: titleFontSize,
          ...getTextShadowStyle(titleFontSize / 15),
        }}
      >
        {coin}
      </p>
      <div className="player-info-coin-image" />

      <div className="player-info-treasure-container">
        <PlayerTreasureInfo
          title={"Current Treasure:"}
          value={treasure}
          icon={treasure_image}
          fontSize={treasureFontSize}
        />
      </div>
      <div className="player-info-cash-container">
        <PlayerTreasureInfo
          title={"Current Cash:"}
          value={cash}
          icon={cash_image}
          fontSize={treasureFontSize}
        />
      </div>
      <div className="player-info-available-container">
        <PlayerTreasureInfo
          title={"Undestributed Treasure:"}
          value={available}
          icon={available_image}
          fontSize={treasureFontSize}
        />
      </div>

      <div className="player-info-rank-button">
        <LeaderRankButton onClick={onClickLeaderRank} isDisabled={false} />
      </div>
      <div className="player-info-earning-button">
        <EarningRankButton onClick={onClickEarningRank} isDisabled={false} />
      </div>
      <div className="player-info-deposit-button">
        <DefaultButton
          text={"Deposit"}
          onClick={onClickDeposit}
          isDisabled={false}
          fontSizeRatio={0.7}
        />
      </div>
      <div className="player-info-withdraw-button">
        <DefaultButton
          text={"Withdraw"}
          onClick={onClickWithdraw}
          isDisabled={false}
          fontSizeRatio={0.7}
        />
      </div>
      <div className="player-info-pick-nugget-button">
        <DefaultButton
          text={"Pick Nugget                "}
          onClick={onClickPickNugget}
          isDisabled={coin < PICK_NUGGET_COST}
          fontSizeRatio={0.7}
        />
        <p
          className="player-info-pick-nugget-coin-text"
          style={{
            fontSize: pickNuggetCoinFontSize,
            ...getTextShadowStyle(pickNuggetCoinFontSize / 15),
          }}
        >
          {PICK_NUGGET_COST}
        </p>
        <div className="player-info-pick-nugget-coin-image" />
      </div>
    </div>
  );
};

export default PlayerInfo;
