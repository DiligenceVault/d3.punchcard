// adapted from
// http://jeybalachandran.com/posts/San-Francisco-Caltrain-Punchcard/
// https://github.com/jeyb/d3.punchcard

function Punchcard( options ) {
  this.data = options.data;
  this.element = options.element;
  return this;
}

Punchcard.prototype.draw = function( options ){

  var margin = 10,
      lineHeight = 5,
      width = options.width - (margin *2),
      pane_left = 80,
      pane_right = width - pane_left,
      height = 500 - margin,
      section_height = (height-(margin*2))/7,
      i,
      j,
      tx,
      ty,
      max = 0,
      circleRadius = 20;

  // var margin = { top: 10, right: 10, bottom: 10, left: 80 },
  //     width = options.width - margin.left - margin.right,
  //     height = 520,
      
  //     i,
  //     j,
  //     tx,
  //     ty,
  //     max = 0;

  // X-Axis.
  var x = d3.scale.linear().domain([0, 23]).
    range([pane_left, pane_right ]);

  // Y-Axis.
  var y = d3.scale.linear().domain([0, 6]).
    range([2 * margin, height - section_height]);

  // The main SVG element.
  var punchcard = d3.select(this.element)
    .html('')
    .append('svg')
      .attr('width', width + (margin * 2 ))
      .attr('height', height + margin)
      .append('g');

  // Hour line markers by day.
  for (i in y.ticks(7)) {
    punchcard.
      append('g').
      selectAll('line').
      data([0]).
      enter().
      append('line').
      attr('x1', 0).
      attr('x2', width).
      attr('y1', height - y(i)).
      attr('y2', height - y(i)).
      style('stroke-width', 1).
      style('stroke', '#efefef');

    punchcard.
      append('g').
      selectAll('.rule').
      data([0]).
      enter().
      append('text').
      attr('x', 0).
      attr('y', height - y(i) - (section_height/2) + lineHeight).
      attr('text-anchor', 'left').
      text(['Sunday', 'Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday'][i]);

    punchcard.
      append('g').
      selectAll('line').
      data(x.ticks(24)).
      enter().
      append('line').
      attr('x1', function(d) { return pane_left  + x(d); }).
      attr('x2', function(d) { return pane_left  + x(d); }).
      attr('y1', height - 1 * margin - y(i)).
      attr('y2', height  - y(i)).
      style('stroke-width', 1).
      style('stroke', '#ccc');
  }

  // Hour text markers.
  punchcard.
    selectAll('.rule').
    data(x.ticks(24)).
    enter().
    append('text').
    attr('class', 'rule').
    attr('x', function(d) { return pane_left  + x(d); }).
    attr('y', height ).
    attr('text-anchor', 'middle').
    text(function(d) {
      if (d === 0) {
        return '12a';
      } else if (d > 0 && d < 12) {
        return d;
      } else if (d === 12) {
        return '12p';
      } else if (d > 12 && d < 25) {
        return d - 12;
      }
    });

  // Data has array where indicy 0 is Monday and 6 is Sunday, however we draw
  // from the bottom up.
  this.data = this.data.reverse();

  // Find the max value to normalize the size of the circles.
  for (i = 0; i < this.data.length; i++) {
    max = Math.max(max, Math.max.apply(null, this.data[i]));
  }

  // Show the circles on the punchcard.
  for (i = 0; i < this.data.length; i++) {
    for (j = 0; j < this.data[i].length; j++) {
      punchcard.
        append('g').
        selectAll('circle').
        data([this.data[i][j]]).
        enter().
        append('circle').
        style('fill', '#888').
        // on('mouseover', mover).
        // on('mouseout', mout).
        // on('mousemove', function() {
        //  return tooltip.
        //    style('top', (d3.event.pageY - 10) + 'px').
        //    style('left', (d3.event.pageX + 10) + 'px');
        // }).
        attr('r', function(d) { return d / max * circleRadius; }).
        attr('transform', function() {
            tx = pane_left  + x(j);
            ty = height - y(i) - (section_height/2);
            return 'translate(' + tx + ', ' + ty + ')';
          });
    }
    // function mover(d) {
    //   tooltip = d3.select('body')
    //    .append('div')
    //    .style('position', 'absolute')
    //    .style('z-index', '99999')
    //    .attr('class', 'vis-tool-tip')
    //    .text(d);
    // }

    // function mout(d) {
    //   $('.vis-tool-tip').fadeOut(50).remove();
    // }
  }

  return this;
};