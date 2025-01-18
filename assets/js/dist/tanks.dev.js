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
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.tanksData));

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

var TanksFilter = {
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
            TanksFilter.state.response = response;
            filterOptions = {
              'Site Numbers': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.sitenumber;
                }))),
                originalKey: 'sitenumber'
              },
              'Tank': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.Tank;
                }))),
                originalKey: 'Tank'
              },
              'Product': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.product;
                }))),
                originalKey: 'product'
              },
              'Capacity': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.capacity;
                }))),
                originalKey: 'capacity'
              },
              'Product Volume': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.productvolume;
                }))),
                originalKey: 'productvolume'
              },
              'Water Volume': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.watervolume;
                }))),
                originalKey: 'watervolume'
              },
              'Time Range': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.timestamp;
                }))),
                originalKey: 'timestamp'
              }
            }; // Update state with filter options

            TanksFilter.state.filterOptions = filterOptions;
            dateKeys = ['timestamp']; // Initialize filters with the fetched alarm data

            _context2.next = 11;
            return regeneratorRuntime.awrap(_script.DatatableFilter.init(dtFilterWrapper, response, filterOptions, TanksFilter, TanksDT, dateKeys));

          case 11:
            selectedFilters = _context2.sent;
            // Update state with selected filters
            TanksFilter.state.selectedFilters = selectedFilters;

            if (selectedFilters) {
              TanksFilter.filterSubmit(selectedFilters); // Apply filters on load
            }

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  filterSubmit: function filterSubmit(filters) {
    var response, filteredTanks;
    return regeneratorRuntime.async(function filterSubmit$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            response = TanksFilter.state.response;
            _context3.next = 3;
            return regeneratorRuntime.awrap(TanksFilter.applyFilters(filters, response));

          case 3:
            filteredTanks = _context3.sent;
            // Update DataTable with filtered responses
            TanksDT.init(filteredTanks);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  applyFilters: function applyFilters(filters, response) {
    var filteredTanks = response; // Start with the full responses list

    Object.entries(filters).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          values = _ref2[1];

      if (key === 'datestart' && values.from && values.to) {
        // Filter by date range
        var from = new Date(values.from);
        var to = new Date(values.to);
        filteredTanks = filteredTanks.filter(function (res) {
          var responsesDate = new Date(res[key]);
          return responsesDate >= from && alarmDate <= to;
        });
      } else {
        // Other filters (multi-select)
        filteredTanks = filteredTanks.filter(function (res) {
          return values.some(function (value) {
            return String(res[key]) === String(value);
          });
        });
      }
    });
    return filteredTanks; // Return filtered response
  }
};
var TanksDT = {
  // Initialize the Site DataTable
  init: function init(filteredTanks) {
    var tanksDT, tanks, formattedData;
    return regeneratorRuntime.async(function init$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            tanksDT = document.querySelector("#tanksDT");

            if (!tanksDT) {
              _context4.next = 10;
              break;
            }

            if (filteredTanks) {
              _context4.next = 8;
              break;
            }

            _context4.next = 5;
            return regeneratorRuntime.awrap(TanksDT.fetchData());

          case 5:
            tanks = _context4.sent;
            _context4.next = 9;
            break;

          case 8:
            if (filteredTanks.length) {
              tanksDT.innerHTML = '';
              tanks = filteredTanks;
            } else {
              tanksDT.innerHTML = '';
              TanksDT.emptyState(tanksDT);
            }

          case 9:
            if (tanks && tanks.length > 0) {
              formattedData = TanksDT.transformData(tanks);

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
                  title: "<span class=\"mat-icon material-symbols-sharp\">oil_barrel</span> Tank",
                  data: "Tank"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">local_gas_station</span> Product",
                  data: "product"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">valve</span> Capacity",
                  data: "capacity"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">schedule</span> Product Volume",
                  data: "productvolume"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">gas_meter</span> Water Volume",
                  data: "watervolume"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">schedule</span> Time",
                  data: "timestamp"
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
                  return "<button class=\"btn btn-icon view-more\" data-tank=\"".concat(row.Tank, "\" data-drawer-target=\"#tankDetails\"><span class=\"mat-icon material-symbols-sharp\">visibility</span></button>");
                }
              }, {
                width: "0px",
                targets: 0
              }, {
                width: "80px",
                targets: 9
              }], "Tanks data table"); // Attach click event to dynamically generated "view-more" buttons


              document.querySelector(".gts-dt-wrapper").addEventListener("click", function (event) {
                var button = event.target.closest(".view-more");

                if (button) {
                  var tankId = button.getAttribute("data-tank");
                  var tank = tanks.find(function (tank) {
                    return tank.Tank.toString() === tankId;
                  });

                  if (tank) {
                    TankDrawer.init(tank);
                  } else {
                    console.error("Site with ID ".concat(tankId, " not found."));
                  }
                }
              });

              _script.Drawer.init();
            } else {
              console.error("No tanks data available");
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
    var response, tanks;
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
            tanks = _context5.sent;
            return _context5.abrupt("return", tanks);

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](0);
            console.error("Error fetching TanksDT data:", _context5.t0);
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
    return data.map(function (tanks) {
      return {
        id: tanks.id,
        sitename: tanks.sitename,
        sitenumber: tanks.sitenumber,
        Tank: tanks.Tank,
        product: tanks.product,
        capacity: tanks.capacity,
        productvolume: tanks.productvolume,
        watervolume: tanks.watervolume,
        timestamp: tanks.timestamp,
        details: ''
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
var DeepView = {
  init: function init() {
    var siteListTanksWrapper, response, filterInput, siteListWrapper, sites;
    return regeneratorRuntime.async(function init$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            siteListTanksWrapper = document.querySelector('#siteListTanksWrapper');

            if (!siteListTanksWrapper) {
              _context7.next = 23;
              break;
            }

            _context7.next = 4;
            return regeneratorRuntime.awrap(FetchData.init());

          case 4:
            response = _context7.sent;

            if (!(!response || Object.keys(response).length === 0)) {
              _context7.next = 9;
              break;
            }

            console.error("No sites data available");
            DeepView.emptyState(siteListTanksWrapper);
            return _context7.abrupt("return");

          case 9:
            DeepView.removeEmptyState(siteListTanksWrapper);
            DeepView.groupSites(response, siteListTanksWrapper); // Handle the filter input event

            filterInput = document.querySelector(".gts-filter input");

            if (filterInput) {
              filterInput.addEventListener("input", function _callee() {
                var query, filteredSites;
                return regeneratorRuntime.async(function _callee$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        query = filterInput.value.toLowerCase();
                        _context6.next = 3;
                        return regeneratorRuntime.awrap(DeepView.filterSites(query, siteListTanksWrapper));

                      case 3:
                        filteredSites = _context6.sent;

                      case 4:
                      case "end":
                        return _context6.stop();
                    }
                  }
                });
              });
            }

            siteListWrapper = document.querySelector("#siteListTanksWrapper");

            if (!siteListWrapper) {
              _context7.next = 23;
              break;
            }

            _context7.next = 17;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.sitesData));

          case 17:
            sites = _context7.sent;

            if (!(!sites || Object.keys(sites).length === 0)) {
              _context7.next = 22;
              break;
            }

            console.error("No sites data available");
            DeepView.emptyState(wrapper);
            return _context7.abrupt("return");

          case 22:
            // Store the original list of sites
            // DeepView.sites = sites;
            DeepView.siteList(siteListWrapper, sites);

          case 23:
          case "end":
            return _context7.stop();
        }
      }
    });
  },
  groupSites: function groupSites(response, siteListTanksWrapper) {
    var groupedSites = []; // Extract unique sites

    response.forEach(function (site) {
      if (!groupedSites.some(function (s) {
        return s.sitenumber === site.sitenumber;
      })) {
        groupedSites.push({
          sitenumber: site.sitenumber,
          sitename: site.sitename
        });
      }
    });
    DeepView.createList(response, groupedSites, siteListTanksWrapper);
  },
  createList: function createList(response, groupedSites, siteListTanksWrapper) {
    var siteListContainer = siteListTanksWrapper.querySelector(".sites-list ul");
    if (!siteListContainer) return;
    siteListContainer.innerHTML = ""; // Clear existing content

    groupedSites.forEach(function (site) {
      var siteItem = document.createElement("li");
      siteItem.classList.add("site-item");
      siteItem.innerHTML = "\n                <div class=\"site-wrapper\" data-drawer-target=\"#siteDetails\">\n                    <div class=\"site-body\">\n                        <div class=\"icon-wrapper\">\n                            <span class=\"mat-icon material-symbols-sharp\">location_on</span>\n                        </div>\n                        <div class=\"site-details\">\n                            <p>".concat(site.sitenumber, "</p>\n                            <h3>").concat(site.sitename, "</h3>\n                        </div>\n                    </div>\n                    <div class=\"site-control\">\n                        <button role=\"button\" class=\"btn\">\n                            Details\n                        </button>\n                    </div>\n                </div>\n            "); // Pass selected site and related tanks to SiteDrawer

      siteItem.querySelector(".site-wrapper").addEventListener("click", function () {
        DeepView.siteDetails(response, site);
      });
      siteListContainer.appendChild(siteItem);
    });

    _script.Drawer.init();

    _script.Button.init();
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
  },
  filterSites: function filterSites(query, siteListTanksWrapper) {
    var response, groupedSites, filteredSites, siteListWrapper;
    return regeneratorRuntime.async(function filterSites$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return regeneratorRuntime.awrap(FetchData.init());

          case 2:
            response = _context8.sent;
            groupedSites = []; // Extract unique sites

            response.forEach(function (site) {
              if (!groupedSites.some(function (s) {
                return s.sitenumber === site.sitenumber;
              })) {
                groupedSites.push({
                  sitenumber: site.sitenumber,
                  sitename: site.sitename
                });
              }
            });
            filteredSites = groupedSites.filter(function (site) {
              return site.sitename.toLowerCase().includes(query) || site.sitenumber.toString().includes(query);
            });
            siteListWrapper = document.querySelector("#siteListTanksWrapper");

            if (!filteredSites.length) {
              DeepView.emptyState(siteListWrapper); // Call emptyState when no results
            } else {
              DeepView.removeEmptyState(siteListWrapper); // Remove emptyState if results exist
            }

            return _context8.abrupt("return", filteredSites);

          case 9:
          case "end":
            return _context8.stop();
        }
      }
    });
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
  siteDetails: function siteDetails(response, selectedSite) {
    var siteData = response.filter(function (site) {
      return site.sitenumber === selectedSite.sitenumber;
    });
    SiteDrawer.init(selectedSite, siteData);
  }
};
var SiteDrawer = {
  // Clone and insert the drawer inside the clicked siteItem
  init: function init(site) {
    var sharedDrawer = document.querySelector("#siteDetails");

    if (!sharedDrawer) {
      console.error("Shared drawer element not found.");
      return;
    } // sharedDrawer.innerHTML = '';


    SiteDrawer.siteDetails(sharedDrawer, site);
  },
  siteDetails: function siteDetails(drawer, site) {
    var sitestatus, sitenumber, sitename, siteData, tanks, alarms, pumps, _tankTabContainer, _tankTabContainer2, emptyStateDiv, heading, brief, pumpsTabContainer, pumpsGroupedByFusionId, _pumpsTabContainer, _emptyStateDiv, _heading, _brief;

    return regeneratorRuntime.async(function siteDetails$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
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
            _context9.next = 8;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.siteDetails));

          case 8:
            siteData = _context9.sent;

            if (!(!siteData || Object.keys(siteData).length === 0)) {
              _context9.next = 12;
              break;
            }

            console.error("No site data available");
            return _context9.abrupt("return");

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
            return _context9.stop();
        }
      }
    });
  }
};
var TankDrawer = {
  // Clone and insert the drawer inside the clicked siteItem
  init: function init(tank) {
    var sharedDrawer;
    return regeneratorRuntime.async(function init$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            sharedDrawer = document.querySelector("#tankDetails");

            if (sharedDrawer) {
              _context10.next = 4;
              break;
            }

            console.error("Shared drawer element not found.");
            return _context10.abrupt("return");

          case 4:
            _context10.next = 6;
            return regeneratorRuntime.awrap(TankDrawer.siteDetails(sharedDrawer, tank));

          case 6:
          case "end":
            return _context10.stop();
        }
      }
    });
  },
  siteDetails: function siteDetails(drawer, tank) {
    var body, tankDetailsHTML;
    return regeneratorRuntime.async(function siteDetails$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            body = drawer.querySelector('.drawer-body');
            if (body) body.innerHTML = ''; // Clear existing content
            // Create tank details dynamically

            tankDetailsHTML = "\n            <div class=\"drawer-title\">\n                <div class=\"icon-wrapper ".concat(tank.online ? 'online' : 'offline', "\">\n                    <span class=\"mat-icon material-symbols-sharp\">location_on</span>\n                </div>\n                <div class=\"drawer-title-wrapper\">\n                    <p>").concat(tank.sitenumber, "</p>\n                    <h2>").concat(tank.sitename, "</h2>\n                </div>\n            </div>\n\n            <div class=\"tank-card\">\n                <div class=\"label-wrapper\">\n                    <p class=\"tank-label\">").concat(tank.product, "</p>\n                    <h3 class=\"tank-name\">").concat(tank.Tank, "</h3>\n                </div>\n            </div>\n\n            <div class=\"tank-visualization\">\n                <div class=\"product-visualization\"></div>\n                <div class=\"water-visualization\"></div>\n            </div>\n\n            <div class=\"tank-capacity\">\n                <p class=\"tank-capacity-label\"><strong>Tank Capacity</strong>: ").concat(tank.capacity, " L</p>\n                <p><strong>On Date</strong>: ").concat(new Date(tank.timestamp).toLocaleString(), "</p>\n            </div>\n\n        "); // Append tank details to the body

            body.innerHTML = tankDetailsHTML;
            _context11.next = 6;
            return regeneratorRuntime.awrap(TankDrawer.tankFill(body, tank));

          case 6:
            _context11.next = 8;
            return regeneratorRuntime.awrap(TankDrawer.waterFill(body, tank));

          case 8:
          case "end":
            return _context11.stop();
        }
      }
    });
  },
  tankFill: function tankFill(body, tank) {
    var productsTank, productsTankLabel, liquid, svgNamespace, svg, path, productsLevel, label, currentValue, tankVisualizationContainer;
    return regeneratorRuntime.async(function tankFill$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            productsTank = document.createElement('div');
            productsTank.classList.add('products-tank');
            productsTankLabel = document.createElement('p');
            productsTankLabel.classList.add('products-tank-label');
            productsTankLabel.textContent = 'Product Volume';
            liquid = document.createElement('div');
            liquid.classList.add('liquid'); // Add SVG for products

            svgNamespace = "http://www.w3.org/2000/svg";
            svg = document.createElementNS(svgNamespace, 'svg');
            svg.classList.add('products');
            svg.setAttribute('viewBox', '0 0 200 100');
            path = document.createElementNS(svgNamespace, 'path');
            path.setAttribute('fill', _constant.SharedColors[tank.product]);
            path.setAttribute('d', "\n                M 0,0 v 100 h 200 v -100 \n                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n            ");
            svg.appendChild(path);
            liquid.appendChild(svg); // Calculate products level

            productsLevel = tank.productvolume / tank.capacity * 100;
            svg.style.top = "calc(97.5% - ".concat(productsLevel, "%)"); // Add liquid container to the tank

            productsTank.appendChild(liquid); // Add indicators

            [25, 50, 75].forEach(function (value) {
              var indicator = document.createElement('div');
              indicator.classList.add('indicator');
              indicator.setAttribute('data-value', value);
              indicator.style.bottom = "".concat(value, "%");
              productsTank.appendChild(indicator);
            }); // Add label

            label = document.createElement('div');
            label.classList.add('label');
            label.style.bottom = "".concat(productsLevel, "%"); // label.textContent = `${Math.round(productsLevel)}%`;

            currentValue = parseFloat(tank.productvolume).toFixed(2);
            label.innerHTML = "".concat(currentValue, "<span>lts</span>");
            productsTank.appendChild(label); // Append the products tank to the body
            // body.appendChild(productsTank);

            tankVisualizationContainer = body.querySelector('.tank-visualization .product-visualization');

            if (tankVisualizationContainer) {
              tankVisualizationContainer.appendChild(productsTank); // Insert returned HTML

              tankVisualizationContainer.appendChild(productsTankLabel); // Insert returned HTML
            }

          case 28:
          case "end":
            return _context12.stop();
        }
      }
    });
  },
  waterFill: function waterFill(body, tank) {
    var productsTank, productsTankLabel, liquid, svgNamespace, svg, path, productsLevel, label, currentValue, tankVisualizationContainer;
    return regeneratorRuntime.async(function waterFill$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            productsTank = document.createElement('div');
            productsTank.classList.add('products-tank');
            productsTankLabel = document.createElement('p');
            productsTankLabel.classList.add('products-tank-label');
            productsTankLabel.textContent = 'Water Volume';
            liquid = document.createElement('div');
            liquid.classList.add('liquid'); // Add SVG for products

            svgNamespace = "http://www.w3.org/2000/svg";
            svg = document.createElementNS(svgNamespace, 'svg');
            svg.classList.add('products');
            svg.setAttribute('viewBox', '0 0 200 100');
            path = document.createElementNS(svgNamespace, 'path');
            path.setAttribute('fill', _constant.SharedColors.WaterColor);
            path.setAttribute('d', "\n                M 0,0 v 100 h 200 v -100 \n                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n        ");
            svg.appendChild(path);
            liquid.appendChild(svg); // Calculate products level

            productsLevel = tank.watervolume / tank.capacity * 100;
            svg.style.top = "calc(97.5% - ".concat(productsLevel, "%)"); // Add liquid container to the tank

            productsTank.appendChild(liquid); // Add indicators

            [25, 50, 75].forEach(function (value) {
              var indicator = document.createElement('div');
              indicator.classList.add('indicator');
              indicator.setAttribute('data-value', value);
              indicator.style.bottom = "".concat(value, "%");
              productsTank.appendChild(indicator);
            }); // Add label

            label = document.createElement('div');
            label.classList.add('label');
            label.style.bottom = "".concat(productsLevel, "%"); // label.textContent = `${Math.round(productsLevel)}%`;

            currentValue = parseFloat(tank.watervolume).toFixed(2);
            label.innerHTML = "".concat(currentValue, "<span>lts</span>");
            productsTank.appendChild(label); // Append the products tank to the body
            // body.appendChild(productsTank);

            tankVisualizationContainer = body.querySelector('.tank-visualization .water-visualization');

            if (tankVisualizationContainer) {
              tankVisualizationContainer.appendChild(productsTank); // Insert returned HTML

              tankVisualizationContainer.appendChild(productsTankLabel); // Insert returned HTML
            }

          case 28:
          case "end":
            return _context13.stop();
        }
      }
    });
  }
};
(0, _script.pageReady)(function () {
  TanksDT.init();
  DeepView.init();
  TanksFilter.init();
});