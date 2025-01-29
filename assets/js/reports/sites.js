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
        const response = await fetchData(API_PATHS.sitesReports);
        if (!response || Object.keys(response).length === 0) {
            console.error("No response data available");
            return;
        }
        return response;
    }
}

// Usage
const SitesReportsFilter = {
    state: {
        response: [],
        filterOptions: {},
        selectedFilters: {},
    },

    init: async () => {
        const dtFilterWrapper = document.querySelector('#dtFilterWrapper');
        if (dtFilterWrapper) {
            // Fetch alarm data from API
            const res_list = await FetchData.init();
            const response = res_list.company_list;
            // Update state with alarms
            SitesReportsFilter.state.response = response;

            // Get all unique filter categories from the response
            const filterOptions = {
                'Central Area': {
                    options: [...new Set(response.map(item => item.centralarea))],
                    originalKey: 'centralarea'
                },
                'Governrate Name': {
                    options: [...new Set(response.map(item => item.governorate))],
                    originalKey: 'governorate'
                },
            };

            // Update state with filter options
            SitesReportsFilter.state.filterOptions = filterOptions;
            const dateKeys = [];
            // Initialize filters with the fetched alarm data
            const selectedFilters = await DatatableFilter.init(dtFilterWrapper, response, filterOptions, SitesReportsFilter, SitesReportsDT, dateKeys, CentralAreas);

            // Update state with selected filters
            SitesReportsFilter.state.selectedFilters = selectedFilters;

            if (selectedFilters) {
                SitesReportsFilter.filterSubmit(selectedFilters);  // Apply filters on load
            }
        }
    },

    filterSubmit: async (filters) => {
        const { response } = SitesReportsFilter.state;
        const filteredSitesReports = await SitesReportsFilter.applyFilters(filters, response);
        SitesReportsDT.init(filteredSitesReports);
        CentralAreas.init(filteredSitesReports);
    },

    applyFilters: (filters, response) => {
        let filteredSitesReports = response; // Start with the full alarm list

        Object.entries(filters).forEach(([key, values]) => {
            if (key === 'time' && values.from && values.to) {
                // Filter by date range
                const from = new Date(values.from);
                const to = new Date(values.to);
                filteredSitesReports = filteredSitesReports.filter(res => {
                    const responseDate = new Date(res[key]);
                    return responseDate >= from && alarmDate <= to;
                });
            } else {
                filteredSitesReports = filteredSitesReports.filter(res => {
                    return values.some(value => String(res[key]) === String(value));
                });
            }
        });

        return filteredSitesReports; // Return filtered alarms
    },
};

const SitesReportsDT = {
    // Initialize the Site DataTable
    init: async (filteredSitesReports) => {

        const sitesReportsDT = document.querySelector("#sitesReportsDT");
        if (sitesReportsDT) {
            let sites;
            if (!filteredSitesReports) {
                sites = await SitesReportsDT.fetchData();
            } else {
                if (filteredSitesReports.length) {
                    sitesReportsDT.innerHTML = '';
                    sites = filteredSitesReports;
                } else {
                    sitesReportsDT.innerHTML = '';
                    SitesReportsDT.emptyState(sitesReportsDT);
                }
            }

            if (sites && sites.length > 0) {
                const formattedData = SitesReportsDT.transformData(sites);
                DataTable.init(".gts-dt-wrapper", {
                    data: formattedData,
                    columns: [
                        { title: `<span class="mat-icon material-symbols-sharp">numbers</span>`, data: "id", footer: 'Total' },
                        { title: `<span class="mat-icon material-symbols-sharp">globe_asia</span> Site Number`, data: "sitenumber" },
                        { title: `<span class="mat-icon material-symbols-sharp">globe_asia</span> Site Name`, data: "name" },
                        {
                            title: `<span class="mat-icon material-symbols-sharp">network_check</span> Status`, data: "status",
                            render: (data, type, row) => {
                                const statusClass = data === "Online" ? "online" : "offline";
                                return `<div class="status-dt"><span class="${statusClass}">${data}</span></div>`;
                            }
                        },
                        { title: `<span class="mat-icon material-symbols-sharp">local_gas_station</span> Gasoline 95`, data: "Gasoline95", },
                        { title: `<span class="mat-icon material-symbols-sharp">local_gas_station</span> Gasoline 92`, data: "Gasoline92" },
                        { title: `<span class="mat-icon material-symbols-sharp">local_gas_station</span> Diesel`, data: "Diesel" },
                        { title: `<span class="mat-icon material-symbols-sharp">globe_asia</span> Governorate`, data: "governorate" },
                        { title: `<span class="mat-icon material-symbols-sharp">globe_asia</span> Central Area`, data: "centralarea" },
                        { title: `<span class="mat-icon material-symbols-sharp">schedule</span> Last Connection`, data: "lastconnection" },
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
                        const totalGasoline95 = api.column(4).data().reduce((a, b) => a + parseFloat(b) || 0, 0);
                        const totalGasoline92 = api.column(5).data().reduce((a, b) => a + parseFloat(b) || 0, 0);
                        const totalDiesel = api.column(6).data().reduce((a, b) => a + parseFloat(b) || 0, 0);
                        
                        // Update footer with totals
                        $(api.column(4).footer()).html( SitesReportsDT.parseFormattedNumber(totalGasoline95.toFixed(2) ));
                        $(api.column(5).footer()).html( SitesReportsDT.parseFormattedNumber(totalGasoline92.toFixed(2) ));
                        $(api.column(6).footer()).html( SitesReportsDT.parseFormattedNumber(totalDiesel.toFixed(2) ));
                        $(api.column(0).footer()).html('Total');
                   },
                }, 
                [
                    { width: "0px", targets: 0},
                ], "Sites Reports data table");
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
            const sites = await DataTable.fetchData(response.company_list);
            return sites;
        } catch (error) {
            console.error("Error fetching SitesReports data:", error);
            return [];
        }
    },

    // Transform the raw API data for the DataTable
    transformData: (data) => {
        return data.map((site, index) => ({
            id: index++,
            sitenumber: site.sitenumber,
            name: site.name,
            Gasoline95: site.Gasoline95,
            Gasoline92: site.Gasoline92,
            Diesel: site.Diesel,
            status: site.status === "offline" ? "Offline" : "Online",
            lastconnection: site.lastconnection,
            centralarea: site.centralarea,
            governorate: site.governorate,
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
        const totalSums = Products.calculateTotalSums(products.company_list);
        Products.renderProducts(totalSums);
    },

    calculateTotalSums: (records) => {
        const totals = {};
        records.forEach(record => {
            Object.keys(record).forEach(key => {

                if (key === 'Gasoline95' || key === 'Gasoline92' || key === 'Diesel') {
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

// Fetch Total Data
const CentralAreas = {
    init: async (filteredSite) => {
        const sites = await FetchData.init(); // Fetch data dynamically
        const totalCounts = CentralAreas.calculateTotalSums(filteredSite ? filteredSite : sites.company_list); // Get unique counts
        CentralAreas.renderProducts(totalCounts); // Render cards with counts
    },

    calculateTotalSums: (records) => {
        const siteNumbers = new Set();
        const governorates = new Set();

        records.forEach(record => {
            if (record.sitenumber) {
                siteNumbers.add(record.sitenumber); // Collect unique sitenumbers
            }
            if (record.governorate) {
                governorates.add(record.governorate); // Collect unique governorates
            }
        });

        return {
            Sites: siteNumbers.size, // Total unique sitenumbers
            Governorates: governorates.size // Total unique governorates
        };
    },

    renderProducts: (totals) => {
        const areaCards = document.getElementById('areasReportsCards');
        if (!areaCards) return;
        
        areaCards.querySelector('.gts-grid').innerHTML = ''

        Object.keys(totals).forEach((key) => {
            // Create the main wrapper for the product card
            const gridItem = document.createElement('div');
            gridItem.classList.add('gts-grid-item');

            // Create the main product container
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('gts-product', 'gts-item-content', 'white-box', key.toLowerCase());

            // Create the inner container for icon and content
            const gtsValue = document.createElement('div');
            gtsValue.classList.add('gts-value');

            // Create the icon wrapper
            const iconWrapper = document.createElement('div');
            iconWrapper.classList.add('icon-wrapper');

            // Create the icon element (using Material Icons in this example)
            const icon = document.createElement('span');
            icon.classList.add('mat-icon', 'material-symbols-sharp');
            icon.textContent = key === "Sites" ? "business" : "map"; // Different icon per type

            // Append icon to icon wrapper
            iconWrapper.appendChild(icon);

            // Create the header for the count
            const quantityHeader = document.createElement('h3');
            const quantityValue = document.createElement('span');
            quantityValue.id = `${key}-value`;
            quantityValue.textContent = totals[key].toLocaleString(); // Display formatted count

            // Append count to header
            quantityHeader.appendChild(quantityValue);

            // Create the product name/label as a paragraph
            const productLabel = document.createElement('p');
            productLabel.textContent = `Total ${key}`;

            // Append elements in the proper structure
            gtsValue.appendChild(iconWrapper);
            gtsValue.appendChild(quantityHeader);
            gtsValue.appendChild(productLabel);

            // Append the main gts-value container to itemContainer
            itemContainer.appendChild(gtsValue);

            // Append the itemContainer to the gridItem and add it to the main container
            gridItem.appendChild(itemContainer);
            areaCards.querySelector('.gts-grid').appendChild(gridItem);
        });
    }
};

const SitesReportsProducts = {
    init: () => {
        const productSalesChart = document.querySelector('#productSalesChart');
        if (productSalesChart) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(SitesReportsProducts.fetchData);
        }
    },

    fetchData: async () => {
        const response = await FetchData.init();
        google.charts.setOnLoadCallback(() => SitesReportsProducts.drawChart(response.company_list));
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
    drawChart: async (sites) => {
        const { backgroundColor, txtColor } = await ChartBackgroundColor();

        // Aggregate total sales per product
        const productTotals = { Gasoline95: 0, Gasoline92: 0, Diesel: 0 };

        sites.forEach((gov) => {
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
            const tooltip = `<div class="cus_tooltip"><b>${product}</b><br>${SitesReportsProducts.parseFormattedNumber(total.toFixed(2))} L</div>`;
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
                    SitesReportsProducts.init();
                }
            });
        }
    }
};

const RunCharts = {
    init: () => {
        SitesReportsProducts.init();
        ReloadAlarmsCharts.init();
    }
}

AppearanceToggle.registerCallback((mode) => {
    ReloadAlarmsCharts.chartReload();
});

pageReady(() => {
    SitesReportsDT.init();
    SitesReportsFilter.init();
    RunCharts.init();
    Products.init();
    CentralAreas.init();
});