import { r as reactExports } from "./index-g3gZ3l8S.js";
function clamp(value, [min, max]) {
  return Math.min(max, Math.max(min, value));
}
var DirectionContext = reactExports.createContext(void 0);
function useDirection(localDir) {
  const globalDir = reactExports.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}
export {
  clamp as c,
  useDirection as u
};
