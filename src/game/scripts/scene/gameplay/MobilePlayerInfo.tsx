import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectUserState } from '../../../../data/state';
import { setUIState, UIStateType } from '../../../../data/ui';
import { useWalletContext, sendTransaction } from "zkwasm-minirollup-browser";
import { getCreateNuggetTransactionCommandArray } from "../../request";
import { addressAbbreviation, PICK_NUGGET_COST } from "../../common/Utility";
import { LoadingType, pushError, selectIsLoading, setLoadingType } from "../../../../data/errors";
import { setNuggetsForceUpdate } from "../../../../data/nuggets";
import { AnyAction } from "@reduxjs/toolkit";
import leader_rank_icon from "../../../images/buttons/leader_rank_button/leader_rank.png";
import earning_rank_icon from "../../../images/buttons/earning_rank_button/earning_rank.png";
import coin_icon from "../../../images/scene/gameplay/top_container/coin.png";
import treasure_icon from "../../../images/scene/gameplay/top_container/treasure.png";
import cash_icon from "../../../images/scene/gameplay/top_container/cash.png";
import available_icon from "../../../images/scene/gameplay/top_container/available.png";
import avatar_image from "../../../images/avatars/avatar_1.png";
import './MobilePlayerInfo.css';

// Use original game assets for icons
const CoinIcon = () => (
  <img src={coin_icon} className="mobile-stat-icon" alt="Coin" />
);

const TreasureIcon = () => (
  <img src={treasure_icon} className="mobile-stat-icon" alt="Treasure" />
);

const CashIcon = () => (
  <img src={cash_icon} className="mobile-stat-icon" alt="Cash" />
);

const AvailableIcon = () => (
  <img src={available_icon} className="mobile-stat-icon" alt="Available" />
);

const MobilePlayerInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const { l2Account } = useWalletContext();
  const userState = useAppSelector(selectUserState);
  const isLoading = useAppSelector(selectIsLoading);
  
  if (!userState?.player) {
    return null;
  }

  const playerData = userState.player.data;
  const playerId = addressAbbreviation("0x" + l2Account!.pubkey, 5);
  const coin = playerData.balance;
  const treasure = userState.state!.treasure;
  const cash = userState.state!.cash;
  const available = treasure - cash;

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
    <div className="mobile-player-info-container">
      {/* First Row: Game Title + Player ID + Ranking Buttons */}
      <div className="mobile-first-row">
        <div className="mobile-game-title">
          <h2 className="mobile-game-name">Space Nugget</h2>
          <h3 className="mobile-player-id">
            Player#{playerId.toString().padStart(6, '0')}
          </h3>
        </div>
        <div className="mobile-ranking-buttons">
          <button 
            className="mobile-rank-icon-button mobile-leader-button"
            onClick={onClickLeaderRank}
          >
            <img src={leader_rank_icon} alt="Leader" />
          </button>
          <button 
            className="mobile-rank-icon-button mobile-earning-button"
            onClick={onClickEarningRank}
          >
            <img src={earning_rank_icon} alt="Earning" />
          </button>
        </div>
      </div>
      
      {/* Second Row: Avatar + Balance */}
      <div className="mobile-second-row">
        <div className="mobile-avatar-section">
          <img src={avatar_image} className="mobile-avatar-image" alt="Avatar" />
        </div>
        <div className="mobile-balance-section">
          <div className="mobile-stat-item">
            <CoinIcon />
            <div className="mobile-stat-content">
              <span className="mobile-stat-label">Balance</span>
              <span className="mobile-stat-value">{coin.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Third Row: Other Three Stats */}
      <div className="mobile-third-row">
        <div className="mobile-stat-item">
          <TreasureIcon />
          <div className="mobile-stat-content">
            <span className="mobile-stat-label">Current Treasure</span>
            <span className="mobile-stat-value">{treasure.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="mobile-stat-item">
          <CashIcon />
          <div className="mobile-stat-content">
            <span className="mobile-stat-label">Current Cash</span>
            <span className="mobile-stat-value">{cash.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="mobile-stat-item">
          <AvailableIcon />
          <div className="mobile-stat-content">
            <span className="mobile-stat-label">Undistributed Treasure</span>
            <span className="mobile-stat-value">{available.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {/* Fourth Row: Action Buttons */}
      <div className="mobile-fourth-row">
        <div className="mobile-player-actions">
          <button 
            className="mobile-action-button mobile-action-deposit"
            onClick={onClickDeposit}
          >
            <span>Deposit</span>
          </button>
          <button 
            className="mobile-action-button mobile-action-withdraw"
            onClick={onClickWithdraw}
          >
            <span>Withdraw</span>
          </button>
          <button 
            className="mobile-action-button mobile-action-pick"
            onClick={onClickPickNugget}
            disabled={coin < PICK_NUGGET_COST || isLoading}
          >
            <span>Pick ({PICK_NUGGET_COST})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobilePlayerInfo;