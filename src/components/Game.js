import { calculateWinner } from "../helper";
import Board from "./Board";

const Game = () => {
  let state = {
    history: [
      {
        squares: Array(9).fill(null)
      }
    ],
    stepNumber: 0,
    xIsNext: true
  };
  const winner = calculateWinner(state.history[state.stepNumber]);
  const xO = state.xIsNext ? "X" : "O";

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

      // Initialize 'best'. If isMax, we want to maximize score, and minimize otherwise.
      const best = { square: -1, score: isMax ? -1000 : 1000 };

      // Loop through every square on the board
      for (let i = 0; i < squares.length; i++) {
        // If square is already filled, it's not a valid move so skip it
        if (squares[i]) {
          continue;
        }

        // If square is unfilled, then it's a valid move. Play the square.
        squares[i] = isMax ? player : opponent;
        // Simulate the game until the end game and get the score,
        // by recursively calling minimax.
        const score = minimax(squares, !isMax).score;
        // Undo the move
        squares[i] = null;

        if (isMax) {
          // Maximizing player; track the largest score and move.
          if (score > best.score) {
            best.score = score;
            best.square = i;
          }
        } else {
          // Minimizing opponent; track the smallest score and move.
          if (score < best.score) {
            best.score = score;
            best.square = i;
          }
        }
      }

      // The move that leads to the best score at end game.
      return best;
    };

    // The best move for the 'player' given current board
    return minimax(squares, true).square;
  }

  function makeMove(i){
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if(winner || squares[i]) return;

    squares[i] = state.xIsNext ? "X" : "O";
    const nextState = {
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !state.xIsNext
    };

    return state = (nextState)
  }

  async function handleClick(i) {
    await makeMove(i)

    const squares = state.history[state.stepNumber].squares.slice();
    const bestSquare = findBestSquare(squares, state.xIsNext ? "X" : "O");
    if (bestSquare !== -1){
      await makeMove(bestSquare);
    }
  }


  const jumpTo = (step) => {
    state.stepNumber = step;
    state.xIsNext = (step % 2 === 0);
  };

  const renderMoves = () =>
      state.history.map((_step, move) => {
        const destination = move ? `Go to move #${move}` : "Go to Start";
        return (
            <li key={move}>
              <button onClick={() => jumpTo(move)}>{destination}</button>
            </li>
        );
      });

  return (
      <>
        <h1>React Tic Tac Toe</h1>
        <Board squares={state.history[state.stepNumber].squares} onClick={handleClick} />
        <div className="info-wrapper">
          <div>
            <h3>History</h3>
            {renderMoves()}
          </div>
          <h3>{winner ? "Winner: " + winner : "Next Player: " + xO}</h3>
        </div>
      </>
  );
};

export default Game;