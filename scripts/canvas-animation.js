let canvas = document.getElementById('waiting-canvas');
let context = canvas.getContext('2d');
let radius = 30;
let endPercent = 100;
let curPerc = 0;
let circ = Math.PI * 2;
let quart = Math.PI / 2;
let clockWise = false;

context.lineWidth = 5;
context.strokeStyle = '#ad2323';
context.shadowOffsetX = 0;
context.shadowOffsetY = 0;

function draw(currentPerc) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc('50', '50', radius, -quart, (circ * currentPerc)-quart, clockWise);
    context.stroke();

    curPerc ++;
    if (curPerc < endPercent) {
        requestAnimationFrame(() => draw(curPerc/100));
    }else{
        curPerc = 0;
        clockWise = !clockWise;
        requestAnimationFrame(() => draw(curPerc/100));
    }
}

draw();
