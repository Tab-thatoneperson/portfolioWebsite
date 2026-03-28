const body = document.querySelector("body"),
      nav = document.querySelector("nav"),
      canvas = document.querySelector(".characterCanvas"),
      modeToggle = document.querySelector(".darkLight"),
      gooseToggle = document.querySelector(".gooseSwitch"),
      gooseInfo = document.querySelector(".goose-instructions"),
      infoToggle = document.querySelector(".infoCircle"),
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
      gooseToggle.addEventListener("click", () => {
        gooseToggle.classList.toggle("active");
        canvas.classList.toggle("show");
        infoToggle.classList.toggle("active");
        //open or close info section if goose is not active
        
        if(gooseToggle.classList.contains("active")){
            if (!localStorage.getItem("infoPopupGiven")){
                gooseInfo.classList.add("active");

                localStorage.setItem("infoPopupGiven", "true");
            }
        } else if (gooseInfo.classList.contains("active")) {
            gooseInfo.classList.remove("active");
        }
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
    // if goose is active - get the goose to spawn on the goose image
    else if(clickedElm.classList.contains("goose")){
        const gooseSpawn = document.getElementById("goose-image");
        const goosePos = gooseSpawn.getBoundingClientRect();
        let gooseSpawnX = goosePos.x;
        let gooseSpawnY = (goosePos.y + 1.5);

        // so the goose does not spawn far off the screen if goose image
        // is not visable
        if ((gooseSpawnY < 0) || (gooseSpawnY > canvas.height - gooseHeight/2)) { gooseSpawnY = canvas.height / 3;};

        character.x = gooseSpawnX;
        character.y = gooseSpawnY;
    }

    else if(clickedElm.classList.contains("info")){
        gooseInfo.classList.toggle("active");
    }

    else if(clickedElm.classList.contains("instruction-exit")){
        gooseInfo.classList.remove("active");
    }
});





//================================= set canvas ===========//
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


//================================= user character ===========//
// * inspired by The Normie Programmer: https://www.youtube.com/watch?v=ZpZLmpKa2zw
const characterImage = new Image();
characterImage.src = "goose_front.png";

//main variables for goose
let gooseHeight = 302;
let gooseWidth = 130;
const scale = 0.6;
let scaledWidth = gooseWidth * scale;
let scaledHeight = gooseHeight * scale;
const allowance = 15;

//different sizes for the two sprite sheets
const gooseFrontHeight = 302;
const gooseSideHeight = 305;
const gooseFrontWidth = 130;
const gooseSideWidth = 264;


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
    grab: false,
};

const animations = {
    walkDown: 0,
    idle: 1,
    walkUp: 2,
    walkRight: 0,
    walkLeft: 1,
};

const keys = {
    w: false, 
    s: false,
    a: false,
    d: false,
    shift: false,
    grab: false,
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
    // character sprinting
    if (keys.shift) {
        character.speed = 6;
    }
    else {
        character.speed = 3;
    }

    // character grabing
    if (keys.grab) {
        character.grab = true;
    }
    else{
        character.grab = false;
    }

    // character moving 
    if (keys.w && (character.y > character.speed)) {
        character.y -= character.speed;
        character.direction = "walkUp";
        characterImage.src = "goose_front.png";
        gooseHeight = gooseFrontHeight;
        gooseWidth = gooseFrontWidth;
        character.moving = true;
        character.verticalMove = true;
    } else if (keys.s && (character.y + scaledHeight < canvas.height + character.speed)) {
        character.y += character.speed;
        character.direction = "walkDown";
        characterImage.src = "goose_front.png";
        gooseHeight = gooseFrontHeight;
        gooseWidth = gooseFrontWidth;
        character.moving = true;
        character.verticalMove = true;
    } else if (keys.a && (character.x > character.speed)) {
        character.x -= character.speed;
        character.direction = "walkLeft";
        characterImage.src = "goose_side.png";
        gooseHeight = gooseSideHeight;
        gooseWidth = gooseSideWidth;
        character.moving = true;
        character.verticalMove = false;
    } else if (keys.d) {  
        character.direction = "walkRight";
        characterImage.src = "goose_side.png";
        gooseHeight = gooseSideHeight;
        gooseWidth = gooseSideWidth;
        character.moving = true;
        character.verticalMove = false;
        if (character.x + (gooseFrontWidth * scale) < canvas.width + character.speed) { character.x += character.speed; }
    } else {
        character.direction = "idle";
        characterImage.src = "goose_front.png";
        gooseHeight = gooseFrontHeight;
        gooseWidth = gooseFrontWidth;
        character.moving = false;
        character.verticalMove = false;
    }

    scaledWidth = gooseWidth * scale;
    scaledHeight = gooseHeight * scale;

    character.frameY = animations[character.direction];

    character.frameTimer++;
    const currentInterval = character.moving ? character.frameInterval : character.idleFrameInterval;
    if (character.frameTimer >= currentInterval) {
        character.frameX = (character.frameX + 1) % character.maxFrame;
        character.frameTimer = 0;
    }

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
        checkScroll();
    };
    requestAnimationFrame(animate);
};

animate();


addEventListener("keydown", (e) => {
    if(gooseInfo.classList.contains("active")){
        gooseInfo.classList.remove("active");
    }

    if (e.key == 'Shift'){
        keys.shift = true;
    }

    //trying to grab or drop elements 
    if (e.key.toLowerCase() == "e") {
        //already grabbed element = drop
        if (grabbedElements.length > 0){
            //if already grabbed element, drop it
            grabbedElements.forEach(element => {
                let posArray = targetElementsXY.get(element);
                posArray[2] = 0;
            });
            grabbedElements = [];
        //grab element
        } else {
            keys.grab = true;
        }        
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

    if (e.key.toLowerCase() == "e") {
        keys.grab = false;       
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

//--------------BUTTONS FOR MOVEMENT ON MOBILE--------------------------------------//
addEventListener("touchstart", (e) => {
    //trying to grab or drop elements 
    if (e.target.className == "bx bx-hand" || e.target.className == "mobile-input grab") {
        //already grabbed element = drop
        if (grabbedElements.length > 0){
            //if already grabbed element, drop it
            grabbedElements.forEach(element => {
                let posArray = targetElementsXY.get(element);
                posArray[2] = 0;
            });
            grabbedElements = [];
        //grab element
        } else {
            keys.grab = true;
        }        
    }

    switch(e.target.className) {
        case "bx bx-caret-up":
        case "mobile-input up":
            keys.w = true;
            break;
        case "bx bx-caret-down":
        case "mobile-input down":
            keys.s = true;
            break;
        case "bx bx-caret-left":
        case "mobile-input left":
            keys.a = true;
            break;
        case "bx bx-caret-right":
        case "mobile-input right":
            keys.d = true;
            break;
    }
});

addEventListener("touchend", (e) => {
    if (e.target.className == "bx bx-hand" || e.target.className == "mobile-input grab") {
        keys.grab = false;
    }

    switch(e.target.className) {
        case "bx bx-caret-up":
        case "mobile-input up":
            keys.w = false;
            break;
        case "bx bx-caret-down":
        case "mobile-input down":
            keys.s = false;
            break;
        case "bx bx-caret-left":
        case "mobile-input left":
            keys.a = false;
            break;
        case "bx bx-caret-right":
        case "mobile-input right":
            keys.d = false;
            break;
    }
});

//--------------list of movableElements with X and Y pos for translate function-------------------//
const targetElements = document.querySelectorAll('.target');
const targetElementsXY = new Map();
for (let element of targetElements) {
                                //x, y
    targetElementsXY.set(element, [0, 0]);
}
let grabbedElements = [];

function checkCollision() {
    const moveableElements = document.querySelectorAll('.target');

    for (let element of moveableElements) {
        checkIntersection(character, element, targetElementsXY.get(element));
        element.style.transition = `none`;
    };
};


function checkIntersection(goose, element, pos) {
    let r2 = element.getBoundingClientRect();
    let posArray = targetElementsXY.get(element);
    const grabRoom = 5; //ensure user can pick up element before pushing it

    // if the user wants to grab - grab any elements around the gooses head
    if (goose.grab) {
        if (goose.y <= r2.bottom + allowance &&
            goose.y >= r2.top - allowance &&
            goose.x <= r2.right + allowance &&
            (goose.x + scaledWidth) >= r2.left - allowance) {
                grabbedElements.push(element);
                posArray[2] = 1;
            }
    }
    
    //for any grabbed elements - move them with the goose's movements
    if (posArray[2] == 1) {
        if (goose.direction == "walkDown"){
            posArray[0] = posArray[0] - (r2.right - (goose.x + scaledWidth/2)) + (r2.right - r2.left)/2;
            posArray[1] = posArray[1] + (goose.y + scaledHeight/6 - r2.bottom + (r2.bottom - r2.top));
            element.style.transform = `translate(${posArray[0]}px, ${posArray[1]}px)`;
        }
        else if (goose.direction == "walkLeft"){
            posArray[0] = posArray[0] + (goose.x - r2.right) + scaledWidth/5;
            posArray[1] = posArray[1] + (goose.y + scaledHeight/6 - r2.bottom + (r2.bottom - r2.top));
            element.style.transform = `translate(${posArray[0]}px, ${posArray[1]}px)`;
        }
        else if (goose.direction == "walkRight"){
            posArray[0] = posArray[0] - (r2.left - goose.x - scaledWidth/1.3);
            posArray[1] = posArray[1] + (goose.y + scaledHeight/6 - r2.bottom + (r2.bottom - r2.top));
            element.style.transform = `translate(${posArray[0]}px, ${posArray[1]}px)`;
        }
        else {
            posArray[0] = posArray[0] - (r2.right - (goose.x + scaledWidth/2)) + (r2.right - r2.left)/2;
            posArray[1] = posArray[1] + (goose.y - r2.bottom + scaledHeight/6);
            element.style.transform = `translate(${posArray[0]}px, ${posArray[1]}px)`;
        }
    }
    //if not a grabbed element but colliding with goose - push 
    else {
        // y axis
        if (goose.verticalMove) {
            //bottom push
            if (goose.y <= r2.bottom -grabRoom &&
                goose.y >= (r2.bottom - allowance) + grabRoom &&
                goose.x <= r2.right - grabRoom &&
                (goose.x + scaledWidth) >= r2.left + grabRoom &&
                goose.direction == "walkUp") { 
                    let moveY = (r2.bottom - goose.y);
                    let posArray = targetElementsXY.get(element);
                    posArray[1] = posArray[1] - moveY;
                    element.style.transform = `translate(${posArray[0]}px, ${posArray[1]}px)`;
                }
            //top push
            else if ((goose.y + scaledHeight) >= r2.top + grabRoom && 
                (goose.y + scaledHeight) <= (r2.top + allowance) - grabRoom &&
                goose.x <= r2.right - grabRoom &&
                (goose.x + scaledWidth) >= r2.left + grabRoom &&
                goose.direction == "walkDown") {
                    let posArray = targetElementsXY.get(element);
                    let moveY = (goose.y + scaledHeight) - r2.top;
                    posArray[1] = posArray[1] + moveY;
                    element.style.transform = `translate(${posArray[0]}px, ${posArray[1]}px)`;
                };
            }
        // x axis
        else {
            //left push
            if (goose.x <= r2.right - grabRoom && 
                goose.x >= (r2.right - allowance) + grabRoom &&  
                goose.y + scaledHeight >= r2.top + grabRoom &&
                goose.y <= r2.bottom - grabRoom &&
                goose.direction == "walkLeft") {
                    let moveX = (r2.right - goose.x);
                    let posArray = targetElementsXY.get(element);
                    posArray[0] = posArray[0] - moveX;
                    element.style.transform = `translate(${posArray[0]}px, ${posArray[1]}px)`;
                }
            //right push
            else if ((goose.x + scaledWidth) >= r2.left + grabRoom && 
                goose.x <= r2.left + allowance - grabRoom &&
                (goose.y + scaledHeight) >= r2.top + grabRoom &&
                goose.y <= r2.bottom - grabRoom &&
                goose.direction == "walkRight") { 
                    let posArray = targetElementsXY.get(element); 
                    let moveX = (goose.x + scaledWidth) - r2.left;
                    posArray[0] = posArray[0] + moveX;
                    element.style.transform = `translate(${posArray[0]}px, ${posArray[1]}px)`;             
                };
        }
    }   
};

//scroll the screen if the goose reaches the top or bottom
function checkScroll(){
    if (character.y < 70) {
        window.scrollBy({
            top: -5,
        });
    }
    if (character.y + scaledHeight > window.innerHeight) {
        window.scrollBy({
            top: 5,
        });
    }
}

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
    }, (error) => {
        if (error.status === 429) {
            contactMessage.textContent = 'Unable to send a message via Emailjs at this time. Please reach out via my email!';
        }
        else {
            contactMessage.textContent = 'Message not sent (service error)';
        }
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