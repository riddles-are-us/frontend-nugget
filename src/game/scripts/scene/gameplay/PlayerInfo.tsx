import { useEffect, useRef, useState } from "react";
import DefaultButton from "../../buttons/DefaultButton";
import "./PlayerInfo.css";
import { addressAbbreviation, getTextShadowStyle } from "../../common/Utility";
import { AccountSlice } from "zkwasm-minirollup-browser";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectUserState } from "../../../../data/state";

const PlayerInfo = () => {
  const dispatch = useAppDispatch();
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const playerId = addressAbbreviation("0x" + l2account!.pubkey, 5);
  const userState = useAppSelector(selectUserState);
  const coin = userState.player!.data.balance;
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [moneyFontSize, setMoneyFontSize] = useState<number>(0);

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 6);
      setMoneyFontSize(containerRef.current.offsetHeight / 8);
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
    /**/
  };
  const onClickWithdraw = () => {
    /**/
  };

  const onClickPickNugget = () => {
    /**/
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
          text={"Pick Nugget"}
          onClick={onClickPickNugget}
          isDisabled={false}
        />
      </div>
    </div>
  );
};

export default PlayerInfo;
