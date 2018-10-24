function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // url will match the route setup via Flask and what's in index.html: /metadata/<sample>
  var url = "/metadata/" + sample
  console.log(url);

  // Setup success handler and error handler when fetching data
  d3.json(url).then(handleSuccess).catch(handleError)

  // error handler function
  function handleError(error){
  console.log('An error occurred. Here is the error: ', error)
  }
  
  // success handler function
  function handleSuccess(response){
  console.log('Able to successfully retrieve metadata. Here it is: ', response)
  
  // Use d3 to select the panel with id of `#sample-metadata`
  var panel_body = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  panel_body.html("");

  // take object called response and make into array of objects
  var response_arr = [response];
  console.log("response_arr is: ", response_arr);

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  response_arr.forEach(function(report){
    console.log(report);
    Object.entries(report).forEach(function([key, value]){
      console.log(key, value);
      // Append a cell to the row for each value
      // first output key as text along with a colon
      var cell_key = panel_body.append("td");
      cell_key.text(key + ": ");
      // next output value as text
      var cell_val = panel_body.append("td");
      cell_val.text(value);
      // insert a single line break
      panel_body.append("br");
    });
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

  }
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // url will match the route setup via Flask and what's in index.html: /samples/<sample>
  var url = "/samples/" + sample
  console.log(url);

  // Setup success handler and error handler when fetching data
  d3.json(url).then(handleSuccess).catch(handleError)

  // error handler function
  function handleError(error){
    console.log('An error occurred. Here is the error: ', error)
  }

  // success handler function
  function handleSuccess(result){
    console.log('Able to successfully retrieve sample data. Here it is: ', result)

    // @TODO: Build a Bubble Chart using the sample data
    // Setup trace for Bubble chart
    var trace1 = {
      type: 'scatter',
      // Use otu_ids for x values
      x: result.otu_ids,
      // Use sample_values for y values
      y: result.sample_values,
      // Use otu_labels for text values
      text: result.otu_labels,
      mode: 'markers',
      marker: {
        // Use otu_ids for marker colors
        color: result.otu_ids,
        // Use sample_values for marker size
        size: result.sample_values
      }
    };
    
    var data = [trace1];

    var layout = {
      title: 'Bubble Chart',
      height: 800,
      xaxis: {
        title: 'OTU ID'
      }
    };

    // Plot bubble chart using Plotly
    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    console.log("result.sample_values is: ", result.sample_values)
    console.log("result.otu_ids is: ", result.otu_ids)
    console.log("result.otu_labels is: ", result.otu_labels)
    
    // create temp variables equal to sample_values, otu_ids, and otu_labels which will then use next for sorting
    var A = result.sample_values;
    var B = result.otu_ids;
    var C = result.otu_labels;
    
    // create array of objects that combine sample_values and otu_ids 
    var all_A_B = [];
    
    // iterate through all otu_ids and push to combined array of sample_values and otu_ids
    for (var i = 0; i < B.length; i++) {
      all_A_B.push({ 'A': A[i], 'B': B[i] });
    }
    
    // sort combined array of sample_values and otu_ids in descending order of sample_values
    all_A_B.sort(function(a, b) {
      return b.A - a.A;
    });
    
    // initialize sorted array of sample_values in descending order and corresponding array of otu_ids
    sorted_A = [];
    sorted_B = [];
    
    // iterate through combined array and push to sorted_A and sorted_B
    for (var i = 0; i < all_A_B.length; i++) {
      sorted_A.push(all_A_B[i].A);
      sorted_B.push(all_A_B[i].B);
    }    
    
    // sorted_A should be equal to sample_values in descending order
    // sorted_B should be equal to corresponding otu_ids
    console.log(sorted_A)
    console.log(sorted_B)
    
    // create array of objects that combine sample_values and otu_label
    var all_A_C = [];
    
    // iterate through all otu_labels and push to combined array of sample_values and otu_label
    for (var i = 0; i < C.length; i++) {
      all_A_C.push({ 'A': A[i], 'C': C[i] });
    }
    
    // sort combined array of sample_values and otu_labels in descending order of sample_values
    all_A_C.sort(function(a, c) {
      return c.A - a.A;
    });
    
    // initialize sorted array of sample_values in descending order and corresponding array of otu_ids
    sorted_A_again = [];
    sorted_C = [];
    
    // iterate through combined array and push to sorted_A_again and sorted_C
    for (var i = 0; i < all_A_C.length; i++) {
      sorted_A_again.push(all_A_C[i].A);
      sorted_C.push(all_A_C[i].C);
    }   
    
    // sorted_A_again should be equal to sample_values in descending order
    // sorted_C should be equal to corresponding otu_labels
    console.log(sorted_A_again)
    console.log(sorted_C)
    
    // so now we have sorted_A (sample_values in descending order), sorted_B (corresponding otu_ids), and sorted_C (corresponding otu_labels)
    // next need to slice the top 10 from each of these
    var top_ten_sample_values = sorted_A.slice(0, 10);
    var top_ten_otu_ids = sorted_B.slice(0, 10);
    var top_ten_otu_labels = sorted_C.slice(0, 10);
    console.log("top_ten_sample_values is: ", top_ten_sample_values);
    console.log("top_ten_otu_ids is: ", top_ten_otu_ids);
    console.log("top_ten_otu_labels is: ", top_ten_otu_labels);
    
    // create Pie chart
    var pie_data = [{
      values: top_ten_sample_values,
      labels: top_ten_otu_ids,
      type: "pie",
      hovertext: top_ten_otu_labels,
      hoverinfo: "label+text+value+percent"
    }];
    
    var pie_layout = {
      title: 'Top Ten Pie Chart',
      height: 800,
      width: 800,
    };
    
    // Plot pie chart 
    Plotly.newPlot("pie", pie_data, pie_layout);


  }


}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
