import { dinoDetails } from "./main.js";
import { context } from "./main.js";

console.log(dinoImageRunOne);
console.log(dinosaurRunTwo);




// We should add two canvas images running dinasour
// we should import import two image from the main
// The function should toggle the images and run the dinasour
let dinoImageRunOne = new Image();
let dinoImageRunTwo = new Image();

const canvas = document.getElementById("../");
// The images are rendered in the HTML document
dinoImageRunOne.src = "./assets/dino-run-0.png";
dinoImageRunTwo.src = "./assets/dino-run-1.png";

dinoImageRunOne.drawImage();
function canvasDrawImage() {
    context.drawImage(dinoImageRunOne, dinoDetails.x, dinoDetails.y, dinoDetails.width, dinoDetails.height);
}
dinoImageRunOne.addEventListener("load", { canvasDrawImage });
dinoImageRunTwo.drawImage();
function canvasDrawImage() {
    context.drawImage(dinoImageRunOne, dinoDetails.x, dinoDetails.y, dinoDetails.width, dinoDetails.height);
}
dinoImageRunOne.addEventListener("load", { canvasDrawImage });
// setAttribute("class", "hidden")


// Move long time
// Countiue running in the screen



function runDinasour() {



}