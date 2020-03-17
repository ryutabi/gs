// ログインフォーム
const loginForm = document.getElementById('loginForm');
const login = document.getElementById('login');
// ロビー
const robbyContainer = document.getElementById('robbyContainer');
const roomContainer = document.getElementById('roomContainer');
const createRoom = document.getElementById('createRoom');
const enterRoom = document.getElementById('enterRoom');
// ロビーチャット
const robbyMsgList = document.getElementById('robbyMsgList');
const robbyMsgForm = document.getElementById('robbyMsgForm');
const robbyMsgInput = document.getElementById('robbyMsgInput');
// ルームインフォメーション
const infoContainer = document.getElementById('infoContainer');
const logout = document.getElementById('logout');
const room = document.getElementById('room');
const name = document.getElementById('name');
// セレクトボードサイズ
const selectSizeContainer = document.getElementById('selectSizeContainer');
const selectSize = document.getElementById('selectSize');
const inputBoardSize = document.getElementById('inputBoardSize');
const startBtn = document.getElementById('startBtn');
// ルームチャット
const gameMsgList = document.getElementById('gameMsgList');
const gameMsgForm = document.getElementById('gameMsgForm');
const gameMsgInput = document.getElementById('gameMsgInput');
const gameContainer = document.getElementById('gameContainer');


// グローバル変数
let
  myName,
  roomId,
  isExistFriend = false;

window.onload = () => {
  authLogin();
}