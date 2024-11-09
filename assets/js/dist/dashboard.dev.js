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

var ProductLabels = {
  "gas95": "Gasoline 95",
  "gas92": "Gasoline 92",
  "gas91": "Gasoline 91",
  "gas80": "Gasoline 80",
  "diesel": "Diesel",
  "cng": "CNG"
}; // Shared Download Chart

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

      _script.Popover.setWidth(e.currentTarget, popoverBody);

      _script.Popover.setPosition(e.currentTarget, popoverBody);
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
}; // Fetch Product Data

var Products = {
  init: function init() {
    var products;
    return regeneratorRuntime.async(function init$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.dashboardProducts));

          case 2:
            products = _context.sent;
            Products.renderProducts(products);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  renderProducts: function renderProducts(products) {
    var productsCards = document.getElementById('productsCards');

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
        quantityValue.textContent = Products.parseFormattedNumber(products[key]); // Add unit after the value

        quantityHeader.appendChild(quantityValue);
        quantityHeader.insertAdjacentText('beforeend', ' lts'); // Create the product name/label as a paragraph

        var productLabel = document.createElement('p');
        productLabel.textContent = ProductLabels[key] || key; // Append elements in the proper structure

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
    productsCards.style.width = "".concat(itemWidth * 3, " + 15") + "px";
  },
  parseFormattedNumber: function parseFormattedNumber(numberStr) {
    var formattedNumber = numberStr.replace(/,/g, '').trim();
    var parsedNumber = parseFloat(formattedNumber);

    if (isNaN(parsedNumber)) {
      console.error('Invalid number format:', numberStr);
      return '0'; // Return a string so it can be displayed
    } // Format the number with commas


    return parsedNumber.toLocaleString();
  }
}; // Product Usage

var ProductsUsage = {
  init: function init() {
    var gasolineChartWrapper = document.getElementById('currentUsageChart');

    if (gasolineChartWrapper) {
      // Step 1: Load Google Charts library
      google.charts.load('current', {
        packages: ['corechart']
      }); // Step 2: Set callback to run when the library is loaded

      google.charts.setOnLoadCallback(ProductsUsage.drawPieChart);
    }
  },
  // Step 4: Function to draw the Pie Chart
  drawPieChart: function drawPieChart() {
    var _ref, backgroundColor, data, products, slices, windowWidth, options, gasolineChartWrapper, chart;

    return regeneratorRuntime.async(function drawPieChart$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref = _context2.sent;
            backgroundColor = _ref.backgroundColor;
            // Create the data table
            data = new google.visualization.DataTable();
            data.addColumn('string', 'Fuel Type');
            data.addColumn('number', 'Liters');
            data.addColumn({
              type: 'string',
              role: 'style'
            });
            _context2.next = 10;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.dashboardProducts));

          case 10:
            products = _context2.sent;

            if (!(!products || Object.keys(products).length === 0)) {
              _context2.next = 14;
              break;
            }

            console.error("No product data available");
            return _context2.abrupt("return");

          case 14:
            // Populate data table and prepare slices for each product dynamically
            slices = {};
            Object.keys(products).forEach(function (key, index) {
              var productName = ProductLabels[key] || key;
              var productValue = Number(products[key]);

              if (!isNaN(productValue)) {
                var colorCode = key;
                if (key === 'gas95') colorCode = 'gasoline95';
                if (key === 'gas92') colorCode = 'gasoline92';
                if (key === 'gas91') colorCode = 'gasoline91';
                if (key === 'gas80') colorCode = 'gasoline80';
                var color = _constant.SharedColors[colorCode.toLowerCase()] || '#ccc';
                data.addRow([productName, productValue, "color: ".concat(color)]); // Use SharedColors with lowercase product name as the key

                slices[index] = {
                  offset: 0.04,
                  textStyle: {
                    color: backgroundColor
                  },
                  borderColor: backgroundColor,
                  borderWidth: 0,
                  color: color // Ensure the color is included here

                };
              } else {
                console.warn("Invalid number value for ".concat(productName, ": ").concat(products[key]));
              }
            });
            windowWidth = window.innerWidth; // Set chart options with dynamically created slices

            options = {
              title: '',
              is3D: false,
              backgroundColor: backgroundColor,
              slices: slices,
              // Dynamic slices based on data
              pieSliceBorderColor: backgroundColor,
              chartArea: {
                width: windowWidth < 769 ? '80%' : '75%',
                height: windowWidth < 769 ? '80%' : '75%'
              },
              pieSliceText: 'percentage',
              // Show percentage in slices
              legend: {
                position: 'none'
              } // Hide the default legend

            }; // Draw the chart in the specified div

            gasolineChartWrapper = document.getElementById('currentUsageChart');
            chart = new google.visualization.PieChart(gasolineChartWrapper);
            chart.draw(data, options); // Step 5: Draw the legend beneath the chart

            ProductsUsage.createLegend(gasolineChartWrapper, data, options);

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  // Step 6: Create a custom legend with colored circles below the chart
  createLegend: function createLegend(wrapper, data, options) {
    var legendContainer = wrapper.parentNode.querySelector('.chart-legend');
    legendContainer.innerHTML = ''; // Clear any existing legend items
    // Loop through chart data to dynamically create legend items

    for (var i = 0; i < data.getNumberOfRows(); i++) {
      var label = data.getValue(i, 0);
      var color = options.slices[i].color || '#000'; // get color from slices

      var legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
      legendItem.innerHTML = "\n                <span class=\"legend-color\" style=\"background-color: ".concat(color, ";\"></span>\n                <span class=\"legend-label\">").concat(label, "</span>\n            ");
      legendContainer.appendChild(legendItem);
    }
  }
}; // Site Status

var SiteStatus = {
  init: function init() {
    var onlineSites = document.getElementById('onlineSitesChart');
    var offlineSites = document.getElementById('offlineSitesChart');

    if (onlineSites && offlineSites) {
      // Step 1: Load Google Charts library
      google.charts.load('current', {
        packages: ['corechart']
      }); // Step 2: Set callback to run when the library is loaded

      google.charts.setOnLoadCallback(SiteStatus.drawChart);
    }
  },
  drawChart: function drawChart() {
    var _ref2, secondaryBgColor, secondaryAlphaColor, sites, totalSites;

    return regeneratorRuntime.async(function drawChart$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref2 = _context3.sent;
            secondaryBgColor = _ref2.secondaryBgColor;
            secondaryAlphaColor = _ref2.secondaryAlphaColor;
            _context3.next = 7;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.dashboardOnlineOffline));

          case 7:
            sites = _context3.sent;

            if (!(!sites || Object.keys(sites).length === 0)) {
              _context3.next = 11;
              break;
            }

            console.error("No sites data available");
            return _context3.abrupt("return");

          case 11:
            // Calculate total sites
            totalSites = sites.online + sites.offline; // Update total, online, and offline site values in HTML

            document.getElementById('totalSitesValue').textContent = totalSites;
            document.getElementById('onlineSitesValue').textContent = sites.online;
            document.getElementById('offlineSitesValue').textContent = sites.offline; // Draw the charts for online and offline sites

            SiteStatus.drawDonutChart('onlineSitesChart', sites.online, totalSites, _constant.SharedColors.online, secondaryBgColor, secondaryAlphaColor);
            SiteStatus.drawDonutChart('offlineSitesChart', sites.offline, totalSites, _constant.SharedColors.offline, secondaryBgColor, secondaryAlphaColor);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  drawDonutChart: function drawDonutChart(elementId, value, total, color, secondaryBgColor, secondaryAlphaColor) {
    var windowWidth = window.innerWidth;
    var data = google.visualization.arrayToDataTable([['Status', 'Sites'], ['Value', value], ['Remaining', total - value]]);
    var options = {
      pieHole: 0.65,
      pieStartAngle: 0,
      pieSliceText: 'none',
      // Hide value text inside the chart
      slices: {
        0: {
          color: color,
          offset: 0.1
        },
        1: {
          color: secondaryAlphaColor
        }
      },
      backgroundColor: secondaryBgColor,
      legend: 'none',
      pieSliceBorderColor: secondaryBgColor,
      chartArea: {
        width: windowWidth < 769 ? '80%' : '80%',
        height: windowWidth < 769 ? '80%' : '80%'
      }
    }; // Create and draw the chart

    var chart = new google.visualization.PieChart(document.getElementById(elementId));
    chart.draw(data, options);
  }
}; // Sales Trend

var SalesTrend = {
  currentTab: 'today',
  // Default to 'today'
  init: function init() {
    var salesTrendChart = document.getElementById('salesTrendChart');

    if (salesTrendChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(SalesTrend.fetchData);
      SalesTrend.tabSwtch(salesTrendChart);
    }
  },
  tabSwtch: function tabSwtch(wrapper) {
    var salesTabsNodeList = wrapper.parentNode.querySelectorAll('.tab-btn');

    if (salesTabsNodeList.length) {
      salesTabsNodeList.forEach(function (tab) {
        tab.addEventListener('click', function () {
          salesTabsNodeList.forEach(function (item) {
            item.classList.remove('active');
          });
          tab.classList.add('active');
          var selectedTab = tab.getAttribute('data-tab-target');
          console.log('salesTabsNodeList', selectedTab);
          SalesTrend.setTab(selectedTab);
        });
      });
    }
  },
  // This function will set the current tab and trigger data fetching
  setTab: function setTab(tab) {
    SalesTrend.currentTab = tab; // Set the current tab

    SalesTrend.fetchData(); // Fetch data based on the selected tab
  },
  fetchData: function fetchData() {
    var salesByDate, salesArray, sales;
    return regeneratorRuntime.async(function fetchData$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.t0 = SalesTrend.currentTab;
            _context4.next = _context4.t0 === 'today' ? 3 : _context4.t0 === 'yesterday' ? 6 : _context4.t0 === 'lastWeek' ? 9 : _context4.t0 === 'lastMonth' ? 12 : 15;
            break;

          case 3:
            salesByDate = _constant.API_PATHS.dashboardSalesToday;
            salesArray = 'sales_by_hour';
            return _context4.abrupt("break", 17);

          case 6:
            salesByDate = _constant.API_PATHS.dashboardSalesYesterday;
            salesArray = 'sales_by_hour';
            return _context4.abrupt("break", 17);

          case 9:
            salesByDate = _constant.API_PATHS.dashboardSalesLastWeek;
            salesArray = 'sales_by_day';
            return _context4.abrupt("break", 17);

          case 12:
            salesByDate = _constant.API_PATHS.dashboardSalesLastMonth;
            salesArray = 'sales_by_week';
            return _context4.abrupt("break", 17);

          case 15:
            console.error('Unknown tab:', SalesTrend.currentTab);
            return _context4.abrupt("return");

          case 17:
            _context4.next = 19;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(salesByDate));

          case 19:
            sales = _context4.sent;

            if (!(!sales || Object.keys(sales).length === 0)) {
              _context4.next = 23;
              break;
            }

            console.error("No sales data available");
            return _context4.abrupt("return");

          case 23:
            // Update the chart with new data
            google.charts.load('current', {
              packages: ['corechart']
            });
            google.charts.setOnLoadCallback(function () {
              return SalesTrend.drawChart(sales[salesArray]);
            });

          case 25:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  // Updated drawChart function
  drawChart: function drawChart(sales) {
    var _ref3, backgroundColor, data, products, timeUnit, timeUnits, formatTimeUnit, formattedTimeUnits, options, chart;

    return regeneratorRuntime.async(function drawChart$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref3 = _context5.sent;
            backgroundColor = _ref3.backgroundColor;
            // Create the DataTable
            data = new google.visualization.DataTable();
            products = _toConsumableArray(new Set(sales.map(function (item) {
              return item.gradeid__name;
            }))); // Dynamically add columns based on the data structure

            _context5.t0 = SalesTrend.currentTab;
            _context5.next = _context5.t0 === 'today' ? 9 : _context5.t0 === 'yesterday' ? 9 : _context5.t0 === 'lastWeek' ? 11 : _context5.t0 === 'lastMonth' ? 13 : 15;
            break;

          case 9:
            data.addColumn('string', 'Hour');
            return _context5.abrupt("break", 15);

          case 11:
            data.addColumn('string', 'Day');
            return _context5.abrupt("break", 15);

          case 13:
            data.addColumn('string', 'Week');
            return _context5.abrupt("break", 15);

          case 15:
            // Add columns dynamically for each product
            products.forEach(function (product) {
              data.addColumn('number', product);
            }); // Determine the correct time unit for the selected tab (hour, day, week)

            timeUnit = SalesTrend.getTimeUnit(); // 'hour', 'day', or 'week'
            // Extract raw time units (no formatting yet)

            timeUnits = _toConsumableArray(new Set(sales.map(function (item) {
              return item[timeUnit];
            }))); // If timeUnits are empty, log to debug

            if (timeUnits.length === 0) {
              console.error("No time units found. Check the sales data and time unit mapping.");
            } // Function to format the raw date into a readable string (e.g., "12:30 PM" for hours)


            formatTimeUnit = function formatTimeUnit(unit, timeUnit) {
              var date = new Date(unit); // Create a Date object from the time unit
              // Format according to the selected time unit (hour, day, or week)

              switch (timeUnit) {
                case 'hour':
                  var hours = date.getHours();
                  var minutes = date.getMinutes();
                  var period = hours >= 12 ? 'PM' : 'AM';
                  return "".concat(hours % 12 || 12, ":").concat(minutes < 10 ? '0' : '').concat(minutes, " ").concat(period);

                case 'day':
                  var _options = {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  };
                  return date.toLocaleDateString('en-US', _options);
                // Format as 'Wed, Dec 07, 2022'

                case 'week':
                  var startOfWeek = new Date(date.setDate(date.getDate() - date.getDay())); // Get the start of the week

                  return "Week of ".concat(startOfWeek.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  }));

                default:
                  return unit;
                // If no formatting needed
              }
            }; // Prepare data rows based on the selected time period (hour, day, week)


            formattedTimeUnits = timeUnits.map(function (unit) {
              return formatTimeUnit(unit, timeUnit);
            }); // Format all time units

            formattedTimeUnits.forEach(function (unit, index) {
              var row = [unit]; // Initialize row with the formatted time unit (hour, day, week)
              // For each product, filter the sales data and sum the total money for that time unit

              products.forEach(function (product) {
                var salesForProduct = sales.filter(function (item) {
                  return item.gradeid__name === product && item[timeUnit] === timeUnits[index];
                });
                var totalMoney = salesForProduct.reduce(function (sum, item) {
                  return sum + parseFloat(item.total_money || 0);
                }, 0); // Sum the total money for that product

                row.push(totalMoney); // Add the total money for the product in that time unit
              }); // Add the row to the DataTable

              data.addRow(row);
            }); // Chart options

            options = {
              title: '',
              // curveType: 'function',
              legend: {
                position: 'none'
              },
              isStacked: false,
              backgroundColor: backgroundColor,
              hAxis: {
                title: SalesTrend.getAxisLabel()
              },
              vAxis: {
                title: ''
              },
              chartArea: {
                width: '75%',
                height: '80%'
              },
              colors: products.map(function (product, index) {
                return _constant.SharedColors[product.toLowerCase()];
              }),
              lineWidth: 3
            }; // Create and draw the chart

            chart = new google.visualization.LineChart(document.getElementById('salesTrendChart'));
            chart.draw(data, options);

          case 25:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  // Utility function to get the time unit based on the selected tab
  getTimeUnit: function getTimeUnit() {
    switch (SalesTrend.currentTab) {
      case 'today':
      case 'yesterday':
        return 'hour';
      // Hourly data

      case 'lastWeek':
        return 'day';
      // Daily data

      case 'lastMonth':
        return 'week';
      // Weekly data

      default:
        return 'hour';
      // Default to hour
    }
  },
  // Utility function to get the label for the x-axis based on the selected tab
  getAxisLabel: function getAxisLabel() {
    switch (SalesTrend.currentTab) {
      case 'today':
      case 'yesterday':
        return 'Hour';

      case 'lastWeek':
        return 'Day';

      case 'lastMonth':
        return 'Week';

      default:
        return 'Time';
    }
  }
}; // Product Sales

var ProductSales = {
  init: function init() {
    var productSalesChart = document.querySelector('#productSalesChart');

    if (productSalesChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(ProductSales.fetchData);
    }
  },
  fetchData: function fetchData() {
    var sales;
    return regeneratorRuntime.async(function fetchData$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.dashboardSalesToday));

          case 2:
            sales = _context6.sent;

            if (!(!sales || Object.keys(sales).length === 0)) {
              _context6.next = 6;
              break;
            }

            console.error("No sales data available");
            return _context6.abrupt("return");

          case 6:
            // Update the chart with new data
            google.charts.load('current', {
              packages: ['corechart']
            });
            google.charts.setOnLoadCallback(function () {
              return ProductSales.drawChart(sales.sales_by_hour);
            });

          case 8:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  drawChart: function drawChart(sales) {
    var _ref4, backgroundColor, data, products, options, chart;

    return regeneratorRuntime.async(function drawChart$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref4 = _context7.sent;
            backgroundColor = _ref4.backgroundColor;
            data = new google.visualization.DataTable(); // Add columns for the product name and total sales amount

            data.addColumn('string', 'Product');
            data.addColumn('number', 'Total Sales');
            data.addColumn({
              type: 'string',
              role: 'style'
            }); // Get unique products from the sales data

            products = _toConsumableArray(new Set(sales.map(function (item) {
              return item.gradeid__name;
            }))); // Calculate total sales and add rows with color for each product

            products.forEach(function (product) {
              var totalSales = sales.filter(function (item) {
                return item.gradeid__name === product;
              }).reduce(function (sum, item) {
                return sum + parseFloat(item.total_money);
              }, 0);
              var color = _constant.SharedColors[product.toLowerCase()] || '#ccc';
              data.addRow([product, totalSales, "color: ".concat(color)]); // Adding color to each row
            }); // Set up chart options

            options = {
              backgroundColor: backgroundColor,
              legend: {
                position: 'none'
              },
              bar: {
                groupWidth: '60%'
              },
              chartArea: {
                width: '80%',
                height: '80%'
              },
              hAxis: {
                title: ''
              },
              vAxis: {
                title: ''
              }
            }; // Create and draw the bar chart

            chart = new google.visualization.ColumnChart(document.getElementById('productSalesChart'));
            chart.draw(data, options);

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    });
  }
}; // System Alarms

var SystemAlarms = {
  init: function init() {
    var systemAlarmsChart = document.getElementById('systemAlarmsChart');

    if (systemAlarmsChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(SystemAlarms.fetchData);
    }
  },
  fetchData: function fetchData() {
    var alarms;
    return regeneratorRuntime.async(function fetchData$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.systemAlarms));

          case 2:
            alarms = _context8.sent;

            if (!(!alarms || Object.keys(alarms).length === 0)) {
              _context8.next = 6;
              break;
            }

            console.error("No alarms data available");
            return _context8.abrupt("return");

          case 6:
            // Update the chart with new data
            google.charts.load('current', {
              packages: ['corechart']
            });
            google.charts.setOnLoadCallback(function () {
              return SystemAlarms.drawChart(alarms);
            });

          case 8:
          case "end":
            return _context8.stop();
        }
      }
    });
  },
  drawChart: function drawChart(alarms) {
    var _ref5, backgroundColor, data, formatAlarmName, options, chart;

    return regeneratorRuntime.async(function drawChart$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref5 = _context9.sent;
            backgroundColor = _ref5.backgroundColor;
            data = new google.visualization.DataTable(); // Define columns: 'Alarm Type' for the name, 'Count' for the value, and 'Style' for the color

            data.addColumn('string', 'Alarm Type');
            data.addColumn('number', 'Count');
            data.addColumn({
              type: 'string',
              role: 'style'
            }); // Function to format alarm names dynamically

            formatAlarmName = function formatAlarmName(name) {
              return name.replace(/_/g, ' ').replace(/\b\w/g, function (_char) {
                return _char.toUpperCase();
              });
            }; // Populate rows dynamically based on fetched alarm data


            alarms.forEach(function (alarm) {
              var _alarm = _slicedToArray(alarm, 2),
                  name = _alarm[0],
                  count = _alarm[1]; // Use first number in each array as the count


              var formattedName = formatAlarmName(name.toLowerCase());
              data.addRow([formattedName, count, '#6B6ED2']);
            }); // Chart options for the waterfall chart

            options = {
              backgroundColor: backgroundColor,
              legend: {
                position: 'none'
              },
              // No legend needed
              bar: {
                groupWidth: '52%'
              },
              chartArea: {
                width: '80%',
                height: '80%'
              },
              hAxis: {
                title: ''
              },
              vAxis: {
                title: ''
              }
            }; // Create and draw the waterfall chart

            chart = new google.visualization.ColumnChart(document.getElementById('systemAlarmsChart'));
            chart.draw(data, options);

          case 13:
          case "end":
            return _context9.stop();
        }
      }
    });
  }
}; // Operational Alarms

var OperationalAlarms = {
  init: function init() {
    var operationalAlarmsChart = document.getElementById('operationalAlarmsDonutChart');

    if (operationalAlarmsChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(OperationalAlarms.fetchData);
    }
  },
  fetchData: function fetchData() {
    var alarms;
    return regeneratorRuntime.async(function fetchData$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.operationalAlarms));

          case 2:
            alarms = _context10.sent;

            if (!(!alarms || alarms.length === 0)) {
              _context10.next = 6;
              break;
            }

            console.error("No operational alarms data available");
            return _context10.abrupt("return");

          case 6:
            // Load Google Charts and draw chart with fetched data
            google.charts.setOnLoadCallback(function () {
              return OperationalAlarms.drawChart(alarms);
            });

          case 7:
          case "end":
            return _context10.stop();
        }
      }
    });
  },
  drawChart: function drawChart(alarms) {
    var _ref6, backgroundColor, data, colors, options, operationalAlarmsDonutChart, chart;

    return regeneratorRuntime.async(function drawChart$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref6 = _context11.sent;
            backgroundColor = _ref6.backgroundColor;
            data = new google.visualization.DataTable(); // Define the columns

            data.addColumn('string', 'Alarm Type');
            data.addColumn('number', 'Count'); // Map alarm data to chart data with formatted names

            alarms.forEach(function (alarm) {
              var alarmName = alarm[0].toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, function (_char2) {
                return _char2.toUpperCase();
              }); // Capitalize each word

              var alarmCount = alarm[1];
              data.addRow([alarmName, alarmCount]);
            }); // Define the colors, alternating between #000 and #eeee

            colors = alarms.map(function (_, index) {
              return index % 2 === 0 ? '#2D99FC' : '#83D0FF';
            }); // Set up chart options

            options = {
              backgroundColor: backgroundColor,
              pieSliceBorderColor: backgroundColor,
              colors: colors,
              pieHole: 0.5,
              slices: {
                0: {
                  offset: 0.1
                }
              },
              legend: {
                position: 'none'
              },
              chartArea: {
                width: '80%',
                height: '80%'
              }
            }; // Create and draw the pie chart

            operationalAlarmsDonutChart = document.getElementById('operationalAlarmsDonutChart');
            chart = new google.visualization.PieChart(operationalAlarmsDonutChart);
            chart.draw(data, options);
            OperationalAlarms.createLegend(operationalAlarmsDonutChart, data, colors);

          case 14:
          case "end":
            return _context11.stop();
        }
      }
    });
  },
  createLegend: function createLegend(wrapper, data, colors) {
    var legendContainer = wrapper.parentNode.querySelector('.chart-legend');
    legendContainer.innerHTML = ''; // Clear any existing legend items
    // Loop through chart data to dynamically create legend items

    for (var i = 0; i < data.getNumberOfRows(); i++) {
      var label = data.getValue(i, 0);
      var legendItem = document.createElement('div');
      legendItem.classList.add('legend-item');
      legendItem.innerHTML = "\n                <span class=\"legend-color\" style=\"background-color: ".concat(colors[i], ";\"></span>\n                <span class=\"legend-label\">").concat(label, "</span>\n            ");
      legendContainer.appendChild(legendItem);
    }
  }
};
var TanksPercentage = 90;
var TanksVolume = {
  init: function init() {
    var tankVolumeChart = document.querySelector('#tankVolumeChart');
    var tankPercentageChart = document.querySelector('#tankPercentageChart');

    if (tankVolumeChart && tankPercentageChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(TanksVolume.fetchData);
    }
  },
  fetchData: function fetchData() {
    var sitesData, sites;
    return regeneratorRuntime.async(function fetchData$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.dashboardSites));

          case 2:
            sitesData = _context12.sent;

            if (!(!sitesData || !sitesData.sitesnumbers || sitesData.sitesnumbers.length === 0)) {
              _context12.next = 6;
              break;
            }

            console.error("No sites data available");
            return _context12.abrupt("return");

          case 6:
            sites = sitesData.sitesnumbers;
            TanksVolume.siteDropDown(sites);
            google.charts.setOnLoadCallback(function () {
              return TanksVolume.drawColumnChart(sites);
            });
            TanksVolume.threshold(sites);

          case 10:
          case "end":
            return _context12.stop();
        }
      }
    });
  },
  siteDropDown: function siteDropDown(sites) {
    var sitesList = document.querySelector('#tanks-sites-list ul');
    var siteFilterInput = document.querySelector('#tanks-sites-list .site-filter input');
    var siteName = document.querySelector('.site-name');
    var tanksAmount = document.querySelector('#tanksAmount'); // Populate the dropdown with site items

    sites.forEach(function (site, index) {
      var listItem = document.createElement('li');
      var siteNumberSpan = document.createElement('span');
      siteNumberSpan.classList.add('site-number');
      siteNumberSpan.textContent = "#".concat(site.sitenumber);
      var tanksLengthSpan = document.createElement('span');
      tanksLengthSpan.classList.add('tanks-length');
      tanksLengthSpan.textContent = "".concat(site.tanks, " Tanks");
      listItem.appendChild(siteNumberSpan);
      listItem.appendChild(tanksLengthSpan);
      listItem.dataset.sitenumber = site.sitenumber;
      listItem.dataset.tanks = site.tanks;
      listItem.classList.add('site-item'); // Add click event to update selected site

      listItem.addEventListener('click', function () {
        document.querySelectorAll('.site-item').forEach(function (item) {
          return item.classList.remove('active');
        });
        listItem.classList.add('active');
        siteName.textContent = "".concat(site.sitenumber);
        tanksAmount.textContent = site.tanks;
      }); // Select the first item by default

      if (index === 0) {
        listItem.classList.add('active');
        siteName.textContent = "".concat(site.sitenumber);
        tanksAmount.textContent = site.tanks;
      }

      sitesList.appendChild(listItem);
    }); // Filter sites by sitenumber

    siteFilterInput.addEventListener('input', function () {
      var filterValue = siteFilterInput.value.toLowerCase();
      document.querySelectorAll('.site-item').forEach(function (item) {
        var sitenumber = item.dataset.sitenumber.toString();

        if (sitenumber.includes(filterValue)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  },
  threshold: function threshold(sites) {
    var thresholdWrapper = document.querySelector('#threshold');
    var thresholdList = document.querySelectorAll('#tanks-threshold-list ul li');
    var threshold = TanksPercentage; // Set initial threshold display

    if (thresholdWrapper) {
      thresholdWrapper.textContent = "".concat(TanksPercentage, "%");
    } // Add 'active' class to the list item that matches the initial threshold


    if (thresholdList.length) {
      thresholdList.forEach(function (item) {
        // Check if data-value matches the current threshold
        if (Number(item.dataset.value) === threshold) {
          item.classList.add('active');
        } // Add click event listener to update the threshold on click


        item.addEventListener('click', function () {
          // Update threshold to the clicked item's data-value
          threshold = Number(item.dataset.value);
          console.log('TanksPercentage', threshold); // Update the threshold display

          if (thresholdWrapper) {
            thresholdWrapper.textContent = "".concat(threshold, "%");
          } // Remove 'active' class from all items and apply to clicked item


          thresholdList.forEach(function (el) {
            return el.classList.remove('active');
          });
          item.classList.add('active'); // Redraw the chart with the new threshold value

          google.charts.setOnLoadCallback(function () {
            return TanksVolume.drawPieChart(sites, threshold);
          });
        });
      });
    } // Draw the chart initially


    google.charts.setOnLoadCallback(function () {
      return TanksVolume.drawPieChart(sites, threshold);
    });
  },
  drawColumnChart: function drawColumnChart(sites) {
    return regeneratorRuntime.async(function drawColumnChart$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
          case "end":
            return _context13.stop();
        }
      }
    });
  },
  drawPieChart: function drawPieChart(sites, threshold) {
    return regeneratorRuntime.async(function drawPieChart$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
          case "end":
            return _context14.stop();
        }
      }
    });
  }
}; // Run All Charts

var RunCharts = {
  init: function init() {
    ProductsUsage.init();
    SiteStatus.init();
    SalesTrend.init();
    ProductSales.init();
    SystemAlarms.init();
    OperationalAlarms.init();
    TanksVolume.init(); // SiteStatusChart.init();
    // SystemAlarmsChart.init();
    // OperationalAlarmsBarChart.init();
    // TankVolumeBarChart.init();

    ReloadCharts.init();
  }
}; // We will Reload Charts on Menu Collapsed And Apperacnce Toggle

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
      } // Optional: If your charts have specific cleanup logic, call that here
      // Example: ProductsUsage.clear(); or similar if implemented
      // Step 3: Reload the charts


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
(0, _script.pageReady)(function () {
  DownloadChart.init();
  Products.init();
  RunCharts.init();
});