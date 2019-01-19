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
  let content = document.getElementById("content").value;
  //加入資料庫
  let ref = db.ref("/message");
  ref.push(
    { id: id, name: name, content: content, time: Date.now() }, //Date.now()另一種取得時間的方式
    function(error) {
      if (error) {
        alert(error);
      } else {
        document.getElementById("content").value = ""; //發文成功後清空輸入框
        read(); //發文成功的時候，便讀取資料
      }
    }
  );
}

function read() {
  let ref = db.ref("/message");
  ref.once("value", function(snapshots) {
    //注意此snapshots，為複數
    let data = [];
    snapshots.forEach(function(snapshot) {
      //snapshot 物件為firebase包裝後的物件，不只有data還有其他資訊
      let message = snapshot.val(); //取得資料data裝進變數
      message.key = snapshot.key; //取得資料的key
      data.push(message);
    });
    show(data); //讀取資料後展示資料到DOM
  });
}
function show(data) {
  let list = document.getElementById("list");
  list.innerHTML = "";
  let message;
  for (let i = 0; i < data.length; i++) {
    message = data[i];
    if (currentUser === null) {
      //代表使用者沒有登入
      list.innerHTML =
        message.name.bold() + " " + message.content + "<hr/>" + list.innerHTML;
    } else {
      //使用者有登入
      if (currentUser.uid === message.id) {
        //代表和留言的作者是同一個人
        alert("本人");
        list.innerHTML =
          message.name.bold() +
          " " +
          message.content +
          "<button onclick='del(\"" +
          message.key +
          "\");'>Delete</button>" +
          "<hr/>" +
          list.innerHTML;
      } else {
        //和留言作者不同人
        list.innerHTML =
          message.name.bold() +
          " " +
          message.content +
          "<hr/>" +
          list.innerHTML;
      }
    }
  }
  // bold()， CssStyle 加粗體
}

function del(key) {
  let ref = db.ref("/message/" + key);
  ref.remove(function(error) {
    if (error) {
      alert(error);
    } else {
      alert("ok");
    }
  });
}

//網頁載入完成後做一些處理
window.addEventListener("load", function() {
  read();
});
