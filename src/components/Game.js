import { calculateWinner } from "../helper";
import Board from "./Board";
import {useState} from "react";

const Game = () => {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [miniMaxBot, setMiniMaxBot] = useState("")
  let state = {
    history: [
      {
        squares: squares
      }
    ],
    stepNumber: 0,
    xIsNext: true
  };
  const winner = calculateWinner(state.history[state.stepNumber]);

  function isBoardFilled(squares) {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        return false;
      }
    }
    return true;
  }

  function findBestSquare(squares, player) {
    // 'player' is the maximizing player
    // 'opponent' is the minimizing player
    const opponent = player === 'X' ? 'O' : 'X';

    const minimax = (squares, isMax) => {
      const winner = calculateWinner(squares);

      // If player wins, score is +1
      if (winner === player) return { square: -1, score: 1 };

      // If opponent wins, score is -1
      if (winner === opponent) return { square: -1, score: -1 };

      // If Tie, score is 0
      if (isBoardFilled(squares)) return { square: -1, score: 0 };

      const best = { square: -1, score: isMax ? -1000 : 1000 };

      for (let i = 0; i < squares.length; i++) {
        if (squares[i]) {
          continue;
        }
        squares[i] = isMax ? player : opponent;
        const score = minimax(squares, !isMax).score;
        squares[i] = null;

        if (isMax) {
          if (score > best.score) {
            best.score = score;
            best.square = i;
          }
        } else {
          if (score < best.score) {
            best.score = score;
            best.square = i;
          }
        }
      }
      setMiniMaxBot("Computer played with a Score of: " + best.score)
      return best;
    };
    return minimax(squares, true).square;
  }

  function makeMove(i){
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];
    const tmpSquares = current.squares.slice();

    if(winner || tmpSquares[i]) return;

    tmpSquares[i] = state.xIsNext ? "X" : "O";
    const nextState = {
      history: history.concat([
        {
          squares: tmpSquares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !state.xIsNext
    };

    setSquares(tmpSquares)

    return state = nextState
  }

  function handleClick(i) {
    makeMove(i)

    const squares = state.history[state.stepNumber].squares.slice();
    const bestSquare = findBestSquare(squares, state.xIsNext ? "X" : "O");
    if (bestSquare !== -1){
      makeMove(bestSquare);
    }
  }

  const start = () => {
    state.stepNumber = 0;
    state.xIsNext = true;
    setSquares(Array(9).fill(null))
  };

  const renderMoves = () =>
      {
        return (
            <li>
              <button onClick={() => start()}>Restart</button>
            </li>
        );
      };

  return (
      <>
        <h1>React Tic Tac Toe</h1>
        <Board squares={state.history[state.stepNumber].squares} onClick={handleClick} />
        <div className="info-wrapper">
          <div>
            <h3>History</h3>
            {renderMoves()}
          </div>
          <div>
            <h3>{miniMaxBot}</h3>
          </div>
        </div>
      </>
  );
};

export default Game;