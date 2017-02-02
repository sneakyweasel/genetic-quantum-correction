/* global $, document, _, Genetic*/
//------------------------------------------------------------------------------
// QUANTUM ERROR CORRECTION CODE
//------------------------------------------------------------------------------
// INPUT: A 8*8 grid of values or game over
// OUTPUT: A list of 10 numbers describing grid movements

// Genetic algorithm
// - Reset state
// - Load anyons puzzle
// - Load link state
// - Calculate fitness
// - Display result

// THUNDER
// TODO: Build tension between corners that sparks when the path of least resistance is found
// TODO: Use parity to check pairing susceptibility along with % 10

// GENETIC ALGORITHM
// TODO: Implement locking of certain link
// TODO: Implement localised radius mutations and crossover

// Game mechanics
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
// Check https://en.wikipedia.org/wiki/Depth-first_search

// GLOBAL VARIABLES
var gridSize = 8;
var d = 10;
var secs = 0;

// INITIALIZE CLUSTERS & ANYONS ARRAY
var anyons = [];
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


//------------------------GENETIC-----------------------------------------------
var genetic = Genetic.create();

genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Tournament3;
genetic.select2 = Genetic.Select2.Random;

genetic.gridSize = 8;
genetic.d = 10;
genetic.anyons = [];
genetic.clusters = [];
genetic.clusterList = [];


// FIND COORD FROM POSITION
genetic.getCoordFromIndex = function(id) {
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
};


// INIT ANYONS
genetic.resetAnyons = function() {
    "use strict";
    var x, y;
    this.clusterList = [];
    for (x = 0; x < this.gridSize * 2 - 1; x += 1) {
        this.anyons[x] = [];
        this.clusters[x] = [];
        for (y = 0; y < this.gridSize * 2 - 1; y += 1) {
            this.anyons[x][y] = 0;
            this.clusters[x][y] = 0;
        }
    }
};


// INIT DIAMOND GRID
genetic.initGrid = function() {
    "use strict";
    var x, y, row, rowData;
    for (y = 0; y < this.gridSize * 2 - 1; y += 1) {
        row = $("<tr></tr>");
        for (x = 0; x < this.gridSize * 2 - 1; x += 1) {
            rowData = $("<td></td>");
            row.append(rowData);
        }
        $("#grid tbody").append(row);
    }
};


// LOAD ANYONS
genetic.loadAnyons = function(anyonsString) {
    "use strict";
    var x, y, total;
    this.resetAnyons();
    total = 0;
    for (x = 0; x < this.gridSize; x += 1) {
        for (y = 0; y < this.gridSize; y += 1) {
            this.anyons[y*2][x*2] = parseInt(anyonsString[y * this.gridSize + x], 10);
            total += parseInt(this.anyons[y*2][x*2], 10);
        }
    }
    if (total % this.d !== 0) {
        alert("Inconsistent problem error");
    }
};


// LOAD ANYONS
genetic.saveAnyons = function() {
    "use strict";
    var x, y, str;
    str = "";
    for (x = 0; x < this.gridSize * 2 - 1; x += 1) {
        str += this.anyons[x].join("") + "\n";
    }
    str = str.replace(/0/g, " ");
    console.log(str);
    return str;
};


// PROCESS LINK STRING
genetic.loadLinks = function(links) {
    "use strict";
    var i, coord;
    for (i = 0; i < links.length; i += 1) {
        coord = this.getCoordFromIndex(i);
        if (links[i] === "1") {
            this.anyons[coord[0]][coord[1]] = "+";
        }
    }
};


// PROCESS LINK STRING
genetic.countLinks = function(links) {
    "use strict";
    var i, coord, score;
    score = 0;
    for (i = 0; i < links.length; i += 1) {
        if (links[i] === "1") {
            score += 1;
        }
    }
    return score;
};


// RESET DIAMOND GRID
genetic.clearGrid = function() {
    "use strict";
    var x, y, cell, $cell;
    // create DOM
    for (y = 0; y < this.gridSize * 2 - 1; y += 1) {
        for (x = 0; x < this.gridSize * 2 - 1; x += 1) {
            cell = $("#grid tbody")[0].rows[x].cells[y];
            $cell = $(cell);
            $cell.removeClass();
            $cell.html("");
        }
    }
};


// DISPLAY GRID
genetic.displayGrid = function() {
    "use strict";
    var x, y, cell, $cell, type, score, i, j, sum;
    score = 0;
    for (x = 0; x < this.gridSize * 2 - 1; x += 1) {
        for (y = 0; y < this.gridSize * 2 - 1; y += 1) {
            type = this.cellType([x, y]);
            cell = $("#grid tbody")[0].rows[x].cells[y];
            $cell =  $(cell);
            $cell.removeClass();
            if (this.anyons[x][y] === 0) {
                $cell.html("");
            } else if (type === "syndrome") {
                $cell.addClass("group" + this.clusters[x][y]);
                $cell.html(this.anyons[x][y]);
            } else if (type === "link" && this.anyons[x][y] === "+") {
                score += 1;
                $cell.html(this.anyons[x][y]);
            }
        }
    }
    for (i = 0; i < this.clusterList.length; i += 1) {
        sum = this.clusterRemain(this.clusterList[i]);
        for (j = 0; j < this.clusterList[i].length; j += 1) {
            x = this.clusterList[i][j][0];
            y = this.clusterList[i][j][1];
            cell = $("#grid tbody")[0].rows[x].cells[y];
            $cell =  $(cell);
            if (sum === 0) {
                $cell.addClass("solved");
            }
        }
    }
    $("#secs").html(score);
    $("#clusters").html(this.clusterList.length);
};


// LIST ALL CLUSTERS
genetic.listClustersIds = function() {
    "use strict";
    var x, y, clusterIds;
    clusterIds = [];
    for (x = 0; x < this.gridSize; x += 1) {
        for (y = 0; y < this.gridSize; y += 1) {
            if (this.clusters[x*2][y*2] !== 0) {
                clusterIds.push(this.clusters[x][y]);
            }
        }
    }
    clusterIds = clusterIds.filter((v, i, a) => a.indexOf(v) === i);
    return clusterIds;
};


// NEXT FREE CLUSTER ID
genetic.nextFreeClusterId = function() {
    "use strict";
    var i, clusterIds;
    clusterIds = this.listClustersIds();
    if (clusterIds.length === 0) {
        clusterIds.push(0);
    }
    i = 0;
    while (clusterIds.includes(i) === true) {
        i += 1;
    }
    return i;
};


//LIST ALL CELLS
genetic.listCells = function() {
    "use strict";
    var x, y, cells;
    cells = [];
    for (x = 0; x < this.gridSize * 2 - 1; x += 2) {
        for (y = 0; y < this.gridSize * 2 - 1; y += 2) {
            if (this.anyons[x][y] !== 0) {
                cells.push([x, y]);
            }
        }
    }
    return cells;
};


// GET ADJACENT CELLS
genetic.adjacentCells = function(coord) {
    "use strict";
    var cells, x, y;
    x = coord[0];
    y = coord[1];
    cells = [];
    // get up
    if (x > 0 && this.anyons[x - 1][y] === "+") {
        cells.push([x - 2, y]);
    }
    // get down
    if (x < 14 && this.anyons[x + 1][y] === "+") {
        cells.push([x + 2, y]);
    }
    // get left
    if (y > 0 && this.anyons[x][y - 1] === "+") {
        cells.push([x, y - 2]);
    }
    // get right
    if (y < 14 && this.anyons[x][y + 1] === "+") {
        cells.push([x, y + 2]);
    }
    return cells;
};


// CONTAINS COORD
genetic.containsCoords = function(coord, array) {
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
};


// CLUSTER VALIDITY REMAINS INCLUDING ? NUMBERS
genetic.clusterRemain = function(cluster) {
    "use strict";
    var i, total, top, bottom, question;
    total = 0;
    for (i = 0; i < cluster.length; i += 1) {
        if (cluster[i][0] === 0 && cluster[i][1] === 0) {
            top = true;
        } else if (cluster[i][0] === 14 && cluster[i][1] === 14) {
            bottom = true;
        } else {
            total += this.anyons[cluster[i][0]][cluster[i][1]];
        }
    }
    if (top === true) {
        this.anyons[0][0] = (10 - total % this.d) % this.d;
        return 0;
    } else if (bottom === true) {
        this.anyons[14][14] = (10 - total % this.d) % this.d;
        return 0;
    }
    return total % this.d;
};


// DIFFERENCE BETWEEN CLUSTERS
genetic.differenceCluster = function(clust1, clust2) {
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
};


// GET ADJACENT CLUSTER
genetic.adjacentCluster = function(coord) {
    "use strict";
    var cluster, queue, current, cells, i, x, y;
    cluster = [];
    cells = [];
    x = coord[0];
    y = coord[1];
    queue = [[x, y]];
    // until queue is empty
    while (queue.length > 0) {
        // get last item in queue
        current = queue.pop();
        // save it in painted cluster
        cluster.push(current);
        // get adjacent cells
        cells = this.adjacentCells(current);
        for (i = 0; i < cells.length; i += 1) {
            if (this.containsCoords(cells[i], queue) === false && this.containsCoords(cells[i], cluster) === false) {
                queue.push(cells[i]);
            }
        }
    }
    return cluster;
};


// FIND ALL CLUSTERS
genetic.processGrid = function() {
    "use strict";
    var queue, cluster, clusterList, cell, i, j, sum;
    clusterList = [];
    queue = this.listCells();
    while (queue.length !== 0) {
        cell = queue.pop();
        cluster = this.adjacentCluster(cell);
        clusterList.push(cluster);
        queue = this.differenceCluster(queue, cluster);
    }
    // assign cluster id to clusters
    for (i = 0; i < clusterList.length; i += 1) {
        cluster = clusterList[i];
        sum = genetic.clusterRemain(cluster);
        for (j = 0; j < cluster.length; j += 1) {
            cell = cluster[j];
            this.clusters[cell[0]][cell[1]] = i;
        }
    }
    this.clusterList = clusterList;
};


// HIGHLIGHT CELLS
genetic.lightCells = function(cells, clusterId) {
    "use strict";
    var i, x, y, cell;
    for (i = 0; i < cells.length; i += 1) {
        x = cells[i][0];
        y = cells[i][1];
        cell = $("#grid tbody")[0].rows[x].cells[y];
        $(cell).addClass("group" + clusterId);
    }
};


// HIGHLIGHT CELLS
genetic.cellType = function(coord) {
    "use strict";
    var x, y;
    x = coord[0];
    y = coord[1];
    if (x % 2 === 0 && y % 2 === 0) {
        return "syndrome";
    } else if (x % 2 === 0 && y % 2 === 1 || x % 2 === 1 && y % 2 === 0) {
        return "link";
    } else {
        return "mid";
    }
};


// TOGGLE LINK
genetic.toggleLink = function(coord) {
    "use strict";
    var type, x1, y1, x2, y2;
    type = this.cellType(coord);
    // find cells coords from link coords
    if (type === "link" && coord[0] % 2 === 0) {
        x1 = coord[0] - 1;
        y1 = coord[1];
        x2 = coord[0] + 1;
        y2 = coord[1];
    } else if (type === "link" && coord[0] % 2 === 1) {
        x1 = coord[0];
        y1 = coord[1] - 1;
        x2 = coord[0];
        y2 = coord[1] + 1;
    }
    // check link status
    if (this.anyons[coord[0]][coord[1]] === "+" ) {
        this.anyons[coord[0]][coord[1]] = 0;
    } else {
        this.anyons[coord[0]][coord[1]] = "+";
    }
    this.processGrid();
    this.displayGrid();
};


// SCORE GRID
genetic.scoreGrid = function() {
    "use strict";
    var x, y, score;
    score = 0;
    for (x = 0; x < this.gridSize; x += 1) {
        for (y = 0; y < this.gridSize; y += 1) {
            if (this.anyons[x*2][y*2] === 0) {
                score += 1;
            }
        }
    }
    return score;
};


// CREATE SEEDS
genetic.seed = function() {
    function randomString(len) {
        var text = "";
        var charset = "01";
        for (var i = 0; i < len; i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        return text;
    }
    // create random strings that are equal in length to solution
    return randomString(112);
};


// MUTATIONS
genetic.mutate = function(entity) {
    function replaceAt(str, index, character) {
        return str.substr(0, index) + character + str.substr(index + character.length);
    }
    // chromosomal drift
    var charset = "01";
    var i = Math.floor(Math.random() * entity.length);
    return replaceAt(entity, i, charset.charAt(Math.floor(Math.random() * charset.length)));
};


// CROSSOVER
genetic.crossover = function(mother, father) {
    // two-point crossover
    var len = mother.length;
    var ca = Math.floor(Math.random() * len);
    var cb = Math.floor(Math.random() * len);
    if (ca > cb) {
        var tmp = cb;
        cb = ca;
        ca = tmp;
    }
    var son = father.substr(0, ca) + mother.substr(ca, cb - ca) + father.substr(cb);
    var daughter = mother.substr(0, ca) + father.substr(ca, cb - ca) + mother.substr(cb);
    return [son, daughter];
};

// genetic.crossover = function(mother, father) {
//     // two-point crossover
//     var len = mother.length;
//     var ca = Math.floor(Math.random() * len);
//     var cb = Math.floor(Math.random() * len);
//     if (ca > cb) {
//         var tmp = cb;
//         cb = ca;
//         ca = tmp;
//     }
//     var son = father.substr(0, ca) + mother.substr(ca, cb - ca) + father.substr(cb);
//     var daughter = mother.substr(0, ca) + father.substr(ca, cb - ca) + mother.substr(cb);
//     return [son, daughter];
// };


// FITNESS
genetic.fitness = function(entity) {
    var links, fitness, length, sum, complete;
    fitness = 0;
    this.loadAnyons(this.userData["puzzle"]);
    this.loadLinks(entity);
    this.processGrid();

    // Process cluster list
    complete = true;
    for (var i = 0; i < this.clusterList.length; i++) {
        length = this.clusterList[i].length;
        sum = this.clusterRemain(this.clusterList[i]);
        // punish singleton
        if (length === 1) {
            fitness -= 10;
        // punish wrong pairs
        } else if (length === 2 && sum !== 0) {
            fitness -= 10;
        }
        // punish wrong sum
        if (sum !== 0) {
            fitness -= length;
            complete = false;
        // reward good sum
        } else {
            fitness += 3;
        }
    }

    if (complete === true) {
        fitness += 64;
    }

    // Negative rating
    fitness -= this.countLinks(entity) * 4;

    return fitness;
};


// OUTPUT PROGRESS NOTIFICATIONS
genetic.notification = function(pop, generation, stats, isFinished) {

    function lerp(a, b, p) {
        return a + (b - a) * p;
    }

    var value = pop[0].entity;
    this.last = this.last || value;

    if (pop != 0 && value == this.last)
        return;

    // Reset world
    this.loadAnyons(this.userData["puzzle"]);
    this.loadLinks(value);

    // Process links
    this.processGrid();
    this.displayGrid();

    // Prepend row
    $("#puzzleNum").html($("#puzzles").val());
    var buf = "";
    buf += "<tr>";
    buf += "<td>" + generation + "</td>";
    buf += "<td>" + pop[0].fitness.toPrecision(5) + "</td>";
    buf += "<td>" + this.countLinks(value) + "</td>";
    buf += "<td>" + this.clusterList.length; "</td>";
    buf += "<td class='solution'>" + value + "</td>";
    buf += "<td>" + "</td>";
    buf += "</tr>";
    $("#results tbody").prepend(buf);

    // KEEP LAST VALUE
    this.last = value;
};


//------------------------MAIN--------------------------------------------------
$(document).ready(function() {
    "use strict";
    var x, y, puzzleNum, i, cell1, cell2, cell3, cell4, cell, $cell, total, randomPuzzle;
    randomPuzzle = Math.floor(Math.random() * puzzles.length);
    genetic.initGrid();
    genetic.loadAnyons(puzzles[randomPuzzle]);
    genetic.loadLinks(genetic.seed());
    genetic.processGrid();
    genetic.displayGrid();

    // Populate puzzle select
    for (i = 0; i < puzzles.length; i += 1) {
        $("#puzzles").append("<option value='" + i + "'>" + i + "</option>");
    }
    $("#puzzles").val(randomPuzzle);

    // Diamond grid hover
    $("#grid tbody td").hover(function() {
        y = parseInt($(this).index(), 10);
        x = parseInt($(this).parent().index(), 10);
        $("#coord").html("[" + x + ", " + y + "]");
        $("#cellType").html(genetic.cellType([x, y]));
    });

    // Diamond grid click
    $("#grid tbody td").click(function() {
        y = parseInt($(this).index(), 10);
        x = parseInt($(this).parent().index(), 10);

        // Find cell type
        if (genetic.cellType([x, y]) === "link") {
            genetic.toggleLink([x, y]);
        } else if (genetic.cellType([x, y]) === "mid") {
            console.log("mid");
        } else {
            console.log("syndrome");
        }
    });

    // Controls
    $("#load").click(function() {
        puzzleNum = $("#puzzles").val();
        genetic.loadAnyons(puzzles[puzzleNum]);
        genetic.displayGrid();
    });
    $("#solve").click(function() {
        $("#results tbody").html("");
        var puzzleNum = $("#puzzles").val();
        var config = {
            "iterations": 2000,
            "size": 1500,
            "crossover": 0.9,
            "mutation": 0.2,
            "fittestAlwaysSurvives": true,
            "skip": 0
        };
        var userData = {
            "gridSize": 8,
            "puzzle": puzzles[puzzleNum]
        };
        genetic.evolve(config, userData);
    });
    $("#save").click(function() {
        genetic.saveAnyons();
    });

    // Results
    $(document).on("click", "#results tr", function(e) {
        puzzleNum = $("#puzzles").val();
        var col = parseInt($(this).index(), 10);
        var row = parseInt($(this).parent().index(), 10);
        var cell = $(this)[0].cells[4];
        var solution = $(cell).html();
        genetic.resetAnyons();
        genetic.loadAnyons(puzzles[puzzleNum]);
        genetic.loadLinks(solution);
        genetic.processGrid();
        genetic.displayGrid();
    });
});
