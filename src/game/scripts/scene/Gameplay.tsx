import Popups from "./Popups";
import { useAppSelector, useViewport } from "../../../app/hooks";
import "./Gameplay.css";
import PlayerInfo from "./gameplay/PlayerInfo";
import avatarImage from "../../images/avatars/avatar_1.png";
import TabButtons from "./gameplay/TabButtons";
import NuggetGrid from "./gameplay/NuggetGrid";
import { selectIsLoading } from "../../../data/errors";
import LoadingHint from "./LoadingHint";
import ResponsiveContainer from "../common/ResponsiveContainer";
import MobileGameplayLayout from "../layout/MobileGameplayLayout";
import DesktopGameplayLayout from "../layout/DesktopGameplayLayout";
import "../common/ResponsiveContainer.css";

const Gameplay = () => {
  const isLoading = useAppSelector(selectIsLoading);
  const viewport = useViewport();

  // Prepare common components
  const playerInfo = <PlayerInfo />;
  const tabButtons = <TabButtons />;
  const nuggetGrid = <NuggetGrid />;
  const avatar = (
    <img
      src={avatarImage}
      alt="Player Avatar"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );

  return (
    <ResponsiveContainer className="responsive-gameplay-container">
      <Popups />
      {isLoading && <LoadingHint />}
      
      {viewport.isMobile ? (
        <MobileGameplayLayout
          playerInfo={playerInfo}
          tabButtons={tabButtons}
          nuggetGrid={nuggetGrid}
          avatar={avatar}
        />
      ) : (
        <DesktopGameplayLayout
          playerInfo={playerInfo}
          tabButtons={tabButtons}
          nuggetGrid={nuggetGrid}
          avatar={avatar}
        />
      )}
    </ResponsiveContainer>
  );
};

export default Gameplay;
