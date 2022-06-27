var url = "js/data/las_cifras_del_crimen_en_espana.csv";
var expr = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;

var svg = d3.select("svg"),
  margin = 150,
  width = svg.attr("width") - margin,
  height = svg.attr("height") - margin;
//Titulo
svg
  .append("text")
  .attr("transform", "translate(10,0)")
  .attr("x", 50)
  .attr("y", 80)
  .attr("font-family", "Sans-serif")
  .attr("font-size", "20px")
  .attr("font-weight", "bold")
  .text("Las cifras del crimen en España");

var x = d3.scaleBand().range([0, width]).padding(0.3);
var y = d3.scaleLinear().range([height, 100]);

var g = svg.append("g").attr("transform", "translate(" + 120 + "," + 40 + ")");

d3.csv(url, function (error, data) {
  if (error) {
    throw error;
  }

  // OLD CODE START FROM HERE
  //Eliminamos puntos y Cambiamos tipo de dato
  data.forEach(function (d) {
    d.Valor = parseFloat(d.Valor.replace(/\./g, ""));
  });

  //<conservamos solo los totales
  var dataFltr = data.filter(function (d) {
    return d.Parametro == "Total";
  });

  console.log(dataFltr);
  console.log(
    d3.max(dataFltr, function (d) {
      return d.Valor;
    })
  );

  // Valores de X
  x.domain(
    dataFltr.map(function (d) {
      return d.Anio;
    })
  );

  // Valores de Y
  y.domain([
    1200000,
    d3.max(dataFltr, function (d) {
      return d.Valor;
    }),
  ]);

  // Rellenar el combobox con los años
  d3.select("#anioDeCrimen")
  .selectAll('myOptions')
   .data(dataFltr.map(function (d) {
    return d.Anio;
   }))
  .enter()
  .append('option')
  .text(function (d) { return d; })
  .attr("value", function (d) { return d; })

  // TODO Grafica de puntos
  var margin = {top: 10, right: 100, bottom: 30, left: 30},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// agregar el SVG al objeto del body de la pagina
var svg = d3.select("#graficaPuntos")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  // agregar el eje de las X
  svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));

  // agregar el eje de las Y

  // TO DO! CONTINUE ADDING CODE HERE
  svg.append("g")
     .call(d3.axisLeft(y))
     .append("text")
     .text("Denuncias acumuladas")

     var line = svg
     .append('g')
     .append("path")
       .datum(dataFltr)
       .attr("d", d3.line()
         .x(function(d) { return x(+d.Anio) })
         .y(function(d) { return y(+d.Valor) })
       )
       .attr("stroke", function(d){ return myColor("valueA") })
       .style("stroke-width", 4)
       .style("fill", "none")

          // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      //var dataFilter = data.map(function(d){return {time: d.time, value:d[selectedGroup]} })

      // Give these new data to update line
      line
          .datum(dataFltr)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(+d.Anio) })
            .y(function(d) { return y(+d.Valor) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#anioDeCrimen").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

  // Termina grafica de puntos

  // g.append("g")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(d3.axisBottom(x))
  //   .append("text")
  //   .attr("y", height - 360)
  //   .attr("x", width - 300)
  //   .attr("text-align", "justify")
  //   .attr("stroke", "black")
  //   .attr("font-size", "20px")
  //   .text("Año");

  // g.append("g")
  //   .call(
  //     d3
  //       .axisLeft(y)
  //       .tickFormat(function (d) {
  //         return d.toString().replace(expr, ",");
  //       })
  //       .ticks(10)
  //   )
  //   .append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("x", -120)
  //   .attr("y", 0)
  //   .attr("dy", "-3.4em")
  //   .attr("stroke", "black")
  //   .attr("font-size", "20px")
  //   .text("Denuncias, datos acumulados");

  // g.selectAll(".bar")
  //   .data(dataFltr)
  //   .enter()
  //   .append("rect")
  //   .attr("class", "bar")
  //   .on("mouseover", onMouseOver)
  //   .on("mouseout", onMouseOut)
  //   .attr("x", function (d) {
  //     return x(d.Anio);
  //   })
  //   .attr("y", function (d) {
  //     return y(d.Valor);
  //   })
  //   .attr("width", x.bandwidth())
  //   .attr("height", function (d) {
  //     return height - y(d.Valor);
  //   });
});

//funcion de mouseover
function onMouseOver(d, i) {
  d3.select(this).attr("class", "highlight");
  d3.select(this)
    .transition()
    .duration(400)
    .attr("width", x.bandwidth() + 7)
    .attr("y", function (d) {
      return y(d.Valor) - 10;
    })
    .attr("height", function (d) {
      return height - y(d.Valor) + 10;
    });

  g.append("text")
    .attr("class", "val")
    .attr("x", function () {
      return x(d.Anio);
    })
    .attr("y", function () {
      return y(d.Valor) - 15;
    })
    .text(function () {
      return [d.Valor.toString().replace(expr, ",")];
    });
}

//funcion de mouseout
function onMouseOut(d, i) {
  d3.select(this).attr("class", "bar");
  d3.select(this)
    .transition()
    .duration(400)
    .attr("width", x.bandwidth())
    .attr("y", function (d) {
      return y(d.Valor);
    })
    .attr("height", function (d) {
      return height - y(d.Valor);
    });
  d3.selectAll(".val").remove();
}
