$('#container').outerHeight($(window).height()-$('#header').outerHeight(true));
$('#compare').outerHeight($('#container').height() - $('#heatmap-data').outerHeight(true));
$('#state1').outerHeight(($('#compare').height() - $('#compare-title').outerHeight(true)
                          - $('<hr>').outerHeight(true)) / 2);
$('#state2').outerHeight(($('#compare').height() - $('#compare-title').outerHeight(true)
                          - $('<hr>').outerHeight(true)) / 2);

var heatmap = $('#heatmap');
var heatmapBBox = heatmap[0].getBBox();
var viewBox = heatmapBBox.x + ' ' + heatmapBBox.y + ' ' + (heatmapBBox.width + 250) + ' ' + heatmapBBox.height;
heatmap.attr('viewBox', viewBox);

var stateAbvs = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];

var stateNames = ['Alaska', 'Alabama', 'Arkansas', 'Arizona', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Iowa', 'Idaho', 'Illinois', 'Indiana', 'Kansas', 'Kentucky', 'Louisiana', 'Massachusetts', 'Maryland', 'Maine', 'Michigan', 'Minnesota', 'Missouri', 'Mississippi', 'Montana', 'North Carolina', 'North Dakota', 'Nebraska', 'New Hampshire', 'New Jersey', 'New Mexico', 'Nevada', 'New York', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Virginia', 'Vermont', 'Washington', 'Wisconsin', 'West Virginia', 'Wyoming'];

var stateChart = {'AK': 'Alaska', 'AL': 'Alabama', 'AR': 'Arkansas', 'AZ': 'Arizona', 'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DC': 'District of Columbia', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'IA': 'Iowa', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'MA': 'Massachusetts', 'MD': 'Maryland', 'ME': 'Maine', 'MI': 'Michigan', 'MN': 'Minnesota', 'MO': 'Missouri', 'MS': 'Mississippi', 'MT': 'Montana', 'NC': 'North Carolina', 'ND': 'North Dakota', 'NE': 'Nebraska', 'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NV': 'Nevada', 'NY': 'New York', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VA': 'Virginia', 'VT': 'Vermont', 'WA': 'Washington', 'WI': 'Wisconsin', 'WV': 'West Virginia', 'WY': 'Wyoming'};

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
        var lightness = 100 - 55 * d[1] / maxCount;
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
    }
    
    if (daysAway.length == 0) {
        $.post('/data/average_days_away', function (daysAwayData) {
            daysAway = JSON.parse(daysAwayData);
            fillHeatmap(daysAway);
        });
    }
    
    loadHeatmap($('#heatmap-data').val());
});

var tooltip = $(document.createElementNS('http://www.w3.org/2000/svg', 'g'));
var tooltipRect = $(document.createElementNS('http://www.w3.org/2000/svg', 'rect')).attr({
    class: 'tooltip-rect',
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    rx: 10,
    ry: 10
});

var tooltipState = $(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
    .attr('class', 'tooltip-state');
var tooltipInjuries = $(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
    .attr('class', 'tooltip-injuries');
var tooltipPopulation = $(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
    .attr('class', 'tooltip-population');
var tooltipFraction = $(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
    .attr('class', 'tooltip-fraction');
var tooltipDaysAway = $(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
    .attr('class', 'tooltip-days-away');
var TOOLTIP_SPACING = 20;
var TOOLTIP_PADDING = 10;

tooltip.append(tooltipRect)
    .append(tooltipState)
    .append(tooltipInjuries)
    .append(tooltipPopulation)
    .append(tooltipFraction)
    .append(tooltipDaysAway);
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
    
    tooltipState.attr({
        x: parseInt(tooltipRect.attr('x')) + TOOLTIP_PADDING,
        y: parseInt(tooltipRect.attr('y')) + TOOLTIP_PADDING + tooltipState[0].getBBox().height
    });

    tooltipInjuries.attr({
        x: parseInt(tooltipState.attr('x')),
        y: parseInt(tooltipState.attr('y')) + TOOLTIP_PADDING + tooltipInjuries[0].getBBox().height
    });

    tooltipPopulation.attr({
        x: parseInt(tooltipInjuries.attr('x')),
        y: parseInt(tooltipInjuries.attr('y')) + TOOLTIP_PADDING + tooltipPopulation[0].getBBox().height
    });

    tooltipFraction.attr({
        x: parseInt(tooltipPopulation.attr('x')),
        y: parseInt(tooltipPopulation.attr('y')) + TOOLTIP_PADDING + tooltipFraction[0].getBBox().height
    });

    tooltipDaysAway.attr({
        x: parseInt(tooltipFraction.attr('x')),
        y: parseInt(tooltipFraction.attr('y')) + TOOLTIP_PADDING + tooltipDaysAway[0].getBBox().height
    });
});

var activeStates = [null, null];

function isSelected(statePath) {
    return activeStates.indexOf(statePath) != -1;
}

function makeDonutChart(data, width, height, radius, inner) {
    var chart = $('<div></div>').attr('class', 'donut');
    var color = d3.scale.category20c();

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

function hoverState(statePath) {
    statePath.css({
        'z-index': 1,
        'stroke-width': 3
    });

    var stateIndex = stateAbvs.indexOf(statePath.attr('id'));
    var stateName = stateNames[stateIndex];
    var stateInjuries = injuryCounts[stateIndex][1];
    var statePopulation = populations[stateIndex][1];
    var stateFraction = parseInt(stateInjuries * 10000000 / statePopulation)
    var stateDaysAway = daysAway[stateIndex][1];

    tooltipState.text(stateName);
    tooltipInjuries.text('Injuries: ' + stateInjuries);
    tooltipPopulation.text('Population: ' + statePopulation.toLocaleString('en-US'));
    tooltipFraction.text('Per 10M: ' + stateFraction);
    tooltipDaysAway.text('Avg days away: ' + stateDaysAway.toLocaleString('en-US', {
        maximumFractionDigits: 2
    }));

    var width = Math.max(tooltipState[0].getBBox().width,
                         tooltipInjuries[0].getBBox().width,
                         tooltipPopulation[0].getBBox().width,
                         tooltipFraction[0].getBBox().width,
                         tooltipDaysAway[0].getBBox().width);
    var height = tooltipState[0].getBBox().height + tooltipInjuries[0].getBBox().height
        + tooltipPopulation[0].getBBox().height + tooltipFraction[0].getBBox().height
        + tooltipDaysAway[0].getBBox().height;
    tooltipRect.attr({
        width: width + 2 * TOOLTIP_PADDING,
        height: height + 6 * TOOLTIP_PADDING
    });

    tooltip.show();
}

function unhoverState(statePath) {
    if (!isSelected(statePath.attr('id'))) {
        statePath.css({
            'z-index': 0,
            'stroke-width': 1
        });
    }
    
    tooltip.hide();
}

function selectState(statePath) {
    var data = [{'value': 11, 'label': 'Services'}, {'value': 23, 'label': 'Manufacturing'}, {'value': 7,'label': 'Transportation'}, {'value': 2, 'label': 'Retail Trade'}, {'value': 2, 'label': 'Wholesale Trade'}]
    
    $("#state" + (activeStates.indexOf(statePath) + 1)).append(makeDonutChart(data, 200, 200, 90, 35)).append(statePath.attr('id'));

    statePath.css({
        'z-index': 2,
        'stroke-width': 3
    });

    //$.post('/data/industry_counts/' + statePath.attr('id'), function (data) {
        //console.log(data);
    //});
}

function deselectState(statePath) {
    $('#state' + (activeStates.indexOf(statePath) + 1)).text('').children().remove();

    statePath.css({
        'z-index': 0,
        'stroke-width': 1
    });
}

$('#heatmap path').each(function (i, statePath) {
    statePath = $(statePath);

    statePath.on('mouseover', function (e) {
        hoverState(statePath);
    });
    
    statePath.on('mouseout', function (e) {
        unhoverState(statePath);
    });

    statePath.on('mousedown', function (e) {
        var activeStateIndex = e.which == 1 ? 0 : 1;
        var activeState = activeStates[activeStateIndex];
        var otherStateIndex = (activeStateIndex + 1) % 2;
        var otherState = activeStates[otherStateIndex];
        var index = activeStates.indexOf(statePath.attr('id'));

        if (activeStateIndex == index) {
            deselectState(statePath);
            activeStates[index] = null;
        } else {
            if (index != -1) {
                deselectState(statePath);
                activeStates[index] = null;
            }
            
            if (activeState) {
                deselectState($('#' + activeState));
            }
        
            activeStates[activeStateIndex] = statePath.attr('id');
            selectState(statePath);
        } 

        console.log(activeStates);
    });
});
