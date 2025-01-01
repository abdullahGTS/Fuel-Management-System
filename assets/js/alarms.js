//alarms.js
import { pageReady, Button, Drawer, Tab, DataTable, Select, DatePicker, DatatableFilter } from './script.js';
import { API_PATHS, fetchData, SharedColors, ChartBackgroundColor } from './constant.js';
import { AppearanceToggle } from './portal.js';


const FetchData = {
    init: async() => {
        const response = await fetchData(API_PATHS.alarmData);
        if (!response || Object.keys(response).length === 0) {
            console.error("No response data available");
            return;
        }
        return response;
    }
}

// Usage
const AlarmFilter = {
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
            AlarmFilter.state.response = response;

            // Get all unique filter categories from the response
            const filterOptions = {
                'Site Numbers': {
                    options: [...new Set(response.map(item => item.sitenumber))],
                    originalKey: 'sitenumber'
                },
                'Sources': {
                    options: [...new Set(response.map(item => item.source))],
                    originalKey: 'source'
                },
                'Alarm Type': {
                    options: [...new Set(response.map(item => item.type))],
                    originalKey: 'type'
                },
                'Is Active': {
                    options: [...new Set(response.map(item => item.isactive))],
                    originalKey: 'isactive'
                },
                'Severities': {
                    options: [...new Set(response.map(item => item.severity))],
                    originalKey: 'severity'
                },
                'Devices': {
                    options: [...new Set(response.map(item => item.device))],
                    originalKey: 'device'
                },
                'Date': {
                    options: [...new Set(response.map(item => item.time))],
                    originalKey: 'time'
                }
            };

            // Update state with filter options
            AlarmFilter.state.filterOptions = filterOptions;
            const dateKeys = ['time'];
            // Initialize filters with the fetched alarm data
            const selectedFilters = await DatatableFilter.init(dtFilterWrapper, response, filterOptions, AlarmFilter, AlarmDT, dateKeys);

            // Update state with selected filters
            AlarmFilter.state.selectedFilters = selectedFilters;

            if (selectedFilters) {
                AlarmFilter.filterSubmit(selectedFilters);  // Apply filters on load
            }
        }
    },

    filterSubmit: async (filters) => {
        const { response } = AlarmFilter.state;
        const filteredAlarms = await AlarmFilter.applyFilters(filters, response);

        // Update DataTable with filtered alarms
        AlarmDT.init(filteredAlarms);
    },

    applyFilters: (filters, response) => {
        let filteredAlarms = response; // Start with the full alarm list

        Object.entries(filters).forEach(([key, values]) => {
            if (key === 'time' && values.from && values.to) {
                // Filter by date range
                const from = new Date(values.from);
                const to = new Date(values.to);
                filteredAlarms = filteredAlarms.filter(res => {
                    const responseDate = new Date(res[key]);
                    return responseDate >= from && alarmDate <= to;
                });
            } else {
                // Other filters (multi-select)
                filteredAlarms = filteredAlarms.filter(res => {
                    return values.some(value => String(res[key]) === String(value));
                });
            }
        });

        return filteredAlarms; // Return filtered alarms
    },
};

const AlarmDT = {
    // Initialize the Site DataTable
    init: async (filteredAlarms) => {

        const alarmDT = document.querySelector("#alarmDT");
        if (alarmDT) {
            let alarms;
            if (!filteredAlarms) {
                alarms = await AlarmDT.fetchData();
            } else {
                if (filteredAlarms.length) {
                    alarmDT.innerHTML = '';
                    alarms = filteredAlarms;
                } else {
                    alarmDT.innerHTML = '';
                    AlarmDT.emptyState(alarmDT);
                }
            }

            if (alarms && alarms.length > 0) {
                const formattedData = AlarmDT.transformData(alarms);
                DataTable.init(".gts-dt-wrapper", {
                    data: formattedData,
                    columns: [
                        { title: `<span class="mat-icon material-symbols-sharp">numbers</span>`, data: "id" },
                        { title: `<span class="mat-icon material-symbols-sharp">location_on</span> Site Number`, data: "sitenumber" },
                        { title: `<span class="mat-icon material-symbols-sharp">verified</span> Site Name`, data: "sitename" },
                        { title: `<span class="mat-icon material-symbols-sharp">notifications_active</span> Type`, data: "type" },
                        { title: `<span class="mat-icon material-symbols-sharp">personal_bag_question</span> Is Active`, data: "isactive" },
                        { title: `<span class="mat-icon material-symbols-sharp">cloud</span> Source`, data: "source" },
                        { title: `<span class="mat-icon material-symbols-sharp">schedule</span> Time`, data: "alarmtime", width: "200px" },
                        {
                            title: `<span class="mat-icon material-symbols-sharp">notification_important</span> Severity`, data: "severity",
                            render: (data, type, row) => {
                                return `<div class="status-dt"><span class="severity ${data.toLowerCase()}">${data}</span></div>`;
                            }
                        },
                        { title: `<span class="mat-icon material-symbols-sharp">local_gas_station</span> Device`, data: "device" },
                    ],
                    responsive: true,
                    paging: formattedData.length > 10,
                    pageLength: 10,
                }, [
                    { width: "0px", targets: 0 },  // Hide the first column (id)
                    { width: "480px", targets: 6 },
                    { width: "100px", targets: 7 },
                ], "Alarm data table");
            } else {
                console.error("No alarms data available");
            }
        }
    },

    // Fetch data from the API
    fetchData: async () => {
        try {
            const response = await FetchData.init();
            const alarms = await DataTable.fetchData(response);
            return alarms;
        } catch (error) {
            console.error("Error fetching AlarmDT data:", error);
            return [];
        }
    },

    // Transform the raw API data for the DataTable
    transformData: (data) => {
        return data.map((alarm) => ({
            id: alarm.id,
            sitename: alarm.sitename,
            sitenumber: alarm.sitenumber,
            type: alarm.type,
            isactive: alarm.isactive,
            source: alarm.source,
            alarmtime: alarm.time,
            severity: alarm.severity,
            device: alarm.device,
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

const AlarmSeverity = {
    init: () => {
        const alarmTrendChart = document.querySelector('#alarmTrendChart');
        if (alarmTrendChart) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(AlarmSeverity.fetchData);
        }
    },
    fetchData: async () => {
        const alarms = await fetchData(API_PATHS.alarmData);
        if (!alarms || Object.keys(alarms).length === 0) {
            console.error("No alarms data available");
            return;
        }

        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => AlarmSeverity.drawChart(alarms));
    },
    drawChart: async (alarms) => {
        const { backgroundColor, txtColor, } = await ChartBackgroundColor();

        // Prepare the DataTable for Google Charts
        const data = new google.visualization.DataTable();

        // Add Columns
        data.addColumn('string', 'Severity'); // X-Axis: Severity types
        data.addColumn('number', 'Count');   // Y-Axis: Counts
        data.addColumn({ type: 'string', role: 'style' }); // Style column for colors

        // Define severity levels and their corresponding colors
        const severityColors = {
            Unknown: '#9c9b9b',
            Alarm: '#e61e45',
            Warning: '#FAB75C',
            Info: '#2753c4'
        };

        // Count the occurrences of each severity type
        const severityCounts = alarms.reduce((acc, alarm) => {
            acc[alarm.severity] = (acc[alarm.severity] || 0) + 1;
            return acc;
        }, {});

        // Convert the counts into rows for the DataTable, including color styles
        const chartRows = Object.entries(severityCounts).map(([severity, count]) => [
            severity,
            count,
            `color: ${severityColors[severity] || '#000000'}` // Use the defined color or fallback to black
        ]);
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
        const chart = new google.visualization.ColumnChart(document.getElementById('alarmTrendChart'));
        chart.draw(data, options);
    }
}

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
                const alarmTrendChart = document.getElementById('alarmTrendChart');
                if (alarmTrendChart && !alarmTrendChart.classList.contains('hide')) {
                    AlarmSeverity.init();
                }
            });
        }
    }
};

const RunCharts = {
    init: () => {
        AlarmSeverity.init();
        ReloadAlarmsCharts.init();
    }
}

AppearanceToggle.registerCallback((mode) => {
    ReloadAlarmsCharts.chartReload();
});

pageReady(() => {
    AlarmDT.init();
    RunCharts.init();
    AlarmFilter.init();
});