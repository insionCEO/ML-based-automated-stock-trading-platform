var randomNo = Math.random() * 6;
randomNo = Math.floor(randomNo) + 1;

var RandomDiceImage = "images/dice" + randomNo + ".png";

var image1 = document.querySelectorAll("img")[0];

image1.setAttribute("src", RandomDiceImage);

var RandomNo2 = Math.floor(Math.random() * 6) + 1;

var RandomDiceImage2 = "images/dice" + RandomNo2 + ".png";

var image2 = document.querySelectorAll("img")[1];
image2.setAttribute("src", RandomDiceImage2);

if (randomNo > RandomNo2) {
    document.querySelector("h1").innerHTML = "Player 1 wins";
}
else if (RandomNo2 > randomNo) {
    document.querySelector("h1").innerHTML = "Player 2 Wins";
}
else {
    document.querySelector("h1").innerHTML = "Draw";
}