import "./LoadingPage.css";
import leftBackground from "../../images/scene/loading_page/progress_background/left.png";
import midBackground from "../../images/scene/loading_page/progress_background/mid.png";
import rightBackground from "../../images/scene/loading_page/progress_background/right.png";
import { useEffect, useRef, useState } from "react";
import HorizontalExtendableImage from "../common/HorizontalExtendableImage";

interface Props {
  message: string;
  progress: number;
}

const LoadingPage = ({ message, progress }: Props) => {
  message = "Loading...";
  const containerRef = useRef<HTMLParagraphElement>(null);
  const contentContainerRef = useRef<HTMLParagraphElement>(null);
  const [messageFontSize, setMessageFontSize] = useState<number>(0);
  const [elementCount, setElementCount] = useState<number>(0);

  const adjustSize = () => {
    if (containerRef.current) {
      setMessageFontSize(containerRef.current.offsetHeight / 40);
    }

    if (contentContainerRef.current) {
      const containerWidth = contentContainerRef.current.offsetWidth;
      const elementHeight = contentContainerRef.current.offsetHeight;
      const elementWidth = elementHeight / 3;
      const gap = 2;
      const totalElementWidth = elementWidth + gap;
      setElementCount(
        Math.floor(((containerWidth / totalElementWidth) * progress) / 100)
      );
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current, progress]);
  return (
    <div className="loading-page-container">
      <div ref={containerRef} className="loading-page-background">
        <div className="loading-page-progress-bar-container">
          <div className="loading-page-progress-bar-background">
            <HorizontalExtendableImage
              leftRatio={24 / 53}
              rightRatio={24 / 53}
              leftImage={leftBackground}
              midImage={midBackground}
              rightImage={rightBackground}
            />
          </div>
          <div
            ref={contentContainerRef}
            className="loading-page-progress-bar-content"
          >
            {Array.from({ length: elementCount }).map((_, index) => (
              <div
                key={index}
                className="loading-page-progress-bar-content-element"
              />
            ))}
          </div>
        </div>
        {message && (
          <p
            className="loading-page-message-text"
            style={{ fontSize: messageFontSize }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingPage;
