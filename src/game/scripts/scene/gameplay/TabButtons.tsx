import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectTabState, setTabState, TabState } from "../../../../data/ui";
import TabButton from "../../buttons/TabButton";
import "./TabButtons.css";

const TabButtons = () => {
  const dispatch = useAppDispatch();
  const tabState = useAppSelector(selectTabState);

  const onClickInventory = () => {
    dispatch(setTabState(TabState.Inventory));
  };
  const onClickMarket = () => {
    dispatch(setTabState(TabState.Market));
  };
  const onClickBid = () => {
    dispatch(setTabState(TabState.Bid));
  };

  return (
    <>
      <div className="tab-buttons-inventory-button">
        <TabButton
          text={"Inventory"}
          onClick={onClickInventory}
          isDisabled={tabState == TabState.Inventory}
        />
      </div>
      <div className="tab-buttons-market-button">
        <TabButton
          text={"Market"}
          onClick={onClickMarket}
          isDisabled={tabState == TabState.Market}
        />
      </div>
      <div className="tab-buttons-bid-button">
        <TabButton
          text={"Bid"}
          onClick={onClickBid}
          isDisabled={tabState == TabState.Bid}
        />
      </div>
    </>
  );
};

export default TabButtons;
