// GLOBAL VARIABLES
var gridSize = 8;
var secs = 0;
var d = 10;

// the anyons (which are the numbers) are stored in an LxL array (one element for each square in the LxL grid)
// also, rather than just storing the present set of numbers, those for the last 49 moves are also stored
// the array 'clusters' identifies the cluster to which each anyon belongs (at the present move)
var anyons = [];
var clusters = [];
for (var secs = 0; secs < 51; secs++) {
    anyons[secs] = [];
    for (var x = 0; x < gridSize; x++) {
        anyons[secs][x] = [];
        clusters[x] = [];
        for (var y = 0; y < gridSize; y++) {
            clusters[x][y] = 0;
            anyons[secs][x][y] = 0;
        }
    }
}

// CHECK SPANNERS
var spanners = 0;
for (var x = 0; x < gridSize; x++) {
    for (var y = 0; y < gridSize; y++) {
        spanners += (clusters[x][0] == clusters[y][gridSize - 1]) * clusters[x][0];
        spanners += (clusters[0][x] == clusters[gridSize - 1][y]) * clusters[0][x];
    }
}
if (spanners > 0) {
    // reset
}


// DRAW MAZE
function displayGrid() {
    resetGrid();
    if (arguments[0] == "Phi"){
      phi = true;
    }
    for (var y = 0; y < gridSize; y++) {
        row = $('<tr></tr>');
        for (var x = 0; x < gridSize; x++) {

            var rowData = $('<td></td>');
            row.append(rowData);
        }
        $('#grid tbody').append(row);
    }
}

// RESET GRID
function resetGrid() {
  $('#grid tbody').empty();
}

// GENERATE NOISE
function generateNoise() {

    // Pick a random square
    var x1 = Math.floor(Math.random() * gridSize);
    var y1 = Math.floor(Math.random() * gridSize);
    var r = 2 * (Math.floor(Math.random() * 1000) % 2) - 1;
    var a = Math.floor(Math.random() * 9) + 1;
    var aa = 10 - a;
    var x2, y2;
    var num, clusterNum;

    // Random neighbour in X direction
    if (Math.random() < 0.5) {
        if (x1 == 0 || x1 == gridSize - 1) {
            x2 = x1 + (x1 == 0) - (x1 == (gridSize - 1));
            console.log(x2);
        } else {
            x2 = x1 + r;
        }
        y2 = y1;
    } else {
        x2 = x1;
        if (y1 == 0 || y1 == gridSize - 1) {
            y2 = y1 + (y1 == 0) - (y1 == (gridSize - 1));
            console.log(y2);
        } else {
            y2 = y1 + r;
        }
    }

    // Créer paire
    console.log("Pair between: [" + x1 + ", " + y1 + "] and [" + x2 + ", " + y2 + "]");
    var cell = $('#grid tbody')[0].rows[x1].cells[y1];
    var $cell = $(cell);
    $cell.html(a);
    var cell = $('#grid tbody')[0].rows[x2].cells[y2];
    var $cell = $(cell);
    $cell.html(aa);

    // the numbers are put in the corresponding elements of the matrix 'anyons', which stores all the numbers
    // if both numbers are new, they are a new cluster
    // they become the cluster numbered clusterNum=clusterNum+1
    // the cluster num is put in the corresponding entries of 'clusters'
    if (anyons[secs % 50][x1][y1] == 0 &&
        anyons[secs % 50][x2][y2] == 0) {
        anyons[secs % 50][x1][y1] = a;
        anyons[secs % 50][x2][y2] = aa;
        clusterNum++;
        clusters[x1][y1] = clusterNum;
        clusters[x2][y2] = clusterNum;
        num++;

        // if one of the squares already had a number in, the error just adds to this cluster
    } else if (anyons[secs % 50][x1][y1] == 0 && anyons[secs % 50][x2][y2] > 0) {
        anyons[secs % 50][x1][y1] = (a + anyons[secs % 50][x1][y1]) % d;
        anyons[secs % 50][x2][y2] = (aa + anyons[secs % 50][x2][y2]) % d;
        clusters[x1][y1] = clusters[x2][y2];
        clusters[x2][y2] = clusters[x2][y2] * (anyons[secs % 50][x2][y2] > 0);
        num++;
    } else if (anyons[secs % 50][x1][y1] > 0 && anyons[secs % 50][x2][y2] == 0) {
        anyons[secs % 50][x1][y1] = (a + anyons[secs % 50][x1][y1]) % d;
        anyons[secs % 50][x2][y2] = (aa + anyons[secs % 50][x2][y2]) % d;
        clusters[x2][y2] = clusters[x1][y1];
        clusters[x1][y1] = clusters[x1][y1] * (anyons[secs % 50][x1][y1] > 0);
        num++;

        // if both already had numbers in, and belong to the same cluster, the results also belong to that cluster
        // if they belonged to different clusters, the clusters are merged
    } else if (anyons[secs % 50][x1][y1] > 0 && anyons[secs % 50][x2][y2] > 0) {
        // then do the adding
        var clusterOld = clusters[x2][y2];
        for (var y = 0; y < gridSize; y++) {
            for (var x = 0; x < gridSize; x++) {
                if (clusters[x][y] == clusterOld) {
                    clusters[x][y] = clusters[x1][y1];
                }
            }
        }
        anyons[secs % 50][x1][y1] = (a + anyons[secs % 50][x1][y1]) % d;
        anyons[secs % 50][x2][y2] = (aa + anyons[secs % 50][x2][y2]) % d;
        clusters[x1][y1] = clusters[x1][y1] * (anyons[secs % 50][x1][y1] > 0);
        clusters[x2][y2] = clusters[x2][y2] * (anyons[secs % 50][x2][y2] > 0);
        // these are counted less towards num
        num += 0.1;
    }
}

$(document).ready(function() {
    displayGrid();
    for (var x = 0; x < 5; x++) {
        generateNoise();
    }

    // New game
    $("#newgame").click(function() {
        for (var x = 0; x < 5; x++) {
            generateNoise();
        }
    });

    $("input[name='gametype']").change(function() {
        if ($(this).val() === 'Phi') {
            displayGrid("Phi");
        } else if ($(this).val() === 'Numbers') {
            displayGrid("Numbers");
        }
    });

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
        if (anyons[y][x] == 5) {
            anyons[y] = anyons[y].replaceAt(x, " ");
        } else if (anyons[y][x] == 0) {
            anyons[y] = anyons[y].replaceAt(x, "#");
        }
    });
});
