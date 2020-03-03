const w = 1000;
const h = 650;
const padding = 40;
const barWidth = 2;
const parseTime = d3.timeParse("%Y-%m-%d") //Parses 2015-01-19
const ConvertTimeQuarter = d3.timeFormat("Q%q %Y ") //Converts to Q1 2015

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(data => {
    //Title
    /*<#const title = d3.select(".title")
                    .text(data.name)
    */
    const container = d3.select(".container")
                .style("padding", `${padding}px`)
        
    const svg = d3.select(".visHolder")
                    .append("svg")
                    .attr("width", data.data.length * (barWidth + 1) + padding)
                    .attr("height", h)
    
    //X Scale and X Axis
    const xScale = d3.scaleTime()
                    .domain(d3.extent(data.data, (d) => parseTime(d[0])))
                    .range([padding, w - (padding * 3)])
    
    const xAxis = d3.axisBottom()
                .ticks(d3.timeYear.every(4))
                .tickFormat(d3.timeFormat("%Y"))
                .scale(xScale)
    
    svg.append("g")
       .attr("class", "axis")
       .attr("id", "x-axis")
       .attr("transform", `translate(0, ${h - padding})`)
       .call(xAxis);
    
    //Y Scale and Y Axis
    const yScale = d3.scaleLinear()
                    .domain([0, d3.max(data.data, (d) => d[1])])
                    .range([h - padding, padding])
    
    const yAxis = d3.axisLeft(yScale);
    
    svg.append("g")
       .attr("id", "y-axis")
       .attr("transform", `translate(${padding}, 0)`)
       .call(yAxis);
          
    //Bars
    svg.selectAll("rect")
        .data(data.data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => i * (barWidth + 1) + (padding))
        .attr("y", (d, i) => yScale(d[1]))
        .attr("width", barWidth)
        .attr("height", (d, i) => h - yScale(d[1]) - (padding))
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .style("fill", "hsla(89, 50%, 62%, 1)")
        //Mouse over bars
        .on("mouseover", (d, i) => {
            d3.select("#tooltip")
            .attr("data-date", d[0])
            .attr("data-gdp", d[1])
            .transition()
            .duration(200)
            .style("opacity", 1)
            .text(ConvertTimeQuarter(parseTime(d[0])));
        })
       .on("mouseout", function(d) {
            d3.select("#tooltip")
            .style("opacity", 0)
       })
       .on("mousemove", function(d, i) {
        d3.select("#tooltip")
        .style("left", (d3.event.pageX - i/4) + "px")
        .style("top", (d3.event.pageY - h/16) + "px")
       })
    
    //Tooltip
    d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("style", "opacity: 0;")
})