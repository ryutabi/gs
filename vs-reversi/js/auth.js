const auth = firebase.auth();
let me;
let shortedId;
let roomUsersCollection;


authObserve = () => {
  roomUsersCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      if (data.uid !== me) {
        alert(` ${data.name} entered`);
        gameContainer.classList.remove('hidden');
        robbyContainer.classList.add('hidden');
        isExistFriend = true;
      }
    });
  });
}


authLogin = () => {
  auth.signInAnonymously();
}
authLogout = () => {
  auth.signOut();
  window.location.reload();
}

auth.onAuthStateChanged(user => {
  if (user) {
    me = user.uid;
    shortedId = me.substr(0, 5);

    // console.log(`${shortedId} ログイン!!`);
    lobbyChat();
    return;
  }
  me = null;
  // console.log('ログアウト!!');
});


loginForm.addEventListener('submit', e => {
  e.preventDefault();
  myName = login.value;
  if (!login.value) {
    myName = shortedId;
  }
  loginForm.classList.add('hidden');
  robbyContainer.classList.remove('hidden');
  infoContainer.classList.remove('hidden');
  robbyMsgList.scrollTop = robbyMsgList.scrollHeight;
});

logout.addEventListener('click', () => {
  authLogout();
});


showRoomInfo = () => {
  room.textContent = `Room: ${roomId}`;
  name.textContent = `Name: ${myName}`;
}

enterByHost = () => {
  myColor = players[1].color;
  roomContainer.classList.add('no-visibility');
  createRoom.classList.add('hidden');
  selectSizeContainer.classList.remove('hidden');
}


// 新しく部屋を作成
createNewRoom = () => {
  const n = '' + Math.floor(Math.random() * 10000);
  const num = n.padStart(4, '0');
  roomId = num;

  roomUsersCollection = db.collection('rooms').doc(`room${roomId}`).collection('users');
  roomUsersCollection.get()
    .then(doc => {
      if (doc.host) {
        return;
      }
      roomUsersCollection.doc('host').set({
        uid: me,
        name: myName
      });

      enterByHost();

      showRoomInfo();
      authObserve();
      roomChat();
      gameBoard();

    })
    .catch(e => {
      console.error(e);
    });
}


// 部屋を指定して入室
enterRoom.addEventListener('submit', e => {
  e.preventDefault();

  const inputRoomId = document.getElementById('inputRoomId').value;
  roomId = inputRoomId;

  roomUsersCollection = db.collection('rooms').doc(`room${roomId}`).collection('users');
  roomUsersCollection.get()
    .then(doc => {
      if (doc.docs.length >= 2) { // 2人専用部屋なので、すでに2人いたらエラーを返す。
        errorMessage.innerHTML = `Room: ${roomId} is full.`;
        return;
      }

      if (!doc.docs.length) { // ユーザーがいない時、host として入室
        roomUsersCollection.doc('host').set({
          uid: me,
          name: myName
        });
        enterByHost();
        authObserve();
      }
      if (doc.docs.length === 1) { // host がいる時、guest として入室
        roomUsersCollection.doc('guest').set({
          uid: me,
          name: myName
        });
        myColor = players[2].color;
        robbyContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
      }

      showRoomInfo();
      roomChat();
      gameBoard();

    })
    .catch(e => {
      console.error(e);
    });
});