var heatmap = document.getElementById('heatmap');
var bbox = heatmap.getBBox();
var viewBox = bbox.x + ' ' + bbox.y + ' ' + bbox.width + ' ' + bbox.height;
heatmap.setAttribute('viewBox', viewBox);

var states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];

console.log(counts);
var paths = d3.selectAll('path');
paths.data(counts).style('fill', function (d) {
    var lightness = 95 - 50 * d.count / max_count;
    return 'hsl(0, 100%,' + lightness + '%)';
});
