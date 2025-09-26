import "./App.css";

import { LoadingController } from "./game/scripts/scene/LoadingController";
import "./fonts/fonts.css";
import { IsMobileProvider } from "./app/isMobileContext";

function App() {
  return <IsMobileProvider breakpointPx={768}>
    <LoadingController />
  </IsMobileProvider>;
}

export default App;
