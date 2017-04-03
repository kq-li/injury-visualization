var heatmap = document.getElementById('heatmap');
var bbox = heatmap.getBBox();
var viewBox = bbox.x + ' ' + bbox.y + ' ' + bbox.width + ' ' + bbox.height;
heatmap.setAttribute('viewBox', viewBox);

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


//HOVER FOR STATES//
var statePaths = document.getElementsByTagName('path');

for (var i = 0; i < statePaths.length; i++){
    statePaths[i].addEventListener("mouseover", function (e) {
        this.style.stroke = 'red';
    });
    
    statePaths[i].addEventListener("mouseout", function (e) {
        this.style.stroke = 'black';
    });
}
