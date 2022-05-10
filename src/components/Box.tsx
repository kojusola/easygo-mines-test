import React from "react";
import styled from "styled-components";
import {
  minesBet,
  minesCashout,
  minesNext,
  CasinoGameMines,
  gameState,
} from "../api";
import { Gem } from "../assets";
import { Mine } from "../assets";
import gemAudio from "../assets/gem.mp3";
import mineAudio from "../assets/mine.mp3";

const StyledBox = styled.div`
  background-color: #23303cd6;
  border-radius: 6px;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px 3px black;
  .stone {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mineStone,
  .gemStone {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mineStone {
    background-color: #d8003e80;
  }
  .gemStone {
    background-color: #03ff054d;
  }
  .mine,
  .gem {
    width: 38%;
    height: 38%;
  }

  .hoverMessage {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      z-index: 10;
      font-size: 14px;
      transform: translateY(30%);
      opacity: 0;
      text-align: center;
      transition-delay: 2s;
      transition: transform 0.3s ease-out;
    }

    &::before {
      content: "";
      position: absolute;
      width: 100%;
      transform: translateX(-100%);
      height: 100%;
      right: 0;
      background-color: yellow;
      transform-origin: right;
      transition: transform 0.3s ease-out;
    }
  }
  &.show {
    cursor: not-allowed;
    .gem {
      opacity: 1;
      height: 80%;
      width: 80%;
    }
    .mine {
      opacity: 1;
      height: 80%;
      width: 80%;
      animation: busted 0.7s 0.4s ease infinite;
    }
    .hoverMessage {
      display: none;
      cursor: not-allowed;
    }
  }
  &.showAll {
    .gem {
      opacity: 1;
      width: 38%;
      height: 38%;
    }
    .mine {
      opacity: 1;
      width: 38%;
      height: 38%;
    }
    .hoverMessage {
      display: none;
    }
  }
  &:hover {
    .hoverMessage {
      &:before {
        transform: translateX(0%);
        transform-origin: left;
        animation: rotate 5s 1s infinite;
      }
      p {
        animation: text 0.8s 0.4s forwards;
      }
    }
    @keyframes rotate {
      0% {
        filter: hue-rotate(0deg);
      }
      100% {
        filter: hue-rotate(360deg);
      }
    }
    @keyframes text {
      0% {
        opacity: 0;
        transform: translateY(30%);
      }
      100% {
        opacity: 1;
        transform: translateY(0%);
      }
    }
    @keyframes busted {
      0% {
        width: 50%;
      }
      50% {
        width: 80%;
      }
      100% {
        width: 50%;
      }
    }
  }
`;

interface SingleBoxProps {
  hoverMessage: string;
  id: number;
  state: CasinoGameMines;
  setState: (props: CasinoGameMines) => void;
  setHoverState: (props: boolean) => void;
  setShowAll: (props: boolean) => void;
  setWithdraw: (props: boolean) => void;
  setBetPlaced: (props: boolean) => void;
  showAll: boolean;
}
const SingleBox = ({
  hoverMessage,
  id,
  state,
  setHoverState,
  setState,
  setShowAll,
  showAll,
  setWithdraw,
  setBetPlaced,
}: SingleBoxProps) => {
  const [show, setShow] = React.useState(false);
  const gemPlay = new Audio(gemAudio);
  const minePlay = new Audio(mineAudio);

  const handleClick = () => {
    if (state.state === "idle") {
      return;
    }
    if (state.revealedTiles.includes(id)) {
      return;
    }
    minesNext(id)
      .then((res) => {
        setState(res);
        console.log(state);
        if (res.state === "busted") {
          setHoverState(true);
          setShow(true);
          setShowAll(true);
          minePlay.play();
        } else {
          gemPlay.play();
          setWithdraw(true);
          setBetPlaced(false);
          setShow(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  React.useEffect(() => {
    if (state.state === "progress" && state.revealedTiles.includes(id)) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, []);

  return (
    <StyledBox onClick={() => handleClick()} className={`${show && "show"}`}>
      <div className="hoverMessage">
        <p>{hoverMessage}</p>
      </div>
      {show && (
        <div className="stone">
          {state.mines.includes(id) ? (
            <div className="mineStone">
              <Mine className="mine" />
            </div>
          ) : (
            <div className="gemStone">
              <Gem className="gem" />
            </div>
          )}
        </div>
      )}
    </StyledBox>
  );
};

export default SingleBox;
