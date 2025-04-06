import { useEffect, useRef, useState } from "react";
import DefaultButton from "../buttons/DefaultButton";
import "./PlayerInfo.css";

const PlayerInfo = () => {
  const playerId = "12345"; // Example player ID
  const money = 1000; // Example money value
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState<number>(0);

  const adjustSize = () => {
    if (containerRef.current) {
      setFontSize(containerRef.current.offsetHeight / 6);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, []);

  const onClickDeposit = () => {
    // Handle deposit logic here
  };
  const onClickWithdraw = () => {
    // Handle withdraw logic here
  };

  const onClickPickNugget = () => {
    // Handle withdraw logic here
  };

  return (
    <div ref={containerRef} className="player-info-container">
      <p className="player-info-player-id-text" style={{ fontSize: fontSize }}>
        Player ID: {playerId}
      </p>
      <p
        className="player-info-money-text"
        style={{ fontSize: fontSize * 0.7 }}
      >
        Money: ${money}
      </p>
      <div className="player-info-deposit-button">
        <DefaultButton
          text={"Deposit"}
          onClick={onClickDeposit}
          isDisabled={false}
        />
      </div>
      <div className="player-info-withdraw-button">
        <DefaultButton
          text={"Withdraw"}
          onClick={onClickWithdraw}
          isDisabled={false}
        />
      </div>
      <div className="player-info-pick-nugget-button">
        <DefaultButton
          text={"Pick Nugget"}
          onClick={onClickPickNugget}
          isDisabled={false}
        />
      </div>
    </div>
  );
};

export default PlayerInfo;
