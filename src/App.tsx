import "./App.css";

import "./fonts/fonts.css";
import { IsMobileProvider } from "./app/isMobileContext";
import { InitController } from "./game/scripts/scene/InitController";

function App() {
  return (
    <IsMobileProvider breakpointPx={768}>
      <InitController />
    </IsMobileProvider>
  );
}

export default App;
