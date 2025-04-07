export function getTextShadow(size: number, color = "black") {
  return ` 
    -${size}px -${size}px 0 ${color}, 
    ${size}px -${size}px 0 ${color}, 
    -${size}px ${size}px 0 ${color}, 
    ${size}px ${size}px 0 ${color}, 
    0px -${size}px 0 ${color}, 
    0px ${size}px 0 ${color}, 
    -${size}px 0px 0 ${color}, 
    ${size}px 0px 0 ${color}`;
}
