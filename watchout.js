// start slingin' some d3 here.

var game = d3.select('.game')
  .attr('height', 1000)
  .attr('width', 1000);

var data = [];

for (var i = 0; i < 1; i++) {
  data.push([
    Math.floor(Math.random() * 500),
    Math.floor(Math.random() * 500)
  ]);
}

var oneStep = function() {
  var enemies = game.selectAll('g')
    .data(data);

  enemies.transition()
    .duration(1000)
    .attr('transform', function(d, i) {
      return 'translate(' + Math.floor(Math.random() * 500) +
        ', ' + Math.floor(Math.random() * 500) + ')';
    });

  enemies.enter().append('g')
    .append('circle')
    .attr('cx', function(d, i) { return d[0]; })
    .attr('cy', function(d, i) { return d[1]; })
    .attr('r', 10);
};

setInterval(oneStep, 1000);
