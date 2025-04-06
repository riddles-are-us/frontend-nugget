import React, { useRef, useEffect, useState } from "react";
import "./HorizontalExtendableImage.css";

interface Props {
  id?: number;
  leftRatio: number;
  rightRatio: number;
  leftImage: string;
  midImage: string;
  rightImage: string;
}

const HorizontalExtendableImage = ({
  id = 0,
  leftRatio,
  rightRatio,
  leftImage,
  midImage,
  rightImage,
}: Props) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const adjustSize = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      setContainerHeight(containerRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [id]);

  const eps = 0.05;
  const leftHeight = containerHeight;
  const leftWidth = leftHeight * leftRatio;
  const rightHeight = containerHeight;
  const rightWidth = rightHeight * rightRatio;
  const middleHeight = containerHeight;
  const middleWidth = containerWidth - (leftWidth + rightWidth) * (1 - eps);
  const middleLeft = leftWidth * (1 - eps);

  return (
    <div ref={containerRef} className="horizontal-extendable-image-container">
      <img
        src={midImage}
        className="horizontal-extendable-image-element-container"
        style={{ width: middleWidth, height: middleHeight, left: middleLeft }}
      />
      <img
        src={leftImage}
        className="horizontal-extendable-image-element-container"
        style={{ width: leftWidth, height: leftHeight, left: 0 }}
      />
      <img
        src={rightImage}
        className="horizontal-extendable-image-element-container"
        style={{ width: rightWidth, height: rightHeight, right: 0 }}
      />
    </div>
  );
};

export default HorizontalExtendableImage;
