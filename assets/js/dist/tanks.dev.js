"use strict";

var _script = require("./script.js");

var _constant = require("./constant.js");

var _portal = require("./portal.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    }); //     else if (key === 'dateend' && values.from && values.to) {
    //         // Filter by date range
    //         const from = new Date(values.from);
    //         const to = new Date(values.to);
    //         filteredTanks = filteredTanks.filter(res => {
    //             const responsesDate = new Date(res[key]);
    //             return responsesDate >= from && alarmDate <= to;
    //         });
    // }

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
                }],
                responsive: true,
                paging: formattedData.length > 10,
                pageLength: 10
              }, [{
                width: "0px",
                targets: 0
              } // Hide the first column (id)
              // { width: "280px", targets: 1 },
              // { width: "280px", targets: 3 },
              ], "Tanks data table");
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
        timestamp: tanks.timestamp
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
}; // const DeepView = {
//     init: async () => {
//         const siteListTanksWrapper = document.querySelector('#siteListTanksWrapper');
//         if ( siteListTanksWrapper ) {
//             const response = await FetchData.init();
//             DeepView.groupSites(response, siteListTanksWrapper);
//         }
//     },
//     groupSites: (response, siteListTanksWrapper) => {
//         const groupedSites = [];
//         // Extract unique sites
//         response.forEach((site) => {
//             if (!groupedSites.some(s => s.sitenumber === site.sitenumber)) {
//                 groupedSites.push({
//                     sitenumber: site.sitenumber,
//                     sitename: site.sitename
//                 });
//             }
//         });
//         DeepView.createList(response, groupedSites, siteListTanksWrapper);
//     },
//     createList: (response, groupedSites, siteListTanksWrapper) => {
//         const siteListContainer = siteListTanksWrapper.querySelector(".sites-list ul");
//         if (!siteListContainer) return;
//         siteListContainer.innerHTML = ""; // Clear existing content
//         groupedSites.forEach((site) => {
//             const siteItem = document.createElement("li");
//             siteItem.classList.add("site-item");
//             siteItem.innerHTML = `
//                 <div class="site-wrapper" data-drawer-target="#siteDetails">
//                     <div class="site-body">
//                         <div class="icon-wrapper">
//                             <span class="mat-icon material-symbols-sharp">location_on</span>
//                         </div>
//                         <div class="site-details">
//                             <p>${site.sitenumber}</p>
//                             <h3>${site.sitename}</h3>
//                         </div>
//                     </div>
//                     <div class="site-control">
//                         <button role="button" class="btn">
//                             Details
//                         </button>
//                     </div>
//                 </div>
//             `;
//             siteItem.querySelector(".site-wrapper").addEventListener("click", () => {
//                 DeepView.siteDetails(response, site.sitenumber);
//             });
//             siteListContainer.appendChild(siteItem);
//             Drawer.init();
//             Button.init();
//         });
//     },
//     siteDetails: (response, sitenumber) => {
//         const siteData = response.filter(site => site.sitenumber === sitenumber);
//         // Use a drawer component to display details
//         const drawerContent = `
//             <h2>Details for Site ${siteData[0].sitename} (${sitenumber})</h2>
//             <ul>
//                 ${siteData.map(tank => `
//                     <li>
//                         <div>
//                             <strong>Tank:</strong> ${tank.Tank}
//                         </div>
//                         <div>
//                             <strong>Product:</strong> ${tank.product}
//                         </div>
//                         <div>
//                             <strong>Capacity:</strong> ${tank.capacity} L
//                         </div>
//                         <div>
//                             <strong>Volume:</strong> ${tank.productvolume} L
//                         </div>
//                     </li>
//                 `).join('')}
//             </ul>
//         `;
//         SiteDrawer.init(siteData); // Assuming SiteDrawer accepts HTML content
//     },
// }
// const SiteDrawer = {
//     // Clone and insert the drawer inside the clicked siteItem
//     init: async (response) => {
//         console.log('response', response)
//         const sharedDrawer = document.querySelector("#siteDetails");
//         if (!sharedDrawer) {
//             console.error("Shared drawer element not found.");
//             return;
//         }
//         await SiteDrawer.siteDetails(sharedDrawer, response);
//     },
//     siteDetails: async (drawer, site) => {
//         const sitestatus = drawer.querySelector('.drawer-title .icon-wrapper');
//         const sitenumber = drawer.querySelector('.drawer-title .drawer-title-wrapper p');
//         if (sitenumber) sitenumber.textContent = site.sitenumber;
//         const sitename = drawer.querySelector('.drawer-title .drawer-title-wrapper h2');
//         if (sitename) sitename.textContent = site.sitename;
//     }
// }

var DeepView = {
  init: function init() {
    var siteListTanksWrapper, response, filterInput;
    return regeneratorRuntime.async(function init$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            siteListTanksWrapper = document.querySelector('#siteListTanksWrapper');

            if (!siteListTanksWrapper) {
              _context7.next = 13;
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
                        DeepView.createList(response, filteredSites, siteListTanksWrapper);

                      case 5:
                      case "end":
                        return _context6.stop();
                    }
                  }
                });
              });
            }

          case 13:
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
  init: function init(site, tanks) {
    var sharedDrawer = document.querySelector("#siteDetails");

    if (!sharedDrawer) {
      console.error("Shared drawer element not found.");
      return;
    }

    SiteDrawer.siteDetails(sharedDrawer, site, tanks);
  },
  siteDetails: function siteDetails(drawer, site, tanks) {
    // Update drawer header with site details
    var sitestatus = drawer.querySelector('.drawer-title .icon-wrapper');
    var sitenumber = drawer.querySelector('.drawer-title .drawer-title-wrapper p');
    var sitename = drawer.querySelector('.drawer-title .drawer-title-wrapper h2');
    if (sitenumber) sitenumber.textContent = site.sitenumber;
    if (sitename) sitename.textContent = site.sitename; // Populate tanks details

    var tankTabContainer = drawer.querySelector('#tankTabContainer');

    if (!tanks || tanks.length === 0) {
      tankTabContainer.innerHTML = ''; // Clear previous content if any

      if (!tankTabContainer.querySelector(".emptyState")) {
        var emptyStateDiv = document.createElement("div");
        emptyStateDiv.className = "emptyState"; // Create the heading (h3)

        var heading = document.createElement("h3");
        heading.textContent = "No Tanks Found"; // Create the brief (p)

        var brief = document.createElement("p");
        brief.textContent = "We couldn't find any tanks for this site, try again later."; // Append heading and brief to the empty state div

        emptyStateDiv.appendChild(heading);
        emptyStateDiv.appendChild(brief); // Insert the empty state div after the site list container

        tankTabContainer.appendChild(emptyStateDiv);
      }

      return;
    }

    tankTabContainer.innerHTML = ''; // Clear previous content if any
    // Group tanks by product and select the one with the closest timestamp

    var groupedTanks = tanks.reduce(function (acc, tank) {
      console.log('tank', tank);
      var productName = tank.Tank || "Unknown Product";
      var timestamp = new Date(tank.timestamp);
      console.log('timestamp', timestamp); // If the timestamp is invalid, assign a default fallback

      if (isNaN(timestamp.getTime())) {
        timestamp = new Date(0); // Fallback if the timestamp is invalid
      } // If this product hasn't been added or this timestamp is closer to the current date, update it


      if (!acc[productName] || Math.abs(new Date() - timestamp) < Math.abs(new Date() - acc[productName].timestamp)) {
        acc[productName] = _objectSpread({}, tank, {
          timestamp: timestamp
        });
      }

      return acc;
    }, {}); // Iterate over the grouped tanks and display their details

    Object.entries(groupedTanks).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          productName = _ref4[0],
          tank = _ref4[1];

      var tankCard = document.createElement('div');
      tankCard.classList.add('tank-card');
      tankCard.classList.add(tank.product.toLowerCase()); // Tank label (Product Name)

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
      label.textContent = tank.product;
      label.classList.add('tank-label');
      labelWrapper.appendChild(label);
      var tankName = document.createElement('h3');
      tankName.textContent = tank.Tank;
      tankName.classList.add('tank-name');
      labelWrapper.appendChild(tankName); // Tank progress bar for capacity

      var progressContainer = document.createElement('div');
      progressContainer.classList.add('progress-container');
      var progress = document.createElement('div');
      progress.classList.add('progress-bar'); // Calculate and set width based on capacity percentage

      var capacityPercentage = tank.productvolume / tank.capacity * 100;
      console.log('capacityPercentage', capacityPercentage);
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
      currentVolumeDiv.textContent = tank.productvolume; // Create div for `icon`

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
      capacityWrapper.appendChild(capacityDiv); // Add the wrapper to the tank card

      tankCard.appendChild(capacityWrapper); // Append the tank card to the container

      tankTabContainer.appendChild(tankCard);
    });
  }
};
(0, _script.pageReady)(function () {
  TanksDT.init();
  DeepView.init();
  TanksFilter.init();
});