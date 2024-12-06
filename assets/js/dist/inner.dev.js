"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReloadInnerCharts = void 0;

var _script = require("./script.js");

var _constant = require("./constant.js");

//dashboard.js
// Site Inner Page
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
    return regeneratorRuntime.async(function fetchData$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.sitesData));

          case 2:
            sites = _context.sent;

            if (!(!sites || sites.length === 0)) {
              _context.next = 6;
              break;
            }

            console.error("No sites data available");
            return _context.abrupt("return");

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
            return _context.stop();
        }
      }
    });
  },
  drawCharts: function drawCharts(sites, statusCounts) {
    var _ref, backgroundColor, secondaryAlphaColor, onlineData, offlineData, options, onlineChartWrapper, onlineChart, offlineChartWrapper, offlineChart;

    return regeneratorRuntime.async(function drawCharts$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref = _context2.sent;
            backgroundColor = _ref.backgroundColor;
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
              backgroundColor: backgroundColor,
              pieSliceBorderColor: backgroundColor,
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
            return _context2.stop();
        }
      }
    });
  }
};
var SiteDT = {
  // Initialize the Site DataTable
  init: function init() {
    var siteDT, sites, formattedData;
    return regeneratorRuntime.async(function init$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            siteDT = document.querySelector("#siteDT");

            if (!siteDT) {
              _context3.next = 6;
              break;
            }

            _context3.next = 4;
            return regeneratorRuntime.awrap(SiteDT.fetchData());

          case 4:
            sites = _context3.sent;

            if (sites && sites.length > 0) {
              formattedData = SiteDT.transformData(sites);

              _script.DataTable.init(".gts-dt-wrapper", {
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
                    return "<div class=\"status-dt\"><span class=\"".concat(statusClass, "\">").concat(data, "</span></div>");
                  }
                }, {
                  title: "",
                  // No title for the last column
                  data: "details"
                }],
                responsive: true,
                paging: formattedData.length > 10,
                pageLength: 10
              }, [{
                targets: -1,
                // Target the last column
                orderable: false,
                // Disable sorting
                responsivePriority: 1,
                // Ensure it's always visible
                render: function render(data, type, row) {
                  return "<button class=\"btn btn-icon view-more\"><span class=\"mat-icon material-symbols-sharp\">visibility</span></button>";
                }
              }], "Sites data table");
            } else {
              console.error("No sites data available");
            }

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  // Fetch data from the API
  fetchData: function fetchData() {
    var sites;
    return regeneratorRuntime.async(function fetchData$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return regeneratorRuntime.awrap(_script.DataTable.fetchData(_constant.API_PATHS.sitesData));

          case 3:
            sites = _context4.sent;
            return _context4.abrupt("return", sites);

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            console.error("Error fetching SiteDT data:", _context4.t0);
            return _context4.abrupt("return", []);

          case 11:
          case "end":
            return _context4.stop();
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
        status: site.status === "offline" ? "Offline" : "Online",
        details: ''
      };
    });
  }
};
var SiteList = {
  init: function init() {
    var wrapper, sites, totalSites, siteListWrapper, filterInput;
    return regeneratorRuntime.async(function init$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            wrapper = document.querySelector("#siteListWrapper");
            _context5.next = 3;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.sitesData));

          case 3:
            sites = _context5.sent;

            if (!(!sites || Object.keys(sites).length === 0)) {
              _context5.next = 8;
              break;
            }

            console.error("No sites data available");
            SiteList.emptyState(wrapper);
            return _context5.abrupt("return");

          case 8:
            SiteList.removeEmptyState(wrapper); // Set total sites count

            totalSites = document.querySelector("#totalSites");
            if (totalSites) totalSites.textContent = Object.keys(sites).length; // Get the site list wrapper

            siteListWrapper = document.querySelector("#siteListWrapper");

            if (siteListWrapper) {
              // Store the original list of sites
              SiteList.sites = sites;
              SiteList.siteList(siteListWrapper, sites);
            } // Handle the filter input event


            filterInput = document.querySelector(".gts-filter input");

            if (filterInput) {
              filterInput.addEventListener("input", function () {
                var query = filterInput.value.toLowerCase();
                var filteredSites = SiteList.filterSites(query);
                SiteList.siteList(siteListWrapper, filteredSites);
              });
            }

          case 15:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  // Filter sites based on the search query
  filterSites: function filterSites(query) {
    var sites = SiteList.sites;
    var filteredSites = sites.filter(function (site) {
      return site.name.toLowerCase().includes(query) || site.sitenumber.toString().includes(query);
    });
    var siteListWrapper = document.querySelector("#siteListWrapper");

    if (!filteredSites.length) {
      SiteList.emptyState(siteListWrapper); // Call emptyState when no results
    } else {
      SiteList.removeEmptyState(siteListWrapper); // Remove emptyState if results exist
    }

    return filteredSites;
  },
  emptyState: function emptyState(wrapper) {
    var siteListContainer = wrapper.querySelector(".sites-list ul"); // Check if the empty state message already exists

    if (!wrapper.querySelector(".emptyState")) {
      var emptyStateDiv = document.createElement("div");
      emptyStateDiv.className = "emptyState"; // Create the heading (h3)

      var heading = document.createElement("h3");
      heading.textContent = "No Results Found"; // Create the brief (p)

      var brief = document.createElement("p");
      brief.textContent = "We couldn't find any matches. Adjust your search and try again."; // Append heading and brief to the empty state div

      emptyStateDiv.appendChild(heading);
      emptyStateDiv.appendChild(brief); // Insert the empty state div after the site list container

      siteListContainer.parentNode.insertBefore(emptyStateDiv, siteListContainer.nextSibling);
    }
  },
  removeEmptyState: function removeEmptyState(wrapper) {
    var emptyStateDiv = wrapper.querySelector(".emptyState");

    if (emptyStateDiv) {
      emptyStateDiv.remove();
    }
  },
  // Render the site list
  siteList: function siteList(wrapper, sites) {
    var siteListContainer = wrapper.querySelector(".sites-list ul");
    if (!siteListContainer) return; // Clear any existing site list content

    siteListContainer.innerHTML = ""; // Generate site list items

    sites.forEach(function (site) {
      var siteItem = document.createElement("li");
      siteItem.classList.add("site-item");
      var location = site.longitud + ',' + site.latitud; // Get the location from the site data

      siteItem.innerHTML = "\n                <div class=\"site-wrapper\">\n                    <div class=\"site-body\" data-drawer-target=\"#siteDetails\">\n                        <div class=\"icon-wrapper ".concat(site.status.toLowerCase(), "\">\n                            <span class=\"mat-icon material-symbols-sharp\">location_on</span>\n                        </div>\n                        <div class=\"site-details\">\n                            <p>").concat(site.sitenumber, "</p>\n                            <h3>").concat(site.name, "</h3>\n                        </div>\n                    </div>\n                    <div class=\"site-control\">\n                        <a role=\"button\" href=\"https://www.google.com/maps?q=").concat(location, "\" target=\"_blank\" class=\"btn\">\n                            Direction\n                        </a>\n                    </div>\n                </div>\n            "); // Add click event listener to clone and insert the drawer

      siteItem.querySelector(".site-body").addEventListener("click", function () {
        SiteList.cloneAndInsertDrawer(siteItem, site);
      });
      siteListContainer.appendChild(siteItem);
    });

    _script.Drawer.init();

    _script.Button.init();
  },
  // Clone and insert the drawer inside the clicked siteItem
  cloneAndInsertDrawer: function cloneAndInsertDrawer(siteItem, site) {
    var existingDrawer = siteItem.querySelector(".drawer-wrapper");

    if (existingDrawer) {
      console.log("Drawer already exists for this site.");
      return; // Prevent duplicate drawers
    } // Clone the shared drawer HTML


    var sharedDrawer = document.querySelector("#siteDetails");

    if (!sharedDrawer) {
      console.error("Shared drawer element not found.");
      return;
    }

    var clonedDrawer = sharedDrawer.cloneNode(true); // Update the id of the cloned drawer

    var uniqueDrawerId = "site-details-".concat(site.sitenumber);
    clonedDrawer.id = uniqueDrawerId; // Update the data-drawer-target of the clicked site-body

    var siteBody = siteItem.querySelector(".site-body");

    if (siteBody) {
      siteBody.setAttribute("data-drawer-target", "#".concat(uniqueDrawerId));
    } // Append the cloned drawer to the siteItem


    siteItem.appendChild(clonedDrawer);
    SiteList.drawerSiteData(clonedDrawer, site);
    console.log("Cloned drawer added with id: ".concat(uniqueDrawerId));

    _script.Drawer.init();

    _script.Tab.init(); // Pass a cleanup callback for removing the cloned drawer


    _script.Drawer.closeDrawer(function (clonedDrawer) {
      if (clonedDrawer.id === uniqueDrawerId) {
        clonedDrawer.remove(); // Remove the cloned drawer

        console.log("Removed cloned drawer: ".concat(clonedDrawer.id));
      }
    });
  },
  drawerSiteData: function drawerSiteData(drawer, site) {
    var sitenumber, sitename, siteData;
    return regeneratorRuntime.async(function drawerSiteData$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            sitenumber = drawer.querySelector('.drawer-title p');
            sitenumber.textContent = site.sitenumber;
            sitename = drawer.querySelector('.drawer-title h2');
            sitename.textContent = site.name;
            _context6.next = 6;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.siteDetails));

          case 6:
            siteData = _context6.sent;

            if (!(!siteData || Object.keys(siteData).length === 0)) {
              _context6.next = 10;
              break;
            }

            console.error("No site data available");
            return _context6.abrupt("return");

          case 10:
          case "end":
            return _context6.stop();
        }
      }
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