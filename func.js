var max_row = 0,max_col=0,colors = ["#32ff7e" , "#18dcff","#ff3838","#fffa65","#218c74"]
var num_matches=3,pick = null,arrBalls = [],score=0
var colcount =0, rowcount =0; var undis = 0;
var firstrow = 0, firstcol = 0;
var score = 0, gameOver = 0;
window.onload = function (){
    document.getElementById("drpMode").onchange = function(){
        num_matches = Number(document.getElementById("drpMode").value);
        
    };
    document.getElementById("btnStart").onclick = function(){
        score = 0;
        max_col = num_matches + 5;
        max_row = num_matches + 3;
        NewGame();
        NewGrid();
        BindGrid();
        NextTurn();
        ShowGrid();
    };
    
}

function Cell(rows, cols){
    this.rows = rows;
    this.cols = cols;
    this.Color = -1;
    this.display = false;
    this.highlight = false;
}

Cell.prototype.Show = function(){
    let Cellid = "row" + this.rows + "col" + this.cols;
    document.getElementById(Cellid).style.borderWidth = "0px";
    if(this.display === false){
        document.getElementById(Cellid).style.backgroundColor = "gray";
        return 1;
    }
    else{
        document.getElementById(Cellid).style.backgroundColor = colors[this.Color];
    }
}
Cell.prototype.Bind = function(){
    let cellid = "row"+this.rows + "col" + this.cols;
    var row = this.rows;
    var col = this.cols;
    undis = 0;
    document.getElementById(cellid).onclick = function(){
        if(pick===null && arrBalls[row][col].display===true){
            pick = arrBalls[row][col];
            document.getElementById(cellid).style.borderRadius = "0%";

            
        }
        else if(pick !== null){
            if(arrBalls[row][col].display == true)
                return;
            else{
                arrBalls[row][col].Color = pick.Color;
                pick.display = false;
                pick.highlight = false;
                document.getElementById("row"+pick.rows+"col"+pick.cols).style.borderRadius = "5000%";
                arrBalls[row][col].display = true;
                pick = null;
            }
            Check(row,col);
            if(rowcount >= num_matches ){
                score += rowcount;                                                 
                ShowScore(score, 0); 
                ClearCells();
            }
            else if(colcount >= num_matches ){
                score += colcount;                                             
                ShowScore(score, 0); 
                ClearCells();
            }
            else
                ClearHighlight();
            undis = 0;
            ShowGrid();
            if(undis>=3)
                NextTurn();
            else
                ShowScore(score, 1);
        }
        
        ClearHighlight();

        ShowGrid();
    };
}
function show()
{
    document.getElementById('overlay').style.display = "none";                  
}
function NewGame(){
    for(var i = 0; i < max_row; i++){
        arrBalls[i] = [];
        for(var j = 0; j < max_col; j++){
            arrBalls[i].push(new Cell(i,j));
        }
    }
}
function NewGrid(){
    var content = "";
    content += '<table>';
    for(var i = 0; i<max_row;i++){
        content += "<tr>";
        for(var j = 0; j < max_col;j++){
            content += "<td><button type='button' id='row" + i + 'col' + j + "'</button></td>";
        }
        content += "</tr>";
    }
    content += "</table>";
    document.getElementById("divBallGrid").innerHTML = content;
}
function ShowGrid(){
    for(var i = 0; i<max_row;i++)
        for(var j = 0 ;j<max_col;j++){
            arrBalls[i][j].Show();
            if(arrBalls[i][j].display === false)
                undis++;
        }
            
}
function BindGrid(){
    for(var i = 0; i<max_row;i++)
        for(var j = 0 ;j<max_col;j++)
            arrBalls[i][j].Bind();
}
function Check(row, col){
    var sColor = arrBalls[row][col].Color;
    firstcol = 0;
    firstrow = 0;
    rowcount = 0;
    colcount = 0;
    CheckR(row,col,sColor);
    CheckC(row,col,sColor);
    
}
function CheckR(row,col,sColor){

    while(row >0){
        if(arrBalls[row][col].Color !== arrBalls[row-1][col].Color){
            firstrow = row;
            break;
        }
        --row;
    }
    while(arrBalls[firstrow][col].Color === sColor && arrBalls[firstrow][col].display === true){
        ++rowcount;
        if(firstrow+1 >= max_row){
            arrBalls[firstrow][col].highlight = true;
            break;
        }
        arrBalls[firstrow][col].highlight = true
        
        
        ++firstrow;
    }
    
        
}
function CheckC(row,col,sColor){
    while(col >0){
        if(arrBalls[row][col].Color !== arrBalls[row][col-1].Color){
            firstcol = col;
            break;
        }
        --col;
    }
    while(arrBalls[row][firstcol].Color === sColor && arrBalls[row][firstcol].display === true){
        ++colcount;
        if(firstcol + 1 >= max_col){
            arrBalls[row][firstcol].highlight = true;
            break;
        }
        arrBalls[row][firstcol].highlight = true
        
        
            
        ++firstcol;
    }
}
function ClearHighlight(){
    for(var i = 0; i<max_row;i++)
        for(var j = 0 ;j<max_col;j++)
            arrBalls[i][j].highlight = false;
}
function RandomCell(){
    var RanR = Math.floor(Number(Math.random() * max_row));
    var RanC = Math.floor(Number(Math.random()* max_col));
    return arrBalls[RanR][RanC];
}
function NextTurn(){
    for(var i = 0; i < 3; i++){
        var rancell = RandomCell();
        if(rancell.display == true)
            --i;
        if(rancell.display !== true){
            rancell.Color = Math.floor(Math.random() * colors.length);
            rancell.display = true;
        }
    }
}
function ClearCells(){
    for(var i = 0; i<max_row;i++)
        for(var j = 0 ;j<max_col;j++){
            if(arrBalls[i][j].highlight === true){
                arrBalls[i][j].highlight = false;
                arrBalls[i][j].display = false;
                arrBalls[i][j].Color = -1;
                arrBalls[i][j].Show();
            }
        }
            
}

function ShowScore(score, gameOver) {
    
    if (gameOver === 0)
    {
        document.getElementById('overlay').textContent = "Score: " + score;
        document.getElementById('overlay').style.display = "block";
        setTimeout(function () { show() }, 2000);
    } 
    else
    {
        let newline = "\r\n";
        document.getElementById('overlay').textContent = "Game Over" + newline + "Score: " +score;
        document.getElementById('overlay').style.display = "block";
    }
}
function ShowScore(score, gameOver)
{
    if (gameOver === 0)                                                            
    {
        document.getElementById('overlay').textContent = "Score:" + score;         
        document.getElementById('overlay').style.display = "block";               
        setTimeout(function () {       
            show()                                                                 
        }, 1000);
    } else                                                                        
    {
        document.getElementById('overlay').textContent = "Game Over Score:"+score; 
        document.getElementById('overlay').style.display = "block";    
        setTimeout(function () {       
            show()                                                                 
        }, 1000);  
        NewGame();
        NewGrid();
        BindGrid();
        NextTurn();
        ShowGrid();
        score = 0;        
    }
}