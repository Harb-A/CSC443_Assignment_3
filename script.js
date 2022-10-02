/*
Board referencing the indices, this is to keep track of what squares are empty and who played in each square
[0] [1] [2]
[3] [4] [5]
[6] [7] [8]
*/
let board = [];
const me = "Red"; //The player
const computer = "Yellow"; //The AI
const winCases = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], //Matching vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], //Matching horizontal
  [0, 4, 8],
  [6, 4, 2], //Matching diagonal
];
const squares = document.querySelectorAll(".square");

/*
At the start of a game: 
1- Board is set to default indicies
2- Squares must not have circles in them
3- Squares must be listening for clicks
4- Winner text should be empty
*/
const startGame = () => {
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  for (let i = 0; i < squares.length; i++) {
    if (squares[i].classList.contains("Red")) {
      squares[i].classList.remove("Red");
    } else if (squares[i].classList.contains("Yellow")) {
      squares[i].classList.remove("Yellow");
    }

    squares[i].addEventListener("click", squareClick);
  }

  document.querySelector(".text").innerText = "";
};

/*
When you click on a square 2 things happen:
1- You take a turn 
2- AI takes a turn after you, check if there is a tie first you might need to stop the game begore the AI starts
One second delay so the animation ends before the next play can be made
*/
const squareClick = (e) => {
  const squareID = e.target.id;

  play(squareID, me); //You take a turn
  setTimeout(function () {
    if (!checkTie()) {
      play(bestSpot(), computer); //AI takes a turn
    }
  }, 1000); //1 second delay
};
startGame();

/*
When a player plays (makes a move):
1- Update the board with the players name so we can check it later
2- Remove the abilitiy to click on that square since it was played
3- Add the animated class depening on who played (Red is you, Yellow is AI)
4- After you make a move, check if a win scenario has been triggeRed which stops the game and announces the winner
*/
const play = (squareId, player) => {
  board[squareId] = player;

  squares[squareId].removeEventListener("click", squareClick);

  if (player === "Red") {
    document.getElementById(squareId).classList.add("Red");
  } else {
    document.getElementById(squareId).classList.add("Yellow");
  }

  if (checkWin(board, player)) {
    cleanUpSquares();
    changeResult(player + " won !");
  }
};

/*
Returns true if a win scenario has been triggeRed by either player:
No need for check loss scenario since a win for the AI is a loss for you etc
1- Store all the square indices that the player has played so far (plays[])
2- Check if all the elements in one of the arrays of your win scenarios exist in plays[]
*/
const checkWin = (board, player) => {
  let isWin = false;

  let plays = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === player) {
      plays.push(i);
    }
  }

  for (let i = 0; i < winCases.length; i++) {
    if (winCases[i].every((r) => plays.includes(r))) {
      isWin = true;
      break;
    }
  }
  return isWin;
};

//Removes the event listener for all the remaining squares that weren't used
const cleanUpSquares = () => {
  let notUsed = emptySquares();
  for (let i = 0; i < notUsed.length; i++) {
    squares[notUsed[i]].removeEventListener("click", squareClick);
  }
};

//Update the result of the game win/tie/loss
const changeResult = (result) =>
  (document.querySelector(".text").innerText = result);

//What squars on the board havent been played yet
const emptySquares = () => board.filter((i) => typeof i == "number");

//Calls minimax function to get the squareID for the AI
const bestSpot = () => minimax(board, computer).index;

//If no squares are empty and no win scenario has been triggeRed that means it a tie
const checkTie = () => {
  if (emptySquares().length == 0) {
    changeResult("At least you didn't lose :P");
    return true;
  }
  return false;
};

function minimax(newboard, player) {
  //User win is a -1, AI win is a +1, draw doesnt affect scores
  //User trying to minimize, AI trying to maximize
  let possibilities = emptySquares();

  if (checkWin(newboard, me)) {
    return { score: -1 };
  } else if (checkWin(newboard, computer)) {
    return { score: 1 };
  } else if (possibilities.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  for (let i = 0; i < possibilities.length; i++) {
    let move = {};
    move.index = newboard[possibilities[i]];
    newboard[possibilities[i]] = player;

    if (player == computer) {
      let result = minimax(newboard, me);
      move.score = result.score;
    } else {
      let result = minimax(newboard, computer);
      move.score = result.score;
    }

    newboard[possibilities[i]] = move.index;

    moves.push(move);
  }

  let bestMove;
  if (player === computer) {
    let bestScore = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Number.POSITIVE_INFINITY;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
