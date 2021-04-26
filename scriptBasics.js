var algoselected = false;
const modalalgo = document.getElementById('algobtntext')
const modelMaze = document.getElementById('mazebtntext')
const modalspeed = document.getElementById('speedbtntext')
const modalclear = document.getElementById('btnclearswalls')
const dropDownAlgo = document.getElementsByClassName('algodropdownContent')[0];
const dropDownspeed = document.getElementsByClassName('speeddropdownContent')[0];
const dropDownmaze = document.getElementsByClassName('mazaDropDowncontent')[0];
const dropDownsclear = document.getElementById('clear');
const gridTable = document.getElementById('gridTable');
const bv = document.getElementById('boxVisited');
var textP = document.getElementById('textP');
var pn = document.getElementById('pn');
var textV = document.getElementById('textV');
var algoName = document.getElementById('algoName');
var algoDesc = document.getElementById('algoDesc');
var td = document.getElementsByTagName('td')
var pv = document.getElementById('pathVisited')
var ListOfNodes = [];
var nodes = [];
var visiteds = [];
var vis = [];
var path = [];
var viz = false;
var start;
var end;
var count = 0;
var WIDTH = 74;
var HEIGHT = 30;
var speed = 5;
var mouseclicked = false;
var startDrag = false;
var endDrag = false;
var rightpressed = false;
var previousStart;
var previousEnd;
let curr;
var pps = 'unv'
var ppe = 'unv'
var visualizing = false;

class QElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    enqueue(element, priority) {
        var qElement = new QElement(element, priority);
        this.items.unshift(qElement);
    }
    dequeue() {
        if (this.isEmpty())
            return "Underflow";
        this.sort();
        return this.items.shift();
    }
    isEmpty() {
        if (this.items.length <= 0)
            return true;
        return false;
    }

    // A function to implement bubble sort 
    sort() {
        var i, j;
        for (i = 0; i < this.items.length - 1; i++)
            for (j = 0; j < this.items.length - i - 1; j++)
                if (this.items[j].priority > this.items[j + 1].priority) {
                    let temp = this.items[j];
                    this.items[j] = this.items[j + 1];
                    this.items[j + 1] = temp;
                }

    }
    // printPQueue()
}
window.onload = () => {
    make_Grid();

    previousStart = document.getElementsByClassName('start')[0];
    previousEnd = document.getElementsByClassName('end')[0];

    for (i = 0; i < HEIGHT; i += 1) {
        let id = i + "-" + 0;
        let a = document.getElementById(id); a.style.borderLeft = '1px solid rgb(175, 216, 248)'
    }
    for (i = 0; i < WIDTH; i += 1) {
        let id = HEIGHT - 1 + "-" + i;
        let a = document.getElementById(id);
        a.style.borderBottom = '1px solid rgb(175, 216, 248)'
    }
    modalalgo.style.pointerEvents = "none";
    modelMaze.style.pointerEvents = 'none';
    modalclear.style.pointerEvents = 'none';
    modalspeed.style.pointerEevent = 'none';
    gridTable.style.pointerEvents = 'none';
}
//right = 2 left 0 (mouse keys)
gridTable.onmousedown = (event) => {
    if (event.button == 2) {
        rightpressed = true;
    }
    if (!mouseclicked && !(event.target.className.includes("start") || event.target.className.includes("end")))
        mouseclicked = true;
    else {
        mouseclicked = false;
        if (event.target.className == 'start')
            startDrag = true;
        else
            endDrag = true;
    }
}
// disable all the slections
gridTable.onmouseup = () => {
    if (rightpressed)
        rightpressed = false;
    if (mouseclicked)
        mouseclicked = false;
    else if (startDrag || endDrag)
        startDrag = false;
    endDrag = false;
}
gridTable.onmousemove = (event) => {
    event.stopPropagation();

    if (rightpressed && event.target.className == "wall") {
        event.preventDefault();
        event.target.classList.remove("wall");
        event.target.classList.add("unv");
    }
    if (!rightpressed && mouseclicked &&
        !(event.target.tagName == "TBODY" || event.target.tagName == "TABLE" ||
            event.target.tagName == "TR" || event.target.className == "start" || event.target.className == "end")) {
        let p = event.target;
        p.classList.remove("unv");
        p.classList.add("wall");
    } else if (!(event.target.tagName == "TABLE")) {
        //if start node is selected
        if (startDrag) {
            curr = event.target
            currClassName = curr.className;
            previousStart.classList.remove("start")
            previousStart.classList.add(pps) //pps is prevous start class
            curr.classList.remove("unv");
            if (event.target.className == "end") {
                curr.classList.remove("end");
                curr.classList.add("start");
                previousEnd.classList.remove("end");
                previousEnd.classList.add("unv");
                previousEnd = previousStart;
                previousEnd.classList.remove("unv");
                previousEnd.classList.remove("start");
                previousEnd.classList.add("end");
                previousStart = event.target;
                return;
            }
            if (event.target.className == 'wall') {
                pps = "wall"
                curr.classList.remove("wall")
            } else {
                pps = "unv"
            }
            curr.classList.add("start");
            previousStart = event.target;

        }
        // if end node is selected
        else if (endDrag) {
            let curr = event.target
            previousEnd.classList.remove("end")
            previousEnd.classList.add(ppe)//ppe previous end class
            curr.classList.remove("unv");
            if (event.target.className == "start") {
                curr.classList.remove("start");
                curr.classList.add("end");
                previousStart.classList.remove("start");
                previousStart.classList.add("unv");
                previousStart = previousEnd;
                previousStart.classList.remove("unv");
                previousStart.classList.remove("end");
                previousStart.classList.add("start");
                previousEnd = event.target;
                return
            } if (event.target.className == "wall") {
                ppe = "wall"
                curr.classList.remove("wall");
            } else {
                ppe = "unv"
            }
            curr.classList.add("end")
            previousEnd = event.target;
        }
    }
    pN = event.target;

}
function clearAll() {
    if (!viz) {
        gridTable.style.pointerEvents = 'all';
        startDrag = false;
        endDrag = false;
        visualizing = false;
        ListOfNodes.forEach(element => {
            if (element.visited && element.id != start) {
                document.getElementById(end).classList.remove('shortestPath');
                document.getElementById(element.id).classList.remove('visited');
                document.getElementById(element.id).classList.remove('shortestPath');
                document.getElementById(element.id).classList.add('unv');
            } else if (element.wall && element.id != start) {
                document.getElementById(element.id).classList.remove('wall');
                document.getElementById(element.id).classList.add('unv');
            } else {
                document.getElementById(start).classList.remove('shortestPath');
                document.getElementById(element.id).classList.remove('visited');
            }
        });

        ListOfNodes.length = 0;
        visiteds.length = 0;
        vis.length = 0;
        path.length = 0;
    }
}
function clearPath() {
    if (ListOfNodes.length > 0 && !viz) {
        gridTable.style.pointerEvents = 'all'
        visualizing = false;
        ListOfNodes.forEach(element => {
            if (element.visited && element.id != start) {
                document.getElementById(end).classList.remove('shortestPath');
                document.getElementById(element.id).classList.remove('visited');
                document.getElementById(element.id).classList.remove('shortestPath');
                document.getElementById(element.id).classList.add('unv');
            } else {
                document.getElementById(start).classList.remove('shortestPath');
            }
        });
        vis.length = 0;
        path.length = 0;
    }
}
function make_Grid() {
    let cR = "";
    var nodeNo = 0;
    for (var i = 0; i < HEIGHT; i++) {
        cR += "<tr id='row-" + i + "'>";
        for (var k = 0; k < WIDTH; k++) {
            if (nodeNo == 655) {
                cR += "<td id='" + i + "-" + k + "' draggable='false' onclick='createWall(event)' class='start'></td>";
            } else if (nodeNo == 678) {
                cR += "<td id='" + i + "-" + k + "' draggable='false' onclick='createWall(event)' class='end' style=''></td>";
            }
            else {
                cR += "<td id='" + i + "-" + k + "' draggable='false' onclick='createWall(event)' class='unv'></td>";
            }
            nodeNo++;
        }
        cR += "</tr>"
    }
    gridTable.innerHTML = cR;
}
function createWall(event) {
    event.stopPropagation();
    cn = event.target;
    if (!cn.id.includes("row") && !(cn.className.includes("start") || cn.className.includes("end"))) {
        cn.classList.remove("unv");
        cn.classList.add("wall");
        nodes.push(cn.id);
    }
}
function changeAlgo(element) {
    modalalgo.textContent = element.textContent;
    algoName.textContent = element.textContent;
    algoselected = true;
    dropDownAlgo.style.display = 'none';
}
function changeMaze(element) {
    modelMaze.textContent = element.textContent;
    dropDownmaze.style.display = 'none';
}
function changeSpeed(element) {
    modalspeed.textContent = element.textContent;
    dropDownspeed.style.display = 'none';
    if (element.textContent.includes('Fast'))
        speed = 5;
    if (element.textContent.includes('slow'))
        speed = 550;
    if (element.textContent.includes('Average'))
        speed = 75;
}
function DropDown(event) {
    if (event.target == modalalgo && dropDownAlgo.style.display == 'flex') {
        dropDownAlgo.style.display = 'none';
        
    } else if (event.target == modalalgo && dropDownAlgo.style.display != 'flex') {
        dropDownAlgo.style.display = 'flex';
        dropDownspeed.style.display = 'none';
        dropDownmaze.style.display = 'none';
    }
    if (event.target == modalspeed && dropDownspeed.style.display == 'block') {
        dropDownspeed.style.display = 'none';
    } else if (event.target == modalspeed && dropDownspeed.style.display != 'block') {
        dropDownspeed.style.display = 'block';
        dropDownAlgo.style.display = 'none';
        dropDownmaze.style.display = 'none';
    }
    if (event.target == modelMaze && dropDownmaze.style.display == 'block') {
        dropDownmaze.style.display = 'none';
    } else if (event.target == modelMaze && dropDownmaze.style.display != 'block') {
        dropDownmaze.style.display = 'block';
        dropDownAlgo.style.display = 'none';
        dropDownspeed.style.display = 'none';
    }
}
function closePopUp(element){
    modalalgo.style.pointerEvents = "all";
    modelMaze.style.pointerEvents = 'all';
    modalclear.style.pointerEvents = 'all';
    gridTable.style.pointerEvents = 'all';
    element.parentNode.remove()
}


document.getElementById('btnVis').onmouseenter = (event) => {
    if (visualizing) {
        event.target.classList.add('visualizing');
        event.target.classList.remove('btn-visualize');
        event.target.style.backgroundColor = 'red'
        event.target.style.transition = 'all 0.3s';
    }
}
document.getElementById('btnVis').onmouseleave = (event) => {
    event.target.classList.remove('visualizing');
    event.target.classList.add('btn-visualize');
    event.target.style.backgroundColor = 'rgb(28, 187, 139)'
}
document.getElementById('btnVis').onmousedown = () => {
    (!visualizing) ? document.getElementById('btnVis').style.backgroundColor = "rgb(30, 223, 165)" : undefined;
}
document.getElementById('btnVis').onmouseup = () => {
    (!visualizing) ? document.getElementById('btnVis').style.backgroundColor = "rgb(28, 187, 139)" : undefined;
}
function visualize() {
    if (algoselected && !visualizing) {
        document.getElementsByClassName('box')[0].style.display = 'flex';
        pn.style.display = 'none';
        pv.style.display = 'none';
        textP.style.display = 'none';
        visualizing = true;
        viz = true;
        gridTable.style.pointerEvents = 'none';
        algoVis(algoName.textContent);
        toAnimate(vis, 0, path);
        algoDesc.textContent = algoName.textContent + " is visualizing "
        algoDesc.style.color = "green";
    } 
    else if (!algoselected && !visualizing) {
        algoDesc.textContent = "select algorithm to visualize"
        algoDesc.style.color = "red";
    }
}
function algoVis(algo) {
    vis.length = 0;
    path.length = 0;
    if (algo.includes('Dijkstra')) {
        var node = dijkstra();
        vis = node[0];
        path = node[1];
    } if (algo.includes('Breadth first search')) {
        var node = bredthFirstSearch();
        vis = node[0];
        path = node[1];
    } if (algo.includes('Best first search')) {
        var node = bestFirstSearch();
        vis = node[0];
        path = node[1];
    } if (algo.includes('A *')) {
        var node = AStar();
        vis = node[0];
        path = node[1];
    }
}
// node start
function getAllNodes(list) {
    let nodes = []
    for (let i = 0; i < list.length; i++) nodes.push(new _Node(list[i]))
    return nodes;
}
//get node by id;'s
function getNodeById(id) {
    for (var i in ListOfNodes) {
        if (ListOfNodes[i].id == id)
            return ListOfNodes[i]
    }
}
//update the distance
function updateDistance(node, distance) {
    node.distance = distance;
    return node;
}
//object node
function _Node(node) {
    this.node = node;
    this.id = node.id;
    this.visited = false;
    this.distance = Infinity;
    this.wall = node.className == "wall" ? true : false;
    this.row = node.id.split('-')[0];
    this.col = node.id.split('-')[1];
    this.parent = null;
}
//get neighbours according to start's positon 
function getNeighboursForUnweighted(node) {
    neighbours = [];
    let row = parseInt(node.row);
    let col = parseInt(node.col);
    let n1 = getNodeById(`${row + 1}-${col}`);
    let n2 = getNodeById(`${row - 1}-${col}`);
    let n3 = getNodeById(`${row}-${col - 1}`);
    let n4 = getNodeById(`${row}-${col + 1}`);
    neighbours.push(n1);
    neighbours.push(n2);
    neighbours.push(n3);
    neighbours.push(n4);
    return neighbours.filter((element) => {
        return element != undefined && !element.wall && !element.visited;
    });
}
function getNeighboursForGreedy(node) {
    neighbours = [];
    let row = parseInt(node.row);
    let col = parseInt(node.col);

    let n1 = getNodeById(`${row + 1}-${col}`);
    let n2 = getNodeById(`${row - 1}-${col}`);
    let n3 = getNodeById(`${row}-${col - 1}`);
    let n4 = getNodeById(`${row}-${col + 1}`);


    neighbours.push(n1);
    neighbours.push(n2);
    neighbours.push(n3);
    neighbours.push(n4);


    return neighbours.filter((element) => {
        return element != undefined && !element.wall && !element.visited;
    });
}
// end node
//faster then others
function findMinDistanceInGraph(graph) {
    let len = graph.length;
    let min = Infinity;
    while ((len--) != 0) {
        if (graph[len].distance < min)
            min = graph[len].distance;
    }
    return graph.find(element => element.distance == min);
}
//algorithms
function dijkstra() {
    prev = [];
    visited = [];

    start = document.getElementsByClassName("start")[0].id;
    end = document.getElementsByClassName("end")[0].id;

    let Unvnodes = document.getElementsByTagName('td');

    ListOfNodes = getAllNodes(Unvnodes);
    temp = ListOfNodes;
    updateDistance(getNodeById(start), 0)
    var finished = null;

    while (temp.length != 0) {
        //get min distance node
        let current = findMinDistanceInGraph(temp);
        if (current.id == getNodeById(end).id) {
            //finished becomes the last visited node
            finished = current;
            break
        }
        // no path
        if (current.distance == Infinity) break;

        visited.push(current);

        //deleting the min distance node from graph
        temp = temp.filter(ele => ele != current);

        current.visited = true;

        let neighbours = getNeighboursForUnweighted(current);

        for (var i in neighbours) {
            let distance = current.distance + 1;
            if (distance < neighbours[i].distance) {
                updateDistance(neighbours[i], distance);
                neighbours[i].parent = current;
            }
        }
    }
    //back track from finished to start
    while (finished != null) {
        prev.unshift(finished);
        finished = finished.parent;
    }
    return [visited, (prev.length > 0) ? prev : null];
}
function bredthFirstSearch() {
    let vis = [];
    let path = [];

    start = document.getElementsByClassName("start")[0].id;
    end = document.getElementsByClassName("end")[0].id;

    let Unvnodes = document.getElementsByTagName('td');

    ListOfNodes = getAllNodes(Unvnodes);

    let visited = [];

    let finished = null;
    visited.unshift(getNodeById(start));

    while (visited.length != 0) {
        let currentNode = visited.pop();
        currentNode.visited = true;

        if (currentNode.id == end) {
            finished = currentNode;
            break;
        }
        vis.push(currentNode);
        let neighbours = getNeighboursForUnweighted(currentNode);

        for (var i in neighbours) {
            neighbours[i].visited = true;
            neighbours[i].parent = currentNode; //backtracing
            visited.unshift(neighbours[i]);
        }
    }
    while (finished != null) {
        path.unshift(finished);
        finished = finished.parent
    }
    return [vis, path]
}
//best first greedy
function bestFirstSearch() {

    let vis = [];
    let path = [];

    start = document.getElementsByClassName("start")[0].id;
    end = document.getElementsByClassName("end")[0].id;
    let Unvnodes = document.getElementsByTagName('td');

    ListOfNodes = getAllNodes(Unvnodes);

    pq = new PriorityQueue();

    Snode = getNodeById(start)
    pq.enqueue(Snode, Snode.distance);

    endNode = getNodeById(end);

    while (!pq.isEmpty()) {
        let u = pq.dequeue();

        vis.push(u.element);

        u.element.visited = true;

        let neighbours = getNeighboursForGreedy(u.element);

        if (u.element.id == end) {
            finished = u.element;
            break;
        }
        for (var i in neighbours) {
            neighbours[i].visited = true;
            let distance = calculateSignleLineDistance(endNode, neighbours[i]);
            neighbours[i].distance = distance;
            neighbours[i].parent = u.element;
            pq.enqueue(neighbours[i], neighbours[i].distance);
        }
    }
    while (finished != null) {
        path.unshift(finished);
        finished = finished.parent;
    }
    return [vis, path]
}
function AStar() {
    let vis = [];
    let path = [];

    start = document.getElementsByClassName("start")[0].id;
    end = document.getElementsByClassName("end")[0].id;
    let Unvnodes = document.getElementsByTagName('td');

    ListOfNodes = getAllNodes(Unvnodes);

    sNode = getNodeById(start);
    sNode.distance = 0;
    enode = getNodeById(end);
    pq = new PriorityQueue();
    pq.enqueue(sNode, 0)
    var finished = null;
    while (!pq.isEmpty()) {
        let u = pq.dequeue();
        u.element.visited = true;
        vis.push(u.element);
        // goal found
        if (u.element.id == end) {
            finished = u.element;
            break;
        }
        let neighbours = getNeighboursForGreedy(u.element);

        for (var i in neighbours) {
            let weight = u.element.distance + 1; //G(n)
            let gN = weight;
            neighbours[i].distance = weight;
            let distance = calculateSignleLineDistance(enode, neighbours[i]) + gN; // H(n) + G(n)
            neighbours[i].parent = u.element;
            neighbours[i].visited = true;
            pq.enqueue(neighbours[i], distance);
        }
    }
    while (finished != null) {
        path.unshift(finished);
        finished = finished.parent;
    }
    return [vis, path];

}
// manhattan distance
function calculateSignleLineDistance(Node1, Node2) {
    var dis = 0;
    let x1 = parseInt(Node1.row)
    let y1 = parseInt(Node1.col);
    let x2 = parseInt(Node2.row);
    let y2 = parseInt(Node2.col);

    dis = Math.abs(x2 - x1) + Math.abs(y2 - y1);

    return dis;
}
// end
//Random Maza
var listM = []
function randomMaze() {
    if (listM.length > 0) {
        clearMaze(listM, 0);
        listM.length = 0
    }
    const listNodes = document.getElementsByClassName('unv');
    let len = listNodes.length - 1;

    for (var i = 0; i < len / 4; i++) {
        listM.push(listNodes[(Math.floor(Math.random() * len))].id)
    }
    Animation(listM, 0)
}
//animate visited nodes
function Animation(list, i) {
    if (i == list.length)
        return;
    document.getElementById(list[i]).classList.remove("unv");
    document.getElementById(list[i]).classList.add("wall");
    Animation(list, i + 1);
}

function clearMaze(listM, i) {
    if (i == listM.length)
        return;
    document.getElementById(listM[i]).classList.remove("wall");
    document.getElementById(listM[i]).classList.add("unv");
    clearMaze(listM, i + 1);
}

function toAnimate(vis, i, prev) {
    document.getElementById(vis[i].id).classList.add("current");
    setTimeout(() => {
        if (i == vis.length - 1) {
            document.getElementById(vis[i].id).classList.remove('unv');
            document.getElementById(vis[i].id).classList.remove('current');
            document.getElementById(vis[i].id).classList.add('visited');
            visiteds.push(vis[i].id);
            textV.innerText = count;
            //animate the shortest path
            pn.style.display = 'block';
            pv.style.display = 'block';
            textP.style.display = 'block';
            count = 0
            toAnimateP(prev, 0)
            return;
        }
        document.getElementById(vis[i].id).classList.remove('unv');
        document.getElementById(vis[i].id).classList.remove('current');
        document.getElementById(vis[i].id).classList.add('visited');
        textV.innerText = count;
        count++;
        visiteds.push(vis[i].id);
        toAnimate(vis, i + 1, prev);
    }, speed);
}
//animate path
function toAnimateP(prev, i) {
    if (prev == null) {
        return;
    }
    setTimeout(() => {
        if (i == prev.length) {
            viz = false;
            count = 0;
            return;
        }
        document.getElementById(prev[i].id).classList.remove("visited");
        document.getElementById(prev[i].id).classList.add("shortestPath");
        textP.innerText = count;
        count++;
        toAnimateP(prev, i + 1);
    }, 30);
}