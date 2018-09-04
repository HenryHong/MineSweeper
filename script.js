var width = 10;
var height = 10;
var BombNum = 10;
var DivText = "<div style='width:100%;height:100%;background-color:lightgrey'></div>";
var OtherDivText = '<div style="width:100%;height:100%;background-color:lightgrey"></div>';
var death = 0;
var win = 0;
var flags = 0;

var flaghtml = '<div style="width:100%;height:100%;background-color:lightgreen"><div style="position:relative;top:25%">O</div></div>';
var bombhtml = '<div style="width:100%;height:100%;background-color:red"><div style="position:relative;top:25%">X</div></div>';


//Creates the pixel board
function Board(containerId, rowsCount, colsCount) {
	
    var html = "<div class='ttt'><table>";
    for (var i = 0; i < rowsCount; i++) {
		html += "<tr id='row-" + i + "' class='row' >";
		for (var j = 0; j < colsCount; j++) {
			html += "<td id='" + cellId(i, j) + "' onclick='BoxClick("+i+","+j+")' oncontextmenu='FlagClick("+i+","+j+"); return false' >"+DivText+"</td>";
        }
        html += "</tr>"
	}
    html += "</table></div>";
    document.getElementById(containerId).innerHTML = html;
};
 
//Recieve the location of the inputted cell 
function cellId(row, col) {
	var loc = row + ":" + col
    return  loc;
}


function Create2dArr(){
	var bArr = [];
	for (var i = 0; i < width; i++){
		bArr[i] = [];
	}
	
	for(var i = 0; i < height; i++){
		for (var j = 0;  j < width; j++){
			bArr[i][j] = "";
		}
	}
	
	return bArr;
}
	
	

function PrintBoard (){
	var t= "";
	for(var i = 0; i < height; i++){
		for (var j = 0;  j < width; j++){
			
			t += BoardArr[i][j] + " ";
		}
		console.log(t);
		t = "";
	}
}


function CheckWin (){
	win = 1;
	for(var i = 0; i < height; i++){
		for (var j = 0;  j < width; j++){
			if ((BoardArr[i][j] != "X") && (document.getElementById(cellId(i,j)).innerHTML == OtherDivText)){
				//console.log("i:"+i+"   j:"+j);
				win = 0;
			}
		}
	}
	
	if (win ==  1){
		document.getElementById("result").innerHTML = "You win" ;
	}
}

function CreateBombs(){
	var ranBombX = 0; 
	var ranBombX = 0;

	for(var i = 0; i < 10; i++){
		ranBombX = Math.floor(Math.random() * 9);
		ranBombY = Math.floor(Math.random() * 9);

		while(BoardArr[ranBombX][ranBombY] == "X"){
			ranBombX = Math.floor(Math.random() * 9);
			ranBombY = Math.floor(Math.random() * 9);
		}
		BoardArr[ranBombX][ranBombY] = "X";
	}
} 


function Reveal (i,j){
	//console.log("i:"+i+"   j:"+j);
	try {
		if (BoardArr[i][j] != 0){
			document.getElementById(cellId(i,j)).innerHTML = BoardArr[i][j];
		}
	}
	catch(err) {
	}
}


function EndBombs(){
	for(var i = 0; i < width; i++){
		for(var j = 0; j < height; j++){
			if (BoardArr[i][j] == "X"){
				document.getElementById(cellId(i,j)).innerHTML = bombhtml;
			}
		}
	}
}


function CheckSpaceBox(i, j){
	try {
		if ((BoardArr[i][j] == 0) && (document.getElementById(cellId(i,j)).innerHTML == OtherDivText)){
			return true;
		}
		else{
			return false;
		}
	}
	catch(err) {
		return false;
	}	
}


function CheckSpace(i, j){
	
	if(BoardArr[i][j] == 0){
		document.getElementById(cellId(i,j)).innerHTML = "";
		Reveal(i-1,j);
		Reveal(i+1,j);
		Reveal(i,j-1);
		Reveal(i,j+1);
	}
	//console.log("i:"+i+"   j:"+j);
	
	
	if (CheckSpaceBox(i-1,j)){
		CheckSpace(i-1,j);
	}
	if (CheckSpaceBox(i+1,j)){
		CheckSpace(i+1,j);
	}
	if (CheckSpaceBox(i,j-1)){
		CheckSpace(i,j-1);
	}
	if (CheckSpaceBox(i,j+1)){
		CheckSpace(i,j+1);
	}
}



function CheckBox (i, j){
	try {
		if (BoardArr[i][j] == "X"){
			return 1;
		}
		else{
			return 0;
		}
	}
	catch(err) {
		//console.log(err);
		return 0;
	}		
}


function CellNum(i, j){	
	return CheckBox(i-1,j-1) +
		   CheckBox(i-1,j) +
		   CheckBox(i-1,j+1) + 
		   CheckBox(i,j-1) + 
		   CheckBox(i,j+1) + 
		   CheckBox(i+1,j-1) + 
		   CheckBox(i+1,j) + 
		   CheckBox(i+1,j+1);	   
}


function CreateNumbers(){
	for(var i = 0; i < 10; i++){
		for(var j = 0; j < 10; j++){
			if (BoardArr[i][j] != "X"){ 
				BoardArr[i][j] = CellNum(i,j);
			}
		}
	}
}

function FlagClick (i, j){
	if ((death == 0) && (win == 0)){				
		if (document.getElementById(cellId(i,j)).innerHTML == OtherDivText){
			document.getElementById(cellId(i,j)).innerHTML = flaghtml;
			flags += 1;
			document.getElementById("score").innerHTML = "Number of Flags Placed: "+flags;
		}
		else if (document.getElementById(cellId(i,j)).innerHTML == flaghtml){
			document.getElementById(cellId(i,j)).innerHTML = OtherDivText;
			flags -= 1;
			document.getElementById("score").innerHTML = "Number of Flags Placed: "+flags;
		}
	}
	
}



function BoxClick(i,j){
	if ((death == 0) && (win == 0)){
		if (document.getElementById(cellId(i,j)).innerHTML != flaghtml){
			if (BoardArr[i][j] == "X"){
				document.getElementById(cellId(i,j)).innerHTML = bombhtml;
				document.getElementById("result").innerHTML = "You Lose";
				EndBombs();
				death = 1;
			}
			else if (BoardArr[i][j] == 0){
				CheckSpace(i,j);
			}
			else{
				document.getElementById(cellId(i,j)).innerHTML = BoardArr[i][j];
			}
			CheckWin();
		}
	}
}


Board('container', height , width);
var BoardArr = Create2dArr();
CreateBombs();
CreateNumbers();
