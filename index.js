var Word = require("./word.js");
var inquirer = require("inquirer");

const wordBank = [
  "egypt", "spain", "greece",
  "russia", "india", "jordan",
  "finland", "belguim", "mexico",
  "italy", "brazil", "france",
  "germany"
];

var guesses;
var pickedWords;
var word;
var pickedWord;

function init() {
  pickedWords = [];
  console.log("Hello, and welcome to Word Guess in Atlas!");
  console.log("------------------------------------------");
  playGame();
}

function playGame() {
  pickedWord = "";
  guesses = 15;
  if(pickedWords.length < wordBank.length) {
    pickedWord = getWord();
  } else {
    // WIN CONDITION
    console.log("Great Job! You're familiar with your neighbors");
    continuePrompt();
  }
  if(pickedWord) {
    word = new Word(pickedWord);
    word.makeLetters();
    makeGuess();
  }
}

function getWord() {
  var rand = Math.floor(Math.random() * wordBank.length);
  var randomWord = wordBank[rand];
  if(pickedWords.indexOf(randomWord) === -1) {
    pickedWords.push(randomWord);
    return randomWord;
  } else {
    return getWord();
  }
}

function makeGuess() {
  var checker = [];
  inquirer.prompt([
    {
      name: "guessedLetter",
      message: word.update() + 
              "\nGuess a letter!" +
              "\nGuesses Left: " + guesses
    }
  ])
  .then(data => {
    word.letters.forEach(letter => {
      letter.checkLetter(data.guessedLetter);
      checker.push(letter.getCharacter());
    });
    if(guesses > 0 && checker.indexOf("_") !== -1) {
      guesses--;
      if(guesses === 0) {
        console.log("YOU RAN OUT OF GUESSES! GAME OVER.");
        continuePrompt();
      } else {
        makeGuess();
      }
    } else {
      console.log("CONGRATULATIONS! YOU GOT THE WORD!");
      console.log(word.update());
      playGame();
    }
  });
}

function continuePrompt() {
  inquirer.prompt([
      {
        name: "continue",
        type: "list",
        message: "Would you like to play again?",
        choices: ["Yes", "No"]
      }
    ])
  .then(data => {
      if(data.continue === "Yes") {
        init();
      } else {
        console.log("Thanks for playing!");
      }
  });
}

init();
