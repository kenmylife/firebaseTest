let auth = firebase.auth();
let provider = new firebase.auth.FacebookAuthProvider(); //創造一個登入服務物件
provider.addScope("user_birthday"); //要求的內容

//觸動介面後，執行我們創的signIn函式，執行後會跑firebase提供的登入服務
function signIn() {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
}

//當使用者的登入狀態變化的時侯，執行我們的程式
auth.onAuthStateChanged(function(user) {
  let member = document.getElementById("member");
  let welcome = document.getElementById("welcome");
  member.style.display = "none";
  welcome.style.display = "none";
  if (user) {
    // User is signed in.使用者登入
    console.log(user);
    member.style.display = "block";
  } else {
    // User is signed out. 使用者登出
    console.log(user);
    welcome.style.display = "block";
  }
});
