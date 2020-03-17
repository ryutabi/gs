const colors = [
  {},
  { textHtml: '<p class="color white"></p>', sum: 0 }, // 白
  { textHtml: '<p class="color black"></p>', sum: 0 }, // 黒
  { textHtml: '<p class="color red"></p>', sum: 0 }, // 赤
  { textHtml: '<p class="color blue"></p>', sum: 0 }, // 青
  { textHtml: '<p class="color green"></p>', sum: 0 }, // 緑
  { textHtml: '<p class="color yellow"></p>', sum: 0 }, // 黄
  { textHtml: '<p class="color pink"></p>', sum: 0 }, // 桃
  { textHtml: '<p class="color sky"></p>', sum: 0 }, // 空
  { textHtml: '<p class="color orange"></p>', sum: 0 }, // 橙
  { textHtml: '<p class="color purple"></p>', sum: 0 }, // 紫
]; 



const board = [];
const canPutList = []; // 置けるIDのリスト

let turn = 2; // ターン数
let wasPassed; // パスしたらtrue
let putCount = 1; // 盤面の石の数
let boardSize; // ボードサイズ
let size;
let directions; // 8方向 => init() で再代入する
let speed = 10;


// 要素の作成（初期化）
init = s => {
  boardSize = s;
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
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  document.body.prepend(table);

  // 初期配置
  board[num + size] = 1;
  checkBoard();

}


// 配列 board を参照して、ボードを再作成
checkBoard = () => {
  canPutList.length = 0;

  // 全てのセルをチェックして、 colors の色に変える
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      continue;
    }
    const cell = document.getElementById(i);
    const cellState = colors[board[i]];
    cell.innerHTML = cellState.textHtml;
    cellState.sum++;
  }

  if (putCount === boardSize * boardSize) {
    console.log('お絵かき終わり');
    return;
  }

  canTurnOver();
  setTimeout(draw, speed);

}


// ターンの管理
colorNum = () => {
  let n = turn / (colors.length - 1);
  const num = Number(String(n.toFixed(1)).slice(-1));
  return num === 0 ? 10 : num
}


// オートプレイ
draw = () => {
  const setPutList = [...new Set(canPutList)];
  const num = Math.floor(Math.random() * setPutList.length);

  const flipList = [];

  // ボードの状態を確認
  exploreBoard(setPutList[num], flipList);
  flipList.forEach(c => {
    board[c] = colorNum();
  })
  board[setPutList[num]] = colorNum();
  putCount++;
  wasPassed = false;
  turn++;
  checkBoard();
}