const allBoards = document.querySelectorAll(".Board");
const allItems = document.querySelectorAll(".Task");
const Content = document.querySelectorAll(".Board-content");
const form = document.getElementById("Input-form");
const mainContent = document.querySelector(".main_content");
const Board = document.querySelector(".todo-content");

// Getting the buttons of the main page
const boardbtn = document.getElementById("add-board-btn");
const additembtn = document.getElementById("add-item-btn");

// Form elements
// const FormHeading = document.getElementById("Input_heading");
const Title = document.getElementById("Task_name");
const Description = document.getElementById("decription");
const CurrDate = document.getElementById("Date");
const Level = document.getElementById("Priority");

// Form buttons
const Addbtn = document.getElementById("add-btn");
const CancleBtn = document.getElementById("cancle-btn");
const Updatebtn = document.getElementById("update-btn");

// Track current task being edited
let currentEditTask = null;

// Add event listeners to main buttons
additembtn.addEventListener("click", () => {
  // Changing the heading of the form
  const heading = form.querySelector("h2");
  heading.innerText = "Add New Task";

  // Reset form to add mode
  clearData();
  Addbtn.style.display = "inline-block";
  Updatebtn.style.display = "none";
  currentEditTask = null;

  // Open form
  form.classList.add("open");
  mainContent.classList.add("blur");
});

boardbtn.addEventListener("click", () => {
  alert("The button is under Development");
});

// Form button event listeners
Addbtn.addEventListener("click", () => {
  if (validateForm()) {
    CreateTask();
  }
});

CancleBtn.addEventListener("click", () => {
  closeForm();
});

Updatebtn.addEventListener("click", () => {
  if (validateForm() && currentEditTask) {
    updateTask();
  }
});

// Form handling functions
function validateForm() {
  if (Title.value.trim() === "") {
    alert("Please enter a task title");
    return false;
  }
  return true;
}

function clearData() {
  Title.value = "";
  Description.value = "";
  CurrDate.value = "";
  Level.value = "Low";
}

function getData(item) {
  Title.value = item.children[0].children[0].innerText;
  Description.value = item.children[1].innerText;
  CurrDate.value = item.children[2].children[0].innerText;
  Level.value = item.children[2].children[1].innerText;
}

function closeForm() {
  form.classList.remove("open");
  mainContent.classList.remove("blur");
  clearData();
  currentEditTask = null;
}

// Task operations
function CreateTask() {
  const Task = document.createElement("div");
  Task.classList.add("Task");

  const Task_heading = document.createElement("div");
  Task_heading.classList.add("Task-heading");

  const heading = document.createElement("h3");
  heading.innerText = Title.value;
  Task_heading.appendChild(heading);

  const Task_description = document.createElement("p");
  Task_description.classList.add("Task-description");
  Task_description.innerText = Description.value;

  const Task_metedata = document.createElement("div");
  Task_metedata.classList.add("Task-metadata");

  const Date = document.createElement("span");
  const Priority = document.createElement("span");
  Date.classList.add("date");
  Priority.classList.add("priority");
  Date.innerText = CurrDate.value;
  Priority.innerText = Level.value;
  Task_metedata.appendChild(Date);
  Task_metedata.appendChild(Priority);

  const Buttons = document.createElement("div");
  const Edit_btn = document.createElement("button");
  const delete_btn = document.createElement("button");
  Edit_btn.classList.add("task-btn");
  delete_btn.classList.add("task-btn");
  Edit_btn.id = "Edit-btn";
  delete_btn.id = "Delete-btn";
  Buttons.classList.add("Task-buttons");
  Buttons.appendChild(Edit_btn);
  Buttons.appendChild(delete_btn);

  Task.appendChild(Task_heading);
  Task.appendChild(Task_description);
  Task.appendChild(Task_metedata);
  Task.appendChild(Buttons);

  // Attach event listeners to task buttons
  attachTaskEvents(Task, Edit_btn, delete_btn);

  // Attach drag functionality
  attachDragEvents(Task);

  // Add task to board
  Board.appendChild(Task);

  // Save and close
  saveToLocalStorage();
  closeForm();
  Counter();
}

function updateTask() {
  // Update task content
  currentEditTask.children[0].children[0].innerText = Title.value;
  currentEditTask.children[1].innerText = Description.value;
  currentEditTask.children[2].children[0].innerText = CurrDate.value;
  currentEditTask.children[2].children[1].innerText = Level.value;

  // Save changes
  saveToLocalStorage();
  closeForm();
}

function attachTaskEvents(Task, Edit_btn, delete_btn) {
  // Delete button event
  delete_btn.addEventListener("click", () => {
    Task.remove();
    Counter();
    saveToLocalStorage();
  });

  // Edit button event
  Edit_btn.addEventListener("click", () => {
    currentEditTask = Task;
    getData(Task);

    // Editing the heading of the form
    const heading = form.querySelector("h2");
    heading.innerText = "Update Task";

    // Open form in edit mode
    form.classList.add("open");
    mainContent.classList.add("blur");
    Addbtn.style.display = "none";
    Updatebtn.style.display = "inline-block";
  });
}

// Drag and drop functionality
function attachDragEvents(target) {
  target.setAttribute("draggable", true);

  target.addEventListener("dragstart", () => {
    target.classList.add("flying");
  });

  target.addEventListener("dragend", (event) => {
    target.classList.remove("flying");
    event.preventDefault();
    Counter();
    saveToLocalStorage();
  });
}

// Add drop zones to all board contents
Content.forEach((item) => {
  item.addEventListener("dragover", (event) => {
    event.preventDefault();
    const flyingElement = document.querySelector(".flying");
    if (flyingElement) {
      item.appendChild(flyingElement);
    }
  });
});

// Task counters
const TodoCounter = document.getElementById("todo-counter");
const ProgressCounter = document.getElementById("Progress-counter");
const CompletedCounter = document.getElementById("Completed-counter");

const TodoContent = document.querySelector(".todo-content");
const ProgressContent = document.querySelector(".Progress-content");
const CompletedContent = document.querySelector(".Completed-content");

function Counter() {
  TodoCounter.innerText = TodoContent.children.length.toString();
  ProgressCounter.innerText = ProgressContent.children.length.toString();
  CompletedCounter.innerText = CompletedContent.children.length.toString();
}

// Local storage operations
function saveToLocalStorage() {
  localStorage.setItem("todoTasks", TodoContent.innerHTML);
  localStorage.setItem("progressTasks", ProgressContent.innerHTML);
  localStorage.setItem("completedTasks", CompletedContent.innerHTML);
}

function loadFromLocalStorage() {
  if (localStorage.getItem("todoTasks")) {
    TodoContent.innerHTML = localStorage.getItem("todoTasks");
  }

  if (localStorage.getItem("progressTasks")) {
    ProgressContent.innerHTML = localStorage.getItem("progressTasks");
  }

  if (localStorage.getItem("completedTasks")) {
    CompletedContent.innerHTML = localStorage.getItem("completedTasks");
  }

  // Reattach event listeners to all loaded tasks
  restoreTaskEvents();
  Counter();
}

function restoreTaskEvents() {
  const allTasks = document.querySelectorAll(".Task");

  allTasks.forEach((task) => {
    // Restore drag events
    attachDragEvents(task);

    // Restore button events
    const editBtn = task.querySelector("#Edit-btn");
    const deleteBtn = task.querySelector("#Delete-btn");

    if (editBtn && deleteBtn) {
      attachTaskEvents(task, editBtn, deleteBtn);
    }
  });
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
});
