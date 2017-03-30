var heatmap = document.getElementById('heatmap');
var bbox = heatmap.getBBox();
var viewBox = bbox.x + ' ' + bbox.y + ' ' + bbox.width + ' ' + bbox.height;
heatmap.setAttribute('viewBox', viewBox);
