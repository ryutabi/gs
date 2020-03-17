const startWrapper = document.getElementById('startWrapper');
const inputBoardSize = document.getElementById('inputBoardSize');
const blackStatus = document.getElementById('blackStatus');
const whiteStatus = document.getElementById('whiteStatus');
const stateContainer = document.getElementById('stateContainer');
const warState = document.getElementById('warState');
const blackState = document.getElementById('blackState');
const whiteState = document.getElementById('whiteState');
const sumTotal = document.getElementById('sumTotal');
const navMessage = document.getElementById('navMessage');

const black = '<p class="black"></p>';
const white = '<p class="white"></p>';

const board = [];
const canPutList = []; // 置けるIDのリスト
const players = [
  {},
  { 'color': 'Black', 'sum': 0, 'status': '' }, // 1 = black
  { 'color': 'White', 'sum': 0, 'status': '' }  // 2 = white
];

let turn = 1; // 1: 黒, 2: 白
let wasPassed; // パスしたらtrue
let putCount = 0; // 盤面の石の数
let boardSize; // ボードサイズ
let size;
let directions; // 8方向 => init() で再代入する
let flipFlag; // クリックできるかできないか
let speed = 500;


// 要素の作成（初期化）
init = () => {
  startWrapper.classList.add('hidden');
  stateContainer.classList.remove('hidden');

  players[1].status = blackStatus.value;
  players[2].status = whiteStatus.value;
  if (
    players[1].status === 'computer' &&
    players[2].status === 'computer'
  ) {
    speed = 50;
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
  board[num + 1] = 1;
  board[num + size] = 1;
  board[num] = 2;
  board[num + size + 1] = 2;

  checkBoard();

}


// 配列 board を参照して、ボードを再作成（1 = black, 2 = white）
checkBoard = () => {
  // 数値をリセット（しないと数が累積される）
  players[1].sum = 0;
  players[2].sum = 0;
  putCount = 0;
  canPutList.length = 0;

  // 全てのセルをチェックして、 1だったら黒・2だったら白を置く
  for (let i = 0; i < board.length; i++) {
    const cell = document.getElementById(i);
    cell.classList.remove('can-put__nav');
    if (board[i] === 1) {
      cell.innerHTML = black;
      players[1].sum++;
      putCount++;
    } else if (board[i] === 2) {
      cell.innerHTML = white;
      players[2].sum++;
      putCount++;
    }
  }

  // 現在の戦況
  blackState.style.width = `${players[1].sum / putCount * 100}%`;
  whiteState.style.width = `${players[2].sum / putCount * 100}%`;

  navMessage.textContent = `Turn is "${players[turn].color}"`;

  if (putCount === boardSize * boardSize) {
    gameSet();
    console.log('hoge');
    return;
  }

  // 置ける場所があるか確認
  canTurnOver();

  // 置けるところがなかった時、パスする
  if (canPutList.length === 0) {
    if (players[turn].status === 'player') {
      alert(`${players[turn].color}は置けるところがありません。\nパスします。`);
    }
    if (wasPassed) {
      gameSet();
      console.log('passHoge');
      return;
    }
    wasPassed = true;
    turn = 3 - turn;
    navMessage.textContent = `Turn is "${players[turn].color}"`;
    return checkBoard();
  }

  // コンピューターだったら、自動で置く
  if (players[turn].status === 'computer') {
    setTimeout(autoPlay, speed);
  }

}


// ゲームが終わるときの処理
gameSet = () => {
  navMessage.classList.remove('hidden');

  if (players[1].sum > players[2].sum) {
    navMessage.textContent = `Winner is ${players[1].color}!!`;
    resuletMessage();

  } else if (players[1].sum < players[2].sum) {
    navMessage.textContent = `Winner is ${players[2].color}!!`;
    resuletMessage();
  } else { // 引き分け時
    sumTotal.classList.remove('hidden');
    sumTotal.innerHTML = `黒: ${players[1].sum} &emsp; 白: ${players[2].sum}`;
    navMessage.textContent = 'Draw';
    navMessage.style.fontSize = '2rem';
  }

  // パーフェクト時
  if (players[1].sum === 0) {
    navMessage.textContent = `${players[2].color} is Perfect!!`;
    resuletMessage();
  }
  if (players[2].sum === 0) {
    navMessage.textContent = `${players[1].color} is Perfect!!`;
    resuletMessage();
  }
}

resuletMessage = () => {
  sumTotal.classList.remove('hidden');
  sumTotal.innerHTML = `黒: ${players[1].sum} &emsp; 白: ${players[2].sum}`;
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
    board[c] = turn;
  })
  board[setPutList[num]] = turn;
  wasPassed = false;
  turn = 3 - turn;
  checkBoard();
  flipFlag = false;
}
