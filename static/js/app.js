// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata; // acess the metadata field

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html(""); // sets its HTML content to an empty string

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (key_value in result){
      panel.append("h6").text(`${key_value.toUpperCase()}: ${result[key_value]}`);
    };

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Build a Bubble Chart
    let bubbledata = [
      {
        // Data for x-axis
        x: otu_ids,
        // Data for y-axis
        y: sample_values,
        // Text labels for each bubble in the chart
        text: otu_labels,
        // Display the data points as markers
        mode: "markers",
        // Apperance of the markers in the chart
        marker: {
          // Size of the bubble is determined by the sample_values
          size: sample_values,
          // The color of each bubble is determined by the otu_ids
          color: otu_ids,
          // This specifies the color scale to be used for the bubbles.
          colorscale: "Earth"
        }
      }
    ];

    // Defines the layout of the Bubble chart
    let bubbleLayout = {
      // Sets the title of the chart
      title: "Bacteria Cultures Per Sample",
      // Sets the hover behavior to display information for the closest data point
      hovermode: "closest",
      // Set the title for the x-axis
      xaxis: { title: "OTU ID"},
      // Set the title for the y-axis
      yaxis: { title: "Number of Bacteria"},
      // Sets the top margin to 30-pixel space between top of the chart
      margin: { t: 30}
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbledata, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(otuID => `OTU ${otuID}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let bardata = [
      {
        // First 10 elements of yticks array reversed
        y: yticks.slice(0, 10).reverse(),
        // First 10 elements of sample_values array reversed
        x: sample_values.slice(0, 10).reverse(),
        // First 10 elements of otu_labels array reversed with additional information displaying when hovering over the bars
        text: otu_labels.slice(0, 10).reverse(),
        // Specifies chart a a bar chart
        type: "bar",
        // Indicates bars will be displayed horizontially
        orientation: "h"
      }
    ];

    // Defines the layout of the Bar Chart
    let barLayout = {
      // Sets the title
      title: "Top 10 Bacteria Cultures",
      // Margins top is set to 30 pixels, while left is set to 150 pixels
      margin: {t: 30, l: 150},
      // xaxis title
      xaxis: {title: "Number of Bacteria"}
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", bardata, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i=0; i < sampleNames.length; i++){
      // selector is a D3 selection that refers to a specific DOM element
      selector
        // Appends a new option element to the selector for each iteration of the loop
        .append("option")
        // Sets the text content of the new created option element to the current value from the sampleNames array
        .text(sampleNames[i])
        // Sets the value attribute of the option element to the same vaule as the text
        .property("value", sampleNames[i]);
    };

    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
