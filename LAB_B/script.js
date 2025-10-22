class Todo {
  constructor() {
    //search bar functionality
    const searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length > 1) {
        this.searchTasks(query);
      } else {
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        this.draw();
      }
    });

    //editable fields functionality
    this.implementEditableParagraphs();

    //form functionality
    this.implementForm();
  }

  tasks = [];

  implementEditableParagraphs() {
    const listWrapper = document.querySelector(".list-wrapper");
    //click event
    listWrapper.addEventListener("click", (e) => {
      if (e.target.classList.contains("task-name")) {
        const paragraph = e.target;
        const parentElement = paragraph.parentElement;
        const nameValue = paragraph.textContent;
        parentElement.removeChild(paragraph);
        const nameInput = document.createElement("input");
        nameInput.classList.add("task-name-field-input");
        nameInput.type = "text";
        nameInput.value = nameValue;
        parentElement.insertBefore(nameInput, parentElement.children[1]);
        nameInput.focus();
      } else if (e.target.classList.contains("task-date")) {
        const paragraph = e.target;
        const parentElement = paragraph.parentElement;
        const dateValue = paragraph.textContent;
        parentElement.removeChild(paragraph);
        const dateInput = document.createElement("input");
        dateInput.classList.add("task-date-field-input");
        dateInput.type = "date";
        dateInput.value = dateValue.split(".").reverse().join("-");
        parentElement.insertBefore(dateInput, parentElement.children[2]);
        dateInput.focus();
      }
    });

    listWrapper.addEventListener("focusout", (e) => {
      if (e.target.classList.contains("task-name-field-input")) {
        const input = e.target;
        const newNameValue = input.value;
        //name validation
        if (!this.validateName(newNameValue)) {
          input.setAttribute("status", "invalid");
          alert("Nazwa zadania musi mieć od 3 do 255 znaków!");
          return;
        }
        const parentElement = input.parentElement;
        const index = parseInt(parentElement.getAttribute("key"));
        this.tasks[index].name = newNameValue;
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
        const nameParagraph = document.createElement("p");
        nameParagraph.classList.add("task-name");
        nameParagraph.textContent = newNameValue;
        parentElement.removeChild(input);
        parentElement.insertBefore(nameParagraph, parentElement.children[1]);
      } else if (e.target.classList.contains("task-date-field-input")) {
        const input = e.target;
        const newDateValue = input.value;
        //date validation
        if (!this.validateDate(newDateValue) && newDateValue) {
          input.setAttribute("status", "invalid");
          alert("Data nie może być z przeszłości!");
          return;
        }
        const parentElement = input.parentElement;
        const index = parseInt(parentElement.getAttribute("key"));
        this.tasks[index].date = newDateValue ? newDateValue : null;
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
        const dateParagraph = document.createElement("p");
        dateParagraph.classList.add("task-date");
        dateParagraph.textContent = newDateValue
          ? new Date(newDateValue).toLocaleDateString("pl-PL", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : "";
        parentElement.removeChild(input);
        parentElement.insertBefore(dateParagraph, parentElement.children[2]);
      }
    });
  }

  implementForm() {
    this.formNameInput = document.getElementById("taskname-input");
    this.formNameInput.addEventListener("input", (e) => {
      this.formNameInput.textContent = e.target.value;
    });
    this.formDateInput = document.getElementById("data");
    this.formDateInput.addEventListener("input", (e) => {
      this.formDateInput.value = e.target.value;
    });
    this.formButton = document.getElementById("form-button");
    this.formButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.addTask(
        this.formNameInput.textContent,
        this.formDateInput.value ? this.formDateInput.value : null
      );
      this.draw();
    });
    this.draw();
  }

  clearTasks() {
    const list_wrapper = document.querySelector(".list-wrapper");
    list_wrapper.innerHTML = "";
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  searchTasks(query) {
    this.drawSearched(
      this.tasks.filter((task) => task.name.toLowerCase().includes(query)),
      query
    );
  }

  drawSearched(searchedTasks, query) {
    this.clearTasks();
    const list_wrapper = document.querySelector(".list-wrapper");
    if (!searchedTasks.length) {
      const emptyInfo = document.createElement("p");
      emptyInfo.textContent = "Nie znaleziono zadań...";
      list_wrapper.appendChild(emptyInfo);
      return;
    }
    console.log(searchedTasks);
    searchedTasks.forEach((task, index) => {
      const taskName = task.name;
      const taskDate = task.date ? new Date(task.date) : "";
      const listItem = document.createElement("div");
      listItem.classList.add("list-item");
      listItem.setAttribute("key", index);
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      const taskNameElement = document.createElement("p");
      taskNameElement.classList.add("task-name");
      const splitText = taskName.split(query);
      const markElement = document.createElement("mark");
      taskNameElement.innerHTML =
        splitText[0] + "<mark>" + query + "</mark>" + splitText[1];
      // taskNameElement.textContent = taskName;
      const taskDateElement = document.createElement("p");
      const dateString = taskDate
        ? taskDate.toLocaleDateString("pl-PL", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "";
      taskDateElement.textContent = dateString;
      taskDateElement.classList.add("task-date");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Usuń";
      deleteButton.addEventListener("click", () => {
        this.deleteTask(index);
        this.draw();
      });
      listItem.appendChild(checkbox);
      listItem.appendChild(taskNameElement);
      listItem.appendChild(taskDateElement);
      listItem.appendChild(deleteButton);
      list_wrapper.appendChild(listItem);
    });
  }

  validateName(name) {
    return name.length >= 3 && name.length <= 255;
  }

  validateDate(date) {
    const now = new Date();
    date = new Date(date);
    now.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= now;
  }

  draw() {
    this.clearTasks();
    //displaying tasks
    const list_wrapper = document.querySelector(".list-wrapper");
    if (!this.tasks.length) {
      this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      if (!this.tasks || this.tasks.length === 0) {
        const emptyInfo = document.createElement("p");
        emptyInfo.textContent = "Dodaj coś do listy...";
        list_wrapper.appendChild(emptyInfo);
        return;
      }
    }
    this.tasks.forEach((task, index) => {
      const taskName = task.name;
      const taskDate = task.date ? new Date(task.date) : "";
      const listItem = document.createElement("div");
      listItem.classList.add("list-item");
      listItem.setAttribute("key", index);
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      const taskNameElement = document.createElement("p");
      taskNameElement.classList.add("task-name");
      taskNameElement.textContent = taskName;
      const taskDateElement = document.createElement("p");
      taskDateElement.classList.add("task-date");
      const dateString = taskDate
        ? taskDate.toLocaleDateString("pl-PL", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "";
      taskDateElement.textContent = dateString;
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Usuń";
      deleteButton.addEventListener("click", () => {
        this.deleteTask(index);
        this.draw();
      });
      listItem.appendChild(checkbox);
      listItem.appendChild(taskNameElement);
      listItem.appendChild(taskDateElement);
      listItem.appendChild(deleteButton);
      list_wrapper.appendChild(listItem);
    });
  }

  addTask(name, date) {
    //name validation
    if (!this.validateName(name)) {
      this.formNameInput.setAttribute("status", "invalid");
      // console.error("invalid name");
      alert("Nazwa zadania musi mieć od 3 do 255 znaków!");
      return;
    }

    //date validation
    if (!this.validateDate) {
      // console.error("invalid date");
      alert("Data nie może być z przeszłości!");
      this.formDateInput.setAttribute("status", "invalid");
      return;
    }

    this.tasks.push({ name: name, date: date ? date : null });
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    this.formNameInput.value = "";
    this.formDateInput.value = "";

    this.formDateInput.removeAttribute("status");
    this.formNameInput.removeAttribute("status");
  }
}

const todo = new Todo();
