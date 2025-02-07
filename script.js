// board 
let boardWidth = 720;
let boardHeight = 420;
let context;

// source
let sourceX = 100;
let sourceY = 210;
let sourceWidth = 50;
let sourceHeight = 50;

// obstruction
let obstrX = 300;
let obstrY = 250;
let obstrWidth = 75;
let obstrHeight = 100;

// rays
let raysAmount = 500;
let rays = [];

// initialize
window.onload = function() {
    const canvas = document.getElementById("board");
    context = canvas.getContext("2d");

    createRays();

    requestAnimationFrame(update);
    canvas.addEventListener('mousedown', mouseDown);
};

function update() {
    context.clearRect(0, 0, boardWidth, boardHeight);
    drawCircle(sourceX, sourceY, sourceWidth, "grey");
    drawCircle(obstrX, obstrY, obstrWidth, "blue");

    for (let i = 0; i < rays.length; i++) {
        drawRay(i);
    }

    requestAnimationFrame(update);
}

function mouseDown(e) {
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
}

function mouseMove(e) {
    const rect = context.canvas.getBoundingClientRect();
    sourceX = e.clientX - rect.left;
    sourceY = e.clientY - rect.top;

    createRays();
}

function mouseUp(e) {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
}

function createRays() {
    rays = [];
    let radStep = (360 / raysAmount) * (Math.PI / 180);

    for (let i = 0; i < raysAmount; i++) {
        let radians = radStep * i;
        let dx = Math.cos(radians);
        let dy = Math.sin(radians);

        let tMaxX = dx > 0 ? (boardWidth - sourceX) / dx : (dx < 0 ? -sourceX / dx : Infinity);
        let tMaxY = dy > 0 ? (boardHeight - sourceY) / dy : (dy < 0 ? -sourceY / dy : Infinity);
        let tBoard = Math.min(tMaxX, tMaxY);

        let tCircle = rayCircleIntersection(sourceX, sourceY, dx, dy, obstrX, obstrY, obstrWidth);
        let tFinal = Math.min(tBoard, tCircle);

        let newX = sourceX + tFinal * dx;
        let newY = sourceY + tFinal * dy;

        rays.push({ x: newX, y: newY });
    }
}


function rayCircleIntersection(rayX, rayY, dx, dy, circleX, circleY, radius) {
    let cx = circleX - rayX;
    let cy = circleY - rayY;

    let a = dx * dx + dy * dy;
    let b = -2 * (cx * dx + cy * dy);
    let c = cx * cx + cy * cy - radius * radius;
    
    let discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return Infinity; 

    let t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    let t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

    if (t1 > 0) return t1; 
    if (t2 > 0) return t2;
    
    return Infinity; 
}

function drawCircle(x, y, size, color) {
    context.beginPath();
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.stroke();
}

function drawRay(i) {
    context.beginPath();
    context.moveTo(sourceX, sourceY);
    context.lineTo(rays[i].x, rays[i].y);
    context.stroke();
}
