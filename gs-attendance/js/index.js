const select = document.getElementById('studentsId');
const date = document.getElementById('date');
const time = document.getElementById('time');

let json;



// G's LAB7のデータベースにアクセスして、生徒数だけ <option> を追加する
for (let i = 1; i <= 40; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = i;
  select.appendChild(option);
}


clock = () => {
  const weeks = ['Sun','Mon','Thu','Wed','Thr','Fri','Sat'];

  const now = new Date();
  let y = now.getFullYear();
  let m = now.getMonth() + 1;
  let d = now.getDate();
  let w = weeks[now.getDay()];
  let h = now.getHours();
  let min = now.getMinutes();
  let sec = now.getSeconds();

  if (m < 10) m = '0' + m;
  if (d < 10) d = '0' + d;
  if (h < 10) h = '0' + h;
  if (min < 10) min = '0' + min;
  if (sec < 10) sec = '0' + sec;

  date.textContent = `${y}/${m}/${d}(${w})`;
  time.textContent = `${h}:${min}:${sec}`;
}
clock();
setInterval(clock, 1000);






const xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4 && xhr.status === 200) {
    json = JSON.parse(xhr.responseText);
  } 
}
xhr.open('GET', '../json/lab7.json');
xhr.send();


searchJson = () => {
  const id = Number(select.value);
  json.find(val => {
    if (val.id === id) {
      console.log(val.name);
    }
  })
}