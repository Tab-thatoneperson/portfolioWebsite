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


body.addEventListener("click", (e) => {
    let clickedElm = e.target;

    if (clickedElm.classList.contains("cancel")){
        targetElementsXY.forEach((value, key) => {
            targetElementsXY.set(key, [0, 0]);
            key.style.transform = `translate(0px, 0px)`;
            key.style.transition = `transform 1s linear`;
        })
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
        // console.log(character.y)
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

//--------------list of movableElements with X and Y pos for translate function-------------------//
const targetElements = document.querySelectorAll('.target');
const targetElementsXY = new Map();
for (let element of targetElements) {
    targetElementsXY.set(element, [0, 0]);
}
console.log(targetElementsXY);

function checkCollision() {
    const moveableElements = document.querySelectorAll('.target');

    for (let element of moveableElements) {
        checkIntersection(character, element, targetElementsXY.get(element));
        element.style.transition = `none`;
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
                let moveY = (r2.bottom - goose.y);
                let posArray = targetElementsXY.get(element);
                posArray[1] = posArray[1] - moveY;
                element.style.transform = `translate(${posArray[0]}px, ${posArray[1]}px)`;
            }
        //top push
        else if ((goose.y + scaledHeight) >= r2.top && 
            (goose.y + scaledHeight) <= (r2.top + allowance) &&
            goose.x <= r2.right &&
            (goose.x + scaledWidth) >= r2.left &&
            goose.direction == "walkDown") {
                let posArray = targetElementsXY.get(element);
                let moveY = (goose.y + scaledHeight) - r2.top;
                console.log(moveY);
                posArray[1] = posArray[1] + moveY;
                element.style.transform = `translate(${posArray[0]}px, ${posArray[1]}px)`;
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
                let moveX = (r2.right - goose.x);
                let posArray = targetElementsXY.get(element);
                posArray[0] = posArray[0] - moveX;
                element.style.transform = `translate(${posArray[0]}px, ${posArray[1]}px)`;
            }
        //right push
        else if ((goose.x + scaledWidth) >= r2.left && 
            goose.x <= r2.left + allowance &&
            (goose.y + scaledHeight) >= r2.top &&
            goose.y <= r2.bottom &&
            goose.direction == "walkRight") { 
                let posArray = targetElementsXY.get(element); 
                let moveX = (goose.x + scaledWidth) - r2.left;
                posArray[0] = posArray[0] + moveX;
                element.style.transform = `translate(${posArray[0]}px, ${posArray[1]}px)`;             
            };
    }
};

//------------------------------------CONTACT EMAIL JS-----------------------------//
const contactForm = document.getElementById('contact-form'),
    contactMessage = document.getElementById('contact-message')

const sendEmail = (e) => {
    e.preventDefault();

    //serviceID - templateID - #form - publicKey
    emailjs.sendForm('service_whn0bcy', 'template_4li170n', '#contact-form', 'trUEz8AEGk4I4VtNM')
    .then(() => {
        contactMessage.textContent = "Message sent successfully!";

        setTimeout(() => {
            contactMessage.textContent = ''
        }, 5000)

        contactForm.reset();
    }, () => {
        contactMessage.textContent = 'Message not sent (service error)'
    })
}

contactForm.addEventListener('submit', sendEmail);

//------------------------------------SHOW JUMP TO TOP OF PAGE-----------------------------//
const scrollUp = () =>{
    const scrollUp = document.getElementById('scroll-up')
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
                        : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp);

//------------------------------------SCROLL REVEAL-----------------------------//
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
})
sr.reveal(`.home`);
sr.reveal(`.home-goose-hint`, {delay: 200, origin: 'bottom'});