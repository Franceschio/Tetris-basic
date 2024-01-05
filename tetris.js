// Inizio codice

//localstorage

//Punteggi in localStorage
let tuttiPunteggi;
if (!localStorage.getItem("punteggi")) {
  localStorage.setItem("punteggi", "[]");
  tuttiPunteggi = JSON.parse(localStorage.getItem("punteggi"));
} else {
  tuttiPunteggi = JSON.parse(localStorage.getItem("punteggi"));
}

// Ordina tuttiPunteggi in ordine decrescente
tuttiPunteggi.sort((a, b) => b - a);

//inizzializzazione main della pagina
const main = document.querySelector(".main");

//costruisci selezioni

const setSelections = (selectArray, menu, selectionsArray) => {
  selectArray.forEach((option, i) => {
    const selection = document.createElement("div");
    selection.className = "selection";
    selection.textContent = option;
    option.includes("esci") ? selection.classList.add("exitSelection") : null;
    menu.append(selection);
    selectionsArray = [...selectionsArray, selection];
    if (i === selectArray.length - 1) {
      selectionsArray.forEach((select) => {
        select.addEventListener("click", () => selectionsEvents(select));
      });
    }
  });
};

//Scelte menu principale
let mainMenuOptions = ["Nuova partita", "i tuoi punteggi", "esci dal gioco"];
let mainSelections = [];

//scelte di pause
let pauseGameOptions = [
  "riprendi",
  "riavvia",
  "torna al menu principale",
  "esci dal gioco",
];
let pauseSelections = [];

//scelte di fine partita
let endGameOptions = ["riprova", "torna al menu principale", "esci dal gioco"];
let endSelections = [];

//Menu principale (mainMenu)
const mainMenu = document.createElement("div");
mainMenu.className = "mainMenu";
main.append(mainMenu);

const gameTitle = document.createElement("h1");
mainMenu.append(gameTitle);
gameTitle.textContent = "TETRIS!";
gameTitle.className = "gameTitle";

const mainOptions = document.createElement("div");
mainOptions.className = "mainOptions";
mainMenu.append(mainOptions);

setSelections(mainMenuOptions, mainOptions, mainSelections);

//EndMenu

//Elemento dell'endMenu
const endMenu = document.createElement("div");
endMenu.classList.add("menu");

setSelections(endGameOptions, endMenu, endSelections);

//PauseMenu

//Elementi pauseMenu
const pauseMenu = document.createElement("div");
pauseMenu.classList.add("menu");

//Selezioni pause
setSelections(pauseGameOptions, pauseMenu, pauseSelections);

//pulsante pause

const pauseButton = document.createElement("div");
const pauseBtnImg = document.createElement("img");
pauseButton.className = "pauseButton";
pauseBtnImg.setAttribute(
  "src",
  "https://cdn0.iconfinder.com/data/icons/phosphor-regular-vol-3/256/pause-512.png"
);
pauseButton.append(pauseBtnImg);

//musica

const song = new Audio(`/utils/Tetris_Soundtrack.mp3`);

//attiva/disattiva
let musicFlag = false;
song.volume = 0.1;

const verificaMusica = () => {
  const song = document.createElement("audio");
  return !!(
    song.canPlayType && song.canPlayType("audio/mpeg;").replace(/no/, "")
  );
};

const riproduci = () => {
  if (!musicFlag) {
    if (verificaMusica()) {
      song.play();
      song.loop = true;
      song.volume = 0.1;
      musicFlag = true;
      musicBtnImg.setAttribute(
        "src",
        "https://cdn2.iconfinder.com/data/icons/squircle-ui/32/Sound-1024.png"
      );
    }
  } else {
    song.pause();
    musicFlag = false;
    musicBtnImg.setAttribute(
      "src",
      "https://cdn2.iconfinder.com/data/icons/squircle-ui/32/No_sound-512.png"
    );
  }
};

//avviaMusica
const musicButton = document.createElement("div");
const musicBtnImg = document.createElement("img");
musicButton.className = "musicButton";
musicBtnImg.setAttribute(
  "src",
  "https://cdn2.iconfinder.com/data/icons/squircle-ui/32/No_sound-512.png"
);
musicButton.append(musicBtnImg);

//Pulsanti
const buttonsContenitor = document.createElement("div");
buttonsContenitor.className = "buttonsContenitor";
buttonsContenitor.append(pauseButton, musicButton);

//---Punteggio

//Punti della partita
let points = 0;

//Punti a schermo
const pointsView = document.createElement("div");
pointsView.textContent = `Punteggio: ${points}`;
pointsView.className = "pointsView";

//Lista punteggi
const pointsList = document.createElement("div");
pointsList.className = "pointsList";

//Per disattivare l'intervallo se present il touchY
let moveFlag = true;

//Per movimento in touch
let newX;
let newY;
let lastTouchX;
let lastTouchY;
let touchMoved = false;
let touchInterval = null;

//pulisci touchY
const clearTouchY = () => {
  lastTouchY = newY;
  clearInterval(touchInterval);
  touchInterval = null;
  moveFlag = true;
};

//creo il valore della larghezza di una riga di quadrati
let width = 10;

//Creo le forme (tetrominoes) e il loro contenitore

//Standard
const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

//Invertiti
const lTetrominoR = [
  [0, width, width * 2, -1],
  [width, width - 1, width - 2, width * 2 - 2],
  [0, width, width * 2, width * 2 + 1],
  [width, width + 1, width + 2, +2],
];

const zTetrominoR = [
  [width - 1, width - 2, width * 2, width * 2 - 1],
  [0, width, width - 1, width * 2 - 1],
  [width - 1, width - 2, width * 2, width * 2 - 1],
  [0, width, width - 1, width * 2 - 1],
];

//Contenitore delle forme
const tetrominoes = [
  lTetromino,
  zTetromino,
  tTetromino,
  oTetromino,
  iTetromino,
  lTetrominoR,
  zTetrominoR,
];

//Colori random dei tetromini
const tetrColor = ["green", "purple", "red", "yellow", "blue"];

//Setto la posizione e la rotazione iniziale dei tetromini
let tetrPosition = 4;
let tetrRotation = 0;

//Numero casuale per la creazione dei tetromini
let randomNum = Math.floor(Math.random() * tetrominoes.length);

//Numero casuale per il colore dei tetromini
let randomColorNum = Math.floor(Math.random() * tetrColor.length);
let tempColor = randomColorNum;

//Tetromino corrente
let currenTetr = tetrominoes[randomNum][tetrRotation];

//Creo la griglia nel main
const gameBoard = document.createElement("div");
gameBoard.className = "gameBoard";
main.append(gameBoard, buttonsContenitor, pointsView);

//popolo i quadrati della griglia e la loro larghezza

for (let i = 0; i < 200; i++) {
  const square = document.createElement("div");
  square.className = "square";
  gameBoard.appendChild(square);
}

//conservo i singoli quadretti

let squares = Array.from(document.querySelectorAll(".square"));

//
//Eventi di gioco
//

//Tabella dei punti

//pulsante di ritorno
const pointsRemoveBtn = document.createElement("div");
pointsRemoveBtn.className = "pointsRemoveBtn";
pointsRemoveBtn.textContent = "torna indietro";

const showPointsList = () => {
  pointsList.innerHTML = "";
  const pointRow = document.createElement("div");
  pointRow.className = "pointRow";
  pointRow.textContent = "I TUOI PUNTEGGI";
  pointsList.append(pointRow);
  if (!mainMenu.querySelector(".pointsList")) {
    tuttiPunteggi.forEach((points, i) => {
      const pointRow = document.createElement("div");
      pointRow.className = "pointRow";
      const pointsNumber = document.createElement("div");
      pointsNumber.className = "pointsNumber";
      pointsNumber.textContent = `${i + 1}`;
      const rowPoints = document.createElement("div");
      rowPoints.className = "rowPoints";
      rowPoints.textContent = `${points}`;
      pointRow.append(pointsNumber, rowPoints);
      pointsList.appendChild(pointRow);
    });
    mainMenu.removeChild(mainOptions);
    mainMenu.append(pointsList, pointsRemoveBtn);
  } else {
    mainMenu.removeChild(pointsList);
    mainMenu.removeChild(pointsRemoveBtn);
    mainMenu.append(mainOptions);
  }
};

//Ritorno al menu principale
const backToMain = () => {
  const actualMenu = document.querySelector(".menu");
  actualMenu ? main.removeChild(actualMenu) : null;
  musicFlag ? song.pause() : null;
  musicFlag = false;
  musicBtnImg.setAttribute(
    "src",
    "https://cdn2.iconfinder.com/data/icons/squircle-ui/32/No_sound-512.png"
  );
  points = 0;
  pointsView.textContent = `Punteggio: ${points}`;
  main.append(mainMenu);
};

//fine partita

const stopAll = () => {
  if (
    currenTetr.some(
      (i) =>
        !squares[tetrPosition - width] &&
        squares[tetrPosition + i + width].classList.contains("taked")
    )
  ) {
    document.removeEventListener("keyup", singleAction);
    document.removeEventListener("keydown", multyAction);
    !document.querySelector(".menu") ? main.appendChild(endMenu) : null;
    musicFlag ? song.pause() : null;
    musicFlag = false;
    musicBtnImg.setAttribute(
      "src",
      "https://cdn2.iconfinder.com/data/icons/squircle-ui/32/No_sound-512.png"
    );
    if (
      tuttiPunteggi.some((actualPoints) => points === actualPoints) ||
      points === 0
    ) {
      return;
    } else {
      if (tuttiPunteggi.length > 10) {
        tuttiPunteggi = tuttiPunteggi.splice(0, 9);
      }
      localStorage.setItem(
        "punteggi",
        JSON.stringify([...tuttiPunteggi, points])
      );
      tuttiPunteggi = JSON.parse(localStorage.getItem("punteggi"));
      tuttiPunteggi.map((points, i) => {
        const pointRow = document.createElement("div");
        pointRow.className = "pointRow";
        const pointsNumber = document.createElement("div");
        pointsNumber.className = "pointsNumber";
        pointsNumber.textContent = `${i + 1}`;
        const rowPoints = document.createElement("div");
        rowPoints.className = "rowPoints";
        rowPoints.textContent = `${points}`;
      });
      tuttiPunteggi.sort((a, b) => b - a);
    }
  }
};

//ricominciaPartita

const newGame = (menu) => {
  document.addEventListener("keyup", singleAction);
  document.addEventListener("keydown", multyAction);
  main.removeChild(menu);
  song.currentTime = 0;
  squares.forEach((square) => {
    square.classList.remove("tetromino");
    square.classList.remove("taked");
    square.style.backgroundColor = "";
  });
  points = 0;
  pointsView.textContent = `Punteggio: ${points}`;
  newTetr();
};

//Crea un tetromino

const createTetr = () => {
  currenTetr.forEach((i) => {
    if (!squares[tetrPosition + i].classList.contains("taked")) {
      squares[tetrPosition + i].classList.add("tetromino");
      squares[tetrPosition + i].style.backgroundColor =
        tetrColor[randomColorNum];
    } else {
      stopAll();
      return;
    }
  });
};

//Cancellare un tetromino

const deleteTetr = () => {
  currenTetr.forEach((i) => {
    if (
      currenTetr.some(
        (i) =>
          !squares[tetrPosition - width] &&
          squares[tetrPosition + i].classList.contains("taked")
      )
    ) {
      return;
    } else {
      squares[tetrPosition + i].classList.remove("tetromino");
      squares[tetrPosition + i].style.backgroundColor = "";
    }
  });
};

//Discesa del tetromino

const fall = () => {
  stopTetr();
  deleteTetr();
  tetrPosition = tetrPosition + width;
  createTetr();
};

//Interval per discesa

const moveInterval = setInterval(() => {
  if (
    !document.querySelector(".menu") &&
    !document.querySelector(".mainMenu") &&
    moveFlag
  ) {
    fall();
  }
}, 900);

//Nuovo tetromino

const newTetr = () => {
  //Resetta le variabili per un nuovo tetromino
  tetrPosition = 4;
  tetrRotation = 0;
  randomNum = Math.floor(Math.random() * tetrominoes.length);
  randomColorNum = Math.floor(Math.random() * tetrColor.length);
  currenTetr = tetrominoes[randomNum][tetrRotation];
  createTetr();
};

//Fermare il tetromino

const stopTetr = () => {
  if (
    currenTetr.some(
      (i) =>
        !squares[tetrPosition + i + width] ||
        squares[tetrPosition + i + width].classList.contains("taked")
    )
  ) {
    currenTetr.forEach((i) => squares[tetrPosition + i].classList.add("taked"));
    rowDestruction();
    newTetr();
  }
};

//Distruzione della riga

const rowDestruction = () => {
  for (let i = 0; i < 199; i += width) {
    const row = [
      squares[i],
      squares[i + 1],
      squares[i + 2],
      squares[i + 3],
      squares[i + 4],
      squares[i + 5],
      squares[i + 6],
      squares[i + 7],
      squares[i + 8],
      squares[i + 9],
    ];
    if (row.every((square) => square.classList.contains("taked"))) {
      row.forEach((square) => {
        square.classList.remove("taked");
        square.classList.remove("tetromino");
        square.style.backgroundColor = "#f4f4f4c7";
        square.classList.add("rowDestruction");
        const whiteTimeout = setTimeout(() => {
          square.classList.remove("rowDestruction");
          square.style.backgroundColor = "";
          clearTimeout(whiteTimeout);
        }, 200);
      });
      const squareTimeout = setTimeout(() => {
        const squaresRemoved = squares.splice(i, width);
        points = points + squaresRemoved.length;
        pointsView.textContent = `Punteggio: ${points}`;
        squares = [...squaresRemoved, ...squares];
        if (!fall()) {
          deleteTetr();
          squares.forEach((square) => gameBoard.appendChild(square));
          tetrPosition = tetrPosition - squaresRemoved.length;
          createTetr();
          clearTimeout(squareTimeout);
        }
      }, 210);
    }
  }
};

//
//Azioni
//

//Roteazione del tetromino

const setTetrRotation = () => {
  deleteTetr();
  // Salva la rotazione corrente e la posizione del tetromino
  const currentPosition = tetrPosition;
  const currentRotation = tetrRotation;

  if (
    currenTetr.some(
      (i) =>
        (randomNum == 4 && tetrPosition + i) % width == 8 &&
        (tetrRotation == 0 || tetrRotation == 2)
    )
  ) {
    tetrPosition--;
  }
  //Contralla che il tetromino non compenetri coi bordi
  //dal basso
  if (
    currenTetr.some(
      (i) =>
        !squares[tetrPosition + i + width] ||
        squares[tetrPosition + i + width].classList.contains("taked")
    )
  ) {
    tetrPosition = tetrPosition - width;
  }
  //sinistra
  if (
    currenTetr.some((i) => (tetrPosition + i) % width === 0) &&
    randomNum !== 3 && // --- oTetromino
    randomNum !== 1 // --- zTetromino
  ) {
    tetrPosition++;
    //Verifico i casi particolari
    if (randomNum == 6 && (tetrRotation == 0 || tetrRotation == 2)) {
      // --- zTetrominoR
      tetrPosition--;
    } else if (
      // --- tTetromino
      randomNum == 2 &&
      (tetrRotation == 0 || tetrRotation == 2 || tetrRotation == 3)
    ) {
      tetrPosition--;
    } else if (
      // --- lTetromino
      randomNum == 0 &&
      (tetrRotation == 1 || tetrRotation == 2 || tetrRotation == 3)
    ) {
      tetrPosition--;
      tetrRotation == 3 ? tetrPosition-- : null;
    } else if (randomNum == 5 && (tetrRotation == 1 || tetrRotation == 2)) {
      // --- lTetrominoR
      tetrPosition--;
      tetrRotation == 1 ? tetrPosition-- : null;
    }
  }
  //destra
  if (
    currenTetr.some((i) => (tetrPosition + i) % width === width - 1) &&
    randomNum !== 3 && // --- oTetromino
    randomNum !== 6 // --- zTetrominoR
  ) {
    tetrPosition--;
    //Verifico i casi particolari
    if (randomNum == 4 && (tetrRotation == 0 || tetrRotation == 2)) {
      // --- iTetromino
      tetrPosition--;
    } else if (randomNum == 4 && (tetrRotation == 1 || tetrRotation == 3)) {
      // --- iTetromino (Caso inverso)
      tetrPosition++;
    } else if (randomNum == 1 && (tetrRotation == 0 || tetrRotation == 2)) {
      // --- zTetromino
      tetrPosition++;
    } else if (
      // --- tTetromino
      randomNum == 2 &&
      (tetrRotation == 0 || tetrRotation == 2 || tetrRotation == 1)
    ) {
      tetrPosition++;
    } else if (
      // --- lTetromino
      randomNum == 0 &&
      (tetrRotation == 0 || tetrRotation == 1 || tetrRotation == 3)
    ) {
      tetrPosition++;
      tetrRotation == 1 ? tetrPosition++ : null;
    } else if (randomNum == 5 && (tetrRotation == 0 || tetrRotation == 3)) {
      // --- lTetrominoR
      tetrPosition++;
      tetrRotation == 3 ? (tetrPosition = tetrPosition + 2) : null;
    }
  }
  //Cambia la variabile di rotazione in base alla posizione attuale
  if (tetrRotation < currenTetr.length - 1) {
    tetrRotation++;
  } else {
    tetrRotation = 0;
  }
  //ricrea il tetromino con la rotazione aggiornata
  currenTetr = tetrominoes[randomNum][tetrRotation];
  // Controlla se la rotazione causa una collisione
  const isColliding = currenTetr.some((i) =>
    squares[tetrPosition + i].classList.contains("taked")
  );
  if (isColliding) {
    // Se c'è una collisione, ripristina la rotazione e la posizione precedenti
    tetrRotation = currentRotation;
    tetrPosition = currentPosition;
    currenTetr = tetrominoes[randomNum][tetrRotation];
    createTetr();
  } else {
    // Altrimenti, crea il tetromino con la nuova rotazione
    createTetr();
  }
};

//Movimento a sinistra

const moveLeft = () => {
  if (
    currenTetr.some((i) => (tetrPosition + i) % width === 0) ||
    currenTetr.some((i) =>
      squares[tetrPosition + i - 1].classList.contains("taked")
    )
  ) {
    return;
  } else {
    deleteTetr();
    //Cambia la variabile di rotazione in base alla posizione attuale
    tetrPosition--;
    createTetr();
  }
};

//Movimento a destra

const moveRight = () => {
  if (
    currenTetr.some(
      (i) =>
        squares[tetrPosition + i + 1].classList.contains("taked") ||
        currenTetr.some((i) => (tetrPosition + i) % width === width - 1)
    )
  ) {
    return;
  } else {
    deleteTetr();
    //Cambia la variabile di rotazione in base alla posizione attuale
    tetrPosition++;
    createTetr();
  }
};

//Posiziona subito

const fastPlace = () => {
  const placeInterval = setInterval(() => {
    if (
      currenTetr.some(
        (i) =>
          !squares[tetrPosition + i + width] ||
          squares[tetrPosition + i + width].classList.contains("taked")
      )
    ) {
      stopTetr();
      clearInterval(placeInterval);
    } else {
      fall();
    }
  });
};

//Attiva/disattiva menu di pausa

const setPauseMenu = () => {
  if (!document.querySelector(".menu")) {
    main.appendChild(pauseMenu);
  } else {
    main.removeChild(pauseMenu);
  }
};

const touchEvents = (e) => {
  lastTouchY = 0;
  let isTouchingBorder = false; //Una condizione di uscita per evitare per le if
  if (!document.querySelector(".mainMenu")) {
    e.preventDefault();
    let touch = e.touches[0]; // Ottieni il primo tocco
    newX = Math.floor((gameBoard.clientWidth + touch.pageX) / 25); // Sposta il tetromino sull'asse X
    newY = Math.floor((gameBoard.clientHeight + touch.pageY) / 25); // Sposta il tetromino sull'asse Y
    if (newX > lastTouchX) {
      clearTouchY();
      if (
        currenTetr.some(
          (i) =>
            squares[tetrPosition + i + 1].classList.contains("taked") ||
            currenTetr.some((i) => (tetrPosition + i) % width === width - 1)
        )
      ) {
        isTouchingBorder = true;
      } else {
        moveRight();
      }
      touchMoved = true;
    } else if (newX < lastTouchX) {
      console.log(newX);
      clearTouchY();
      if (
        currenTetr.some((i) => (tetrPosition + i) % width === 0) ||
        currenTetr.some((i) =>
          squares[tetrPosition + i - 1].classList.contains("taked")
        )
      ) {
        isTouchingBorder = true;
      } else {
        moveLeft();
      }
      touchMoved = true;
    } else if (newY > lastTouchY) {
      if (!touchInterval) {
        moveFlag = false;
        touchInterval = setInterval(() => fall(), 180);
      }
      touchMoved = true;
    }
    lastTouchX = newX;
  }
};

//
//Comandi per ottenere le azioni su schermo
//

//Pressione singola
const singleAction = (e) => {
  switch (e.keyCode) {
    case 38:
      fastPlace();
      break;
  }
  switch (e.key) {
    case "w":
      fastPlace();
      break;
    case " ":
      setTetrRotation();
      break;
    case "Escape":
      setPauseMenu();
      break;
  }
};

//Pressione continua

const multyAction = (e) => {
  switch (e.keyCode) {
    case 37:
      moveLeft();
      break;
    case 39:
      moveRight();
      break;
    case 40:
      fall();
      break;
  }
  switch (e.key) {
    case "a":
      moveLeft();
      break;
    case "s":
      fall();
      break;
    case "d":
      moveRight();
      break;
  }
};

//Eventi per le selezioni

const selectionsEvents = (select) => {
  switch (select.textContent) {
    case "riprendi":
      setPauseMenu();
      break;
    case "Nuova partita":
      newGame(mainMenu);
      break;
    case "riprova":
      newGame(endMenu);
      break;
    case "riavvia":
      newGame(pauseMenu);
      break;
    case "torna al menu principale":
      backToMain();
      break;
    case "i tuoi punteggi":
      showPointsList();
      break;
    case "esci dal gioco":
      window.close();
      break;
  }
};

document.addEventListener("keyup", singleAction);
document.addEventListener("keydown", multyAction);
gameBoard.addEventListener("touchstart", (e) => {
  if (!document.querySelector(".mainMenu")) {
    e.preventDefault();
    touchMoved = false;
  }
});
gameBoard.addEventListener("touchend", (e) => {
  if (!document.querySelector(".mainMenu")) {
    e.preventDefault();
    if (!touchMoved) {
      touchMoved = false;
      setTetrRotation();
    }
  }
});
main.addEventListener("touchmove", touchEvents);
main.addEventListener("touchend", () => clearTouchY());
pauseButton.addEventListener("click", () => setPauseMenu());
musicButton.addEventListener("click", () => riproduci());
pointsRemoveBtn.addEventListener("click", showPointsList);
