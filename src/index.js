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

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      histry: [{
        squares: Array(9).fill(null),
        number:0        
      }],
      stepNumber:0,
      xIsNext: true,    
      selectedSquare:{}
    }
  }

  handleClick(i) {
    const histry = this.state.histry.slice(0, this.state.stepNumber+1);
    const current = histry[histry.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      histry: [...histry,{squares: squares,number:i}],
      stepNumber: histry.length,
      xIsNext: !this.state.xIsNext,
      
    });
  }

  jumpTo(step) {

     this.setState({
      stepNumber:step,
      xIsNext: (step % 2)===0     
      });

    this.selectBold(step);
  }

  selectBold(step)
  {
    let selected={}
    selected[step]= this.state.selectedSquare[step]="selected"
    this.setState ({selectedSquare:selected23})
  }

 
  //Task 2 :Bold the currently selected item in the move list.
  render() {
    const histry = this.state.histry;
    const current = histry[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const number=3;
    
    
    const moves = histry.map((step,move) => {
      const desc = move ?
        'Go to move #' + move + ' ('+Math.floor(histry[move].number/number)+","+histry[move].number%3+')':
        'Go to game start';
        const selected=this.state.selectedSquare[move];
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