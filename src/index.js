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
  renderSquare(i) {
    return (
      // Square に対して "value", "onClick" を渡す
      <Square
        value={this.props.squares[i]}
        // Reactがクリックに対してイベントリスナを設定 => Square クラスへ。
        onClick={() => this.props.onClick(i)}
      />
    );
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

/*  Game  */
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true
    };
  }
  handleClick = index => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // 配列のコピーを作成してから、コピーした配列を書き換える(immutability)
    const newSquares = current.squares.slice();

    // 勝者が決まってるかどうかをチェック
    if (calculateWinner(newSquares) || newSquares[index]) return;

    newSquares[index] = this.state.xIsNext ? "🐱" : "🐭";
    this.setState({
      history: history.concat([
        {
          squares: newSquares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  };
  jumpTo = step => {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((state, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "🐱" : "🐭");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
      // "🐱" or "🐭" を代入
      result = squares[a];
    }
  });

  return result;
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// =======
// Next Step
// 1. 履歴内のそれぞれの着手の位置を(col, row) というフォーマットで表示する。
// 2. 着手履歴のリスト中で現在選択されているアイテムをボールドにする。
// 3. Board でマス目を並べる部分を、ハードコーディングではなく 2 つのループを使用するように書き換える。
// 4. 着手履歴のリストを昇順・降順いずれでも並べかえられるよう、トグルボタンを追加する。
// 5. どちらかが勝利した際に、勝利につながった 3 つのマス目をハイライトする。
// 6. どちらも勝利しなかった場合、結果が引き分けになったというメッセージを表示する。
// 7. スタートする順番を選べるようにする
// 8. アイコンを選べるようにする
// 9. スタイルをかっこよくする
// 10. 勝った時にアニメーションをつける
// =======
