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
