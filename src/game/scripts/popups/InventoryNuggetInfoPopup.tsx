import { useState, useRef, useEffect } from "react";
import background from "../../images/popups/pop_frame.png";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./InventoryNuggetInfoPopup.css";
import { selectUIState, setUIState, UIStateType } from "../../../data/ui";
import { NuggetData } from "../../../data/model";
import { getAttributeList, getTextShadowStyle } from "../common/Utility";
import NuggetLevel from "../scene/gameplay/NuggetLevel";
import image from "../../images/nuggets/image.png";
import DefaultButton from "../buttons/DefaultButton";
import PopupCloseButton from "../buttons/PopupCloseButton";
import {
  getExploreNuggetTransactionCommandArray,
  getNugget,
  getSellNuggetTransactionCommandArray,
  sendTransaction,
} from "../request";
import { AccountSlice } from "zkwasm-minirollup-browser";
import { selectUserState } from "../../../data/state";
import { selectInventoryNuggetsData } from "../../../data/nuggets";

interface Props {
  nuggetIndex: number;
}

const attributeLefts = [
  0.008, 0.045, 0.083, 0.123, 0.16, 0.197, 0.236, 0.274, 0.313, 0.351, 0.39,
  0.428, 0.467, 0.505, 0.543, 0.582, 0.619, 0.658, 0.695, 0.733, 0.769, 0.808,
  0.845, 0.883, 0.92, 0.957,
];

const InventoryNuggetInfoPopup = ({ nuggetIndex }: Props) => {
  const dispatch = useAppDispatch();
  const inventoryNuggetsData = useAppSelector(selectInventoryNuggetsData);
  const nuggetData = inventoryNuggetsData[nuggetIndex];
  const containerRef = useRef<HTMLParagraphElement>(null);
  const uIState = useAppSelector(selectUIState);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const userState = useAppSelector(selectUserState);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [descriptionFontSize, setDescriptionFontSize] = useState<number>(0);
  const [attributesFontSize, setAttributesFontSize] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const nuggetId = nuggetData.id;
  const nuggetPrice = nuggetData.sysprice;
  const nuggetCycle = nuggetData.cycle;
  const nuggetLevel = nuggetData.feature;
  const nuggetBid = nuggetData.bid?.bidprice ?? 0;
  const nuggetAttributeString = getAttributeList(
    nuggetData.attributes,
    nuggetData.feature
  );

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 10);
      setDescriptionFontSize(containerRef.current.offsetHeight / 13);
      setAttributesFontSize(containerRef.current.offsetHeight / 10);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current]);

  const onClickCancel = () => {
    if (uIState.type == UIStateType.InventoryNuggetInfoPopup) {
      dispatch(setUIState({ type: UIStateType.Idle }));
    }
  };

  const onClickExploreNugget = () => {
    if (!isLoading) {
      setIsLoading(true);
      dispatch(
        sendTransaction({
          cmd: getExploreNuggetTransactionCommandArray(
            userState!.player!.nonce,
            nuggetId
          ),
          prikey: l2account!.getPrivateKey(),
        })
      ).then((action) => {
        if (sendTransaction.fulfilled.match(action)) {
          console.log("explore nugget successed");
          dispatch(
            getNugget({
              index: nuggetIndex,
              nuggetId,
            })
          ).then((action) => {
            if (sendTransaction.fulfilled.match(action)) {
              console.log("explore nugget update successed");
              setIsLoading(false);
            } else if (sendTransaction.rejected.match(action)) {
              console.log("explore nugget update Error: " + action.payload);
              setIsLoading(false);
            }
          });
        } else if (sendTransaction.rejected.match(action)) {
          console.log("explore nugget Error: " + action.payload);
          setIsLoading(false);
        }
      });
    }
  };

  const onClickSellNugget = () => {
    if (!isLoading) {
      setIsLoading(true);
      dispatch(
        sendTransaction({
          cmd: getSellNuggetTransactionCommandArray(
            userState!.player!.nonce,
            nuggetId
          ),
          prikey: l2account!.getPrivateKey(),
        })
      ).then((action) => {
        if (sendTransaction.fulfilled.match(action)) {
          // handleResult("Withdraw successed");
          console.log("sell nugget successed");
          dispatch(setUIState({ type: UIStateType.Idle }));
          setIsLoading(false);
        } else if (sendTransaction.rejected.match(action)) {
          // setErrorMessage("Withdraw Error: " + action.payload);
          console.log("sell nugget Error: " + action.payload);
          setIsLoading(false);
        }
      });
    }
  };

  return (
    <div className="inventory-nugget-info-popup-container">
      <div
        onClick={onClickCancel}
        className="inventory-nugget-info-popup-mask"
      />
      <div
        ref={containerRef}
        className="inventory-nugget-info-popup-main-container"
      >
        <img src={image} className="inventory-nugget-info-popup-avatar-image" />
        <img
          src={background}
          className="inventory-nugget-info-popup-main-background"
        />
        <div className="inventory-nugget-info-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="inventory-nugget-info-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          {`NuggetId: ${nuggetId}`}
        </p>
        <p
          className="inventory-nugget-info-popup-price-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Recycle Price: ${nuggetPrice}`}
        </p>
        <p
          className="inventory-nugget-info-popup-cycle-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Cycle: ${nuggetCycle}`}
        </p>
        <p
          className="inventory-nugget-info-popup-bid-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Bid: ${nuggetBid}`}
        </p>
        <div className="inventory-nugget-info-popup-levels-container">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className={`inventory-nugget-info-popup-level-container`}
            >
              <NuggetLevel key={index} isActive={index < nuggetLevel} />
            </div>
          ))}
        </div>
        <div>
          {nuggetAttributeString.slice(0, 26).map((s, index) => (
            <p
              key={index}
              className="inventory-nugget-info-popup-attributes-text"
              style={{
                left: `${attributeLefts[index] * 100}%`,
                fontSize: attributesFontSize,
                ...getTextShadowStyle(attributesFontSize / 15),
              }}
            >
              {s}
            </p>
          ))}
        </div>
        <div className="inventory-nugget-info-popup-explore-button">
          <DefaultButton
            text={"Explore Nugget"}
            onClick={onClickExploreNugget}
            isDisabled={false}
          />
        </div>
        <div className="inventory-nugget-info-popup-sell-button">
          <DefaultButton
            text={"Sell Nugget"}
            onClick={onClickSellNugget}
            isDisabled={false}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryNuggetInfoPopup;
