import "./LoadingPage.css";
import connecting_background from "../../images/scene/loading_page/connecting_bg.png";
import loading_background from "../../images/scene/loading_page/loading_bg.png";
import frame from "../../images/scene/loading_page/frame.png";
import bar from "../../images/scene/loading_page/bar.png";

interface Props {
  message: string;
  progress: number;
}

const LoadingPage = ({ message, progress }: Props) => {
  return (
    <div className="loading-page-connecting-container">
      {progress == 0 ? (
        <>
          <img
            src={connecting_background}
            className="loading-page-connecting-background"
          />
          <img src={frame} className="loading-page-connecting-frame" />
          <img src={bar} className="loading-page-connecting-bar" />
        </>
      ) : (
        <>
          <img
            src={loading_background}
            className="loading-page-progress-bar-background"
          />
          <img src={frame} className="loading-page-progress-bar-frame" />
          <img
            src={bar}
            className="loading-page-progress-bar-bar"
            style={{
              clipPath: `polygon(${progress}% 0,  ${progress}% 100%, 0 100%, 0 0)`,
            }}
          />
        </>
      )}
    </div>
  );
};

export default LoadingPage;
