setMyLocation = (_lat, _lon) => {
  locationsCollection = db.collection('users');
  locationsCollection.doc(`${me}`).set({
    created: firebase.firestore.FieldValue.serverTimestamp(),
    user: me,
    name: name,
    lat: _lat,
    lon: _lon
  })
}