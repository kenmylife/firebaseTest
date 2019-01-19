let auth = firebase.auth();
let provider = new firebase.auth.FacebookAuthProvider(); //創造一個登入服務物件
provider.addScope("user_birthday"); //要求的內容

let currentUser = null; //儲存使用者資料

//當使用者的登入狀態變化的時侯，執行我們的程式
auth.onAuthStateChanged(function(user) {
  let member = document.getElementById("member");
  let welcome = document.getElementById("welcome");
  member.style.display = "none";
  welcome.style.display = "none";
  if (user) {
    //使用者登入
    currentUser = user; //給定使用者資料
    console.log(user);
    member.style.display = "block";
  } else {
    //使用者登出
    console.log(user);
    welcome.style.display = "block";
  }
});

//觸動介面後，執行我們創的signIn函式，執行後會跑firebase提供的登入服務
function signIn() {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {})
    .catch(function(error) {});
}
let db = firebase.database();

function post() {
  let id = currentUser.uid;
  let name = currentUser.displayName;
  let content = document.getElementById("content");
  //加入資料庫
  let ref = db.ref("./message");
  ref.push(
    { id: id, name: name, content: content, time: Date.now() }, //Date.now()另一種取得時間的方式
    function(error) {
      if (error) {
        alert(error);
      } else {
        alert("ok");
      }
    }
  );
}
