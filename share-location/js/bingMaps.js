let locationsCollection;

mapInit = position => {
  loader.classList.add('hidden');
  logoutBtn.classList.remove('hidden');

  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  console.log(lat, lon);

  const map = new Bmap("#myMap");
  map.startMap(lat, lon, "load", 15);
  map.startTracking(true);

  sharingLocation = () => {
    map.pinLayerClear();
    locationsCollection = db.collection('users');
    locationsCollection.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.user !== me) {
          // console.log(data.created.toDate());
          const pin = map.pinLayer(data.lat, data.lon, '#ff0000');
          map.onPin(pin, 'click', e => {
            alert(data.name);
            // console.log(e);
          });          
        }
      })
    })
  }

  sharingLocation();
  setInterval(sharingLocation, 10000); // 10秒毎に更新する 

  setMyLocation(lat, lon);

}

mapError = error => {
  let e = "";
  if (error.code == 1) {
    e = "位置情報が許可されてません";
  }
  if (error.code == 2) {
    e = "現在位置を特定できません";
  }
  if (error.code == 3) {
    e = "位置情報を取得する前にタイムアウトになりました";
  }
  alert("エラー：" + e);
};

const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 3000
};