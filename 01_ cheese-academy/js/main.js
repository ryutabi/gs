// jsを記述する際はここに記載していく
{
  
  const originPass = [49, 50, 51]; // 123
  // const originPass = [67, 72, 69, 69, 83, 69, 65, 67, 65, 68, 69, 77, 89]; // cheeseacademy
  let enterPass = []; 


  window.addEventListener('keyup', (e)=> {
    console.log(e.keyCode);
    enterPass.push(e.keyCode);
    for (let i = 0; i < enterPass.length; i++) {
      if (originPass[i] !== enterPass[i]) {
        enterPass = [];
    } 
    }

    if (originPass.length === enterPass.length) {
      const con = confirm('シークレットページに移動しますか？');
      if (con) {
        $('.wrapper').fadeOut(2000, () => {
          window.location.href= 'secret/secret.html';
        });
      } else {
        enterPass = [];
      }
    }
  });

}