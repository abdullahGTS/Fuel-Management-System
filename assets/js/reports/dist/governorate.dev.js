"use strict";

var _script = require("../script.js");

var _constant = require("../constant.js");

var _portal = require("../portal.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var ProductLabels = {
  "Gasoline95": "Gasoline 95",
  "Gasoline92": "Gasoline 92",
  "Gasoline91": "Gasoline 91",
  "Gasoline80": "Gasoline 80",
  "diesel": "Diesel",
  "cng": "CNG"
};
var FetchData = {
  init: function init() {
    var response;
    return regeneratorRuntime.async(function init$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.governrateReports));

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

var GovernorateFilter = {
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
            GovernorateFilter.state.response = response; // Get all unique filter categories from the response

            filterOptions = {
              'Governrate Name': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.gov_name;
                }))),
                originalKey: 'gov_name'
              },
              'Product': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.product;
                }))),
                originalKey: 'product'
              },
              'Start Date': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.startdate;
                }))),
                originalKey: 'startdate'
              },
              'End Date': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.enddate;
                }))),
                originalKey: 'enddate'
              }
            }; // Update state with filter options

            GovernorateFilter.state.filterOptions = filterOptions;
            dateKeys = ['startdate', 'enddate']; // Initialize filters with the fetched alarm data

            _context2.next = 11;
            return regeneratorRuntime.awrap(_script.DatatableFilter.init(dtFilterWrapper, response, filterOptions, GovernorateFilter, GovernorateReportsDT, dateKeys));

          case 11:
            selectedFilters = _context2.sent;
            // Update state with selected filters
            GovernorateFilter.state.selectedFilters = selectedFilters;

            if (selectedFilters) {
              GovernorateFilter.filterSubmit(selectedFilters); // Apply filters on load
            }

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  filterSubmit: function filterSubmit(filters) {
    var response, filteredGovernorate;
    return regeneratorRuntime.async(function filterSubmit$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            response = GovernorateFilter.state.response;
            _context3.next = 3;
            return regeneratorRuntime.awrap(GovernorateFilter.applyFilters(filters, response));

          case 3:
            filteredGovernorate = _context3.sent;
            // Update DataTable with filtered alarms
            GovernorateReportsDT.init(filteredGovernorate);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  applyFilters: function applyFilters(filters, response) {
    var filteredGovernorate = response; // Start with the full alarm list

    Object.entries(filters).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          values = _ref2[1];

      if (['startdate', 'enddate'].includes(key) && values.from && values.to) {
        // Filter by date range
        var from = new Date(values.from);
        var to = new Date(values.to);
        filteredGovernorate = filteredGovernorate.filter(function (res) {
          var responseDate = new Date(res[key]);
          return responseDate >= from && responseDate <= to;
        });
      } else {
        // Other filters (multi-select)
        filteredGovernorate = filteredGovernorate.filter(function (res) {
          return values.some(function (value) {
            return String(res[key]) === String(value);
          });
        });
      }
    });
    return filteredGovernorate; // Return filtered alarms
  }
};
var GovernorateReportsDT = {
  // Initialize the Site DataTable
  init: function init(filteredGovernorate) {
    var governorateReportsDT, governorate, formattedData;
    return regeneratorRuntime.async(function init$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            governorateReportsDT = document.querySelector("#governorateReportsDT");

            if (!governorateReportsDT) {
              _context4.next = 10;
              break;
            }

            if (filteredGovernorate) {
              _context4.next = 8;
              break;
            }

            _context4.next = 5;
            return regeneratorRuntime.awrap(GovernorateReportsDT.fetchData());

          case 5:
            governorate = _context4.sent;
            _context4.next = 9;
            break;

          case 8:
            if (filteredGovernorate.length) {
              governorateReportsDT.innerHTML = '';
              governorate = filteredGovernorate;
            } else {
              governorateReportsDT.innerHTML = '';
              GovernorateReportsDT.emptyState(governorateReportsDT);
            }

          case 9:
            if (governorate && governorate.length > 0) {
              formattedData = GovernorateReportsDT.transformData(governorate);

              _script.DataTable.init(".gts-dt-wrapper", {
                data: formattedData,
                columns: [{
                  title: "<span class=\"mat-icon material-symbols-sharp\">globe_asia</span> Governrates",
                  data: "gov_name",
                  footer: 'Total'
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">local_gas_station</span> Gasoline 95",
                  data: "Gasoline95"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">local_gas_station</span> Gasoline 92",
                  data: "Gasoline92"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">local_gas_station</span> Diesel",
                  data: "Diesel"
                }],
                responsive: true,
                paging: formattedData.length > 10,
                pageLength: 10,
                fixedHeader: {
                  header: false,
                  footer: true
                },
                footerCallback: function footerCallback(row, data, start, end, display) {
                  var api = this.api();
                  var totalGasoline95 = api.column(1).data().reduce(function (a, b) {
                    return a + parseFloat(b) || 0;
                  }, 0);
                  var totalGasoline92 = api.column(2).data().reduce(function (a, b) {
                    return a + parseFloat(b) || 0;
                  }, 0);
                  var totalDiesel = api.column(3).data().reduce(function (a, b) {
                    return a + parseFloat(b) || 0;
                  }, 0); // Update footer with totals

                  $(api.column(1).footer()).html(GovernorateReportsDT.parseFormattedNumber(totalGasoline95.toFixed(2)));
                  $(api.column(2).footer()).html(GovernorateReportsDT.parseFormattedNumber(totalGasoline92.toFixed(2)));
                  $(api.column(3).footer()).html(GovernorateReportsDT.parseFormattedNumber(totalDiesel.toFixed(2)));
                  $(api.column(0).footer()).html('Total');
                }
              }, [{
                targets: 0,
                visible: true,
                className: 'not-id',
                createdCell: function createdCell(td) {
                  $(td).css('text-align', 'left');
                }
              }, {
                width: "280px",
                targets: 1
              }, {
                width: "280px",
                targets: 2
              }, {
                width: "280px",
                targets: 3
              }], "Governorate data table");
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
  parseFormattedNumber: function parseFormattedNumber(numberStr) {
    var formattedNumber = numberStr.toString().replace(/,/g, '').trim();
    var parsedNumber = parseFloat(formattedNumber);

    if (isNaN(parsedNumber)) {
      console.error('Invalid number format:', numberStr);
      return '0'; // Return a string so it can be displayed
    } // Format the number with commas


    return parsedNumber.toLocaleString();
  },
  // Fetch data from the API
  fetchData: function fetchData() {
    var response, governorate;
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
            return regeneratorRuntime.awrap(_script.DataTable.fetchData(response.governrates));

          case 6:
            governorate = _context5.sent;
            return _context5.abrupt("return", governorate);

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](0);
            console.error("Error fetching GovernorateReportsDT data:", _context5.t0);
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
    return data.map(function (governorate) {
      return {
        gov_name: governorate.gov_name,
        Gasoline95: governorate.Gasoline95,
        Gasoline92: governorate.Gasoline92,
        Diesel: governorate.Diesel
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
}; // Fetch Product Data

var Products = {
  init: function init() {
    var products, totalSums;
    return regeneratorRuntime.async(function init$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return regeneratorRuntime.awrap(FetchData.init());

          case 2:
            products = _context6.sent;
            totalSums = Products.calculateTotalSums(products.governrates);
            Products.renderProducts(totalSums);

          case 5:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  calculateTotalSums: function calculateTotalSums(records) {
    var totals = {};
    records.forEach(function (record) {
      Object.keys(record).forEach(function (key) {
        if (key !== "gov_name") {
          var value = parseFloat(record[key]) || 0;
          totals[key] = (totals[key] || 0) + value;
        }
      });
    });
    return totals;
  },
  renderProducts: function renderProducts(products) {
    var productsCards = document.getElementById('productsReportsCards');

    if (productsCards) {
      Object.keys(products).forEach(function (key) {
        // Create the main wrapper for the product card
        var gridItem = document.createElement('div');
        gridItem.classList.add('gts-grid-item'); // Create the main product container

        var itemContainer = document.createElement('div');
        itemContainer.classList.add('gts-product');
        itemContainer.classList.add('gts-item-content');
        itemContainer.classList.add(key.toLowerCase()); // Create the inner container for icon and content

        var gtsValue = document.createElement('div');
        gtsValue.classList.add('gts-value'); // Create the icon wrapper

        var iconWrapper = document.createElement('div');
        iconWrapper.classList.add('icon-wrapper'); // Create the icon element (using Material Icons in this example)

        var icon = document.createElement('span');
        icon.classList.add('mat-icon', 'material-symbols-sharp');
        icon.textContent = 'local_gas_station'; // Set your icon name or dynamic icon here
        // Append icon to icon wrapper

        iconWrapper.appendChild(icon); // Create the header for the product quantity

        var quantityHeader = document.createElement('h3');
        var quantityValue = document.createElement('span');
        quantityValue.id = "".concat(key, "-value");
        quantityValue.textContent = Products.parseFormattedNumber(products[key].toFixed(2)); // Add unit after the value

        quantityHeader.appendChild(quantityValue);
        quantityHeader.insertAdjacentText('beforeend', ' lts'); // Create the product name/label as a paragraph

        var productLabel = document.createElement('p');
        productLabel.textContent = "".concat(ProductLabels[key] || key); // Append elements in the proper structure

        gtsValue.appendChild(iconWrapper);
        gtsValue.appendChild(quantityHeader);
        gtsValue.appendChild(productLabel); // Append the main gts-value container to itemContainer

        itemContainer.appendChild(gtsValue); // Append the itemContainer to the gridItem and add it to the main container

        gridItem.appendChild(itemContainer);
        productsCards.querySelector('.gts-grid').appendChild(gridItem);
      });
    }

    if (Object.keys(products).length > 3) {
      Products.scrollProducts(productsCards, Object.keys(products).length);
    }
  },
  scrollProducts: function scrollProducts(productsCards, items) {
    // Get the width of the first product card
    var itemWidth = productsCards.querySelector('.gts-grid .gts-grid-item:first-child').offsetWidth;
    productsCards.querySelectorAll('.gts-grid .gts-grid-item').forEach(function (card) {
      card.style.width = "".concat(itemWidth, "px");
    });
    productsCards.style.width = "".concat(itemWidth * 3 + 15, "px");
  },
  parseFormattedNumber: function parseFormattedNumber(numberStr) {
    var formattedNumber = numberStr.toString().replace(/,/g, '').trim();
    var parsedNumber = parseFloat(formattedNumber);

    if (isNaN(parsedNumber)) {
      console.error('Invalid number format:', numberStr);
      return '0'; // Return a string so it can be displayed
    } // Format the number with commas


    return parsedNumber.toLocaleString();
  }
};
var GovernorateProducts = {
  init: function init() {
    var productSalesChart = document.querySelector('#productSalesChart');

    if (productSalesChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(GovernorateProducts.fetchData);
    }
  },
  fetchData: function fetchData() {
    var response;
    return regeneratorRuntime.async(function fetchData$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return regeneratorRuntime.awrap(FetchData.init());

          case 2:
            response = _context7.sent;
            google.charts.setOnLoadCallback(function () {
              return GovernorateProducts.drawChart(response.governrates);
            });

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    });
  },
  drawChart: function drawChart(governrates) {
    var _ref3, backgroundColor, txtColor, productTotals, data, chartRows, options, chart;

    return regeneratorRuntime.async(function drawChart$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref3 = _context8.sent;
            backgroundColor = _ref3.backgroundColor;
            txtColor = _ref3.txtColor;
            // Aggregate total sales per product
            productTotals = {
              Gasoline95: 0,
              Gasoline92: 0,
              Diesel: 0
            };
            governrates.forEach(function (gov) {
              productTotals.Gasoline95 += parseFloat(gov.Gasoline95) || 0;
              productTotals.Gasoline92 += parseFloat(gov.Gasoline92) || 0;
              productTotals.Diesel += parseFloat(gov.Diesel) || 0;
            }); // Prepare the DataTable for Google Charts

            data = new google.visualization.DataTable();
            data.addColumn('string', 'Product'); // X-Axis: Product name

            data.addColumn('number', 'Total Usage'); // Y-Axis: Total sales

            data.addColumn({
              type: 'string',
              role: 'style'
            }); // Style column for colors

            data.addColumn({
              type: 'string',
              role: 'tooltip',
              p: {
                html: true
              }
            }); // Tooltip column
            // Convert aggregated totals to chart rows

            chartRows = Object.entries(productTotals).map(function (_ref4) {
              var _ref5 = _slicedToArray(_ref4, 2),
                  product = _ref5[0],
                  total = _ref5[1];

              var tooltip = "<div class=\"cus_tooltip\"><b>".concat(product, "</b><br>").concat(total.toFixed(2), " L</div>");
              return [product, total, "color: ".concat(_constant.SharedColors[product] || '#000000'), tooltip];
            });
            data.addRows(chartRows); // Chart Options

            options = {
              title: '',
              backgroundColor: backgroundColor,
              hAxis: {
                textStyle: {
                  color: txtColor
                }
              },
              vAxis: {
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

            chart = new google.visualization.ColumnChart(document.getElementById('productSalesChart'));
            chart.draw(data, options);

          case 17:
          case "end":
            return _context8.stop();
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
        var productSalesChart = document.getElementById('productSalesChart');

        if (productSalesChart && !productSalesChart.classList.contains('hide')) {
          GovernorateProducts.init();
        }
      });
    }
  }
};
var RunCharts = {
  init: function init() {
    GovernorateProducts.init();
    ReloadAlarmsCharts.init();
  }
};

_portal.AppearanceToggle.registerCallback(function (mode) {
  ReloadAlarmsCharts.chartReload();
});

(0, _script.pageReady)(function () {
  GovernorateReportsDT.init();
  GovernorateFilter.init();
  RunCharts.init();
  Products.init();
});