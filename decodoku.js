/* global $, document, _*/
//------------------------------------------------------------------------------
// QUANTUM ERROR CORRECTION CODE
//------------------------------------------------------------------------------
// INPUT: A 8*8 grid of values or game over
// OUTPUT: A list of 10 numbers describing grid movements

// Game mechanics
// TODO: Implement ability to find clusters on differents grids that anyons
// TODO: Implement cluster solving cost
// TODO: Create a cluster and a cell class
// AI
// TODO: Tensor strength is distance to other compatible cluster
// TODO: Implement divide and conquer strategy
// TODO: Consider puzzle as a collapsing graph
// TODO: Implement a js eval textarea field where you can test your AI
// History
// TODO: Create a highscore chart
// TODO: Improve save function
// TODO: Implement an auto replay feature
// TODO: Implement secs for noise generation
// Ideas
// Why not use d = 9 or ^2 since then we have % 3 and more efficient
// Could the digital root be used since it acts close to the modulo


// GLOBAL VARIABLES
var gridSize = 8;
var d = 10;
var secs = 0;
var errorRate = 5;
var gametype = "puzzle";

// INITIALIZE CLUSTERS & ANYONS ARRAY
var anyons = [];
var computeGrid = [];
var clusters = [];

// PUZZLES
var puzzles = [
    // 0-10
    "6003907404044709030003000700000004550000064037642865550000000582",
    "1200072807000300460030008700770005839300046000550440091206600134",
    "6601200008070191906000011540020805006891045643009954075008000005",
    "0000000000337019007730005808264007006055073040003375509070055092",
    "2727805051332053000009973100411079406730006000001903780700000203",
    "7300700100003027600000194064004003730024070000462856827301440091",
    "9530005368910057028960000300400907000371000028054003900560071631",
    "6608200008000082002419030081000701037640094236090060846600084045",
    "5820002054646005000000867373009000911900820009000914012800060037",
    "2170835507040902030658006400502073195880010078237900016130071119",
    // 10-20
    "2897060000137773353078731020290933370465008046900045701203913008",
    "4938642061748062308241007002960306505120911459236022036940261551",
    "3897942892831600146891378202055000238200001480015005661629455593",
    "6230880028772828208054260320004605420490060006756428293391739076",
    "8240080037240200394430869990673406137090370554601000500145645090",
    "5024746859844852967867009542460020600010404855309164931160409078",
    "3505383475087928100007853690580508109105021943660210292928707381",
    "2764637718488573029200001609146050191340391283405643006444298006",
    "2502796185080363001066404690206237640658493806406479808019002093",
    "2590000030020591000805376415049808651072064170007601682630099091",
    // 20-30
    "5500027082030111046700200831030320450280025375009737816122462449",
    "3047164048807019067050010655550906089910980350584570319978007913",
    "4636354900000091028900699217604318608611773900821006011400008105",
    "8219193040022817600806095190040023790060929064407586464277046864",
    "3704206704620700893200000000374210033268303453002461005501937073",
    "8432846952200001058640009988147010655619643732701577840086030382",
    "2929070428917763069040000655660039048000241260074695388600100227",
    "7392453006408750000236007844183450102903302114007829080123500272",
    "2082808205270000030283193764647991040006460006445676802957097946",
    "6635000680200644088601900404370002937000081286300003044100001684",
    // 30-40
    "1046162090012698917479015403500291356807150152031440190728691091",
    "4700075090871099222207401500039019506470564080000738302849747082",
    "9941918111600921086540889298512042020000505032738938500729154630",
    "0419091069000192280910281000205328191543044275955504374573060028",
    "3010092589900905056002000549680282745991779907607410042405004246",
    "3358782227091003500468410602006440280400004201052598314319195662",
    "2810054690003655139259009716000000441928259000000228098210728047",
    "6408828012148208063070481000100092818059073000971970384900307919",
    "3906127308009147009008408211026982090001045021908330904520320811",
    "1084020098800864625570821300300030944405490560456175466728300067",
    // 40-50
    "0373012400900120471361076091058303709837077282306404003200697848",
    "8700942896516910041000526406400238948201002429000030418400794928",
    "9100103791086451760418689403626980647401970776093780044100200688",
    "2680008224282040061074608630090066628902400986587309272807314451",
    "0636705512807069007203250974015501030400300750371607750591946435",
    "8245051000930320000047706030282804726004589640181300007060046000",
    "6980008016910850003706734803730036270500405307800690002195459107",
    "2176407998074931153751403090006070800400310295000488892500005038",
    "1902193891700084373649881419630750011003055900411900002632500755",
    "8064061098995596050935580910088206427105606481694036350000740410",
    // 50-60
    "6151378222492037050440378700008284819550007938000033966600088077",
    "6909074850038542028350025510282844894200742078101992879008300157",
    "4604600027279146291403006406075055061450460405834602355100708648",
    "6980008016910850003706734803730036270500405307800690002195459107",
    "2176407998074931153751403090006070800400310295000488892500005038",
    "1902193891700084373649881419630750011003055900411900002632500755",
    "8064061098995596050935580910088206427105606481694036350000740410",
    "6151378222492037050440378700008284819550007938000033966600088077",
    "6909074850038542028350025510282844894200742078101992879008300157",
    "4604600027279146291403006406075055061450460405834602355100708648",
    // 60-70
    "5147061045581490702536411028004527331446074796000764275560004391",
    "4000080560642275891869300750302935148190750528460082314057808548",
    "3361000495496406702800933409483755021157822800618200000600280004",
    "8460820032730393097703200428121263180537452000107324509600225004",
    "1201472980096394720675067194690080176725556073307560730030000433",
    "5280000453700006370790737764178505709500093465391503519404305086",
    "7600006152573047606830020438110000086937028273073918455880923891",
    "7400280061640295080008600490006409209400460749002199970509966375",
    "1094373045070070800650302951852039200900134001198807509353007342",
    "8003703202975088094066540819190084004064198000004440640273016353",
    // 70-80
    "7093055000012808000855624152559100055851991602218203824020002973",
    "5030550057201916019911932866400700207303649100890064235964644019",
    "3520210975713850800645502199308006007935022736750461037400090006",
    "6590946128007199370060680704800830060044047073080497860750379105",
    "1032001509508259019001350437013796930080180040700870630000146105",
    "1055857009101170419080006210266516000300246003008618961604926694",
    "6700000010910007449219039908603733569094350200409802009082460464",
    "3806099192040173990039810808550962078119446376460020200155088009",
    "1005083709853300119026966850888940846532008070649120120001907337",
    "8807359611237479463020000772240053059697529082130610730002000541",
    // 80-90
    "5201461003099040103059079023572502720199441629030360058291000898",
    "8540270092208300000190819100286281914530202710460165067509414372",
    "2600754030008315955089160000910308200046827000828910211324908951",
    "0500582086998773910197502000865300019527463526306575981904583789",
    "4830003673558998082521220000000073730028197419007556383797007002",
    "2250595163515009297910238120820002173000054092843760042019000001",
    "5210466075201983294446309000905320000257623799813700570207391125",
    "5350040043622619009904600551380000648808403020513378791200030198",
    "4960110052242200718663542017390600900544287967600212508600486546",
    "7306407007365912003704600019740066912742418804408342988909138641",
    // 90-100
    "7213705810979170055366980037730182580070189055309099091337110197",
    "3700370225911988310501100905303900731620280917624006535863600078",
    "5503765505077055057328860664539469054042408700416420563700457709",
    "6502210718024953785073509374300518033085623774804037000500730014",
    "3210107032919391000591212886006024288260717309573300810300005782",
    "3702019478088042150020463245000070020070386940369978000910020032",
    "8085000939254631002000731930080773301020207417550635600988007701",
    "9820336930282741376707351982050040249000795910002000389685500914",
    "6306408274602037550750000242281025528218540056409911510037090900",
    "7820242758008719800882826000200097362000027478127360000008680037",
    // 100-103
    "7991104610083820670391807389000706462063041026803370064275910288",
    "8082190026467070138809330629210700015040860243976345020385087828",
    "2000559026005673829290772872410600064836289263260010001982000019"
];


//------------------------CLASSES-----------------------------------------------
class Cell {
    constructor(grid, x, y, value) {
        this.grid = grid;
        this.x = x;
        this.y = y;
        this.value = value;
    }
    getCoord() {
        return [this.x, this.y];
    }
}

class Syndrome extends Cell {
    getAdjacentCells() {
        var cells;
        cells = [];
        // get up
        if (this.x > 0) {
            cells.push([this.x - 1, this.y]);
        }
        // get down
        if (this.x < this.grid.size - 1) {
            cells.push([this.x + 1, this.y]);
        }
        // get left
        if (this.y > 0) {
            cells.push([this.x, this.y - 1]);
        }
        // get right
        if (this.y < this.grid.size - 1) {
            cells.push([this.x, this.y + 1]);
        }
        return cells;
    }
}

class Link extends Cell {

}

class Middle extends Cell {

}

class Grid {
    constructor(size) {
        this.size = size;
        this.grid = [];
        var x, y, row, rowData;
        $("#grid tbody").empty();
        for (x = 0; x < this.size * 2 - 1; x += 1) {
            this.grid[x] = [];
            row = $("<tr></tr>");
            for (y = 0; y < this.size * 2 - 1; y += 1) {
                this.grid[x][y] = new Cell(x, y, 0, 0);
                rowData = $("<td></td>");
                row.append(rowData);
            }
            $("#grid tbody").append(row);
        }
    }
    display() {
        var x, y, cell;
        for (x = 0; x < this.size * 2 - 1; x += 1) {
            for (y = 0; y < this.size * 2 - 1; y += 1) {
                if (x % 2 === 0 && y % 2 === 0) {
                    cell = $("#grid tbody")[0].rows[x].cells[y];
                    $(cell).addClass("syndrome");
                    if (anyons[secs][x/2][y/2] !== 0) {
                        $(cell).html(anyons[secs][x/2][y/2]);
                        $(cell).addClass("group" + clusters[x/2][y/2]);
                    }
                } else if (x % 2 === 0 && y % 2 === 1) {
                    cell = $("#grid tbody")[0].rows[x].cells[y];
                    $(cell).addClass("link");
                    $(cell).html("|");
                } else if (x % 2 === 1 && y % 2 === 0) {
                    cell = $("#grid tbody")[0].rows[x].cells[y];
                    $(cell).addClass("link");
                    $(cell).html("-");
                } else {
                    cell = $("#grid tbody")[0].rows[x].cells[y];
                    $(cell).addClass("mid");
                }
            }
        }
    }
}


//------------------------GAME LOGIC--------------------------------------------
// RESET CLUSTER GRID AND ANYONS
function resetAnyons() {
    "use strict";
    var x, y;
    anyons[0] = [];
    for (x = 0; x < gridSize; x += 1) {
        anyons[0][x] = [];
        clusters[x] = [];
        computeGrid[x] = [];
        for (y = 0; y < gridSize; y += 1) {
            anyons[0][x][y] = 0;
            clusters[x][y] = 0;
            computeGrid[x][y] = 0;
        }
    }
}


// LOAD ANYONS
function loadAnyons(anyonsString) {
    "use strict";
    var x, y, total;
    total = 0;
    for (x = 0; x < gridSize; x += 1) {
        for (y = 0; y < gridSize; y += 1) {
            anyons[secs][y][x] = parseInt(anyonsString[y * gridSize + x], 10);
            total += parseInt(anyons[secs][y][x], 10);
        }
    }
    if (total % d !== 0) {
        alert("Inconsistent problem error");
    }
}


// SAVE ANYONS
function saveAnyons() {
    "use strict";
    var x, y, anyonsString;
    anyonsString = "";
    for (x = 0; x < gridSize; x += 1) {
        for (y = 0; y < gridSize; y += 1) {
            anyonsString += anyons[secs][y][x];
        }
    }
    console.log(anyonsString);
    return anyonsString;
}


// LIST ALL CLUSTERS
function listClustersIds() {
    "use strict";
    var x, y, clusterIds;
    clusterIds = [];
    for (x = 0; x < gridSize; x += 1) {
        for (y = 0; y < gridSize; y += 1) {
            if (clusters[x][y] !== undefined) {
                clusterIds.push(clusters[x][y]);
            }
        }
    }
    clusterIds = _.uniq(clusterIds);
    return clusterIds;
}


// NEXT FREE CLUSTER ID
function nextFreeClusterId() {
    "use strict";
    var i, clusterIds;
    clusterIds = listClustersIds();
    if (clusterIds.length === 0) {
        clusterIds.push(0);
    }
    i = 0;
    while (_.contains(clusterIds, i) === true) {
        i += 1;
    }
    return i;
}


// GENERATE NOISE
function generateError() {
    "use strict";
    var x1, y1, x2, y2, r, a, aa, num, clusterOld, x, y, clusterNum;
    // Pick a random square
    x1 = Math.floor(Math.random() * gridSize);
    y1 = Math.floor(Math.random() * gridSize);
    r = 2 * (Math.floor(Math.random() * 100) % 2) - 1;
    a = Math.floor(Math.random() * (d - 1)) + 1;
    aa = d - a;
    num = 0;

    // Random neighbour
    if (Math.random() < 0.5) {
        if (x1 === 0 || x1 === gridSize - 1) {
            x2 = x1 + (x1 === 0) - (x1 === (gridSize - 1));
        } else {
            x2 = x1 + r;
        }
        y2 = y1;
    } else {
        x2 = x1;
        if (y1 === 0 || y1 === gridSize - 1) {
            y2 = y1 + (y1 === 0) - (y1 === (gridSize - 1));
        } else {
            y2 = y1 + r;
        }
    }

    // Add new error to new cluster
    if (anyons[secs][x1][y1] === 0 && anyons[secs][x2][y2] === 0) {
        anyons[secs][x1][y1] = a;
        anyons[secs][x2][y2] = aa;
        clusterNum = nextFreeClusterId();
        clusters[x1][y1] = clusterNum;
        clusters[x2][y2] = clusterNum;
        num += 1;

        // Add new error to existing cluster
    } else if (anyons[secs][x1][y1] === 0 && anyons[secs][x2][y2] > 0) {
        anyons[secs][x1][y1] = (a + anyons[secs][x1][y1]) % d;
        anyons[secs][x2][y2] = (aa + anyons[secs][x2][y2]) % d;
        clusters[x1][y1] = clusters[x2][y2];
        if (anyons[secs][x2][y2] === 0) {
            clusters[x2][y2] = 0;
        }
        num += 1;

    } else if (anyons[secs][x1][y1] > 0 && anyons[secs][x2][y2] === 0) {
        anyons[secs][x1][y1] = (a + anyons[secs][x1][y1]) % d;
        anyons[secs][x2][y2] = (aa + anyons[secs][x2][y2]) % d;
        clusters[x2][y2] = clusters[x1][y1];
        if (anyons[secs][x1][y1] === 0) {
            clusters[x1][y1] = 0;
        }
        num += 1;

        // Merge with existing cluster or merge clusters
    } else if (anyons[secs][x1][y1] > 0 && anyons[secs][x2][y2] > 0) {
        clusterOld = clusters[x2][y2];
        for (y = 0; y < gridSize; y += 1) {
            for (x = 0; x < gridSize; x += 1) {
                if (clusters[x][y] === clusterOld) {
                    clusters[x][y] = clusters[x1][y1];
                }
            }
        }
        anyons[secs][x1][y1] = (a + anyons[secs][x1][y1]) % d;
        anyons[secs][x2][y2] = (aa + anyons[secs][x2][y2]) % d;
        if (anyons[secs][x1][y1] === 0) {
            clusters[x1][y1] = 0;
        }
        if (anyons[secs][x2][y2] === 0) {
            clusters[x2][y2] = 0;
        }
        // these are counted less towards num
        num += 0.1;
    }
    return [x1, y1, x2, y2, num];
}


// GENERATE NOISE
function generateNoise() {
    "use strict";
    var num, errorList, error;
    num = 0;
    errorList = [];
    while (num < 6) {
        error = generateError();
        errorList.push(error[0], error[1], error[2], error[3]);
        num += error[4];
    }
    return errorList;
}


// CHECK SPANNERS
function checkSpanners() {
    "use strict";
    var spanners, x, y;
    spanners = 0;
    for (x = 0; x < gridSize; x += 1) {
        for (y = 0; y < gridSize; y += 1) {
            spanners += (clusters[x][0] === clusters[y][gridSize - 1]) * clusters[x][0];
            spanners += (clusters[0][x] === clusters[gridSize - 1][y]) * clusters[0][x];
        }
    }
    if (spanners > 0) {
        return true;
    }
}


// COUNT ANYONS
function countAnyons() {
    "use strict";
    var count, x, y;
    count = 0;
    for (x = 0; x < gridSize; x += 1) {
        for (y = 0; y < gridSize; y += 1) {
            if (anyons[secs][x][y] !== 0) {
                count += 1;
            }
        }
    }
    return count;
}


// COUNT MOVES
function countMoves() {
    "use strict";
    var x, y;
    secs += 1;
    // generate new secs array
    anyons[secs] = [];
    // save previous secs array
    for (x = 0; x < gridSize; x += 1) {
        anyons[secs][x] = [];
        for (y = 0; y < gridSize; y += 1) {
            anyons[secs][x][y] = anyons[secs - 1][x][y];
        }
    }
    $("#secs").html(secs);
    return secs;
}


// MOVES
function move(coord1, coord2) {
    "use strict";
    var oldCluster, x, y, newVal, x1, y1, x2, y2;
    x1 = coord1[0];
    y1 = coord1[1];
    x2 = coord2[0];
    y2 = coord2[1];

    // move validity check
    if ((x1 + 1 === x2 && y1 === y2) || (x1 - 1 === x2 && y1 === y2) || (x1 === x2 && y1 + 1 === y2) || (x1 === x2 && y1 - 1 === y2)) {
        countMoves();

        // cluster and anyons update
        if ((anyons[secs][x2][y2] > 0) && (clusters[x2][y2] !== clusters[x1][y1]) && clusters[x1][y1] !== 0) {
            oldCluster = clusters[x1][y1];
            for (x = 0; x < gridSize; x += 1) {
                for (y = 0; y < gridSize; y += 1) {
                    if (clusters[x][y] === oldCluster) {
                        clusters[x][y] = clusters[x2][y2];
                    }
                }
            }
        }
        // add it to the destination
        newVal = (anyons[secs][x1][y1] + anyons[secs][x2][y2]) % d;
        anyons[secs][x2][y2] = newVal;
        // carry the cluster with it, except for the case of annihilation
        if (anyons[secs][x2][y2] === 0) {
            clusters[x2][y2] = 0;
        } else {
            clusters[x2][y2] = clusters[x1][y1];
        }
        // remove it from the initial position
        anyons[secs][x1][y1] = 0;
        clusters[x1][y1] = 0;
    }

    // check game status
    gameCheck();
}


// GAME CHECK LOGIC
function gameCheck() {
    "use strict";
    // puzzle logic
    if (gametype === "puzzle") {
        if (countAnyons() === 0) {
            alert("Congrats! Your score on puzzle " + $("#puzzles").val() + " is :" + secs);
        }
    // game logic
    } else if (gametype === "game") {
        // game over
        if (checkSpanners() === true) {
            alert("GAME OVER!");
        } else {
            // stuck
            if (countAnyons() === 0) {
                while ((secs % errorRate) > 0) {
                    countMoves();
                }
            }
            // generate noise
            if (secs % errorRate === 0) {
                generateNoise();
            }
        }
    }
}


// NEW GAME
function newGame() {
    "use strict";
    secs = 0;
    resetAnyons();
    generateNoise();
    if (checkSpanners()) {
        newGame();
    }
}


//------------------------DIAMOND GRID------------------------------------------
// INIT DIAMOND GRID
function initGrid() {
    "use strict";
    var x, y, row, rowData;
    // create DOM
    for (y = 0; y < gridSize * 2 - 1; y += 1) {
        row = $("<tr></tr>");
        for (x = 0; x < gridSize * 2 - 1; x += 1) {
            rowData = $("<td></td>");
            row.append(rowData);
        }
        $("#grid tbody").append(row);
    }
}


// RESET DIAMOND GRID
function resetGrid() {
    "use strict";
    var x, y, cell, $cell;
    // create DOM
    for (y = 0; y < gridSize * 2 - 1; y += 1) {
        for (x = 0; x < gridSize * 2 - 1; x += 1) {
            cell = $("#grid tbody")[0].rows[x].cells[y];
            $cell = $(cell);
            $cell.removeClass();
            $cell.html("");
        }
    }
}


// DISPLAY GRID
function displayGrid() {
    "use strict";
    var x, y, cell;
    for (x = 0; x < gridSize * 2 - 1; x += 1) {
        for (y = 0; y < gridSize * 2 - 1; y += 1) {
            if (x % 2 === 0 && y % 2 === 0) {
                cell = $("#grid tbody")[0].rows[x].cells[y];
                $(cell).addClass("syndrome");
                if (anyons[secs][x/2][y/2] !== 0) {
                    $(cell).html(anyons[secs][x/2][y/2]);
                    $(cell).addClass("group" + clusters[x/2][y/2]);
                }
            } else if (x % 2 === 0 && y % 2 === 1) {
                cell = $("#grid tbody")[0].rows[x].cells[y];
                $(cell).addClass("link");
                $(cell).html("|");
            } else if (x % 2 === 1 && y % 2 === 0) {
                cell = $("#grid tbody")[0].rows[x].cells[y];
                $(cell).addClass("link");
                $(cell).html("-");
            } else {
                cell = $("#grid tbody")[0].rows[x].cells[y];
                $(cell).addClass("mid");
                //$(cell).html("+");
            }
        }
    }
}


// CELL TYPE
function cellType(coord) {
    "use strict";
    var x, y;
    x = coord[0];
    y = coord[1];
    if ((x % 2) === 0 && (y % 2) === 0) {
        return "syndrome";
    } else if (x % 2 === 0 && y % 2 === 1 || x % 2 === 1 && y % 2 === 0) {
        return "link";
    } else {
        return "mid";
    }
}


// GET LINK STATUS
function checkLink(coord1, coord2) {
    "use strict";
    var x, y, x1, y1, x2, y2,  cell;
    x1 = coord1[0] * 2;
    y1 = coord1[1] * 2;
    x2 = coord2[0] * 2;
    y2 = coord2[1] * 2;
    if (x1 === x2) {
        x = x1;
        y = _.min([y1, y2]) + 1;
    } else {
        x = _.min([x1, x2]) + 1;
        y = y1;
    }
    cell = $("#grid tbody")[0].rows[x].cells[y];
    return $(cell).hasClass("linked");
}


// GET ADJACENT LINKS
function adjacentLinks(coord) {
    "use strict";
    var links, x, y;
    x = coord[0];
    y = coord[1];
    links = [];
    // get up
    if (x > 0 && checkLink([x, y], [x - 1, y]) === true) {
        links.push([x - 1, y]);
    }
    // get down
    if (x < gridSize - 1 && checkLink([x, y], [x + 1, y]) === true) {
        links.push([x + 1, y]);
    }
    // get left
    if (y > 0 && checkLink([x, y], [x, y - 1]) === true) {
        links.push([x, y - 1]);
    }
    // get right
    if (y < gridSize - 1 && checkLink([x, y], [x, y + 1]) === true) {
        links.push([x, y + 1]);
    }
    return links;
}


// LINKED CLUSTER
function linkedCluster(coord1, coord2) {
    "use strict";
    var cluster, queue, current, cells, i, x1, y1, x2, y2;
    cluster = [];
    cells = [];
    x1 = coord1[0];
    y1 = coord1[1];
    x2 = coord2[0];
    y2 = coord2[1];
    queue = [[x1, y1], [x2, y2]];
    // until queue is empty
    while (queue.length > 0) {
        // get last item in queue
        current = queue.pop();
        // save it in painted cluster
        cluster.push(current);
        // get adjacent cells
        cells = adjacentLinks(current);
        for (i = 0; i < cells.length; i += 1) {
            if (containsCoords(cells[i], queue) === false && containsCoords(cells[i], cluster) === false) {
                queue.push(cells[i]);
            }
        }
    }
    return cluster;
}


// CLUSTER SUM
function clusterSum(cluster) {
    var total, i;
    total = 0;
    for (i = 0; i < cluster.length; i += 1) {
        total += anyons[secs][cluster[i][0]][cluster[i][1]];
    }
    return total % d;
}

// DISPLAY LINK
function toggleLink(coord) {
    "use strict";
    var x, y, cell, $cell, cell1, cell2, clusterNum, total, i, cluster;
    x = coord[0];
    y = coord[1];
    // get cells
    if (x % 2 === 0){
        cell1 = [x / 2, (y - 1) / 2];
        cell2 = [x / 2, (y + 1) / 2];
    } else {
        cell1 = [(x - 1) / 2, y / 2];
        cell2 = [(x + 1) / 2, y / 2];
    }
    // link and create or update the cluster
    clusterNum = nextFreeClusterId();
    cluster = linkedCluster(cell1, cell2);
    total = clusterSum(cluster);
    console.log("CLUSTER" + JSON.stringify(cluster) + " - TOTAL: " + total);
    // display linked cluster
    for (i = 0; i < cluster.length; i += 1) {
        cell = $("#grid tbody")[0].rows[cluster[i][0]*2].cells[cluster[i][1]*2];
        clusters[cluster[i][0]][cluster[i][1]] = clusterNum;
        $cell = $(cell);
        $cell.removeClass();
        if (total !== 0) {
            $cell.html(total);
        } else {
            $cell.html("");
        }
        $cell.toggleClass("group" + clusterNum);
    }
    // toggle linked cell
    cell = $("#grid tbody")[0].rows[x].cells[y];
    $cell = $(cell);
    $cell.html("+");
    $cell.toggleClass("linked");
}


// FIND COORD FROM POSITION
function getCoordFromIndex(id) {
    "use strict";
    var row, col, cell, $cell;
    //vertical and horizontal (starting at index 0 [0,1] ending at index 55 [14, 13] )
    if (id < 56) {
        row = Math.floor(id / 7);
        col = id - row * 7;
        row = row * 2;
        col = col * 2 + 1;
    } else {
        row = Math.floor((id - 56) / 8);
        col = (id - 56) - row * 8;
        row = row * 2 + 1;
        col = col * 2;
    }
    return [row, col];
}

// PROCESS LINK STRING
function processLinks(links) {
    "use strict";
    var i, coord;
    for (i = 0; i < links.length; i += 1) {
        coord = getCoordFromIndex(i);
        if (links[i] === "1") {
            toggleLink(coord);
        }
    }
}


//------------------------HELPERS-----------------------------------------------
//LIST ALL CELLS
function listCells() {
    "use strict";
    var x, y, cells;
    cells = [];
    for (x = 0; x < gridSize; x += 1) {
        for (y = 0; y < gridSize; y += 1) {
            if (anyons[secs][x][y] !== 0) {
                cells.push([x, y]);
            }
        }
    }
    return cells;
}


// GET ADJACENT CELLS
function adjacentCells(coord) {
    "use strict";
    var cells, fullCells, i, x, y;
    x = coord[0];
    y = coord[1];
    cells = [];
    fullCells = [];
    // get up
    if (x > 0) {
        cells.push([x - 1, y]);
    }
    // get down
    if (x < gridSize - 1) {
        cells.push([x + 1, y]);
    }
    // get left
    if (y > 0) {
        cells.push([x, y - 1]);
    }
    // get right
    if (y < gridSize - 1) {
        cells.push([x, y + 1]);
    }
    for (i = 0; i < cells.length; i += 1) {
        if (anyons[secs][cells[i][0]][cells[i][1]] !== 0) {
            fullCells.push(cells[i]);
        }
    }
    return fullCells;
}


// CONTAINS COORD
function containsCoords(coord, array) {
    "use strict";
    var i, x, y;
    x = coord[0];
    y = coord[1];
    for (i = 0; i < array.length; i += 1) {
        if (array[i][0] === x && array[i][1] === y) {
            return true;
        }
    }
    return false;
}


// GET ADJACENT CLUSTER
function adjacentCluster(coord) {
    "use strict";
    var cluster, queue, current, cells, i, x, y;
    cluster = [];
    cells = [];
    x = coord[0];
    y = coord[1];
    if (anyons[secs][x][y] !== 0) {
        queue = [
            [x, y]
        ];
        // until queue is empty
        while (queue.length > 0) {
            // get last item in queue
            current = queue.pop();
            // save it in painted cluster
            cluster.push(current);
            // get adjacent cells
            cells = adjacentCells(current);
            for (i = 0; i < cells.length; i += 1) {
                if (containsCoords(cells[i], queue) === false && containsCoords(cells[i], cluster) === false) {
                    queue.push(cells[i]);
                }
            }
        }
    }
    return cluster;
}


// CLUSTER VALIDITY REMAINS
function clusterRemain(cluster) {
    "use strict";
    var i, total;
    total = 0;
    for (i = 0; i < cluster.length; i += 1) {
        total += anyons[secs][cluster[i][0]][cluster[i][1]];
    }
    return total % d;
}


// DISTANCE BETWEEN CELLS
function distance(cell1, cell2) {
    "use strict";
    return Math.abs(cell1[0] - cell2[0]) + Math.abs(cell1[1] - cell2[1]);
}


// DISTANCE FROM CLUSTER
function shortestDistance(clust1, clust2) {
    "use strict";
    var i, j, min, dist, closestCells;
    closestCells = [];
    min = gridSize * 2;
    for (i = 0; i < clust1.length; i += 1) {
        for (j = 0; j < clust2.length; j += 1) {
            dist = distance(clust1[i], clust2[j]);
            if (dist <= min) {
                min = dist;
                closestCells.push([clust1[i], clust2[j]]);
            }
        }
    }
    return closestCells;
}


//------------------------CONTROLS----------------------------------------------
// CLUSTER THREAT LEVEL
function threatLevel(cluster) {
    "use strict";
    var threatX, threatY;
    cluster.sort(function(a, b) {
        return a[0] - b[0];
    });
    threatX = cluster[cluster.length - 1][0] - cluster[0][0];
    cluster.sort(function(a, b) {
        return a[1] - b[1];
    });
    threatY = cluster[cluster.length - 1][1] - cluster[0][1];
    return threatX + threatY;
}


// DISPLAY CLUSTERS
function displayClusters() {
    "use strict";
    var x, row, clusterList;
    clusterList = findContiguousClusters();
    $("#clusters tbody").empty();
    for (x = 0; x < clusterList.length; x += 1) {
        row = "";
        row += "<tr>";
        row += "<td>" + (x + 1) + "</td>";
        row += "<td>" + clusterList[x].length + "</td>";
        row += "<td>" + clusterRemain(clusterList[x]) + "</td>";
        row += "<td>" + adjacentScore(clusterList[x]) + "</td>";
        row += "<td>" + threatLevel(clusterList[x]) + "</td>";
        row += "<td>" + clusterList[x].toString() + "</td>";
        row += "</tr>";
        $("#clusters tbody").append(row);
    }
}


//------------------------AI----------------------------------------------------
// SEGMENT CLUSTER
// doesn't take in account diagonal cluster before starting the move
// if cluster neighbour cancel each other remove them from the cluster
// reduce search space to avoid expensive computation
// remove cells that are sure
// when there is a two neighbour cell try to add remaining clusters to see where its headed

// DIFFERENCE BETWEEN CLUSTERS
function differenceCluster(clust1, clust2) {
    "use strict";
    var i, j, cell1, cell2;
    for (i = clust1.length - 1; i >= 0; i -= 1) {
        cell1 = clust1[i];
        for (j = 0; j < clust2.length; j += 1) {
            cell2 = clust2[j];
            if (cell1[0] === cell2[0] && cell1[1] === cell2[1]) {
                clust1.splice(i, 1);
            }
        }
    }
    return clust1;
}


// ADJACENT MATCH
function adjacentMatch(cell) {
    "use strict";
    var cells, matches, value1, value2;
    matches = [];
    cells = adjacentCells(cell);
    for (var i = 0; i < cells.length; i += 1) {
        value1 = anyons[secs][cell[0]][cell[1]];
        value2 = anyons[secs][cells[i][0]][cells[i][1]];
        if ((value1 + value2) % d === 0) {
            matches.push(cells[i]);
        }
    }
    return matches;
}


// CLUSTER ADJACENCY SCORE
function adjacentScore(cluster) {
    "use strict";
    var i, score;
    score = 0;
    for (i = 0; i < cluster.length; i += 1) {
        score += adjacentCells(cluster[i]).length;
    }
    return score;
}


// CLUSTER VALID MATCHES (DIVIDE AND CONQUER)
// when a cluster is split into many valid clusters by a collapse
// rank cluster cells by number of adjacent cells
function validMatches(cluster) {
    "use strict";
    var validCollapse, matches, testGrid, x, y, x1, y1, x2, y2;
    validCollapse = [];

    // copy anyons grid
    for (x = 0; x < gridSize; x += 1) {
        testGrid[x] = [];
        for (y = 0; y < gridSize; y += 1) {
            testGrid[x][y] = anyons[secs][x][y];
        }
    }
    // find valid matches
    for (var i = 0; i < cluster.length; i += 1) {
        matches = adjacentMatch(cluster[i]);
        for (var j = 0; j < matches.length; j += 1) {
            x1 = cluster[i][0];
            y1 = cluster[i][1];
            x2 = matches[j][0];
            y2 = matches[j][1];
            testGrid[x1][y1] = 0;
            testGrid[x2][y2] = 0;
            // Watch remains of new clusters and check validity
        }
    }
    return validCollapse;
}


// FIND ALL CLUSTERS
// find and assign contiguous clusters
function findContiguousClusters() {
    "use strict";
    var queue, cluster, clusterList, cell, i, j;
    clusterList = [];
    queue = listCells();
    while (queue.length !== 0) {
        cell = queue.pop();
        cluster = adjacentCluster(cell);
        clusterList.push(cluster);
        queue = differenceCluster(queue, cluster);
    }
    // assign cluster id to clusters
    for (i = 0; i < clusterList.length; i += 1) {
        cluster = clusterList[i];
        for (j = 0; j < cluster.length; j += 1) {
            cell = cluster[j];
            clusters[cell[0]][cell[1]] = i;
        }
    }
    return clusterList;
}


// INVALID CLUSTERS
// combine invalid clusters to get valid total % d
// check distance between invalid clusters
function invalidClusters() {
    "use strict";
    var i, j, invalidClusters, val1, val2, clusterMatches, clusterList;
    invalidClusters = [];
    clusterMatches = [];
    clusterList = findContiguousClusters();
    for (i = 0; i < clusterList.length; i += 1) {
        if (clusterRemain(clusterList[i]) !== 0) {
            invalidClusters.push(clusterList[i]);
        }
    }
    // match invalid clusters with closest matching cluster
    for (i = 0; i < invalidClusters.length; i += 1) {
        for (j = 0; j < invalidClusters.length; j += 1) {
            val1 = clusterRemain(invalidClusters[i]);
            val2 = clusterRemain(invalidClusters[j]);
            if ((val1 + val2) % d === 0 && i !== j) {
                clusterMatches.push(invalidClusters[i], invalidClusters[j]);
            }
        }
    }
    return clusterMatches;
}


// SEGMENT CLUSTER
// find cells with one adjacent cell that are similar to leafs in a graph
function segmentCluster(cluster) {
    "use strict";
    var x1, y1, x2, y2, i, cells, suggestedMoves, edgeCells, centerCell;
    edgeCells = [];
    suggestedMoves = [];
    for (i = 0; i < cluster.length; i += 1) {
        x1 = cluster[i][0];
        y1 = cluster[i][1];
        cells = adjacentCells(cluster[i]);

        // 2 cell cluster or leaf node detected
        if (cells.length === 1) {
            x2 = cells[0][0];
            y2 = cells[0][1];
            if ((anyons[secs][x1][y1] + anyons[secs][x2][y2]) % d === 0) {
                suggestedMoves.push([x1, y1], [x2, y2]);
                move(cluster[i], cells[0]);
            }
        }
    }

    // isolated 3 cell valid cluster
    if (cluster.length === 3 && clusterRemain(cluster) === 0) {
        for (i = 0; i < cluster.length; i += 1) {
            if (adjacentCells(cluster[i]).length === 2) {
                centerCell = cluster[i];
            } else {
                edgeCells.push(cluster[i]);
            }
        }
        move(edgeCells[0], centerCell);
        move(edgeCells[1], centerCell);
    }
    return suggestedMoves;
}


//------------------------MAIN--------------------------------------------------
$(document).ready(function() {
    "use strict";
    var x, y, puzzleNum, i, cell1, cell2, cell3, cell4, cell, $cell, total, randomPuzzle;
    initGrid();
    resetAnyons();
    randomPuzzle = Math.floor(Math.random() * puzzles.length);
    loadAnyons(puzzles[randomPuzzle]);
    displayClusters();
    resetGrid();
    displayGrid();

    // Populate puzzle select
    for (i = 0; i < puzzles.length; i += 1) {
        $("#puzzles").append("<option value='" + i + "'>" + (i + 1) + "</option>");
    }

    // Diamond grid hover
    $("#grid tbody td").hover(function() {
        y = parseInt($(this).index(), 10);
        x = parseInt($(this).parent().index(), 10);
        $("#coord").html("[" + x + ", " + y + "]");
        cellType([x,y]);
    });

    // Diamond grid click
    $("#grid tbody td").click(function() {
        y = parseInt($(this).index(), 10);
        x = parseInt($(this).parent().index(), 10);

        // vertical  or horizontal link
        if (cellType([x, y]) === "link") {
            toggleLink([x, y]);

        // mid cell cluster
        } else if (cellType([x, y]) === "mid") {
            cell1 = [x + 1, y + 1];
            cell2 = [x + 1, y - 1];
            cell3 = [x - 1, y + 1];
            cell4 = [x - 1, y - 1];
            total = anyons[secs][cell1[0]/2][cell1[1]/2]
                  + anyons[secs][cell2[0]/2][cell2[1]/2]
                  + anyons[secs][cell3[0]/2][cell3[1]/2]
                  + anyons[secs][cell4[0]/2][cell4[1]/2];
            cell = $("#grid tbody")[0].rows[x].cells[y];
            $cell = $(cell);
            $cell.html(total % d);
        }
    });

    // Controls
    $("#load").click(function() {
        puzzleNum = $("#puzzles").val();
        gametype = "puzzle";
        secs = 0;
        resetAnyons();
        resetGrid();
        loadAnyons(puzzles[puzzleNum]);
        findContiguousClusters();
        displayGrid();
    });
    $("#save").click(function() {
        saveAnyons();
    });
    $("#prev").click(function() {
        if (secs > 0) {
            secs -= 1;
            $("#secs").html(secs);
        }
    });
    $("#error").click(function() {
        generateError();
        displayGrid();
    });
    $("#newgame").click(function() {
        gametype = "game";
        newGame();
    });
    $("input[name='gametype']").change(function() {
        gametype = $(this).val();
    });
});
