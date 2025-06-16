import { useEffect, useRef, useState } from "react";
import DefaultButton from "../../buttons/DefaultButton";
import "./PlayerInfo.css";
import {
  addressAbbreviation,
  getTextShadowStyle,
  PICK_NUGGET_COST,
} from "../../common/Utility";
import { AccountSlice } from "zkwasm-minirollup-browser";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectUserState } from "../../../../data/state";
import { setUIState, UIStateType } from "../../../../data/ui";
import { sendTransaction } from "zkwasm-minirollup-browser/src/connect";
import { getCreateNuggetTransactionCommandArray } from "../../request";
import {
  pushError,
  selectIsLoading,
  setIsLoading,
} from "../../../../data/errors";
import { setNuggetsForceUpdate } from "../../../../data/nuggets";

const PlayerInfo = () => {
  const dispatch = useAppDispatch();
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const playerId = addressAbbreviation("0x" + l2account!.pubkey, 5);
  const userState = useAppSelector(selectUserState);
  const coin = userState.player!.data.balance;
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [moneyFontSize, setMoneyFontSize] = useState<number>(0);
  const [pickNuggetCoinFontSize, setPickNuggetCoinFontSize] =
    useState<number>(0);
  const isLoading = useAppSelector(selectIsLoading);

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 6);
      setMoneyFontSize(containerRef.current.offsetHeight / 8);
      setPickNuggetCoinFontSize(containerRef.current.offsetHeight / 12);
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
      dispatch(setIsLoading(true));
      dispatch(
        sendTransaction({
          cmd: getCreateNuggetTransactionCommandArray(userState!.player!.nonce),
          prikey: l2account!.getPrivateKey(),
        })
      ).then(async (action) => {
        if (sendTransaction.fulfilled.match(action)) {
          console.log("pick nugget successed");
          dispatch(setNuggetsForceUpdate(true));
          dispatch(setIsLoading(false));
        } else if (sendTransaction.rejected.match(action)) {
          const message = "pick nugget Error: " + action.payload;
          dispatch(pushError(message));
          console.error(message);
          dispatch(setIsLoading(false));
        }
      });
    }
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
        Player ID: {playerId}
      </p>
      <p
        className="player-info-coin-text"
        style={{
          fontSize: moneyFontSize,
          ...getTextShadowStyle(moneyFontSize / 15),
        }}
      >
        {coin}
      </p>
      <div className="player-info-coin-image" />
      <div className="player-info-deposit-button">
        <DefaultButton
          text={"Deposit"}
          onClick={onClickDeposit}
          isDisabled={false}
        />
      </div>
      <div className="player-info-withdraw-button">
        <DefaultButton
          text={"Withdraw"}
          onClick={onClickWithdraw}
          isDisabled={false}
        />
      </div>
      <div className="player-info-pick-nugget-button">
        <DefaultButton
          text={"Pick Nugget              "}
          onClick={onClickPickNugget}
          isDisabled={coin < PICK_NUGGET_COST}
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
