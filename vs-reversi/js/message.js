let publicMessagesCollection;
let roomMessagesCollection;

// ロビーにある公開チャット
lobbyChat = () => {
  publicMessagesCollection = db.collection('messages');
  publicMessagesCollection.orderBy('created').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      if (change.type === 'added') {
        const li = document.createElement('li');
        li.className = 'robby-msg';
        li.innerHTML = `<span>${data.user}</span> ${data.message}`;
        robbyMsgList.appendChild(li);
        robbyMsgList.scrollTop = robbyMsgList.scrollHeight;
      }
    })
  })
}

robbyMsgForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!robbyMsgInput.value) {
    return;
  }

  publicMessagesCollection.add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    user: myName,
    message: robbyMsgInput.value
  })
    .then(doc => {
      // console.log(`${doc.id} added`);
      robbyMsgInput.value = '';
      robbyMsgInput.select();
      robbyMsgList.scrollTop = robbyMsgList.scrollHeight;
    })
    .catch(e => {
      console.error(e);
    });
});


// 部屋限定の非公開チャット
roomChat = () => {
  roomMessagesCollection = db.collection('rooms').doc(`room${roomId}`).collection('messages');
  roomMessagesCollection.orderBy('created').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      if (change.type === 'added') {
        const li = document.createElement('li');
        li.textContent = data.message;
        // 自分のメッセージと他人のメッセージのクラス名分け（三項演算子）
        li.className = data.user === myName ? 'mine' : 'another';
        // if (change.doc.data().user === myName) {
        //   li.className = 'mine';
        // } else {
        //   li.className = 'another';
        // }
        li.classList.add('room-msg')
        gameMsgList.appendChild(li);
        gameMsgList.scrollTop = gameMsgList.scrollHeight;
      }
    });
  });
}

gameMsgForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!gameMsgInput.value) {
    return;
  }

  roomMessagesCollection.add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    user: myName,
    message: gameMsgInput.value
  })
    .then(doc => {
      // console.log(`${doc.id} added`);
      gameMsgInput.value = '';
      gameMsgInput.select();
      gameMsgList.scrollTop = gameMsgList.scrollHeight;
    })
    .catch(e => {
      console.error(e);
    });
});