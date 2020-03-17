const stateContainer = document.getElementById('stateContainer');
const warState = document.getElementById('warState');
const blackState = document.getElementById('blackState');
const whiteState = document.getElementById('whiteState');
const redState = document.getElementById('redState');
const blueState = document.getElementById('blueState');
const sumTotal = document.getElementById('sumTotal');
const navMyColor = document.getElementById('navMyColor');
const navMessage = document.getElementById('navMessage');

const black = '<p class="black"></p>';
const white = '<p class="white"></p>';
const red = '<p class="red"></p>';
const blue = '<p class="blue"></p>';

const board = [];
const canPutList = []; // 置けるIDのリスト
const players = [
  {num: 4},
  { color: 'Black', sum: 0 }, // 1 = black
  { color: 'White', sum: 0 }, // 2 = white
  { color: 'Red', sum: 0 }, // 3 = red
  { color: 'Blue', sum: 0 } // 4 = blue
];

let turn; // ターン数
let myColor; // 自分が持つ色
let putCount = 0; // 盤面の石の数
let boardSize; // ボードサイズ
let size;
let directions; // 8方向 => init() で再代入する


// 要素の作成（初期化）
init = () => {
  stateContainer.classList.remove('hidden');

  turn = 1;
  size = boardSize + 2;
  const n = (size / 2) - 1;
  const num = size * n + n;

  directions = [
    (- size - 1), // 左上
    (- size), // 上
    (- size + 1), // 右上
    (- 1), (1), // 左 右
    (size - 1), // 左下
    (size), // 下
    (size + 1) // 右下
  ];

  // 盤面の作成
  const table = document.getElementById('table');
  for (let i = 0; i < size; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < size; j++) {
      const td = document.createElement('td');
      const id = (size * i + j) * 1;
      td.id = id;
      board[id] = 0;
      if (isFrame(id)) {
        td.className = 'frame';
        td.innerHTML = '';
      }
      td.onclick = click;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  // 初期配置
  board[num - size] = 2;
  board[num] = 3;
  board[num + 1] = 2;
  board[num + 2] = 4;
  board[num + size -1] = 3;
  board[num + size] = 1;
  board[num + size + 1] = 4;
  board[num + size + 1 + size] = 1;

  checkBoard();

}


// 配列 board を参照して、ボードを再作成
checkBoard = () => {
  // 数値を初期化
  players[1].sum = 0;
  players[2].sum = 0;
  players[3].sum = 0;
  players[4].sum = 0;
  putCount = 0;
  canPutList.length = 0;

// 全てのセルをチェックして、 1:黒, 2:白, 3: 赤, 4: 青 を置く
  for (let i = 0; i < board.length; i++) {
    const cell = document.getElementById(i);
    cell.classList.remove('can-put__nav');

    switch (board[i]) {
      case 1:
        cell.innerHTML = black;
        players[1].sum++;
        putCount++;
        break;
      case 2:
        cell.innerHTML = white;
        players[2].sum++;
        putCount++;
        break;
      case 3:
        cell.innerHTML = red;
        players[3].sum++;
        putCount++;
        break;
      case 4:
        cell.innerHTML = blue;
        players[4].sum++;
        putCount++;
        break;
    }
  }

  // 現在の戦況
  blackState.style.width = `${players[1].sum / putCount * 100}%`;
  whiteState.style.width = `${players[2].sum / putCount * 100}%`;
  redState.style.width = `${players[3].sum / putCount * 100}%`;
  blueState.style.width = `${players[4].sum / putCount * 100}%`;

  navMyColor.textContent = `Your Color is ${myColor}`;
  navMessage.textContent = players[colorNum()].color === myColor ? 'Your turn' : '';

  if (putCount === boardSize * boardSize) {
    gameSet();
    return;
  }

  // 置ける場所があるか確認
  canTurnOver();

  // 置けるところがなかった時、パスする
  if (canPutList.length === 0) {
    alert(`${players[colorNum()].color}は置けるところがありません。\nパスします。`);
    turn++;
    navMessage.textContent = `Turn is "${players[colorNum()].color}"`;
    return checkBoard();
  }

}


// ターンの管理
colorNum = () => {
  const n = turn / players[0].num;
  const num = n.toFixed(2).slice(-2);

  switch (num) {
    case '25':
      return 1;
      break;
    case '50':
      return 2
      break;
    case '75':
      return 3
      break;
    case '00':
      return 4
      break;
  }
}


// ゲームが終わるときの処理
gameSet = () => {
  navMessage.classList.remove('hidden');
  const totalSums = [players[1].sum, players[2].sum, players[3].sum, players[4].sum];
  const maxSum = Math.max(...totalSums);
  let winColorIndex;

  const winSum = totalSums.filter((num, i)=> {
    if (num === maxSum) {
      winColorIndex = i + 1;
      return num;
    }
  });

  // 1位の結果を表示
  navMessage.textContent = `Winner is ${players[winColorIndex].color}!!`;
  resuletMessage();

  // 同率1位になった時、Draw
  if (winSum.length > 1) {
    navMessage.textContent = 'Draw';
    navMessage.classList.add('draw');
  }

  againBtn.classList.remove('hidden');

}

resuletMessage = () => {
  sumTotal.classList.remove('hidden');
  sumTotal.innerHTML = 
  `黒: ${players[1].sum} &emsp; 白: ${players[2].sum}<br>
   赤: ${players[3].sum} &emsp; 青: ${players[4].sum}`;
   navMessage.classList.add('win');
  }


// 置ける場所があるか確認
canTurnOver = () => {
  board.forEach((_, x) => {
    if (board[x] !== 0 || isFrame(x)) {
      return;
    }
    // ボードの状態を確認
    exploreBoard(x);
  });

  if (players[colorNum()].sum === 0) {
    board.forEach((_, x) => {
      if (board[x] !== 0 || isFrame(x)) {
        return;
      }
      // 救済処理
      comeBackBoard(x);
    });
  }

  // 置けるところをナビ
  if (players[colorNum()].color === myColor) {
    canPutList.forEach(can => {
      const canPutCell = document.getElementById(can);
      canPutCell.classList.add('can-put__nav');
    })
  }
}


// ボードの状態を確認する（重要！）
exploreBoard = (id, list) => {
  // 隣接する8方向確認する
  directions.forEach(dir => {
    const targetId = id + dir; // チェックするID
    const targetCell = board[targetId]; // チェックするピースの状態

    if (targetCell && targetCell !== colorNum()) { // ブランクではなくて、自分の色でもない場合
      // あったらその先をチェックする
      for (let i = 1; i < size; i++) {
        const nextTargetId = targetId + dir * i;
        if (!board[nextTargetId] || isFrame(nextTargetId)) { // ブランク、もしくは端ならば return
          return;
        }
        if (board[nextTargetId] === colorNum()) {
          let j = 0;
          while (board[targetId + dir * j] !== colorNum()) {
            if (list) { // クリックの時（第2引数あり）
              list.push(targetId + dir * j);
              j++;
            } else { // 置ける場所を返す
              canPutList.push(id);
              j++;
            }
          }
        }
      }
    }
  });
}


comeBackBoard = id => {
  directions.forEach(dir => {
    const targetId = id + dir; // チェックするID
    const targetCell = board[targetId]; // チェックするピースの状態

    if (targetCell && targetCell !== colorNum()) {
      canPutList.push(id);
    }
  });
}


// 端であるかどうか 端なら true を返す
isFrame = id => {
  if (
    size > id ||
    size * (size - 1) <= id ||
    id % size === 0 ||
    id % size === size - 1
  ) {
    return true;
  }
}