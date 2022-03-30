import React, { useState } from "react";
import { calculateWinner } from "../helper";
import Board from "./Board";

const Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXisNext] = useState(true);
  const winner = calculateWinner(history[stepNumber]);
  const xO = xIsNext ? "X" : "O";
  const [board, setboard] = useState(Array(3).fill(Array(3).fill("-")));
  let move = {
    row: 0,
    col: 0
  }

  const player = 'O'
  const bot = 'X'

  const isMovesLeft = (board) => {
    for (let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        if(board[i][j] == null){
          return true;
        }
        return false;
      }
    }
  }

  const evaluate = (board) =>{
    for(let row = 0; row < 3; row++){
      if(board[row][0] === board[row][1] && board[row][1] === board[row][2]){
        if(board[row][0] === player){
          return 10
        }else if(board[row][0] === bot){
          return -10
        }
      }
    }
    for (let col = 0; col < 3; col++){
      if(board[0][col] === board[1][col] && board[1][col] === board[2][col]){
        if(board[0][col] === player){
          return 10
        } else if(board[0][col] === bot){
          return -10
        }
      }
    }

    if(board[0][0] === board[1][1] && board[1][1] === board[2][2]){
      if(board[0][2] === player){
        return 10
      }else if(board[0][0] === bot){
        return -10
      }
    }

    if(board[0][2] === board[1][1] && board[1][1] === board[2][2]){
      if(board[0][0] === player){
        return 10
      }else if(board[0][2] === bot){
        return -10
      }
    }

    return 0
  }

  const minmax = (board, depth, isMax) =>{
    let score = evaluate(board)
    //maximizer wins
    if(score === 10){
      return score
    }
    if(score === -10){
      return score
    }

    if(isMovesLeft(board) === false){
      return 0;
    }

    if(isMax){
      let best = -1000

      for (let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
          if(board[i][j] === '-'){
            board[i][j] = player;
            best = Math.max(best, minmax(board, depth + 1, !isMax))
            board[i][j] = '-'
          }
        }
      }
      return best;
    }else{
      let best = 1000
      for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
          if(board[i][j] === '-'){
            if(board[i][j] !=== player){
              board[i][j] = bot
              best = Math.min(best, minmax(board, depth + 1, !isMax))
              board[i][j] = '-'
            }
          }
        }
      }
      return best
    }
  }

  const findBestMove = (board) => {
    let bestVal = -100;
    move = {
      row: -1,
      col: -1
    }
    for (let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        if(board[i][j] === '-'){
          board[i][j] = player
          let moveVal = minmax(board, 0, false)
          board[i][j] = '-'
          if(moveVal > bestVal){
            move = {
              row: i+1,
              col: j+1
            }
            bestVal = moveVal
          }
        }
      }
    }
    console.log("Row: " + move.row + " Col: " + move.col)
    return move
  }

  const handleClick = (i) => {
    let historyPoint = history.slice(0, stepNumber + 1);
    let current = historyPoint[stepNumber];
    let squares = [...current];
    // return if won or occupied
    if (winner || squares[i]) return;
    // select square
    let tmpBoard = board.map(e => e.slice())
    if(i < 3){
      tmpBoard[0][i] = "X"
    }else if(i > 5){
      tmpBoard[2][(i-6)] = "X"
    }else if(i >= 3 && i <=5){
      tmpBoard[1][(i-3)] = "X"
    }
    squares[i] = "X";
    let squares2 = [...squares]

    if(xIsNext){
      let tmpPos = 0;

      while (tmpPos === squares2[i]){
        move = findBestMove(tmpBoard)
        tmpPos = move.col * <move className="row"></move>
      }

      if(i < 3){
        tmpBoard[0][tmpPos] = "O"
      }else if(i > 5){
        tmpBoard[2][(tmpPos-6)] = "O"
      }else if(i >= 3 && i <=5){
        tmpBoard[1][(tmpPos-3)] = "O"
      }
      setboard(tmpBoard)
      squares2[tmpPos] = "O";
      setHistory([...historyPoint, squares, squares2]);
      setStepNumber(historyPoint.length + 1);
      console.log(tmpBoard)
    }
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXisNext(step % 2 === 0);
  };

  const renderMoves = () =>
    history.map((_step, move) => {
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
      <Board squares={history[stepNumber]} onClick={handleClick} />
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
