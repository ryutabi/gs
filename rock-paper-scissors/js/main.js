// 初期画面 スタートボタンでログイン
const startSubmit = document.getElementById('startSubmit');
const login = document.getElementById('login');
// 入室画面
const roomContainer = document.getElementById('roomContainer');
const enterRoom = document.getElementById('enterRoom');
const inputRoomNum = document.getElementById('inputRoomNum');
const errorMessage = document.getElementById('errorMessage');
// インフォメーション
const navInfoContainer = document.getElementById('navInfoContainer');
const navInfo = document.getElementById('navInfo');
const room = document.getElementById('room');
const name = document.getElementById('name');
const againBtn = document.getElementById('againBtn');
// じゃんけんゲーム画面
const jyankenContainer = document.getElementById('jyankenContainer');
const selectedMyHand = document.getElementById('selectedMyHand');
const selectedEnemyHand = document.getElementById('selectedEnemyHand');
const fieldMessage = document.getElementById('fieldMessage');
const selectField = document.getElementById('selectField');

// じゃんけんハンド
const hands = ['✊', '🖐', '✌️'];
const handsWord = ['グー', 'パー', 'チョキ'];

// グローバル変数
let roomNum; // 部屋番号
let myName; // 名前
let myHandNum; // 自分のハンド番号
let enemyHandNum; // 相手のハンド番号
let shuffleId;
let shuffleSpeed = 500;
let isReady = false; // 自分の手を選択したかどうか
let existFriend = false; // 友達がいるかどうか
let messageList; // 結果のメッセージ
let logoutId;

// 初期化（handの作成）
window.onload = () => {
  hands.forEach((hand, key) => {
    const item = document.createElement('div');
    item.className = 'hand';
    item.textContent = hand;
    item.id = key;
    item.onclick = click;
    selectField.appendChild(item);
  });
  auth.signOut();
};

handsShuffle = () => {
  shuffleId = setInterval(() => {
    const n = Math.floor(Math.random() * hands.length);
    selectedEnemyHand.textContent = hands[n];
  }, shuffleSpeed);
}

judgeMessage = () => {
  fieldMessage.textContent = 'じゃんけんぽん！！'
  fieldMessage.classList.remove('waiting');
  clearInterval(shuffleId);
  shuffleSpeed = 10;
  handsShuffle();
  setTimeout(judge, 1500);
}

again = () => {
  againBtn.classList.add('hidden');
  document.querySelectorAll('.hand').forEach(el => {
    el.classList.remove('selected');
  });
  shuffleSpeed = 500;
  handsShuffle();
  fieldMessage.textContent = 'なに出す？';
  isReady = false;
}

oneMore = () => {
  again();
}

resultMessage = () => {
  fieldMessage.textContent = messageList[enemyHandNum];
  selectedEnemyHand.textContent = hands[enemyHandNum];
}

varReset = () => {
  myHandNum = '';
  enemyHandNum = '';
}


// じゃんけんの判定関数
judge = () => {
  clearInterval(shuffleId); // シャッフルを止める

  if (myHandNum === enemyHandNum) { // あいこだった時
    setTimeout(again, 1500);
  } else {                          // それ以外
    clearInterval(shuffleId);
    againBtn.classList.remove('hidden');
  }

  if (myHandNum === '0') {
    messageList = {
      0: 'あいこ！',
      1: '負けちゃった...',
      2: '勝ったよ！！'
    }
    resultMessage();
    varReset();
  }
  if (myHandNum === '1') {
    messageList = {
      0: '勝ったよ！！',
      1: 'あいこ！',
      2: '負けちゃった...'
    }
    resultMessage();
    varReset();
  }
  if (myHandNum === '2') {
    messageList = {
      0: '負けちゃった...',
      1: '勝ったよ！！',
      2: 'あいこ！'
    }
    resultMessage();
    varReset();
  }

}

