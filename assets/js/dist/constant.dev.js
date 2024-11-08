"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchData = fetchData;
exports.ChartBackgroundColor = exports.SharedColors = exports.API_PATHS = void 0;
// constant.js
// Define the API paths as constants or an object
var API_PATHS = {
  dashboardSites: '/api/dashboard_sites_api.json',
  dashboardSalesToday: '/api/dashboard_sales_today.json',
  dashboardSalesYesterday: '/api/dashboard_sales_yesterday.json',
  dashboardSalesLastWeek: '/api/dashboard_sales_last_week.json',
  dashboardSalesLastMonth: '/api/dashboard_sales_last_month.json',
  dashboardOnlineOffline: '/api/dashboard_online_ofline_api.json',
  dashboardMaps: '/api/dashboard_maps_api.json',
  dashboardDeliveryAmount: '/api/dashboard_delivery_amount_api_column_chart.json',
  dashboardProducts: '/api/dashboard_cards_api.json',
  alarmsPieCharts: '/api/alarms_pie_charts.json',
  alarmsOperationalPieCharts: '/api/alarms_operational_pie_charts.json'
}; // Shared function to fetch data from JSON files

exports.API_PATHS = API_PATHS;

function fetchData(endpoint) {
  var response, data;
  return regeneratorRuntime.async(function fetchData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch(endpoint));

        case 3:
          response = _context.sent;

          if (response.ok) {
            _context.next = 6;
            break;
          }

          throw new Error("HTTP error! status: ".concat(response.status));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          data = _context.sent;
          return _context.abrupt("return", data);

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching data:', _context.t0);
          throw _context.t0;

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
} // Unified Product Colors


var SharedColors = {
  gasoline95: '#009C62',
  gasoline92: '#e54141',
  gasoline91: '#e54141',
  gasoline80: '#26272d',
  diesel: '#FAB75C',
  online: '#3db16d',
  offline: '#e61e45'
};
exports.SharedColors = SharedColors;

var ChartBackgroundColor = function ChartBackgroundColor() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      // Check for dark mode (using localStorage or body class)
      var appearance = localStorage.getItem('gts-appearance');
      var isDarkMode = appearance === 'dark' || appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches || document.body.classList.contains('dark-mode'); // Resolve with the background color

      var colors = {
        backgroundColor: isDarkMode ? '#101019' : '#ffffff',
        secondaryBgColor: isDarkMode ? '#171721' : '#f4f7fe',
        secondaryAlphaColor: isDarkMode ? '#272731' : '#eceef2'
      };
      resolve(colors);
    }, 0); // Adjust timeout if necessary
  });
}; // Usage example for the fetchData function with API paths
// To fetch users, for example:
// fetchData(API_PATHS.getUsers)
//     .then(data => console.log('User Data:', data))
//     .catch(error => console.error('Error fetching user data:', error));
// Export API_PATHS and fetchData if needed in other modules


exports.ChartBackgroundColor = ChartBackgroundColor;