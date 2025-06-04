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
  for (let i = 0; i < feature; i++) {
    const symbol = attrs[i] == 0 ? "??" : (attrs[i] - 1).toString();
    str += `${i > 0 ? "+" : ""}${symbol}`;
  }
  if (feature > 0) {
    str += ")";
  }
  for (let i = feature; i < 8; i++) {
    const symbol = attrs[i] == 0 ? "??" : (attrs[i] - 1).toString();
    str += `${i > 0 ? "x" : ""}${symbol}`;
  }
  const ret = [];
  for (const s of str) {
    ret.push(s);
  }
  return ret;
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
