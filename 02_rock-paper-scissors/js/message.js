const messagesCollection = db.collection('messages');

messageObseve = () => {
  messagesCollection.orderBy('created').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        let li = document.createElement('li');
        const data = change.doc.data();
        li.innerHTML = '<span>' + data.name + '</span>' + '<br>' + ' &emsp;' + data.message;
        messageResults.prepend(li);
      }
    })
  }, error => { })
}



message.addEventListener('keydown', e => {
  // Submit方法 (command + enter) or (ctrl + enter)
  if (((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) && e.keyCode === 13) {

    e.preventDefault();

    if (!message.value || !name.value) {
      return;
    }

    messagesCollection.add({
      created: firebase.firestore.FieldValue.serverTimestamp(),
      user: me,
      name: name.value,
      message: message.value
    })
      // サクセス時の処理
      .then(doc => {
        console.log(`${doc.id} added!`);
        message.value = '';
      })
      // エラー時の処理
      .catch(e => {
        console.error(e);
      })
  }
})
