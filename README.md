# injury-visualization
D3 Data Visualization Project by Team COAL — Daniel Chiu, Will Ostlund, Shaeq Ahmed, Kenneth Li

## Overview
Our project focuses on presenting the CORGIS injury database in an easily-comprehensible and flexible format. The main data visualization tool is a heatmap of the United States, which allows the selection of states to see additional graphs. The database provided information about the location of the injury, the industry of the injury, the duration of time the victim was unable to work, and the time of the injury, granting us many options for our dependent and independent variables.


## Usage
The user is presented with a heatmap of the United States correlating location (state) to number of injuries per ten million people (population data from US Census) by default. (This can be changed through a dropdown to display location vs. average duration of absence.) 

Additionally, hovering over a state will display additional information about the current state and dataset. Clicking on states will bring up donut charts displaying the distribution of injuries across industries for that state. Right click on one state and left click on another to choose the states for comparison. By clicking on two states, the user can see a side-by-side comparison of both states.


## Technical Details
The heatmap is composed of an SVG path element for each state, allowing hovering and clicking functionality through JavaScript event listeners. The elements’ colors are tied to injury statistics through D3 data binding (with dataset chosen by dropdown). Clicking on a state to bring up further statistics and information also utilizes D3 for more specific graphs and information. JQuery is utilized to make AJAX calls to fetch data as well as generally streamline development.


## Future Goals
The heatmap and donut charts work well and display the information in the dataset in a very user-friendly manner. However, due to lack of time and/or knowledge, we were unable to implement the following features, which would enhance the visualization:

- Animations, especially on the donut charts
- Additional statistics (industry distribution for the entire country, for example)
- Good UI/UX (current state: passable/WIP)


Database: https://think.cs.vt.edu/corgis/python/injuries/injuries.html
