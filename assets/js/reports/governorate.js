//alarms.js
import { pageReady, Button, Drawer, Tab, DataTable, Select, DatePicker, DatatableFilter } from '../script.js';
import { API_PATHS, fetchData, SharedColors, ChartBackgroundColor } from '../constant.js';
import { AppearanceToggle } from '../portal.js';

const ProductLabels = {
    "Gasoline95": "Gasoline 95",
    "Gasoline92": "Gasoline 92",
    "Gasoline91": "Gasoline 91",
    "Gasoline80": "Gasoline 80",
    "diesel": "Diesel",
    "cng": "CNG"
}

const FetchData = {
    init: async() => {
        const response = await fetchData(API_PATHS.governrateReports);
        if (!response || Object.keys(response).length === 0) {
            console.error("No response data available");
            return;
        }
        return response;
    }
}

// Usage
const GovernorateFilter = {
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
            GovernorateFilter.state.response = response;

            // Get all unique filter categories from the response
            const filterOptions = {
                'Governrate Name': {
                    options: [...new Set(response.map(item => item.gov_name))],
                    originalKey: 'gov_name'
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
            GovernorateFilter.state.filterOptions = filterOptions;
            const dateKeys = ['startdate', 'enddate'];
            // Initialize filters with the fetched alarm data
            const selectedFilters = await DatatableFilter.init(dtFilterWrapper, response, filterOptions, GovernorateFilter, GovernorateReportsDT, dateKeys);

            // Update state with selected filters
            GovernorateFilter.state.selectedFilters = selectedFilters;

            if (selectedFilters) {
                GovernorateFilter.filterSubmit(selectedFilters);  // Apply filters on load
            }
        }
    },

    filterSubmit: async (filters) => {
        const { response } = GovernorateFilter.state;
        const filteredGovernorate = await GovernorateFilter.applyFilters(filters, response);

        // Update DataTable with filtered alarms
        GovernorateReportsDT.init(filteredGovernorate);
    },

    applyFilters: (filters, response) => {
        let filteredGovernorate = response; // Start with the full alarm list

        Object.entries(filters).forEach(([key, values]) => {
            if (['startdate', 'enddate'].includes(key) && values.from && values.to) {
                // Filter by date range
                const from = new Date(values.from);
                const to = new Date(values.to);
                filteredGovernorate = filteredGovernorate.filter(res => {
                    const responseDate = new Date(res[key]);
                    return responseDate >= from && responseDate <= to;
                });
            } else {
                // Other filters (multi-select)
                filteredGovernorate = filteredGovernorate.filter(res => {
                    return values.some(value => String(res[key]) === String(value));
                });
            }
        });

        return filteredGovernorate; // Return filtered alarms
    },
};

const GovernorateReportsDT = {
    // Initialize the Site DataTable
    init: async (filteredGovernorate) => {

        const governorateReportsDT = document.querySelector("#governorateReportsDT");
        if (governorateReportsDT) {
            let governorate;
            if (!filteredGovernorate) {
                governorate = await GovernorateReportsDT.fetchData();
            } else {
                if (filteredGovernorate.length) {
                    governorateReportsDT.innerHTML = '';
                    governorate = filteredGovernorate;
                } else {
                    governorateReportsDT.innerHTML = '';
                    GovernorateReportsDT.emptyState(governorateReportsDT);
                }
            }

            if (governorate && governorate.length > 0) {
                const formattedData = GovernorateReportsDT.transformData(governorate);
                DataTable.init(".gts-dt-wrapper", {
                    data: formattedData,
                    columns: [
                        { title: `<span class="mat-icon material-symbols-sharp">globe_asia</span> Governrates`, data: "gov_name", footer: 'Total' },
                        { title: `<span class="mat-icon material-symbols-sharp">local_gas_station</span> Gasoline 95`, data: "Gasoline95", },
                        { title: `<span class="mat-icon material-symbols-sharp">local_gas_station</span> Gasoline 92`, data: "Gasoline92" },
                        { title: `<span class="mat-icon material-symbols-sharp">local_gas_station</span> Diesel`, data: "Diesel" },
                    ],
                    responsive: true,
                    paging: formattedData.length > 10,
                    pageLength: 10,
                    fixedHeader: {
                        header: false,
                        footer: true
                    },
                    footerCallback: function (row, data, start, end, display) {
                        const api = this.api();
                        const totalGasoline95 = api.column(1).data().reduce((a, b) => a + parseFloat(b) || 0, 0);
                        const totalGasoline92 = api.column(2).data().reduce((a, b) => a + parseFloat(b) || 0, 0);
                        const totalDiesel = api.column(3).data().reduce((a, b) => a + parseFloat(b) || 0, 0);
                        
                        // Update footer with totals
                        $(api.column(1).footer()).html( GovernorateReportsDT.parseFormattedNumber(totalGasoline95.toFixed(2)));
                        $(api.column(2).footer()).html( GovernorateReportsDT.parseFormattedNumber(totalGasoline92.toFixed(2)));
                        $(api.column(3).footer()).html( GovernorateReportsDT.parseFormattedNumber(totalDiesel.toFixed(2)));
                        $(api.column(0).footer()).html('Total');
                   },
                }, 
                [
                    { targets: 0, visible: true, className: 'not-id', createdCell: function (td) { $(td).css('text-align', 'left'); } },
                    { width: "280px", targets: 1 },
                    { width: "280px", targets: 2 },
                    { width: "280px", targets: 3 },
                ], "Governorate data table");
            } else {
                console.error("No alarms data available");
            }
        }
    },

    parseFormattedNumber: (numberStr) => {
        const formattedNumber = numberStr.toString().replace(/,/g, '').trim();
        const parsedNumber = parseFloat(formattedNumber);

        if (isNaN(parsedNumber)) {
            console.error('Invalid number format:', numberStr);
            return '0'; // Return a string so it can be displayed
        }

        // Format the number with commas
        return parsedNumber.toLocaleString();
    },
    
    // Fetch data from the API
    fetchData: async () => {
        try {
            const response = await FetchData.init();
            const governorate = await DataTable.fetchData(response.governrates);
            return governorate;
        } catch (error) {
            console.error("Error fetching GovernorateReportsDT data:", error);
            return [];
        }
    },

    // Transform the raw API data for the DataTable
    transformData: (data) => {
        return data.map((governorate) => ({
            gov_name: governorate.gov_name,
            Gasoline95: governorate.Gasoline95,
            Gasoline92: governorate.Gasoline92,
            Diesel: governorate.Diesel,
            
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

// Fetch Product Data
const Products = {

    init: async () => {
        const products = await FetchData.init();
        const totalSums = Products.calculateTotalSums(products.governrates);
        Products.renderProducts(totalSums);
    },

    calculateTotalSums: (records) => {
        const totals = {};
        records.forEach(record => {
            Object.keys(record).forEach(key => {
                if (key !== "gov_name") {
                    const value = parseFloat(record[key]) || 0;
                    totals[key] = (totals[key] || 0) + value;
                }
            });
        });
        return totals;
    },
    renderProducts: (products) => {
        const productsCards = document.getElementById('productsReportsCards');
        if (productsCards) {
            Object.keys(products).forEach((key) => {
                // Create the main wrapper for the product card
                const gridItem = document.createElement('div');
                gridItem.classList.add('gts-grid-item');

                // Create the main product container
                const itemContainer = document.createElement('div');
                itemContainer.classList.add('gts-product');
                itemContainer.classList.add('gts-item-content');
                itemContainer.classList.add(key.toLowerCase());

                // Create the inner container for icon and content
                const gtsValue = document.createElement('div');
                gtsValue.classList.add('gts-value');

                // Create the icon wrapper
                const iconWrapper = document.createElement('div');
                iconWrapper.classList.add('icon-wrapper');

                // Create the icon element (using Material Icons in this example)
                const icon = document.createElement('span');
                icon.classList.add('mat-icon', 'material-symbols-sharp');
                icon.textContent = 'local_gas_station'; // Set your icon name or dynamic icon here

                // Append icon to icon wrapper
                iconWrapper.appendChild(icon);

                // Create the header for the product quantity
                const quantityHeader = document.createElement('h3');
                const quantityValue = document.createElement('span');
                quantityValue.id = `${key}-value`;

                quantityValue.textContent = Products.parseFormattedNumber(products[key].toFixed(2));

                // Add unit after the value
                quantityHeader.appendChild(quantityValue);
                quantityHeader.insertAdjacentText('beforeend', ' lts');

                // Create the product name/label as a paragraph
                const productLabel = document.createElement('p');
                productLabel.textContent = `${ProductLabels[key] || key}`;

                // Append elements in the proper structure
                gtsValue.appendChild(iconWrapper);
                gtsValue.appendChild(quantityHeader);
                gtsValue.appendChild(productLabel);

                // Append the main gts-value container to itemContainer
                itemContainer.appendChild(gtsValue);

                // Append the itemContainer to the gridItem and add it to the main container
                gridItem.appendChild(itemContainer);
                productsCards.querySelector('.gts-grid').appendChild(gridItem);
            });
        }
        if (Object.keys(products).length > 3) {
            Products.scrollProducts(productsCards, Object.keys(products).length);
        }
    },

    scrollProducts: (productsCards, items) => {
        // Get the width of the first product card
        const itemWidth = productsCards.querySelector('.gts-grid .gts-grid-item:first-child').offsetWidth;
        productsCards.querySelectorAll('.gts-grid .gts-grid-item').forEach((card) => {
            card.style.width = `${itemWidth}px`;
        });
        productsCards.style.width = `${itemWidth * 3 + 15}px`;
    },

    parseFormattedNumber: (numberStr) => {
        const formattedNumber = numberStr.toString().replace(/,/g, '').trim();
        const parsedNumber = parseFloat(formattedNumber);

        if (isNaN(parsedNumber)) {
            console.error('Invalid number format:', numberStr);
            return '0'; // Return a string so it can be displayed
        }

        // Format the number with commas
        return parsedNumber.toLocaleString();
    },
}

const GovernorateProducts = {
    init: () => {
        const productSalesChart = document.querySelector('#productSalesChart');
        if (productSalesChart) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(GovernorateProducts.fetchData);
        }
    },

    fetchData: async () => {
        const response = await FetchData.init();
        google.charts.setOnLoadCallback(() => GovernorateProducts.drawChart(response.governrates));
    },

    drawChart: async (governrates) => {
        const { backgroundColor, txtColor } = await ChartBackgroundColor();

        // Aggregate total sales per product
        const productTotals = { Gasoline95: 0, Gasoline92: 0, Diesel: 0 };

        governrates.forEach((gov) => {
            productTotals.Gasoline95 += parseFloat(gov.Gasoline95) || 0;
            productTotals.Gasoline92 += parseFloat(gov.Gasoline92) || 0;
            productTotals.Diesel += parseFloat(gov.Diesel) || 0;
        });

        // Prepare the DataTable for Google Charts
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Product'); // X-Axis: Product name
        data.addColumn('number', 'Total Usage'); // Y-Axis: Total sales
        data.addColumn({ type: 'string', role: 'style' }); // Style column for colors
        data.addColumn({ type: 'string', role: 'tooltip', p: { html: true } }); // Tooltip column

        // Convert aggregated totals to chart rows
        const chartRows = Object.entries(productTotals).map(([product, total]) => {
            const tooltip = `<div class="cus_tooltip"><b>${product}</b><br>${total.toFixed(2)} L</div>`;
            return [product, total, `color: ${SharedColors[product] || '#000000'}`, tooltip];
        });

        data.addRows(chartRows);

        // Chart Options
        const options = {
            title: '',
            backgroundColor: backgroundColor,
            hAxis: { textStyle: { color: txtColor } },
            vAxis: { textStyle: { color: txtColor } },
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
                    GovernorateProducts.init();
                }
            });
        }
    }
};

const RunCharts = {
    init: () => {
        GovernorateProducts.init();
        ReloadAlarmsCharts.init();
    }
}

AppearanceToggle.registerCallback((mode) => {
    ReloadAlarmsCharts.chartReload();
});

pageReady(() => {
    GovernorateReportsDT.init();
    GovernorateFilter.init();
    RunCharts.init();
    Products.init();
});