"use strict";

var _script = require("./script.js");

var _constant = require("./constant.js");

var _portal = require("./portal.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
                  offset: 0.07
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
    var siteDT, sites, formattedData, columnDefs;
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
              columnDefs = [{
                width: "0px",
                targets: 0
              }, // Hide the first column (id)
              {
                width: "380px",
                targets: 6
              } // Set specific width for the 7th column (Time)
              ];

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
                    var statusClass = data === "Online" ? "online" : "offline";
                    return "<div class=\"status-dt\"><span class=\"".concat(statusClass, "\">").concat(data, "</span></div>");
                  }
                }, {
                  title: "",
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
                  return "<button class=\"btn btn-icon view-more\" data-siteid=\"".concat(row.sitenumber, "\" data-drawer-target=\"#siteDetails\"><span class=\"mat-icon material-symbols-sharp\">visibility</span></button>");
                }
              }, {
                width: "80px",
                targets: 0
              }, // Hide the first column (id)
              {
                width: "80px",
                targets: 6
              }], "Sites data table"); // Attach click event to dynamically generated "view-more" buttons


              document.querySelector(".gts-dt-wrapper").addEventListener("click", function (event) {
                var button = event.target.closest(".view-more");

                if (button) {
                  var siteId = button.getAttribute("data-siteid");
                  var site = sites.find(function (site) {
                    return site.sitenumber.toString() === siteId;
                  });

                  if (site) {
                    SiteDrawer.init(site);
                  } else {
                    console.error("Site with ID ".concat(siteId, " not found."));
                  }
                }
              });

              _script.Drawer.init();
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
    var response, sites;
    return regeneratorRuntime.async(function fetchData$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.sitesData));

          case 3:
            response = _context4.sent;
            _context4.next = 6;
            return regeneratorRuntime.awrap(_script.DataTable.fetchData(response));

          case 6:
            sites = _context4.sent;
            return _context4.abrupt("return", sites);

          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](0);
            console.error("Error fetching SiteDT data:", _context4.t0);
            return _context4.abrupt("return", []);

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 10]]);
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

            if (wrapper) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt("return");

          case 3:
            _context5.next = 5;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.sitesData));

          case 5:
            sites = _context5.sent;

            if (!(!sites || Object.keys(sites).length === 0)) {
              _context5.next = 10;
              break;
            }

            console.error("No sites data available");
            SiteList.emptyState(wrapper);
            return _context5.abrupt("return");

          case 10:
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

          case 17:
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
        SiteDrawer.init(site);
      });
      siteListContainer.appendChild(siteItem);
    });

    _script.Drawer.init();

    _script.Button.init();
  }
};
var SiteDrawer = {
  // Clone and insert the drawer inside the clicked siteItem
  init: function init(site) {
    var sharedDrawer = document.querySelector("#siteDetails");

    if (!sharedDrawer) {
      console.error("Shared drawer element not found.");
      return;
    }

    SiteDrawer.siteDetails(sharedDrawer, site);
  },
  siteDetails: function siteDetails(drawer, site) {
    var sitestatus, sitenumber, sitename, siteData, tanks, alarms, pumps, _tankTabContainer, _tankTabContainer2, emptyStateDiv, heading, brief, pumpsTabContainer, pumpsGroupedByFusionId, _pumpsTabContainer, _emptyStateDiv, _heading, _brief;

    return regeneratorRuntime.async(function siteDetails$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            sitestatus = drawer.querySelector('.drawer-title .icon-wrapper');

            if (sitestatus) {
              sitestatus.classList.toggle('online', site.status === 'online');
              sitestatus.classList.toggle('offline', site.status === 'offline');
            }

            sitenumber = drawer.querySelector('.drawer-title .drawer-title-wrapper p');
            if (sitenumber) sitenumber.textContent = site.sitenumber;
            sitename = drawer.querySelector('.drawer-title .drawer-title-wrapper h2');
            if (sitename) sitename.textContent = site.name;
            _context6.next = 8;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.siteDetails));

          case 8:
            siteData = _context6.sent;

            if (!(!siteData || Object.keys(siteData).length === 0)) {
              _context6.next = 12;
              break;
            }

            console.error("No site data available");
            return _context6.abrupt("return");

          case 12:
            // Fetch the tanks and alarms
            tanks = siteData.tanks;
            alarms = siteData.alarms;
            pumps = siteData.pumps; // Check if tanks data exists

            if (tanks && tanks.length > 0) {
              _tankTabContainer = document.getElementById('tankTabContainer');
              _tankTabContainer.innerHTML = ''; // Clear previous content if any

              tanks.forEach(function (tank) {
                // Create the tank card
                var tankCard = document.createElement('div');
                tankCard.classList.add('tank-card');
                tankCard.classList.add(tank.productid__name.toLowerCase()); // Tank label (Product Name)

                var labelWrapper = document.createElement('div');
                labelWrapper.classList.add('label-wrapper');
                tankCard.appendChild(labelWrapper);
                var labelIcon = document.createElement('div');
                labelIcon.classList.add('icon-wrapper');
                var gasIcon = document.createElement('span');
                gasIcon.classList.add('mat-icon');
                gasIcon.classList.add('material-symbols-sharp');
                gasIcon.textContent = 'gas_meter';
                labelIcon.appendChild(gasIcon);
                labelWrapper.appendChild(labelIcon);
                var label = document.createElement('p');
                label.textContent = tank.productid__name;
                label.classList.add('tank-label');
                labelWrapper.appendChild(label);
                var tankName = document.createElement('h3');
                tankName.textContent = 'Tank ' + tank.fusiontankid;
                tankName.classList.add('tank-name');
                labelWrapper.appendChild(tankName); // Tank progress bar for capacity

                var progressContainer = document.createElement('div');
                progressContainer.classList.add('progress-container');
                var progress = document.createElement('div');
                progress.classList.add('progress-bar'); // Calculate and set width based on capacity percentage

                var capacityPercentage = tank.tanklastinfoid__prodvol / tank.capacity * 100;
                progress.style.width = "".concat(capacityPercentage, "%");

                if (capacityPercentage <= 20) {
                  progress.classList.add('red');
                }

                if (capacityPercentage > 20 && capacityPercentage <= 80) {
                  progress.classList.add('orange');
                }

                if (capacityPercentage > 80 && capacityPercentage <= 100) {
                  progress.classList.add('green');
                } // Create and append dashes


                [20, 80].forEach(function (percent) {
                  var dash = document.createElement('span');
                  dash.classList.add('dash');
                  dash.style.left = "".concat(percent, "%"); // Positioning the dash

                  progressContainer.appendChild(dash);
                }); // Append progress bar to container

                progressContainer.appendChild(progress);
                tankCard.appendChild(progressContainer); // Create a wrapper div for the capacity information

                var capacityWrapper = document.createElement('div');
                capacityWrapper.classList.add('capacity-wrapper'); // Create div for `tanklastinfoid__prodvol`

                var currentVolumeDiv = document.createElement('div');
                currentVolumeDiv.classList.add('current-volume');
                currentVolumeDiv.textContent = tank.tanklastinfoid__prodvol; // Create div for `icon`

                var capacityIcon = document.createElement('span');
                capacityIcon.classList.add('mat-icon', 'material-symbols-sharp');
                capacityIcon.textContent = 'oil_barrel';
                currentVolumeDiv.prepend(capacityIcon); // Add span for "Ltr" inside `currentVolumeDiv`

                var currentVolumeSpan = document.createElement('span');
                currentVolumeSpan.textContent = 'Ltr';
                currentVolumeDiv.appendChild(currentVolumeSpan); // Create div for `capacity`

                var capacityDiv = document.createElement('div');
                capacityDiv.classList.add('tank-capacity');
                capacityDiv.textContent = tank.capacity; // Add span for "Ltr" inside `capacityDiv`

                var capacitySpan = document.createElement('span');
                capacitySpan.textContent = 'Ltr';
                capacityDiv.appendChild(capacitySpan); // Append the two divs to the wrapper

                capacityWrapper.appendChild(currentVolumeDiv);
                capacityWrapper.appendChild(capacityDiv); // // Add the wrapper to the tank card

                tankCard.appendChild(capacityWrapper); // Add alarms related to this tank

                var tankAlarms = alarms.filter(function (alarm) {
                  return alarm.device === "Tank ".concat(tank.fusiontankid);
                });
                var alarmList = document.createElement('ul');
                alarmList.classList.add('alarm-list');

                if (tankAlarms.length > 0) {
                  tankAlarms.forEach(function (alarm) {
                    var alarmItem = document.createElement('li'); // Create alarm div with specific severity styling

                    var alarmDiv = document.createElement('div');
                    alarmDiv.classList.add('alarm-item', alarm.severity.toLowerCase()); // Determine icon based on severity

                    var severityDiv = document.createElement('div');
                    severityDiv.classList.add('severity');
                    severityDiv.textContent = alarm.severity;
                    var icon = document.createElement('span');
                    icon.classList.add('mat-icon', 'material-symbols-sharp');
                    icon.textContent = alarm.severity === 'Warning' ? 'warning' : alarm.severity === 'Info' ? 'error' : 'cancel'; // Add text content for alarm details

                    severityDiv.prepend(icon);
                    alarmDiv.appendChild(severityDiv);
                    var alarmTypeSpan = document.createElement('span');
                    alarmTypeSpan.classList.add('alarm-type');
                    alarmTypeSpan.textContent = alarm.type;
                    alarmDiv.appendChild(alarmTypeSpan); // Create the alarm-status div

                    var alarmStatusDiv = document.createElement('div');
                    alarmStatusDiv.classList.add('alarm-status'); // Add the first icon (check or close) with appropriate class based on `isactive`

                    var statusIcon = document.createElement('span');
                    statusIcon.classList.add('mat-icon', 'material-symbols-sharp', alarm.isactive === 'solved' ? 'is-active' : 'not-active');
                    statusIcon.textContent = alarm.isactive === 'solved' ? 'check_circle' : 'circle_notifications';
                    alarmStatusDiv.appendChild(statusIcon); // Add hover events for the tooltip

                    statusIcon.addEventListener('mouseenter', function () {
                      // Create the tooltip
                      var tooltip = document.createElement('div');
                      tooltip.classList.add('tooltip');
                      tooltip.textContent = alarm.isactive;
                      document.body.appendChild(tooltip); // Position the tooltip near the icon

                      var rect = statusIcon.getBoundingClientRect();
                      var tooltipRect = tooltip.getBoundingClientRect();
                      tooltip.style.position = 'absolute';
                      tooltip.style.left = "".concat(rect.left - tooltipRect.width + rect.width, "px");
                      tooltip.style.top = "".concat(rect.bottom + 5, "px");
                      tooltip.setAttribute('id', 'alarm-tooltip');
                    });
                    statusIcon.addEventListener('mouseleave', function () {
                      // Remove the tooltip
                      var tooltip = document.getElementById('alarm-tooltip');

                      if (tooltip) {
                        tooltip.remove();
                      }
                    }); // Add the time icon with tooltip functionality

                    var timeIcon = document.createElement('span');
                    timeIcon.classList.add('mat-icon', 'material-symbols-sharp');
                    timeIcon.setAttribute('id', 'alarmTime');
                    timeIcon.textContent = 'schedule'; // Add hover events for the tooltip

                    timeIcon.addEventListener('mouseenter', function () {
                      // Create the tooltip
                      var tooltip = document.createElement('div');
                      tooltip.classList.add('tooltip');
                      tooltip.textContent = alarm.time;
                      document.body.appendChild(tooltip); // Position the tooltip near the icon

                      var rect = timeIcon.getBoundingClientRect();
                      var tooltipRect = tooltip.getBoundingClientRect();
                      tooltip.style.position = 'absolute';
                      tooltip.style.left = "".concat(rect.left - tooltipRect.width + rect.width, "px");
                      tooltip.style.top = "".concat(rect.bottom + 5, "px");
                      tooltip.setAttribute('id', 'alarm-tooltip');
                    });
                    timeIcon.addEventListener('mouseleave', function () {
                      // Remove the tooltip
                      var tooltip = document.getElementById('alarm-tooltip');

                      if (tooltip) {
                        tooltip.remove();
                      }
                    });
                    alarmStatusDiv.appendChild(timeIcon); // Append the alarm-status div to the alarmDiv

                    alarmDiv.appendChild(alarmStatusDiv); // Append alarmDiv to alarmItem

                    alarmItem.appendChild(alarmDiv);
                    alarmList.appendChild(alarmItem);
                  });
                } else {
                  var noAlarmItem = document.createElement('li'); // Create "No Alarms" div

                  var noAlarmDiv = document.createElement('div');
                  noAlarmDiv.classList.add('no-alarms'); // Add icon and text

                  var noAlarmIcon = document.createElement('span');
                  noAlarmIcon.classList.add('mat-icon', 'material-symbols-sharp');
                  noAlarmIcon.textContent = 'notifications_off';
                  var noAlarmText = document.createTextNode('No Alarms'); // Append icon and text to the div

                  noAlarmDiv.appendChild(noAlarmIcon);
                  noAlarmDiv.appendChild(noAlarmText); // Append div to list item

                  noAlarmItem.appendChild(noAlarmDiv);
                  tankCard.appendChild(noAlarmItem);
                  alarmList.appendChild(noAlarmItem);
                }

                tankCard.appendChild(alarmList); // Append the tank card to the container

                _tankTabContainer.appendChild(tankCard);
              });
            } else {
              // Check if the empty state message already exists
              _tankTabContainer2 = document.getElementById('tankTabContainer');
              _tankTabContainer2.innerHTML = ''; // Clear previous content if any

              if (!_tankTabContainer2.querySelector(".emptyState")) {
                emptyStateDiv = document.createElement("div");
                emptyStateDiv.className = "emptyState"; // Create the heading (h3)

                heading = document.createElement("h3");
                heading.textContent = "No Tanks Found"; // Create the brief (p)

                brief = document.createElement("p");
                brief.textContent = "We couldn't find any tanks for this site, try again later."; // Append heading and brief to the empty state div

                emptyStateDiv.appendChild(heading);
                emptyStateDiv.appendChild(brief); // Insert the empty state div after the site list container

                _tankTabContainer2.appendChild(emptyStateDiv);
              }
            }

            if (pumps && pumps.length > 0) {
              pumpsTabContainer = document.querySelector("#pumpsTabContainer");
              pumpsTabContainer.innerHTML = ''; // Clear previous content if any

              pumpsGroupedByFusionId = pumps.reduce(function (acc, pump) {
                if (!acc[pump.fusionid]) {
                  acc[pump.fusionid] = {
                    fusionid: pump.fusionid,
                    brand: pump.brand,
                    nozzles: []
                  };
                }

                acc[pump.fusionid].nozzles.push(pump);
                return acc;
              }, {}); // Create cards for each pump (grouped by fusionid)

              Object.values(pumpsGroupedByFusionId).forEach(function (group) {
                var pumpCard = document.createElement("div");
                pumpCard.classList.add("pump-card"); // Pump header (with same style as tank headers)

                var labelWrapper = document.createElement("div");
                labelWrapper.classList.add("label-wrapper");
                var labelIcon = document.createElement("div");
                labelIcon.classList.add("icon-wrapper");
                var pumpIcon = document.createElement("span");
                pumpIcon.classList.add("mat-icon", "material-symbols-sharp");
                pumpIcon.textContent = "local_gas_station"; // Pump icon

                labelIcon.appendChild(pumpIcon);
                labelWrapper.appendChild(labelIcon);
                var label = document.createElement("p");
                label.textContent = group.brand;
                label.classList.add("pump-label");
                labelWrapper.appendChild(label);
                var pumpName = document.createElement("h3");
                pumpName.textContent = "Pump ".concat(group.fusionid);
                pumpName.classList.add("pump-name");
                labelWrapper.appendChild(pumpName);
                pumpCard.appendChild(labelWrapper); // Nozzles and their sales data

                var nozzlesWrapper = document.createElement("div");
                nozzlesWrapper.classList.add("nozzles-wrapper");
                group.nozzles.forEach(function (nozzle) {
                  var nozzleItem = document.createElement("div");
                  nozzleItem.classList.add("nozzle-item");
                  nozzleItem.classList.add(nozzle.hose__gradeid__name.toLowerCase());
                  var nozzleHeader = document.createElement("div");
                  nozzleHeader.classList.add("nozzle-header"); // Create the nozzle icon container

                  var nozzleIcon = document.createElement("div");
                  nozzleIcon.classList.add("nozzle-icon"); // Add the material icon span

                  var nozzleIconSpan = document.createElement("span");
                  nozzleIconSpan.classList.add("mat-icon");
                  nozzleIconSpan.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 100 100\" width=\"400px\" height=\"400px\"><path d=\"M25,30C25,27.239,20,20,20,20S15,27.239,15,30S17.239,35,20,35S25,32.761,25,30Z\" stroke=\"none\"></path><path d=\"M20,50C20,52.761,22.239,55,25,55S30,52.761,30,50S25,40,25,40S20,47.239,20,50Z\" stroke=\"none\"></path><path d=\"M75,30L65,30L55,20L51.768,23.232L42.197,13.661C39.835,11.3,36.697,10,33.358,10L20,10L20,15L33.358,15C35.361,15,37.245,15.78,38.661,17.196L48.232,26.767L45,30L55,40L45,50L45,80C45,85.523,49.477,90,55,90L80,90L80,65L85,60L85,40C85,34.477,80.523,30,75,30ZM70,85L55,85C52.239,85,50,82.761,50,80L50,55L60,55C60,59.094,60,69.41,55.264,78.882L59.736,81.118C65,70.59,65,59.447,65,55C67.761,55,70,57.239,70,60L70,85Z\" stroke=\"none\"></path></svg>"; // Nozzle icon

                  nozzleIcon.appendChild(nozzleIconSpan); // Append the icon container to the header

                  nozzleHeader.appendChild(nozzleIcon); // Create the nozzle label container

                  var nozzleLabel = document.createElement("div");
                  nozzleLabel.classList.add("nozzle-label"); // Add the nozzle number paragraph

                  var nozzleNumber = document.createElement("p");
                  nozzleNumber.textContent = "Nozzle #: ".concat(nozzle.hose__logicalid);
                  nozzleLabel.appendChild(nozzleNumber); // Add the nozzle grade name header

                  var nozzleLabelHeader = document.createElement("h4");
                  nozzleLabelHeader.textContent = "".concat(nozzle.hose__gradeid__name);
                  nozzleLabel.appendChild(nozzleLabelHeader); // Append the label container to the header

                  nozzleHeader.appendChild(nozzleLabel); // Append the header to the nozzle item

                  nozzleItem.appendChild(nozzleHeader);
                  var nozzleSale = document.createElement("div");
                  nozzleSale.classList.add("nozzle-sale");
                  var saleMoney = document.createElement("p");
                  saleMoney.classList.add('sale-money'); // saleMoney.innerHTML = `${nozzle.last_sale_money} <span>SAR</span>`;

                  var _nozzle$last_sale_mon = nozzle.last_sale_money.split('.'),
                      _nozzle$last_sale_mon2 = _slicedToArray(_nozzle$last_sale_mon, 2),
                      integerPart = _nozzle$last_sale_mon2[0],
                      decimalPart = _nozzle$last_sale_mon2[1]; // Create the formatted HTML structure


                  saleMoney.innerHTML = "\n                    <span>SAR</span> ".concat(integerPart, "<span class=\"decimal\">.").concat(decimalPart, "</span>\n                    ");
                  var saleVolume = document.createElement("p");
                  saleVolume.classList.add('sale-volume');
                  saleVolume.innerHTML = "".concat(nozzle.last_sale_volume, " <span>Ltr</span>");
                  nozzleSale.appendChild(saleMoney);
                  nozzleSale.appendChild(saleVolume);
                  nozzleItem.appendChild(nozzleSale);
                  var nozzleTime = document.createElement("div");
                  nozzleTime.classList.add("nozzle-time");
                  var saleStartDate = document.createElement("p"); // saleStartDate.textContent = `${nozzle.last_sale_startdate}`;

                  var startDate = new Date(nozzle.last_sale_startdate);
                  saleStartDate.innerHTML = "<span>Start at:</span> ".concat(startDate.toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true // Optional: Change to `false` for 24-hour format

                  }));
                  var saleEndDate = document.createElement("p"); // saleEndDate.textContent = `${nozzle.last_sale_enddate}`;

                  var endDate = new Date(nozzle.last_sale_enddate);
                  saleEndDate.innerHTML = "<span>End at:</span> ".concat(endDate.toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true // Optional: Change to `false` for 24-hour format

                  }));
                  nozzleTime.appendChild(saleStartDate);
                  nozzleTime.appendChild(saleEndDate);
                  nozzleItem.prepend(nozzleTime);
                  nozzlesWrapper.appendChild(nozzleItem);
                }); // Add alarms related to this tank

                var pumpsAlarms = alarms.filter(function (alarm) {
                  return alarm.device === "Pump ".concat(group.fusionid);
                });
                var alarmList = document.createElement('ul');
                alarmList.classList.add('alarm-list');

                if (pumpsAlarms.length > 0) {
                  pumpsAlarms.forEach(function (alarm) {
                    var alarmItem = document.createElement('li'); // Create alarm div with specific severity styling

                    var alarmDiv = document.createElement('div');
                    alarmDiv.classList.add('alarm-item', alarm.severity.toLowerCase()); // Determine icon based on severity

                    var severityDiv = document.createElement('div');
                    severityDiv.classList.add('severity');
                    severityDiv.textContent = alarm.severity;
                    var icon = document.createElement('span');
                    icon.classList.add('mat-icon', 'material-symbols-sharp');
                    icon.textContent = alarm.severity === 'Warning' ? 'warning' : alarm.severity === 'Info' ? 'error' : 'cancel'; // Add text content for alarm details

                    severityDiv.prepend(icon);
                    alarmDiv.appendChild(severityDiv);
                    var alarmTypeSpan = document.createElement('span');
                    alarmTypeSpan.classList.add('alarm-type');
                    alarmTypeSpan.textContent = alarm.type;
                    alarmDiv.appendChild(alarmTypeSpan); // Create the alarm-status div

                    var alarmStatusDiv = document.createElement('div');
                    alarmStatusDiv.classList.add('alarm-status'); // Add the first icon (check or close) with appropriate class based on `isactive`

                    var statusIcon = document.createElement('span');
                    statusIcon.classList.add('mat-icon', 'material-symbols-sharp', alarm.isactive === 'solved' ? 'is-active' : 'not-active');
                    statusIcon.textContent = alarm.isactive === 'solved' ? 'check_circle' : 'circle_notifications';
                    alarmStatusDiv.appendChild(statusIcon); // Add hover events for the tooltip

                    statusIcon.addEventListener('mouseenter', function () {
                      // Create the tooltip
                      var tooltip = document.createElement('div');
                      tooltip.classList.add('tooltip');
                      tooltip.textContent = alarm.isactive;
                      document.body.appendChild(tooltip); // Position the tooltip near the icon

                      var rect = statusIcon.getBoundingClientRect();
                      var tooltipRect = tooltip.getBoundingClientRect();
                      tooltip.style.position = 'absolute';
                      tooltip.style.left = "".concat(rect.left - tooltipRect.width + rect.width, "px");
                      tooltip.style.top = "".concat(rect.bottom + 5, "px");
                      tooltip.setAttribute('id', 'alarm-tooltip');
                    });
                    statusIcon.addEventListener('mouseleave', function () {
                      // Remove the tooltip
                      var tooltip = document.getElementById('alarm-tooltip');

                      if (tooltip) {
                        tooltip.remove();
                      }
                    }); // Add the time icon with tooltip functionality

                    var timeIcon = document.createElement('span');
                    timeIcon.classList.add('mat-icon', 'material-symbols-sharp');
                    timeIcon.setAttribute('id', 'alarmTime');
                    timeIcon.textContent = 'schedule'; // Add hover events for the tooltip

                    timeIcon.addEventListener('mouseenter', function () {
                      // Create the tooltip
                      var tooltip = document.createElement('div');
                      tooltip.classList.add('tooltip');
                      tooltip.textContent = alarm.time;
                      document.body.appendChild(tooltip); // Position the tooltip near the icon

                      var rect = timeIcon.getBoundingClientRect();
                      var tooltipRect = tooltip.getBoundingClientRect();
                      tooltip.style.position = 'absolute';
                      tooltip.style.left = "".concat(rect.left - tooltipRect.width + rect.width, "px");
                      tooltip.style.top = "".concat(rect.bottom + 5, "px");
                      tooltip.setAttribute('id', 'alarm-tooltip');
                    });
                    timeIcon.addEventListener('mouseleave', function () {
                      // Remove the tooltip
                      var tooltip = document.getElementById('alarm-tooltip');

                      if (tooltip) {
                        tooltip.remove();
                      }
                    });
                    alarmStatusDiv.appendChild(timeIcon); // Append the alarm-status div to the alarmDiv

                    alarmDiv.appendChild(alarmStatusDiv); // Append alarmDiv to alarmItem

                    alarmItem.appendChild(alarmDiv);
                    alarmList.appendChild(alarmItem);
                  });
                } else {
                  var noAlarmItem = document.createElement('li'); // Create "No Alarms" div

                  var noAlarmDiv = document.createElement('div');
                  noAlarmDiv.classList.add('no-alarms'); // Add icon and text

                  var noAlarmIcon = document.createElement('span');
                  noAlarmIcon.classList.add('mat-icon', 'material-symbols-sharp');
                  noAlarmIcon.textContent = 'notifications_off';
                  var noAlarmText = document.createTextNode('No Alarms'); // Append icon and text to the div

                  noAlarmDiv.appendChild(noAlarmIcon);
                  noAlarmDiv.appendChild(noAlarmText); // Append div to list item

                  noAlarmItem.appendChild(noAlarmDiv);
                  pumpCard.appendChild(noAlarmItem);
                  alarmList.appendChild(noAlarmItem);
                }

                pumpCard.appendChild(nozzlesWrapper);
                pumpCard.appendChild(alarmList); // Add the pump card to the container

                pumpsTabContainer.appendChild(pumpCard);
              });
            } else {
              // Check if the empty state message already exists
              _pumpsTabContainer = document.querySelector("#pumpsTabContainer");
              _pumpsTabContainer.innerHTML = ''; // Clear previous content if any

              if (!_pumpsTabContainer.querySelector(".emptyState")) {
                _emptyStateDiv = document.createElement("div");
                _emptyStateDiv.className = "emptyState"; // Create the heading (h3)

                _heading = document.createElement("h3");
                _heading.textContent = "No Tanks Found"; // Create the brief (p)

                _brief = document.createElement("p");
                _brief.textContent = "We couldn't find any tanks for this site, try again later."; // Append heading and brief to the empty state div

                _emptyStateDiv.appendChild(_heading);

                _emptyStateDiv.appendChild(_brief); // Insert the empty state div after the site list container


                tankTabContainer.appendChild(_emptyStateDiv);
              }
            }

          case 17:
          case "end":
            return _context6.stop();
        }
      }
    });
  }
};
var ReloadSitesCharts = {
  // Initialize the menu toggle functionality
  init: function init() {
    // Attach the click event listener to #toggle-menu
    document.getElementById('toggle-menu').addEventListener('click', ReloadSitesCharts.chartReload);
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
var RunCharts = {
  init: function init() {
    SiteStatus.init();
    ReloadSitesCharts.init();
  }
};

_portal.AppearanceToggle.registerCallback(function (mode) {
  ReloadSitesCharts.chartReload();
});

(0, _script.pageReady)(function () {
  RunCharts.init();
  SiteList.init();
  SiteDT.init();
});