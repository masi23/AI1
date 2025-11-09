const defaultLocation = { latitude: 51.505, longitude: -0.09 };
let puzzleWidth = 0;
let puzzleHeight = 0;
let selectedLocation = null;
let properCount = 0;
const puzzleSize = 16;
const table = document.getElementById("puzzles-container");
const board = document.getElementById("board");

let map = L.map("map").setView(
  [defaultLocation.latitude, defaultLocation.longitude],
  18
);
L.tileLayer.provider("Esri.WorldImagery").addTo(map);
let marker = L.marker([
  defaultLocation.latitude,
  defaultLocation.longitude,
]).addTo(map);
marker.bindPopup("Twoja lokaliacja");

function getLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation unavailable");
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      selectedLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      map.setView([selectedLocation.latitude, selectedLocation.longitude]);
    },
    (positionError) => {
      console.error(positionError);
    },
    {
      enableHighAccuracy: false,
    }
  );
}

let puzzlesArray = [];

document.getElementById("my-location").addEventListener("click", (event) => {
  getLocation();
});

document.getElementById("take-photo").addEventListener("click", function () {
  leafletImage(map, function (err, canvas) {
    // let rasterMap = document.getElementById("rasterMap");
    // let rasterContext = rasterMap.getContext("2d");
    // rasterMap.width = canvas.width;
    // rasterMap.height = canvas.height;
    prepareGame(canvas);
  });
});

function cutPuzzles(canvas) {
  let puzzleImgs = [];
  puzzleWidth = canvas.width / 4;
  puzzleHeight = canvas.height / 4;
  let index = 0;
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let puzzle = document.createElement("canvas");
      puzzle.width = puzzleWidth;
      puzzle.height = puzzleHeight;
      const puzzleContext = puzzle.getContext("2d");
      puzzleContext.drawImage(
        canvas,
        row * puzzleWidth,
        col * puzzleHeight,
        puzzleWidth,
        puzzleHeight,
        0,
        0,
        puzzleWidth,
        puzzleHeight
      );
      const img = new Image();
      img.src = puzzle.toDataURL();
      img.classList.add("puzzle-piece");
      img.draggable = true;
      img.row = row;
      img.col = col;
      // img.dataset.index = index;
      img.index = index;

      img.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", e.target.index);

        const crt = document.createElement("canvas");
        crt.width = 1;
        crt.height = 1;
        e.dataTransfer.setDragImage(crt, 0, 0);
      });

      puzzleImgs.push(img);
      index++;
    }
  }
  return puzzleImgs;
}

function shufflePuzzles(puzzles) {
  const randomArray = [];
  let i = 16;
  while (puzzles.length) {
    const randInt = Math.floor(Math.random() * i);
    randomArray.push(...puzzles.splice(randInt, 1));
    i--;
  }

  return randomArray;
}

function drawPuzzles() {
  puzzlesArray.forEach((puzzle) => {
    table.appendChild(puzzle);
  });
}

function prepareBoard() {
  for (let i = 0; i < 16; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.key = i;
    cell.style.width = puzzleWidth + "px";
    cell.style.height = puzzleHeight + "px";
    cell.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    cell.addEventListener("drop", (e) => {
      const cell = e.currentTarget;
      // console.log(cell.children.length);
      if (cell.children.length) {
        return;
      }
      const draggedId = e.dataTransfer.getData("text/plain");
      const dragged = puzzlesArray.find(
        (element) => element.index == draggedId
      );
      cell.appendChild(dragged);

      if (draggedId == cell.key) {
        properCount++;
        dragged.draggable = false;
      }
      console.log(`cell-key: ${cell.key}, draggedId: ${draggedId}`);
      console.log(
        `czy cell.key == draggedId? ${cell.key == Number(draggedId)}`
      );
      console.log(`licznik poprawnych: ${properCount}`);
      checkIfWin();
    });

    board.appendChild(cell);
  }
}

function prepareGame(canvas) {
  clearGame();
  const puzzles = cutPuzzles(canvas);
  puzzlesArray = shufflePuzzles(puzzles);
  prepareBoard();
  drawPuzzles();
}

function checkIfWin() {
  if (properCount === puzzleSize) {
    const notificationText = "Gratulacje! Wygrałeś 🎉";
    if (!("Notification" in window)) {
      alert(
        "Wygrałeś ale ta przeglądarka nie wspiera powiadomień systemowych 😞"
      );
    } else if (Notification.permission === "granted") {
      const notification = new Notification(notificationText);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          const notification = new Notification(notificationText);
        }
      });
    }
  }
}

function clearGame() {
  table.innerHTML = "";
  board.innerHTML = "";
  properCount = 0;
  console.clear();
}

window.addEventListener("load", (e) => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});
