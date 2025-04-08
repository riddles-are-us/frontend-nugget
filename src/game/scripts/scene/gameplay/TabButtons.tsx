import TabButton from "../../buttons/TabButton";
import "./TabButtons.css";

const TabButtons = () => {
  const onClickInventory = () => {
    // Handle inventory button click
  };
  const onClickMarket = () => {
    // Handle market button click
  };

  return (
    <>
      <div className="tab-buttons-inventory-button">
        <TabButton
          text={"Inventory"}
          onClick={onClickInventory}
          isDisabled={false}
        />
      </div>
      <div className="tab-buttons-market-button">
        <TabButton text={"Market"} onClick={onClickMarket} isDisabled={false} />
      </div>
    </>
  );
};

export default TabButtons;
