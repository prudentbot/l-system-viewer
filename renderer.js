
//shut door and light

var go = function(){
  console.log("init")
  var panZoom = svgPanZoom('#l-system-view', {minZoom: .5, maxZoom: 10});

  var symbols = "f-h - f+h - f-h + f+h - f-h - f+h + f-h + f+h"
  var t = new Turtle()
  var pathstring = t.startPath();
  for(var i = 0; i < symbols.length; ++i){
    pathstring = t.changeStateAndDraw(pathstring, symbols[i])
    console.log(pathstring);
  }
  console.log(pathstring);
}

//http://www.cs.unm.edu/~joel/PaperFoldingFractal/L-system-rules.html
var d = 5; //step size
var b = .25; //angle increment, 1 would be 2pi

var Turtle = class {
  constructor (){
    this.state = new State(100, 50, 0, "a");
    this.stack = [];
    this.top = 0;
  }

  startPath (){
    return "M" + this.state.x + " " + this.state.y
  }

  changeStateAndDraw (pathstring, symbol) {
    console.log(symbol);
    console.log(pathstring);
    if(symbol == "f" || symbol == "h"){
      var newState = new State(
        this.state.x + (d * Math.sin(2 * Math.PI * this.state.a)),
        this.state.y + (d * Math.cos(2 * Math.PI * this.state.a)),
        this.state.a,
        this.state.c
      )
      this.state = newState;
      pathstring = pathstring + " L" + newState.x + " " + newState.y;
    }
    else if (symbol == "g"){
      var newState = new State(
        this.state.x + (d * Math.sin(2 * Math.PI * this.state.a)),
        this.state.y + (d * Math.cos(2 * Math.PI * this.state.a)),
        this.state.a,
        this.state.c
      )
      this.state = newState;
      pathstring = pathstring + " M" + newState.x + " " + newState.y;
    }
    else if (symbol == "+") {
      var newState = new State(this.state.x, this.state.y, this.state.a + b, this.state.c)
      this.state = newState;
    }
    else if (symbol == "-") {
      var newState = new State(this.state.x, this.state.y, this.state.a - b, this.state.c)
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
    return pathstring;
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
