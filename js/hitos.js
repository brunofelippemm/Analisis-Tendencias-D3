var url = "js/data/las_cifras_del_crimen_en_espana.csv";
d3.csv(url, function (error, data) {
  if (error) {
    throw error;
  }

  var parametroSet = new Set();

  for (var i = 0; i < data.length; i++) {
    if (data[i].Parametro != "Total") {
      parametroSet.add(data[i].Parametro);
    }
  }

  console.log(parametroSet);

  var p = d3
    .select("p")
    .selectAll("p")
    .data(Array.from(parametroSet))
    .enter()
    .append("p")
    .text(function (d, i) {
      return d;
    });
});
