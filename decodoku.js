// QUANTUM ERROR CORRECTION CODE
// Create a historical 3D view of the propagation and merging of clusters


// GLOBAL VARIABLES
var gridSize = 8;
var secs = 0;
var d = 10;
var clusterNum = 0;
var num = 0;
var type = "Number";

// INITIALIZE CLUSTERS & ANYONS ARRAY
var anyons = [];
var clusters = [];


// GENERATE NOISE
function generateError() {

    // Pick a random square
    var x1 = Math.floor(Math.random() * gridSize);
    var y1 = Math.floor(Math.random() * gridSize);
    var r = 2 * (Math.floor(Math.random() * 100) % 2) - 1;
    var a = Math.floor(Math.random() * 9) + 1;
    var aa = 10 - a;
    var x2, y2;
    var num = 0;

    // Random neighbour in X direction
    if (Math.random() < 0.5) {
        if (x1 == 0 || x1 == gridSize - 1) {
            x2 = x1 + (x1 == 0) - (x1 == (gridSize - 1));
        } else {
            x2 = x1 + r;
        }
        y2 = y1;
    } else {
        x2 = x1;
        if (y1 == 0 || y1 == gridSize - 1) {
            y2 = y1 + (y1 == 0) - (y1 == (gridSize - 1));
        } else {
            y2 = y1 + r;
        }
    }

    // ADD NEW ERROR TO CLUSTER
    if (anyons[secs % 50][x1][y1] == 0 && anyons[secs % 50][x2][y2] == 0) {
        anyons[secs % 50][x1][y1] = a;
        anyons[secs % 50][x2][y2] = aa;
        clusterNum++;
        clusters[x1][y1] = clusterNum;
        clusters[x2][y2] = clusterNum;
        num++;

        // ADD NEW ERROR TO EXISTING CLUSTER
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

        // MERGE WITH EXISTING CLUSTER OR MERGE CLUSTERS
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

    // DISPLAY
    updateCell(x1, y1, anyons[secs % 50][x1][y1]);
    updateCell(x2, y2, anyons[secs % 50][x2][y2]);
    return num;
}


// CHECK SPANNERS
function checkSpanners() {
    var spanners = 0;
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            spanners += (clusters[x][0] == clusters[y][gridSize - 1]) * clusters[x][0];
            spanners += (clusters[0][x] == clusters[gridSize - 1][y]) * clusters[0][x];
        }
    }
    if (spanners > 0) {
        return true;
    } else {
        return false;
    }
}


// CLUSTER THREAT LEVEL
function threatLevel(cluster) {
    // get min and max X from cluster
    cluster.sort(function(a, b) {
        return a[0] - b[0];
    });
    var threatX = cluster[cluster.length - 1][0] - cluster[0][0];
    cluster.sort(function(a, b) {
        return a[1] - b[1];
    });
    var threatY = cluster[cluster.length - 1][1] - cluster[0][1];
    return threatX + threatY;
}


// RESET CLUSTER GRID AND ANYONS
function resetAnyons() {
    for (var secs = 0; secs < 51; secs++) {
        anyons[secs] = [];
        for (var x = 0; x < gridSize; x++) {
            anyons[secs][x] = [];
            clusters[x] = [];
            for (var y = 0; y < gridSize; y++) {
                //clusters[x][y] = 0;
                anyons[secs][x][y] = 0;
            }
        }
    }
}


// INIT GRID
function initGrid() {
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
    for (var y = 0; y < gridSize; y++) {
        for (var x = 0; x < gridSize; x++) {
            var cell = $('#grid tbody')[0].rows[x].cells[y];
            var $cell = $(cell);
            $cell.html(" ");
            $cell.removeClass();
        }
    }
}


// DRAW GRID
function displayGrid() {
    for (var y = 0; y < gridSize; y++) {
        for (var x = 0; x < gridSize; x++) {
            if (anyons[secs % 50][x][y] != 0) {
              switch (type) {
                case "Number":
                  updateCell(x, y, anyons[secs % 50][x][y]);
                  break;
                case "Phi":
                  if (anyons[secs % 50][x][y] == 5){
                      updateCell(x, y, "V");
                  } else {
                      updateCell(x, y, "#");
                  }
                  break;
                case "Cluster":
                  updateCell(x, y, clusters[x][y]);
                  break;
            }
        }
    }
}
}

// UPDATE CELL
function updateCell(x, y, val) {
    var cell = $('#grid tbody')[0].rows[x].cells[y];
    var $cell = $(cell);
    $cell.html(val);
    $cell.addClass('group' + clusters[x][y]);
}


// DISPLAY CLUSTERS
function displayClusters() {
    $('#clusters tbody').empty();

    // get ordered list of clusters
    var clusterList = [];
    for (var clust = 0; clust < clusterNum + 1; clust++) {
        clusterList[clust] = [];
        for (var y = 0; y < gridSize; y++) {
            for (var x = 0; x < gridSize; x++) {
                if (clusters[x][y] == clust) {
                    clusterList[clust].push([x, y]);
                }
            }
        }
    }
    // Sort array by size
    clusterList.sort(function(a, b) {
        return b.length - a.length;
    });
    // display list in a table
    for (var x = 0; x < clusterNum; x++) {
        if (clusterList[x].length > 0) {
            var row = "";
            row += "<tr>";
            row += "<td>" + x + "</td>";
            row += "<td>" + clusterList[x].length + "</td>";
            row += "<td>" + threatLevel(clusterList[x]) + "</td>";
            row += "<td>" + clusterList[x].toString() + "</td>";
            row += "</tr>";
            $('#clusters tbody').append(row);
        }
    }
}


// NEW GAME
function newGame() {
    secs = 0;
    clusterNum = 0;
    resetAnyons();
    resetGrid();
    var num = 0;
    while (num < 6) {
        num += generateError();
    }
    if (checkSpanners()) {
        newGame();
    }
    displayClusters();
}


// MAIN
$(document).ready(function() {
    initGrid();
    newGame();

    // New game
    $("#newgame").click(function() {
        newGame();
    });

    // Gametype
    $("input[name='gametype']").change(function() {
      type = $(this).val();
      console.log(type);
      displayGrid();
    });
});
