import React, { useEffect, useRef, useState } from "react";
import "./EarningRankElement.css";
import {
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
  const { isMobile } = useViewport();
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
        {isMobile ? (
          <>
            {/* Mobile layout */}
            <div className="earning-rank-element-mobile-left">
              <img
                className="earning-rank-element-avatar-image"
                src={getNuggetImage(nuggetLevel)}
                alt={`Nugget Level ${nuggetLevel}`}
                style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  left: '0',
                  top: '0',
                  transform: 'none',
                  borderRadius: '6px',
                  border: '1px solid #B8860B'
                }}
              />
            </div>

            <div className="earning-rank-element-mobile-middle">
              <div className="earning-rank-element-mobile-formula">
                <div style={{
                  position: 'relative',
                  fontSize: '7px',
                  color: '#F5D547',
                  fontWeight: 'bold',
                  margin: '0',
                  padding: '1px',
                  lineHeight: '1.1',
                  left: '0',
                  top: '0',
                  transform: 'none',
                  width: 'auto',
                  height: 'auto',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textShadow: '0 1px 1px rgba(0,0,0,0.8)'
                }}>
                  {nuggetAttributeString.length > 0 ? nuggetAttributeString.join(" ") : "None"}
                </div>
              </div>
              <div className="earning-rank-element-mobile-earning">
                <span style={{
                  fontSize: '8px',
                  color: '#B8860B',
                  marginRight: '4px',
                  fontWeight: '600'
                }}>
                  Claimable Amount:
                </span>
                <div className="earning-rank-element-coin-image" />
                <p className="earning-rank-element-coin-text" style={{
                  position: 'relative',
                  fontSize: '12px',
                  color: '#F5D547',
                  margin: '0',
                  lineHeight: '1',
                  left: '0',
                  top: '0',
                  transform: 'none',
                  width: 'auto',
                  height: 'auto'
                }}>
                  {earningAmount}
                </p>
              </div>
            </div>

            <div className="earning-rank-element-mobile-right">
              <div 
                onClick={!selfOwned ? undefined : onCliamReward}
                style={{
                  backgroundColor: !selfOwned ? '#666' : 'linear-gradient(145deg, #8B4513 0%, #CD853F 50%, #8B4513 100%)',
                  background: !selfOwned ? '#666' : 'linear-gradient(145deg, #8B4513 0%, #CD853F 50%, #8B4513 100%)',
                  width: '60px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: !selfOwned ? '#999' : '#F5D547',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  border: !selfOwned ? '1px solid #555' : '1px solid #B8860B',
                  borderRadius: '4px',
                  cursor: !selfOwned ? 'not-allowed' : 'pointer',
                  fontFamily: 'AdobeClean',
                  boxShadow: !selfOwned ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
                  textShadow: !selfOwned ? 'none' : '0 1px 1px rgba(0,0,0,0.5)',
                  transition: 'all 0.2s ease'
                }}
              >
                Claim
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Desktop layout */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default EarningRankElement;
