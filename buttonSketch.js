function removeFromArray(arr, elt){
    for(var i = arr.length-1; i >= 0; i--){
      if(arr[i] == elt){
        arr.splice(i,1);
      }
    }
  }
  
  
  function heuristic(a,b){
    if(allowDiagnals){
      var d = dist(a.i, a.j, b.i, b.j);
    }
    else{
      var d = abs(a.i-b.i) + abs(a.j-b.j);
    }
    
    
    return d;
  }
  
  
  
  
  var cols = 100;
  var rows = 100;
  var grid = new Array(cols);
  
  
  
  var openSet = [];
  var closedSet = [];
  var start;
  var end;
  var w, h;
  var path = [];
  var startAstar = false;
  var allowDiagnals = true;
  
  
  
  
  function Spot(i,j){
    this.isStart;
    this.isEnd;
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;
  
    if(random(1) < .3){
      this.wall = true;
    }

    if(this.isStart || this.isEnd){
      fill(color(255,255,0));
    }
    
    this.show = function(col) {
      if(!this.isStart || !this.isEnd){
        fill(col);
      }

    
     
      if(this.wall){
        fill(0);
      }
      noStroke();
      rect(this.i*w, this.j*h, w-1, h-1);
    }
    
    this.spotColor = function(col){
      fill(col);
    }
      this.addNeighbors = function(grid){
        var i = this.i;
        var j = this.j;
        if(i < cols-1){
          this.neighbors.push(grid[i+1][j]);
        }
        if(i > 0){
          this.neighbors.push(grid[i-1][j]);
        }
        if(j < rows - 1){
          this.neighbors.push(grid[i][j+1]);
        }
        if(j > 0){
          this.neighbors.push(grid[i][j-1]);
        }

        if(allowDiagnals){
          if(i > 0 && j> 0){
            this.neighbors.push(grid[i-1][j-1])
          }
          if(i < cols-1 && j > 0){
            this.neighbors.push(grid[i+1][j-1])
          }
          if(i > 0 && j < rows-1){
            this.neighbors.push(grid[i-1][j+1])
          }
          if(i < cols-1 && j < rows-1){
            this.neighbors.push(grid[i+1][j+1])
          }

        }
 
     
  
    }
  
   
  }


  function doAllowDiagnals(){
    allowDiagnals = true;
  }
  
  function dontAllowDiagnals(){
    allowDiagnals = false;
  }

  function restartMaze(){
    console.log("Restart")

    grid = new Array(cols);
    openSet = [];
    closedSet = [];
    path = []
    startAstar = false;
    for(var i = 0; i < cols; i++){
      grid[i] = new Array(rows);
     
    }
    //Making a 2D array
    for(var i = 0; i < cols; i++){
      for(var j = 0; j < rows; j++){
        
        grid[i][j] = new Spot(i,j);
        
      }
    } 
    for(var i = 0; i < cols; i++){
      for(var j = 0; j < rows; j++){
        
        grid[i][j].addNeighbors(grid);
        
      }
    } 
    start=grid[0][0];
    end = grid[cols-1][rows-1];

    start.isStart = true;
    end.isEnd = true;


    start.wall = false;
    end.wall = false;
    openSet.push(start);
  }
  
  
  function setup() {
    // put setup code here
    createCanvas(1000, 1000);
    w = width/cols;
    h = height/rows;
    restartMaze();
    console.log(grid);

    //Buttons for starting and reseting
    button = createButton('Start ASTAR');
    button.mousePressed(astar);

    newButton = createButton('New Maze');
    newButton.mousePressed(restartMaze);

    allowButton = createButton('Allow Diagnols');
    allowButton.mousePressed(doAllowDiagnals);

    dontAllowButton = createButton('Dont Allow Diagnols');
    dontAllowButton.mousePressed(dontAllowDiagnals);
    


    
  
      
    
    
    

   
  }
  
  
  
  
  
  
  
  function astar(){
    startAstar = true;
  }
  
  
  
  
  function draw() {
    // put drawing code here
    
    /*if(allowDiagnals){
      textFont(40);
      textSize(40);
      fill(0);
      text("Diagnols Allowed",0,0);
    }
    else{
      textFont(40);
      textSize(40);
      fill(0);
      text("Diagnols Not-Allowed", 0,0);
    }*/

    if(startAstar){
      if(openSet.length > 0){
        var winner = 0;
        for(var i = 0; i < openSet.length; i++){
            if(openSet[i].f < openSet[winner].f){
              
              winner = i;
            }
        }
    
        var current = this.openSet[winner];
        if(current === this.end){
          //noLoop();
          console.log("Done");
          startAstar = false;
          console.log(startAstar)
          return;
        }
    
        removeFromArray(openSet, current);
        closedSet.push(current);
    
    
        var neighbors = current.neighbors;
        for(var i = 0; i < neighbors.length; i++){
          var neighbor = neighbors[i];
    
          if(!closedSet.includes(neighbor) && !neighbor.wall){
            var tempG = current.g + 1;
            var newPath = false;
            if(openSet.includes(neighbor)){
                if(tempG < neighbor.g){
                  neighbor.g = tempG;
                  newPath = true;
                }
            }
            else {
              neighbor.g = tempG;
              newPath = true;
              openSet.push(neighbor);
            }
            if(newPath){
              neighbor.h = heuristic(neighbor, end);
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.previous = current;
            }
          }
        }
    
        
      }
      else{
        console.log("No Soulution");
        //noLoop();
        startAstar = false;
        return;
      
      }
    
      //Find the path
      path = [];
      var temp = current;
      path.push(temp);
      while(temp.previous){
        path.push(temp.previous);
        temp = temp.previous;
      }
    }
    
    
    
    background(0);
    for(var i = 0; i < cols; i++){
      for(var j = 0; j < rows; j++){
        if(!grid[i][j].isStart || !grid[i][j].End){
          grid[i][j].show(color(255));
        }
       
      }
    }
  
  
  
    for(var i = 0; i < closedSet.length; i++){
      closedSet[i].show(color(255,0,0));
    }
  
    for(var i = 0; i < openSet.length; i++){
      openSet[i].show(color(0,255,0));
    }
    
    
     
      
      for(var i = 0; i < path.length; i++){
        path[i].show(color(0,0,255));
      }
  
      noFill();
      stroke(255);
  
      beginShape();
      for(var i = 0; i < path.length; i++){
       vertex(path[i].i*w + w/2, path[i].j*h + h/2)
      }
      endShape();
       
  
  
  
    
    
  }
  