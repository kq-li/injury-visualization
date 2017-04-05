# injury-visualization
D3 Data Visualization Project for Team COAL (Daniel Chiu, Will Ostlund, Shaeq Ahmed, Kenneth Li).

Team COAL — Daniel Chiu, Will Ostlund, Shaeq Ahmed, Kenneth Li

Overview
	Our project focuses on presenting the CORGIS injury database in an easily-comprehensible and flexible format. The main data visualization tool is a heatmap of the United States, which allows the selection of states to see additional graphs. The database provided information about the location of the injury, the industry of the injury, the duration of time the victim was unable to work, and the time of the injury, granting us many options for our dependent and independent variables.


Usage
	The user would first be presented with a heatmap of the United States correlating location (state) to number of injuries by default. (This can be changed through a dropdown box to display location vs. average duration of absence, for example.) Additionally, hovering over a state will display additional information about the current state and dataset. Clicking on states will bring up statistics and more graphs below the heatmap. Right click on one state and left click on another to choose the states for comparison. By clicking on two states, the user can see a side-by-side comparison of both states.


Technical Details
	The heatmap would be composed of an SVG element for each state, allowing hovering and clicking functionality through JavaScript event listeners. The elements’ colors would be related to injury statistics through D3 data binding (with dataset chosen by dropdown). Clicking on a state to bring up further statistics and information would also utilize D3 for more specific graphs and information.


Database: https://think.cs.vt.edu/corgis/python/injuries/injuries.html