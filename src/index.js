import React from "react";
import ReactDOM from "react-dom";
import "./index.css"; // ローカルファイル読み込み

// React では、イベントを表す props には on[Event] という名前
// イベントを処理するメソッドには handle[Event] という名前
// を付けるのが慣習となっている

const Square = props => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

/*  Board  */
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    };
  }

  handleClick = index => {
    // 配列のコピーを作成してから、コピーした配列を書き換える(immutability)
    const newSquares = this.state.squares.slice();

    // 勝者が決まってるかどうかをチェック
    if (calculateWinner(newSquares) || newSquares[index]) return;

    newSquares[index] = this.state.xIsNext ? "X" : "◯";
    this.setState({
      squares: newSquares,
      xIsNext: !this.state.xIsNext
    });
  };

  renderSquare(i) {
    return (
      // Square に対して "value", "onClick" を渡す
      <Square
        value={this.state.squares[i]}
        // Reactがクリックに対してイベントリスナを設定 => Square クラスへ。
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "◯");
    }

    return (
      <div>
        <div className="status">{status}</div>
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

/*  Game  */
class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

const calculateWinner = squares => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let result = null;
  lines.forEach((val, i) => {
    const [a, b, c] = val;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // "X" or "◯" を代入
      result = squares[a];
    }
  });

  return result;
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
