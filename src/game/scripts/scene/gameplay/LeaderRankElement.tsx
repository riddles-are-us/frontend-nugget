import React, { useEffect, useRef, useState } from "react";
import "./LeaderRankElement.css";
import rank_1 from "../../../images/scene/gameplay/leader_rank/rank_1.png";
import rank_2 from "../../../images/scene/gameplay/leader_rank/rank_2.png";
import rank_3 from "../../../images/scene/gameplay/leader_rank/rank_3.png";
import {
  addressAbbreviation,
  getAttributeList,
  getNuggetImage,
  getTextShadowStyle,
} from "../../common/Utility";
import { NuggetData } from "../../../../data/model";
import { useWalletContext } from "zkwasm-minirollup-browser";
import { useAppSelector, useViewport } from "../../../../app/hooks";
import { LeHexBN } from "zkwasm-minirollup-rpc";
import { bnToHexLe } from "delphinus-curves/src/altjubjub";
import NuggetLevel from "./NuggetLevel";

interface Props {
  rank: number;
  nuggetData: NuggetData;
}

const LeaderRankElement = ({ rank, nuggetData }: Props) => {
  const { l2Account } = useWalletContext();
  const { isMobile } = useViewport();
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
    <div ref={containerRef} className="leader-rank-element-container">
      <div className="leader-rank-element-margin-container">
        {isMobile ? (
          <>
            {/* Left Section - Grouped rank and avatar */}
            <div className="leader-rank-element-left-section">
              {rank <= 3 ? (
                <img
                  className="leader-rank-element-rank-image"
                  src={rank == 1 ? rank_1 : rank == 2 ? rank_2 : rank_3}
                  alt={`Rank ${rank}`}
                />
              ) : (
                <p className="leader-rank-element-rank-text">
                  {rank}
                </p>
              )}
              <img
                className="leader-rank-element-avatar-image"
                src={getNuggetImage(nuggetLevel)}
                alt={`Nugget Level ${nuggetLevel}`}
              />
            </div>

            {/* Right Section - Score */}
            <div className="leader-rank-element-score-section">
              <div className="leader-rank-element-coin-image" />
              <p className="leader-rank-element-coin-text">
                {nuggetPrice.toLocaleString()}
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Desktop layout */}
            {rank <= 3 ? (
              <img
                className="leader-rank-element-rank-image"
                src={rank == 1 ? rank_1 : rank == 2 ? rank_2 : rank_3}
                alt={`Rank ${rank}`}
              />
            ) : (
              <p
                className="leader-rank-element-rank-text"
                style={{
                  fontSize: rankFontSize,
                  ...getTextShadowStyle(rankFontSize / 15),
                }}
              >
                {rank}
              </p>
            )}
            <img
              className="leader-rank-element-avatar-image"
              src={getNuggetImage(nuggetLevel)}
              alt={`Nugget Level ${nuggetLevel}`}
            />
            <p
              className="leader-rank-element-attributes-text"
              style={{
                fontSize: coinFontSize,
                ...getTextShadowStyle(coinFontSize / 15),
              }}
            >
              {nuggetAttributeString.join(" ")}
            </p>
            <p
              className="leader-rank-element-coin-text"
              style={{
                fontSize: coinFontSize,
                ...getTextShadowStyle(coinFontSize / 15),
              }}
            >
              {nuggetPrice}
            </p>
            <div className="leader-rank-element-coin-image" />
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderRankElement;
