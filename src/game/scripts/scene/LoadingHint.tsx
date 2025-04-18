import { useEffect, useRef, useState } from "react";
import "./LoadingHint.css";
import { getTextShadowStyle } from "../common/Utility";

const LoadingHint = () => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState<number>(0);

  const adjustSize = () => {
    if (containerRef.current) {
      setFontSize(containerRef.current.offsetHeight / 30);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current]);

  return (
    <div ref={containerRef} className="loading-hint-container">
      <div className="loading-hint-mask" />
      <p
        className="loading-hint-title-text"
        style={{
          fontSize: fontSize,
          ...getTextShadowStyle(fontSize / 15),
        }}
      >
        Loading...
      </p>
    </div>
  );
};

export default LoadingHint;
