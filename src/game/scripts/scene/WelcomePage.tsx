import { useEffect, useRef, useState } from "react";
import "./WelcomePage.css";
import background from "../../images/scene/welcome_page/welcome_bg.png";
import TemplateAdjustableImageTextButton from "../template/TemplateAdjustableImageTextButton";
import DisclaimerPopup from "../popups/DisclaimerPopup";

interface Props {
  isLogin: boolean;
  disabledLoginButton: boolean;
  disabledPlayButton: boolean;
  onClickConnectWallet: () => void;
  onClickPlay: () => void;
}

const WelcomePage = ({
  isLogin,
  disabledLoginButton,
  disabledPlayButton,
  onClickConnectWallet,
  onClickPlay,
}: Props) => {
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

  return (
    <div className="welcome-page-container">
      <div className="welcome-page-background" />
      <div className="welcome-page-disclaimer-popup-container">
        <DisclaimerPopup />
      </div>
      {isLogin ? (
        <div className="welcome-page-panel-play-button">
          <TemplateAdjustableImageTextButton
            id={1}
            text={"Play"}
            onClick={onClickPlay}
            isDisabled={disabledPlayButton}
          />
        </div>
      ) : (
        <div className="welcome-page-panel-connect-wallet-button">
          <TemplateAdjustableImageTextButton
            id={2}
            text={"Connect Wallet"}
            onClick={onClickConnectWallet}
            isDisabled={disabledLoginButton}
          />
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
