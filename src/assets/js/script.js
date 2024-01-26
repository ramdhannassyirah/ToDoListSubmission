document.addEventListener("DOMContentLoaded", function () {
  // Retrieve tasks from session storage
  let savedTasks = sessionStorage.getItem("tasks");
  if (savedTasks) {
    document.getElementById("taskList").innerHTML = savedTasks;
  }

  let add = document.getElementById("add");
  add.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

  let deleteButtons = document.querySelectorAll(".deleteButton");
  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showDeleteConfirmation(button);
    });
  });

  let editButtons = document.querySelectorAll(".editButton");
  editButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      let task = button.closest(".task");
      editTask(task);
    });
  });

  let completeButtons = document.querySelectorAll(".completeButton");
  completeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      completeTask(button);
    });
  });
});

function addTask() {
  let inputTask = document.getElementById("add");
  let taskList = document.getElementById("taskList");

  if (inputTask.value != "") {
    let task = document.createElement("div");
    task.classList.add("task");

    let taskText = document.createElement("span");
    taskText.innerHTML = `<h1 class="conten">${inputTask.value}</h1>`;
    task.appendChild(taskText);

    let group = document.createElement("div");
    group.classList.add("group");
    task.appendChild(group);

    let completeButton = document.createElement("span");
    completeButton.className = "completeButton";
    completeButton.innerHTML = `<i class="fa-solid fa-check"></i>`;
    completeButton.addEventListener("click", function () {
      task.classList.toggle("completed");
      saveTasks(); // Save tasks after completing one
    });
    group.appendChild(completeButton);

    let editButton = document.createElement("span");
    editButton.className = "editButton";
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editButton.addEventListener("click", function () {
      editTask(task);
    });
    group.appendChild(editButton);

    let deleteButton = document.createElement("span");
    deleteButton.className = "deleteButton";
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    deleteButton.addEventListener("click", function () {
      showDeleteConfirmation(task);
    });
    group.appendChild(deleteButton);

    taskList.appendChild(task);
    inputTask.value = "";

    // Save tasks after adding one
    saveTasks();
  }
}

function showDeleteConfirmation(button) {
  Swal.fire({
    title: "Kamu Yakin ?",
    text: "Tekan Yes Untuk Menghapus",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteTask(button.closest(".task"));
      saveTasks(); // Save tasks after deleting one
    }
  });
}

function deleteTask(task) {
  task.parentNode.removeChild(task);
}

function completeTask(button) {
  let task = button.closest(".task");
  task.classList.toggle("completed");
  saveTasks(); // Save tasks after completing one
}

async function editTask(task) {
  let taskText = task.querySelector(".conten");

  const {value: newText} = await Swal.fire({
    title: "Edit Task",
    input: "text",
    inputValue: taskText.textContent,
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "Task description cannot be empty!";
      }
    },
  });

  if (newText !== undefined && newText !== null) {
    taskText.textContent = newText;

    // Save tasks after editing one
    saveTasks();

    // Show SweetAlert for successful edit
    Swal.fire({
      title: "Task Edited!",
      icon: "success",
      timer: 1000, // Auto close after 1 seconds
      showConfirmButton: false,
    });
  }
}

function saveTasks() {
  // Save tasks to session storage
  let taskList = document.getElementById("taskList").innerHTML;
  sessionStorage.setItem("tasks", taskList);
}
