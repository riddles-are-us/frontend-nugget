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
      <div className="tab-buttons-inventory-button" style={isMobile ? { height: tabState == TabState.Inventory ? "36px" : "24px" } : {}}>
        <TabButton
          text={"Inventory"}
          onClick={onClickInventory}
          isDisabled={tabState == TabState.Inventory}
        />
      </div>
      <div className="tab-buttons-selling-button" style={isMobile ? { height: tabState == TabState.Selling ? "36px" : "24px" } : {}}>
        <TabButton
          text={"Selling"}
          onClick={onClickSelling}
          isDisabled={tabState == TabState.Selling}
        />
      </div>
      <div className="tab-buttons-auction-button" style={isMobile ? { height: tabState == TabState.Auction ? "36px" : "24px" } : {}}>
        <TabButton
          text={"Auction"}
          onClick={onClickAuction}
          isDisabled={tabState == TabState.Auction}
        />
      </div>
      <div className="tab-buttons-lot-button" style={isMobile ? { height: tabState == TabState.Lot ? "36px" : "24px" } : {}}>
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
