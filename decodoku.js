//------------------------------------------------------------------------------
// QUANTUM ERROR CORRECTION CODE
//------------------------------------------------------------------------------
// TODO: Prune null cluster to free css color classes
// TODO: Work on the historical secs system
// TODO: Create a historical 3D view of the propagation and merging of clusters
// TODO: See a reverse view from spanners as a branching 3D view
// TODO: Persist gametype display
// TODO: Display first selected cell with bold
// TODO: Toggle console debug

// GLOBAL VARIABLES
var gridSize = 8;
var secs = 0;
var d = 10;
var clusterNum = 0;
var num = 0;
var type = "Number";
var score = 0;

// INITIALIZE CLUSTERS & ANYONS ARRAY
var anyons = [];
var clusters = [];
var clusterList = [];


//------------------------GAME LOGIC--------------------------------------------
// RESET CLUSTER GRID AND ANYONS
function resetAnyons() {
    clusterList = [];
    for (var secs = 0; secs < 50; secs++) {
        anyons[secs] = [];
        for (var x = 0; x < gridSize; x++) {
            anyons[secs][x] = [];
            clusters[x] = [];
            for (var y = 0; y < gridSize; y++) {
                anyons[secs][x][y] = 0;
            }
        }
    }
}


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

    // Random neighbour
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

    // Add new error to new cluster
    if (anyons[secs % 50][x1][y1] == 0 && anyons[secs % 50][x2][y2] == 0) {
        anyons[secs % 50][x1][y1] = a;
        anyons[secs % 50][x2][y2] = aa;
        clusterNum++;
        clusters[x1][y1] = clusterNum;
        clusters[x2][y2] = clusterNum;
        num++;

        // Add new error to existing cluster
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

        // Merge with existing cluster or merge clusters
    } else if (anyons[secs % 50][x1][y1] > 0 && anyons[secs % 50][x2][y2] > 0) {
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
    return [x1, y1, x2, y2, num];
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
    return spanners > 0 ? true : false;
}


// MOVES
function move(x1, y1, x2, y2) {
    console.log("Move from ["+x1+", "+y1+"]["+clusters[x1][y1]+"] to ["+x2+", "+y2+"]["+clusters[x2][y2]+"]");
    var newVal = (anyons[secs % 50][x1][y1] + anyons[secs % 50][x2][y2]) % d;
    anyons[secs % 50][x1][y1] = 0;
    anyons[secs % 50][x2][y2] = newVal;
    // link clusters or move to empty cell
    if (clusters[x2][y2] != undefined) {
        var oldCluster = clusters[x1][y1];
        for (var y = 0; y < gridSize; y++) {
            for (var x = 0; x < gridSize; x++) {
                if (clusters[x][y] == oldCluster) {
                    clusters[x][y] = clusters[x2][y2];
                }
            }
        }
    } else {
        clusters[x2][y2] = clusters[x1][y1];
        clusters[x1][y1] = undefined;
    }
    return newVal;
}


//------------------------DISPLAY-----------------------------------------------
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
                        if (anyons[secs % 50][x][y] == 5) {
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
    if (val == 0) {
        $cell.html("");
        $cell.removeClass();
    } else {
        $cell.html(val);
        $cell.removeClass();
        $cell.addClass('group' + clusters[x][y]);
    }
}

//------------------------CONTROLS----------------------------------------------
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


// NEW GAME
function newGame() {
    var x1, y1, x2, y2;
    secs = 0;
    clusterNum = 0;
    score = 0;
    resetAnyons();
    resetGrid();
    var num = 0;
    while (num < 6) {
        var error = generateError();
        x1 = error[0];
        y1 = error[1];
        x2 = error[2];
        y2 = error[3];
        updateCell(x1, y1, anyons[secs % 50][x1][y1]);
        updateCell(x2, y2, anyons[secs % 50][x2][y2]);
        num += error[4];
        displayClusters();
    }
    if (checkSpanners()) {
        newGame();
    }
}

//------------------------MAIN--------------------------------------------------
$(document).ready(function() {
    initGrid();
    newGame();

    // Player moves
    var dragging = false;
    var fromX, fromY;
    $("#grid tbody td").click(function() {
        var y = parseInt($(this).index());
        var x = parseInt($(this).parent().index());
        // Start move
        if (dragging == false) {
            fromX = x;
            fromY = y;
            dragging = true;
        } else if (dragging == true && fromX == x && fromY == y) {
            dragging = false;
        } else if (dragging == true && (
                fromX + 1 == x && fromY == y ||
                fromX - 1 == x && fromY == y ||
                fromX == x && fromY + 1 == y ||
                fromX == x && fromY - 1 == y)) {
            newVal = move(fromX, fromY, x, y);
            updateCell(fromX, fromY, 0);
            updateCell(x, y, newVal);
            displayClusters();
            dragging = false;
        } else {
            console.log("Movement error...");
            dragging = false;
        }
        displayGrid();
    });

    // Controls
    $("#newgame").click(function() {
        newGame();
    });
    $("#error").click(function() {
        generateError();
        displayGrid();
    });
    $("input[name='gametype']").change(function() {
        type = $(this).val();
        console.log(type);
        displayGrid();
    });
});
