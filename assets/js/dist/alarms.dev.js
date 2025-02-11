"use strict";

var _script = require("./script.js");

var _constant = require("./constant.js");

var _portal = require("./portal.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var FetchData = {
  init: function init() {
    var response;
    return regeneratorRuntime.async(function init$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.alarmData));

          case 2:
            response = _context.sent;

            if (!(!response || Object.keys(response).length === 0)) {
              _context.next = 6;
              break;
            }

            console.error("No response data available");
            return _context.abrupt("return");

          case 6:
            return _context.abrupt("return", response);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    });
  }
}; // Usage

var AlarmFilter = {
  state: {
    response: [],
    filterOptions: {},
    selectedFilters: {}
  },
  init: function init() {
    var dtFilterWrapper, response, filterOptions, dateKeys, selectedFilters;
    return regeneratorRuntime.async(function init$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            dtFilterWrapper = document.querySelector('#dtFilterWrapper');

            if (!dtFilterWrapper) {
              _context2.next = 14;
              break;
            }

            _context2.next = 4;
            return regeneratorRuntime.awrap(FetchData.init());

          case 4:
            response = _context2.sent;
            // Update state with alarms
            AlarmFilter.state.response = response; // Get all unique filter categories from the response

            filterOptions = {
              'Site Numbers': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.sitenumber;
                }))),
                originalKey: 'sitenumber'
              },
              'Sources': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.source;
                }))),
                originalKey: 'source'
              },
              'Alarm Type': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.type;
                }))),
                originalKey: 'type'
              },
              'Is Active': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.isactive;
                }))),
                originalKey: 'isactive'
              },
              'Severities': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.severity;
                }))),
                originalKey: 'severity'
              },
              'Devices': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.device;
                }))),
                originalKey: 'device'
              },
              'Date': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.time;
                }))),
                originalKey: 'time'
              }
            }; // Update state with filter options

            AlarmFilter.state.filterOptions = filterOptions;
            dateKeys = ['time']; // Initialize filters with the fetched alarm data

            _context2.next = 11;
            return regeneratorRuntime.awrap(_script.DatatableFilter.init(dtFilterWrapper, response, filterOptions, AlarmFilter, AlarmDT, dateKeys));

          case 11:
            selectedFilters = _context2.sent;
            // Update state with selected filters
            AlarmFilter.state.selectedFilters = selectedFilters;

            if (selectedFilters) {
              AlarmFilter.filterSubmit(selectedFilters); // Apply filters on load
            }

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  filterSubmit: function filterSubmit(filters) {
    var response, filteredAlarms;
    return regeneratorRuntime.async(function filterSubmit$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            response = AlarmFilter.state.response;
            _context3.next = 3;
            return regeneratorRuntime.awrap(AlarmFilter.applyFilters(filters, response));

          case 3:
            filteredAlarms = _context3.sent;
            // Update DataTable with filtered alarms
            AlarmDT.init(filteredAlarms);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  applyFilters: function applyFilters(filters, response) {
    var filteredAlarms = response; // Start with the full alarm list

    Object.entries(filters).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          values = _ref2[1];

      if (['time'].includes(key) && values.from && values.to) {
        // Filter by date range
        var from = new Date(values.from);
        var to = new Date(values.to);
        filteredAlarms = filteredAlarms.filter(function (res) {
          var responseDate = new Date(res[key]);
          return responseDate >= from && responseDate <= to;
        });
      } else {
        // Other filters (multi-select)
        filteredAlarms = filteredAlarms.filter(function (res) {
          return values.some(function (value) {
            return String(res[key]) === String(value);
          });
        });
      }
    });
    return filteredAlarms; // Return filtered alarms
  }
};
var AlarmDT = {
  // Initialize the Site DataTable
  init: function init(filteredAlarms) {
    var alarmDT, alarms, formattedData;
    return regeneratorRuntime.async(function init$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            alarmDT = document.querySelector("#alarmDT");

            if (!alarmDT) {
              _context4.next = 10;
              break;
            }

            if (filteredAlarms) {
              _context4.next = 8;
              break;
            }

            _context4.next = 5;
            return regeneratorRuntime.awrap(AlarmDT.fetchData());

          case 5:
            alarms = _context4.sent;
            _context4.next = 9;
            break;

          case 8:
            if (filteredAlarms.length) {
              alarmDT.innerHTML = '';
              alarms = filteredAlarms;
            } else {
              alarmDT.innerHTML = '';
              AlarmDT.emptyState(alarmDT);
            }

          case 9:
            if (alarms && alarms.length > 0) {
              formattedData = AlarmDT.transformData(alarms);

              _script.DataTable.init(".gts-dt-wrapper", {
                data: formattedData,
                columns: [{
                  title: "<span class=\"mat-icon material-symbols-sharp\">numbers</span>",
                  data: "id"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">location_on</span> Site Number",
                  data: "sitenumber"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">verified</span> Site Name",
                  data: "sitename"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">notifications_active</span> Type",
                  data: "type"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">personal_bag_question</span> Is Active",
                  data: "isactive"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">cloud</span> Source",
                  data: "source"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">schedule</span> Time",
                  data: "alarmtime",
                  width: "200px"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">notification_important</span> Severity",
                  data: "severity",
                  render: function render(data, type, row) {
                    return "<div class=\"status-dt\"><span class=\"severity ".concat(data.toLowerCase(), "\">").concat(data, "</span></div>");
                  }
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">local_gas_station</span> Device",
                  data: "device"
                }],
                responsive: true,
                paging: formattedData.length > 10,
                pageLength: 10
              }, [{
                width: "0px",
                targets: 0
              }, // Hide the first column (id)
              {
                width: "480px",
                targets: 6
              }, {
                width: "100px",
                targets: 7
              }], "Alarm data table");
            } else {
              console.error("No alarms data available");
            }

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  // Fetch data from the API
  fetchData: function fetchData() {
    var response, alarms;
    return regeneratorRuntime.async(function fetchData$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return regeneratorRuntime.awrap(FetchData.init());

          case 3:
            response = _context5.sent;
            _context5.next = 6;
            return regeneratorRuntime.awrap(_script.DataTable.fetchData(response));

          case 6:
            alarms = _context5.sent;
            return _context5.abrupt("return", alarms);

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](0);
            console.error("Error fetching AlarmDT data:", _context5.t0);
            return _context5.abrupt("return", []);

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },
  // Transform the raw API data for the DataTable
  transformData: function transformData(data) {
    return data.map(function (alarm) {
      return {
        id: alarm.id,
        sitename: alarm.sitename,
        sitenumber: alarm.sitenumber,
        type: alarm.type,
        isactive: alarm.isactive,
        source: alarm.source,
        alarmtime: alarm.time,
        severity: alarm.severity,
        device: alarm.device
      };
    });
  },
  emptyState: function emptyState(wrapper) {
    // Check if the empty state message already exists
    if (!wrapper.querySelector(".emptyState")) {
      var emptyStateDiv = document.createElement("div");
      emptyStateDiv.className = "emptyState"; // Create the heading (h3)

      var heading = document.createElement("h3");
      heading.textContent = "No Results Found"; // Create the brief (p)

      var brief = document.createElement("p");
      brief.textContent = "We couldn't find any matches. Adjust your search and try again."; // Append heading and brief to the empty state div

      emptyStateDiv.appendChild(heading);
      emptyStateDiv.appendChild(brief); // Insert the empty state div after the site list container

      wrapper.appendChild(emptyStateDiv);
    }
  }
};
var AlarmSeverity = {
  init: function init() {
    var alarmTrendChart = document.querySelector('#alarmTrendChart');

    if (alarmTrendChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(AlarmSeverity.fetchData);
    }
  },
  fetchData: function fetchData() {
    var alarms;
    return regeneratorRuntime.async(function fetchData$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.alarmData));

          case 2:
            alarms = _context6.sent;

            if (!(!alarms || Object.keys(alarms).length === 0)) {
              _context6.next = 6;
              break;
            }

            console.error("No alarms data available");
            return _context6.abrupt("return");

          case 6:
            google.charts.load('current', {
              packages: ['corechart']
            });
            google.charts.setOnLoadCallback(function () {
              return AlarmSeverity.drawChart(alarms);
            });

          case 8:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  drawChart: function drawChart(alarms) {
    var _ref3, backgroundColor, txtColor, data, severityColors, severityCounts, chartRows, options, chart;

    return regeneratorRuntime.async(function drawChart$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref3 = _context7.sent;
            backgroundColor = _ref3.backgroundColor;
            txtColor = _ref3.txtColor;
            // Prepare the DataTable for Google Charts
            data = new google.visualization.DataTable(); // Add Columns

            data.addColumn('string', 'Severity'); // X-Axis: Severity types

            data.addColumn('number', 'Count'); // Y-Axis: Counts

            data.addColumn({
              type: 'string',
              role: 'style'
            }); // Style column for colors
            // Define severity levels and their corresponding colors

            severityColors = {
              Unknown: '#9c9b9b',
              Alarm: '#e61e45',
              Warning: '#FAB75C',
              Info: '#2753c4'
            }; // Count the occurrences of each severity type

            severityCounts = alarms.reduce(function (acc, alarm) {
              acc[alarm.severity] = (acc[alarm.severity] || 0) + 1;
              return acc;
            }, {}); // Convert the counts into rows for the DataTable, including color styles

            chartRows = Object.entries(severityCounts).map(function (_ref4) {
              var _ref5 = _slicedToArray(_ref4, 2),
                  severity = _ref5[0],
                  count = _ref5[1];

              return [severity, count, "color: ".concat(severityColors[severity] || '#000000') // Use the defined color or fallback to black
              ];
            });
            data.addRows(chartRows); // Chart Options

            options = {
              title: '',
              backgroundColor: backgroundColor,
              hAxis: {
                title: '',
                textStyle: {
                  color: txtColor
                }
              },
              vAxis: {
                title: '',
                textStyle: {
                  color: txtColor
                }
              },
              legend: {
                position: 'none'
              },
              chartArea: {
                width: '80%',
                height: '70%'
              },
              tooltip: {
                isHtml: true
              }
            }; // Draw the chart

            chart = new google.visualization.ColumnChart(document.getElementById('alarmTrendChart'));
            chart.draw(data, options);

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    });
  }
};
var ReloadAlarmsCharts = {
  // Initialize the menu toggle functionality
  init: function init() {
    // Attach the click event listener to #toggle-menu
    document.getElementById('toggle-menu').addEventListener('click', ReloadAlarmsCharts.chartReload);
  },
  chartReload: function chartReload() {
    // Step 1: Check if the .gts-charts element exists
    if (document.querySelector('.chart-area')) {
      // Step 2: Kill current charts by clearing their containers
      var chartContainers = document.querySelectorAll('.chart-area');
      var chartLegend = document.querySelectorAll('.chart-legend');

      if (chartContainers) {
        chartContainers.forEach(function (container) {
          container.innerHTML = ''; // Clear the chart container
        });
      }

      if (chartLegend) {
        chartLegend.forEach(function (container) {
          container.innerHTML = ''; // Clear the chart container
        });
      } // Step 3: Reload the charts


      setTimeout(function () {
        RunCharts.init();
        var alarmTrendChart = document.getElementById('alarmTrendChart');

        if (alarmTrendChart && !alarmTrendChart.classList.contains('hide')) {
          AlarmSeverity.init();
        }
      });
    }
  }
};
var RunCharts = {
  init: function init() {
    AlarmSeverity.init();
    ReloadAlarmsCharts.init();
  }
};

_portal.AppearanceToggle.registerCallback(function (mode) {
  ReloadAlarmsCharts.chartReload();
});

(0, _script.pageReady)(function () {
  AlarmDT.init();
  RunCharts.init();
  AlarmFilter.init();
});