const auth = firebase.auth();
let me;
let myNumber;
let shortedId;
let roomUsersCollection;


authObserve = () => {
  roomUsersCollection.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {

      if (isExist_4_friends) {
        return;
      }

      const friendsNum = snapshot.docs.length;
      const moreFriends = players[0].num - friendsNum;
      const data = change.doc.data();

      if (myNumber < data.number) {
        alert(` ${data.name} entered.`);
        nowMax.textContent = `Players ${friendsNum}/${players[0].num}`;
        howMany.textContent = `${moreFriends} more...`;
      }

      if (friendsNum === players[0].num) {
        isExist_4_friends = true;
        recruitingContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        robbyContainer.classList.add('hidden');
        alert('Players gathered.\nThe game is ready.');
      }
      
    });
  });
}


authLogin = () => {
  auth.signInAnonymously();
  loginForm.classList.add('hidden');
  loader.classList.remove('hidden');
}
authLogout = () => {
  auth.signOut();
  window.location.reload();
}

auth.onAuthStateChanged(user => {
  if (user) {
    me = user.uid;
    shortedId = me.substr(0, 5);

    myName = login.value;
    if (!login.value) {
      myName = shortedId;
    }

    console.log(`${shortedId} ログイン!!`);
    lobbyChat();
    loader.classList.add('hidden');
    robbyContainer.classList.remove('hidden');
    infoContainer.classList.remove('hidden');
    robbyMsgList.scrollTop = robbyMsgList.scrollHeight;
    return;
  }
  me = null;
  console.log('ログアウト!!');
});


loginForm.addEventListener('submit', e => {
  e.preventDefault();
  authLogin();
});

logout.addEventListener('click', () => {
  authLogout();
});


showRoomInfo = () => {
  room.textContent = `Room: ${roomId}`;
  name.textContent = `Name: ${myName}`;
}

recruitingInfo = n => {
  const more = players[0].num - n;
  nowMax.textContent = `Players ${n}/${players[0].num}`;
  howMany.textContent = `${more} more...`;
}

enteredRoom = () => {
  roomContainer.classList.add('no-visibility');
  createRoom.classList.add('hidden');
}



// 新しく部屋を作成
createNewRoom = () => {
  enteredRoom();

  const n = '' + Math.floor(Math.random() * 10000);
  const num = n.padStart(4, '0');
  roomId = num;

  roomUsersCollection = db.collection('rooms').doc(`room${roomId}`).collection('users');
  roomUsersCollection.get()
  .then(doc => {
    const leng = doc.docs.length;
    myNumber = Number(leng + 1);
    if (leng) {
      return;
    }

    roomUsersCollection.doc(`host${me}`).set({
      uid: me,
      name: myName,
      number: myNumber
    });

    selectSizeContainer.classList.remove('hidden');

    myColor = players[myNumber].color;
    recruitingInfo(myNumber);
    showRoomInfo();
    authObserve();
    roomChat();
    gameReady();

  })
  .catch(e => {
    console.error(e);
  });
}


// 部屋を指定して入室
enterRoom.addEventListener('submit', e => {
  e.preventDefault();

  enteredRoom();

  const inputRoomId = document.getElementById('inputRoomId').value;
  roomId = inputRoomId;

  roomUsersCollection = db.collection('rooms').doc(`room${roomId}`).collection('users');
  roomUsersCollection.get()
  .then(doc => {
    const leng = doc.docs.length;
    myNumber = Number(leng + 1);
    if (leng === 4) { // 4人専用部屋なので、すでに4人いたらエラーを返す
      errorMessage.innerHTML = `Room: ${roomId} is full.`;
      return;
    }
    
    // ユーザーがいない時、host として入室
    if (!leng) {
      roomUsersCollection.doc(`host${me}`).set({
        uid: me,
        name: myName,
        number: myNumber
      });
      selectSizeContainer.classList.remove('hidden');
    }

    // すでに誰かいる場合、guest として入室
    if (leng >= 1) {
      roomUsersCollection.doc(`guest${me}`).set({
        uid: me,
        name: myName,
        number: myNumber
      });
    }

    myColor = players[myNumber].color;
    recruitingInfo(myNumber);
    showRoomInfo();
    authObserve();
    roomChat();
    gameReady();

  })
  .catch(e => {
    console.error(e);
  });
});
