import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./WelcomePage.css";
import background from "../../images/scene/welcome_page/welcome_bg.png";
import TemplateAdjustableImageTextButton from "../template/TemplateAdjustableImageTextButton";

interface Props {
  isLogin: boolean;
  onLogin: () => void;
  onStartGame: () => void;
}

const WelcomePage = ({ isLogin, onLogin, onStartGame }: Props) => {
  const dispatch = useAppDispatch();
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState<number>(0);

  const adjustSize = () => {
    if (textRef.current) {
      const parentWidth = textRef.current.offsetWidth;
      setFontSize(parentWidth / 25);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, []);

  const onClickConnectWallet = () => {
    onLogin();
  };

  const onClickPlay = () => {
    onStartGame();
  };

  return (
    <div className="welcome-page-container">
      <img className="welcome-page-background" src={background} />
      {isLogin ? (
        <div className="welcome-page-panel-play-button">
          <TemplateAdjustableImageTextButton
            text={"Play"}
            onClick={onClickPlay}
            isDisabled={false}
          />
        </div>
      ) : (
        <div className="welcome-page-panel-connect-wallet-button">
          <TemplateAdjustableImageTextButton
            text={"Connect Wallet"}
            onClick={onClickConnectWallet}
            isDisabled={false}
          />
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
