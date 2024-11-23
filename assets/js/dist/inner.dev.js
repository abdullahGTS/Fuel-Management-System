"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReloadInnerCharts = void 0;

var _script = require("./script.js");

var _constant = require("./constant.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Common DataTable
var DataTable = {
  // Initialize the DataTable
  init: function init(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var tableTitle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Table";
    var tableWrapper = document.querySelector(selector);

    if (!tableWrapper) {
      console.error("No element found for selector: ".concat(selector));
      return;
    } // Create a table element dynamically if not already present


    var table = tableWrapper.querySelector("table");

    if (!table) {
      table = document.createElement("table");
      table.classList.add("gts-dt-table"); // Add a class for styling

      tableWrapper.innerHTML = ""; // Clear the wrapper content

      tableWrapper.appendChild(table);
    } // Initialize the DataTable


    $(table).DataTable(_objectSpread({}, options, {
      dom: "<'dt-header' <'dt-filter' <'col gts-dt-length'l><'col dt-gts-search'f>>>" + "<'dt-body'<'col'tr>>" + "<'dt-footer'<'col'i><'col gts-paging'p>>",
      language: {
        emptyTable: "No data available",
        lengthMenu: "\n                    <span class=\"mat-icon material-symbols-sharp\">arrow_drop_down</span>\n                    <select class=\"custom-length-menu\" id=\"dt-length-0\">\n                        <option value=\"10\">10</option>\n                        <option value=\"25\">25</option>\n                        <option value=\"50\">50</option>\n                        <option value=\"100\">100</option>\n                    </select>\n                ",
        search: "" // Remove default search label

      },
      initComplete: function initComplete() {
        // Add the custom table title
        var dtHeader = tableWrapper.querySelector(".dt-header");
        var titleDiv = document.createElement("div");
        titleDiv.className = "gts-db-title";
        titleDiv.innerHTML = "<h2>".concat(tableTitle, "</h2>");
        dtHeader.prepend(titleDiv); // Customize the search field

        var searchWrapper = tableWrapper.querySelector(".dt-gts-search");

        if (searchWrapper) {
          var input = searchWrapper.querySelector("input");

          if (input) {
            // Add a placeholder to the search input
            input.setAttribute("placeholder", "Search here...");
          } // Add Material Icon for search


          var searchIcon = document.createElement("span");
          searchIcon.className = "mat-icon material-symbols-sharp";
          searchIcon.textContent = "search";
          searchWrapper.prepend(searchIcon);
        } // Replace sorting icons with Material Icons


        var headers = table.querySelectorAll("th");
        headers.forEach(function (header) {
          var icon = document.createElement("span");
          icon.className = "mat-icon material-symbols-sharp sort-icon";
          icon.textContent = "expand_all";
          header.appendChild(icon);
        });
      }
    }));
  },
  // Fetch Data for the DataTable
  fetchData: function fetchData(url) {
    var response, data;
    return regeneratorRuntime.async(function fetchData$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(fetch(url));

          case 3:
            response = _context.sent;
            _context.next = 6;
            return regeneratorRuntime.awrap(response.json());

          case 6:
            data = _context.sent;
            return _context.abrupt("return", data);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            console.error("Error fetching data for DataTable:", _context.t0);
            return _context.abrupt("return", []);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 10]]);
  }
}; // Site Inner Page
// const SiteStatus = {
//     init: () => {
//         const siteStatusChart = document.querySelector('#siteStatusChart');
//         if (siteStatusChart) {
//             google.charts.load('current', { packages: ['corechart'] });
//             google.charts.setOnLoadCallback(SiteStatus.fetchData);
//         }
//     },
//     fetchData: async () => {
//         const sites = await fetchData(API_PATHS.sitesList);
//         if (!sites || sites.length === 0) {
//             console.error("No sites data available");
//             return;
//         }
//         // Update the chart with new data
//         google.charts.load('current', { packages: ['corechart'] });
//         google.charts.setOnLoadCallback(() => SiteStatus.drawChart(sites));
//     },
//     drawChart: async (sites) => {
//         const { backgroundColor } = await ChartBackgroundColor();
//         // Process data to calculate online/offline counts
//         const statusCounts = sites.reduce(
//             (acc, site) => {
//                 acc[site.status] = (acc[site.status] || 0) + 1;
//                 return acc;
//             },
//             { online: 0, offline: 0 }
//         );
//         const data = new google.visualization.DataTable();
//         data.addColumn('string', 'Status');
//         data.addColumn('number', 'Count');
//         data.addRows([
//             ['Online', statusCounts.online],
//             ['Offline', statusCounts.offline],
//         ]);
//         // Define slices for online and offline colors
//         const options = {
//             title: '',
//             tooltip: { isHtml: true },
//             backgroundColor: backgroundColor,
//             slices: {
//                 0: { offset: 0.04, color: SharedColors.Online },
//                 1: { offset: 0.04, color: SharedColors.Offline },
//             },
//             pieSliceBorderColor: backgroundColor,
//             chartArea: {
//                 width: window.innerWidth < 769 ? '80%' : '75%',
//                 height: window.innerWidth < 769 ? '80%' : '75%',
//             },
//             legend: { position: 'none' },
//         };
//         // Draw the chart
//         const siteStatusChartWrapper = document.getElementById('siteStatusChart');
//         const chart = new google.visualization.PieChart(siteStatusChartWrapper);
//         chart.draw(data, options);
//         // Create the custom legend
//         SiteStatus.createLegend(siteStatusChartWrapper, data, options);
//     },
//     createLegend: (wrapper, data, options) => {
//         const legendContainer = wrapper.parentNode.querySelector('.chart-legend');
//         legendContainer.innerHTML = ''; // Clear any existing legend items
//         // Loop through chart data to dynamically create legend items
//         for (let i = 0; i < data.getNumberOfRows(); i++) {
//             const label = data.getValue(i, 0);
//             const color = options.slices[i].color || '#000'; // Get color from slices
//             const legendItem = document.createElement('div');
//             legendItem.classList.add('legend-item');
//             legendItem.innerHTML = `
//                 <span class="legend-color" style="background-color: ${color};"></span>
//                 <span class="legend-label">${label}</span>
//             `;
//             legendContainer.appendChild(legendItem);
//         }
//     },
// };

var SiteStatus = {
  init: function init() {
    var onlineSitesValueInner = document.querySelector('#onlineSitesValueInner');
    var offlineSitesValueInner = document.querySelector('#offlineSitesValueInner');

    if (onlineSitesValueInner && offlineSitesValueInner) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(SiteStatus.fetchData);
    }
  },
  fetchData: function fetchData() {
    var sites, statusCounts;
    return regeneratorRuntime.async(function fetchData$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.sitesList));

          case 2:
            sites = _context2.sent;

            if (!(!sites || sites.length === 0)) {
              _context2.next = 6;
              break;
            }

            console.error("No sites data available");
            return _context2.abrupt("return");

          case 6:
            statusCounts = sites.reduce(function (acc, site) {
              acc[site.status] = (acc[site.status] || 0) + 1;
              return acc;
            }, {
              online: 0,
              offline: 0
            }); // Update the chart with new data

            google.charts.load('current', {
              packages: ['corechart']
            });
            google.charts.setOnLoadCallback(function () {
              return SiteStatus.drawCharts(sites, statusCounts);
            });
            document.getElementById('onlineSitesValueInner').textContent = statusCounts.online;
            document.getElementById('offlineSitesValueInner').textContent = statusCounts.offline;

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  drawCharts: function drawCharts(sites, statusCounts) {
    var _ref, secondaryBgColor, secondaryAlphaColor, onlineData, offlineData, options, onlineChartWrapper, onlineChart, offlineChartWrapper, offlineChart;

    return regeneratorRuntime.async(function drawCharts$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref = _context3.sent;
            secondaryBgColor = _ref.secondaryBgColor;
            secondaryAlphaColor = _ref.secondaryAlphaColor;
            // Data for the online donut chart
            onlineData = new google.visualization.DataTable();
            onlineData.addColumn('string', 'Status');
            onlineData.addColumn('number', 'Count');
            onlineData.addRows([['Online', statusCounts.online], ['Total Sites', statusCounts.online + statusCounts.offline]]); // Data for the offline donut chart

            offlineData = new google.visualization.DataTable();
            offlineData.addColumn('string', 'Status');
            offlineData.addColumn('number', 'Count');
            offlineData.addRows([['Offline', statusCounts.offline], ['Total Sites', statusCounts.online + statusCounts.offline]]); // Define options for donut charts

            options = {
              tooltip: {
                isHtml: true
              },
              backgroundColor: secondaryBgColor,
              pieSliceBorderColor: secondaryBgColor,
              pieSliceText: 'none',
              chartArea: {
                width: '80%',
                height: '80%'
              },
              pieHole: 0.65,
              pieStartAngle: 0,
              legend: {
                position: 'none'
              },
              slices: {
                0: {
                  offset: 0.1
                },
                1: {
                  color: secondaryAlphaColor
                }
              }
            }; // Draw the online donut chart

            onlineChartWrapper = document.getElementById('onlineSitesChartInner');
            onlineChart = new google.visualization.PieChart(onlineChartWrapper);
            options.slices[0].color = _constant.SharedColors.Online;
            onlineChart.draw(onlineData, options); // Draw the offline donut chart

            offlineChartWrapper = document.getElementById('offlineSitesChartInner');
            offlineChart = new google.visualization.PieChart(offlineChartWrapper);
            options.slices[0].color = _constant.SharedColors.Offline;
            offlineChart.draw(offlineData, options);

          case 22:
          case "end":
            return _context3.stop();
        }
      }
    });
  }
};
var SiteDT = {
  // Initialize the Site DataTable
  init: function init() {
    var siteDT, sites, formattedData;
    return regeneratorRuntime.async(function init$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            siteDT = document.querySelector("#siteDT");

            if (!siteDT) {
              _context4.next = 6;
              break;
            }

            _context4.next = 4;
            return regeneratorRuntime.awrap(SiteDT.fetchData());

          case 4:
            sites = _context4.sent;

            if (sites && sites.length > 0) {
              formattedData = SiteDT.transformData(sites);
              DataTable.init(".gts-dt-wrapper", {
                data: formattedData,
                columns: [{
                  title: "<span class=\"mat-icon material-symbols-sharp\">numbers</span> Site ID",
                  data: "id"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">location_on</span> Site Number",
                  data: "sitenumber"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">home</span> Site Name",
                  data: "name"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">access_time</span> Last Connection",
                  data: "lastconnection"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">cloud</span> Source",
                  data: "source"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">network_check</span> Status",
                  data: "status",
                  render: function render(data, type, row) {
                    // Add a span with a custom class for the status
                    var statusClass = data === "Online" ? "online" : "offline";
                    return "<span class=\"".concat(statusClass, "\">").concat(data, "</span>");
                  }
                }],
                responsive: true,
                paging: formattedData.length > 10,
                pageLength: 10
              }, "Sites data table");
            } else {
              console.error("No sites data available");
            }

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  // Fetch data from the API
  fetchData: function fetchData() {
    var sites;
    return regeneratorRuntime.async(function fetchData$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return regeneratorRuntime.awrap(DataTable.fetchData(_constant.API_PATHS.sitesDT));

          case 3:
            sites = _context5.sent;
            return _context5.abrupt("return", sites);

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            console.error("Error fetching SiteDT data:", _context5.t0);
            return _context5.abrupt("return", []);

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[0, 7]]);
  },
  // Transform the raw API data for the DataTable
  transformData: function transformData(data) {
    return data.map(function (site) {
      return {
        id: site.id,
        sitenumber: site.sitenumber,
        name: site.name,
        lastconnection: site.lastconnection,
        source: site.source,
        status: site.status === "offline" ? "Offline" : "Online"
      };
    });
  }
};
var SiteList = {
  init: function init() {
    var sites, totalSites, siteListWrapper, filterInput;
    return regeneratorRuntime.async(function init$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.sitesList));

          case 2:
            sites = _context6.sent;

            if (!(!sites || Object.keys(sites).length === 0)) {
              _context6.next = 6;
              break;
            }

            console.error("No sites data available");
            return _context6.abrupt("return");

          case 6:
            // Set total sites count
            totalSites = document.querySelector('#totalSites');
            if (totalSites) totalSites.textContent = Object.keys(sites).length; // Get the site list wrapper

            siteListWrapper = document.querySelector('#siteListWrapper');

            if (siteListWrapper) {
              // Store the original list of sites
              SiteList.sites = sites;
              SiteList.siteList(siteListWrapper, sites);
            } // Handle the filter input event


            filterInput = document.querySelector('.gts-filter input');

            if (filterInput) {
              filterInput.addEventListener('input', function () {
                var query = filterInput.value.toLowerCase();
                var filteredSites = SiteList.filterSites(query);
                SiteList.siteList(siteListWrapper, filteredSites);
              });
            }

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  // Filter sites based on the search query
  filterSites: function filterSites(query) {
    var sites = SiteList.sites;
    return sites.filter(function (site) {
      return site.name.toLowerCase().includes(query) || site.sitenumber.toString().includes(query);
    });
  },
  // Render the site list
  siteList: function siteList(wrapper, sites) {
    var siteListContainer = wrapper.querySelector('.sites-list ul');
    if (!siteListContainer) return; // Clear any existing site list content

    siteListContainer.innerHTML = ''; // Generate site list items

    sites.forEach(function (site) {
      var siteItem = document.createElement('li');
      siteItem.classList.add('site-item');
      var location = site.location; // Get the location from the site data

      siteItem.innerHTML = "\n                <div class=\"site-wrapper\">\n                    <div class=\"icon-wrapper ".concat(site.status.toLowerCase(), "\">\n                        <span class=\"mat-icon material-symbols-sharp\">location_on</span>\n                    </div>\n                    <div class=\"site-details\">\n                        <p>").concat(site.sitenumber, "</p>\n                        <h3>").concat(site.name, "</h3>\n                    </div>\n                    <div class=\"site-control\">\n                        <a role=\"button\" href=\"https://www.google.com/maps?q=").concat(location, "\" target=\"_blank\" class=\"btn\">\n                            Direction\n                        </a>\n                    </div>\n                </div>\n            ");
      siteListContainer.appendChild(siteItem);

      _script.Button.init();
    });
  }
};
var ReloadInnerCharts = {
  // Initialize the menu toggle functionality
  init: function init() {
    // Attach the click event listener to #toggle-menu
    document.getElementById('toggle-menu').addEventListener('click', ReloadInnerCharts.chartReload);
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
        var systemAlarmsChart = document.getElementById('systemAlarmsDonutChart');

        if (systemAlarmsChart && !systemAlarmsChart.classList.contains('hide')) {
          SystemAlarmsDonutChart.init();
        }

        var operationalAlarmsChart = document.getElementById('operationalDonutChart');

        if (operationalAlarmsChart && !operationalAlarmsChart.classList.contains('hide')) {
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
      });
    }
  }
};
exports.ReloadInnerCharts = ReloadInnerCharts;
var RunCharts = {
  init: function init() {
    SiteStatus.init();
    ReloadInnerCharts.init();
  }
};
(0, _script.pageReady)(function () {
  RunCharts.init();
  SiteList.init();
  SiteDT.init();
});