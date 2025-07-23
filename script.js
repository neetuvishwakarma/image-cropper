const imageInput = document.getElementById("imageInput");
const mainCanvas = document.getElementById("mainCanvas");
const previewCanvas = document.getElementById("previewCanvas");
const ctx = mainCanvas.getContext("2d");
const previewCtx = previewCanvas.getContext("2d");

const xCoord = document.getElementById("xCoord");
const yCoord = document.getElementById("yCoord");
const widthCoord = document.getElementById("widthCoord");
const heightCoord = document.getElementById("heightCoord");

let image = new Image();
let cropBox = {};
let isDragging = false;

imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            image.onload = () => {
                ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                ctx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

mainCanvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = mainCanvas.getBoundingClientRect();
    cropBox.startX = e.clientX - rect.left;
    cropBox.startY = e.clientY - rect.top;
});

mainCanvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const rect = mainCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        cropBox.width = Math.min(currentX - cropBox.startX, mainCanvas.width - cropBox.startX);
        cropBox.height = Math.min(currentY - cropBox.startY, mainCanvas.height - cropBox.startY);
        drawCanvas();
    }
});

mainCanvas.addEventListener("mouseup", () => {
    isDragging = false;
    updatePreview();
});

function drawCanvas() {
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);
    if (cropBox.width && cropBox.height) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(cropBox.startX, cropBox.startY, cropBox.width, cropBox.height);
        xCoord.textContent = Math.round(cropBox.startX);
        yCoord.textContent = Math.round(cropBox.startY);
        widthCoord.textContent = Math.round(cropBox.width);
        heightCoord.textContent = Math.round(cropBox.height);
    }
}

function updatePreview() {
    if (!cropBox.width || !cropBox.height) return;
    const imageData = ctx.getImageData(cropBox.startX, cropBox.startY, cropBox.width, cropBox.height);
    previewCanvas.width = cropBox.width;
    previewCanvas.height = cropBox.height;
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCtx.putImageData(imageData, 0, 0);
}
