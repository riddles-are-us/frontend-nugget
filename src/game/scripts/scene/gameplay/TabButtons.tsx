import { useAppDispatch, useAppSelector, useViewport } from "../../../../app/hooks";
import { selectTabState, setTabState, TabState } from "../../../../data/ui";
import TabButton from "../../buttons/TabButton";
import "./TabButtons.css";
import "./ResponsiveTabButtons.css";

const TabButtons = () => {
  const dispatch = useAppDispatch();
  const tabState = useAppSelector(selectTabState);
  const viewport = useViewport();

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

  const tabs = [
    { state: TabState.Inventory, text: "Inventory", onClick: onClickInventory },
    { state: TabState.Selling, text: "Selling", onClick: onClickSelling },
    { state: TabState.Auction, text: "Auction", onClick: onClickAuction },
    { state: TabState.Lot, text: "Lot", onClick: onClickLot },
  ];

  // Mobile layout: horizontal flex navigation
  if (viewport.isMobile) {
    return (
      <div className="responsive-tab-buttons-mobile-container">
        {tabs.map((tab, index) => (
          <div key={tab.state} className="responsive-tab-button-mobile">
            <TabButton
              text={tab.text}
              onClick={tab.onClick}
              isDisabled={tabState === tab.state}
            />
          </div>
        ))}
      </div>
    );
  }

  // Desktop layout: preserve original positioning
  return (
    <div className="responsive-tab-buttons-desktop-container">
      <div className="tab-buttons-inventory-button">
        <TabButton
          text={"Inventory"}
          onClick={onClickInventory}
          isDisabled={tabState == TabState.Inventory}
        />
      </div>
      <div className="tab-buttons-selling-button">
        <TabButton
          text={"Selling"}
          onClick={onClickSelling}
          isDisabled={tabState == TabState.Selling}
        />
      </div>
      <div className="tab-buttons-auction-button">
        <TabButton
          text={"Auction"}
          onClick={onClickAuction}
          isDisabled={tabState == TabState.Auction}
        />
      </div>
      <div className="tab-buttons-lot-button">
        <TabButton
          text={"Lot"}
          onClick={onClickLot}
          isDisabled={tabState == TabState.Lot}
        />
      </div>
    </div>
  );
};

export default TabButtons;
