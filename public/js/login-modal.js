//DISPLAY CORRECT ACCOUNT ICON
var accountIcon = document.querySelector(".account");
var token = sessionStorage.getItem("session-id");
if (token && token !== "null" && token !== "undefined") {
  accountIcon.src = "/images/logout-icon.png";
  accountIcon.addEventListener("click", async (e) => performLogout());
} else {
  accountIcon.src = "/images/account-icon.jpg";
  accountIcon.removeEventListener("click", async (e) => performLogout());
}
// LOGIN MODAL HANDLING
const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
function toggleModal() {
  modal.classList.toggle("show-modal");
}

//LOGIN COMPONENT ACTION CALLS
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
signUpButton.addEventListener("click", async (e) => await performRegister());
signInButton.addEventListener("click", async (e) => await performLogin());

//LOGIN COMPONENT OVERLAY STATES HANDLING
const ghostSignUpButton = document.getElementById("ghostSignUp");
const ghostSignInButton = document.getElementById("ghostSignIn");
const container = document.getElementById("container");

ghostSignUpButton.addEventListener("click", async (e) =>
  container.classList.add("right-panel-active")
);
ghostSignInButton.addEventListener("click", async (e) =>
  container.classList.remove("right-panel-active")
);

async function performLogin() {
  console.log("DAA");
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    const response = await fetch("http://localhost:8080/account/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    //SAVE FOR SUBSEQUENT USE
    sessionStorage.setItem("session-id", data["session-id"]);
    sessionStorage.setItem("username", data.user.username);
    alert("Successfully logged in");
    window.location.href = "/";
  } catch (error) {
    alert(error.message);
  }
}
async function performRegister() {
  console.log("DAA");
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;
  try {
    const response = await fetch("http://localhost:8080/account/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error(response.statusText);
    const { sessionId, user } = await response.json();
    //SAVE FOR SUBSEQUENT USE
    sessionStorage.setItem("session-id", sessionId);
    sessionStorage.setItem("username", username);
    alert("Successfully registered");
    window.location.reload();
  } catch (error) {
    alert(error.message);
  }
}
async function performLogout() {
  const sessionId = sessionStorage.getItem("session-id");
  try {
    const response = await fetch("http://localhost:8080/account/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "session-id": sessionId,
      },
    });
    if (!response.ok) throw new Error(response.statusText);
    //SAVE FOR SUBSEQUENT USE
    sessionStorage.setItem("session-id", null);
    sessionStorage.setItem("username", null);
    alert("Logged out");
    window.location.reload();
  } catch (error) {
    alert(error.message);
  }
}
