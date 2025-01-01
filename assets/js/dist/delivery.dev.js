"use strict";

var _script = require("./script.js");

var _constant = require("./constant.js");

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
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.deliveryData));

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

var DeliveryFilter = {
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
            DeliveryFilter.state.response = response.tanks_list;
            filterOptions = {
              'Site Numbers': {
                options: _toConsumableArray(new Set(response.tanks_list.map(function (item) {
                  return item.sitenumber;
                }))),
                originalKey: 'sitenumber'
              },
              'Tank': {
                options: _toConsumableArray(new Set(response.tanks_list.map(function (item) {
                  return item.Tank;
                }))),
                originalKey: 'Tank'
              },
              'Product': {
                options: _toConsumableArray(new Set(response.tanks_list.map(function (item) {
                  return item.product;
                }))),
                originalKey: 'product'
              },
              'Capacity': {
                options: _toConsumableArray(new Set(response.tanks_list.map(function (item) {
                  return item.capacity;
                }))),
                originalKey: 'capacity'
              },
              'Date Start Range': {
                options: _toConsumableArray(new Set(response.tanks_list.map(function (item) {
                  return item.datestart;
                }))),
                originalKey: 'datestart'
              },
              'Date End Range': {
                options: _toConsumableArray(new Set(response.tanks_list.map(function (item) {
                  return item.dateend;
                }))),
                originalKey: 'dateend'
              }
            }; // Update state with filter options

            DeliveryFilter.state.filterOptions = filterOptions;
            dateKeys = ['datestart', 'dateend']; // Initialize filters with the fetched alarm data

            _context2.next = 11;
            return regeneratorRuntime.awrap(_script.DatatableFilter.init(dtFilterWrapper, response.tanks_list, filterOptions, DeliveryFilter, DeliveryDT, dateKeys));

          case 11:
            selectedFilters = _context2.sent;
            // Update state with selected filters
            DeliveryFilter.state.selectedFilters = selectedFilters;

            if (selectedFilters) {
              DeliveryFilter.filterSubmit(selectedFilters); // Apply filters on load
            }

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  filterSubmit: function filterSubmit(filters) {
    var response, filteredDelivery;
    return regeneratorRuntime.async(function filterSubmit$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            response = DeliveryFilter.state.response;
            _context3.next = 3;
            return regeneratorRuntime.awrap(DeliveryFilter.applyFilters(filters, response));

          case 3:
            filteredDelivery = _context3.sent;
            // Update DataTable with filtered responses
            DeliveryDT.init(filteredDelivery);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  applyFilters: function applyFilters(filters, response) {
    var filteredDelivery = response; // Start with the full responses list

    Object.entries(filters).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          values = _ref2[1];

      if (key === 'datestart' && values.from && values.to) {
        // Filter by date range
        var from = new Date(values.from);
        var to = new Date(values.to);
        filteredDelivery = filteredDelivery.filter(function (res) {
          var responsesDate = new Date(res[key]);
          return responsesDate >= from && alarmDate <= to;
        });
      } else {
        // Other filters (multi-select)
        filteredDelivery = filteredDelivery.filter(function (res) {
          return values.some(function (value) {
            return String(res[key]) === String(value);
          });
        });
      }
    }); //     else if (key === 'dateend' && values.from && values.to) {
    //         // Filter by date range
    //         const from = new Date(values.from);
    //         const to = new Date(values.to);
    //         filteredDelivery = filteredDelivery.filter(res => {
    //             const responsesDate = new Date(res[key]);
    //             return responsesDate >= from && alarmDate <= to;
    //         });
    // }

    return filteredDelivery; // Return filtered response
  }
};
var DeliveryDT = {
  // Initialize the Site DataTable
  init: function init(filteredDelivery) {
    var deliveryDT, delivery, formattedData;
    return regeneratorRuntime.async(function init$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            deliveryDT = document.querySelector("#deliveryDT");

            if (!deliveryDT) {
              _context4.next = 10;
              break;
            }

            if (filteredDelivery) {
              _context4.next = 8;
              break;
            }

            _context4.next = 5;
            return regeneratorRuntime.awrap(DeliveryDT.fetchData());

          case 5:
            delivery = _context4.sent;
            _context4.next = 9;
            break;

          case 8:
            if (filteredDelivery.length) {
              deliveryDT.innerHTML = '';
              delivery = filteredDelivery;
            } else {
              deliveryDT.innerHTML = '';
              DeliveryDT.emptyState(deliveryDT);
            }

          case 9:
            if (delivery && delivery.length > 0) {
              formattedData = DeliveryDT.transformData(delivery);

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
                  title: "<span class=\"mat-icon material-symbols-sharp\">schedule</span> Start Date",
                  data: "datestart"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">gas_meter</span> Start Vol",
                  data: "volstart"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">schedule</span> End Date",
                  data: "dateend"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">gas_meter</span> End Vol",
                  data: "volend"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">gas_meter</span> Total Vol",
                  data: "voltotal"
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
              ], "Delivery data table");
            } else {
              console.error("No delivery data available");
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
    var response, delivery;
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
            return regeneratorRuntime.awrap(_script.DataTable.fetchData(response.tanks_list));

          case 6:
            delivery = _context5.sent;
            return _context5.abrupt("return", delivery);

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](0);
            console.error("Error fetching DeliveryDT data:", _context5.t0);
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
    return data.map(function (delivery) {
      return {
        id: delivery.id,
        datestart: delivery.datestart,
        volstart: delivery.volstart,
        dateend: delivery.dateend,
        volend: delivery.volend,
        voltotal: delivery.voltotal,
        sitename: delivery.sitename,
        sitenumber: delivery.sitenumber,
        Tank: delivery.Tank,
        product: delivery.product,
        capacity: delivery.capacity
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
var DeliveryOverview = {
  init: function init() {
    var totalDelivery, response, totalDeliveryObj, productsDelivery;
    return regeneratorRuntime.async(function init$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            totalDelivery = document.querySelector('#totalDelivery');
            _context6.next = 3;
            return regeneratorRuntime.awrap(FetchData.init());

          case 3:
            response = _context6.sent;
            totalDeliveryObj = {
              total_delivery: response.total_delivery,
              start: response.start,
              end: response.end
            };

            if (totalDelivery) {
              DeliveryOverview.totalDelivery(totalDeliveryObj, totalDelivery);
            }

            productsDelivery = document.querySelector('#productsDelivery');

            if (productsDelivery) {
              DeliveryOverview.totalProducts(response.tanks_list, productsDelivery);
            }

          case 8:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  totalDelivery: function totalDelivery(totalDeliveryObj, _totalDelivery) {
    _totalDelivery.querySelector('h2').innerHTML = totalDeliveryObj.total_delivery;
    var deliveryDateRange = document.querySelector('#deliveryDateRange');

    if (deliveryDateRange) {
      // Create container for date range
      var dateRangeContainer = document.createElement('div');
      dateRangeContainer.classList.add('date-range-container'); // Create "Start Date" element

      var startDateElement = document.createElement('div');
      startDateElement.classList.add('date-item');
      startDateElement.innerHTML = "\n                <span class=\"mat-icon material-symbols-sharp\">date_range</span>\n                <span class=\"date-label\">Start at: </span>\n                <span class=\"date-value\">".concat(totalDeliveryObj.start, "</span>\n            "); // Create "End Date" element

      var endDateElement = document.createElement('div');
      endDateElement.classList.add('date-item');
      endDateElement.innerHTML = "\n                <span class=\"mat-icon material-symbols-sharp\">date_range</span>\n                <span class=\"date-label\">End at: </span>\n                <span class=\"date-value\">".concat(totalDeliveryObj.end, "</span>\n            "); // Append start and end dates to the container

      dateRangeContainer.appendChild(startDateElement);
      dateRangeContainer.appendChild(endDateElement); // Append the container to the deliveryDateRange element

      deliveryDateRange.appendChild(dateRangeContainer);
    }
  },
  totalProducts: function totalProducts(response, productsDelivery) {
    // Create a map to sum up voltotal by product
    var productTotals = response.reduce(function (totals, item) {
      var productKey = item.product.toLowerCase();

      if (!totals[productKey]) {
        totals[productKey] = {
          total: 0,
          label: item.product
        };
      }

      totals[productKey].total += parseFloat(item.voltotal);
      return totals;
    }, {}); // Clear existing content inside productsDelivery

    productsDelivery.innerHTML = ""; // Loop through the productTotals and create elements

    for (var _i2 = 0, _Object$entries = Object.entries(productTotals); _i2 < _Object$entries.length; _i2++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
          keyName = _Object$entries$_i[0],
          productData = _Object$entries$_i[1];

      var total = productData.total,
          labeledKeyName = productData.label; // Create the main grid item container

      var gridItem = document.createElement("div");
      gridItem.classList.add("gts-grid-item"); // Create the product content wrapper

      var productContent = document.createElement("div");
      productContent.classList.add("gts-product", "gts-item-content", keyName); // Create the value container

      var valueContainer = document.createElement("div");
      valueContainer.classList.add("gts-value"); // Add the icon wrapper

      var iconWrapper = document.createElement("div");
      iconWrapper.classList.add("icon-wrapper");
      iconWrapper.innerHTML = "\n                <span class=\"mat-icon material-symbols-sharp\">local_gas_station</span>\n            "; // Add the value and label

      var valueHTML = "\n                <h3><span id=\"".concat(keyName, "-value\">").concat(total.toFixed(2), "</span> lts</h3>\n                <p>").concat(labeledKeyName, "</p>\n            "); // Append elements together

      valueContainer.appendChild(iconWrapper);
      valueContainer.innerHTML += valueHTML;
      productContent.appendChild(valueContainer);
      gridItem.appendChild(productContent); // Append to the productsDelivery container

      productsDelivery.appendChild(gridItem);
    }
  }
};
(0, _script.pageReady)(function () {
  DeliveryDT.init();
  DeliveryFilter.init();
  DeliveryOverview.init();
});