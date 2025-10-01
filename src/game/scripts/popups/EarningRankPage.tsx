import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./EarningRankPage.css";
import { setUIState, UIStateType } from "../../../data/ui";
import { LeHexBN } from "zkwasm-minirollup-rpc";
import { bnToHexLe } from "delphinus-curves/src/altjubjub";
import {
  getAttributeList,
  getNuggetImage,
  getTextShadowStyle
} from "../common/Utility";
import {
  LoadingType,
  pushError,
  selectIsLoading,
  setLoadingType,
} from "../../../data/errors";
import { selectEarningRankNuggets, setNuggetsForceUpdate } from "../../../data/nuggets";
import background from "../../images/scene/gameplay/earning_rank/earning_board.png";
import {
  getClaimRewardTransactionCommandArray,
  queryState,
  sendTransaction,
} from "../request";
import { selectUserState } from "../../../data/state";
import { useWalletContext } from "zkwasm-minirollup-browser";
import { AnyAction } from '@reduxjs/toolkit';
import DefaultButton from "../buttons/DefaultButton";

const EarningRankPage = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const userState = useAppSelector(selectUserState);
  const { l2Account } = useWalletContext();

  const nuggets = useAppSelector(selectEarningRankNuggets);

  const onCliamReward = (index: number) => {
    if (!isLoading) {
      dispatch(setLoadingType(LoadingType.ListNugget));
      dispatch(
        sendTransaction({
          cmd: getClaimRewardTransactionCommandArray(
            userState!.player!.nonce,
            BigInt(index)
          ),
          prikey: l2Account!.getPrivateKey(),
        })
      ).then(async (action: AnyAction) => {
        if (sendTransaction.fulfilled.match(action)) {
          console.log("claim reward successed");
          dispatch(setUIState({ type: UIStateType.Idle }));
          dispatch(setLoadingType(LoadingType.None));
        } else if (sendTransaction.rejected.match(action)) {
          const message = "claim reward Error: " + action.payload;
          dispatch(pushError(message));
          console.error(message);
          dispatch(setLoadingType(LoadingType.None));
        }
      });
    }
  };

  const reloadTabData = async () => {
    dispatch(setNuggetsForceUpdate(true));
    try {
      await dispatch(queryState(l2Account.getPrivateKey())).unwrap();
    } finally {
      dispatch(setNuggetsForceUpdate(false));
    }
  };

  return (
    <div className="earning-rank-page-container">
      <div className="earning-rank-page-grid-container">
        <div className="earning-rank-page-reload-button-mobile">
          <DefaultButton
            text={"Reload"}
            onClick={reloadTabData}
            isDisabled={false}
          ></DefaultButton>
        </div>
        <p
          className="earning-rank-page-title-text"
        >
          Earning board
        </p>
        {nuggets.map((nuggetData, index) => {
          const earningAmount = userState.state.counter - nuggetData.earningStart;
          const nuggetLevel = 7 - nuggetData.feature;
          const pids = l2Account?.pubkey
            ? new LeHexBN(bnToHexLe(l2Account?.pubkey)).toU64Array()
            : ["", "", "", ""];
          const selfOwned =
            nuggetData.owner[0] == Number(pids[1]) &&
            nuggetData.owner[1] == Number(pids[2]);
        
          const nuggetAttributeString = getAttributeList(
            nuggetData.attributes,
            nuggetData.feature
          );
          return (
            <div
              key={index}
              className="earning-rank-page-nugget-container"
            >
              <img
                className="earning-rank-page-avatar-image"
                src={getNuggetImage(nuggetLevel)}
              />
              <img className="earning-rank-page-background" src={background} />
              <div
                className="earning-rank-page-attributes-text"
              >
                <p>
                  {nuggetAttributeString.join(" ")}
                </p>
              </div>
              <p
                className="earning-rank-page-coin-text"
              >
                {earningAmount}
              </p>
              <div className="earning-rank-page-coin-image" />
              <div className="earning-rank-page-claim-button">
                <DefaultButton
                  text={"Claim"}
                  onClick={() => onCliamReward(index)}
                  isDisabled={!selfOwned}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default EarningRankPage;
