//
anyons = [
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        ",
  "        "
];


// DRAW MAZE
function drawMap() {
  for (var y = 0; y < 8; y++) {
    row = $('<tr></tr>');
    for (var x = 0; x < 8; x++) {
      //var rowData = $('<td>' + level[y][x] + '</td>');
      var rowData = $('<td></td>');
      row.append(rowData);
    }
    $('#grid tbody').append(row);
  }
  //$('#grid tbody')[0].rows[0].cells[0].html('?');
  //$('#grid tbody')[0].rows[7].cells[7].html('?');
}

// GENERATE NOISE
function generateNoise(){

  // Pick a random square
  var x1 = Math.floor(Math.random() * 7);
  var y1 = Math.floor(Math.random() * 7);
  var x2, y2, r;

  // Random neighbour in X direction
  var randX = Math.random();
  if (randX < 0.5){
     if (x1 == 0 || x1 == anyons.length - 1){
       x2 = x1 + (x1==0) - (x1==(L-1));
     } else {
       r = 2 * (Math.random() % 2) - 1;
       x2 = x1 + r;
     }
     y2 = y1;
  } else {
    if (y1 == 0 || y1 == anyons.length - 1){
      y2 = y1 + (y1==0) - (y1==(L-1));
    } else {
      r = 2 * (Math.random() % 2) - 1;
      y2 = y1 + r;
    }
  }

  // Random neighbour in Y direction
  var randY = Math.random();
  if (randY < 0.5){

  } else {

  }
}


$(document).ready(function() {
  drawMap();
  generateNoise();

  // Modify Maze
  $("#grid tbody td").click(function() {
    String.prototype.replaceAt = function(index, character) {
      return this.substr(0, index) + character + this.substr(index + character.length);
    }
    var x = parseInt($(this).index());
    var y = parseInt($(this).parent().index());
    var cell = $('#grid tbody')[0].rows[y].cells[x];
    var $cell = $(cell);
    $cell.removeClass();
    if (level[y][x] == "p") {
      level[y] = level[y].replaceAt(x, " ");
    } else if (level[y][x] == "l") {
      level[y] = level[y].replaceAt(x, "#");
    }
  });
});
