//###elements###
const container = document.querySelector('.container');

//controls elements
const panelsBtn = document.querySelectorAll('.header button'),
previewImg = document.querySelector('.preview-img img'),
chooseImgBtn = document.querySelector('.choose-img'),
fileInput = document.querySelector('.file-input'),
saveImgBtn = document.querySelector('.save-img'),
cropImg = document.querySelector('.crop-img');

//filter elements
const filterOptions = document.querySelectorAll('.filter button'),
filterValue = document.querySelector('.filter-info .value'),
rotateOptions = document.querySelectorAll('.rotate button'),
filterName = document.querySelector('.filter-info .name'),
resetFilterBtn = document.querySelector('.reset-filter'),
filterSlider = document.querySelector('.slider input');

//corp elements
const widthInput = document.querySelector(".width input"),
positionX = document.querySelector('.positionx input'),
positionY = document.querySelector('.positiony input'),
heightInput = document.querySelector(".height input"),
ratio = document.querySelector('.ratio');

//drawing elements

const toolsBtn = document.querySelectorAll('.tools'),
fillColor = document.querySelector('#fill-color');
sizeSlider = document.querySelector('#size-slider'),
colorBtn = document.querySelectorAll('.colors .option'),
colorPicker = document.querySelector('#color-picker'),
clearCanvas = document.querySelector('.clear-canvas');


//###program logic###

//##panels logic##

//filter panel

//filter variables
let brightness = 100,
saturation = 100,
grayscale = 0,
inversion = 0;

let rotate = 0,
flipHorizontal = 1,
flipVertical = 1;

//control logic

filterOptions.forEach(filter =>{
    filter.addEventListener('click',() => {
        document.querySelector('.filter .active').classList.remove('active');
        filter.classList.add('active');
        filterName.innerText=filter.innerText;
        if(filter.id == 'brightness'){
            filterSlider.max = '200'

            filterSlider.value = brightness;

            filterValue.innerText = `${brightness}%`;

        }else if(filter.id == 'saturation'){
            filterSlider.max = '200'

            filterSlider.value = saturation;

            filterValue.innerText = `${saturation}%`;

        }else if(filter.id == 'grayscale'){
            filterSlider.max = '100'

            filterSlider.value = grayscale;

            filterValue.innerText = `${grayscale}%`;

        }else{
            filterSlider.max = '100'

            filterSlider.value = inversion;

            filterValue.innerText = `${inversion}%`;

        }
    })
});

filterSlider.addEventListener('input',updateFilter);

rotateOptions.forEach(option => {
    option.addEventListener('click',() => {
        if(option.id == 'left'){
            rotate -=90;
        }else if(option.id == 'right'){
            rotate +=90;
        }else if(option.id == 'vertical'){
            flipVertical = flipVertical == 1 ? -1 : 1;
        }else{
            flipHorizontal = flipHorizontal == 1 ? -1 : 1;
        }
        applyFilter()
    });
});

//controls

//controls variables
let panel = 'filter',
fileName = "",
extention = 'png';

//controls logic

panelsBtn.forEach(btn => {
    btn.addEventListener('click',() => {
        if(btn.id == 'filter'){
            panel == 'filter' ? console.log('already here') : (panel == 'crop' ? cropToFilter() : drawToFilter());
            panel = 'filter';
            document.querySelector('.header .active').classList.remove('active');
            btn.classList.add('active');
            document.querySelector('.top').classList.remove('top');
            document.querySelector(`.wrapper #${btn.id}`).classList.add('top');
            container.classList.remove('cropping');
            }else if(btn.id == 'crop'){
            panel == 'crop' ? console.log('already here crop') : (panel == 'filter' ? filterToCrop() : drawToCrop());
            panel = 'crop';
            document.querySelector('.header .active').classList.remove('active');
            btn.classList.add('active');
            document.querySelector('.top').classList.remove('top');
            document.querySelector(`.wrapper #${btn.id}`).classList.add('top');
            container.classList.add('cropping');
        }else{
            panel == 'drawing' ? console.log('already here draw') : (panel == 'filter' ? filterToDraw() : cropToDraw());
            panel = 'drawing';
            document.querySelector('.header .active').classList.remove('active');
            btn.classList.add('active');
            document.querySelector('.top').classList.remove('top');
            document.querySelector(`.wrapper #${btn.id}`).classList.add('top');
            container.classList.remove('cropping');
            testing();  
        }
    })
})

fileInput.addEventListener('change',loadImg);
chooseImgBtn.addEventListener('click',() => {
    fileInput.click();
});

resetFilterBtn.addEventListener('click',resetFilter);
saveImgBtn.addEventListener('click',saveImg);

//crop panel

//crop variables
let cropper = "";
//crop logic

widthInput.addEventListener("input", () => {
    const { width } = cropper.getImageData();
    if (parseInt(widthInput.value) > Math.round(width)) {
    widthInput.value = Math.round(width);
    }
    let newWidth = parseInt(widthInput.value);
    cropper.setCropBoxData({ width: newWidth });
});

heightInput.addEventListener("input", () => {
    const { height } = cropper.getImageData();
    if (parseInt(heightInput.value) > Math.round(height)) {
    heightInput.value = Math.round(height);
    }
    let newHeight = parseInt(heightInput.value);
    cropper.setCropBoxData({ height: newHeight });
});

ratio.addEventListener('change',e => {
    if (e.target.value == "free") {
        cropper.setAspectRatio(NaN);
    } else {
        cropper.setAspectRatio(eval(e.target.value));
    }
})

positionX.addEventListener('input',() => {
    cropper.moveTo(positionX.value, positionY.value);
});

positionY.addEventListener('input',() => {
    cropper.moveTo(positionX.value, positionY.value);
});

cropImg.addEventListener('click',() => {
    previewImg.src = cropper.getCroppedCanvas({}).toDataURL();
    cropper.destroy();
    cropper = new Cropper(previewImg);
});


//drawing panel

//drawing variables

let canvas='',
ctx = '',
prevMouseX,prevMouseY,snapShot,
isDrawing = false,
selectedTool = 'brush',
brushWidth = 3,
selectedColor = '#000';

//drawing logic

function testing(){
    sizeSlider.addEventListener('change',() => {
        brushWidth = sizeSlider.value;
    });

    toolsBtn.forEach(btn => {
        btn.addEventListener('click',() => {
            document.querySelector('.drawing .options .active').classList.remove('active');
            btn.classList.add('active');
            selectedTool = btn.id;
        });
    });

    colorBtn.forEach(btn => {
        btn.addEventListener('click',(e) => {
            document.querySelector('.options .selected').classList.remove('selected');
            btn.classList.add('selected');
            selectedColor =window.getComputedStyle(btn).getPropertyValue('background-color');
        });
    });

    colorPicker.addEventListener('change',() => {
        colorPicker.parentElement.style.background = colorPicker.value;
        colorPicker.parentElement.click();
    });

    clearCanvas.addEventListener('click',() => {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        setCanvasBackground();
    });

    canvas.addEventListener('mousedown',startDraw)
    canvas.addEventListener('mousemove',drawing);
    canvas.addEventListener('mouseup',() => { isDrawing=false; })
    canvas.addEventListener('mouseleave',() => { isDrawing=false; });

}

//##switching logic##

//filter

function cropToFilter(){
    cropper.destroy();
    previewImg.classList.remove('editing');
    document.querySelector('.preview-img canvas').remove();
    resetFilter();
}

function drawToFilter(){
    previewImg.src = document.querySelector('.preview-img canvas').toDataURL();
    resetFilter();
    previewImg.classList.remove('editing');
    document.querySelector('.preview-img canvas').remove();
}

//crop

function filterToCrop(){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = previewImg.clientWidth;
    canvas.height = previewImg.clientHeight;
    ctx.filter =`brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal,flipVertical)
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2,canvas.width,canvas.height);
    document.querySelector('.preview-img').appendChild(canvas);
    canvas.classList.add('crop-canvas');
    previewImg.classList.add('editing');
    cropper = new Cropper(canvas);
}

function drawToCrop(){
    previewImg.classList.add('editing');
    document.querySelector('.preview-img canvas').classList.add('crop-canvas');
    cropper = new Cropper(document.querySelector('.preview-img canvas'));
}

//draw

function filterToDraw(){
    //setting the canvas
    const filteredCanvas = document.createElement('canvas'),
    filteredCtx= filteredCanvas.getContext('2d');
    filteredCanvas.width = previewImg.clientWidth;
    filteredCanvas.height = previewImg.clientHeight;
    filteredCtx.filter =`brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    filteredCtx.translate(filteredCanvas.width / 2, filteredCanvas.height / 2);
    if(rotate !== 0){
        filteredCtx.rotate(rotate * Math.PI / 180);
    }
    filteredCtx.scale(flipHorizontal,flipVertical);
    filteredCtx.drawImage(previewImg, -filteredCanvas.width / 2, -filteredCanvas.height / 2,filteredCanvas.width,filteredCanvas.height);

    previewImg.src = filteredCanvas.toDataURL();
    //adding the canvas to the img container
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = previewImg.clientWidth;
    canvas.height = previewImg.clientHeight;
    ctx.drawImage(filteredCanvas, 0, 0, canvas.width, canvas.height);
    document.querySelector('.preview-img').appendChild(canvas);
    previewImg.classList.add('editing');
}

function cropToDraw(){
    cropper.destroy();
    previewImg.classList.remove('editing');
    if(document.querySelector('.preview-img canvas')){
        document.querySelector('.preview-img canvas').remove();
    }

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = previewImg.clientWidth;
    canvas.height = previewImg.clientHeight;
    ctx.drawImage(previewImg, 0, 0,canvas.width,canvas.height);

    previewImg.classList.add('editing');
    document.querySelector('.preview-img').appendChild(canvas);
}

//make a variables that store tha last values every time

//###helper functions###
//controls functions
function loadImg(){
    let file = fileInput.files[0];
    cropper
    heightInput.value = 0;
    widthInput.value = 0;
    if(!file){
        return;
    };
    let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if(validExtensions.includes(file.type)){
        extention = file.type.split('/')[1];
        previewImg.src = URL.createObjectURL(file);
        previewImg.addEventListener('load',()=>{
            resetFilterBtn.click();
            container.classList.remove('disable');
        });
    }else{
        //some errors
    }
    fileName = file.name.split(".")[0];
}

function saveImg(){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const a = document.createElement('a');
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    ctx.filter =`brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal,flipVertical)
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2,canvas.width,canvas.height);
    if(panel == 'drawing'){
        a.href = document.querySelector('.preview-img canvas').toDataURL();
        a.download = `${fileName}.${extention}`
    }else{
        a.href = canvas.toDataURL();
        a.download = `${fileName}.${extention}`
    }
    a.click()
}

//filter functions

function updateFilter(){
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector('.filter .active');
    if(selectedFilter.id == 'brightness'){
        brightness = filterSlider.value;
    }else if(selectedFilter.id == 'saturation'){
        saturation = filterSlider.value;
    }else if(selectedFilter.id == 'grayscale'){
        grayscale = filterSlider.value;
    }else{
        inversion = filterSlider.value;
    }
    applyFilter();
}

function applyFilter(){
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal},${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

function resetFilter(){
brightness = 100;
saturation = 100;
grayscale = 0;
inversion = 0;
rotate = 0;
flipHorizontal = 1;
flipVertical = 1;
filterOptions[0].click();
applyFilter();
}

//drawing functions
function startDraw(e){
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

function drawRect(e){
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX , prevMouseY - e.offsetY);
    }else{
        ctx.fillRect(e.offsetX,e.offsetY,prevMouseX - e.offsetX , prevMouseY - e.offsetY);
    }
}

function drawCircle(e){
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY ), 2));
    ctx.arc(prevMouseX,prevMouseY,radius,0, 2 * Math.PI);
    ctx.stroke();
    if(!fillColor.checked){
        ctx.stroke;
    }else{
        ctx.fill();
    }
}

function drawTriangle(e){
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX,e.offsetY);
    ctx.closePath();
    if(!fillColor.checked){
        ctx.stroke();
    }else{
        ctx.fill();
    }
}

function drawing(e){
    if(!isDrawing) return;
    ctx.putImageData(snapShot,0,0);
    if(selectedTool == 'brush' || selectedTool == 'eraser'){
        ctx.strokeStyle = selectedTool == 'eraser' ? '#fff' : selectedColor;
        ctx.lineTo(e.offsetX,e.offsetY);
        ctx.stroke();
    } else if(selectedTool == 'rectangle'){
        drawRect(e);
    } else if(selectedTool == 'circle'){
        drawCircle(e);
    }else{
        drawTriangle(e);
    }
}

function setCanvasBackground(){
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle= selectedColor;
}


