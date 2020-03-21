const startWrapper = document.getElementById('startWrapper');
const inputBoardSize = document.getElementById('inputBoardSize');

const blackStatus = document.getElementById('blackStatus');
const whiteStatus = document.getElementById('whiteStatus');
const redStatus = document.getElementById('redStatus');
const blueStatus = document.getElementById('blueStatus');

const stateContainer = document.getElementById('stateContainer');
const warState = document.getElementById('warState');
const blackState = document.getElementById('blackState');
const whiteState = document.getElementById('whiteState');
const sumTotal = document.getElementById('sumTotal');
const navMessage = document.getElementById('navMessage');

const black = '<p class="black"></p>';
const white = '<p class="white"></p>';
const red = '<p class="red"></p>';
const blue = '<p class="blue"></p>';

const board = [];
const canPutList = []; // 置けるIDのリスト
const players = [
  {num: 4},
  { color: 'Black', sum: 0, status: '' }, // 1 = black
  { color: 'White', sum: 0, status: '' }, // 2 = white
  { color: 'Red', sum: 0, status: '' }, // 3 = red
  { color: 'Blue', sum: 0, status: '' } // 4 = blue
];

let turn = 1; // ターン数
let wasPassed; // パスしたらtrue
let putCount = 0; // 盤面の石の数
let boardSize; // ボードサイズ
let size;
let directions; // 8方向 => init() で再代入する
let speed = 500;


// 要素の作成（初期化）
init = () => {
  startWrapper.classList.add('hidden');
  stateContainer.classList.remove('hidden');

  players[1].status = blackStatus.value;
  players[2].status = whiteStatus.value;
  players[3].status = redStatus.value;
  players[4].status = blueStatus.value;
  if (
    players[1].status === 'computer' &&
    players[2].status === 'computer' &&
    players[3].status === 'computer' &&
    players[4].status === 'computer' 
  ) {
    speed = 10;
    navMessage.classList.add('hidden');
  }
  boardSize = inputBoardSize.value * 1;
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
  const table = document.createElement('table');
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
  document.body.prepend(table);

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


// 配列 board を参照して、ボードを再作成（1 = black, 2 = white）
checkBoard = () => {
  // 数値をリセット（しないと数が累積される）
  players[1].sum = 0;
  players[2].sum = 0;
  players[3].sum = 0;
  players[4].sum = 0;
  putCount = 0;
  canPutList.length = 0;

  // 全てのセルをチェックして、 1:黒, 2:白, 3: 赤, 4: 青 を置く
  for (let i = 0; i < board.length; i++) {
    const cell = document.getElementById(i);
    cell.classList.remove('put-nav');

    if (board[i] === 1) {
      cell.innerHTML = black; // 黒にする
      players[1].sum++;
      putCount++;
    } else if (board[i] === 2) {
      cell.innerHTML = white; // 白にする
      players[2].sum++;
      putCount++;
    } else if (board[i] === 3) {
      cell.innerHTML = red; // 赤にする
      players[3].sum++;
      putCount++;
    } else if (board[i] === 4) { // 青にする
      cell.innerHTML = blue;
      players[4].sum++;
      putCount++;
    }
  }

  // 現在の戦況
  blackState.style.width = `${players[1].sum / putCount * 100}%`;
  whiteState.style.width = `${players[2].sum / putCount * 100}%`;
  redState.style.width = `${players[3].sum / putCount * 100}%`;
  blueState.style.width = `${players[4].sum / putCount * 100}%`;

  navMessage.textContent = `Turn is "${players[colorNum()].color}"`;

  if (putCount === boardSize * boardSize) {
    gameSet();
    console.log('game set');
    return;
  }

  // 置ける場所があるか確認
  canTurnOver();

  // 置けるところがなかった時、パスする
  if (canPutList.length === 0) {
    if (players[colorNum()].status === 'player') {
      alert(`${players[colorNum()].color}は置けるところがありません。\nパスします。`);
    }
    if (wasPassed) {
      gameSet();
      return;
    }
    wasPassed = true;
    turn++;
    navMessage.textContent = `Turn is "${players[colorNum()].color}"`;
    return checkBoard();
  }

  // コンピューターだったら、自動で置く
  if (players[colorNum()].status === 'computer') {
    setTimeout(autoPlay, speed);
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
  const total = [players[1].sum, players[2].sum, players[3].sum, players[4].sum];
  const maxSum = Math.max(...total);
  let wonColorIndex;

  const wonSum = total.filter((num, i)=> {
    if (num === maxSum) {
      wonColorIndex = i + 1;
      return num;
    }
  });

  // 1位の結果を表示
  navMessage.textContent = `Winner is ${players[wonColorIndex].color}!!`;
  resuletMessage();

  // 同率1位になった時、Draw
  if (wonSum.length > 1) {
    navMessage.textContent = 'Draw';
    navMessage.style.color = '#000';
    navMessage.style.fontSize = '2rem';
  }

}

resuletMessage = () => {
  sumTotal.classList.remove('hidden');
  sumTotal.innerHTML = 
  `黒: ${players[1].sum} &emsp; 白: ${players[2].sum}<br>
   赤: ${players[3].sum} &emsp; 青: ${players[4].sum}`;
  navMessage.style.color = '#ff0000';
  navMessage.style.fontSize = '2rem';
}


// オートプレイ
autoPlay = () => {
  const setPutList = [...new Set(canPutList)];
  const num = Math.floor(Math.random() * setPutList.length);

  const flipList = []; // 裏返るIDリスト

  // ボードの状態を確認
  exploreBoard(setPutList[num], flipList);
  flipList.forEach(c => {
    board[c] = colorNum();
  })
  board[setPutList[num]] = colorNum();
  wasPassed = false;
  turn++;
  checkBoard();
}

