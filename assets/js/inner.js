//dashboard.js
import { pageReady, Popover, Button } from './script.js';
import { API_PATHS, fetchData, SharedColors, ChartBackgroundColor } from './constant.js';

// Common DataTable
const DataTable = {
    // Initialize the DataTable
    init: (selector, options = {}, tableTitle = "Table") => {
        const tableWrapper = document.querySelector(selector);
        if (!tableWrapper) {
            console.error(`No element found for selector: ${selector}`);
            return;
        }

        // Create a table element dynamically if not already present
        let table = tableWrapper.querySelector("table");
        if (!table) {
            table = document.createElement("table");
            table.classList.add("gts-dt-table"); // Add a class for styling
            tableWrapper.innerHTML = ""; // Clear the wrapper content
            tableWrapper.appendChild(table);
        }

        // Initialize the DataTable
        $(table).DataTable({
            ...options,
            dom:
                "<'dt-header' <'dt-filter' <'col gts-dt-length'l><'col dt-gts-search'f>>>" +
                "<'dt-body'<'col'tr>>" +
                "<'dt-footer'<'col'i><'col gts-paging'p>>",
            language: {
                emptyTable: "No data available",
                lengthMenu: `
                    <span class="mat-icon material-symbols-sharp">arrow_drop_down</span>
                    <select class="custom-length-menu" id="dt-length-0">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                `,
                search: "", // Remove default search label
            },
            initComplete: function () {
                // Add the custom table title
                const dtHeader = tableWrapper.querySelector(".dt-header");
                const titleDiv = document.createElement("div");
                titleDiv.className = "gts-db-title";
                titleDiv.innerHTML = `<h2>${tableTitle}</h2>`;
                dtHeader.prepend(titleDiv);

                // Customize the search field
                const searchWrapper = tableWrapper.querySelector(".dt-gts-search");
                if (searchWrapper) {
                    const input = searchWrapper.querySelector("input");
                    if (input) {
                        // Add a placeholder to the search input
                        input.setAttribute("placeholder", "Search here...");
                    }

                    // Add Material Icon for search
                    const searchIcon = document.createElement("span");
                    searchIcon.className = "mat-icon material-symbols-sharp";
                    searchIcon.textContent = "search";
                    searchWrapper.prepend(searchIcon);
                }

                // Replace sorting icons with Material Icons
                const headers = table.querySelectorAll("th");
                headers.forEach((header) => {
                    const icon = document.createElement("span");
                    icon.className = "mat-icon material-symbols-sharp sort-icon";
                    icon.textContent = "expand_all";
                    header.appendChild(icon);
                });
            },
        });
    },

    // Fetch Data for the DataTable
    fetchData: async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data for DataTable:", error);
            return [];
        }
    },
};

// Site Inner Page
// const SiteStatus = {
//     init: () => {
//         const siteStatusChart = document.querySelector('#siteStatusChart');
//         if (siteStatusChart) {
//             google.charts.load('current', { packages: ['corechart'] });
//             google.charts.setOnLoadCallback(SiteStatus.fetchData);
//         }
//     },
//     fetchData: async () => {
//         const sites = await fetchData(API_PATHS.sitesList);
//         if (!sites || sites.length === 0) {
//             console.error("No sites data available");
//             return;
//         }

//         // Update the chart with new data
//         google.charts.load('current', { packages: ['corechart'] });
//         google.charts.setOnLoadCallback(() => SiteStatus.drawChart(sites));
//     },
//     drawChart: async (sites) => {
//         const { backgroundColor } = await ChartBackgroundColor();

//         // Process data to calculate online/offline counts
//         const statusCounts = sites.reduce(
//             (acc, site) => {
//                 acc[site.status] = (acc[site.status] || 0) + 1;
//                 return acc;
//             },
//             { online: 0, offline: 0 }
//         );

//         const data = new google.visualization.DataTable();
//         data.addColumn('string', 'Status');
//         data.addColumn('number', 'Count');
//         data.addRows([
//             ['Online', statusCounts.online],
//             ['Offline', statusCounts.offline],
//         ]);

//         // Define slices for online and offline colors
//         const options = {
//             title: '',
//             tooltip: { isHtml: true },
//             backgroundColor: backgroundColor,
//             slices: {
//                 0: { offset: 0.04, color: SharedColors.Online },
//                 1: { offset: 0.04, color: SharedColors.Offline },
//             },
//             pieSliceBorderColor: backgroundColor,
//             chartArea: {
//                 width: window.innerWidth < 769 ? '80%' : '75%',
//                 height: window.innerWidth < 769 ? '80%' : '75%',
//             },
//             legend: { position: 'none' },
//         };

//         // Draw the chart
//         const siteStatusChartWrapper = document.getElementById('siteStatusChart');
//         const chart = new google.visualization.PieChart(siteStatusChartWrapper);
//         chart.draw(data, options);

//         // Create the custom legend
//         SiteStatus.createLegend(siteStatusChartWrapper, data, options);
//     },

//     createLegend: (wrapper, data, options) => {
//         const legendContainer = wrapper.parentNode.querySelector('.chart-legend');
//         legendContainer.innerHTML = ''; // Clear any existing legend items

//         // Loop through chart data to dynamically create legend items
//         for (let i = 0; i < data.getNumberOfRows(); i++) {
//             const label = data.getValue(i, 0);
//             const color = options.slices[i].color || '#000'; // Get color from slices

//             const legendItem = document.createElement('div');
//             legendItem.classList.add('legend-item');
//             legendItem.innerHTML = `
//                 <span class="legend-color" style="background-color: ${color};"></span>
//                 <span class="legend-label">${label}</span>
//             `;
//             legendContainer.appendChild(legendItem);
//         }
//     },
// };

const SiteStatus = {
    init: () => {
        const onlineSitesValueInner = document.querySelector('#onlineSitesValueInner');
        const offlineSitesValueInner = document.querySelector('#offlineSitesValueInner');

        if (onlineSitesValueInner && offlineSitesValueInner) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(SiteStatus.fetchData);
        }
    },

    fetchData: async () => {
        const sites = await fetchData(API_PATHS.sitesList);
        if (!sites || sites.length === 0) {
            console.error("No sites data available");
            return;
        }

        const statusCounts = sites.reduce(
            (acc, site) => {
                acc[site.status] = (acc[site.status] || 0) + 1;
                return acc;
            },
            { online: 0, offline: 0 }
        );

        
        // Update the chart with new data
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => SiteStatus.drawCharts(sites, statusCounts));

        document.getElementById('onlineSitesValueInner').textContent = statusCounts.online;
        document.getElementById('offlineSitesValueInner').textContent = statusCounts.offline;
    },

    drawCharts: async (sites, statusCounts) => {
        const { secondaryBgColor, secondaryAlphaColor } = await ChartBackgroundColor();

        // Data for the online donut chart
        const onlineData = new google.visualization.DataTable();
        onlineData.addColumn('string', 'Status');
        onlineData.addColumn('number', 'Count');
        onlineData.addRows([
            ['Online', statusCounts.online],
            ['Total Sites', statusCounts.online + statusCounts.offline],
        ]);

        // Data for the offline donut chart
        const offlineData = new google.visualization.DataTable();
        offlineData.addColumn('string', 'Status');
        offlineData.addColumn('number', 'Count');
        offlineData.addRows([
            ['Offline', statusCounts.offline],
            ['Total Sites', statusCounts.online + statusCounts.offline],
        ]);

        // Define options for donut charts
        const options = {
            tooltip: { isHtml: true },
            backgroundColor: secondaryBgColor,
            pieSliceBorderColor: secondaryBgColor,
            pieSliceText: 'none', 
            chartArea: {
                width: '80%',
                height: '80%',
            },
            pieHole: 0.65,
            pieStartAngle: 0,
            legend: { position: 'none' },
            slices: {
                0: { offset: 0.1 },
                1: { color: secondaryAlphaColor },
            },
        };

        // Draw the online donut chart
        const onlineChartWrapper = document.getElementById('onlineSitesChartInner');
        const onlineChart = new google.visualization.PieChart(onlineChartWrapper);
        options.slices[0].color = SharedColors.Online;
        onlineChart.draw(onlineData, options);

        // Draw the offline donut chart
        const offlineChartWrapper = document.getElementById('offlineSitesChartInner');
        const offlineChart = new google.visualization.PieChart(offlineChartWrapper);
        options.slices[0].color = SharedColors.Offline;
        offlineChart.draw(offlineData, options);
    },
};

const SiteDT = {
    // Initialize the Site DataTable
    init: async () => {
        const siteDT = document.querySelector("#siteDT");
        if (siteDT) {
            const sites = await SiteDT.fetchData();
            if (sites && sites.length > 0) {
                const formattedData = SiteDT.transformData(sites);
                DataTable.init(".gts-dt-wrapper", {
                    data: formattedData,
                    columns: [
                        { title: `<span class="mat-icon material-symbols-sharp">numbers</span> Site ID`, data: "id" },
                        { title: `<span class="mat-icon material-symbols-sharp">location_on</span> Site Number`, data: "sitenumber" },
                        { title: `<span class="mat-icon material-symbols-sharp">home</span> Site Name`, data: "name" },
                        { title: `<span class="mat-icon material-symbols-sharp">access_time</span> Last Connection`, data: "lastconnection" },
                        { title: `<span class="mat-icon material-symbols-sharp">cloud</span> Source`, data: "source" },
                        {
                            title: `<span class="mat-icon material-symbols-sharp">network_check</span> Status`,
                            data: "status",
                            render: (data, type, row) => {
                                // Add a span with a custom class for the status
                                const statusClass = data === "Online" ? "online" : "offline";
                                return `<span class="${statusClass}">${data}</span>`;
                            }
                        },
                    ],
                    responsive: true,
                    paging: formattedData.length > 10,
                    pageLength: 10,
                }, "Sites data table");
            } else {
                console.error("No sites data available");
            }
        }
    },

    // Fetch data from the API
    fetchData: async () => {
        try {
            const sites = await DataTable.fetchData(API_PATHS.sitesDT);
            return sites;
        } catch (error) {
            console.error("Error fetching SiteDT data:", error);
            return [];
        }
    },

    // Transform the raw API data for the DataTable
    transformData: (data) => {
        return data.map((site) => ({
            id: site.id,
            sitenumber: site.sitenumber,
            name: site.name,
            lastconnection: site.lastconnection,
            source: site.source,
            status: site.status === "offline" ? "Offline" : "Online",
        }));
    },
};

const SiteList = {
    init: async () => {
        const sites = await fetchData(API_PATHS.sitesList);
        if (!sites || Object.keys(sites).length === 0) {
            console.error("No sites data available");
            return;
        }

        // Set total sites count
        const totalSites = document.querySelector('#totalSites');
        if (totalSites) totalSites.textContent = Object.keys(sites).length;

        // Get the site list wrapper
        const siteListWrapper = document.querySelector('#siteListWrapper');
        if (siteListWrapper) {
            // Store the original list of sites
            SiteList.sites = sites;
            SiteList.siteList(siteListWrapper, sites);
        }

        // Handle the filter input event
        const filterInput = document.querySelector('.gts-filter input');
        if (filterInput) {
            filterInput.addEventListener('input', () => {
                const query = filterInput.value.toLowerCase();
                const filteredSites = SiteList.filterSites(query);
                SiteList.siteList(siteListWrapper, filteredSites);
            });
        }
    },

    // Filter sites based on the search query
    filterSites: (query) => {
        const { sites } = SiteList;
        return sites.filter(site => {
            return (
                site.name.toLowerCase().includes(query) ||
                site.sitenumber.toString().includes(query)
            );
        });
    },

    // Render the site list
    siteList: (wrapper, sites) => {
        const siteListContainer = wrapper.querySelector('.sites-list ul');
        if (!siteListContainer) return;

        // Clear any existing site list content
        siteListContainer.innerHTML = '';

        // Generate site list items
        sites.forEach(site => {
            const siteItem = document.createElement('li');
            siteItem.classList.add('site-item');

            const location = site.location;  // Get the location from the site data

            siteItem.innerHTML = `
                <div class="site-wrapper">
                    <div class="icon-wrapper ${site.status.toLowerCase()}">
                        <span class="mat-icon material-symbols-sharp">location_on</span>
                    </div>
                    <div class="site-details">
                        <p>${site.sitenumber}</p>
                        <h3>${site.name}</h3>
                    </div>
                    <div class="site-control">
                        <a role="button" href="https://www.google.com/maps?q=${location}" target="_blank" class="btn">
                            Direction
                        </a>
                    </div>
                </div>
            `;

            siteListContainer.appendChild(siteItem);
            Button.init();
        });
    }
};

export const ReloadInnerCharts = {
    // Initialize the menu toggle functionality
    init: () => {
        // Attach the click event listener to #toggle-menu
        document.getElementById('toggle-menu').addEventListener('click', ReloadInnerCharts.chartReload);
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
                const systemAlarmsChart = document.getElementById('systemAlarmsDonutChart');
                if (systemAlarmsChart && !systemAlarmsChart.classList.contains('hide')) {
                    SystemAlarmsDonutChart.init();
                }

                const operationalAlarmsChart = document.getElementById('operationalDonutChart');
                if (operationalAlarmsChart && !operationalAlarmsChart.classList.contains('hide')) {
                    OperationalAlarmsDonutChart.init();
                }

                const selectedTankSiteElement = document.querySelector('#tanks-sites-list .sites-list li.selected');
                if (selectedTankSiteElement) {
                    const siteName = selectedTankSiteElement.querySelector('.site-name').textContent.trim();
                    TankVolumeBarChart.fetchTankData(siteName);
                    TankVolumeBarChart.fetchTankData(siteName);
                }

                const selectedDeliverySiteElement = document.querySelector('#delivery-sites-list .sites-list li.selected');
                if (selectedDeliverySiteElement) {
                    const siteName = selectedDeliverySiteElement.querySelector('.site-name').textContent.trim();
                    DeliveryBarChart.fetchDeliveryData(siteName);
                }
            });
        }
    }
};

const RunCharts = {
    init: () => {
        SiteStatus.init();
        ReloadInnerCharts.init();
    }
}

pageReady(() => {
    RunCharts.init();
    SiteList.init();
    SiteDT.init();
});