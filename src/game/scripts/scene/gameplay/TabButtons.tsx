import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectTabState, setTabState, TabState } from "../../../../data/ui";
import TabButton from "../../buttons/TabButton";
import "./TabButtons.css";

const TabButtons = () => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const adjustSize = () => {
    if (containerRef.current) {
      let tempWindowWidth = containerRef.current.offsetWidth;
      if (typeof window !== "undefined") {
        tempWindowWidth = window.innerWidth;
      }
      setIsMobile(tempWindowWidth <= 768);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current]);

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
      <div className="tab-buttons-inventory-button" style={{ height: tabState == TabState.Inventory ? "36px" : "24px" }}>
        <TabButton
          text={"Inventory"}
          onClick={onClickInventory}
          isDisabled={tabState == TabState.Inventory}
          isMobile={isMobile}
        />
      </div>
      <div className="tab-buttons-selling-button" style={{ height: tabState == TabState.Selling ? "36px" : "24px" }}>
        <TabButton
          text={"Selling"}
          onClick={onClickSelling}
          isDisabled={tabState == TabState.Selling}
          isMobile={isMobile}
        />
      </div>
      <div className="tab-buttons-auction-button" style={{ height: tabState == TabState.Auction ? "36px" : "24px" }}>
        <TabButton
          text={"Auction"}
          onClick={onClickAuction}
          isDisabled={tabState == TabState.Auction}
          isMobile={isMobile}
        />
      </div>
      <div className="tab-buttons-lot-button" style={{ height: tabState == TabState.Lot ? "36px" : "24px" }}>
        <TabButton
          text={"Lot"}
          onClick={onClickLot}
          isDisabled={tabState == TabState.Lot}
          isMobile={isMobile}
        />
      </div>
    </>
  );
};

export default TabButtons;
