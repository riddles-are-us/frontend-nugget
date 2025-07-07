import React, { useEffect, useRef, useState } from "react";
import "./EarningRankElement.css";
import {
  getAttributeList,
  getNuggetImage,
  getTextShadowStyle,
} from "../../common/Utility";
import { NuggetData } from "../../../../data/model";
import { useWalletContext } from "zkwasm-minirollup-browser";
import { useAppSelector } from "../../../../app/hooks";
import { LeHexBN } from "zkwasm-minirollup-rpc";
import { bnToHexLe } from "delphinus-curves/src/altjubjub";
import NuggetLevel from "./NuggetLevel";
import background from "../../../images/scene/gameplay/earning_rank/background.png";
import DefaultButton from "../../buttons/DefaultButton";
import { selectIsLoading } from "../../../../data/errors";
import { selectUserState } from "../../../../data/state";

interface Props {
  nuggetData: NuggetData;
  onCliamReward: () => void;
}

const EarningRankElement = ({ nuggetData, onCliamReward }: Props) => {
  const { l2Account } = useWalletContext();
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [attributesFontSize, setAttributesFontSize] = useState<number>(0);
  const [coinFontSize, setCoinFontSize] = useState<number>(0);
  const userState = useAppSelector(selectUserState);
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

  const adjustSize = () => {
    if (containerRef.current) {
      setAttributesFontSize(containerRef.current.offsetHeight / 3.5);
      setCoinFontSize(containerRef.current.offsetHeight / 5);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current]);

  return (
    <div ref={containerRef} className="earning-rank-element-container">
      <div className="earning-rank-element-margin-container">
        <img
          className="earning-rank-element-avatar-image"
          src={getNuggetImage(nuggetLevel)}
        />
        <img
          className="earning-rank-element-miner-image"
          src={getNuggetImage(nuggetLevel)}
        />
        <img className="earning-rank-element-background" src={background} />
        <p
          className="earning-rank-element-attributes-text"
          style={{
            fontSize: attributesFontSize,
            ...getTextShadowStyle(attributesFontSize / 15),
          }}
        >
          {nuggetAttributeString.join(" ")}
        </p>
        <p
          className="earning-rank-element-coin-title-text"
          style={{
            fontSize: coinFontSize,
            ...getTextShadowStyle(coinFontSize / 15),
          }}
        >
          Claimable Amount:
        </p>
        <p
          className="earning-rank-element-coin-text"
          style={{
            fontSize: coinFontSize,
            ...getTextShadowStyle(coinFontSize / 15),
          }}
        >
          {earningAmount}
        </p>
        <div className="earning-rank-element-coin-image" />
        <div className="earning-rank-element-claim-button">
          <DefaultButton
            text={"Claim"}
            onClick={onCliamReward}
            isDisabled={!selfOwned}
          />
        </div>
      </div>
    </div>
  );
};

export default EarningRankElement;
