Element.prototype.setAttributes = function (attributes) {
    for (var attribute in attributes) {
        this.setAttribute(attribute, attributes[attribute]);
    }
}

var heatmap = $('#heatmap');
var heatmapBBox = heatmap[0].getBBox();
var viewBox = heatmapBBox.x + ' ' + heatmapBBox.y + ' ' + heatmapBBox.width + ' ' + heatmapBBox.height;
heatmap.attr('viewBox', viewBox);

var states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];

var injuryCounts = [];
var populations = [];
var injuryFractions = [];
var daysAway = [];

function fillHeatmap(counts) {
    var maxCount = 0;
    
    for (var state of counts) {
        if (state[1] > maxCount) {
            maxCount = state[1];
        }
    }

    var paths = d3.selectAll('path');
    paths.data(counts).style('fill', function (d) {
        var lightness = 95 - 50 * d[1] / maxCount;
        return 'hsl(0, 100%,' + lightness + '%)';
    });
}

function loadHeatmap(val) {
    if (val == 'injury_fractions') {
        if (injuryFractions.length == 0) {
            $.post('/data/injury_counts', function (injuryData) {
                injuryCounts = JSON.parse(injuryData);
            
                $.post('/data/populations', function (populationData) {
                    populations = JSON.parse(populationData);

                    for (var i = 0; i < injuryCounts.length; i++) {
                        injuryFractions.push(
                            [injuryCounts[i][0],
                             injuryCounts[i][1] * 10000000.0 / populations[i][1]]);
                    }

                    fillHeatmap(injuryFractions);
                });
            });
        } else {
            fillHeatmap(injuryFractions);
        }
    } else if (val == 'average_days_away') {
        if (daysAway.length == 0) {
            $.post('/data/average_days_away', function (daysAwayData) {
                daysAway = JSON.parse(daysAwayData);
                fillHeatmap(daysAway);
            });
        } else {
            fillHeatmap(daysAway);
        }
    }
}

$('#heatmap-data').change(function () {
    loadHeatmap($(this).val());
});

$(document).ready(function () {
    loadHeatmap($('#heatmap-data').val());
});

var tooltip = $(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
var tooltipRect = $(document.createElementNS('http://www.w3.org/2000/svg', 'rect')).attr({
    id: 'tooltip',
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    rx: 10,
    ry: 10
});

var tooltipText = $(document.createElementNS('http://www.w3.org/2000/svg', 'text'));
var TOOLTIP_SPACING = 20;
var TOOLTIP_PADDING = 10;

tooltip.append(tooltipRect).append(tooltipText);
tooltip.hide();
heatmap.append(tooltip);

function toViewBoxCoords(x, y) {
    var m = heatmap[0].getScreenCTM();
    var p = heatmap[0].createSVGPoint();
    p.x = x;
    p.y = y;
    p = p.matrixTransform(m.inverse());
    return [p.x, p.y];
}

$('#heatmap').on('mousemove', function (e) {
    var viewBoxCoords = toViewBoxCoords(e.clientX, e.clientY);
    
    tooltipRect.attr({
        x: viewBoxCoords[0] + TOOLTIP_SPACING,
        y: viewBoxCoords[1] + TOOLTIP_SPACING
    });

    tooltipText.attr({
        x: viewBoxCoords[0] + TOOLTIP_SPACING + TOOLTIP_PADDING,
        y: viewBoxCoords[1] + tooltipText[0].getBBox().height * 0.75
            + TOOLTIP_SPACING + TOOLTIP_PADDING
    });
});

var activeStates = [null, null];

function isSelected(state) {
    return activeStates.indexOf(state) != -1;
}

function makeDonutChart(data, width, height, radius, inner) {
    var chart = $('<div></div>').attr('class', 'donut');
    var color = d3.scale.category20c();

    var data = [{'value': 11, 'label': 'Services'}, {'value': 23, 'label': 'Manufacturing'}, {'value': 7, 'label': 'Transportation'}, {'value': 2, 'label': 'Retail Trade'}, {'value': 2, 'label': 'Wholesale Trade'}]
    ;

    var total = d3.sum(data, function (d) {
        return d3.sum(d3.values(d));
    });

    var vis = d3.select(chart[0])
        .append('svg:svg')
        .data([data])
        .attr('width', width)
        .attr('height', height)
        .append('svg:g')
        .attr('transform', 'translate(' + radius * 1.1 + ',' + radius * 1.1 + ')')

    var textTop = vis.append('text')
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .attr('class', 'textTop')
        .text( '' )
        .attr('y', -10);
    
    var textBottom = vis.append('text')
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .attr('class', 'textBottom')
        .text('')
        .attr('y', 10);

    var arc = d3.svg.arc()
        .innerRadius(inner)
        .outerRadius(radius);

    var arcOver = d3.svg.arc()
        .innerRadius(inner + 5)
        .outerRadius(radius + 5);
    
    var pie = d3.layout.pie()
        .value(function (d) {
            return d.value * 100 / total;
        });
    
    var arcs = vis.selectAll('g.slice')
        .data(pie)
        .enter()
        .append('svg:g')
        .attr('class', 'slice')
        .on('mouseover', function (d) {
            d3.select(this).select('path').transition()
                .duration(200)
                .attr('d', arcOver)
            
            textTop.text(d3.select(this).datum().data.label)
                .attr('y', -10);
            textBottom.text((d3.select(this).datum().data.value*100/total).toFixed(2))
                .attr('y', 10);
        })
        .on('mouseout', function (d) {
            d3.select(this).select('path').transition()
                .duration(100)
                .attr('d', arc);
            
            textTop.text( '' )
                .attr('y', -10);
            textBottom.text('');
        });

    arcs.append('svg:path')
        .attr('fill', function (d, i) {
            return color(i);
        })
        .attr('d', arc);

    var legend = d3.select(chart[0]).append('svg')
        .attr('class', 'legend')
        .attr('width', radius * 2)
        .attr('height', radius * 2)
        .selectAll('g')
        .data(data)
        .enter().append('g')
        .attr('transform', function (d, i) {
            return 'translate(0,' + i * 20 + ')';
        });

    legend.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', function (d, i) {
            return color(i);
        });

    legend.append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .text(function (d) {
            return d.label + ' - ' + (d.value * 100 / total).toFixed(2) + '%';
        });

    return chart;
}

function hoverState(state) {
    console.log('hover' + state.getAttribute('id'));
    state.style['z-index'] = 1;
    state.style['stroke-width'] = 3;

    tooltipText.text('test');

    tooltipRect.attr({
        width: tooltipText[0].getBBox().width + 2 * TOOLTIP_PADDING,
        height: tooltipText[0].getBBox().height + 2 * TOOLTIP_PADDING
    });

    tooltip.show();
}

function unhoverState(state) {
    console.log('unhover');
    //console.log(state);
    state.style['z-index'] = 0;
    state.style['stroke-width'] = 1;
    tooltip.hide();
}

function selectState(state) {
    state.style['z-index'] = 2;
    state.style['stroke-width'] = 3;
}

function deselectState(state) {
    state.style['z-index'] = 0;
    state.style['stroke-width'] = 1;
}

$('path').each(function (i, state) {
    state.addEventListener('mouseover', function (e) {
        hoverState(this);
    });
    
    state.addEventListener('mouseout', function (e) {
        if (!isSelected(this)) {
            unhoverState(this);
        }
    });

    state.addEventListener('mousedown', function (e) {
        if (e.which == 1) {
            if (activeStates[0]) {
                deselectState(activeStates[0]);
            }
            
            selectState(this);
            activeStates[0] = this;
        } else if (e.which == 3) {
            if (activeStates[1]) {
                deselectState(activeStates[1]);
            }

            selectState(this);
            activeStates[1] = this;
        }
    });
});

function post(element, state) {

    var input = { 'text' : state};

    $.ajax({
	url: '/state',
	type: 'GET',
	data: input,
	success: function( d ) {
	    makeDonutChart(JSON.parse(d), 300, 300, 150, 130);
	}

     });
};

var i;
for(i = 0 ; i < states.length ; i++){
    document.getElementById('US-' + states[i]).addEventListener('click', post(document.getElementById('US-' + states[i]), states[i]));
}
