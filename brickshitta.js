//BRICK SHITTA 1.0.0  BY DEV DAWGZ
//B. PEREA - Lead Developer
//K. SAM - Architect
//T. GAO - Project Manager & Prototypes
  
$( document ).ready(function() {

  //#############################################################
  //##################### MAIN PROCEDURE ########################
  //#############################################################

  //Init Globals
  var totalCols = 10;             //traditional tetris is 10 columns, by 20
  var totalRows = 20;             //traditional tetris is 10 columns, by 20
  var speed = 100;                //the speed of the game in milliseconds
  var activeBuffer = '';          //active is what's moving on screen
  var commitedBuffer = '';        //commited is what has collided or commited to the grid
  var currSprite = '';            //The current "Sprite" of Brick that has been shat
  var currPos;                    //current position of Brick which has been shat
  var gameOver = false;           //is the player dead
  var colorActive = 'lightblue';  //color for the active brix
  var colorCommited = 'white';    //color for brix that have set
  var colorBg = 'black';          //color for dem background

  //Begin
  BuildGrid(totalCols, totalRows); 
  ShitBrick();
  
  //Create the main interval
  var main = setInterval(Pulse, speed);





















  //#############################################################
  //######################## GAME LOGIC #########################
  //#############################################################
  
  //Main heartbeat of da game
  function Pulse() {
    if (gameOver == false) {
      if (detectCollide() == false) {
        MoveBrick();
      } else { 
        //block collided with something, commit the active
        CommitBuffer(activeBuffer);
        ShitBrick();
      }   
    } else {
      CommitBuffer(activeBuffer)
      console.log('Game Over.');
      clearInterval(main);
    }
  }    

  //Lower dem brick but also redraw too
  function MoveBrick() {
    currPos += totalCols;
    var movedBuffer = Offset(activeBuffer, totalCols);
    clearBuffer(activeBuffer);    
    drawBuffer(movedBuffer, colorActive);    
    activeBuffer = movedBuffer;
    console.log("(activeBuffer: " + activeBuffer + ') (currPos: ' + currPos + ')');
  }

  //Shit a new Brick at top middle
  function ShitBrick() {    

    currSprite = 
      `100
       100
       111
       001`;

    //setting top middle
    currPos = Math.round((totalCols / 2) - (currSprite.split('\n')[0].length / 2));    
    activeBuffer = convertSprite(currSprite);
    drawBuffer(activeBuffer, colorActive);
  }
  
  //if the active brick hits something
  function detectCollide() {
    var itm = activeBuffer.split(',');
    var commited = commitedBuffer.split(',');
    
    if (activeBuffer.trim() != '') {
      for (var i = 0; i < itm.length; i++) {
        if(itm[i].trim() > ((totalRows * totalCols) - totalCols)) {
          return true;
        }
        if(commited.indexOf((Number(itm[i].trim()) + totalCols).toString()) > -1 && itm[i].trim() != '') {
          for (var x = 0; x < itm.length; x++) {            
            //detect game over situation
            if (Number(itm[x].trim()) - totalCols < 0 && itm[x].trim() != '') {
              gameOver = true;              
            }
          }
          return true;
        }
      }      
    }     
    return false;
  }



  //#############################################################
  //######################## DRAW FUNCS #########################
  //#############################################################
  
  function BuildGrid(col,rows) {
    var colSeed = 0;
    for(var i = 1; i < rows + 1; i++) {
      $("#Grid").append('<div id=row' + i + '></div>');    
      for(var x = 1; x < col + 1; x++) {
        colSeed = (x + ((i - 1) * col));
            $( "#row" + i ).append('<div id=' + colSeed + ' class=pos></div>');
      }            
    }
  }

  function Offset(buffer, offset) {
    var arr = buffer.trim()
              .split(',')
              .filter(Boolean)
              .sort(function(a, b){return a-b});

    var newBuffer = '';
    for (var i = 0; i < arr.length; i++) {
      newBuffer += (parseInt(arr[i]) + parseInt(offset)) + ',';
    }
    return newBuffer;
  }

  function clearBuffer(buffer) {
    var arr = buffer.trim()
              .split(',')
              .filter(Boolean)
              .sort(function(a, b){return a-b});
    for (var i = 0; i < arr.length; i++) {
      $("#" + arr[i]).css({"background-color": colorBg});      
    }
    activeBuffer = '';
  }
  
  function CommitBuffer(buffer) {
    commitedBuffer += buffer;  
    drawBuffer(commitedBuffer, colorCommited);    
  }
  
  function drawBuffer(buffer, color) {

    var arr = buffer.trim()
              .split(',')
              .filter(Boolean)
              .sort(function(a, b){return a-b});

    for (var i = 0; i < arr.length; i++) {
      $("#" + arr[i]).css({"background-color": color});
    }
  }
    
  function convertSprite(sprite) {  
    var newBuffer = '';
    var lines = sprite.split('\n');
    var startPos = 0;
    for(var i = 0;i < lines.length;i++){
      var line = lines[i].trim();      
      for (var x = 0; x < line.length; x++) {
        startPos++;
        if(line.charAt(x) == '1') {
          newBuffer += startPos + ",";
        }             
      }
      startPos = 0;
      startPos += (totalCols * (i + 1));
    }
    return Offset(newBuffer, currPos);
  }

  function rotateSprite(sprite, clockwise) {

    var rowCount = sprite.split('\n').filter(String).length;
    var colCount = sprite.split('\n')[0].length;
    var oldSprite = sprite.split('\n');
    var newBuffer = '';

    if (clockwise == true) {
      for(var x = 0; x < colCount; x++){
        for(var i = rowCount - 1; i > -1; i--) {
          newBuffer += oldSprite[i].trim().charAt(x);
          if (i == 0) {
            newBuffer += "\n";
          }
        }    
      }    
    } else {
      for(var x = colCount - 1; x > -1; x--){
        for(var i = 0; i != rowCount; i++) {
          newBuffer += oldSprite[i].trim().charAt(x);
          if (i == rowCount - 1) {
            newBuffer += "\n";
          }
        }    
      }   
    }  
    return newBuffer; 
  }

  //#############################################################
  //######################## USER EVENTS ########################
  //#############################################################

  //ROTATE EVENT
  $('#Grid').mousedown(function(event) {
    if (gameOver == false) {
      switch (event.which) {
        case 1: //left 
            clearBuffer(activeBuffer);
            currSprite = rotateSprite(currSprite, true); 
            activeBuffer = convertSprite(currSprite, currPos);    
            drawBuffer(activeBuffer, colorActive);
            break;
        case 2: //mid

            break;
        case 3: //right
            clearBuffer(activeBuffer);
            currSprite = rotateSprite(currSprite, false); 
            activeBuffer = convertSprite(currSprite, currPos); 
            drawBuffer(activeBuffer, colorActive);
            break;
        default: //other
      }
    }
  }); 
});