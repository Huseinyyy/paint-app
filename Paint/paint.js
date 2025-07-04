const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let painting = false;
let brushColor = '#000000';
let brushSize = 5;

const paths = [];
let undonePaths = [];

function startPosition(e) {
  painting = true;
  ctx.beginPath();
  draw(e);
}

function endPosition() {
  painting = false;
  ctx.closePath();
  paths.push(canvas.toDataURL());
}

function draw(e) {
  if (!painting) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX || e.touches?.[0]?.clientX;
  const y = e.clientY || e.touches?.[0]?.clientY;

  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = brushColor;
  ctx.lineTo(x - rect.left, y - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - rect.left, y - rect.top);
}

document.getElementById('colorPicker').addEventListener('change', e => {
  brushColor = e.target.value;
});

document.getElementById('brushSize').addEventListener('input', e => {
  brushSize = e.target.value;
});

document.getElementById('clearBtn').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paths.length = 0;
  undonePaths.length = 0;
});

document.getElementById('undoBtn').addEventListener('click', () => {
  if (paths.length > 0) {
    undonePaths.push(paths.pop());
    restoreCanvas();
  }
});

document.getElementById('redoBtn').addEventListener('click', () => {
  if (undonePaths.length > 0) {
    const img = new Image();
    img.src = undonePaths.pop();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      paths.push(img.src);
    };
  }
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL();
  link.click();
});

function restoreCanvas() {
  if (paths.length > 0) {
    const img = new Image();
    img.src = paths[paths.length - 1];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', startPosition);
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', draw);
