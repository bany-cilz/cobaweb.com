const grid = document.getElementById("tetris-grid");
const scoreDisplay = document.getElementById("score");

const width = 10;
const height = 20;
const gridSize = width * height;
let squares = [];
let currentPosition = 4;
let currentRotation = 0;
let score = 0;
let timerId;
let currentTetromino;

// Buat grid
function createGrid() {
  grid.innerHTML = "";
  squares = [];

  for (let i = 0; i < gridSize; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
    squares.push(square);
  }
}

// Tetromino shapes
const tetrominoes = [
  // L
  [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ],
  // Z
  [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ],
  // T
  [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ],
  // O
  [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ],
  // I
  [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ],
];

// Pilih random tetromino
function randomTetromino() {
  const random = Math.floor(Math.random() * tetrominoes.length);
  return {
    shape: tetrominoes[random],
    index: 0,
  };
}

// Gambar tetromino
function draw() {
  currentTetromino.shape[currentTetromino.index].forEach(index => {
    squares[currentPosition + index]?.classList.add("tetromino");
  });
}

function undraw() {
  currentTetromino.shape[currentTetromino.index].forEach(index => {
    squares[currentPosition + index]?.classList.remove("tetromino");
  });
}

// Gerak ke bawah
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

// Freeze jika sudah sampai bawah
function freeze() {
  if (
    currentTetromino.shape[currentTetromino.index].some(index =>
      squares[currentPosition + index + width]?.classList.contains("taken")
    )
  ) {
    currentTetromino.shape[currentTetromino.index].forEach(index => {
      squares[currentPosition + index].classList.add("taken");
    });
    checkLines();
    currentTetromino = randomTetromino();
    currentPosition = 4;
    draw();
    gameOver();
  }
}

// Hapus baris penuh
function checkLines() {
  for (let i = 0; i < gridSize; i += width) {
    const row = Array.from({ length: width }, (_, k) => i + k);
    if (row.every(index => squares[index].classList.contains("taken"))) {
      score += 10;
      scoreDisplay.innerText = score;
      row.forEach(index => {
        squares[index].classList.remove("taken", "tetromino");
      });
      const removed = squares.splice(i, width);
      squares = removed.concat(squares);
      squares.forEach(square => grid.appendChild(square));
    }
  }
}

// Game Over
function gameOver() {
  if (
    currentTetromino.shape[currentTetromino.index].some(index =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    clearInterval(timerId);
    alert("Game Over!");
  }
}

// Kontrol
function moveLeft() {
  undraw();
  const isAtLeftEdge = currentTetromino.shape[currentTetromino.index].some(index =>
    (currentPosition + index) % width === 0
  );
  if (!isAtLeftEdge) currentPosition -= 1;
  draw();
}

function moveRight() {
  undraw();
  const isAtRightEdge = currentTetromino.shape[currentTetromino.index].some(index =>
    (currentPosition + index) % width === width - 1
  );
  if (!isAtRightEdge) currentPosition += 1;
  draw();
}

function rotate() {
  undraw();
  currentTetromino.index = (currentTetromino.index + 1) % 4;
  draw();
}

// Tombol keyboard juga bisa (opsional)
document.addEventListener("keydown", e => {
  if (!timerId) return;
  if (e.key === "ArrowLeft") moveLeft();
  else if (e.key === "ArrowRight") moveRight();
  else if (e.key === "ArrowUp") rotate();
  else if (e.key === "ArrowDown") moveDown();
});

// Fungsi utama untuk mulai game
function startGame() {
    console.log("startGame dipanggil");
  createGrid();
  score = 0;
  scoreDisplay.innerText = score;
  currentTetromino = randomTetromino();
  currentPosition = 4;
  draw();
  clearInterval(timerId);
  timerId = setInterval(moveDown, 500);
}
