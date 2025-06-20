import nugget_image_1 from "../../images/nuggets/1.png";
import nugget_image_2 from "../../images/nuggets/2.png";
import nugget_image_3 from "../../images/nuggets/3.png";
import nugget_image_4 from "../../images/nuggets/4.png";
import nugget_image_5 from "../../images/nuggets/5.png";
import nugget_image_6 from "../../images/nuggets/6.png";
import nugget_image_7 from "../../images/nuggets/7.png";

export function getNuggetImage(level: number) {
  switch (level) {
    case 0:
      return nugget_image_1;
    case 1:
      return nugget_image_1;
    case 2:
      return nugget_image_2;
    case 3:
      return nugget_image_3;
    case 4:
      return nugget_image_4;
    case 5:
      return nugget_image_5;
    case 6:
      return nugget_image_6;
    case 7:
      return nugget_image_7;
    default:
      return nugget_image_1;
  }
}

const MARKET_DEAL_DELAY = (24 * 60 * 60) / 5;
export const PICK_NUGGET_COST = 5000;

export function getTextShadowStyle(size: number, color = "black") {
  return {
    textShadow: ` 
    -${size}px -${size}px 0 ${color}, 
    ${size}px -${size}px 0 ${color}, 
    -${size}px ${size}px 0 ${color}, 
    ${size}px ${size}px 0 ${color}, 
    0px -${size}px 0 ${color}, 
    0px ${size}px 0 ${color}, 
    -${size}px 0px 0 ${color}, 
    ${size}px 0px 0 ${color}`,
  };
}

export function addressAbbreviation(address: string, tailLength: number) {
  return (
    address.substring(0, 8) +
    "..." +
    address.substring(address.length - tailLength, address.length)
  );
}

export function hexAbbreviation(address: string, tailLength: number) {
  return (
    address.substring(0, 3) +
    "..." +
    address.substring(address.length - tailLength, address.length)
  );
}

function decodeAttributes(attrStr: string) {
  let c = BigInt(attrStr);
  const attrs = [];
  for (let i = 0; i < 8; i++) {
    attrs.push(Number(c & 0xffn));
    c >>= 8n;
  }
  return attrs;
}
export function getAttributeList(attributes: string, feature: number) {
  const attrs = decodeAttributes(attributes);
  let str = "";
  if (feature > 0) {
    str += "(";
  }
  for (let i = 0; i < feature + 1; i++) {
    const symbol =
      attrs[i] == 0 ? "??" : (i == 0 ? attrs[i] : attrs[i] - 1).toString();
    str += `${i > 0 ? "+" : ""}${symbol}`;
  }
  if (feature > 0) {
    str += ")";
  }
  for (let i = feature + 1; i < 8; i++) {
    const symbol = attrs[i] == 0 ? "??" : (attrs[i] - 1).toString();
    str += `${i > 0 ? "x" : ""}${symbol}`;
  }
  const ret = [];
  for (const s of str) {
    ret.push(s);
  }
  return ret;
}
export function getIsFullyExplored(attributes: string): boolean {
  const attrs = decodeAttributes(attributes);
  return attrs.every((attr) => attr != 0);
}

export function isEqual(a: number[], b: number[]) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  return a.every((item: number, index: number) => item === b[index]);
}

export function getIsSettleEnabled(
  counter: number,
  lastUpdate: number
): boolean {
  return counter - lastUpdate >= MARKET_DEAL_DELAY;
}

export function formatTimeOneDigit(
  counter: number,
  lastUpdate: number
): string {
  const seconds = (MARKET_DEAL_DELAY + lastUpdate - counter) * 5;
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    const minutes = Math.max(Math.floor(seconds / 60), 1);
    return `${minutes} min`;
  }
}
