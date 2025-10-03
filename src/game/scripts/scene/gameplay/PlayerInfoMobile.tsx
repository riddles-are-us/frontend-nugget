import "./PlayerInfoMobile.css";
import { addressAbbreviation } from "../../common/Utility";
import { useWalletContext } from "zkwasm-minirollup-browser";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectUserState } from "../../../../data/state";
import { setUIState, UIStateType } from "../../../../data/ui";
import available_image from "../../../images/scene/gameplay/top_container/available.png";

const PlayerInfoMobile = () => {
  const dispatch = useAppDispatch();
  const { l2Account } = useWalletContext();
  const playerId = addressAbbreviation("0x" + l2Account!.pubkey, 5);
  const userState = useAppSelector(selectUserState);
  const coin = userState.player!.data.balance;

  const onClickDeposit = () => {
    dispatch(setUIState({ type: UIStateType.DepositPopup }));
  };
  const onClickWithdraw = () => {
    dispatch(setUIState({ type: UIStateType.WithdrawPopup }));
  };

  const onClickTreasureInfo = () => {
    dispatch(setUIState({ type: UIStateType.TreasureInfoPopup }));
  };

  return (
    <div className="gameplay-top-container-content-mobile">
      <div className="gameplay-player-info-mobile">
        <div className="gameplay-player-id-container-mobile">
          <div className="gameplay-player-id-input-container-mobile">
            <p className="gameplay-player-id-number-mobile">{playerId}</p>
          </div>
        </div>
        <div className="gameplay-player-balance-container-mobile">
          <div className="gameplay-player-balance-input-container-mobile">
            <p className="gameplay-player-balance-input-number-mobile">
              {coin}
            </p>
          </div>
          <img
            className="gameplay-player-treasure-info-icon"
            onClick={onClickTreasureInfo}
            src={available_image}
          />
        </div>
      </div>
      <div className="deposit-btn-mobile" onClick={onClickDeposit} />
      <div className="withdraw-btn-mobile" onClick={onClickWithdraw} />
    </div>
  );

  // return (
  //   <div ref={containerRef} className="player-info-container">
  //     <p
  //       className="player-info-player-id-text"
  //       style={{
  //         fontSize: titleFontSize,
  //         ...getTextShadowStyle(titleFontSize / 15),
  //       }}
  //     >
  //       Player ID:
  //     </p>
  //     <p
  //       className="player-info-player-id-value-text"
  //       style={{
  //         fontSize: titleFontSize,
  //         ...getTextShadowStyle(titleFontSize / 15),
  //       }}
  //     >
  //       {playerId}
  //     </p>
  //     <p
  //       className="player-info-coin-text"
  //       style={{
  //         fontSize: moneyFontSize,
  //         ...getTextShadowStyle(moneyFontSize / 15),
  //       }}
  //     >
  //       {coin}
  //     </p>
  //     <div className="player-info-coin-image" />
  //     <div className="player-info-rank-button">
  //       <LeaderRankButton onClick={onClickLeaderRank} isDisabled={false} />
  //     </div>
  //     <div className="player-info-earning-button">
  //       <EarningRankButton onClick={onClickEarningRank} isDisabled={false} />
  //     </div>

  //     <div className="player-info-treasure-container">
  //       <PlayerTreasureInfo
  //         title={"Current Treasure:"}
  //         value={treasure}
  //         icon={treasure_image}
  //         fontSize={treasureFontSize}
  //       />
  //     </div>
  //     <div className="player-info-cash-container">
  //       <PlayerTreasureInfo
  //         title={"Current Cash:"}
  //         value={cash}
  //         icon={cash_image}
  //         fontSize={treasureFontSize}
  //       />
  //     </div>
  //     <div className="player-info-available-container">
  //       <PlayerTreasureInfo
  //         title={"Undestributed Treasure:"}
  //         value={available}
  //         icon={available_image}
  //         fontSize={treasureFontSize}
  //       />
  //     </div>

  //     <div className="player-info-deposit-button">
  //       <DefaultButton
  //         text={"Deposit"}
  //         onClick={onClickDeposit}
  //         isDisabled={false}
  //       />
  //     </div>
  //     <div className="player-info-withdraw-button">
  //       <DefaultButton
  //         text={"Withdraw"}
  //         onClick={onClickWithdraw}
  //         isDisabled={false}
  //       />
  //     </div>
  //     <div className="player-info-pick-nugget-button">
  //       <DefaultButton
  //         text={"Pick Nugget              "}
  //         onClick={onClickPickNugget}
  //         isDisabled={coin < PICK_NUGGET_COST}
  //       />
  //       <p
  //         className="player-info-pick-nugget-coin-text"
  //         style={{
  //           fontSize: pickNuggetCoinFontSize,
  //           ...getTextShadowStyle(pickNuggetCoinFontSize / 15),
  //         }}
  //       >
  //         {PICK_NUGGET_COST}
  //       </p>
  //       <div className="player-info-pick-nugget-coin-image" />
  //     </div>
  //   </div>
  // );
};

export default PlayerInfoMobile;
