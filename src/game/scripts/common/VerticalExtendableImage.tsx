import React, { useRef, useEffect, useState } from "react";
import "./VerticalExtendableImage.css";

interface Props {
  id?: number;
  topRatio: number;
  bottomRatio: number;
  topImage: string;
  midImage: string;
  bottomImage: string;
}

const VerticalExtendableImage = ({
  id = 0,
  topRatio,
  bottomRatio,
  topImage,
  midImage,
  bottomImage,
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
  const topWidth = containerWidth;
  const topHeight = topWidth / topRatio;
  const bottomWidth = containerWidth;
  const bottomHeight = bottomWidth / bottomRatio;
  const middleWidth = containerWidth;
  const middleHeight = containerHeight - (topHeight + bottomHeight) * (1 - eps);
  const middleTop = topHeight * (1 - eps);

  return (
    <div ref={containerRef} className="vertical-extendable-image-container">
      <img
        src={midImage}
        className="vertical-extendable-image-element-container"
        style={{ width: middleWidth, height: middleHeight, top: middleTop }}
      />
      <img
        src={topImage}
        className="vertical-extendable-image-element-container"
        style={{ width: topWidth, height: topHeight, top: 0 }}
      />
      <img
        src={bottomImage}
        className="vertical-extendable-image-element-container"
        style={{ width: bottomWidth, height: bottomHeight, bottom: 0 }}
      />
    </div>
  );
};

export default VerticalExtendableImage;
