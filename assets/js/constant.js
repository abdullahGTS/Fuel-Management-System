// constant.js

// Define the API paths as constants or an object
const API_PATHS = {


    // Low Stock
    stockData:'/api/dashboard_stock.json',

    // Sites & Tanks Dropdown list
    tanksVolumes: '/api/sites/',

    // Tanks Volume
    dashboardSites: '/api/dashboard_sites_api.json',

    // Delivery Tanks
    dashboardDeliveryAmount: '/api/dashboard_delivery_amount_api_column_chart.json',

    // Product Sales
    dashboardSalesToday: '/api/sales/dashboard_sales_today.json',
    dashboardSalesYesterday: '/api/sales/dashboard_sales_yesterday.json',
    dashboardSalesLastWeek: '/api/sales/dashboard_sales_last_week.json',
    dashboardSalesLastMonth: '/api/sales/dashboard_sales_last_month.json',

    // Site Status
    dashboardOnlineOffline: '/api/dashboard_online_ofline_api.json',

    // Unused Map Data
    dashboardMaps: '/api/dashboard_maps_api.json',

    // Products
    dashboardProducts: '/api/dashboard_cards_api.json',

    // Alarms
    systemAlarms: '/api/alarms_pie_charts.json',
    operationalAlarms: '/api/alarms_operational_pie_charts.json',

    // Top Five
    topFiveSitesToday: '/api/topFiveSites/dashboard_top_five_today.json',
    topFiveSitesYesterday: '/api/topFiveSites/dashboard_top_five_yesterday.json',
    topFiveSitesLastWeek: '/api/topFiveSites/dashboard_top_five_week.json',
    topFiveSitesLastMonth: '/api/topFiveSites/dashboard_top_five_month.json',

    // Inventory
    currnentInventory: '/api/inventory/currnent_inventory.json',
    todayInventory: '/api/inventory/inventory_today.json',
    yesterdayInventory: '/api/inventory/inventory_yesterday.json',
    weekInventory: '/api/inventory/inventory_week.json',
    monthInventory: '/api/inventory/inventory_month.json',

    // Fill Status
    fillStatusToday: '/api/fillStatus/fill_status_today.json',
    fillStatusYesterday: '/api/fillStatus/fill_status_yesterday.json',
    fillStatusWeek: '/api/fillStatus/fill_status_week.json',
    fillStatusMonth: '/api/fillStatus/fill_status_month.json',

    // Inner Sites
    siteDetails: '/api/inner/sites/site_details.json',
    sitesData: '/api/inner/sites/site_page.json',

    // Inner Alarms
    alarmData: '/api/inner/alarms/alarm_data.json',

    // Inner Delivery
    deliveryData: '/api/inner/delivery/delivery_data.json',

    // Inner Tanks
    tanksData: '/api/inner/tanks/tank_data.json',

    // Reports
    salesReports: '/api/inner/reports/report_sales_page_data.json',
    governrateReports: '/api/inner/reports/governrates_page.json',
    sitesReports: '/api/inner/reports/report_site_page_data.json',

    // operations
    reconcilationData: '/api/inner/operations/delivery_reconcilation.json',
    siteSuddenLoss: '/api/inner/operations/site_suddenloss.json',
    // cuurentRate: '/api/inner/operations/current_rate.json',
    tankSuddenLoss: '/api/inner/operations/tank_suddenloss.json',
};

// Shared function to fetch data from JSON files
async function fetchData(endpoint) {
    try {
        const response = await fetch(endpoint);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response JSON data
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error to handle it in calling functions if needed
    }
}

// Unified Product Colors
const SharedColors = {
    Gasoline95: '#009C62',
    Gasoline92: '#e54141',
    Gasoline91: '#e54141',
    Gasoline80: '#26272d',
    CNG: '#26272d',
    Diesel: '#FAB75C',
    Online: '#3db16d',
    Offline: '#e61e45',
    DeleveryReconciliation: '#2D99FC',
    SuddenLoss: '#83D0FF',
    SystemAlarm: '#6B6ED2',
    TanksVolume: '#156E41',
    DeliveryAmount: '#156E41',
    WaterColor: '#6B6ED2',
    TopFiveSites: {
        First: '#156E41',
        Second: '#6B6ED2',
        Third: '#83D0FF',
        Fourth: '#ff8f67',
        Fifth: '#FAB75C'
    },
    Volume: {
        More: '#3db16d',
        Less: '#e61e45',
        Same: '#FAB75C',
    }
};

const ChartBackgroundColor = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Check for dark mode (using localStorage or body class)
            const appearance = localStorage.getItem('gts-appearance');
            const isDarkMode = appearance === 'dark' ||
                (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
                document.body.classList.contains('dark-mode');

            // Resolve with the background color
            const colors = {

                // --gts-white-color: #1c1f27;//1b1e25
                // --gts-light-color: #141420;


                backgroundColor: isDarkMode ? '#1c1f29' : '#ffffff',
                secondaryBgColor: isDarkMode ? '#141420' : '#f4f7fe',
                secondaryAlphaColor: isDarkMode ? '#272731' : '#eceef2',
                txtColor: isDarkMode ? '#d6cfcf' : '#4D4D4D'
            };
            resolve(colors);
        }, 0); // Adjust timeout if necessary
    });
};

// Usage example for the fetchData function with API paths
// To fetch users, for example:
// fetchData(API_PATHS.getUsers)
//     .then(data => console.log('User Data:', data))
//     .catch(error => console.error('Error fetching user data:', error));

// Export API_PATHS and fetchData if needed in other modules
export { API_PATHS, fetchData, SharedColors, ChartBackgroundColor };
