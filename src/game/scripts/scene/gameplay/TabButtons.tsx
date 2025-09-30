import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectTabState, setTabState, TabState } from "../../../../data/ui";
import TabButton from "../../buttons/TabButton";
import "./TabButtons.css";
import { useIsMobile } from "../../../../app/isMobileContext";

const TabButtons = () => {
  const { isMobile } = useIsMobile();

  const dispatch = useAppDispatch();
  const tabState = useAppSelector(selectTabState);

  const onClickInventory = () => {
    dispatch(setTabState(TabState.Inventory));
  };
  const onClickSelling = () => {
    dispatch(setTabState(TabState.Selling));
  };
  const onClickAuction = () => {
    dispatch(setTabState(TabState.Auction));
  };
  const onClickLot = () => {
    dispatch(setTabState(TabState.Lot));
  };

  return (
    <>
      <div className={`tab-buttons-inventory-button ${tabState == TabState.Inventory ? 'tab-buttons-active' : ''}`}>
        <TabButton
          text={"Inventory"}
          onClick={onClickInventory}
          isDisabled={tabState == TabState.Inventory}
        />
      </div>
      <div className={`tab-buttons-selling-button ${tabState == TabState.Selling ? 'tab-buttons-active' : ''}`}>
        <TabButton
          text={"Selling"}
          onClick={onClickSelling}
          isDisabled={tabState == TabState.Selling}
        />
      </div>
      <div className={`tab-buttons-auction-button ${tabState == TabState.Auction ? 'tab-buttons-active' : ''}`}>
        <TabButton
          text={"Auction"}
          onClick={onClickAuction}
          isDisabled={tabState == TabState.Auction}
        />
      </div>
      <div className={`tab-buttons-lot-button ${tabState == TabState.Lot ? 'tab-buttons-active' : ''}`}>
        <TabButton
          text={"Lot"}
          onClick={onClickLot}
          isDisabled={tabState == TabState.Lot}
        />
      </div>
    </>
  );
};

export default TabButtons;
