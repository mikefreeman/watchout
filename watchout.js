// start slingin' some d3 here.
var gameOptions = {
  height: 500,
  width: 500
};

var game = d3.select('.game')
  .attr('height', gameOptions.height)
  .attr('width', gameOptions.width);

var score = 0;
var highScore = 0;

var data = [];
var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, 500]),
  y: d3.scale.linear().domain([0, 100]).range([0, 500])
};

for (var i = 0; i < 20; i++) {
  data.push([
    0,
    0
  ]);
}

var player = {
  x: 250,
  y: 250,
  radius: 10,
  render: function() {
    game.append('g')
      .append('circle')
      .attr('class', 'player')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.radius)
      .style('fill', 'red')
      .attr('transform', 'translate(' + axes.x(50) +
        ', ' + axes.y(50) + ')'
      );
  },
  setupDragging: function() {
    var that = this;
    var drag = d3.behavior.drag().on('drag', function() {
      that.x += d3.event.dx;
      that.y += d3.event.dy;
      if (that.x < 0) that.x = 0;
      if (that.x > gameOptions.width) that.x = gameOptions.width;
      if (that.y < 0) that.y = 0;
      if (that.y > gameOptions.height) that.y = gameOptions.height;
      game.select('.player')
        .attr('transform', 'translate(' + that.x +
          ', ' + that.y + ')');
    });
    game.select('.player').call(drag);
  }
};


var oneStep = function() {
  var enemies = game.selectAll('.enemy')
    .data(data);

  enemies.transition()
    .duration(1500)
    .tween('tween', function(d, i) {
      var oldx = d[0];
      var oldy = d[1];
      d[0] = axes.x(Math.random() * 100);
      d[1] = axes.y(Math.random() * 100);
      var interpolateX = d3.interpolate(oldx,d[0]);
      var interpolateY = d3.interpolate(oldy,d[1]);

      return function(t) {

        var minSeparation = 20;
        var xEnemy = interpolateX(t);
        var yEnemy = interpolateY(t);

        this.setAttribute('transform', 'translate(' + xEnemy + ', ' + yEnemy + ')');

        var separation = Math.sqrt(Math.pow((xEnemy - player.x), 2) + 
          Math.pow((yEnemy - player.y), 2));
        if(separation < minSeparation){
          score = 0;
        }
      };
    });

  enemies.enter().append('g')
    .append('circle')
    .attr('class', 'enemy')
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

oneStep();
setInterval(oneStep, 1500);
player.render();
player.setupDragging();
setInterval(function() {
  updateScore();
  score++;
}, 50);
