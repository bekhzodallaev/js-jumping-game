const player = document.getElementsByClassName("player")[0];

document.addEventListener("keydown", ( e ) => {
    
    if(e.key === " "){
        player.classList.add("playerJump");
    }
} )

document.addEventListener("animationend", () => {
    player.classList.remove("playerJump");
} )