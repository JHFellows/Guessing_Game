function generateWinningNumber(){
  var randomNum = Math.random();
  randomNum = parseInt(randomNum * 100 + 1);
  return randomNum === 0 ? 1 : randomNum;
}
function shuffle(arr){
  var lastIndex = arr.length, holder, randomIndex;
  // While there remain elements to shuffle…
  while (lastIndex) {
    // Pick a remaining element…
    randomIndex = Math.floor(Math.random() * lastIndex--);
    // And swap it with the current element.
    holder = arr[lastIndex];
    arr[lastIndex] = arr[randomIndex];
    arr[randomIndex] = holder;
  }
  return arr;
}
function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
  this.hasWon = false;
}
Game.prototype.difference = function(){
  return Math.abs(this.playersGuess - this.winningNumber);
};
Game.prototype.isLower = function(){
  return this.playersGuess < this.winningNumber ? true : false;
};
Game.prototype.playersGuessSubmission = function(num){
  if(num === 666){
    this.playersGuess = num;
  }else if(num < 1 || num > 100 || typeof num !== "number"){
    throw "That is an invalid guess."
  }else{
    this.playersGuess = num;
  }
  return this.checkGuess();
};
Game.prototype.checkGuess = function(){
  if(this.playersGuess === this.winningNumber || this.playersGuess === 666){
    this.pastGuesses.push(this.playersGuess);
    $(".disable").prop("disabled",true);
    $("#reset-button").text("Feeling Lucky?");
    this.hasWon = true;
    return this.playersGuess === 666 ? "The number of The Beast! Excellent choice. You are free to go!" : "You Win!";
  }else{
    if(this.pastGuesses.indexOf(this.playersGuess) > -1){
      return "You have already guessed that number.";
    }else{
      this.pastGuesses.push(this.playersGuess);
      if(this.pastGuesses.length === 5){
        return "You Lose.";
      }else if(this.difference() < 10){
        return this.isLower() ? "You\'re burning up! Guess Higher." : "You\'re burning up! Guess Lower.";
      }else if(this.difference() < 25){
        return this.isLower() ? "You\'re lukewarm. Guess Higher." : "You\'re lukewarm. Guess Lower.";
      }else if(this.difference() < 50){
        return this.isLower() ? "You\'re a bit chilly. Guess Higher." : "You\'re a bit chilly. Guess Lower.";
      }else if(this.difference() < 100){
        return this.isLower() ? "You\'re ice cold! Guess Higher." : "You\'re ice cold! Guess Lower.";
      }
    }
  }
};
function newGame(){
  return new Game;
}
Game.prototype.provideHint = function(){
  var arr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()],
      shuffled = shuffle(arr).join(", ");
      return shuffled;
}

function resetGame(outputs){
  if(outputs === "You Lose."){
    $("#instruction1").text("You can try to Escape...");
    $("#instruction2").text("But you probably won't get far.")
    $(".disable").prop("disabled",true);
  }
}

$(document).ready(function(){
  var game = newGame(),
      count = 0;
  $("#submit").click(function(){
    var num = +$("#player-input").val(),
        output = game.playersGuessSubmission(num);
    $("#player-input").val("");
    $("#title").text(output);
    $("#title").css("color","#bd1c18");
    if(game.hasWon){
      $("#instruction1").text("Leave now..");
      $("#instruction2").text("While you still can.");
    }
    function addGuesses(index){
      if(output !== "You have already guessed that number."){
        var child = $("#guess-list").children("li")[index];
        $(child).text(game.pastGuesses[index]);
        count++;
      }
    }
    addGuesses(count);
    resetGame(output);
  });
  $("#reset-button").click(function(){
    location.reload();
  });
  $("#hint-button").click(function(){
    $("#hint-button").filter(".disable").prop("disabled",true);
    var hints = game.provideHint();
    $("#title").text("Hints:  " + hints);
  });
})
