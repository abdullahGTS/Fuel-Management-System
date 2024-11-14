// constant.js

// Define the API paths as constants or an object
const API_PATHS = {
    dashboardSites: '/api/dashboard_sites_api.json',
    stockData:'/api/dashboard_stock.json',
    tanksVolumes: '/api/sites/',
    dashboardDeliveryAmount: '/api/dashboard_delivery_amount_api_column_chart.json',
    dashboardSalesToday: '/api/dashboard_sales_today.json',
    dashboardSalesYesterday: '/api/dashboard_sales_yesterday.json',
    dashboardSalesLastWeek: '/api/dashboard_sales_last_week.json',
    dashboardSalesLastMonth: '/api/dashboard_sales_last_month.json',
    dashboardOnlineOffline: '/api/dashboard_online_ofline_api.json',
    dashboardMaps: '/api/dashboard_maps_api.json',
    dashboardProducts: '/api/dashboard_cards_api.json',
    systemAlarms: '/api/alarms_pie_charts.json',
    operationalAlarms: '/api/alarms_operational_pie_charts.json',
    topFiveSitesToday: '/api/topFiveSites/dashboard_top_five_today.json',
    topFiveSitesYesterday: '/api/topFiveSites/dashboard_top_five_yesterday.json',
    topFiveSitesLastWeek: '/api/topFiveSites/dashboard_top_five_week.json',
    topFiveSitesLastMonth: '/api/topFiveSites/dashboard_top_five_month.json'

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
    TopFiveSites: {
        First: '#156E41',
        Second: '#6B6ED2',
        Third: '#83D0FF',
        Fourth: '#FAB75C',
        Fifth: '#e54141'
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
                backgroundColor: isDarkMode ? '#101019' : '#ffffff',
                secondaryBgColor: isDarkMode ? '#171721' : '#f4f7fe',
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
