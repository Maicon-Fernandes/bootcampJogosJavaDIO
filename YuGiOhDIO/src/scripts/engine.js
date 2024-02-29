const state ={
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },
    playerSides:{
        player1: "player-cards",
        playerBOX: document.querySelector("#player-cards") ,
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions:{
        button: document.getElementById("next-duel"),
    },
};

const pathImages = "./src/assets/icons/"

const playerSides={
    player1: "player-cards",
    computer: "computer-cards",
};

const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    }
]

async function createCardImage(IdCard , fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height","130px");
    cardImage.setAttribute("src","./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");


    if(fieldSide === playerSides.player1){
        cardImage.setAttribute("src",`${cardData[IdCard].img}`);  
                cardImage.addEventListener("mouseover", ()=>{  
                     drawSelectedCard(IdCard);
        });

        cardImage.addEventListener("click",()=>{
            console.log(cardImage.getAttribute("data-id"));
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }
    return cardImage;
}

async function setCardsField(IdCard){
    let computerCardId = await getRandomCardId();

    await removeAllCardsImages();
    await hiddenCardDetails();
    await showHiddenCardFieldsImages(true);
    await drawCardInfield(IdCard, computerCardId)
    
    

    state.fieldCards.player.src = cardData[IdCard].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duel = await checkDuel(IdCard, computerCardId);

    await updateScore();
    await drawButton(duel);

}

async function drawCardInfield(IdCard, computerCardId){
    state.fieldCards.player.src = cardData[IdCard].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value){
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    if(value === false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = `Result:`;
    
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";

}

async function checkDuel(playerID, computerID){
    let Result = "Draw";
    let playerCard = cardData[playerID];
    state.cardSprites.type.innerText = `Draw`;

    if(playerCard.WinOf.includes(computerID)){
        Result = "Win";
        state.score.playerScore++;
        state.cardSprites.type.innerText = `you ${Result}`;
    }
    if(playerCard.LoseOf.includes(computerID)){
        Result = "Lose";
        state.cardSprites.type.innerText = `you ${Result}`;
        state.score.computerScore++;
    }
    await playAudio(Result);
    return Result;
}

async function removeAllCardsImages(){
    let {computerBOX , playerBOX} = state.playerSides;
    let imageElements = computerBOX.querySelectorAll("img");
    imageElements.forEach((img)=> img.remove());

    cards = state.playerSides.playerBOX;
    imageElements = playerBOX.querySelectorAll("img");
    imageElements.forEach((img)=> img.remove());
}

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}


async function drawSelectedCard(index){
    console.log(index);
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attributte : "+ cardData[index].type;
};

async function drawCards(cardNumbers, fieldSide){

    for(let i = 0; i< cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard ,fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
};

async function resetDuel(){
    state.cardSprites.avatar.src = " ";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.volume = 0.2;
    try{
        audio.play();
    }catch{
        console.log("Não temos audio para o empate");
    }
}

function init(){
    showHiddenCardFieldsImages(false);

    state.cardSprites.name.innerText = "Select";
    state.cardSprites.type.innerText = "a Card";

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.3;
    bgm.play()
};

init();
