import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./LeaderRankPage.css";
import rank_1 from "../../images/scene/gameplay/leader_rank/rank_1.png";
import rank_2 from "../../images/scene/gameplay/leader_rank/rank_2.png";
import rank_3 from "../../images/scene/gameplay/leader_rank/rank_3.png";
import DefaultButton from "../buttons/DefaultButton";
import { getAttributeList } from "../common/Utility";
import { useWalletContext } from "zkwasm-minirollup-browser";
import {
  LoadingType,
  pushError,
  selectIsLoading,
  setLoadingType,
} from "../../../data/errors";
import RankElement from "../scene/gameplay/LeaderRankElement";
import Grid from "../common/Grid";
import {
  addRankNuggetTab,
  resetRankNuggetTab,
  selectNuggetsForceUpdate,
  selectRankNuggetTab,
  setNuggetsForceUpdate,
} from "../../../data/nuggets";
import { getRankNuggetsAsync } from "../express";
import PageSelector from "../common/PageSelector";
import { LeHexBN } from "zkwasm-minirollup-rpc";
import { bnToHexLe } from "delphinus-curves/src/altjubjub";

const ELEMENT_PER_REQUEST = 9999;
const LeaderRankPage = () => {
  const isFirst = useRef(true);
  const dispatch = useAppDispatch();
  const { l2Account } = useWalletContext();
  const containerRef = useRef<HTMLParagraphElement>(null);
  const isLoading = useAppSelector(selectIsLoading);

  const gridContainerRef = useRef<HTMLParagraphElement>(null);
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [elementHeight, setElementHeight] = useState<number>(0);
  const columnCount = 1;
  const [rowCount, setRowCount] = useState<number>(0);

  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const pageSize = rowCount * columnCount;
  const rankNuggetTab = useAppSelector(selectRankNuggetTab);
  const nuggetsForceUpdate = useAppSelector(selectNuggetsForceUpdate);
  const [elements, setElements] = useState<JSX.Element[]>([]);
  const pids = l2Account?.pubkey
    ? new LeHexBN(bnToHexLe(l2Account?.pubkey)).toU64Array()
    : ["", "", "", ""];

  useEffect(() => {
    setPage(0);
    reloadTabData();
  }, []);

  useEffect(() => {
    if (nuggetsForceUpdate) {
      dispatch(setNuggetsForceUpdate(false));
      checkTabData();
    }
  }, [nuggetsForceUpdate]);

  const checkTabData = async () => {
    if (isLoading) {
      return;
    }

    await updateTabData();
  };

  const reloadTabData = async () => {
    dispatch(resetRankNuggetTab());
    dispatch(setNuggetsForceUpdate(true));
  };

  const updateTabData = async () => {
    dispatch(setLoadingType(LoadingType.Default));
    await addRankPage(0, ELEMENT_PER_REQUEST);
    dispatch(setLoadingType(LoadingType.None));
  };

  const addRankPage = async (skip: number, limit: number) => {
    const rankNuggetTabData = await getRankNuggetsAsync(skip, limit, [
      Number(pids[1]),
      Number(pids[2]),
    ]);
    dispatch(
      addRankNuggetTab({
        nuggets: rankNuggetTabData.nuggets,
        nuggetCount: rankNuggetTabData.nuggetCount,
      })
    );
  };

  return (
    <div className="leader-rank-page-container">
      <div className="leader-rank-page-grid-container">
        <div className="leader-rank-page-reload-button-mobile">
          <DefaultButton
            text={"Reload"}
            onClick={reloadTabData}
            isDisabled={false}
          ></DefaultButton>
        </div>
        <p
          className="leader-rank-page-title-text"
        >
          Leader Board
        </p>
        {rankNuggetTab.nuggets.map((nuggetData, rank) => {
          const nuggetPrice = nuggetData.sysprice;
          const ownerId = nuggetData.owner[0] ?? "";
          return (
            <div
              key={rank}
              className="leader-rank-page-nugget-container"
            >
              {rank <= 2 ? (
                <img
                  className="leader-rank-page-rank-image"
                  src={rank == 0 ? rank_1 : rank == 1 ? rank_2 : rank_3}
                />
              ) : (
                <div className="leader-rank-page-rank-text">
                  <p>
                    {rank + 1}
                  </p>
                </div>
              )}
              <div
                className="leader-rank-page-bidder-value-text-container"
              >
                <div className="leader-rank-page-bidder-value-text">
                {`Bidder ID ${ownerId}`}
                </div>
              </div>
              <p
                className="leader-rank-page-coin-text"
              >
                {nuggetPrice}
              </p>
              <div className="leader-rank-page-coin-image" /> 
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default LeaderRankPage;
