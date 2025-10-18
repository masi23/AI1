class Todo {
  constructor() {
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

  tasks = [];

  clearTasks() {
    const list_wrapper = document.querySelector(".list-wrapper");
    list_wrapper.innerHTML = "";
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  searchTasks(query) {
    this.draw(
      this.tasks.filter((task) => task.name.toLowerCase().includes(query))
    );
  }

  draw(searchedTasks) {
    if (searchedTasks) {
      this.tasks = searchedTasks;
    }
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
      taskNameElement.textContent = taskName;
      const taskDateElement = document.createElement("p");
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
    if (name.length < 3 || name.length > 255) {
      this.formNameInput.setAttribute("status", "invalid");
      console.error("invalid name");
      return;
    }

    if (date) {
      console.log("date not null");
      const now = new Date();
      date = new Date(date);
      now.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      if (date < now) {
        console.error("invalid date");
        this.formDateInput.setAttribute("status", "invalid");
        return;
      }
    }
    console.log(date);

    this.tasks.push({ name: name, date: date ? date : null });
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    this.formNameInput.value = "";
    this.formDateInput.value = "";

    this.formDateInput.removeAttribute("status");
    this.formNameInput.removeAttribute("status");
  }
}

const todo = new Todo();
