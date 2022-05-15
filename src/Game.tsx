import React from "react";
import _ from "lodash";

import {
  minesBet,
  minesCashout,
  minesNext,
  CasinoGameMines,
  gameState,
} from "./api";
import styled from "styled-components";
import gemAudio from "./assets/gem.mp3";
import mineAudio from "./assets/mine.mp3";
import SingleBox from "./components/Box";

interface StyledContainerProps {
  boxNumber: number;
  withdraw: boolean;
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.5em;
  margin-bottom: 1em;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
   @media (max-width: 720px) {
     display: flex;
      flex-direction: column;
      // max-width: 300px;
      margin: 0;
      width:100%;
      height:300px;
    }
     @media (max-width: 390px) {
      // max-width: 250px;
      width:100%;
      minHeight:250px;
    }

  .boxContainer {
    display: grid;
    border-radius: 8px;
    grid-template-rows: repeat(
      ${(props: StyledContainerProps) => props.boxNumber},
      100px
    );
    grid-template-columns: repeat(
      ${(props: StyledContainerProps) => props.boxNumber},
      100px
    );
    gap: 10px;
    padding: 1em;
    margin: 0 auto;
    background-color: #23303cb0;
    @media (max-width: 840px) {
      margin: 0 auto;
      display: grid;
      grid-template-rows: repeat(
        ${(props: StyledContainerProps) => props.boxNumber},
        50px
      );
      grid-template-columns: repeat(
        ${(props: StyledContainerProps) => props.boxNumber},
        50px
      );
      gap: 10px;
    }
     @media (max-width: 490px) {
      margin: 0 auto;
      display: grid;
      grid-template-rows: repeat(
        ${(props: StyledContainerProps) => props.boxNumber},
        40px
      );
      grid-template-columns: repeat(
        ${(props: StyledContainerProps) => props.boxNumber},
        40px
      );
      gap: 5px;
    }
    @media (max-width: 360px) {
      margin: 0 auto;
      display: grid;
      grid-template-rows: repeat(
        ${(props: StyledContainerProps) => props.boxNumber},
        35px
      );
      grid-template-columns: repeat(
        ${(props: StyledContainerProps) => props.boxNumber},
        35px
      );
      gap: 5px;
    }
  }
  .hoverText {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #23303cb0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 15;
    @media (max-width: 360px) {
           font-size: 9px;
        }
  }
  .idle {
    color: red;
    opacity: 1;
    h1 {
      font-size: 3em;
    }
    input {
      height: 2em;
      width: 15em;
    }
    p {
      font-size: 1.5em;
    }
    button {
      height: 3em;
      border-radius: 0.5em;
      width: 13em;
      color: white;
      background-color: #23303cfc;
      border: none;
      font-size: 1.5em;
      transition: all 0.3s ease;
      @media (max-width: 360px) {
           width: 10em;
        }
      &:hover {
        background-color: yellow;
        color: black;
      }
    }
  }
  .busted {
    color: red;
    opacity: 1;
    h1 {
      font-size: 3em;
    }
    p {
      font-size: 1.5em;
    }
    button {
      height: 3em;
      border-radius: 0.5em;
      width: 13em;
      color: white;
      background-color: #23303cfc;
      border: none;
      font-size: 1.5em;
      transition: all 0.3s ease;
      @media (max-width: 360px) {
           width: 10em;
        }
      &:hover {
        background-color: yellow;
        color: black;
      }
    }
  }
  .buttonCollection {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
      button {
        margin-top: 1em;
        height: 3em;
        border-radius: 0.5em;
        width: 13em;
        color: white;
        background-color: #23303cfc;
        opacity: ${(props: StyledContainerProps) => (props.withdraw ? 1 : 0.5)};
        border: none;
        font-size: 1.5em;
        transition: all 0.3s ease;
        @media (max-width: 360px) {
           width: 10em;
        }
        &:hover {
          background-color: yellow;
          color: black;
        }
        &:disabled {
        opacity: 0.5;
        color: #fff;
        cursor: not-allowed;
        }
      }
    }
  }
`;

const Game = () => {
  const [state, setState] = React.useState<CasinoGameMines>(gameState);
  const [boxNumber, setBoxNumber] = React.useState<number>(5);
  const [hoverState, setHoverState] = React.useState(true);
  const [showAll, setShowAll] = React.useState(false);
  const [betPlaced, setBetPlaced] = React.useState(false);
  const [withdraw, setWithdraw] = React.useState(false);

  const hoverMessages = [
    "Where could it be?",
    "Try your luck!",
    "Feeling lucky?",
    "Be careful!",
    "Winners are grinners",
    "Does lightning strike twice?",
    "Up your chances",
    "Determine your destiny",
  ];

  return (
    <StyledContainer withdraw={withdraw} boxNumber={boxNumber}>
      <div className="boxContainer">
        {_.range(0, boxNumber ** 2).map((index) => {
          return (
            <div className="singleBox" key={index}>
              <SingleBox
                id={index}
                state={state}
                setState={setState}
                setHoverState={setHoverState}
                setShowAll={setShowAll}
                showAll={showAll}
                hoverMessage={hoverMessages[index % hoverMessages.length]}
                setWithdraw={setWithdraw}
                setBetPlaced={setBetPlaced}
              />
            </div>
          );
        })}
      </div>
      {hoverState && (
        <div className="hoverText">
          {state.state === "idle" && (
            <div className="idle">
              {" "}
              <h1>Time to start</h1> <p>Like your odds? place a bet!</p>{" "}
              <input
                type="number"
                min="5"
                max="7"
                defaultValue="5"
                onChange={(e) => setBoxNumber(Number(e.currentTarget.value))}
              ></input>
              <p>Hint: increase the grid size to lower your risk</p>
              <button
                onClick={() => {
                  setHoverState(false);
                  minesBet(boxNumber ** 2)
                    .then((result) => {
                      setBetPlaced(true);
                      setState((prevState: CasinoGameMines) => {
                        prevState.state = result.state;
                        prevState.mines = result.mines;
                        return prevState;
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                Place Bet
              </button>{" "}
            </div>
          )}
          {state.state === "busted" && (
            <div className="busted">
              {" "}
              <h1>Uh - oh</h1> <p>Better Luck next time</p>{" "}
              <button
                onClick={() => {
                  window.location.reload(false);
                  setState({ ...state, state: "idle" });
                }}
              >
                Bet Again
              </button>{" "}
            </div>
          )}
          {state.state === "cashout" && (
            <div className="busted">
              {" "}
              <h1>Ka - ching!</h1> <p>You cashed out.</p>{" "}
              <button
                onClick={() => {
                  window.location.reload(false);
                  setState({ ...state, state: "idle" });
                }}
              >
                Bet Again
              </button>{" "}
            </div>
          )}
        </div>
      )}

      <div key={state.revealedTiles.length} className="buttonCollection">
        <button
          onClick={() => {
            setBetPlaced(true);
          }}
          disabled={betPlaced}
        >
          {betPlaced ? "BET PLACED" : "BET"}
        </button>
        <button
          key={state.revealedTiles.length}
          onClick={async () => {
            if (state.revealedTiles.length > 0) {
              await minesCashout();
              setHoverState(true);
            }
          }}
        >
          CASHOUT
        </button>
      </div>
    </StyledContainer>
  );
};

export default Game;
