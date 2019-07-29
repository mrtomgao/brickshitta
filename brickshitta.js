//BRICK SHITTA 1.0.0  BY TGAO
  
$(document).ready(function() {

  //#############################################################
  //##################### MAIN PROCEDURE ########################
  //#############################################################

  //Init Globals
  var totalCols = 10;             //traditional tetris is 10 columns, by 20 rows
  var totalRows = 20;             //traditional tetris is 10 columns, by 20 rows
  var speed = 1000;                //the speed of the game in milliseconds
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
    if (!gameOver) {
      if (!collideVert(activeBuffer)) {
        MoveBrick(totalCols);
      } else { 
        //block collided with something, commit the active
        CommitBuffer(activeBuffer);
        CheckForCapped();  
        ShitBrick();
      }   
    } else {
      //game over bro...
      CommitBuffer(activeBuffer)
      console.log('Game Over.');
      clearInterval(main);
    }
  }    

  //Lower dem brick but also redraw too
  function MoveBrick(i) {
    currPos += i;
    var movedBuffer = Offset(activeBuffer, i);
    clearBuffer(activeBuffer);    
    drawBuffer(movedBuffer, colorActive);    
    activeBuffer = movedBuffer;
    //console.log("(activeBuffer: " + activeBuffer + ') (currPos: ' + currPos + ')');
  }

  //Shit a new Brick at top middle
  function ShitBrick() {    

    //brick shapes as binary, why i did it this way? who knows.
    var brix = [
      `10
       10
       11`,
      `01
       01
       11`,
      `111
       010`,
      `10
       11
       01`,
      `01
       11
       10`,
      `11
       11`,
      `1
       1
       1
       1`
      ];

    currSprite = brix[Math.floor(Math.random() * 7)];

    //setting top middle
    currPos = calcMid(currSprite);   
    activeBuffer = convertSprite(currSprite);
    drawBuffer(activeBuffer, colorActive);
  }

  //if the shit brick hits something while spinnin
  function collideOnRotate(buffer) {
    if (!collideVert(Offset(buffer, -totalCols))) {
      if (leftOrRight() == 'r') {
        //right side
        if (!collideHorz(Offset(buffer, -1), 'r')) {
          return false;
        }
      } 
      else {
        //left side
        if (!collideHorz(Offset(buffer, 1), 'l')) {
          return false;
        }          
      }
    }
    return true;
  }

  //cap any complete lines made from dem Commited Buffer!!!
  function CheckForCapped() {
    var cappedRows = [];
    var arrCom = commitedBuffer.trim()
            .split(',')
            .filter(Boolean)
            .sort(function(a, b){return a-b});

    for (var y = 0; y < totalRows; y++) {
              var lineCheck = 0;
      for (var x = 1; x <= totalCols; x++) {
        var cellCheck = (y * totalCols) + x;
        for (var z = 0; z < arrCom.length; z++) {
          if (parseInt(arrCom[z]) == cellCheck) {
            lineCheck++;
          }
        }
      }
        if (lineCheck == totalCols) {
          cappedRows.push(y);
        }
    }
    if (cappedRows.length > 0) {
      DeleteRow(cappedRows);
    }
  }

  //if the active brick hits something via top down
  function collideVert(buffer) {
    var itm = buffer.split(',');
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
              return true;             
            }
          }
          return true;
        }
      }      
    }     
    return false;
  }

  //if the active brick hits something via horizontal (side by side)
  function collideHorz(buffer, direction) {
    var arrAct = buffer.trim()
              .split(',')
              .filter(Boolean)
              .sort(function(a, b){return a-b});
    var arrCom = commitedBuffer.trim()
              .split(',')
              .filter(Boolean)
              .sort(function(a, b){return a-b});

    var contactPoint = 0;
    for (var i = 0; i < arrAct.length; i++) 
    {
      var contactPointA = parseInt(arrAct[i]);

      //if direction is Left then the contact point should be one less than the quotient of 0
      if (direction == 'l')
      {
        contactPointA--;
      }
    
      //if wall hit (contact point is whatever buffer position in a brick)
      if (contactPointA % totalCols == 0) 
      {
        return true;
      }

      //detecting side collision with commited bufferz
      for (var x = 0; x < arrCom.length; x++) 
      {
        var contactPointB = parseInt(arrCom[x]);

        if (direction == 'r') {
          contactPointB--;
        }

        if (contactPointA == contactPointB) {
          return true;
        }
      }

    }

  }


  //#############################################################
  //######################## HELPERS ############################
  //#############################################################

  function calcMid(sprite) {
    var gridCenter = 0;
    //detect grid center
    if (totalCols % 2 == 0) {
      //even
      gridCenter = parseInt(totalCols / 2)
    }
    else {
      //odd
      gridCenter = parseInt(totalCols /2) + 1;
    }

    var width = sprite.split('\n')[0].length;
    var spriteCenter = parseInt(width / 2);
    //detect sprite
    if (width % 2 != 0) {
      //even
      spriteCenter++;
    }
    return gridCenter - spriteCenter;
  }
  
  function calcWidth(sprite) {
    return sprite.split('\n')[0].length;
  }


  function leftOrRight() {
    var i = (currPos % totalCols) / totalCols;
    var LR = "";
    if (i >= ((totalCols * .5) / totalCols)) {
      LR = "r";
    } else {
      LR = "l";
    }
    return (LR);
  }




  //#############################################################
  //######################## DRAW FUNCS #########################
  //#############################################################
  
  function DeleteRow(arrRows) {
    var newComBuffer = "";
    arrRows.sort(function(a,b) {return b-a});
    var arrCom = commitedBuffer.trim()
          .split(',')
          .filter(Boolean)
          .sort(function(a, b){return a-b});
    console.log('start' + arrCom.length);
    for (var i = 0; i < arrRows.length; i++) {
      var rowIndex = parseInt(arrRows[i]) * totalCols;
      console.log(rowIndex);
      for (var x = 1; x <= totalCols; x++) {
        var del = parseInt(rowIndex + x);
        for (var s = 0; s <= arrCom.length - 1; s++) {
          if (parseInt(arrCom[s]) == del) {
            //remove all elements of array
            //console.log('remove' + arrCom[s]);
            arrCom[s] = "";
          }
        }
      }
    }

    var newArrCom = arrCom.filter(Boolean);

    for (var c = 0; c < newArrCom.length; c++) {
      newComBuffer += newArrCom[c] + ",";
    }

    CommitBuffer(newComBuffer);

  }

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
    var colCount = calcWidth(sprite);
    var oldSprite = sprite.split('\n');
    var newSprite = '';

    if (clockwise == true) {
      for(var x = 0; x < colCount; x++){
        for(var i = rowCount - 1; i > -1; i--) {
          newSprite += oldSprite[i].trim().charAt(x);
          if (i == 0) {
            newSprite += "\n";
          }
        }    
      }
    } else {
      for(var x = colCount - 1; x > -1; x--){
        for(var i = 0; i != rowCount; i++) {
          newSprite += oldSprite[i].trim().charAt(x);
          if (i == rowCount - 1) {
            newSprite += "\n";
          }
        }    
      }   
    }  
    return newSprite; 
  }

  //#############################################################
  //######################## USER EVENTS ########################
  //#############################################################

  //ROTATE EVENT
  $('#Grid').mousedown(function(event) {
    if (!gameOver) {
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


  $("html").keydown(function( event ) {
    if (!gameOver) {
      switch (event.which) {
        case 32: //space
            var newSprite = rotateSprite(currSprite, true);
            var rotBuffer = convertSprite(newSprite, currPos);
            if (!collideOnRotate(rotBuffer)) {
              clearBuffer(activeBuffer);
              currSprite = newSprite;
              activeBuffer = rotBuffer;
              drawBuffer(activeBuffer, colorActive);              
            }
            break;
        case 17: //ctrl
            var newSprite = rotateSprite(currSprite, false);
            var rotBuffer = convertSprite(newSprite, currPos);
            if (!collideOnRotate(rotBuffer)) {
              clearBuffer(activeBuffer);
              currSprite = newSprite;
              activeBuffer = rotBuffer;
              drawBuffer(activeBuffer, colorActive);              
            }
            break;
        case 65: //a
            if (!collideHorz(activeBuffer, 'l')) {
              MoveBrick(-1);
            }
            break;
        case 68: //d
            if (!collideHorz(activeBuffer, 'r')) {
              MoveBrick(1);
            }
            break;
        case 83: //s
            if (!collideVert(activeBuffer)) {
              MoveBrick(totalCols);
            }
            break;
        default: //other
      }
    }
  });
});