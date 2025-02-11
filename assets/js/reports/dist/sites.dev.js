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
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.sitesReports));

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

var SitesReportsFilter = {
  state: {
    response: [],
    filterOptions: {},
    selectedFilters: {}
  },
  init: function init() {
    var dtFilterWrapper, res_list, response, filterOptions, dateKeys, selectedFilters;
    return regeneratorRuntime.async(function init$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            dtFilterWrapper = document.querySelector('#dtFilterWrapper');

            if (!dtFilterWrapper) {
              _context2.next = 15;
              break;
            }

            _context2.next = 4;
            return regeneratorRuntime.awrap(FetchData.init());

          case 4:
            res_list = _context2.sent;
            response = res_list.company_list; // Update state with alarms

            SitesReportsFilter.state.response = response; // Get all unique filter categories from the response

            filterOptions = {
              'Central Area': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.centralarea;
                }))),
                originalKey: 'centralarea'
              },
              'Governrate Name': {
                options: _toConsumableArray(new Set(response.map(function (item) {
                  return item.governorate;
                }))),
                originalKey: 'governorate'
              }
            }; // Update state with filter options

            SitesReportsFilter.state.filterOptions = filterOptions;
            dateKeys = []; // Initialize filters with the fetched alarm data

            _context2.next = 12;
            return regeneratorRuntime.awrap(_script.DatatableFilter.init(dtFilterWrapper, response, filterOptions, SitesReportsFilter, SitesReportsDT, dateKeys, CentralAreas));

          case 12:
            selectedFilters = _context2.sent;
            // Update state with selected filters
            SitesReportsFilter.state.selectedFilters = selectedFilters;

            if (selectedFilters) {
              SitesReportsFilter.filterSubmit(selectedFilters); // Apply filters on load
            }

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  filterSubmit: function filterSubmit(filters) {
    var response, filteredSitesReports;
    return regeneratorRuntime.async(function filterSubmit$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            response = SitesReportsFilter.state.response;
            _context3.next = 3;
            return regeneratorRuntime.awrap(SitesReportsFilter.applyFilters(filters, response));

          case 3:
            filteredSitesReports = _context3.sent;
            SitesReportsDT.init(filteredSitesReports);
            CentralAreas.init(filteredSitesReports);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  applyFilters: function applyFilters(filters, response) {
    var filteredSitesReports = response; // Start with the full alarm list

    Object.entries(filters).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          values = _ref2[1];

      if (['time'].includes(key) && values.from && values.to) {
        // Filter by date range
        var from = new Date(values.from);
        var to = new Date(values.to);
        filteredSitesReports = filteredSitesReports.filter(function (res) {
          var responseDate = new Date(res[key]);
          return responseDate >= from && responseDate <= to;
        });
      } else {
        // Other filters (multi-select)
        filteredSitesReports = filteredSitesReports.filter(function (res) {
          return values.some(function (value) {
            return String(res[key]) === String(value);
          });
        });
      }
    });
    return filteredSitesReports; // Return filtered alarms
  }
};
var SitesReportsDT = {
  // Initialize the Site DataTable
  init: function init(filteredSitesReports) {
    var sitesReportsDT, sites, formattedData;
    return regeneratorRuntime.async(function init$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            sitesReportsDT = document.querySelector("#sitesReportsDT");

            if (!sitesReportsDT) {
              _context4.next = 10;
              break;
            }

            if (filteredSitesReports) {
              _context4.next = 8;
              break;
            }

            _context4.next = 5;
            return regeneratorRuntime.awrap(SitesReportsDT.fetchData());

          case 5:
            sites = _context4.sent;
            _context4.next = 9;
            break;

          case 8:
            if (filteredSitesReports.length) {
              sitesReportsDT.innerHTML = '';
              sites = filteredSitesReports;
            } else {
              sitesReportsDT.innerHTML = '';
              SitesReportsDT.emptyState(sitesReportsDT);
            }

          case 9:
            if (sites && sites.length > 0) {
              formattedData = SitesReportsDT.transformData(sites);

              _script.DataTable.init(".gts-dt-wrapper", {
                data: formattedData,
                columns: [{
                  title: "<span class=\"mat-icon material-symbols-sharp\">numbers</span>",
                  data: "id",
                  footer: 'Total'
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">globe_asia</span> Site Number",
                  data: "sitenumber"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">globe_asia</span> Site Name",
                  data: "name"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">network_check</span> Status",
                  data: "status",
                  render: function render(data, type, row) {
                    var statusClass = data === "Online" ? "online" : "offline";
                    return "<div class=\"status-dt\"><span class=\"".concat(statusClass, "\">").concat(data, "</span></div>");
                  }
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">local_gas_station</span> Gasoline 95",
                  data: "Gasoline95"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">local_gas_station</span> Gasoline 92",
                  data: "Gasoline92"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">local_gas_station</span> Diesel",
                  data: "Diesel"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">globe_asia</span> Governorate",
                  data: "governorate"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">globe_asia</span> Central Area",
                  data: "centralarea"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">schedule</span> Last Connection",
                  data: "lastconnection"
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
                  var totalGasoline95 = api.column(4).data().reduce(function (a, b) {
                    return a + parseFloat(b) || 0;
                  }, 0);
                  var totalGasoline92 = api.column(5).data().reduce(function (a, b) {
                    return a + parseFloat(b) || 0;
                  }, 0);
                  var totalDiesel = api.column(6).data().reduce(function (a, b) {
                    return a + parseFloat(b) || 0;
                  }, 0); // Update footer with totals

                  $(api.column(4).footer()).html(SitesReportsDT.parseFormattedNumber(totalGasoline95.toFixed(2)));
                  $(api.column(5).footer()).html(SitesReportsDT.parseFormattedNumber(totalGasoline92.toFixed(2)));
                  $(api.column(6).footer()).html(SitesReportsDT.parseFormattedNumber(totalDiesel.toFixed(2)));
                  $(api.column(0).footer()).html('Total');
                }
              }, [{
                width: "0px",
                targets: 0
              }], "Sites Reports data table");
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
    var response, sites;
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
            return regeneratorRuntime.awrap(_script.DataTable.fetchData(response.company_list));

          case 6:
            sites = _context5.sent;
            return _context5.abrupt("return", sites);

          case 10:
            _context5.prev = 10;
            _context5.t0 = _context5["catch"](0);
            console.error("Error fetching SitesReports data:", _context5.t0);
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
    return data.map(function (site, index) {
      return {
        id: index++,
        sitenumber: site.sitenumber,
        name: site.name,
        Gasoline95: site.Gasoline95,
        Gasoline92: site.Gasoline92,
        Diesel: site.Diesel,
        status: site.status === "offline" ? "Offline" : "Online",
        lastconnection: site.lastconnection,
        centralarea: site.centralarea,
        governorate: site.governorate
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
            totalSums = Products.calculateTotalSums(products.company_list);
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
        if (key === 'Gasoline95' || key === 'Gasoline92' || key === 'Diesel') {
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
}; // Fetch Total Data

var CentralAreas = {
  init: function init(filteredSite) {
    var sites, totalCounts;
    return regeneratorRuntime.async(function init$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return regeneratorRuntime.awrap(FetchData.init());

          case 2:
            sites = _context7.sent;
            // Fetch data dynamically
            totalCounts = CentralAreas.calculateTotalSums(filteredSite ? filteredSite : sites.company_list); // Get unique counts

            CentralAreas.renderProducts(totalCounts); // Render cards with counts

          case 5:
          case "end":
            return _context7.stop();
        }
      }
    });
  },
  calculateTotalSums: function calculateTotalSums(records) {
    var siteNumbers = new Set();
    var governorates = new Set();
    records.forEach(function (record) {
      if (record.sitenumber) {
        siteNumbers.add(record.sitenumber); // Collect unique sitenumbers
      }

      if (record.governorate) {
        governorates.add(record.governorate); // Collect unique governorates
      }
    });
    return {
      Sites: siteNumbers.size,
      // Total unique sitenumbers
      Governorates: governorates.size // Total unique governorates

    };
  },
  renderProducts: function renderProducts(totals) {
    var areaCards = document.getElementById('areasReportsCards');
    if (!areaCards) return;
    areaCards.querySelector('.gts-grid').innerHTML = '';
    Object.keys(totals).forEach(function (key) {
      // Create the main wrapper for the product card
      var gridItem = document.createElement('div');
      gridItem.classList.add('gts-grid-item'); // Create the main product container

      var itemContainer = document.createElement('div');
      itemContainer.classList.add('gts-product', 'gts-item-content', 'white-box', key.toLowerCase()); // Create the inner container for icon and content

      var gtsValue = document.createElement('div');
      gtsValue.classList.add('gts-value'); // Create the icon wrapper

      var iconWrapper = document.createElement('div');
      iconWrapper.classList.add('icon-wrapper'); // Create the icon element (using Material Icons in this example)

      var icon = document.createElement('span');
      icon.classList.add('mat-icon', 'material-symbols-sharp');
      icon.textContent = key === "Sites" ? "business" : "map"; // Different icon per type
      // Append icon to icon wrapper

      iconWrapper.appendChild(icon); // Create the header for the count

      var quantityHeader = document.createElement('h3');
      var quantityValue = document.createElement('span');
      quantityValue.id = "".concat(key, "-value");
      quantityValue.textContent = totals[key].toLocaleString(); // Display formatted count
      // Append count to header

      quantityHeader.appendChild(quantityValue); // Create the product name/label as a paragraph

      var productLabel = document.createElement('p');
      productLabel.textContent = "Total ".concat(key); // Append elements in the proper structure

      gtsValue.appendChild(iconWrapper);
      gtsValue.appendChild(quantityHeader);
      gtsValue.appendChild(productLabel); // Append the main gts-value container to itemContainer

      itemContainer.appendChild(gtsValue); // Append the itemContainer to the gridItem and add it to the main container

      gridItem.appendChild(itemContainer);
      areaCards.querySelector('.gts-grid').appendChild(gridItem);
    });
  }
};
var SitesReportsProducts = {
  init: function init() {
    var productSalesChart = document.querySelector('#productSalesChart');

    if (productSalesChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(SitesReportsProducts.fetchData);
    }
  },
  fetchData: function fetchData() {
    var response;
    return regeneratorRuntime.async(function fetchData$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return regeneratorRuntime.awrap(FetchData.init());

          case 2:
            response = _context8.sent;
            google.charts.setOnLoadCallback(function () {
              return SitesReportsProducts.drawChart(response.company_list);
            });

          case 4:
          case "end":
            return _context8.stop();
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
  drawChart: function drawChart(sites) {
    var _ref3, backgroundColor, txtColor, productTotals, data, chartRows, options, chart;

    return regeneratorRuntime.async(function drawChart$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref3 = _context9.sent;
            backgroundColor = _ref3.backgroundColor;
            txtColor = _ref3.txtColor;
            // Aggregate total sales per product
            productTotals = {
              Gasoline95: 0,
              Gasoline92: 0,
              Diesel: 0
            };
            sites.forEach(function (gov) {
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

              var tooltip = "<div class=\"cus_tooltip\"><b>".concat(product, "</b><br>").concat(SitesReportsProducts.parseFormattedNumber(total.toFixed(2)), " L</div>");
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
            return _context9.stop();
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
          SitesReportsProducts.init();
        }
      });
    }
  }
};
var RunCharts = {
  init: function init() {
    SitesReportsProducts.init();
    ReloadAlarmsCharts.init();
  }
};

_portal.AppearanceToggle.registerCallback(function (mode) {
  ReloadAlarmsCharts.chartReload();
});

(0, _script.pageReady)(function () {
  SitesReportsDT.init();
  SitesReportsFilter.init();
  RunCharts.init();
  Products.init();
  CentralAreas.init();
});