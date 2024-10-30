"use strict";

//dashboard.js
// Unified Product Colors
var SharedColors = {
  gasoline95: '#009C62',
  gasoline91: '#e54141',
  diesel: '#FAB75C',
  online: '#3db16d',
  offline: '#e61e45'
};
var AlarmsValues = {
  DISCONNECTED: {
    value: 6,
    color: '#7E66F5'
  },
  LOW_FLOW_HOSE_2: {
    value: 11,
    color: '#FFB63C'
  },
  PRODUCT_HIGH: {
    value: 2,
    color: '#6CDAB4'
  },
  WATER_HIGH: {
    value: 4,
    color: '#EABD3B'
  },
  OVERFLOW: {
    value: 13,
    color: '#CB548C'
  },
  SUCTION: {
    value: 1,
    color: '#18D4D3'
  },
  SUDDEN_LOSS: {
    value: 6,
    color: "#3B76FC"
  },
  PRODUCT_LOW: {
    value: 2,
    color: '#263049'
  },
  LOW_FLOW_HOSE_1: {
    value: 9,
    color: "#3F5C58"
  },
  DELIVERY_RECONCILIATION: {
    value: 7,
    color: "#FF8E66"
  },
  TANK_NO_LEVEL: {
    value: 7,
    color: "#B81337"
  }
};
var AlarmLabelMap = {
  DISCONNECTED: 'Disconnected',
  LOW_FLOW_HOSE_2: 'Low Flow Hose 2',
  PRODUCT_HIGH: 'High Product Level',
  WATER_HIGH: 'High Water Level',
  OVERFLOW: 'Overflow',
  SUCTION: 'Suction',
  LOW_FLOW_HOSE_1: 'Low Flow Hose 1',
  SUDDEN_LOSS: 'Sudden Loss',
  PRODUCT_LOW: 'Low Product Level',
  DELIVERY_RECONCILIATION: 'Delivery Reconciliation',
  TANK_NO_LEVEL: 'No Level Tank'
};
var predefinedPercentage = 90; // Unified Product Value from the DOM

var GetCurrentProductValue = {
  currentGasoline95Value: null,
  currentGasoline91Value: null,
  currentDieselValue: null,
  parseFormattedNumber: function parseFormattedNumber(numberStr) {
    return parseFloat(numberStr.replace(/,/g, '').trim());
  },
  getCurrentValue: function getCurrentValue(elementId) {
    var element = document.getElementById(elementId);

    if (element) {
      var valueText = element.innerText || element.textContent;
      return GetCurrentProductValue.parseFormattedNumber(valueText);
    } else {
      console.error("Element with ID ".concat(elementId, " not found."));
      return 0; // Fallback value if the element is not found
    }
  },
  // Method to initialize values
  init: function init() {
    GetCurrentProductValue.currentGasoline95Value = GetCurrentProductValue.getCurrentValue('gasoline95-value');
    GetCurrentProductValue.currentGasoline91Value = GetCurrentProductValue.getCurrentValue('gasoline91-value');
    GetCurrentProductValue.currentDieselValue = GetCurrentProductValue.getCurrentValue('diesel-value');
  }
}; // Format the Value for each Product

var FormatNumbers = {
  init: function init() {
    var valuesNodeList = document.querySelectorAll(".gts-value");

    if (valuesNodeList.length) {
      FormatNumbers.formatNumbersInSpans();
    }
  },
  formatNumbersInSpans: function formatNumbersInSpans() {
    document.querySelectorAll('.gts-value h3 span').forEach(function (span) {
      var originalNumber = span.textContent;
      var numberToFormat = parseFloat(originalNumber.replace(/,/g, '')); // Remove any commas or formatting

      if (!isNaN(numberToFormat)) {
        // Format the number without changing its decimal points
        var formattedNumber = numberToFormat.toLocaleString('en-US', {
          useGrouping: true
        });
        span.textContent = formattedNumber;
      }
    });
  }
};

var getChartBackgroundColor = function getChartBackgroundColor() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      // Check for dark mode (using localStorage or body class)
      var appearance = localStorage.getItem('gts-appearance');
      var isDarkMode = appearance === 'dark' || appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches || document.body.classList.contains('dark-mode'); // Resolve with the background color

      var backgroundColor = isDarkMode ? '#171721' : '#ffffff';
      resolve(backgroundColor);
    }, 0); // Adjust timeout if necessary
  });
}; // Tending Value for Product Usage from Last Monther


var TrendingUpdates = {
  init: function init() {
    var trendingElement = document.querySelectorAll('.trending');

    if (trendingElement.length) {
      // Call the applyTrendingUpdates function
      TrendingUpdates.applyTrendingUpdates(1020038.997, GetCurrentProductValue.currentGasoline95Value, 'gasoline95');
      TrendingUpdates.applyTrendingUpdates(221038.997, GetCurrentProductValue.currentGasoline91Value, 'gasoline91');
      TrendingUpdates.applyTrendingUpdates(608038.997, GetCurrentProductValue.currentDieselValue, 'diesel');
    }
  },
  calculatePercentageChange: function calculatePercentageChange(firstWeek, lastWeek) {
    // Handle the case where the first week value is zero to avoid division by zero
    if (firstWeek === 0) {
      return lastWeek > 0 ? 100 : 0; // Handle edge case where the value changes from 0 to something else
    }

    return (lastWeek - firstWeek) / firstWeek * 100;
  },
  updateTrendingElement: function updateTrendingElement(element, percentageChange, formattedPercentage) {
    var trendingElement = element.querySelector('.trending');
    var trendingTagElement = element.querySelector('.trending-tag');
    var trendingDurationElement = element.querySelector('.trending-duration'); // Remove existing 'up' or 'down' classes

    trendingElement.classList.remove('up', 'down');
    trendingTagElement.innerHTML = ''; // Clear existing content

    trendingDurationElement.innerHTML = ''; // Clear existing content

    var trendMessage = ''; // Add class and icon based on trend

    if (percentageChange > 0) {
      trendingElement.classList.add('up');
      trendingTagElement.innerHTML = "\n                <span class=\"mat-icon material-symbols-sharp\">trending_up</span> ".concat(formattedPercentage, "%\n            ");
      trendMessage = 'Up from last month';
    } else if (percentageChange < 0) {
      trendingElement.classList.add('down');
      trendingTagElement.innerHTML = "\n                <span class=\"mat-icon material-symbols-sharp\">trending_down</span> ".concat(formattedPercentage, "%\n            ");
      trendMessage = 'Down from last month';
    } else {
      trendMessage = 'No change from last month';
    } // Append the trend message to the .trending-duration element


    if (trendingDurationElement) {
      trendingDurationElement.innerHTML = "".concat(trendMessage);
    }
  },
  applyTrendingUpdates: function applyTrendingUpdates(firstWeek, lastWeek, className) {
    // Calculate percentage change
    var percentageChange = TrendingUpdates.calculatePercentageChange(firstWeek, lastWeek);
    var formattedPercentage = Math.abs(percentageChange.toFixed(2)); // Find the element with the className

    var element = document.querySelector(".".concat(className));

    if (element) {
      TrendingUpdates.updateTrendingElement(element, percentageChange, formattedPercentage);
    }
  }
}; // Pie Chart for Product Usage

var GasolineUsagePieChart = {
  init: function init() {
    var gasolineChartWrapper = document.getElementById('currentUsageChart');

    if (gasolineChartWrapper) {
      // Step 1: Load Google Charts library
      google.charts.load('current', {
        packages: ['corechart']
      }); // Step 2: Set callback to run when the library is loaded

      google.charts.setOnLoadCallback(GasolineUsagePieChart.drawPieChart);
    }
  },
  // Step 4: Function to draw the Pie Chart
  drawPieChart: function drawPieChart() {
    var backgroundColor, data, windowWidth, options, gasolineChartWrapper, chart;
    return regeneratorRuntime.async(function drawPieChart$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(getChartBackgroundColor());

          case 2:
            backgroundColor = _context.sent;
            // Create the data table
            data = new google.visualization.DataTable();
            data.addColumn('string', 'Fuel Type');
            data.addColumn('number', 'Liters'); // Add the data rows

            data.addRows([['Gasoline 95', GetCurrentProductValue.currentGasoline95Value], ['Gasoline 91', GetCurrentProductValue.currentGasoline91Value], ['Diesel', GetCurrentProductValue.currentDieselValue]]);
            windowWidth = window.innerWidth; // Set chart options (no 3D and custom colors with borders)

            options = {
              title: '',
              is3D: false,
              backgroundColor: backgroundColor,
              slices: {
                0: {
                  offset: 0.07,
                  textStyle: {
                    color: backgroundColor
                  },
                  color: SharedColors.gasoline95,
                  borderColor: backgroundColor,
                  borderWidth: 0
                },
                // Gasoline 95
                1: {
                  offset: 0.12,
                  textStyle: {
                    color: backgroundColor
                  },
                  backgroundColor: '#00ff00',
                  color: SharedColors.gasoline91,
                  borderColor: backgroundColor,
                  borderWidth: 0
                },
                // Gasoline 91
                2: {
                  offset: 0.07,
                  textStyle: {
                    color: backgroundColor
                  },
                  color: SharedColors.diesel,
                  fillOpacity: 0.3,
                  borderColor: backgroundColor,
                  borderWidth: 0
                } // Diesel

              },
              chartArea: {
                width: windowWidth < 769 ? '90%' : '80%',
                height: windowWidth < 769 ? '90%' : '80%'
              },
              // Make chart area 80% of the wrapper size
              pieSliceText: 'percentage',
              // Show percentage in slices
              legend: {
                position: 'none'
              } // Hide the default legend

            }; // Draw the chart in the specified div

            gasolineChartWrapper = document.getElementById('currentUsageChart');
            chart = new google.visualization.PieChart(gasolineChartWrapper);
            chart.draw(data, options); // Step 5: Draw the legend beneath the chart

            GasolineUsagePieChart.createLegend(gasolineChartWrapper);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  // Step 6: Create a custom legend with colored circles below the chart
  createLegend: function createLegend(wrapper) {
    var legendData = [{
      label: 'Gasoline 95',
      color: SharedColors.gasoline95
    }, {
      label: 'Gasoline 91',
      color: SharedColors.gasoline91
    }, {
      label: 'Diesel',
      color: SharedColors.diesel
    }];
    var legendContainer = wrapper.parentNode.querySelector('.chart-legend');
    legendData.forEach(function (item) {
      var legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
      legendItem.innerHTML = "\n            <span class=\"legend-color\" style=\"background-color: ".concat(item.color, ";\"></span>\n            <span class=\"legend-label\">").concat(item.label, "</span>\n          ");
      legendContainer.appendChild(legendItem);
    });
  }
}; // Area Chart for Fuel Usage for the Last 4 Weeks

var FuelUsageAreaChart = {
  init: function init() {
    var areaChartWrapper = document.getElementById('comparisonUsageChart');

    if (areaChartWrapper) {
      // Load Google Charts library
      google.charts.load('current', {
        packages: ['corechart']
      }); // Set callback to run when the library is loaded

      google.charts.setOnLoadCallback(FuelUsageAreaChart.drawAreaChart);
    }
  },
  // Function to draw the Area Chart
  drawAreaChart: function drawAreaChart() {
    var backgroundColor, data, windowWidth, options, areaChartWrapper, chart;
    return regeneratorRuntime.async(function drawAreaChart$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(getChartBackgroundColor());

          case 2:
            backgroundColor = _context2.sent;
            // Create the data table
            data = new google.visualization.DataTable();
            data.addColumn('string', 'Week');
            data.addColumn('number', 'Gasoline 95');
            data.addColumn('number', 'Gasoline 91');
            data.addColumn('number', 'Diesel'); // Add data rows for the last 4 weeks

            data.addRows([['Week 1', 600000, 500000, 400000], // Week 1 values
            ['Week 2', 1020000, 310000, 615000], // Week 2 values
            ['Week 3', 500150, 809000, 59000], // Week 3 values
            ['Week 4', GetCurrentProductValue.currentGasoline95Value || 0, GetCurrentProductValue.currentGasoline91Value || 0, GetCurrentProductValue.currentDieselValue || 0] // Current week values
            ]); // Set chart options

            windowWidth = window.innerWidth;
            options = {
              title: '',
              isStacked: false,
              // Stack the areas (true, false, 'relative', 'percent')
              backgroundColor: backgroundColor,
              colors: [SharedColors.gasoline95, SharedColors.gasoline91, SharedColors.diesel],
              chartArea: {
                width: '75%',
                height: windowWidth < 1281 ? '65%' : '65%'
              },
              // Make chart area 80% of the wrapper size
              legend: {
                position: 'none'
              },
              // Position the legend at the bottom
              hAxis: {
                title: ''
              },
              vAxis: {
                title: ''
              },
              keepInBounds: true,
              curveType: 'function',
              connectSteps: true
            }; // Draw the chart in the specified div

            areaChartWrapper = document.getElementById('comparisonUsageChart');
            chart = new google.visualization.LineChart(areaChartWrapper); // AreaChart or LineChart or ColumnChart

            chart.draw(data, options); // Create a custom legend below the chart

            FuelUsageAreaChart.createLegend(areaChartWrapper);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  // Create a custom legend with colored circles below the chart
  createLegend: function createLegend(wrapper) {
    var legendData = [{
      label: 'Gasoline 95',
      color: SharedColors.gasoline95
    }, {
      label: 'Gasoline 91',
      color: SharedColors.gasoline91
    }, {
      label: 'Diesel',
      color: SharedColors.diesel
    }];
    var legendContainer = wrapper.parentNode.querySelector('.chart-legend');
    legendData.forEach(function (item) {
      var legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
      legendItem.innerHTML = "\n            <span class=\"legend-color\" style=\"background-color: ".concat(item.color, ";\"></span>\n            <span class=\"legend-label\">").concat(item.label, "</span>\n          ");
      legendContainer.appendChild(legendItem);
    });
  }
}; // Doughnut Chart for Sites Status

var SiteStatusChart = {
  init: function init() {
    var chartWrapper = document.getElementById('siteStatusChart');

    if (chartWrapper) {
      // Load Google Charts library
      google.charts.load('current', {
        packages: ['corechart']
      }); // Set callback to run when the library is loaded

      google.charts.setOnLoadCallback(SiteStatusChart.drawSteppedAreaChart);
    }
  },
  // Function to draw the Stepped Area Chart
  drawSteppedAreaChart: function drawSteppedAreaChart() {
    var backgroundColor, onlineValue, offlineValue, data, options, chartWrapper, chart;
    return regeneratorRuntime.async(function drawSteppedAreaChart$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(getChartBackgroundColor());

          case 2:
            backgroundColor = _context3.sent;
            // Step 1: Get values from DOM
            onlineValue = parseInt(document.getElementById('online-value').textContent, 10);
            offlineValue = parseInt(document.getElementById('offline-value').textContent, 10); // Step 2: Create the data table

            data = new google.visualization.DataTable();
            data.addColumn('string', 'Status');
            data.addColumn('number', 'Online');
            data.addColumn('number', 'Offline'); // Add the data rows for Online and Offline

            data.addRows([['Online', onlineValue, 0], ['Offline', 0, offlineValue]]); // Step 3: Set chart options

            options = {
              title: '',
              isStacked: false,
              // Stack the areas for better comparison
              backgroundColor: backgroundColor,
              hAxis: {
                title: '',
                textStyle: {
                  fontSize: 12
                }
              },
              vAxis: {
                title: '',
                minValue: 0
              },
              // colors: ['#288048', '#e53434'],  // Custom colors for Online and Offline
              colors: [SharedColors.online, SharedColors.offline],
              chartArea: {
                width: '70%',
                height: '70%'
              },
              legend: {
                position: 'none'
              } // Hide default legend

            }; // Step 4: Draw the chart in the specified div

            chartWrapper = document.getElementById('siteStatusChart');
            chart = new google.visualization.SteppedAreaChart(chartWrapper);
            chart.draw(data, options); // Step 5: Draw the custom legend below the chart

            SiteStatusChart.createLegend(chartWrapper);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  // Step 6: Create a custom legend with colored circles below the chart
  createLegend: function createLegend(wrapper) {
    var legendData = [{
      label: 'Online',
      color: SharedColors.online
    }, {
      label: 'Offline',
      color: SharedColors.offline
    }];
    var legendContainer = wrapper.parentNode.querySelector('.chart-legend');
    legendData.forEach(function (item) {
      var legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
      legendItem.innerHTML = "\n                <span class=\"legend-color\" style=\"background-color: ".concat(item.color, ";\"></span>\n                <span class=\"legend-label\">").concat(item.label, "</span>\n            ");
      legendContainer.appendChild(legendItem);
    });
  }
}; // System Alarms Bar Chart

var SystemAlarmsChart = {
  init: function init() {
    var systemAlarmsChart = document.getElementById('systemAlarmsChart');

    if (systemAlarmsChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(SystemAlarmsChart.drawChart);
    }
  },
  drawChart: function drawChart() {
    var data, systemAlarmsChart, backgroundColor, options, chart;
    return regeneratorRuntime.async(function drawChart$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            data = new google.visualization.DataTable();
            systemAlarmsChart = document.getElementById('systemAlarmsChart'); // Define columns for alarm types and values

            data.addColumn('string', 'Alarm Type');
            data.addColumn('number', 'Count');
            data.addColumn({
              type: 'string',
              role: 'style'
            }); // For bar colors

            _context4.next = 7;
            return regeneratorRuntime.awrap(getChartBackgroundColor());

          case 7:
            backgroundColor = _context4.sent;
            // Add rows with alarm values and user-friendly labels
            Object.keys(AlarmsValues).slice(0, 6).forEach(function (alarmType) {
              var displayLabel = AlarmLabelMap[alarmType] || alarmType; // Map technical label to user-friendly label

              data.addRow([displayLabel, AlarmsValues[alarmType].value, "color: ".concat(AlarmsValues[alarmType].color)]);
            }); // Chart options for vertical bars

            options = {
              title: '',
              chartArea: {
                width: '80%',
                height: '70%'
              },
              backgroundColor: backgroundColor,
              hAxis: {
                title: ''
              },
              vAxis: {
                title: '',
                minValue: 0
              },
              legend: 'none'
            }; // Draw the chart

            chart = new google.visualization.ColumnChart(systemAlarmsChart);
            chart.draw(data, options); // Create the custom legend

            SystemAlarmsChart.createLegend(systemAlarmsChart);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  // Create custom legend with colors and labels
  createLegend: function createLegend(wrapper) {
    // Add rows with alarm values and user-friendly labels
    var legendData = Object.keys(AlarmsValues).slice(0, 6).map(function (alarmType) {
      return {
        label: alarmType,
        color: AlarmsValues[alarmType].color
      };
    });
    var legendContainer = wrapper.parentNode.querySelector('.chart-legend');
    legendContainer.innerHTML = ''; // Clear existing legend

    legendData.forEach(function (item) {
      var legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
      legendItem.innerHTML = "\n          <span class=\"legend-color\" style=\"background-color: ".concat(item.color, ";\"></span>\n          <span class=\"legend-label\">").concat(AlarmLabelMap[item.label] || item.label, "</span>\n        ");
      legendContainer.appendChild(legendItem);
    });
  }
}; // System Alarms Donut Chart

var SystemAlarmsDonutChart = {
  init: function init() {
    var systemAlarmsChart = document.getElementById('systemAlarmsDonutChart');

    if (systemAlarmsChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(SystemAlarmsDonutChart.drawChart);
    }
  },
  drawChart: function drawChart() {
    var data, backgroundColor, options, systemAlarmsChart, chart;
    return regeneratorRuntime.async(function drawChart$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            data = new google.visualization.DataTable(); // Define columns for alarm types and values

            data.addColumn('string', 'Alarm Type');
            data.addColumn('number', 'Count');
            _context5.next = 5;
            return regeneratorRuntime.awrap(getChartBackgroundColor());

          case 5:
            backgroundColor = _context5.sent;
            // Add rows with alarm values and user-friendly labels
            Object.keys(AlarmsValues).slice(0, 6).forEach(function (alarmType) {
              var displayLabel = AlarmLabelMap[alarmType] || alarmType; // Map technical label to user-friendly label

              data.addRow([displayLabel, AlarmsValues[alarmType].value]);
            }); // Chart options for donut chart

            options = {
              title: '',
              pieHole: 0.4,
              // To make it a donut chart
              chartArea: {
                width: '80%',
                height: '80%'
              },
              backgroundColor: backgroundColor,
              colors: Object.keys(AlarmsValues).map(function (alarmType) {
                return AlarmsValues[alarmType].color;
              }),
              legend: 'none',
              pieSliceText: 'percentage',
              // Show percentage on the slices
              pieSliceTextStyle: {
                color: '#fff'
              },
              slices: {
                offset: 0.07
              } // width: 699

            }; // Draw the chart

            systemAlarmsChart = document.getElementById('systemAlarmsDonutChart');
            chart = new google.visualization.PieChart(systemAlarmsChart);
            chart.draw(data, options); // Create the custom legend

            SystemAlarmsDonutChart.createLegend(systemAlarmsChart);

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  // Create custom legend with colors and labels
  createLegend: function createLegend(wrapper) {
    // Add rows with alarm values and user-friendly labels
    var legendData = Object.keys(AlarmsValues).slice(0, 6).map(function (alarmType) {
      return {
        label: alarmType,
        color: AlarmsValues[alarmType].color
      };
    });
    var legendContainer = wrapper.parentNode.querySelector('.chart-legend');
    legendContainer.innerHTML = ''; // Clear existing legend

    legendData.forEach(function (item) {
      var legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
      legendItem.innerHTML = "\n          <span class=\"legend-color\" style=\"background-color: ".concat(item.color, ";\"></span>\n          <span class=\"legend-label\">").concat(AlarmLabelMap[item.label] || item.label, "</span>\n        ");
      legendContainer.appendChild(legendItem);
    });
  }
};
var OperationalAlarmsBarChart = {
  init: function init() {
    var operationalAlarmsBarChart = document.getElementById('operationalAlarmsChart');

    if (operationalAlarmsBarChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(OperationalAlarmsBarChart.drawChart);
    }
  },
  drawChart: function drawChart() {
    var data, backgroundColor, alarmsToDisplay, options, operationalAlarmsBarChart, chart;
    return regeneratorRuntime.async(function drawChart$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            data = new google.visualization.DataTable(); // Define columns for alarm types and values

            data.addColumn('string', 'Alarm Type');
            data.addColumn('number', 'Count');
            data.addColumn({
              type: 'string',
              role: 'style'
            });
            _context6.next = 6;
            return regeneratorRuntime.awrap(getChartBackgroundColor());

          case 6:
            backgroundColor = _context6.sent;
            // Filter the AlarmsValues to include only the two desired alarm types
            alarmsToDisplay = ['SUDDEN_LOSS', 'DELIVERY_RECONCILIATION'];
            alarmsToDisplay.forEach(function (alarmType) {
              // Retrieve the values, colors, and labels from AlarmsValues
              var alarmValue = AlarmsValues[alarmType].value || 0; // Fallback to 0 if undefined

              var alarmColor = AlarmsValues[alarmType].color || '#000000'; // Default color if undefined

              var displayLabel = AlarmLabelMap[alarmType] || alarmType; // Map technical label to user-friendly label

              data.addRow([displayLabel, alarmValue, "color: ".concat(alarmColor)]);
            }); // Chart options

            options = {
              title: '',
              chartArea: {
                width: '70%',
                height: '50%'
              },
              legend: 'none',
              backgroundColor: backgroundColor,
              hAxis: {
                title: ''
              },
              vAxis: {
                title: '',
                minValue: 0
              }
            }; // Draw the chart

            operationalAlarmsBarChart = document.getElementById('operationalAlarmsChart');
            chart = new google.visualization.BarChart(operationalAlarmsBarChart);
            chart.draw(data, options); // Create legend for the chart using the shared object

            OperationalAlarmsBarChart.createLegend(operationalAlarmsBarChart);

          case 14:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  // Create custom legend with colors and labels for specific alarms
  createLegend: function createLegend(wrapper) {
    var alarmsToDisplay = ['SUDDEN_LOSS', 'DELIVERY_RECONCILIATION'];
    var legendData = alarmsToDisplay.map(function (alarmType) {
      return {
        label: alarmType,
        color: AlarmsValues[alarmType].color
      };
    });
    var legendContainer = wrapper.parentNode.querySelector('.chart-legend');
    legendContainer.innerHTML = ''; // Clear existing legend

    legendData.forEach(function (item) {
      var legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
      legendItem.innerHTML = "\n                <span class=\"legend-color\" style=\"background-color: ".concat(item.color, ";\"></span>\n                <span class=\"legend-label\">").concat(AlarmLabelMap[item.label] || item.label, "</span>\n            ");
      legendContainer.appendChild(legendItem);
    });
  }
};
var OperationalAlarmsDonutChart = {
  init: function init() {
    var operationalAlarmsChart = document.getElementById('operationalDonutChart');

    if (operationalAlarmsChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(OperationalAlarmsDonutChart.drawChart);
    }
  },
  drawChart: function drawChart() {
    var data, backgroundColor, alarmsToDisplay, options, operationalAlarmsChart, chart;
    return regeneratorRuntime.async(function drawChart$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            data = new google.visualization.DataTable(); // Define columns for alarm types and values

            data.addColumn('string', 'Alarm Type');
            data.addColumn('number', 'Count');
            _context7.next = 5;
            return regeneratorRuntime.awrap(getChartBackgroundColor());

          case 5:
            backgroundColor = _context7.sent;
            // Use only the two specific alarms (SUDDEN_LOSS and DELIVERY_RECONCILIATION)
            alarmsToDisplay = ['SUDDEN_LOSS', 'DELIVERY_RECONCILIATION'];
            alarmsToDisplay.forEach(function (alarmType) {
              var displayLabel = AlarmLabelMap[alarmType] || alarmType; // Map technical label to user-friendly label

              data.addRow([displayLabel, AlarmsValues[alarmType].value]);
            }); // Chart options for donut chart

            options = {
              title: '',
              pieHole: 0,
              // To make it a donut chart
              chartArea: {
                width: '65%',
                height: '65%'
              },
              colors: alarmsToDisplay.map(function (alarmType) {
                return AlarmsValues[alarmType].color;
              }),
              legend: 'none',
              backgroundColor: backgroundColor,
              pieSliceText: 'percentage',
              // Show percentage on the slices
              pieSliceTextStyle: {
                color: '#fff'
              },
              slices: {
                offset: 0.07
              }
            }; // Draw the chart

            operationalAlarmsChart = document.getElementById('operationalDonutChart');
            chart = new google.visualization.PieChart(operationalAlarmsChart);
            chart.draw(data, options); // Create the custom legend

            OperationalAlarmsDonutChart.createLegend(operationalAlarmsChart);

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    });
  },
  // Create custom legend with colors and labels
  createLegend: function createLegend(wrapper) {
    // Use only the two specific alarms (SUDDEN_LOSS and DELIVERY_RECONCILIATION)
    var alarmsToDisplay = ['SUDDEN_LOSS', 'DELIVERY_RECONCILIATION'];
    var legendData = alarmsToDisplay.map(function (alarmType) {
      return {
        label: alarmType,
        color: AlarmsValues[alarmType].color
      };
    });
    var legendContainer = wrapper.parentNode.querySelector('.chart-legend');
    legendContainer.innerHTML = ''; // Clear existing legend

    legendData.forEach(function (item) {
      var legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
      legendItem.innerHTML = "\n          <span class=\"legend-color\" style=\"background-color: ".concat(item.color, ";\"></span>\n          <span class=\"legend-label\">").concat(AlarmLabelMap[item.label] || item.label, "</span>\n        ");
      legendContainer.appendChild(legendItem);
    });
  }
};
var DownloadChart = {
  init: function init() {
    // Select all download buttons and loop through them
    var downloadButtons = document.querySelectorAll('[data-popover-target="#download-chart"]');

    if (downloadButtons) {
      downloadButtons.forEach(function (button) {
        button.addEventListener('click', DownloadChart.openPopover);
      }); // Select and set up event listeners for download options

      var downloadImageButton = document.getElementById('download-image');
      var downloadPDFButton = document.getElementById('download-pdf');

      if (downloadImageButton) {
        downloadImageButton.addEventListener('click', function () {
          return DownloadChart.download('image');
        });
      }

      if (downloadPDFButton) {
        downloadPDFButton.addEventListener('click', function () {
          return DownloadChart.download('pdf');
        });
      }
    }
  },
  openPopover: function openPopover(e) {
    var chartsWrapper = e.currentTarget.closest('.gts-charts');
    var chartArea = chartsWrapper.querySelector('.chart-area:not(.hide)'); // Find visible chart area

    if (chartArea) {
      var chartId = chartArea.id;
      var popover = document.querySelector('#download-chart'); // Assuming you have a popover with this ID

      popover.setAttribute('data-download-target', "#".concat(chartId)); // Set data attribute with chart ID
      // Open the popover

      var popoverBody = popover.querySelector('.popover-body');
      popover.style.display = 'block'; // Set position and width (using your existing popover functions)

      Popover.setWidth(e.currentTarget, popoverBody);
      Popover.setPosition(e.currentTarget, popoverBody);
    }
  },
  download: function download(type) {
    var popover = document.querySelector('#download-chart');
    var chartId = popover.getAttribute('data-download-target').slice(1);
    var chartsWrapper = document.querySelector(popover.getAttribute('data-download-target')).closest('.gts-charts');
    var chartElement = document.getElementById(chartId);
    var legendArea = chartsWrapper.querySelector('.chart-legend');

    if (type === 'image') {
      DownloadChart.downloadImage(chartsWrapper);
    } else if (type === 'pdf') {
      DownloadChart.downloadPDF(chartsWrapper);
    }
  },
  downloadImage: function downloadImage(chartsWrapper) {
    // Use html2canvas or similar library to convert the chart to an image
    var excludeElement = chartsWrapper.querySelector('.gts-card-title');
    var chartTitle = excludeElement.querySelector('h3').textContent.trim();
    html2canvas(chartsWrapper, {
      ignoreElements: function ignoreElements(element) {
        return element === excludeElement; // Exclude the specified element
      }
    }).then(function (canvas) {
      var link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      var currentDate = new Date();
      var formattedDate = "".concat(currentDate.getFullYear(), "-").concat(String(currentDate.getMonth() + 1).padStart(2, '0'), "-").concat(String(currentDate.getDate()).padStart(2, '0'));
      var imageFileName = "".concat(chartTitle.replace(/\s+/g, '_'), "_").concat(formattedDate, ".png");
      link.download = imageFileName; // Set the download file name

      link.click();
    });
  },
  downloadPDF: function downloadPDF(chartsWrapper) {
    // Use jsPDF or similar library to convert the chart to a PDF
    var excludeElement = chartsWrapper.querySelector('.gts-card-title');
    var chartTitle = excludeElement.querySelector('h3').textContent.trim();
    html2canvas(chartsWrapper, {
      ignoreElements: function ignoreElements(element) {
        return element === excludeElement; // Exclude the specified element
      }
    }).then(function (canvas) {
      var imgData = canvas.toDataURL('image/png'); // Create a new jsPDF instance

      window.jsPDF = window.jspdf.jsPDF;
      var pdf = new jsPDF(); // Add the image to the PDF

      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Adjust width and height as needed

      var currentDate = new Date();
      var formattedDate = "".concat(currentDate.getFullYear(), "-").concat(String(currentDate.getMonth() + 1).padStart(2, '0'), "-").concat(String(currentDate.getDate()).padStart(2, '0'));
      var imageFileName = "".concat(chartTitle.replace(/\s+/g, '_'), "_").concat(formattedDate, ".pdf"); // Save the PDF

      pdf.save(imageFileName);
    });
  }
};
var ToggleAlarmsCharts = {
  init: function init() {
    var _this = this;

    // Attach event listeners to all toggle buttons
    var toggleChartNodes = document.querySelectorAll('.toggle-chart-btn');

    if (toggleChartNodes.length) {
      toggleChartNodes.forEach(function (button) {
        button.addEventListener('click', function () {
          return _this.toggleCharts(button);
        });
      });
    }
  },
  toggleCharts: function toggleCharts(button) {
    // Identify the chartsWrapper based on the button clicked
    var chartsWrapper = button.closest('.gts-charts');
    if (!chartsWrapper) return; // Exit if no parent found
    // Get the button ID to determine the context (system or operational)

    var buttonId = button.id;
    var iconTitle = chartsWrapper.querySelector('.gts-card-title-wrapper .mat-icon');
    var iconButton = button.querySelector('.mat-icon'); // Define the icon and chart elements based on the button ID

    var chart, donutChart, chartIcon, donutIcon;

    if (buttonId === 'toggle-system') {
      // Icons for system alarms chart
      chartIcon = 'grouped_bar_chart';
      donutIcon = 'pie_chart';
      chart = chartsWrapper.querySelector('#systemAlarmsChart');
      donutChart = chartsWrapper.querySelector('#systemAlarmsDonutChart');
    } else if (buttonId === 'toggle-operational') {
      // Icons for operational alarms chart
      chartIcon = 'bar_chart';
      donutIcon = 'pie_chart';
      chart = chartsWrapper.querySelector('#operationalAlarmsChart');
      donutChart = chartsWrapper.querySelector('#operationalDonutChart');
    } else {
      return; // Exit if no valid button ID is found
    } // Determine which chart is currently displayed


    var isChartHidden = chart.classList.contains('hide');

    if (isChartHidden) {
      // Switch to the Bar chart
      iconTitle.innerHTML = chartIcon; // Change the icon in the title to bar chart

      iconButton.innerHTML = donutIcon; // Change the button icon to pie chart (for next toggle)
      // Hide the donut chart and show the bar chart

      donutChart.classList.add('hide');
      donutChart.innerHTML = '';
      chart.classList.remove('hide'); // Only initialize the Bar chart if it's being displayed for the first time

      if (buttonId === 'toggle-system') {
        SystemAlarmsChart.init();
      } else {
        OperationalAlarmsBarChart.init();
      }
    } else {
      // Switch to the Donut chart
      iconTitle.innerHTML = donutIcon; // Change the icon in the title to pie chart

      iconButton.innerHTML = chartIcon; // Change the button icon to bar chart (for next toggle)
      // Hide the bar chart and show the donut chart

      chart.classList.add('hide');
      chart.innerHTML = '';
      donutChart.classList.remove('hide'); // Only initialize the Donut chart if it's being displayed for the first time

      if (buttonId === 'toggle-system') {
        SystemAlarmsDonutChart.init();
      } else {
        OperationalAlarmsDonutChart.init();
      }
    }
  }
};
var TankVolumeBarChart = {
  init: function init() {
    var tankVolumeChart = document.getElementById('tankVolumeChart');

    if (tankVolumeChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(TankVolumeBarChart.fetchTankData);
    }
  },
  fetchTankData: function fetchTankData(siteName) {
    // Fetch the tank data from the JSON file
    fetch('../../data/sites.json').then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    }).then(function (data) {
      // Find the site data based on the passed siteName
      var siteData = data.sites.find(function (site) {
        return site.siteName === siteName;
      });

      if (siteData) {
        // Draw the chart using the tanks data for the selected site
        TankVolumeBarChart.drawChart(siteData.tanks);
        PercentagePieChart.init(siteData);
      } else {
        console.warn('Site not found');
      }
    })["catch"](function (error) {
      console.error('Error fetching tank data:', error);
    });
  },
  drawChart: function drawChart(tanks) {
    var data, backgroundColor, options, tankVolumeChart, chart;
    return regeneratorRuntime.async(function drawChart$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            data = new google.visualization.DataTable();
            data.addColumn('string', 'Tank Type');
            data.addColumn('number', 'Count');
            data.addColumn({
              type: 'string',
              role: 'style'
            });
            _context8.next = 6;
            return regeneratorRuntime.awrap(getChartBackgroundColor());

          case 6:
            backgroundColor = _context8.sent;
            // Populate the data table with tank information
            tanks.forEach(function (tank) {
              data.addRow([tank.product, tank.value, 'color: #3B76FD']); // You can adjust the color as needed
            });
            options = {
              title: '',
              chartArea: {
                width: '70%',
                height: '70%'
              },
              backgroundColor: backgroundColor,
              hAxis: {
                title: ''
              },
              vAxis: {
                title: '',
                minValue: 0
              },
              legend: 'none'
            }; // Draw the chart

            tankVolumeChart = document.getElementById('tankVolumeChart');
            chart = new google.visualization.ColumnChart(tankVolumeChart);
            chart.draw(data, options);

          case 12:
          case "end":
            return _context8.stop();
        }
      }
    });
  }
};
var DeliveryBarChart = {
  init: function init() {
    var deliveryVolumeChart = document.getElementById('deliveryVolumeChart');

    if (deliveryVolumeChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(DeliveryBarChart.fetchDeliveryData);
    }
  },
  fetchDeliveryData: function fetchDeliveryData(siteName) {
    // Fetch the tank data from the JSON file
    fetch('../../data/sites.json').then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    }).then(function (data) {
      // Find the site data based on the passed siteName
      var siteData = data.sites.find(function (site) {
        return site.siteName === siteName;
      });

      if (siteData) {
        // Draw the chart using the tanks data for the selected site
        DeliveryBarChart.drawChart(siteData.tanks);
      } else {
        console.warn('Site not found');
      }
    })["catch"](function (error) {
      console.error('Error fetching tank data:', error);
    });
  },
  drawChart: function drawChart(tanks) {
    var data, backgroundColor, options, deliveryVolumeChart, chart;
    return regeneratorRuntime.async(function drawChart$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            data = new google.visualization.DataTable();
            data.addColumn('string', 'Tank Type');
            data.addColumn('number', 'Count');
            data.addColumn({
              type: 'string',
              role: 'style'
            });
            _context9.next = 6;
            return regeneratorRuntime.awrap(getChartBackgroundColor());

          case 6:
            backgroundColor = _context9.sent;
            // Populate the data table with tank information
            tanks.forEach(function (tank) {
              data.addRow([tank.product, tank.value, 'color: #3B76FD']); // You can adjust the color as needed
            });
            options = {
              title: '',
              chartArea: {
                width: '70%',
                height: '80%'
              },
              backgroundColor: backgroundColor,
              hAxis: {
                title: ''
              },
              vAxis: {
                title: '',
                minValue: 0
              },
              legend: 'none'
            }; // Draw the chart

            deliveryVolumeChart = document.getElementById('deliveryVolumeChart');
            chart = new google.visualization.ColumnChart(deliveryVolumeChart);
            chart.draw(data, options);

          case 12:
          case "end":
            return _context9.stop();
        }
      }
    });
  }
};
var PercentagePieChart = {
  init: function init(siteData) {
    var siteName = siteData.siteName;
    document.querySelector('#threshold').textContent = predefinedPercentage + '%';
    PercentagePieChart.fetchTankData(siteName, predefinedPercentage, siteData.tanks);
  },
  fetchTankData: function fetchTankData(siteName, predefinedPercentage, tanksData) {
    // const selectedSite = data.sites.find(site => site.siteName === siteName);
    if (siteName) {
      var _PercentagePieChart$g = PercentagePieChart.getAboveBelowCounts(predefinedPercentage, tanksData),
          aboveCount = _PercentagePieChart$g.aboveCount,
          belowCount = _PercentagePieChart$g.belowCount;

      var pieChartData = [{
        label: "Above 50%",
        value: aboveCount
      }, {
        label: "Below 50%",
        value: belowCount
      }];
      PercentagePieChart.renderChart(pieChartData);
    } else {
      console.log("Site not found.");
    }
  },
  getAboveBelowCounts: function getAboveBelowCounts(predefinedPercentage, tanksData) {
    var aboveCount = 0;
    var belowCount = 0;
    tanksData.forEach(function (tank) {
      var percentageChange = PercentagePieChart.calculatePercentageChange(tank.value, tank.oldValue);

      if (percentageChange >= predefinedPercentage) {
        aboveCount++;
      } else {
        belowCount++;
      }
    });
    return {
      aboveCount: aboveCount,
      belowCount: belowCount
    };
  },
  calculatePercentageChange: function calculatePercentageChange(current, old) {
    if (old === 0) return 0;
    return (current - old) / old * 100;
  },
  renderChart: function renderChart(pieChartData) {
    var tankPercentageChart, chart, windowWidth, backgroundColor, dataTable, options;
    return regeneratorRuntime.async(function renderChart$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            tankPercentageChart = document.getElementById('tankPercentageChart');
            chart = new google.visualization.PieChart(tankPercentageChart);
            windowWidth = window.innerWidth;
            _context10.next = 5;
            return regeneratorRuntime.awrap(getChartBackgroundColor());

          case 5:
            backgroundColor = _context10.sent;
            // Convert `pieChartData` to Google Charts DataTable format
            dataTable = new google.visualization.DataTable();
            dataTable.addColumn('string', 'Category');
            dataTable.addColumn('number', 'Count'); // Add rows to the DataTable

            pieChartData.forEach(function (item) {
              dataTable.addRow([item.label, item.value]);
            }); // Set chart options

            options = {
              title: '',
              is3D: false,
              backgroundColor: backgroundColor,
              slices: {
                0: {
                  offset: 0.07,
                  textStyle: {
                    color: backgroundColor
                  },
                  color: '#9C9B9B',
                  borderColor: backgroundColor,
                  borderWidth: 0
                },
                1: {
                  offset: 0.07,
                  textStyle: {
                    color: backgroundColor
                  },
                  color: '#3B76FC',
                  borderColor: backgroundColor,
                  borderWidth: 0
                }
              },
              chartArea: {
                width: windowWidth < 769 ? '90%' : '80%',
                height: windowWidth < 769 ? '90%' : '80%'
              },
              pieSliceText: 'percentage',
              legend: {
                position: 'none'
              }
            }; // Draw the chart with the DataTable

            chart.draw(dataTable, options);

          case 12:
          case "end":
            return _context10.stop();
        }
      }
    });
  }
}; // **** Demo Fetch Sites Into Page **** //

var PopulateSiteLists = {
  // Initialization function to fetch data and populate lists
  init: function init() {
    var siteData;
    return regeneratorRuntime.async(function init$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return regeneratorRuntime.awrap(this.fetchSiteData());

          case 3:
            siteData = _context11.sent;
            this.populateLists(siteData);
            this.addEventListeners();
            _context11.next = 11;
            break;

          case 8:
            _context11.prev = 8;
            _context11.t0 = _context11["catch"](0);
            console.error("Error loading site data:", _context11.t0);

          case 11:
          case "end":
            return _context11.stop();
        }
      }
    }, null, this, [[0, 8]]);
  },
  // Fetch site data from the JSON file
  fetchSiteData: function fetchSiteData() {
    var response;
    return regeneratorRuntime.async(function fetchSiteData$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return regeneratorRuntime.awrap(fetch('../../data/sites.json'));

          case 2:
            response = _context12.sent;

            if (response.ok) {
              _context12.next = 5;
              break;
            }

            throw new Error('Failed to fetch site data');

          case 5:
            _context12.next = 7;
            return regeneratorRuntime.awrap(response.json());

          case 7:
            return _context12.abrupt("return", _context12.sent);

          case 8:
          case "end":
            return _context12.stop();
        }
      }
    });
  },
  // Populate the sites lists with fetched data
  populateLists: function populateLists(siteData) {
    var tanksListContainer = document.querySelector('#tanks-sites-list .sites-list ul');
    var deliveryListContainer = document.querySelector('#delivery-sites-list .sites-list ul'); // Helper function to create site list items

    var createSiteListItem = function createSiteListItem(site, index, target) {
      var listItem = document.createElement('li');
      var siteName = document.createElement('span');
      siteName.classList.add('site-name');
      siteName.textContent = site.siteName;
      var tankCount = document.createElement('span');
      tankCount.classList.add('tanks-length');
      tankCount.textContent = site.tanks.length;
      listItem.appendChild(siteName);
      listItem.appendChild(tankCount);

      if (index === 0) {
        listItem.classList.add('selected');
        var tankSiteName = listItem.querySelector('.site-name').textContent.trim();
        var tankSiteLength = listItem.querySelector('.tanks-length').textContent.trim();
        var tankSiteNameButton = document.querySelector('[data-popover-target="#tanks-sites-list-target"]');
        tankSiteNameButton.querySelector('.selected-site .site-name').textContent = tankSiteName;
        tankSiteNameButton.querySelector('.selected-site .site-tanks').textContent = tankSiteLength;
        TankVolumeBarChart.fetchTankData(tankSiteName);
        var deliverySiteName = listItem.querySelector('.site-name').textContent.trim();
        var deliverySiteLength = listItem.querySelector('.tanks-length').textContent.trim();
        var deliverySiteNameButton = document.querySelector('[data-popover-target="#delivery-sites-list-target"]');
        deliverySiteNameButton.querySelector('.selected-site .site-name').textContent = deliverySiteName;
        deliverySiteNameButton.querySelector('.selected-site .site-tanks').textContent = deliverySiteLength;
        DeliveryBarChart.fetchDeliveryData(deliverySiteName);
      }

      return listItem;
    }; // Populate both site lists with siteData


    siteData.sites.forEach(function (site, index, target) {
      // Check if there's enough storage before adding new items
      try {
        tanksListContainer.appendChild(createSiteListItem(site, index, 'tanks'));
        deliveryListContainer.appendChild(createSiteListItem(site, index, 'delivery'));
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          console.error('Storage limit exceeded. Consider clearing unused data.'); // Implement cleanup or notify user here
        }
      }
    });
  },
  // Add event listeners for filtering
  addEventListeners: function addEventListeners() {
    var _this2 = this;

    var tanksFilterInput = document.querySelector('#tanks-sites-list .site-filter input');
    var deliveryFilterInput = document.querySelector('#delivery-sites-list .site-filter input');
    var tanksListContainer = document.querySelector('#tanks-sites-list .sites-list ul');
    var deliveryListContainer = document.querySelector('#delivery-sites-list .sites-list ul'); // Add input event listener to each filter input

    tanksFilterInput.addEventListener('input', function () {
      return _this2.filterSites(tanksFilterInput, tanksListContainer);
    });
    deliveryFilterInput.addEventListener('input', function () {
      return _this2.filterSites(deliveryFilterInput, deliveryListContainer);
    });
    var tankListItems = document.querySelectorAll('#tanks-sites-list .sites-list li');
    tankListItems.forEach(function (item) {
      item.addEventListener('click', function () {
        // Remove 'selected' class from all items
        tankListItems.forEach(function (i) {
          return i.classList.remove('selected');
        }); // Add 'selected' class to the clicked item

        this.classList.add('selected'); // Get the site name from the clicked item

        var tankSiteName = this.querySelector('.site-name').textContent.trim(); // Get the site name

        var tankSiteLength = this.querySelector('.tanks-length').textContent.trim();
        var tankSiteNameButton = document.querySelector('[data-popover-target="#tanks-sites-list-target"]');
        tankSiteNameButton.querySelector('.selected-site .site-name').textContent = tankSiteName;
        tankSiteNameButton.querySelector('.selected-site .site-tanks').textContent = tankSiteLength;
        var popoverWrapper = this.closest(".popover-wrapper");
        Popover.handleClose(popoverWrapper); // Call fetchTankData to update the chart based on the selected site

        TankVolumeBarChart.fetchTankData(tankSiteName);
      });
    });
    var deliveryListItems = document.querySelectorAll('#delivery-sites-list .sites-list li');
    deliveryListItems.forEach(function (item) {
      item.addEventListener('click', function () {
        // Remove 'selected' class from all items
        deliveryListItems.forEach(function (i) {
          return i.classList.remove('selected');
        }); // Add 'selected' class to the clicked item

        this.classList.add('selected'); // Get the site name from the clicked item

        var deliverySiteName = this.querySelector('.site-name').textContent.trim();
        var deliverySiteLength = this.querySelector('.tanks-length').textContent.trim();
        var deliverySiteNameButton = document.querySelector('[data-popover-target="#delivery-sites-list-target"]');
        deliverySiteNameButton.querySelector('.selected-site .site-name').textContent = deliverySiteName;
        deliverySiteNameButton.querySelector('.selected-site .site-tanks').textContent = deliverySiteLength;
        var popoverWrapper = this.closest(".popover-wrapper");
        Popover.handleClose(popoverWrapper); // Call fetchDeliveryData to update the chart based on the selected site

        DeliveryBarChart.fetchDeliveryData(deliverySiteName);
      });
    });
  },
  // Filter function for site lists
  filterSites: function filterSites(input, container) {
    var filterValue = input.value.toLowerCase();
    var listItems = container.querySelectorAll('li');
    listItems.forEach(function (item) {
      // Get the site name by excluding .tanks-length content
      var siteName = item.childNodes[0].textContent.toLowerCase().trim();
      item.style.display = siteName.includes(filterValue) ? '' : 'none';
    });
  }
}; // **** End Demo Fetch Sites Into Page **** //
// We will Reload Charts on Menu Collapsed

var ReloadCharts = {
  // Initialize the menu toggle functionality
  init: function init() {
    // Attach the click event listener to #toggle-menu
    document.getElementById('toggle-menu').addEventListener('click', ReloadCharts.chartReload); // Attach the event listener to appearnce toggle

    var appearanceWrapper = document.querySelector('#appearance-wrapper');

    if (appearanceWrapper) {
      var appearanceItems = appearanceWrapper.querySelectorAll('label');
      appearanceItems.forEach(function (item) {
        item.addEventListener('click', ReloadCharts.chartReload);
      });
    }
  },
  chartReload: function chartReload() {
    // Step 1: Check if the .gts-charts element exists
    if (document.querySelector('.gts-charts')) {
      // Step 2: Kill current charts by clearing their containers
      var chartContainers = document.querySelectorAll('.gts-charts .chart-area');
      var chartLegend = document.querySelectorAll('.gts-charts .chart-legend'); // Assuming each chart has a wrapper

      chartContainers.forEach(function (container) {
        container.innerHTML = ''; // Clear the chart container
      });
      chartLegend.forEach(function (container) {
        container.innerHTML = ''; // Clear the chart container
      }); // Optional: If your charts have specific cleanup logic, call that here
      // Example: GasolineUsagePieChart.clear(); or similar if implemented
      // Step 3: Reload the charts

      setTimeout(function () {
        RunCharts.init();
        var systemAlarmsChart = document.getElementById('systemAlarmsDonutChart');

        if (!systemAlarmsChart.classList.contains('hide')) {
          SystemAlarmsDonutChart.init();
        }

        var operationalAlarmsChart = document.getElementById('operationalDonutChart');

        if (!operationalAlarmsChart.classList.contains('hide')) {
          OperationalAlarmsDonutChart.init();
        }

        var selectedTankSiteElement = document.querySelector('#tanks-sites-list .sites-list li.selected');

        if (selectedTankSiteElement) {
          var siteName = selectedTankSiteElement.querySelector('.site-name').textContent.trim();
          TankVolumeBarChart.fetchTankData(siteName);
          TankVolumeBarChart.fetchTankData(siteName);
        }

        var selectedDeliverySiteElement = document.querySelector('#delivery-sites-list .sites-list li.selected');

        if (selectedDeliverySiteElement) {
          var _siteName = selectedDeliverySiteElement.querySelector('.site-name').textContent.trim();

          DeliveryBarChart.fetchDeliveryData(_siteName);
        }
      }, 0);
    }
  }
};
var RunCharts = {
  init: function init() {
    GasolineUsagePieChart.init();
    FuelUsageAreaChart.init();
    SiteStatusChart.init();
    SystemAlarmsChart.init();
    OperationalAlarmsBarChart.init();
    TankVolumeBarChart.init();
  }
};
pageReady(function () {
  // Demo Function
  setTimeout(function () {
    PopulateSiteLists.init();
  }, 1000); // End Demo

  GetCurrentProductValue.init();
  FormatNumbers.init();
  TrendingUpdates.init();
  RunCharts.init();
  ReloadCharts.init();
  ToggleAlarmsCharts.init();
  DownloadChart.init();
});