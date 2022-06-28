d3.json("/data/crimenes.json", function(data) {
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
  var radioCirculo = 3.5;
  var radioCirculoHover = 6;


  /* Format Data */
  var parseDate = d3.timeParse("%Y");
  data.forEach(function (d) {
    d.values.forEach(function (d) {
      d.Fecha = parseDate(d.Fecha);
      d.TotalCrimenes = +d.TotalCrimenes;
    });
  });

  /* Scale */
  var xScale = d3.scaleTime()
    .domain(d3.extent(data[0].values, d => d.Fecha))
    .range([0, width - margin]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data[0].values, d => d.TotalCrimenes)])
    .range([height - margin, 0]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  /* Add SVG */
  var svg = d3.select("#chart").append("svg")
    .attr("width", (width + margin) + "px")
    .attr("height", (height + margin) + "px")
    .append('g')
    .attr("transform", `translate(${margin}, ${margin})`);


  /* Add line into SVG */
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


  /* Add circles in the line */
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


  /* Add Axis into SVG */
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
    .text("Crimenes Totales");
});

//const data = ""

// Leer CSV y hacer filtraciones
// d3.csv(csvFile, function (error, data) {
//   if (error) {
//     throw error;
//   }

// data.forEach(function (d) {
//   d.Valor = parseFloat(d.Valor.replace(/\./g, ""));
// });

//   // Obtener los totales de los datos para tenerlo filtrados
//   var dataFiltrada = data.filter(function (d) {
//     return d.Parametro == "Total";
//   });

//   // Remover los campos Periodo y Parametro del CSV
//   for(var v in dataFiltrada){
//     delete dataFiltrada[v].Periodo
//     delete dataFiltrada[v].Parametro
//   }

//   data = dataFiltrada
//   data["name"] = "Espana"
//   data = { "values" : data}
//   console.log("la nueva data es:")
//   console.log(data)

//   console.log(data.values)
// });
