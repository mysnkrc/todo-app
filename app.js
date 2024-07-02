const addBtn = document.querySelector("#add-btn");
const inputContent = document.querySelector("#input-content");
const todoList = document.querySelector("#task-list");
const deleteAllBtn = document.querySelector("#delete-all");
const searchBar = document.querySelector("#filter-todo");
const incompleteTasksBtn = document.querySelector("#incomplete");
const completedTasksBtn = document.querySelector("#completed");
const prg = document.querySelector("#prg");
let isEditTask = false;


let taskListArr = [];
let i = 0;

checkTodosFromStorage();
function checkTodosFromStorage () {
    if (localStorage.getItem("taskListArr") == null) {
        localStorage.setItem("taskListArr", "[]");
    } else {
        taskListArr = JSON.parse(localStorage.getItem("taskListArr"));
        prg.style.display = "none";
    };
};

displayTasks();
function displayTasks() {
    checkTodosFromStorage();
    todoList.innerHTML = "";
    for (let task of taskListArr) {
        li = 
        `<li class="task list-group-item border rounded mb-2 py-2">
            <input id="${taskListArr.indexOf(task) + 1}" class="form-check-input mb-1 mx-2" type="checkbox" ${task.status}>
            <label for="${taskListArr.indexOf(task) + 1}" class="form-check-label">${task.name}</label>
            <a id="edit" class="fa-solid fa-pen-to-square fa-sm ms-auto"></a>
            <a id="delete" class="fa-regular fa-trash-can fa-sm ms-2"></a>
        </li>`;
        todoList.insertAdjacentHTML("beforeEnd", li);
    };
    showCompletedTodos();
    showIncompleteTodos();  
};

addBtn.addEventListener("click", addNewTask);
function addNewTask () {
    checkTodosFromStorage();
    if (!isEditTask) {
        if (inputContent.value != "") {
            prg.style.display = "none";
            taskListArr.push({name: inputContent.value , status: ""});
            inputContent.value = "";
            showAlert("success", "You have added a task successfully");
            localStorage.setItem("taskListArr", JSON.stringify(taskListArr));
            displayTasks();
        } else {
                showAlert ("warning", "You can not leave here blank!");
            };
    } else {
        taskListArr.splice(editId - 1, 1, {name: inputContent.value , status: ""});
        showAlert("success", "Task has edited successfully");
        localStorage.setItem("taskListArr", JSON.stringify(taskListArr));
        displayTasks();
        inputContent.value = "";
        isEditTask = false;
    };
};

deleteAllBtn.addEventListener("click", deleteAll);
function deleteAll () {
    checkTodosFromStorage();
    if (todoList.children.length > 0) {
        taskListArr.splice(0,taskListArr.length);
        localStorage.clear();
        displayTasks();
        showAlert("danger", "You have deleted all tasks!");
        prg.style.display = "block";
    } else {
        showAlert("danger", "You have nothing to delete!");
    };    
};

todoList.addEventListener("click", deleteTask);
function deleteTask (del) {
    checkTodosFromStorage();
    if (del.target.getAttribute("id") == "delete") {
        let selectedLi = del.target.parentElement.firstElementChild;
        let selectedId = selectedLi.getAttribute("id");
        taskListArr.splice(selectedId - 1, 1);
        displayTasks();
        localStorage.setItem("taskListArr", JSON.stringify(taskListArr));
        showAlert("danger", "You have deleted the task!");
        if (taskListArr.length == 0) {
            prg.style.display = "block";
        };
    };
};

todoList.addEventListener("click", editTask);
function editTask (edt) {
    if (edt.target.getAttribute("id") == "edit") {
        let selectedLi = edt.target.previousElementSibling;
        inputContent.value = selectedLi.textContent;
        inputContent.focus();
        isEditTask = true;
        editId = selectedLi.getAttribute("for");
    };
};

searchBar.addEventListener("keyup", filterTodos);
function filterTodos () {
    for (let child of todoList.children) {
        if (searchBar.value != "") {
            if(child.innerText.trim().toLowerCase().includes(searchBar.value.trim().toLowerCase())) {
                child.style.display = "flex";
            } else {
                child.style.display = "none";
            };
        } else {
            child.style.display = "flex";
            showCompletedTodos();
            showIncompleteTodos();
        };
    };
};

todoList.addEventListener("click", selectTask);
function selectTask (e) {
    if (e.target.tagName == "INPUT") {
        if (e.target.getAttribute("checked") == null){
            e.target.setAttribute("checked", "");
            taskStatus = "checked";
            taskListArr[e.target.id - 1].status = "checked";
            localStorage.setItem("taskListArr", JSON.stringify(taskListArr));
        } else {
            e.target.removeAttribute("checked");
            taskListArr[e.target.id - 1].status = "";
            localStorage.setItem("taskListArr", JSON.stringify(taskListArr));
        };
    };
};

incompleteTasksBtn.addEventListener("click", showIncompleteTodos);
function showIncompleteTodos () {
    incompleteTasksBtn.classList.add("active");
    completedTasksBtn.classList.remove("active");
    if (taskListArr.length == "") {
        prg.style.display = "block";
        prg.textContent = "Task list is empty.";
    } else {
        prg.style.display = "none";
    };
    for (let task of todoList.children) {
        if (task.firstElementChild.getAttribute("checked") == null) {
            task.style.display = "flex";
            task.children[1].classList.remove("text-decoration-line-through");
        } else {
            task.style.display = "none";
        };
    };
};

completedTasksBtn.addEventListener("click", showCompletedTodos);
function showCompletedTodos () {
    incompleteTasksBtn.classList.remove("active");
    completedTasksBtn.classList.add("active");
    for (let task of todoList.children) {
        if (task.firstElementChild.getAttribute("checked") != null) {          
            task.style.display = "flex";
            task.children[1].classList.add("text-decoration-line-through");
        } else {
            task.style.display = "none";
        };
    };
};

function showAlert (color, message) {
    let msgBox = document.querySelector("#first-card");
    infoBox = `<div id="alertBox" class="mt-2 alert alert-${color}" role="alert"> ${message} </div>`;
    msgBox.insertAdjacentHTML("beforeend", infoBox);
    setTimeout(() => {
        let infoBox = document.querySelector("#alertBox");
        infoBox.remove();           
        }, 1300);
};
