var playerOne = null;
var playerTwo = null; //declaring variables that will store which player is what character. When the user chooses to play against the computer, playerTwo is the ai/computer player
var gameType = null; //the gameType variable will contain the value accodring to the users choice, 0 for playing against another player, 1 for playing against the computer
var flag = false; //This boolean variable will hold the game progress status, if false the game has ended, if true the game has started again
var currMove = 1; //This integer variable will hold the current turn number
var playerLoc = ['','','','','','','','','']; //This array will hold the current board, if an "X" or "O" is placed on the board, it will also be saved in the array
const playerWins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]]; //This two-dimensional array holds all of the possible win states for the ticTacToe board
const tiles = document.querySelectorAll('.tile');
resetGame(); //Calling the resetGame function to start a fresh game

function chooseType() { //This method will handle displaying a pop-up for the user to choose if they'd like to play against the computer or another human player
	document.getElementById("chooseGame").style.display = "block";
	document.getElementById("chooseSymbol").style.display = "none";
}
function startGame() { //This method handles the second pop-up for the user to choose if they'd like to move first as X or move second as O
	document.getElementById("chooseSymbol").style.display = "block";
	document.getElementById("chooseGame").style.display = "none";
}

function resetGame() { //This method resets all of the initial conditions if the reset button is clicked at any point, and gives the initial start as well
	chooseType();
	document.getElementById("gameEnd").style.display = "none";
	for(var i = 0; i < tiles.length; i++) {
		tiles[i].innerText = '';
		tiles[i].style.removeProperty('background-color');	//Still clearing the board here. This removes all of the Xs and Os from the board, and removes the background color from the win,tie,or loss
		tiles[i].addEventListener('click', clickEvent, false);
	}
	currMove=1;
	playerLoc = ['','','','','','','','',''] //Emptying the player location array
	flag = false;
}

function chooseGame(playerChoice) { //This method takes the users choice for playing against the computer or against another human player, on button click.
	if(playerChoice == 0) {
		gameType = 0; //player has chosen to play against another player
	}
	if(playerChoice == 1) {
		gameType = 1; //player has chosen to play against AI
	}
	startGame();
}
function chooseSymbol(playerChoice) { //This method takes the users choice for taking the first move as X or taking the second move as O
	if(playerChoice==0){
		playerOne = "X";
		playerTwo = "O";
	}
	if(playerChoice==1){ //The playerChoice is taken from a button click from the html file
		playerOne = "O";
		playerTwo = "X";
		if (gameType == 1){ //If the user chose to play as "O", and go second then the ai will take its inital move into one of the empty corners
			aiInitialMove();
		}
	}
	flag = true;
	document.getElementById("chooseSymbol").style.display = "none";
}

function clickEvent(tile) { //This method handles the move alternation. So if it is an even move, then it is the player who is O's turn. If the current move number is odd, then it is X's turn
	if(currMove % 2 == 0) {
		click(tile.target.id, "O");
	}else {
		click(tile.target.id, "X");
	}
}

function click(tileId, player) { //This method will handle click events, and by calling displayWin it will determine if there is a win or tie on the board
	if(gameType == 1 && player == playerTwo && currMove != 1) { //If the player chose to play against the computer, the computer will have a turn
		aiMove();
	}
	else if (playerLoc[tileId.charAt(1)]=='' && gameType == 1 && flag) { //If playing against the computer, on a normal move the player will choose their move and the computer will choose a move to react
		playerLoc[tileId.charAt(1)] = player;
		document.getElementById(tileId).innerText = player;
		currMove++;
		aiMove();
	}
	else if (playerLoc[tileId.charAt(1)]=='' && flag) { //If playing against another human, the current human player will take a move and then the other player will take their move
		playerLoc[tileId.charAt(1)] = player;
		document.getElementById(tileId).innerText = player;
		currMove++;
	}
	else if(player == null) {
		document.getElementById(titleId).innerText = '';
	}
	displayWin(player);	//In either case here we are checking if a player has three in a row, for a win
	displayWin(playerTwo);
}
function displayWin(player) { //This method handles changing tile colors and showing a game end message to represent a win or tie
	var playerWin = winEvent(player);
	if(playerWin != null) {
		tiles[playerWin[0]].style.backgroundColor = "Green";
		tiles[playerWin[1]].style.backgroundColor = "Green"; //Changing the color of the winning tiles to green
		tiles[playerWin[2]].style.backgroundColor = "Green";

		document.getElementById("gameEnd").style.display = "block";
		document.getElementById("winMessage").innerText = player + " Wins!"; //displaying win message for the winning player. NOTE: if the computer wins it will only list its  Letter (either X or O), the user must keep in mind who they are playing as!
		flag = false;
	}else if (!playerLoc.includes('')){ //If the game has ended due to no remaining empty tiles then the match has resulted in a tie
		for(var i = 0; i < tiles.length; i++) {
			tiles[i].style.backgroundColor = "FireBrick"; //The board will change to a red background color if the match has resulted in a tie
		}
		document.getElementById("gameEnd").style.display = "block";
		document.getElementById("winMessage").innerText = "Tie!";
		flag = false;
	}
}
function isSubset(arrayOne, arrayTwo) { //This method takes two arrays as parameters and returns if one array is contained in another
	for(var i=0; i < arrayTwo.length; i++) {
		if(!arrayOne.includes(arrayTwo[i])) { //If arrayOne is not included within arrayTwo return false
			return false;
		}
	}
	return true;
}
function winEvent(player) { //Utilizing the isSubset method, winEvent finds the exact spot (what three tiles) that a win has occured on
	var playerMoves = [];
	for(var i=0; i < playerLoc.length; i++){
		if(playerLoc[i]==player) { // For any tile that contains the players letter, push the location to the playerMoves array
			playerMoves.push(i);
		}
	}
	for(var i=0; i < playerWins.length; i++) {
		if(isSubset(playerMoves, playerWins[i])) { //If upon comparing playerMoves to the possible win combinations there is a match return where the match is
			return playerWins[i];
		}
	}
	return null;
}

function getCornerMove(set) { //This function generates a move for the computer to place in a random corner
	var random = Math.floor(Math.random() * set.length);
	return set[random];
}

function aiInitialMove() { //If the AI is taking their move and it is the first move of the match, then it should place in a corner for best results.
	var randomCorner = getCornerMove([0,2,6,8]);
	playerLoc[randomCorner] = playerTwo;
	document.getElementById("t"+randomCorner).innerText = playerTwo;
	currMove++;
}

function aiMove() {
	//To play the perfect game of ticTacToe a player must choose the first available move from this list:
	//Win: If the player has two in a row, place a third to have three
	//Block: If the opponent has two in a row, the player must use their move to block the opponent's warning
	//Fork: Create the opportunity to win by having two non-blocked lines of 2 in a row
	//Blocking a fork: If there's only one fork for the opponent then block it. Otherwise create two in a row.
						//Example: "X" in opposite corners, "O" placed in center. If "O" places in a corner at this point, "X" will have the chance to win.
	//Center: Marks the center of the board. If it is the first move then a corner is the better move, only because it leaves more opportunity for the opponent to make mistakes.
	//Opposite corner: If the opponent is in the corner, the player must play the opposite corner.
	//Empty corner: The player plays in a corner square
	//Empty side: The player plays in a middle square on any of the four tiles

	//The rules above influenced the logic in the blocks of code below, and my approach to programming the computer was to follow these rules specifically.

	// The computer should always take the chance to win, if there is a move that will create three in a row.
	if (playerLoc[6] == "" && ((playerLoc[7] == playerTwo && playerLoc[8] == playerTwo) || (playerLoc[3] == playerTwo && playerLoc[0] == playerTwo) || (playerLoc[4] == playerTwo && playerLoc[2] == playerTwo))) {
		playerLoc[6] = playerTwo;
		document.getElementById("t"+6).innerText = playerTwo;
	}
	else if (playerLoc[7] == "" && ((playerLoc[6] == playerTwo && playerLoc[8] == playerTwo) || (playerLoc[4] == playerTwo && playerLoc[1] == playerTwo))) {
		playerLoc[7] = playerTwo;
		document.getElementById("t"+7).innerText = playerTwo;
	}
	else if (playerLoc[8] == "" && ((playerLoc[6] == playerTwo && playerLoc[7] == playerTwo) || (playerLoc[5] == playerTwo && playerLoc[2] == playerTwo) || (playerLoc[0] == playerTwo && playerLoc[4] == playerTwo))) {
		playerLoc[8] = playerTwo;
		document.getElementById("t"+8).innerText = playerTwo;
	}
	else if (playerLoc[3] == "" && ((playerLoc[4] == playerTwo && playerLoc[5] == playerTwo) || (playerLoc[6] == playerTwo && playerLoc[0] == playerTwo))) {
		playerLoc[3] = playerTwo;
		document.getElementById("t"+3).innerText = playerTwo;
	}
	else if (playerLoc[4] == "" && ((playerLoc[3] == playerTwo && playerLoc[5] == playerTwo) || (playerLoc[7] == playerTwo && playerLoc[1] == playerTwo) || (playerLoc[6] == playerTwo && playerLoc[2] == playerTwo) || (playerLoc[0] == playerTwo && playerLoc[8] == playerTwo))) {
		playerLoc[4] = playerTwo;
		document.getElementById("t"+4).innerText = playerTwo;
	}
	else if (playerLoc[5] == "" && ((playerLoc[3] == playerTwo && playerLoc[4] == playerTwo) || (playerLoc[8] == playerTwo && playerLoc[2] == playerTwo))) {
		playerLoc[5] = playerTwo;
		document.getElementById("t"+5).innerText = playerTwo;
	}
	else if (playerLoc[0] == "" && ((playerLoc[1] == playerTwo && playerLoc[2] == playerTwo) || (playerLoc[6] == playerTwo && playerLoc[3] == playerTwo) || (playerLoc[4] == playerTwo && playerLoc[8] == playerTwo))) {
		playerLoc[0] = playerTwo;
		document.getElementById("t"+0).innerText = playerTwo;
	}
	else if (playerLoc[1] == "" && ((playerLoc[0] == playerTwo && playerLoc[2] == playerTwo) || (playerLoc[7] == playerTwo && playerLoc[4] == playerTwo))) {
		playerLoc[1] = playerTwo;
		document.getElementById("t"+1).innerText = playerTwo;
	}
	else if (playerLoc[2] == "" && ((playerLoc[8] == playerTwo && playerLoc[5] == playerTwo) || (playerLoc[0] == playerTwo && playerLoc[1] == playerTwo) || (playerLoc[6] == playerTwo && playerLoc[4] == playerTwo))) {
		playerLoc[2] = playerTwo;
		document.getElementById("t"+2).innerText = playerTwo;
	}

	// The computer should always take the opportunity to block the opposing player's win
	else if (playerLoc[6] == "" && ((playerLoc[7] == playerOne && playerLoc[8] == playerOne) || (playerLoc[3] == playerOne && playerLoc[0] == playerOne) || (playerLoc[4] == playerOne && playerLoc[2] == playerOne))) {
		playerLoc[6] = playerTwo;
		document.getElementById("t"+6).innerText = playerTwo;
	}
	else if (playerLoc[7] == "" && ((playerLoc[6] == playerOne && playerLoc[8] == playerOne) || (playerLoc[4] == playerOne && playerLoc[1] == playerOne))) {
		playerLoc[7] = playerTwo;
		document.getElementById("t"+7).innerText = playerTwo;
	}
	else if (playerLoc[8] == "" && ((playerLoc[6] == playerOne && playerLoc[7] == playerOne) || (playerLoc[5] == playerOne && playerLoc[2] == playerOne) || (playerLoc[0] == playerOne && playerLoc[4] == playerOne))) {
		playerLoc[8] = playerTwo;
		document.getElementById("t"+8).innerText = playerTwo;
	}
	else if (playerLoc[3] == "" && ((playerLoc[4] == playerOne && playerLoc[5] == playerOne) || (playerLoc[6] == playerOne && playerLoc[0] == playerOne))) {
		playerLoc[3] = playerTwo;
		document.getElementById("t"+3).innerText = playerTwo;
	}
	else if (playerLoc[4] == "" && ((playerLoc[3] == playerOne && playerLoc[5] == playerOne) || (playerLoc[7] == playerOne && playerLoc[1] == playerOne) || (playerLoc[6] == playerOne && playerLoc[2] == playerOne) || (playerLoc[0] == playerOne && playerLoc[8] == playerOne))) {
		playerLoc[4] = playerTwo;
		document.getElementById("t"+4).innerText = playerTwo;
	}
	else if (playerLoc[5] == "" && ((playerLoc[3] == playerOne && playerLoc[4] == playerOne) || (playerLoc[8] == playerOne && playerLoc[2] == playerOne))) {
		playerLoc[5] = playerTwo;
		document.getElementById("t"+5).innerText = playerTwo;
	}
	else if (playerLoc[0] == "" && ((playerLoc[1] == playerOne && playerLoc[2] == playerOne) || (playerLoc[6] == playerOne && playerLoc[3] == playerOne) || (playerLoc[4] == playerOne && playerLoc[8] == playerOne))) {
		playerLoc[0] = playerTwo;
		document.getElementById("t"+0).innerText = playerTwo;
	}
	else if (playerLoc[1] == "" && ((playerLoc[0] == playerOne && playerLoc[2] == playerOne) || (playerLoc[7] == playerOne && playerLoc[4] == playerOne))) {
		playerLoc[1] = playerTwo;
		document.getElementById("t"+1).innerText = playerTwo;
	}
	else if (playerLoc[2] == "" && ((playerLoc[8] == playerOne && playerLoc[5] == playerOne) || (playerLoc[0] == playerOne && playerLoc[1] == playerOne) || (playerLoc[6] == playerOne && playerLoc[4] == playerOne))) {
		playerLoc[2] = playerTwo;
		document.getElementById("t"+2).innerText = playerTwo;
	}

	// If there is one possible fork for the opposing player, the computer should block it
	else if (playerLoc[6] == playerOne && playerLoc[2] == playerOne) {
		if(playerLoc[7] ==""){
			playerLoc[7] = playerTwo;
			document.getElementById("t"+7).innerText = playerTwo;
		}
		else if(playerLoc[3] ==""){
			playerLoc[3] = playerTwo;
			document.getElementById("t"+3).innerText = playerTwo;
		}
		else if(playerLoc[5] ==""){
			playerLoc[5] = playerTwo;
			document.getElementById("t"+5).innerText = playerTwo;
		}
		else if(playerLoc[1] ==""){
			playerLoc[1] = playerTwo;
			document.getElementById("t"+1).innerText = playerTwo;
		}
	}
	else if (playerLoc[8] == playerOne && playerLoc[0] == playerOne) {
		if(playerLoc[7] ==""){
			playerLoc[7] = playerTwo;
			document.getElementById("t"+7).innerText = playerTwo;
		}
		else if(playerLoc[3] ==""){
			playerLoc[3] = playerTwo;
			document.getElementById("t"+3).innerText = playerTwo;
		}
		else if(playerLoc[5] ==""){
			playerLoc[5] = playerTwo;
			document.getElementById("t"+5).innerText = playerTwo;
		}
		else if(playerLoc[1] ==""){
			playerLoc[1] = playerTwo;
			document.getElementById("t"+1).innerText = playerTwo;
		}
	}
	else if (playerLoc[7] == playerOne && playerLoc[3] == playerOne && playerLoc[6] == "") {
		playerLoc[6] = playerTwo;
		document.getElementById("t"+6).innerText = playerTwo;
	}
	else if (playerLoc[7] == playerOne && playerLoc[5] == playerOne && playerLoc[8] == "") {
		playerLoc[8] = playerTwo;
		document.getElementById("t"+8).innerText = playerTwo;
	}
	else if (playerLoc[3] == playerOne && playerLoc[1] == playerOne && playerLoc[0] == "") {
		playerLoc[0] = playerTwo;
		document.getElementById("t"+0).innerText = playerTwo;
	}
	else if (playerLoc[5] == playerOne && playerLoc[1] == playerOne && playerLoc[2] == "") {
		playerLoc[2] = playerTwo;
		document.getElementById("t"+2).innerText = playerTwo;
	}
	// If the computer can create a fork to attempt a win, it should take the opportunity
	else if (playerLoc[6] == playerTwo && playerLoc[4] == playerOne && playerLoc[2] == "") {
		playerLoc[2] = playerTwo;
		document.getElementById("t"+2).innerText = playerTwo;
	}
	else if (playerLoc[8] == playerTwo && playerLoc[4] == playerOne && playerLoc[0] == "") {
		playerLoc[0] = playerTwo;
		document.getElementById("t"+0).innerText = playerTwo;
	}
	else if (playerLoc[0] == playerTwo && playerLoc[4] == playerOne && playerLoc[8] == "") {
		playerLoc[8] = playerTwo;
		document.getElementById("t"+8).innerText = playerTwo;
	}
	else if (playerLoc[2] == playerTwo && playerLoc[4] == playerOne && playerLoc[6] == "") {
		playerLoc[6] = playerTwo;
		document.getElementById("t"+6).innerText = playerTwo;
	}

	// At this point, if the center has not been played, the computer must use the center
	else if (playerLoc[4] == "") {
		playerLoc[4] = playerTwo;
		document.getElementById("t"+4).innerText = playerTwo;
	}

	// If the opponent has placed in a corner, the computer will place in the opposite corner
	else if (playerLoc[6] == "" && playerLoc[2] == playerOne) {
		playerLoc[6] = playerTwo;
		document.getElementById("t"+6).innerText = playerTwo;
	}
	else if (playerLoc[8] == "" && playerLoc[0] == playerOne) {
		playerLoc[8] = playerTwo;
		document.getElementById("t"+8).innerText = playerTwo;
	}
	else if (playerLoc[0] == "" && playerLoc[8] == playerOne) {
		playerLoc[0] = playerTwo;
		document.getElementById("t"+0).innerText = playerTwo;
	}
	else if (playerLoc[2] == "" && playerLoc[6] == playerOne) {
		playerLoc[2] = playerTwo;
		document.getElementById("t"+2).innerText = playerTwo;
	}

	// If there is an empty corner, the computer will play it
	else if (playerLoc[6] == "") {
		playerLoc[6] = playerTwo;
		document.getElementById("t"+6).innerText = playerTwo;
	}
	else if (playerLoc[0] == "") {
		playerLoc[8] = playerTwo;
		document.getElementById("t"+8).innerText = playerTwo;
	}
	else if (playerLoc[8] == "") {
		playerLoc[0] = playerTwo;
		document.getElementById("t"+0).innerText = playerTwo;
	}
	else if (playerLoc[2] == "") {
		playerLoc[2] = playerTwo;
		document.getElementById("t"+2).innerText = playerTwo;
	}

	// Computer will play a middle square on any side of the board if it is empty
	else if (playerLoc[3] == "") {
		playerLoc[3] = playerTwo;
		document.getElementById("t"+3).innerText = playerTwo;
	}
	else if (playerLoc[1] == "") {
		playerLoc[1] = playerTwo;
		document.getElementById("t"+1).innerText = playerTwo;
	}
	else if (playerLoc[5] == "") {
		playerLoc[5] = playerTwo;
		document.getElementById("t"+5).innerText = playerTwo;
	}
	else if (playerLoc[7] == "") {
		playerLoc[7] = playerTwo;
		document.getElementById("t"+7).innerText = playerTwo;
	}
	currMove++;
}
