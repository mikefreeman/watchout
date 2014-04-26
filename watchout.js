// start slingin' some d3 here.

var game = d3.select('.game')
  .attr('height', 500)
  .attr('width', 500);

var score = 0;
var highScore = 0;

var data = [];
var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, 500]),
  y: d3.scale.linear().domain([0, 100]).range([0, 500])
};

for (var i = 0; i < 20; i++) {
  data.push([
    0,0
  ]);
}

var player = {
  x: 0,
  y: 0,
  radius: 10,
  render: function() {
    game.append('g')
      .append('circle')
      .attr('class', 'player')
      .attr('cx', this.x)
      .attr('cy', this.y)
      .attr('r', this.radius)
      .style('fill', 'red');
  },
  setupDragging: function() {
    var that = this;
    var drag = d3.behavior.drag().on('drag', function() {
      that.x += d3.event.dx;
      that.y += d3.event.dy;
      game.select('.player')
        .attr('transform', 'translate(' + that.x +
          ', ' + that.y + ')');
    });
    game.select('.player').call(drag);
  }
};

player.render();
player.setupDragging();




// var drag = d3.behavior.drag()
//   // .origin(Object)
//   .on("drag", function(d) {
//     debugger;
//     console.log(d3.event.dx);
//     d[0] += d3.event.dx;
//     d[1] += d3.event.dy;
//     initPlayer();
//   });


// var initPlayer = function() {
//   var player = game.selectAll('g.player')
//     .data(playerData);

//   player.attr("transform", function(d) { return "translate(" + d[0] + "," + d[1] + ")"; });

//   player.enter().append('g')
//     .attr('class', 'player')
//     .append('circle')
//     .attr('cx', function(d){ return d[0]; })
//     .attr('cy', function(d){ return d[1]; })
//     .attr('r', 10)
//     .call(drag);

// };

var oneStep = function() {
  var enemies = game.selectAll('.enemy')
    .data(data);

  enemies.transition()
    .duration(1500)
    // .attr('transform', function(d, i) {
    //   return 'translate(' + d[0] +
    //     ', ' + d[1] + ')';
    // })
    .tween('tween', function(d, i){
      var oldx = d[0];
      var oldy = d[1];
      d[0] = axes.x(Math.random() * 100);
      d[1] = axes.y(Math.random() * 100);
      var interpolateX = d3.interpolate(oldx,d[0]);
      var interpolateY = d3.interpolate(oldy,d[1]);

      return function(t){

        var minSeparation = 20;
        var xEnemy = interpolateX(t);
        var yEnemy = interpolateY(t);

        this.setAttribute('transform', 'translate(' + xEnemy + ', ' + yEnemy + ')');

        var separation = Math.sqrt(Math.pow((xEnemy-player.x),2)+Math.pow((yEnemy-player.y),2));
        if(separation < minSeparation){
          score = 0;
        }
      };
    });

  enemies.enter().append('g')
    .attr('class', 'enemy')
    .append('circle')
    .attr('cx', function(d, i) { return d[0]; })
    .attr('cy', function(d, i) { return d[1]; })
    .attr('r', 10);
};

var checkAll = function(){
  var enemies = game.selectAll('.enemy')
    .each(function(d, i){
      console.log(d);
    });
};

var d3CurrentScore = d3.select('.current').select('span');
var d3HighScore = d3.select('.high').select('span');

var updateScore = function(){
  if(score > highScore){
    highScore = score;
    d3HighScore.text(highScore.toString());
  }
  d3CurrentScore.text(score.toString());
};

setInterval(oneStep, 1500);
setInterval(function() {
  updateScore();
  score++;
}, 50);
//initPlayer();
