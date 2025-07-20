
let addNote = document.querySelector("#add-note");
let formContainer = document.querySelector(".form-container");
let closeForm = document.querySelector(".closeForm");

const stack = document.querySelector(".stack");
const upBtn = document.querySelector("#upBtn");
const downBtn = document.querySelector("#downBtn");

const form = document.querySelector("form");

const imageUrlInput = form.querySelector(
  "input[placeholder='https://example.com/photo.jpg']"
);
const fullNameInput = form.querySelector(
  "input[placeholder='Enter full name']"
);
const homeTownInput = form.querySelector(
  "input[placeholder='Enter home town']"
);
const purposeInput = form.querySelector(
  "input[placeholder='e.g., Quick appointment note']"
);

const categoryRadios = form.querySelectorAll("input[name='category']");

const submitButton = form.querySelector(".submit-btn");

// CODE STARTS HERE

function saveToLocalStorage(obj) {
  if (localStorage.getItem("tasks") === null) {
    let oldTasks = [];
    oldTasks.push(obj);
    localStorage.setItem("tasks", JSON.stringify(oldTasks));
  }
  else {
    let oldTasks = localStorage.getItem("tasks");
    oldTasks = JSON.parse(oldTasks);
    oldTasks.push(obj); 
    localStorage.setItem("tasks", JSON.stringify(oldTasks));
  }
}

addNote.addEventListener("click", function () {
  formContainer.style.display = "initial";
});

closeForm.addEventListener("click", function () {
  formContainer.style.display = "none";
});

form.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const imageUrl = imageUrlInput.value.trim();
  const fullName = fullNameInput.value.trim();
  const homeTown = homeTownInput.value.trim();
  const purpose = purposeInput.value.trim();

  let selected = false;
  categoryRadios.forEach(function (cat) {
    if (cat.checked) {
      selected = cat.value;
    }
  });

  if (imageUrl === "") {
    alert("Please enter an Image URL.");
    return;
  }

  if (fullName === "") {
    alert("Please enter your Full Name.");
    return;
  }

  if (homeTown === "") {
    alert("Please enter your Home Town.");
    return;
  }

  if (purpose === "") {
    alert("Please enter the Purpose.");
    return;
  }

  if (!selected) {
    alert("Please select a category");
    return;
  }
  saveToLocalStorage({
    imageUrl,
    fullName,
    purpose,
    homeTown,
    selected,
  });
  form.reset();
  formContainer.style.display = "none";
  showCards();
});

function showCards() {

  stack.innerHTML = "";

  let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  if (allTasks.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.style.display = "flex";
    emptyDiv.style.justifyContent = "center";
    emptyDiv.style.alignItems = "center";
    emptyDiv.style.height = "150px"; 

    const emptyMsg = document.createElement("div");
    emptyMsg.textContent = "No data available + to insert data ";
    emptyMsg.classList.add("no-data");

    emptyDiv.appendChild(emptyMsg);
    stack.appendChild(emptyDiv);
    applySavedTheme();
    return; 
  }
   
  let copy = allTasks.slice();
  copy = copy.reverse();
  allTasks = copy;

  allTasks.forEach(function (task) {
    const card = document.createElement("div");
    card.classList.add("card");
    // Avatar image
    const avatar = document.createElement("img");
    avatar.src = task.imageUrl;
    avatar.alt = "profile";
    avatar.classList.add("avatar");
    card.appendChild(avatar);

    const name = document.createElement("h2");
    name.textContent = task.fullName;
    card.appendChild(name);

    const hometownInfo = document.createElement("div");
    hometownInfo.classList.add("info");

    const hometownLabel = document.createElement("span");
    hometownLabel.textContent = "Home town";
    const hometownValue = document.createElement("span");
    hometownValue.textContent = task.homeTown;

    hometownInfo.appendChild(hometownLabel);
    hometownInfo.appendChild(hometownValue);
    card.appendChild(hometownInfo);

    const bookingsInfo = document.createElement("div");
    bookingsInfo.classList.add("info");

    const bookingsLabel = document.createElement("span");
    bookingsLabel.textContent = "Purpose";
    const bookingsValue = document.createElement("span");
    bookingsValue.textContent = task.purpose;

    bookingsInfo.appendChild(bookingsLabel);
    bookingsInfo.appendChild(bookingsValue);
    card.appendChild(bookingsInfo);

    // Buttons container
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("buttons");

    // Call button
    const callBtn = document.createElement("button");
    callBtn.classList.add("call");
    callBtn.innerHTML = '<i class="ri-phone-line"></i> Call';

    // Message button
    const msgBtn = document.createElement("button");
    msgBtn.classList.add("msg");
    msgBtn.textContent = "Message";

    const del = document.createElement("button");
    del.classList.add("delBtn", "del");
    del.textContent = "Delete";

    del.addEventListener("click", function () {
      let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];

      if (allTasks.length === 0) return; 

      allTasks.pop(); 

      localStorage.setItem("tasks", JSON.stringify(allTasks)); 
      showCards(); 
      updateStack(); 
    });

    // Append buttons
    buttonsDiv.appendChild(callBtn);
    buttonsDiv.appendChild(msgBtn);
    buttonsDiv.appendChild(del);

    // Append buttonsDiv to card
    card.appendChild(buttonsDiv);

    document.querySelector(".stack").appendChild(card); 
  });

  applySavedTheme();
  updateStack();
}
showCards();


function updateStack() {
  const cards = document.querySelectorAll(".stack .card");

  // Reset styles for all cards
  cards.forEach(card => {
    card.style.zIndex = "";
    card.style.transform = "";
    card.style.opacity = "";
  });

  // Apply styles only to the top 3
  let size = cards.length;
  if (size > 3) size = 3;

  for (let i = 0; i < size; i++) {
    const card = cards[i];
    card.style.zIndex = 3 - i;
    card.style.transform = `translateY(${i * 10}px) scale(${1 - i * 0.02})`;
    card.style.opacity = `${1 - i * 0.02}`;
  }
}


upBtn.addEventListener("click", function () {
  let lastChild = stack.lastElementChild;
  if (lastChild) {
    stack.insertBefore(lastChild, stack.firstElementChild);
    // update
    updateStack();
  }
});

downBtn.addEventListener("click", function () {
  const firstChild = stack.firstElementChild;
  if (firstChild) {
    stack.appendChild(firstChild);
    // update
    updateStack();
  }
});

let black = document.querySelector(".black");
let purple = document.querySelector(".purple");
let orange = document.querySelector(".orange");
let teal = document.querySelector(".teal");

function applyTheme(bgColor, cardColor, textColor, shadowColor) {
  // save theme
  localStorage.setItem(
    "theme",
    JSON.stringify({ bgColor, cardColor, textColor, shadowColor })
  );

  stack.style.backgroundColor = bgColor;
  document.body.style.backgroundColor = bgColor;

  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.style.backgroundColor = cardColor;
    card.style.color = textColor;
    card.style.boxShadow = `0 4px 12px ${shadowColor}`;
  });
}

black.addEventListener("click", function () {
  applyTheme("#000", "#2d2a2aff", "#fffff5ff", "rgba(255, 255, 255, 0.2)");
});

purple.addEventListener("click", function () {
  applyTheme("#2e003e", "#4b0082", "#ffffff", "rgba(255, 255, 255, 0.2)");
});

orange.addEventListener("click", function () {
  applyTheme("#ffeadb", "#ffa07a", "#000", "rgba(0, 0, 0, 0.2)");
});

teal.addEventListener("click", function () {
  applyTheme("#e0f7f7", "#20b2aa", "#000", "rgba(0, 0, 0, 0.2)");
});

// Take from the local storage and apply the themem 
function applySavedTheme() {
  const theme = JSON.parse(localStorage.getItem("theme"));
  if (!theme) return;
  // put all the values into the below variables 
  const { bgColor, cardColor, textColor, shadowColor } = theme;
  stack.style.backgroundColor = bgColor;
  document.body.style.backgroundColor = bgColor;
  document.querySelectorAll(".card").forEach(card => {
    card.style.backgroundColor = cardColor;
    card.style.color = textColor;
    card.style.boxShadow = `0 4px 12px ${shadowColor}`;
  });
}

// For the random data to local storage and Display the card how it looks
 
// localStorage.setItem("tasks", JSON.stringify([
//   {
//     imageUrl: "https://randomuser.me/api/portraits/men/65.jpg",
//     fullName: "Rajesh Kumar",
//     homeTown: "Patna",
//     purpose: "Medical consultation",
//     selected: "Medical"
//   },
//   {
//     imageUrl: "https://randomuser.me/api/portraits/women/45.jpg",
//     fullName: "Sneha Sharma",
//     homeTown: "Jaipur",
//     purpose: "Education inquiry",
//     selected: "Education"
//   },
//   {
//     imageUrl: "https://randomuser.me/api/portraits/men/33.jpg",
//     fullName: "Amit Verma",
//     homeTown: "Lucknow",
//     purpose: "Job discussion",
//     selected: "Business"
//   },
//   {
//     imageUrl: "https://randomuser.me/api/portraits/women/12.jpg",
//     fullName: "Pooja Mehta",
//     homeTown: "Mumbai",
//     purpose: "Quick meeting",
//     selected: "Personal"
//   },
//   {
//     imageUrl: "https://randomuser.me/api/portraits/men/78.jpg",
//     fullName: "Karan Singh",
//     homeTown: "Delhi",
//     purpose: "Follow-up visit",
//     selected: "Medical"
//   }
// ]));
