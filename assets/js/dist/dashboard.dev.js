"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReloadCharts = void 0;

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
}; // DateSwitch

var DateSwitch = {
  init: function init(wrapper, component) {
    // Step 1: Clone and append a unique popover
    var uniquePopoverId = "".concat(wrapper.id.toLowerCase(), "-popover"); // Unique ID for each wrapper

    if (!document.getElementById(uniquePopoverId)) {
      var sharedPopover = document.querySelector('#date-filter'); // Shared template

      var clonedPopover = sharedPopover.cloneNode(true); // Clone the popover

      clonedPopover.id = uniquePopoverId; // Assign unique ID

      wrapper.parentNode.appendChild(clonedPopover); // Append to the wrapper's parent
    } // Step 2: Use the unique popover


    var cardTabs = wrapper.parentNode.querySelector('[data-popover-target="#date-filter"]');

    if (cardTabs) {
      cardTabs.setAttribute('data-popover-target', "#".concat(uniquePopoverId)); // Update to unique ID

      var selectedDate = cardTabs.querySelector('.selectedDate');
      var uniquePopover = document.getElementById(uniquePopoverId); // Use unique popover

      var cardTabsNodeList = uniquePopover.querySelectorAll('.tab-btn'); // Buttons in this popover
      // Initialize the selected date text

      selectedDate.textContent = DateSwitch.formatTabName(component.currentTab);

      if (cardTabsNodeList.length) {
        cardTabsNodeList.forEach(function (tab) {
          // Attach event listeners scoped to this popover
          tab.addEventListener('click', function () {
            console.log('Clicked on:', wrapper.id); // Log correct wrapper
            // Clear 'active' class only in this unique popover

            cardTabsNodeList.forEach(function (item) {
              return item.classList.remove('active');
            });
            tab.classList.add('active');
            var selectedTab = tab.getAttribute('data-tab-target');
            DateSwitch.setTab(selectedTab, component); // Update the selected date text for this wrapper only

            selectedDate.textContent = DateSwitch.formatTabName(selectedTab);
          });
        });
      }
    }
  },
  setTab: function setTab(selectedTab, component) {
    component.currentTab = selectedTab;
    component.fetchData(); // Trigger data fetch only for the specific component
  },
  formatTabName: function formatTabName(tabName) {
    // Format the tab name for display
    return tabName.replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, function (str) {
      return str.toUpperCase();
    }) // Capitalize the first letter
    .trim();
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
                if (key === 'gas95') colorCode = 'Gasoline95';
                if (key === 'gas92') colorCode = 'Gasoline92';
                if (key === 'gas91') colorCode = 'Gasoline91';
                if (key === 'gas80') colorCode = 'Gasoline80';
                if (key === 'diesel') colorCode = 'Diesel';
                if (key === 'cng') colorCode = 'CNG';
                var color = _constant.SharedColors[colorCode] || '#ccc';
                data.addRow([productName, productValue, "color: ".concat(color)]); // Use SharedColors with lowercase product name as the key

                slices[index] = {
                  offset: 0.04,
                  borderColor: backgroundColor,
                  borderWidth: 0,
                  color: color
                };
              } else {
                console.warn("Invalid number value for ".concat(productName, ": ").concat(products[key]));
              }
            });
            windowWidth = window.innerWidth; // Set chart options with dynamically created slices

            options = {
              title: '',
              tooltip: {
                isHtml: true
              },
              backgroundColor: backgroundColor,
              slices: slices,
              // Dynamic slices based on data
              pieSliceBorderColor: backgroundColor,
              chartArea: {
                width: windowWidth < 769 ? '80%' : '75%',
                height: windowWidth < 769 ? '80%' : '75%'
              },
              // pieSliceText: 'percentage',  // Show percentage in slices
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

            SiteStatus.drawDonutChart('onlineSitesChart', 'Online Sites', sites.online, totalSites, _constant.SharedColors.Online, secondaryBgColor, secondaryAlphaColor);
            SiteStatus.drawDonutChart('offlineSitesChart', 'Offline Sites', sites.offline, totalSites, _constant.SharedColors.Offline, secondaryBgColor, secondaryAlphaColor);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  drawDonutChart: function drawDonutChart(elementId, label, value, total, color, secondaryBgColor, secondaryAlphaColor) {
    var windowWidth = window.innerWidth;
    var data = google.visualization.arrayToDataTable([['Status', 'Sites'], [label, value], ['Remaining', total - value]]);
    var options = {
      pieHole: 0.65,
      pieStartAngle: 0,
      tooltip: {
        isHtml: true
      },
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
      DateSwitch.init(salesTrendChart, SalesTrend);
    }
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
    var _ref3, backgroundColor, txtColor, data, products, timeUnit, timeUnits, formatTimeUnit, formattedTimeUnits, options, chart;

    return regeneratorRuntime.async(function drawChart$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref3 = _context5.sent;
            backgroundColor = _ref3.backgroundColor;
            txtColor = _ref3.txtColor;
            // Create the DataTable
            data = new google.visualization.DataTable();
            products = _toConsumableArray(new Set(sales.map(function (item) {
              return item.gradeid__name;
            }))); // Dynamically add columns based on the data structure

            _context5.t0 = SalesTrend.currentTab;
            _context5.next = _context5.t0 === 'today' ? 10 : _context5.t0 === 'yesterday' ? 10 : _context5.t0 === 'lastWeek' ? 12 : _context5.t0 === 'lastMonth' ? 14 : 16;
            break;

          case 10:
            data.addColumn('string', 'Hour');
            return _context5.abrupt("break", 16);

          case 12:
            data.addColumn('string', 'Day');
            return _context5.abrupt("break", 16);

          case 14:
            data.addColumn('string', 'Week');
            return _context5.abrupt("break", 16);

          case 16:
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
              tooltip: {
                isHtml: true
              },
              legend: {
                position: 'none'
              },
              isStacked: false,
              backgroundColor: backgroundColor,
              hAxis: {
                title: SalesTrend.getAxisLabel(),
                titleTextStyle: {
                  color: txtColor,
                  fontSize: 12
                },
                textStyle: {
                  color: txtColor,
                  fontSize: 12
                }
              },
              vAxis: {
                textStyle: {
                  color: txtColor,
                  fontSize: 12
                }
              },
              chartArea: {
                width: '75%',
                height: '80%'
              },
              colors: products.map(function (product, index) {
                return _constant.SharedColors[product];
              }),
              lineWidth: 3
            }; // Create and draw the chart

            chart = new google.visualization.LineChart(document.getElementById('salesTrendChart'));
            chart.draw(data, options);

          case 26:
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
}; // SalesInventorySwitch

var SalesInventorySwitch = {
  init: function init() {
    // Handle tab switching
    var salesInventory = document.querySelector('#salesInventory');
    var tabContainer = salesInventory.querySelector('.card-tabs');

    if (tabContainer && !tabContainer.dataset.listenerAdded) {
      tabContainer.dataset.listenerAdded = true;
      tabContainer.addEventListener('click', function (e) {
        // Get the closest button, whether the click was on the button or its wrapper
        var targetButton = e.target.closest('button');
        if (!targetButton) return; // Ignore clicks outside buttons

        var targetChart = targetButton.getAttribute('data-target-chart');
        if (!targetChart) return; // Ignore clicks on buttons without a data-target-chart
        // Remove 'active' class from all buttons and set it to the clicked one

        tabContainer.querySelectorAll('button').forEach(function (btn) {
          return btn.classList.remove('active');
        });
        targetButton.classList.add('active'); // Handle chart switching logic

        switch (targetChart) {
          case 'sales':
            SalesInventorySwitch.handleChartSwitch('productSalesChart', ProductSales.init);
            break;

          case 'inventory':
            SalesInventorySwitch.handleChartSwitch('productInventoryChart', ProductInventory.init);
            break;

          default:
            console.error('Unknown chart type:', targetChart);
        }
      });
    }
  },
  handleChartSwitch: function handleChartSwitch(chartId, initFunction) {
    var salesInventory = document.querySelector('#salesInventory');
    var existingChartContainer = salesInventory.querySelector('.chart-area');

    if (existingChartContainer) {
      existingChartContainer.remove();
    } // Create a new chart container


    var newChartContainer = document.createElement('div');
    newChartContainer.setAttribute('id', chartId);
    newChartContainer.classList.add('chart-area'); // Append the new container to the parent element of the tabs

    salesInventory.querySelector('.gts-item-content').appendChild(newChartContainer); // Initialize the appropriate chart

    if (typeof initFunction === 'function') {
      initFunction();
    } else {
      console.error('Invalid initialization function provided');
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
    var _ref4, backgroundColor, txtColor, data, products, groupWidthPercentage, options, chart;

    return regeneratorRuntime.async(function drawChart$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref4 = _context7.sent;
            backgroundColor = _ref4.backgroundColor;
            txtColor = _ref4.txtColor;
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
              var color = _constant.SharedColors[product] || '#ccc';
              data.addRow([product, totalSales, "color: ".concat(color)]); // Adding color to each row
            });
            groupWidthPercentage = ChartUtils.calculateGroupWidthPercentage('productSalesChart', products.length); // Set up chart options

            options = {
              backgroundColor: backgroundColor,
              legend: {
                position: 'none'
              },
              tooltip: {
                isHtml: true
              },
              bar: {
                groupWidth: "".concat(groupWidthPercentage, "%")
              },
              chartArea: {
                width: '80%',
                height: '80%'
              },
              hAxis: {
                textStyle: {
                  color: txtColor,
                  fontSize: 12
                }
              },
              vAxis: {
                textStyle: {
                  color: txtColor,
                  fontSize: 12
                }
              }
            }; // Create and draw the bar chart

            chart = new google.visualization.ColumnChart(document.getElementById('productSalesChart'));
            chart.draw(data, options);

          case 15:
          case "end":
            return _context7.stop();
        }
      }
    });
  }
}; // Product Inventory

var ProductInventory = {
  init: function init() {
    var productInventoryChart = document.querySelector('#productInventoryChart');

    if (productInventoryChart) {
      console.log('productInventoryChart', productInventoryChart);
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(ProductInventory.fetchData);
    }
  },
  fetchData: function fetchData() {
    var inventory;
    return regeneratorRuntime.async(function fetchData$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.currnentInventory));

          case 2:
            inventory = _context8.sent;

            if (!(!inventory || Object.keys(inventory).length === 0)) {
              _context8.next = 6;
              break;
            }

            console.error("No inventory data available");
            return _context8.abrupt("return");

          case 6:
            // Update the chart with new data
            google.charts.load('current', {
              packages: ['corechart']
            });
            google.charts.setOnLoadCallback(function () {
              return ProductInventory.drawChart(inventory.current_inventory);
            });

          case 8:
          case "end":
            return _context8.stop();
        }
      }
    });
  },
  drawChart: function drawChart(inventory) {
    var _ref5, backgroundColor, txtColor, data, products, groupWidthPercentage, options, chart;

    return regeneratorRuntime.async(function drawChart$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref5 = _context9.sent;
            backgroundColor = _ref5.backgroundColor;
            txtColor = _ref5.txtColor;
            data = new google.visualization.DataTable(); // Add columns for the product name and total sales amount

            data.addColumn('string', 'Product');
            data.addColumn('number', 'Total Inventory');
            data.addColumn({
              type: 'string',
              role: 'style'
            }); // Get unique products from the sales data

            products = _toConsumableArray(new Set(inventory.map(function (item) {
              return item.ProductName;
            }))); // Calculate total sales and add rows with color for each product

            products.forEach(function (product) {
              var totalInventory = inventory.filter(function (item) {
                return item.ProductName === product;
              }).reduce(function (sum, item) {
                return sum + parseFloat(item.TotalProductVolume);
              }, 0);
              var color = _constant.SharedColors[product] || '#ccc';
              data.addRow([product, totalInventory, "color: ".concat(color)]); // Adding color to each row
            });
            groupWidthPercentage = ChartUtils.calculateGroupWidthPercentage('productInventoryChart', products.length); // Set up chart options

            options = {
              backgroundColor: backgroundColor,
              legend: {
                position: 'none'
              },
              tooltip: {
                isHtml: true
              },
              bar: {
                groupWidth: "".concat(groupWidthPercentage, "%")
              },
              chartArea: {
                width: '80%',
                height: '80%'
              },
              hAxis: {
                textStyle: {
                  color: txtColor,
                  fontSize: 12
                }
              },
              vAxis: {
                textStyle: {
                  color: txtColor,
                  fontSize: 12
                }
              }
            }; // Create and draw the bar chart

            chart = new google.visualization.ColumnChart(document.getElementById('productInventoryChart'));
            chart.draw(data, options);

          case 15:
          case "end":
            return _context9.stop();
        }
      }
    });
  }
}; // Top Five Sites 

var TopSites = {
  currentTab: 'today',
  currency: 'SAR',
  init: function init() {
    var topFiveSites = document.querySelector('#topFiveSites');

    if (topFiveSites) {
      TopSites.fetchData();
      DateSwitch.init(topFiveSites, TopSites);
    }
  },
  fetchData: function fetchData() {
    var apiPath, apiPathArray, sites;
    return regeneratorRuntime.async(function fetchData$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.t0 = TopSites.currentTab;
            _context10.next = _context10.t0 === 'today' ? 3 : _context10.t0 === 'yesterday' ? 6 : _context10.t0 === 'week' ? 9 : _context10.t0 === 'month' ? 12 : 15;
            break;

          case 3:
            apiPath = _constant.API_PATHS.topFiveSitesToday;
            apiPathArray = 'top_five_today';
            return _context10.abrupt("break", 17);

          case 6:
            apiPath = _constant.API_PATHS.topFiveSitesYesterday;
            apiPathArray = 'top_five_yesterday';
            return _context10.abrupt("break", 17);

          case 9:
            apiPath = _constant.API_PATHS.topFiveSitesLastWeek;
            apiPathArray = 'top_five_week';
            return _context10.abrupt("break", 17);

          case 12:
            apiPath = _constant.API_PATHS.topFiveSitesLastMonth;
            apiPathArray = 'top_five_month';
            return _context10.abrupt("break", 17);

          case 15:
            apiPath = _constant.API_PATHS.topFiveSitesToday;
            apiPathArray = 'top_five_today';

          case 17:
            _context10.next = 19;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(apiPath));

          case 19:
            sites = _context10.sent;

            if (sites) {
              TopSites.progressBars(sites[apiPathArray]);
            }

          case 21:
          case "end":
            return _context10.stop();
        }
      }
    });
  },
  progressBars: function progressBars(sitesData) {
    var topFiveSites = document.querySelector('#topFiveSites');
    topFiveSites.innerHTML = ''; // Clear existing progress bars

    var maxTotalMoney = Math.max.apply(Math, _toConsumableArray(sitesData.map(function (site) {
      return parseFloat(site.total_money);
    }))); // Find the maximum value for scaling

    sitesData.forEach(function (site, index) {
      var totalMoney = parseFloat(site.total_money); // Convert total_money to a float

      var widthPercentage = totalMoney / maxTotalMoney * 100; // Calculate width as a percentage

      var wrapper = document.createElement('div');
      wrapper.classList.add('site-progressbar-wrapper');
      var container = document.createElement('div');
      container.classList.add('site-progressbar-container');
      var progressBar = document.createElement('div');
      progressBar.classList.add('site-progressbar');
      progressBar.style.width = "0%"; // Start from 0 width

      var colors = [_constant.SharedColors.TopFiveSites.First, _constant.SharedColors.TopFiveSites.Second, _constant.SharedColors.TopFiveSites.Third, _constant.SharedColors.TopFiveSites.Fourth, _constant.SharedColors.TopFiveSites.Fifth];
      progressBar.style.backgroundColor = colors[index % colors.length];
      var progressBarSiteNumber = document.createElement('span');
      progressBarSiteNumber.classList.add('site-progressbar-id');
      progressBarSiteNumber.textContent = "Site ID: ".concat(site.siteid__sitenumber);
      var progressBarValue = document.createElement('span');
      progressBarValue.classList.add('site-progressbar-value');
      progressBarValue.innerHTML = "".concat((Math.round(totalMoney / 1000) * 1000).toLocaleString(), " <span>").concat(TopSites.currency, "</span>");
      var tooltip = document.createElement('span');
      tooltip.classList.add('site-progressbar-tooltip');
      tooltip.innerHTML = "".concat(totalMoney.toLocaleString(), " <span>").concat(TopSites.currency, "<span> ");
      progressBar.addEventListener('mouseover', function () {
        tooltip.style.display = 'inline';
      });
      progressBar.addEventListener('mouseout', function () {
        tooltip.style.display = 'none';
      });
      wrapper.appendChild(container);
      wrapper.prepend(progressBarSiteNumber);
      container.appendChild(progressBar);
      container.appendChild(progressBarValue);
      container.appendChild(tooltip);
      topFiveSites.appendChild(wrapper); // Apply the correct width with a delay to create the animation effect

      setTimeout(function () {
        progressBar.style.width = "".concat(widthPercentage, "%");
      }, 70); // Delay each bar progressively by 300ms
    });
  }
}; // Fill Status

var FillStatus = {
  currentTab: 'today',
  init: function init() {
    var fillStatusList = document.querySelector('#fillStatusList');

    if (fillStatusList) {
      FillStatus.fetchData();
      DateSwitch.init(fillStatusList.parentNode, FillStatus);
    }
  },
  fetchData: function fetchData() {
    var apiDetails, fills;
    return regeneratorRuntime.async(function fetchData$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            apiDetails = FillStatus.getApiDetails(FillStatus.currentTab);
            console.log('apiDetails', apiDetails);
            _context11.prev = 2;
            _context11.next = 5;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(apiDetails.path));

          case 5:
            fills = _context11.sent;

            if (fills) {
              FillStatus.createFillStatusList(fills[apiDetails.arrayKey]);
            }

            _context11.next = 12;
            break;

          case 9:
            _context11.prev = 9;
            _context11.t0 = _context11["catch"](2);
            console.error('Error fetching fill status data:', _context11.t0);

          case 12:
          case "end":
            return _context11.stop();
        }
      }
    }, null, null, [[2, 9]]);
  },
  getApiDetails: function getApiDetails(tab) {
    console.log('tab', tab);
    var apiMappings = {
      today: {
        path: _constant.API_PATHS.fillStatusToday,
        arrayKey: 'fill_status_today'
      },
      yesterday: {
        path: _constant.API_PATHS.fillStatusYesterday,
        arrayKey: 'fill_status_yesterday'
      },
      lastWeek: {
        path: _constant.API_PATHS.fillStatusWeek,
        arrayKey: 'fill_status_week'
      },
      lastMonth: {
        path: _constant.API_PATHS.fillStatusMonth,
        arrayKey: 'fill_status_month'
      }
    };
    return apiMappings[tab] || apiMappings['today'];
  },
  createFillStatusList: function createFillStatusList(fills) {
    var fillStatusList = document.querySelector('#fillStatusList');
    if (!fillStatusList) return; // Clear the existing list

    fillStatusList.innerHTML = '';
    var totalTxn = 0;
    var totalAvgVolume = 0; // Loop through fills to create elements

    fills.forEach(function (fill) {
      var gradeid__name = fill.gradeid__name,
          total_txn = fill.total_txn,
          avg_volume = fill.avg_volume;
      var avgVolumeParsed = parseFloat(avg_volume);
      totalTxn += total_txn;
      totalAvgVolume += avgVolumeParsed;
      var element = document.createElement('div');
      element.classList.add('fill-status-product', gradeid__name.toLowerCase());
      element.innerHTML = "\n                <div class=\"product-name\">".concat(gradeid__name, "</div>\n                <div class=\"fill-product-wrapper\">\n                    <div class=\"fill-product-value\">\n                        <div class=\"fill-product-value-wrapper\">\n                            <h3>Total</h3>\n                            <div class=\"total-fill-value\">\n                                <span>").concat(total_txn, "</span> TXN\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"average-product-value\">\n                        <div class=\"average-product-value-wrapper\">\n                            <h3>Average</h3>\n                            <div class=\"total-average-value\">\n                                <span>").concat(Math.round(avgVolumeParsed), "</span> LTR\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            ");
      fillStatusList.appendChild(element);
    }); // Update stats

    FillStatus.updateStats({
      totalTxn: totalTxn,
      totalAvgVolume: totalAvgVolume
    });
  },
  updateStats: function updateStats(_ref6) {
    var totalTxn = _ref6.totalTxn,
        totalAvgVolume = _ref6.totalAvgVolume;
    var fillValue = document.querySelector('#fillValue span');
    var avgValue = document.querySelector('#avgValue span');
    if (fillValue) fillValue.textContent = totalTxn;
    if (avgValue) avgValue.textContent = Math.round(totalAvgVolume);
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
    return regeneratorRuntime.async(function fetchData$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.systemAlarms));

          case 2:
            alarms = _context12.sent;

            if (!(!alarms || Object.keys(alarms).length === 0)) {
              _context12.next = 6;
              break;
            }

            console.error("No alarms data available");
            return _context12.abrupt("return");

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
            return _context12.stop();
        }
      }
    });
  },
  drawChart: function drawChart(alarms) {
    var _ref7, backgroundColor, txtColor, data, formatAlarmName, groupWidthPercentage, options, chart;

    return regeneratorRuntime.async(function drawChart$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref7 = _context13.sent;
            backgroundColor = _ref7.backgroundColor;
            txtColor = _ref7.txtColor;
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
              data.addRow([formattedName, count, _constant.SharedColors.SystemAlarm]);
            });
            groupWidthPercentage = ChartUtils.calculateGroupWidthPercentage('systemAlarmsChart', alarms.length); // Chart options for the waterfall chart

            options = {
              backgroundColor: backgroundColor,
              legend: {
                position: 'none'
              },
              tooltip: {
                isHtml: true
              },
              bar: {
                groupWidth: "".concat(groupWidthPercentage - 5, "%")
              },
              chartArea: {
                width: '80%',
                height: '80%'
              },
              hAxis: {
                textStyle: {
                  color: txtColor,
                  fontSize: 12
                }
              },
              vAxis: {
                textStyle: {
                  color: txtColor,
                  fontSize: 12
                }
              }
            }; // Create and draw the waterfall chart

            chart = new google.visualization.ColumnChart(document.getElementById('systemAlarmsChart'));
            chart.draw(data, options);

          case 15:
          case "end":
            return _context13.stop();
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
    return regeneratorRuntime.async(function fetchData$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.operationalAlarms));

          case 2:
            alarms = _context14.sent;

            if (!(!alarms || alarms.length === 0)) {
              _context14.next = 6;
              break;
            }

            console.error("No operational alarms data available");
            return _context14.abrupt("return");

          case 6:
            // Load Google Charts and draw chart with fetched data
            google.charts.setOnLoadCallback(function () {
              return OperationalAlarms.drawChart(alarms);
            });

          case 7:
          case "end":
            return _context14.stop();
        }
      }
    });
  },
  drawChart: function drawChart(alarms) {
    var _ref8, backgroundColor, data, colors, options, operationalAlarmsDonutChart, chart;

    return regeneratorRuntime.async(function drawChart$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 2:
            _ref8 = _context15.sent;
            backgroundColor = _ref8.backgroundColor;
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
              return index % 2 === 0 ? _constant.SharedColors.DeleveryReconciliation : _constant.SharedColors.SuddenLoss;
            }); // Set up chart options

            options = {
              backgroundColor: backgroundColor,
              pieSliceBorderColor: backgroundColor,
              tooltip: {
                isHtml: true
              },
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
            return _context15.stop();
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
}; // Tanks Volume

var TanksVolume = {
  init: function init() {
    var tankVolumeChart = document.querySelector('#tankVolumeChart');

    if (tankVolumeChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(TanksVolume.fetchData);
    }
  },
  fetchData: function fetchData() {
    var sitesData, sites;
    return regeneratorRuntime.async(function fetchData$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            _context16.next = 3;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.dashboardSites));

          case 3:
            sitesData = _context16.sent;

            if (!(!sitesData || !sitesData.sitesnumbers || sitesData.sitesnumbers.length === 0)) {
              _context16.next = 7;
              break;
            }

            console.error("No sites data available");
            return _context16.abrupt("return");

          case 7:
            sites = sitesData.sitesnumbers;
            TanksVolume.populateSiteDropdown(sites); // Draw initial chart with the first site by default

            TanksVolume.drawColumnChart(sites[0].sitenumber);
            _context16.next = 15;
            break;

          case 12:
            _context16.prev = 12;
            _context16.t0 = _context16["catch"](0);
            console.error("Error fetching data:", _context16.t0);

          case 15:
          case "end":
            return _context16.stop();
        }
      }
    }, null, null, [[0, 12]]);
  },
  populateSiteDropdown: function populateSiteDropdown(sites) {
    var sitesList = document.querySelector('#tanks-sites-list ul');
    var siteFilterInput = document.querySelector('#tanks-sites-list .site-filter input');
    sitesList.innerHTML = ''; // Clear previous items if any

    sites.forEach(function (site, index) {
      var listItem = TanksVolume.createSiteListItem(site, index === 0);
      listItem.addEventListener('click', function () {
        return TanksVolume.selectSite(listItem, site);
      });
      sitesList.appendChild(listItem);
    }); // Filter functionality for dropdown

    siteFilterInput.addEventListener('input', function () {
      var filterValue = siteFilterInput.value.toLowerCase();
      document.querySelectorAll('.site-item').forEach(function (item) {
        item.style.display = item.dataset.sitenumber.includes(filterValue) ? 'flex' : 'none';
      });
    }); // Select the first item by default if sites exist

    if (sites.length > 0) {
      TanksVolume.selectSite(sitesList.firstChild, sites[0]);
    }
  },
  createSiteListItem: function createSiteListItem(site, isActive) {
    var listItem = document.createElement('li');
    listItem.classList.add('site-item');
    listItem.dataset.sitenumber = site.sitenumber;
    listItem.dataset.tanks = site.tanks;
    var siteNumberSpan = document.createElement('span');
    siteNumberSpan.classList.add('site-number');
    siteNumberSpan.textContent = "#".concat(site.sitenumber);
    var tanksLengthSpan = document.createElement('span');
    tanksLengthSpan.classList.add('tanks-length');
    tanksLengthSpan.textContent = "".concat(site.tanks, " Tanks");
    listItem.append(siteNumberSpan, tanksLengthSpan);
    if (isActive) listItem.classList.add('active');
    return listItem;
  },
  selectSite: function selectSite(listItem, site) {
    document.querySelectorAll('.site-item').forEach(function (item) {
      return item.classList.remove('active');
    });
    listItem.classList.add('active');
    var siteName = document.querySelector('[data-popover-target="#tanks-sites-list-target"] .site-name');
    var tanksAmount = document.querySelector('#tanksAmount');
    siteName.textContent = site.sitenumber;
    tanksAmount.textContent = site.tanks; // Draw the column chart for the selected site

    TanksVolume.drawColumnChart(site.sitenumber);
  },
  drawColumnChart: function drawColumnChart(siteNumber) {
    var _ref9, secondaryBgColor, txtColor, tanksData, chartData, data, groupWidthPercentage, options, chart;

    return regeneratorRuntime.async(function drawColumnChart$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.prev = 0;
            _context17.next = 3;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 3:
            _ref9 = _context17.sent;
            secondaryBgColor = _ref9.secondaryBgColor;
            txtColor = _ref9.txtColor;
            _context17.next = 8;
            return regeneratorRuntime.awrap((0, _constant.fetchData)("".concat(_constant.API_PATHS.tanksVolumes).concat(siteNumber, ".json")));

          case 8:
            tanksData = _context17.sent;

            if (!(!tanksData || tanksData.length === 0)) {
              _context17.next = 12;
              break;
            }

            console.error("No tank data available");
            return _context17.abrupt("return");

          case 12:
            // Prepare data for the Google Chart
            chartData = [['Tank', 'Volume']];
            tanksData.forEach(function (tank) {
              var _tank = _slicedToArray(tank, 2),
                  tankName = _tank[0],
                  volume = _tank[1];

              chartData.push([tankName, volume]);
            });
            data = google.visualization.arrayToDataTable(chartData);
            groupWidthPercentage = ChartUtils.calculateGroupWidthPercentage('tankVolumeChart', tanksData.length);
            options = {
              backgroundColor: secondaryBgColor,
              tooltip: {
                isHtml: true
              },
              title: '',
              colors: [_constant.SharedColors.TanksVolume],
              legend: {
                position: 'none'
              },
              bar: {
                groupWidth: "".concat(groupWidthPercentage, "%")
              },
              hAxis: {
                textStyle: {
                  color: txtColor,
                  fontSize: 12
                }
              },
              vAxis: {
                textStyle: {
                  color: txtColor,
                  fontSize: 12
                }
              }
            };
            chart = new google.visualization.ColumnChart(document.querySelector('#tankVolumeChart'));
            chart.draw(data, options);
            _context17.next = 24;
            break;

          case 21:
            _context17.prev = 21;
            _context17.t0 = _context17["catch"](0);
            console.error("Error drawing column chart:", _context17.t0);

          case 24:
          case "end":
            return _context17.stop();
        }
      }
    }, null, null, [[0, 21]]);
  }
}; // Low Stock

var LowStock = {
  TanksPercentage: 50,
  // Initialize LowStock functionality
  init: function init() {
    var tankPercentageChart = document.querySelector('#tankPercentageChart');

    if (tankPercentageChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(LowStock.fetchStockData);
    }
  },
  // Fetch stock data from API
  fetchStockData: function fetchStockData() {
    var stockData;
    return regeneratorRuntime.async(function fetchStockData$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.prev = 0;
            _context18.next = 3;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.stockData));

          case 3:
            stockData = _context18.sent;

            if (!(!stockData || !stockData.list)) {
              _context18.next = 7;
              break;
            }

            console.error("No stock data available");
            return _context18.abrupt("return");

          case 7:
            // Update TanksPercentage and populate product list and threshold setup
            LowStock.TanksPercentage = stockData.percent || LowStock.TanksPercentage;
            LowStock.fetchProduct(stockData.list);
            _context18.next = 14;
            break;

          case 11:
            _context18.prev = 11;
            _context18.t0 = _context18["catch"](0);
            console.error("Error fetching stock data:", _context18.t0);

          case 14:
          case "end":
            return _context18.stop();
        }
      }
    }, null, null, [[0, 11]]);
  },
  // Display products in the UI with click events to update the pie chart
  fetchProduct: function fetchProduct(stockList) {
    var productList = document.querySelector('#stockProductList ul');
    if (!productList) return; // Clear any existing list items

    productList.innerHTML = ''; // Iterate over each product in the stock list

    Object.keys(stockList).forEach(function (productName, index) {
      var listItem = document.createElement('li');
      listItem.textContent = productName; // Display product name

      listItem.dataset.productName = productName; // Store product name for reference

      listItem.classList.add('product-item');
      listItem.classList.add(productName.toLowerCase()); // Add 'active' class to the first item by default

      if (index === 0) {
        listItem.classList.add('active'); // Draw the chart initially for the first product

        LowStock.setupThreshold(stockList, productName);
      } // Add click event to display product data in the chart


      listItem.addEventListener('click', function () {
        // Remove 'active' class from all items
        document.querySelectorAll('.product-item').forEach(function (item) {
          return item.classList.remove('active');
        }); // Add 'active' class to the clicked item

        listItem.classList.add('active'); // Draw chart for the selected product

        LowStock.setupThreshold(stockList, productName);
      }); // Append the list item to the product list

      productList.appendChild(listItem);
    });
  },
  // Setup threshold selection options and initialize the chart
  setupThreshold: function setupThreshold(stockList, productName) {
    var thresholdWrapper = document.querySelector('#threshold');
    var thresholdList = document.querySelectorAll('#tanks-threshold-list ul li');
    var threshold = LowStock.TanksPercentage; // Display the initial threshold

    if (thresholdWrapper) {
      thresholdWrapper.textContent = "".concat(threshold, "%");
    } // Add click events for each threshold item


    thresholdList.forEach(function (item) {
      if (Number(item.dataset.value) === threshold) {
        item.classList.add('active');
      }

      item.addEventListener('click', function () {
        threshold = Number(item.dataset.value);

        if (thresholdWrapper) {
          thresholdWrapper.textContent = "".concat(threshold, "%");
          LowStock.TanksPercentage = threshold;
        } // Reset active class and set selected item as active


        thresholdList.forEach(function (el) {
          return el.classList.remove('active');
        });
        item.classList.add('active'); // Redraw chart based on the new threshold

        LowStock.drawPieChart(stockList, LowStock.TanksPercentage, productName);
      });
    }); // Initial chart drawing with the default threshold
    // google.charts.setOnLoadCallback(() => LowStock.drawPieChart(stockList, threshold));

    LowStock.drawPieChart(stockList, LowStock.TanksPercentage, productName);
  },
  // Draw pie chart based on the selected threshold and specific product if chosen
  drawPieChart: function drawPieChart(stockList, threshold) {
    var selectedProduct,
        _ref10,
        backgroundColor,
        txtColor,
        belowThreshold,
        aboveThreshold,
        data,
        adjustColorBrightness,
        baseColor,
        lighterColor,
        options,
        chart,
        _args19 = arguments;

    return regeneratorRuntime.async(function drawPieChart$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            adjustColorBrightness = function _ref11(hex, percent) {
              var r = parseInt(hex.slice(1, 3), 16);
              var g = parseInt(hex.slice(3, 5), 16);
              var b = parseInt(hex.slice(5, 7), 16); // Adjust brightness by the given percentage

              r = Math.round(r * (1 + percent));
              g = Math.round(g * (1 + percent));
              b = Math.round(b * (1 + percent)); // Ensure RGB values are within 0-255

              r = Math.min(255, Math.max(0, r));
              g = Math.min(255, Math.max(0, g));
              b = Math.min(255, Math.max(0, b)); // Convert RGB back to hex

              var rHex = r.toString(16).padStart(2, '0');
              var gHex = g.toString(16).padStart(2, '0');
              var bHex = b.toString(16).padStart(2, '0');
              return "#".concat(rHex).concat(gHex).concat(bHex);
            };

            selectedProduct = _args19.length > 2 && _args19[2] !== undefined ? _args19[2] : null;
            _context19.next = 4;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 4:
            _ref10 = _context19.sent;
            backgroundColor = _ref10.backgroundColor;
            txtColor = _ref10.txtColor;
            belowThreshold = 0;
            aboveThreshold = 0; // Aggregate data based on the threshold and optionally for a specific product

            if (selectedProduct && stockList[selectedProduct]) {
              // Use specific product's above/below data
              belowThreshold = stockList[selectedProduct].below;
              aboveThreshold = stockList[selectedProduct].above;
            } else {
              // Aggregate data across all products
              Object.values(stockList).forEach(function (stock) {
                belowThreshold += stock.below;
                aboveThreshold += stock.above;
              });
            }

            data = google.visualization.arrayToDataTable([['Status', 'Count'], ['Below ' + threshold + '%', belowThreshold], ['Above ' + threshold + '%', aboveThreshold]]);
            baseColor = selectedProduct && _constant.SharedColors[selectedProduct] ? _constant.SharedColors[selectedProduct] : '#666666';
            lighterColor = adjustColorBrightness(baseColor, -0.4);
            options = {
              title: '',
              colors: [lighterColor, baseColor],
              pieSliceBorderColor: backgroundColor,
              backgroundColor: backgroundColor,
              tooltip: {
                isHtml: true
              },
              legend: {
                position: 'none'
              },
              slices: {
                0: {
                  offset: 0.1
                }
              },
              chartArea: {
                width: '80%',
                height: '80%'
              }
            };
            chart = new google.visualization.PieChart(document.querySelector('#tankPercentageChart'));
            chart.draw(data, options);

          case 16:
          case "end":
            return _context19.stop();
        }
      }
    });
  }
}; // Delivery Amount

var DeliveryAmount = {
  init: function init() {
    var deliveryTankChart = document.querySelector('#deliveryTankChart');

    if (deliveryTankChart) {
      google.charts.load('current', {
        packages: ['corechart']
      });
      google.charts.setOnLoadCallback(DeliveryAmount.fetchData);
    }
  },
  fetchData: function fetchData() {
    var sitesData, sites;
    return regeneratorRuntime.async(function fetchData$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.prev = 0;
            _context20.next = 3;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.dashboardSites));

          case 3:
            sitesData = _context20.sent;

            if (!(!sitesData || !sitesData.sitesnumbers || sitesData.sitesnumbers.length === 0)) {
              _context20.next = 7;
              break;
            }

            console.error("No sites data available");
            return _context20.abrupt("return");

          case 7:
            sites = sitesData.sitesnumbers;
            DeliveryAmount.populateSiteDropdown(sites); // Draw initial chart with the first site by default

            DeliveryAmount.drawColumnChart(sites[0].sitenumber);
            _context20.next = 15;
            break;

          case 12:
            _context20.prev = 12;
            _context20.t0 = _context20["catch"](0);
            console.error("Error fetching data:", _context20.t0);

          case 15:
          case "end":
            return _context20.stop();
        }
      }
    }, null, null, [[0, 12]]);
  },
  populateSiteDropdown: function populateSiteDropdown(sites) {
    var sitesList = document.querySelector('#delivery-sites-list ul');
    var siteFilterInput = document.querySelector('#delivery-sites-list .site-filter input');
    sitesList.innerHTML = ''; // Clear previous items if any

    sites.forEach(function (site, index) {
      var listItem = DeliveryAmount.createSiteListItem(site, index === 0);
      listItem.addEventListener('click', function () {
        return DeliveryAmount.selectSite(listItem, site);
      });
      sitesList.appendChild(listItem);
    }); // Filter functionality for dropdown

    siteFilterInput.addEventListener('input', function () {
      var filterValue = siteFilterInput.value.toLowerCase();
      document.querySelectorAll('.site-item').forEach(function (item) {
        item.style.display = item.dataset.sitenumber.includes(filterValue) ? 'flex' : 'none';
      });
    }); // Select the first item by default if sites exist

    if (sites.length > 0) {
      DeliveryAmount.selectSite(sitesList.firstChild, sites[0]);
    }
  },
  createSiteListItem: function createSiteListItem(site, isActive) {
    var listItem = document.createElement('li');
    listItem.classList.add('site-item');
    listItem.dataset.sitenumber = site.sitenumber;
    listItem.dataset.tanks = site.tanks;
    var siteNumberSpan = document.createElement('span');
    siteNumberSpan.classList.add('site-number');
    siteNumberSpan.textContent = "#".concat(site.sitenumber);
    var tanksLengthSpan = document.createElement('span');
    tanksLengthSpan.classList.add('tanks-length');
    tanksLengthSpan.textContent = "".concat(site.tanks, " Tanks");
    listItem.append(siteNumberSpan, tanksLengthSpan);
    if (isActive) listItem.classList.add('active');
    return listItem;
  },
  selectSite: function selectSite(listItem, site) {
    document.querySelectorAll('.site-item').forEach(function (item) {
      return item.classList.remove('active');
    });
    listItem.classList.add('active');
    var siteName = document.querySelector('[data-popover-target="#delivery-sites-list-target"] .site-name');
    var tanksAmount = document.querySelector('#deliveryAmount');
    siteName.textContent = site.sitenumber;
    tanksAmount.textContent = site.tanks; // Draw the column chart for the selected site

    DeliveryAmount.drawColumnChart(site.sitenumber);
  },
  drawColumnChart: function drawColumnChart(siteNumber) {
    var _ref12, backgroundColor, txtColor, tanksData, chartData, data, groupWidthPercentage, options, chart;

    return regeneratorRuntime.async(function drawColumnChart$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.prev = 0;
            _context21.next = 3;
            return regeneratorRuntime.awrap((0, _constant.ChartBackgroundColor)());

          case 3:
            _ref12 = _context21.sent;
            backgroundColor = _ref12.backgroundColor;
            txtColor = _ref12.txtColor;
            _context21.next = 8;
            return regeneratorRuntime.awrap((0, _constant.fetchData)("".concat(_constant.API_PATHS.tanksVolumes).concat(siteNumber, ".json")));

          case 8:
            tanksData = _context21.sent;

            if (!(!tanksData || tanksData.length === 0)) {
              _context21.next = 12;
              break;
            }

            console.error("No tank data available");
            return _context21.abrupt("return");

          case 12:
            // Prepare data for the Google Chart
            chartData = [['Tank', 'Volume']];
            tanksData.forEach(function (tank) {
              var _tank2 = _slicedToArray(tank, 2),
                  tankName = _tank2[0],
                  volume = _tank2[1];

              chartData.push([tankName, volume]);
            });
            data = google.visualization.arrayToDataTable(chartData);
            groupWidthPercentage = ChartUtils.calculateGroupWidthPercentage('deliveryTankChart', tanksData.length);
            options = {
              backgroundColor: backgroundColor,
              title: '',
              colors: [_constant.SharedColors.DeliveryAmount],
              legend: {
                position: 'none'
              },
              tooltip: {
                isHtml: true
              },
              bar: {
                groupWidth: "".concat(groupWidthPercentage, "%")
              },
              hAxis: {
                textStyle: {
                  color: txtColor,
                  fontSize: 12
                }
              },
              vAxis: {
                textStyle: {
                  color: txtColor,
                  fontSize: 12
                }
              }
            };
            chart = new google.visualization.ColumnChart(document.querySelector('#deliveryTankChart'));
            chart.draw(data, options);
            _context21.next = 24;
            break;

          case 21:
            _context21.prev = 21;
            _context21.t0 = _context21["catch"](0);
            console.error("Error drawing column chart:", _context21.t0);

          case 24:
          case "end":
            return _context21.stop();
        }
      }
    }, null, null, [[0, 21]]);
  }
}; // Shared function to set bar width

var ChartUtils = {
  calculateGroupWidthPercentage: function calculateGroupWidthPercentage(chartId, numBars) {
    var targetBarWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 90;
    var chartContainer = document.querySelector("#".concat(chartId));
    var containerWidth = chartContainer ? chartContainer.offsetWidth : 0;
    if (containerWidth === 0 || numBars === 0) return 100; // Fallback to 100% if container width or bars are missing
    // Calculate percentage to keep bar width close to targetBarWidth

    return Math.min(targetBarWidth * numBars / containerWidth * 100, 100);
  }
};
var RunCharts = {
  init: function init() {
    ProductsUsage.init();
    SiteStatus.init();
    SalesTrend.init();
    SalesInventorySwitch.init();
    ProductSales.init(); // ProductInventory.init();

    SystemAlarms.init();
    OperationalAlarms.init();
    TanksVolume.init();
    LowStock.init();
    DeliveryAmount.init(); // SystemAlarmsChart.init();
    // OperationalAlarmsBarChart.init();
    // TankVolumeBarChart.init();

    ReloadCharts.init();
  }
}; // We will Reload Charts on Menu Collapsed And Apperacnce Toggle

var ReloadCharts = {
  // Initialize the menu toggle functionality
  init: function init() {
    // Attach the click event listener to #toggle-menu
    document.getElementById('toggle-menu').addEventListener('click', ReloadCharts.chartReload);
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
exports.ReloadCharts = ReloadCharts;
(0, _script.pageReady)(function () {
  DownloadChart.init();
  Products.init();
  RunCharts.init();
  TopSites.init();
  FillStatus.init();
});