const body = document.querySelector("body"),
      nav = document.querySelector("nav"),
      canvas = document.querySelector(".characterCanvas"),
      modeToggle = document.querySelector(".darkLight"),
      searchToggle = document.querySelector(".searchBox"),
      sideBarOpen = document.querySelector(".sideBarOpen"),
      sideBarClose = document.querySelector(".sideBarClose");

      let getMode = localStorage.getItem("mode");
    if(getMode && getMode === "darkMode"){
        body.classList.add("dark");
    };

    //toggle light and dark mode
      modeToggle.addEventListener("click", () => {
        modeToggle.classList.toggle("active");
        body.classList.toggle("dark");

        if(!body.classList.contains("dark")){
            localStorage.setItem("mode", "lightMode");
        }else{
            localStorage.setItem("mode", "darkMode");
        }
      });

      //toggle silly mode
      searchToggle.addEventListener("click", () => {
        searchToggle.classList.toggle("active");
        canvas.classList.toggle("show");
      });

      //toggle side bar
sideBarOpen.addEventListener("click", () => {
    nav.classList.add("active");
});
body.addEventListener("click", (e) => {
    let clickedElm = e.target;

    if (!clickedElm.classList.contains("sideBarOpen") && !clickedElm.classList.contains("menu")){
        nav.classList.remove("active");
    }
});



//================================= set canvas ===========//
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


//================================= user character ===========//
// * inspired by The Normie Programmer: https://www.youtube.com/watch?v=ZpZLmpKa2zw
const characterImage = new Image();
characterImage.src = "goose_v2.PNG";

const totalImageHeight = 1280;
const totalImageWidth = 1280;
const gooseHeight = 320;
const gooseWidth = 320;
const scale = 0.6;
const scaledWidth = gooseHeight * scale;
const scaledHeight = gooseWidth * scale;
const allowance = 15;

const character = {
    x: canvas.width / 2 - scaledWidth / 2,
    y: canvas.height / 2 - scaledHeight / 2,
    speed: 3,
    frameX: 0,
    frameY: 1,
    maxFrame: 4,
    frameTimer: 0,
    frameInterval: 10,
    idleFrameInterval: 30,
    moving: false,
    verticalMove: false,
    direction: "idle",
};

const animations = {
    walkDown: 0,
    idle: 1,
    walkUp: 2,
    walkRight: 3,
    walkLeft: 3,
};

const keys = {
    w: false, 
    s: false,
    a: false,
    d: false,
    shift: false,
};

//================================= update canvas ===========//
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    character.x = canvas.width / 2 - scaledWidth / 2;
    character.y = canvas.height / 2 - scaledHeight / 2;
    // drawCharacter();
};
resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function updateCharacter() {
    if (keys.shift) {
        character.speed = 6;
    }
    else {
        character.speed = 3;
    }

    if (keys.w && (character.y > character.speed)) {
        console.log(character.y)
        character.y -= character.speed;
        character.direction = "walkUp";
        character.moving = true;
        character.verticalMove = true;
    } else if (keys.s && (character.y + scaledHeight < canvas.height + character.speed)) {
        character.y += character.speed;
        character.direction = "walkDown";
        character.moving = true;
        character.verticalMove = true;
    } else if (keys.a && (character.x > character.speed)) {
        character.x -= character.speed;
        character.direction = "walkLeft";
        character.moving = true;
        character.verticalMove = false;
    } else if (keys.d && (character.x + scaledWidth < canvas.width + character.speed)) {
        character.x += character.speed;
        character.direction = "walkRight";
        character.moving = true;
        character.verticalMove = false;
    } else {
        character.direction = "idle";
        character.moving = false;
        character.verticalMove = false;
    }

    character.frameY = animations[character.direction];
    // console.log("ANIMATIONS: " + animations[character.direction]);

    character.frameTimer++;
    const currentInterval = character.moving ? character.frameInterval : character.idleFrameInterval;
    if (character.frameTimer >= currentInterval) {
        character.frameX = (character.frameX + 1) % character.maxFrame;
        character.frameTimer = 0;
        // console.log("sX: " + character.frameX + " sY: " + character.frameY);
    }

    //console.log(character.x);

};

function drawCharacter() {
    
    ctx.save();

    ctx.drawImage(
        characterImage,
        character.frameX * gooseWidth,
        character.frameY * gooseHeight,
        gooseWidth,
        gooseHeight,
        character.x,
        character.y,
        scaledWidth,
        scaledHeight,
    );
    ctx.restore();
};

function animate() {
    if (canvas.classList.contains('show')) {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        updateCharacter();
        drawCharacter();
        checkCollision();
    };
    requestAnimationFrame(animate);
};

// characterImage.onload = drawCharacter;
animate();


addEventListener("keydown", (e) => {
    if (e.key == 'Shift'){
        keys.shift = true;
    }
    switch(e.key.toLowerCase()) {
        case "w":
            keys.w = true;
            break;
        case "s":
            keys.s = true;
            break;
        case "a":
            keys.a = true;
            break;
        case "d":
            keys.d = true;
            break;
    }
});

addEventListener("keyup", (e) => {
    if (e.key == 'Shift'){
        keys.shift = false;
    }

    switch(e.key.toLowerCase()) {
        case "w":
            keys.w = false;
            break;
        case "s":
            keys.s = false;
            break;
        case "a":
            keys.a = false;
            break;
        case "d":
            keys.d = false;
            break;
    }
});

//====================draggable========================//
// * inspired by Appwrite: https://www.youtube.com/watch?v=ymDjvycjgUM
let newX = 0, newY = 0, startX = 0, startY = 0;

const card = document.getElementById('card');
card.addEventListener('mousedown', mouseDown);

function mouseDown(e) {
    startX = e.clientX;
    startY = e.clientY;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
};

function mouseMove(e) {
    newX = startX - e.clientX;
    newY = startY - e.clientY;

    startX = e.clientX;
    startY = e.clientY;

    card.style.top = (card.offsetTop - newY) + 'px';
    card.style.left = (card.offsetLeft - newX) + 'px';
};

function mouseUp(e){
    document.removeEventListener('mousemove', mouseMove);
};

// //--------------list of movableElements positions
// const moveableElements = document.querySelectorAll('.target');
// const moveablePos = [];
// for (let element of moveableElements) {
//     moveablePos.append({x: element.left, y: element.top});
// };

function checkCollision() {
    const moveableElements = document.querySelectorAll('.target');

    for (let element of moveableElements) {
        moveablePos = [element.left, element.top]; 
        checkIntersection(character, element, moveablePos);
    };
};


function checkIntersection(goose, element, pos) {
    let r2 = element.getBoundingClientRect();
    // y axis
    if (goose.verticalMove) {
        //bottom push
        if (goose.y <= r2.bottom &&
            goose.y >= (r2.bottom - allowance) &&
            goose.x <= r2.right &&
            (goose.x + scaledWidth) >= r2.left &&
            goose.direction == "walkUp") { 
                element.style.top = element.offsetTop - (r2.bottom - goose.y) + 'px';
            }
        //top push
        else if ((goose.y + scaledHeight) >= r2.top && 
            (goose.y + scaledHeight) <= (r2.top + allowance) &&
            goose.x <= r2.right &&
            (goose.x + scaledWidth) >= r2.left &&
            goose.direction == "walkDown") {
                element.style.top = (goose.y + scaledHeight) + 'px';
            };
        }
    // x axis
    else {
        //left push
        if (goose.x <= r2.right && 
            goose.x >= (r2.right - allowance) &&  
            goose.y + scaledHeight >= r2.top &&
            goose.y <= r2.bottom &&
            goose.direction == "walkLeft") {
                element.style.left = element.offsetLeft - (r2.right - goose.x) + "px";
            }
        //right push
        else if ((goose.x + scaledWidth) >= r2.left && 
            goose.x <= r2.left + allowance &&
            (goose.y + scaledHeight) >= r2.top &&
            goose.y <= r2.bottom &&
            goose.direction == "walkRight") {
                element.style.left = (goose.x + scaledWidth) + 'px';                
            };
    }
};
