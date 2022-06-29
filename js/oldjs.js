// Este codigo era parte no funcional 
// que estaba en desarrollo para la manipulacion
// de la grafica con los datos de crimenes
// en españa

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
