const auth = firebase.auth();
let me;
let shortedId;
let roomUsersCollection;


authObserve = () => {
  roomUsersCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      if (data.uid !== me) {
        alert(` ${data.name} が遊びに来たよ！`);
        existFriend = true;
        fieldMessage.textContent = 'なに出す？';
        fieldMessage.classList.remove('waiting');
        handsShuffle();
      }
    });
  });
}

authLogin = () => {
  auth.signInAnonymously();
  startSubmit.className = 'hidden';
  roomContainer.classList.remove('hidden');
}

authLogout = () => {
  auth.signOut();
  window.location.reload();
}

logOut = () => {
  const conf = confirm('本当にやめる？');
  if (conf) {
    authLogout();
  }
}


// ログインした時の処理
auth.onAuthStateChanged(user => {
  // ログインしている場合
  if (user) {
    me = user.uid;
    shortedId = me.substr(0, 5);
    myName = login.value;
    if (login.value === '') {
      myName = shortedId;
    }
    // console.log(`${shortedId}: ログイン中`);
    return;
  }
  // ログアウトしている場合
  me = null;
  // console.log('ログアウトしています');

});

// 名前を入力してログインする
startSubmit.addEventListener('submit', (e) => {
  e.preventDefault(); // ページ遷移をさせない

  authLogin();

});


showRoom = () => {
  // 名前・部屋番号を表示
  name.textContent = `名前: ${myName}`;
  room.textContent = `部屋: ${roomNum}`;
  // 要素の表示・非表示
  roomContainer.classList.add('hidden');
  navInfoContainer.classList.remove('hidden');
  jyankenContainer.classList.remove('hidden');
}



// 新しく部屋を作って入室する
createNewRoom = () => {

  // // 部屋番号を生成
  const n = '' + Math.floor(Math.random() * 10000); // 0~9999
  const num = n.padStart(4, '0'); // 4ケタのランダム数字

  // グローバル変数に代入
  roomNum = num;

  // firebase に コレクション「rooms」、ドキュメント「room(num) 」を作成
  roomUsersCollection = db.collection('rooms').doc(`room${roomNum}`).collection('users');
  roomUsersCollection.get()
    .then(doc => {
      if (doc.host) { // host がすでにいる場合 return
        return;
      }

      showRoom();

      roomUsersCollection.doc('host').set({ // 「room(num)」にドキュメント「host」を作成
        uid: me,
        name: myName
      });
      authObserve();
      handsObserve();
    })
    .catch(e => {
      // console.error(e);
    });
}



// 部屋番号を指定して入室する
enterRoom.addEventListener('submit', e => {
  e.preventDefault(); // ページ遷移をさせない

  // 入力した部屋番号
  const inputRoomNum = document.getElementById('inputRoomNum').value;
  // グローバル変数に代入
  roomNum = inputRoomNum;

  // firebase に コレクション「rooms」、ドキュメント「room(inputRoomNum)」を作成
  roomUsersCollection = db.collection('rooms').doc(`room${inputRoomNum}`).collection('users');

  roomUsersCollection.get()
    .then(doc => {
      if (doc.docs.length >= 2) { // host, guest 共にいる場合は return
        errorMessage.textContent = `部屋: ${inputRoomNum}はいっぱいだよ`;
        return;
      }

      existFriend = true;

      showRoom();

      // fieldMessage 変更
      fieldMessage.textContent = 'なに出す？';
      fieldMessage.classList.remove('waiting');

      roomUsersCollection.doc('guest').set({
        uid: me,
        name: myName
      });
      handsShuffle();
      handsObserve();
    })
    .catch(e => {
      // console.error(e);
    });
});


// add() doc('~').set() は同じ挙動なので使い分けよう！
// add() は ドキュメント名がランダムの英数字
// doc('~').set() はドキュメント名が ~ の部分で指定可能

// // サクセス時の処理
// .then(doc => {
//   console.log(`${doc.id} added!`);
// })
// // エラー時の処理
// .catch(e => {
//   console.error(e);
// })