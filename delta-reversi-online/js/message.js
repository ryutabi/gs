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
        li.className = data.color.toLowerCase() + '-msg';
        li.innerHTML = `<span>${data.user}</span> ${data.message}`;
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
    color: myColor,
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