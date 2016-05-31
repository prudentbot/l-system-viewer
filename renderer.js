angular.module('l-system-app', [])
  .controller('loaderController', function(){
    var loader = this;

    loaded = presets["dragon-curve"];
    symbols = loaded.axiom;
    grammar = createGrammar(loaded.grammar);

    loader.changeLoaded = function(){
      loaded = presets[this.picker]
      symbols = loaded.axiom;
      grammar = createGrammar(loaded.grammar);
    }
  });


var translateColor = function(color){
  if (color == "a")
    return "black";
  if (color == "b")
    return "#802b00"
  if (color == "c")
    return "#00b300"
  if (color == "d")
    return "#008000"
}

//takes an array of production rules
var createGrammar = function(a){
  var result = {};
  for(var i = 0; i < a.length; ++i){
    result[a[i][0]] = a[i].substring(2);
  }
  return result;
}

var applyRules = function(str, grammar){
  var result = "";
  for(var i = 0; i < str.length; ++i){
    if(grammar[str[i]]){
      result = result + grammar[str[i]];
    }
    else if(str[i] == "("){
      var rightIndex = str.indexOf(")", i);
      var num = Number(str.substring(i+1, rightIndex));
      result = result + "(" + (num + 1) + ")";
      i = rightIndex;
    }
    else{
      result = result + str[i];
    }
  }
  return result;
}

//http://www.cs.unm.edu/~joel/PaperFoldingFractal/L-system-rules.html
var d = 10; //step size
var b = .25; //angle increment, 1 would be 2pi

var Turtle = class {
  constructor (linegroup){
    //x, y, angle, color
    this.state = new State(300, 300, .5, "a");
    this.stack = [];
    this.top = 0;
    this.linegroup = linegroup;
  }

  changeStateAndDraw (symbol) {
    if(symbol == "f" || symbol == "h"){
      var newState = new State(
        this.state.x + (loaded.stepSize * Math.sin(2 * Math.PI * this.state.a)),
        this.state.y + (loaded.stepSize * Math.cos(2 * Math.PI * this.state.a)),
        this.state.a,
        this.state.c
      )
      this.linegroup.append("line")
        .attr("x1", this.state.x)
        .attr("y1", this.state.y)
        .attr("x2", newState.x)
        .attr("y2", newState.y)
        .attr("stroke", translateColor(this.state.c))
        .attr("stroke-width", "2")
      this.state = newState;
    }
    else if (symbol == "g"){
      var newState = new State(
        this.state.x + (loaded.stepSize * Math.sin(2 * Math.PI * this.state.a)),
        this.state.y + (loaded.stepSize * Math.cos(2 * Math.PI * this.state.a)),
        this.state.a,
        this.state.c
      )
      this.linegroup.append("line")
        .attr("x1", this.state.x)
        .attr("y1", this.state.y)
        .attr("x2", newState.x)
        .attr("y2", newState.y)
        .attr("stroke", translateColor(this.state.c))
        .attr("stroke-width", "2")
      this.state = newState;
    }
    else if (symbol == "+") {
      var newState = new State(this.state.x, this.state.y, this.state.a + loaded.angleIncrement, this.state.c)
      this.state = newState;
    }
    else if (symbol == "-") {
      var newState = new State(this.state.x, this.state.y, this.state.a - loaded.angleIncrement, this.state.c)
      this.state = newState;
    }
    else if (symbol == "["){
      this.stack[this.top] = this.state;
      this.top++;
    }
    else if (symbol == "]"){
      this.top--;
      this.state = this.stack[this.top];
    }
    else if (symbol == "a" || symbol == "b" || symbol == "c" || symbol == "d" || symbol == "e"){
      var newState = new State(this.state.x, this.state.y, this.state.a, symbol);
      this.state = newState;
    }
  }
}

var State = class {
  // x, y, angle, color
  constructor (x, y, a, c){
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
  }
}

var presets = {
  "dragon-curve":{
    axiom:"f",
    grammar:["f=f-h", "h=f+h"],
    stepSize:10,
    angleIncrement:.25
  },
  "plant-1":{
    axiom:"f",
    grammar:["f=bff-[c-f+f+f]+[d+f-f-f]"],
    stepSize:10,
    angleIncrement:.06
  }
}
var loaded = presets["dragon-curve"];

var symbols;
var grammar;

var go = function(){

  console.log("executed!");
  //shut door and light
  var width = 600;
  var height = 600;
  var margin = {top: -5, right: -5, bottom: -5, left: -5}

  var zoom = d3.behavior.zoom()
    .scaleExtent([.1, 10])
    .on("zoom", zoomed);

  var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

  var svg = d3.select("#l-system-view")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
    .call(zoom);

  var rect = svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");

  container = svg.append("g");
}

var step = function(){

  container.selectAll("*").remove();
  var t = new Turtle(container);

  symbols = applyRules(symbols, grammar)
  for(var i = 0; i < symbols.length; ++i){
    t.changeStateAndDraw(symbols[i])

    if (symbols[i] == "("){
      i = symbols.indexOf(")", i);
    }
  }
  console.log(symbols);
}


function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}
