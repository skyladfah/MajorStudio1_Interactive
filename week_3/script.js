// First Container


// Second Container
// Showing chocolate bar before click
var ChocolateBar = d3.select(".ChocolateBefore");

var ChocolateBarSvg = ChocolateBar.append("svg")
  .attr("width", 780)
  .attr("height", 450);

var ChocolateBefore = ChocolateBarSvg.append("rect")
  .attr("x", 0.5)
  .attr("y", 0.5)
  .attr("id", "ChocolateBefore")
  .attr("width", 770)
  .attr("height", 440)
  .style("fill", "#211909")

// chocolate bar after click
// this function work for on/off 
// d3.selectAll(".ChocolateBefore")
// .on("click", function(){
//           // Determine if current line is visible
//           var active   = ChocolateBefore.active ? false : true,
//             newOpacity = active ? 0 : 1;
//           // Hide or show the elements
//           d3.select("#ChocolateBefore").style("opacity", newOpacity);
//           // d3.select("#blueAxis").style("opacity", newOpacity);
//           // Update whether or not the elements are active
//           ChocolateBefore.active = active;
// })

// click to break
d3.selectAll(".ChocolateBefore")
  .on("click", function () {
    d3.select(this)
      .style("background-color", "orange");
    // Get current event info
    console.log(d3.event);
  })


const country = document.querySelectorAll('.country')
// const countries = document.querySelector('.countries')
const tooltip = d3.select('body').append('div').attr('class', 'tooltip')

d3.csv('dataset/Cocoa-Production-in-2022.csv', function (data) {
  console.log(data);
  let content = ''

  for (let i = 0; i < country.length; i++) {
    country[i].addEventListener('mouseover', (event) => {
      for (let j = 0; j < data.length; j++) {
          if (data[j]['Country'] === country[i].attributes['data-country'].value) {
          
          //   content = 
          // `${data[j]['Country']}
          // <br>Produce ${data[j]['CocoaProduction(Tons)']} tonnes of cacao in 2022.
          // <br>Responsible for ${data[j]['Percentage']} of the world’s cocoa`
          // country[i].style.stroke = 'red'
          // country[i].style['stroke-width'] = '2px'

          content = "<span class='countryName'>" + (data[j]['Country']) + "</span>" + "<br>"
          content1 = "<span class='countryContinent'>" + (data[j]['Continent']) + "</span>" + "<br>"
          content2 = "<span class='countryProduction'>" + "Produce " + "<span style=font-weight:bold;'>" + (data[j]['Production']) + "</span>" + " tonnes of cacao in 2022 <br>" 
          content3 = "Responsible for " + "<span style=font-weight:bold;'>" + (data[j]['Percentage']) + "</span>" + " of the world’s cocoa"
          // country[i].style.opacity = '100%'
          // country[i].style.stroke = 'red'
        }
      }
      tooltip.html(content + content1 + '<br>' + content2 + content3).style('visibility', 'visible')
    })

    country[i].addEventListener('mousemove', (event) => {
      tooltip.style('top', event.pageY + 'px')
      tooltip.style('left', event.pageX - (tooltip.node().clientWidth / 2) + 'px')

    })
    // country[i].addEventListener('mouseout', (event) => {
    //   tooltip.html(content).style('visibility', 'hidden')
    //   country[i].style.opacity = '10%'
    // })
  }

  // d3.select("#ChocolateAfter").selectAll("svg")
  //     .data(d)
  //     .enter()
  //     .append("svg")
  //     .attr("id", function(d) { return d.Country; });
  // d3.selectAll("svg")

})




// Third container
// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 600 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv('dataset/Proportion-of-forest-area-with-a-long-term-management-plan-in-the-country-with-cacao-production.csv', function (data) {
  console.log(data);
  data = data.filter(d => d.Plan != 'NaN')
  data = data.filter(d => data.filter(x => x.Country == d.Country).length > 1 )
  console.log(data);


  // List of groups (here I have one group per column)
  var allGroup = d3.map(data, function (d) {
    return (d.Country)
  })
    .keys()

  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d.Country; }) // corresponding value returned by the button


    // d3.select('').selectAll('rects').data(data).append('rect').attr('data-country', d => d.country).attr('x').attr('y').attr('width', `10px`).attr('height', '`10px')

  // A color scale: one color for each group
  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2);

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.Year; }))
    .range([0, width]);

    const xAxis = d3.axisBottom(x)
      .tickFormat(d3.format("c"))


  svg.append("g")
    .attr("transform", "translate(0," + height + ")") //to make the X-asix stay on the ground
    .call(xAxis);

    // .ticks(8));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

  svg.append("g")
    .call(d3.axisLeft(y));

  // var makeLine = d3.line()
  //   .defined(function (d) { return d.Plan !== NaN });

  // Initialize line with first group of the list
  var line = svg
    .append('g')
    .append("path")
    .datum(data.filter(function (d) { return d.Country == allGroup[0] }))
    .attr("d", d3.line()
      .x(function (d) { return x(d.Year) })
      .y(function (d) { return y(+d.Plan) })
    )
    .attr("stroke", function (d) { return myColor("valueA") })
    .style("stroke-width", 4)
    .style("fill", "none")


  // A function that update the chart
  function update(selectedGroup) {

    // Create new data with the selection?
    var dataFilter = data.filter(function (d) { return d.Country == selectedGroup })

    // Give these new data to update line
    line
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function (d) { return x(d.Year) })
        .y(function (d) { return y(+d.Plan) })
      )
      .attr("stroke", function (d) { return myColor(selectedGroup) })
  }

  // When the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function (d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update(selectedOption)
  })

})








// Forth container

d3.csv('dataset/Proportion-of-forest-area-with-a-long-term-management-plan-in-the-country-with-cacao-production.csv', function (d) {
  	//10 rows and 10 columns 
	var numRows = 11;
	var numCols = 5;

	//x and y axis scales
	var y = d3.scaleBand()
		.range([0,820])
		.domain(d3.range(numRows));

	var x = d3.scaleBand()
		.range([0, 370])
		.domain(d3.range(numCols));

  //the data is just an array of numbers for each cell in the grid
	var d = d3.range(numCols*numRows);

  // circleRadii = [40, 20, 10];


  var svgContainer = d3.select("#grid-container").append("svg")
                                      .attr("width", 800)
                                      .attr("height", 800);
  
  var rect = svgContainer.selectAll("rect")
                            .data(d)
                            .enter()
                            .append("rect");  

  var chocolateGrid = rect
                         .attr("width", 65)
                         .attr("height", 65)
                         .attr("id", function (d) { return d.Country; })
                         .attr('x', function (d) { return x((d) % numCols); })
                         .attr('y', function (d) { return y(Math.floor(d / numCols)); })

})