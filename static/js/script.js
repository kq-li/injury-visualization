var heatmap = $('#heatmap');
var heatmapBBox = heatmap[0].getBBox();
var viewBox = heatmapBBox.x + ' ' + heatmapBBox.y + ' ' + heatmapBBox.width + ' ' + heatmapBBox.height;
heatmap.attr('viewBox', viewBox);

var states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];

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
    var url = '/data/' + val;

    $.post(url, function (data, status) {
        fillHeatmap(JSON.parse(data));
    });
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

$('#heatmap').on('mousemove', function (e) {
    tooltipRect.attr({
        x: e.offsetX + heatmapBBox.x + TOOLTIP_SPACING,
        y: e.offsetY + heatmapBBox.y + TOOLTIP_SPACING
    });

    tooltipText.attr({
        x: e.offsetX + heatmapBBox.x + TOOLTIP_SPACING + TOOLTIP_PADDING,
        y: e.offsetY + heatmapBBox.y + tooltipText[0].getBBox().height * 0.75
            + TOOLTIP_SPACING + TOOLTIP_PADDING
    });
});

var activeStates = [null, null];

function showTooltip(message) {
    //console.log('showing tooltip');
    tooltipText.text(message);

    tooltipRect.attr({
        width: tooltipText[0].getBBox().width + 2 * TOOLTIP_PADDING,
        height: tooltipText[0].getBBox().height + 2 * TOOLTIP_PADDING
    });

    tooltip.show();
};

function hideTooltip() {
    //console.log('hiding tooltip');
    tooltip.hide();
}

function isSelected(state) {
    return activeStates.indexOf(state) != -1;
}

function hoverState(state) {
    console.log('hover' + state.getAttribute('id'));
    state.style['z-index'] = 1;
    state.style['stroke-width'] = 3;
	showTooltip('PLACEHOLDER\ntest');
}

function unhoverState(state) {
    console.log('unhover');
    //console.log(state);
    state.style['z-index'] = 0;
    state.style['stroke-width'] = 1;
	hideTooltip();
}

function selectLeftState(state) {
    console.log('selected');
    state.style['z-index'] = 2;
    state.style['stroke-width'] = 3;
    activeStates[0] = state;
}

function deselectLeftState(state) {
    console.log('deselected');
    state.style['z-index'] = 0;
    state.style['stroke-width'] = 1;
    activeStates[0] = null;
}

function selectRightState(state) {
    state.style['z-index'] = 2;
    state.style['stroke-width'] = 3;
    activeStates[1] = state;
}

function deselectRightState(state) {
    state.style['z-index'] = 0;
    state.style['stroke-width'] = 1;
    activeStates[1] = null;
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
        console.log('click: ' + e.offsetX + ' ' + e.offsetY);
        if (e.which == 1) {
            if (activeStates[0]) {
                deselectLeftState(activeStates[0]);
            }
            
            selectLeftState(this);
        } else if (e.which == 3) {
            if (activeStates[1]) {
                deselectRightState(activeStates[1]);
            }

            selectRightState(this);
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
	    //input donut js here!!!!!!!!!
	}

     });
};

var i;
for(i = 0 ; i < states.length ; i++){
    document.getElementById("US-" + states[i]).addEventListener("click", post(document.getElementById("US-" + states[i]), states[i]));
}
