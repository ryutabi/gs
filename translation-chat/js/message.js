let messagesCollection;

openChat = () => {
  messagesCollection = db.collection('messages');
  messagesCollection.orderBy('created').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      const data = change.doc.data();
      if (change.type === 'added') {
        const li = document.createElement('li');
        li.className = data.user === me ? 'mine-msg' : 'another-msg';
        const p = document.createElement('p');
        p.className = data.user === me ? 'mine' : 'another';
        p.classList.add('msg');
        p.lang = data.lang;
        p.textContent = data.message;
        p.onclick = readText;

        li.appendChild(p);
        messagesList.appendChild(li);
        messagesList.scrollTop = messagesList.scrollHeight;
      }
    });
  });
}

addMessage = (txt, lang) => {
  messagesCollection.add({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    user: me,
    message: txt,
    lang: lang
  })
    .then(() => {
      textArea.select();
      messagesList.scrollTop = messagesList.scrollHeight;
    })
    .catch(e => {
      console.error(e);
    });
}