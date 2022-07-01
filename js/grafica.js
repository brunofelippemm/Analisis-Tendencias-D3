var jsonFile = "/data/crimenes.json"

d3.json(jsonFile, function(data) {
  // parametros para la grafica
  var width = 500;
  var height = 300;
  var margin = 50;
  var duration = 200;

  // parametros para las lineas
  var opacidadLinea = "0.50";
  var opacidadLineaHover = "0.90";

  // parametros para los circulos
  var opacidadCirculos = '0.9';
  var radioCirculo = 4.0;
  var radioCirculoHover = 6;


  // Hacer una conversion de fecha de año a datestamp
  var parseDate = d3.timeParse("%Y");
  data.forEach(function (d) {
    d.values.forEach(function (d) {
      d.Fecha = parseDate(d.Fecha);
    });
  });

  // Scale de eje X -> Fecha
  var xScale = d3.scaleTime()
    .domain(d3.extent(data[0].values, d => d.Fecha))
    .range([0, width - margin]);

  // Scale de eje Y -> TotalCrimenes
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data[0].values, d => d.TotalCrimenes)])
    .range([height - margin, 0]);

  // Escala ordinal
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  // Empezar con SVG para la creacion de la grafica con los parametros definidos
  // de ancho y alto
  var svg = d3.select("#grafica").append("svg")
    .attr("width", (width + margin) + "px")
    .attr("height", (height + margin) + "px")
    .append('g')
    .attr("transform", `translate(${margin}, ${margin})`);


  // Agregar lineas SVG
  var line = d3.line()
    .x(d => xScale(d.Fecha))
    .y(d => yScale(d.TotalCrimenes));

  let lines = svg.append('g')
    .attr('class', 'lines');

  lines.selectAll('.line-group')
    .data(data).enter()
    .append('g')
    .attr('class', 'line-group')
    .on("mouseover", function (d, i) {
      svg.append("text")
        .attr("class", "titulo-encabezado")
        .style("fill", color(i))
        .text(d.name)
        .attr("text-anchor", "middle")
        .attr("x", (width - margin) / 2)
        .attr("y", 5);
    })
    .on("mouseout", function (d) {
      svg.select(".titulo-encabezado").remove();
    })
    .append('path')
    .attr('class', 'linea')
    .attr('d', d => line(d.values))
    .style('stroke', (d, i) => color(i))
    .style('opacity', opacidadLinea)
    .on("mouseover", function (d) {
      d3.selectAll('.linea')
        .style('opacity', "0.1");
      d3.selectAll('.circle')
        .style('opacity', "0.25");
      d3.select(this)
        .style('opacity', opacidadLineaHover)
        .style("stroke-width", "2.5px")
        .style("cursor", "pointer");
    })
    .on("mouseout", function (d) {
      d3.selectAll(".linea")
        .style('opacity', opacidadLinea);
      d3.selectAll('.circle')
        .style('opacity', opacidadCirculos);
      d3.select(this)
        .style("stroke-width", "1.5px")
        .style("cursor", "none");
    });


  // Agregar circulos en las lineas de la grafica
  lines.selectAll("circle-group")
    .data(data).enter()
    .append("g")
    .style("fill", (d, i) => color(i))
    .selectAll("circle")
    .data(d => d.values).enter()
    .append("g")
    .attr("class", "circle")
    .on("mouseover", function (d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text")
        .text(`${d.TotalCrimenes}`)
        .attr("x", d => xScale(d.Fecha) + 5)
        .attr("y", d => yScale(d.TotalCrimenes) - 10);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .style("cursor", "none")
        .transition()
        .duration(duration)
        .selectAll(".text").remove();
    })
    .append("circle")
    .attr("cx", d => xScale(d.Fecha))
    .attr("cy", d => yScale(d.TotalCrimenes))
    .attr("r", radioCirculo)
    .style('opacity', opacidadCirculos)
    .on("mouseover", function (d) {
      d3.select(this)
        .transition()
        .duration(duration)
        .attr("r", radioCirculoHover);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .transition()
        .duration(duration)
        .attr("r", radioCirculo);
    });


  // Agregar los ejes en SVG
  var xAxis = d3.axisBottom(xScale).ticks(5);
  var yAxis = d3.axisLeft(yScale).ticks(5);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height - margin})`)
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append('text')
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
    .text("Crimenes");
});
