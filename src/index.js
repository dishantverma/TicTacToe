import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );

}

class Board extends React.Component {

  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => { this.props.onClick(i) }}
    />;
  }

  createBoard() {
    let table = []
    for (let i = 0; i < 9; i = i + 3) {
      let children = []
      for (let j = 0; j < 3; j++) {
        children.push(<td>{this.renderSquare(i + j)}</td>)
      }
      table.push(<tr className="board-row" >{children}</tr>)
    }
    return table;
  }


  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        number: 0
      }],
      stepNumber: 0,
      xIsNext: true,
      selectedSquare: {}
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: [...history, { squares: squares, number: i }],
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,

    });
  }

  jumpTo(step) {

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });

    this.selectBold(step);
  }

  selectBold(step) {
    let selected = {}
    selected[step] = this.state.selectedSquare[step] = "selected"
    this.setState({ selectedSquare: selected })
  }


  //Task 2 :Bold the currently selected item in the move list.
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const number = 3;


    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + Math.floor(history[move].number / number) + "," + history[move].number % 3 + ')' :
        'Go to game start';
      const selected = this.state.selectedSquare[move];
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={selected}>
            {desc}
          </button>
        </li>
      )
    })


    let status
    if (winner) {
      status = 'Winner :' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}>
          </Board>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}