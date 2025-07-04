import React, { useEffect, useRef, useState } from "react";
import "./RankElement.css";
import rank_1 from "../../../images/scene/gameplay/rank/rank_1.png";
import rank_2 from "../../../images/scene/gameplay/rank/rank_2.png";
import rank_3 from "../../../images/scene/gameplay/rank/rank_3.png";
import {
  addressAbbreviation,
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

interface Props {
  rank: number;
  nuggetData: NuggetData;
}

const RankElement = ({ rank, nuggetData }: Props) => {
  const { l2Account } = useWalletContext();
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [rankFontSize, setRankFontSize] = useState<number>(0);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [coinFontSize, setCoinFontSize] = useState<number>(0);
  const nuggetPrice = nuggetData.sysprice;
  const nuggetLevel = 7 - nuggetData.feature;
  const ownerId = nuggetData.owner[0] ?? "";
  const nuggetAttributeString = getAttributeList(
    nuggetData.attributes,
    nuggetData.feature
  );

  const adjustSize = () => {
    if (containerRef.current) {
      setRankFontSize(containerRef.current.offsetHeight / 2);
      setTitleFontSize(containerRef.current.offsetHeight / 3);
      setCoinFontSize(containerRef.current.offsetHeight / 4);
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
    <div ref={containerRef} className="rank-element-container">
      <div className="rank-element-margin-container">
        {rank <= 3 ? (
          <img
            className="rank-element-rank-image"
            src={rank == 1 ? rank_1 : rank == 2 ? rank_2 : rank_3}
          />
        ) : (
          <p
            className="rank-element-rank-text"
            style={{
              fontSize: rankFontSize,
              ...getTextShadowStyle(rankFontSize / 15),
            }}
          >
            {rank}
          </p>
        )}

        {/* <p
          className="rank-element-bidder-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          Owner ID:
        </p>
        <p
          className="rank-element-bidder-value-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          {ownerId}
        </p> */}
        <img
          className="rank-element-avatar-image"
          src={getNuggetImage(nuggetLevel)}
        />
        <p
          className="rank-element-attributes-text"
          style={{
            fontSize: coinFontSize,
            ...getTextShadowStyle(coinFontSize / 15),
          }}
        >
          {nuggetAttributeString.join(" ")}
        </p>
        <p
          className="rank-element-coin-text"
          style={{
            fontSize: coinFontSize,
            ...getTextShadowStyle(coinFontSize / 15),
          }}
        >
          {nuggetPrice}
        </p>
        <div className="rank-element-coin-image" />
      </div>
    </div>
  );
};

export default RankElement;
