//alarms.js
import { pageReady, Button, Drawer, Tab, DataTable, Select, DatePicker, DatatableFilter } from '../script.js';
import { API_PATHS, fetchData, SharedColors, ChartBackgroundColor } from '../constant.js';
import { AppearanceToggle } from '../portal.js';


const FetchData = {
    init: async() => {
        const response = await fetchData(API_PATHS.salesReports);
        if (!response || Object.keys(response).length === 0) {
            console.error("No response data available");
            return;
        }
        return response;
    }
}

// Usage
const SalesFilter = {
    state: {
        response: [],
        filterOptions: {},
        selectedFilters: {},
    },

    init: async () => {
        const dtFilterWrapper = document.querySelector('#dtFilterWrapper');
        if (dtFilterWrapper) {
            // Fetch alarm data from API
            const response = await FetchData.init();

            // Update state with alarms
            SalesFilter.state.response = response;

            // Get all unique filter categories from the response
            const filterOptions = {
                'Site Numbers': {
                    options: [...new Set(response.map(item => item.sitenumber))],
                    originalKey: 'sitenumber'
                },
                'Product': {
                    options: [...new Set(response.map(item => item.product))],
                    originalKey: 'product'
                },
                'Start Date': {
                    options: [...new Set(response.map(item => item.startdate))],
                    originalKey: 'startdate'
                },
                'End Date': {
                    options: [...new Set(response.map(item => item.enddate))],
                    originalKey: 'enddate'
                }
            };

            // Update state with filter options
            SalesFilter.state.filterOptions = filterOptions;
            const dateKeys = ['startdate', 'enddate'];
            // Initialize filters with the fetched alarm data
            const selectedFilters = await DatatableFilter.init(dtFilterWrapper, response, filterOptions, SalesFilter, SalesReportsDT, dateKeys);

            // Update state with selected filters
            SalesFilter.state.selectedFilters = selectedFilters;

            if (selectedFilters) {
                SalesFilter.filterSubmit(selectedFilters);  // Apply filters on load
            }
        }
    },

    filterSubmit: async (filters) => {
        const { response } = SalesFilter.state;
        const filteredSales = await SalesFilter.applyFilters(filters, response);

        // Update DataTable with filtered alarms
        SalesReportsDT.init(filteredSales);
    },

    applyFilters: (filters, response) => {
        let filteredSales = response; // Start with the full alarm list

        Object.entries(filters).forEach(([key, values]) => {
            if (['startdate', 'enddate'].includes(key) && values.from && values.to) {
                // Filter by date range
                const from = new Date(values.from);
                const to = new Date(values.to);
                filteredSales = filteredSales.filter(res => {
                    const responseDate = new Date(res[key]);
                    return responseDate >= from && responseDate <= to;
                });
            } else {
                // Other filters (multi-select)
                filteredSales = filteredSales.filter(res => {
                    return values.some(value => String(res[key]) === String(value));
                });
            }
        });

        return filteredSales; // Return filtered alarms
    },
};

const SalesReportsDT = {
    // Initialize the Site DataTable
    init: async (filteredSales) => {

        const salesReportsDT = document.querySelector("#salesReportsDT");
        if (salesReportsDT) {
            let sales;
            if (!filteredSales) {
                sales = await SalesReportsDT.fetchData();
            } else {
                if (filteredSales.length) {
                    salesReportsDT.innerHTML = '';
                    sales = filteredSales;
                } else {
                    salesReportsDT.innerHTML = '';
                    SalesReportsDT.emptyState(salesReportsDT);
                }
            }

            if (sales && sales.length > 0) {
                const formattedData = SalesReportsDT.transformData(sales);
                DataTable.init(".gts-dt-wrapper", {
                    data: formattedData,
                    columns: [
                        { title: `<span class="mat-icon material-symbols-sharp">numbers</span>`, data: "id" },
                        { title: `<span class="mat-icon material-symbols-sharp">location_on</span> Site Number`, data: "sitenumber" },
                        { title: `<span class="mat-icon material-symbols-sharp">verified</span> Site Name`, data: "sitename" },
                        { title: `<span class="mat-icon material-symbols-sharp">local_gas_station</span> Product`, data: "product" },
                        { title: `<span class="mat-icon material-symbols-sharp">schedule</span> Start Date`, data: "startdate" },
                        { title: `<span class="mat-icon material-symbols-sharp">schedule</span> End Date`, data: "enddate" },
                        { title: `<span class="mat-icon material-symbols-sharp">full_stacked_bar_chart</span> P.P.U`, data: "ppu" },
                        { title: `<span class="mat-icon material-symbols-sharp">database</span> Volume`, data: "volume" },
                        { title: `<span class="mat-icon material-symbols-sharp">waterfall_chart</span> Money`, data: "money" },
                        { title: `<span class="mat-icon material-symbols-sharp">oil_barrel</span> ATC Volume`, data: "atcvolume" },
                    ],
                    responsive: true,
                    paging: formattedData.length > 10,
                    pageLength: 10,
                }, [
                    // { width: "0px", targets: 0 },  // Hide the first column (id)
                    // { width: "480px", targets: 6 },
                    // { width: "100px", targets: 7 },
                ], "Sales data table");
            } else {
                console.error("No alarms data available");
            }
        }
    },

    // Fetch data from the API
    fetchData: async () => {
        try {
            const response = await FetchData.init();
            const sales = await DataTable.fetchData(response);
            return sales;
        } catch (error) {
            console.error("Error fetching SalesReportsDT data:", error);
            return [];
        }
    },

    // Transform the raw API data for the DataTable
    transformData: (data) => {
        return data.map((sales) => ({
            id: sales.id,
            sitename: sales.sitename,
            sitenumber: sales.sitenumber,
            product: sales.product,
            startdate: sales.startdate,
            enddate: sales.enddate,
            ppu: sales.ppu,
            volume: sales.volume,
            money: sales.money,
            atcvolume: sales.atcvolume,
        }));
    },

    emptyState: (wrapper) => {

        // Check if the empty state message already exists
        if (!wrapper.querySelector(".emptyState")) {
            const emptyStateDiv = document.createElement("div");
            emptyStateDiv.className = "emptyState";

            // Create the heading (h3)
            const heading = document.createElement("h3");
            heading.textContent = "No Results Found";

            // Create the brief (p)
            const brief = document.createElement("p");
            brief.textContent = "We couldn't find any matches. Adjust your search and try again.";

            // Append heading and brief to the empty state div
            emptyStateDiv.appendChild(heading);
            emptyStateDiv.appendChild(brief);

            // Insert the empty state div after the site list container
            wrapper.appendChild(emptyStateDiv);
        }
    },
};

const SalesProducts = {
    currency: 'SAR',
    init: () => {
        const productSalesChart = document.querySelector('#productSalesChart');
        if (productSalesChart) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(SalesProducts.fetchData);
        }
    },

    fetchData: async () => {
        const sales = await FetchData.init();
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => SalesProducts.drawChart(sales));
    },

    drawChart: async (sales) => {
        const { backgroundColor, txtColor } = await ChartBackgroundColor();

        // Aggregate total sales per product
        const productSales = sales.reduce((acc, sale) => {
            const product = sale.product;
            const money = parseFloat(sale.money) || 0; // Convert money to float

            if (!acc[product]) {
                acc[product] = 0;
            }
            acc[product] += money; // Sum the total sales per product

            return acc;
        }, {});

        // Prepare the DataTable for Google Charts
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Product'); // X-Axis: Product name
        data.addColumn('number', 'Total Sales'); // Y-Axis: Total sales
        data.addColumn({ type: 'string', role: 'style' }); // Style column for colors
        data.addColumn({ type: 'string', role: 'tooltip', p: { html: true } }); // Tooltip column

        // Convert product sales object to chart rows
        const chartRows = Object.entries(productSales).map(([product, totalSales]) => {
            const formattedTooltip = `<div class="cus_tooltip"><b>${product}</b><br>Total Sales: ${totalSales.toFixed(2)} ${SalesProducts.currency}</div>`;
            return [
                product,
                totalSales,
                `color: ${SharedColors[product] || '#000000'}`, // Use defined color or fallback to black
                formattedTooltip
            ];
        });
        data.addRows(chartRows);

        // Chart Options
        const options = {
            title: '',
            backgroundColor: backgroundColor,
            hAxis: {
                title: '',
                textStyle: { color: txtColor }
            },
            vAxis: {
                title: '',
                textStyle: { color: txtColor }
            },
            legend: { position: 'none' },
            chartArea: { width: '80%', height: '70%' },
            tooltip: { isHtml: true }
        };

        // Draw the chart
        const chart = new google.visualization.ColumnChart(document.getElementById('productSalesChart'));
        chart.draw(data, options);
    }
};

const ReloadAlarmsCharts = {
    // Initialize the menu toggle functionality
    init: () => {
        // Attach the click event listener to #toggle-menu
        document.getElementById('toggle-menu').addEventListener('click', ReloadAlarmsCharts.chartReload);
    },

    chartReload: () => {
        // Step 1: Check if the .gts-charts element exists
        if (document.querySelector('.chart-area')) {
            // Step 2: Kill current charts by clearing their containers
            const chartContainers = document.querySelectorAll('.chart-area');
            const chartLegend = document.querySelectorAll('.chart-legend');

            if (chartContainers) {
                chartContainers.forEach(container => {
                    container.innerHTML = ''; // Clear the chart container
                });
            }
            if (chartLegend) {
                chartLegend.forEach(container => {
                    container.innerHTML = ''; // Clear the chart container
                });
            }

            // Step 3: Reload the charts
            setTimeout(() => {
                RunCharts.init();
                const productSalesChart = document.getElementById('productSalesChart');
                if (productSalesChart && !productSalesChart.classList.contains('hide')) {
                    SalesProducts.init();
                }
            });
        }
    }
};

const RunCharts = {
    init: () => {
        SalesProducts.init();
        ReloadAlarmsCharts.init();
    }
}

AppearanceToggle.registerCallback((mode) => {
    ReloadAlarmsCharts.chartReload();
});

pageReady(() => {
    SalesReportsDT.init();
    RunCharts.init();
    SalesFilter.init();
});