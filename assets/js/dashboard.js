//dashboard.js

// Unified Product Colors
const SharedColors = {
    gasoline95: '#009C62',
    gasoline91: '#e54141',
    diesel: '#FAB75C',
    online: '#3db16d',
    offline: '#e61e45'
};

const AlarmsValues = {
    DISCONNECTED: { value: 6, color: '#7E66F5' },
    LOW_FLOW_HOSE_2: { value: 11, color: '#3A75B7' },
    PRODUCT_HIGH: { value: 2, color: '#008E84' },
    WATER_HIGH: { value: 4, color: '#EABD3B' },
    OVERFLOW: { value: 13, color: '#CB548C' },
    SUCTION: { value: 1, color: '#18D4D3' },
    SUDDEN_LOSS: { value: 6, color: "#0393B2" },
    PRODUCT_LOW: { value: 2, color: '#263049' },
    LOW_FLOW_HOSE_1: { value: 9, color: "#3F5C58" },
    DELIVERY_RECONCILIATION: { value: 7, color: "#F06635" },
    TANK_NO_LEVEL: { value: 7, color: "#B81337" },
};

const AlarmLabelMap = {
    DISCONNECTED: 'Disconnected',
    LOW_FLOW_HOSE_2: 'Low Flow Hose 2',
    PRODUCT_HIGH: 'High Product Level',
    WATER_HIGH: 'High Water Level',
    OVERFLOW: 'Overflow',
    SUCTION: 'Suction',
    LOW_FLOW_HOSE_1: 'Low Flow Hose 1',
    SUDDEN_LOSS: 'Sudden Loss',
    PRODUCT_LOW: 'Low Product Level',
    DELIVERY_RECONCILIATION: 'Delivery Reconciliation',
    TANK_NO_LEVEL: 'No Level Tank'


};

// Unified Product Value from the DOM
const GetCurrentProductValue = {
    currentGasoline95Value: null,
    currentGasoline91Value: null,
    currentDieselValue: null,

    parseFormattedNumber: (numberStr) => {
        return parseFloat(numberStr.replace(/,/g, '').trim());
    },

    getCurrentValue: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            const valueText = element.innerText || element.textContent;
            return GetCurrentProductValue.parseFormattedNumber(valueText);
        } else {
            console.error(`Element with ID ${elementId} not found.`);
            return 0;  // Fallback value if the element is not found
        }
    },

    // Method to initialize values
    init: () => {
        GetCurrentProductValue.currentGasoline95Value = GetCurrentProductValue.getCurrentValue('gasoline95-value');
        GetCurrentProductValue.currentGasoline91Value = GetCurrentProductValue.getCurrentValue('gasoline91-value');
        GetCurrentProductValue.currentDieselValue = GetCurrentProductValue.getCurrentValue('diesel-value');
    }
};

// Format the Value for each Product
const FormatNumbers = {
    init: () => {
        const valuesNodeList = document.querySelectorAll(".gts-value");
        if (valuesNodeList.length) {
            FormatNumbers.formatNumbersInSpans();
        }
    },
    formatNumbersInSpans: () => {
        document.querySelectorAll('.gts-value h3 span').forEach(span => {
            const originalNumber = span.textContent;
            const numberToFormat = parseFloat(originalNumber.replace(/,/g, '')); // Remove any commas or formatting

            if (!isNaN(numberToFormat)) {
                // Format the number without changing its decimal points
                const formattedNumber = numberToFormat.toLocaleString('en-US', { useGrouping: true });
                span.textContent = formattedNumber;
            }
        });
    }
}

const getChartBackgroundColor = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Check for dark mode (using localStorage or body class)
            const appearance = localStorage.getItem('gts-appearance');
            const isDarkMode = appearance === 'dark' ||
                (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
                document.body.classList.contains('dark-mode');

            // Resolve with the background color
            const backgroundColor = isDarkMode ? '#171721' : '#ffffff';
            resolve(backgroundColor);
        }, 0); // Adjust timeout if necessary
    });
};

// Tending Value for Product Usage from Last Monther
const TrendingUpdates = {
    init: () => {
        const trendingElement = document.querySelectorAll('.trending');
        if (trendingElement.length) {
            // Call the applyTrendingUpdates function
            TrendingUpdates.applyTrendingUpdates(1020038.997, GetCurrentProductValue.currentGasoline95Value, 'gasoline95');
            TrendingUpdates.applyTrendingUpdates(221038.997, GetCurrentProductValue.currentGasoline91Value, 'gasoline91');
            TrendingUpdates.applyTrendingUpdates(608038.997, GetCurrentProductValue.currentDieselValue, 'diesel');
        }
    },

    calculatePercentageChange: (firstWeek, lastWeek) => {
        // Handle the case where the first week value is zero to avoid division by zero
        if (firstWeek === 0) {
            return lastWeek > 0 ? 100 : 0; // Handle edge case where the value changes from 0 to something else
        }

        return ((lastWeek - firstWeek) / firstWeek) * 100;
    },

    updateTrendingElement: (element, percentageChange, formattedPercentage) => {
        const trendingElement = element.querySelector('.trending');
        const trendingTagElement = element.querySelector('.trending-tag');
        const trendingDurationElement = element.querySelector('.trending-duration');

        // Remove existing 'up' or 'down' classes
        trendingElement.classList.remove('up', 'down');
        trendingTagElement.innerHTML = ''; // Clear existing content
        trendingDurationElement.innerHTML = ''; // Clear existing content

        let trendMessage = '';

        // Add class and icon based on trend
        if (percentageChange > 0) {
            trendingElement.classList.add('up');
            trendingTagElement.innerHTML = `
                <span class="mat-icon material-symbols-sharp">trending_up</span> ${formattedPercentage}%
            `;
            trendMessage = 'Up from last month';
        } else if (percentageChange < 0) {
            trendingElement.classList.add('down');
            trendingTagElement.innerHTML = `
                <span class="mat-icon material-symbols-sharp">trending_down</span> ${formattedPercentage}%
            `;
            trendMessage = 'Down from last month';
        } else {
            trendMessage = 'No change from last month';
        }

        // Append the trend message to the .trending-duration element
        if (trendingDurationElement) {
            trendingDurationElement.innerHTML = `${trendMessage}`;
        }
    },

    applyTrendingUpdates: (firstWeek, lastWeek, className) => {
        // Calculate percentage change
        const percentageChange = TrendingUpdates.calculatePercentageChange(firstWeek, lastWeek);
        const formattedPercentage = Math.abs(percentageChange.toFixed(2));

        // Find the element with the className
        const element = document.querySelector(`.${className}`);

        if (element) {
            TrendingUpdates.updateTrendingElement(element, percentageChange, formattedPercentage);
        }
    }
};

// Pie Chart for Product Usage
const GasolineUsagePieChart = {
    init: () => {
        const gasolineChartWrapper = document.getElementById('currentUsageChart');
        if (gasolineChartWrapper) {
            // Step 1: Load Google Charts library
            google.charts.load('current', { packages: ['corechart'] });

            // Step 2: Set callback to run when the library is loaded
            google.charts.setOnLoadCallback(GasolineUsagePieChart.drawPieChart);
        }
    },

    // Step 4: Function to draw the Pie Chart
    drawPieChart: async () => {

        const backgroundColor = await getChartBackgroundColor();

        // Create the data table
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Fuel Type');
        data.addColumn('number', 'Liters');

        // Add the data rows
        data.addRows([
            ['Gasoline 95', GetCurrentProductValue.currentGasoline95Value],
            ['Gasoline 91', GetCurrentProductValue.currentGasoline91Value],
            ['Diesel', GetCurrentProductValue.currentDieselValue]
        ]);

        const windowWidth = window.innerWidth;
        // Set chart options (no 3D and custom colors with borders)
        const options = {
            title: '',
            is3D: false,
            backgroundColor: backgroundColor,
            slices: {
                0: {
                    offset: 0.07,
                    textStyle: { color: backgroundColor },
                    color: SharedColors.gasoline95,
                    borderColor: backgroundColor,
                    borderWidth: 0
                },  // Gasoline 95
                1: {
                    offset: 0.12,
                    textStyle: { color: backgroundColor },
                    backgroundColor: '#00ff00',
                    color: SharedColors.gasoline91,
                    borderColor: backgroundColor,
                    borderWidth: 0
                },  // Gasoline 91
                2: {
                    offset: 0.07,
                    textStyle: { color: backgroundColor },
                    color: SharedColors.diesel,
                    fillOpacity: 0.3,
                    borderColor: backgroundColor,
                    borderWidth: 0,
                }   // Diesel
            },
            chartArea: {
                width: windowWidth < 769 ? '90%' : '80%',
                height: windowWidth < 769 ? '90%' : '80%'
            },  // Make chart area 80% of the wrapper size
            pieSliceText: 'percentage',  // Show percentage in slices
            legend: { position: 'none' }  // Hide the default legend
        };

        // Draw the chart in the specified div
        const gasolineChartWrapper = document.getElementById('currentUsageChart');
        const chart = new google.visualization.PieChart(gasolineChartWrapper);
        chart.draw(data, options);

        // Step 5: Draw the legend beneath the chart
        GasolineUsagePieChart.createLegend(gasolineChartWrapper);
    },

    // Step 6: Create a custom legend with colored circles below the chart
    createLegend: (wrapper) => {
        const legendData = [
            { label: 'Gasoline 95', color: SharedColors.gasoline95 },
            { label: 'Gasoline 91', color: SharedColors.gasoline91 },
            { label: 'Diesel', color: SharedColors.diesel }
        ];
        const legendContainer = wrapper.parentNode.querySelector('.chart-legend');
        legendData.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');
            legendItem.innerHTML = `
            <span class="legend-color" style="background-color: ${item.color};"></span>
            <span class="legend-label">${item.label}</span>
          `;
            legendContainer.appendChild(legendItem);
        });
    }
};

// Area Chart for Fuel Usage for the Last 4 Weeks
const FuelUsageAreaChart = {
    init: () => {
        const areaChartWrapper = document.getElementById('comparisonUsageChart');
        if (areaChartWrapper) {
            // Load Google Charts library
            google.charts.load('current', { packages: ['corechart'] });

            // Set callback to run when the library is loaded
            google.charts.setOnLoadCallback(FuelUsageAreaChart.drawAreaChart);
        }
    },

    // Function to draw the Area Chart
    drawAreaChart: async () => {
        const backgroundColor = await getChartBackgroundColor();

        // Create the data table
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Week');
        data.addColumn('number', 'Gasoline 95');
        data.addColumn('number', 'Gasoline 91');
        data.addColumn('number', 'Diesel');

        // Add data rows for the last 4 weeks
        data.addRows([
            ['Week 1', 600000, 500000, 400000], // Week 1 values
            ['Week 2', 1020000, 310000, 615000], // Week 2 values
            ['Week 3', 500150, 809000, 59000], // Week 3 values
            ['Week 4',
                GetCurrentProductValue.currentGasoline95Value || 0,
                GetCurrentProductValue.currentGasoline91Value || 0,
                GetCurrentProductValue.currentDieselValue || 0
            ] // Current week values
        ]);

        // Set chart options
        const windowWidth = window.innerWidth;
        const options = {
            title: '',
            isStacked: false,  // Stack the areas (true, false, 'relative', 'percent')
            backgroundColor: backgroundColor,
            colors: [
                SharedColors.gasoline95,
                SharedColors.gasoline91,
                SharedColors.diesel
            ],
            chartArea: {
                width: '75%',
                height: windowWidth < 1281 ? '65%' : '65%'
            },  // Make chart area 80% of the wrapper size
            legend: { position: 'none' }, // Position the legend at the bottom
            hAxis: {
                title: '',
            },
            vAxis: {
                title: '',
            },
            keepInBounds: true,
            curveType: 'function',
            connectSteps: true,
        };

        // Draw the chart in the specified div
        const areaChartWrapper = document.getElementById('comparisonUsageChart');
        const chart = new google.visualization.LineChart(areaChartWrapper); // AreaChart or LineChart or ColumnChart
        chart.draw(data, options);

        // Create a custom legend below the chart
        FuelUsageAreaChart.createLegend(areaChartWrapper);
    },

    // Create a custom legend with colored circles below the chart
    createLegend: (wrapper) => {
        const legendData = [
            { label: 'Gasoline 95', color: SharedColors.gasoline95 },
            { label: 'Gasoline 91', color: SharedColors.gasoline91 },
            { label: 'Diesel', color: SharedColors.diesel }
        ];
        const legendContainer = wrapper.parentNode.querySelector('.chart-legend');
        legendData.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');
            legendItem.innerHTML = `
            <span class="legend-color" style="background-color: ${item.color};"></span>
            <span class="legend-label">${item.label}</span>
          `;
            legendContainer.appendChild(legendItem);
        });
    }
};

// Doughnut Chart for Sites Status
const SiteStatusChart = {
    init: () => {
        const chartWrapper = document.getElementById('siteStatusChart');
        if (chartWrapper) {
            // Load Google Charts library
            google.charts.load('current', { packages: ['corechart'] });

            // Set callback to run when the library is loaded
            google.charts.setOnLoadCallback(SiteStatusChart.drawSteppedAreaChart);
        }
    },

    // Function to draw the Stepped Area Chart
    drawSteppedAreaChart: async () => {
        const backgroundColor = await getChartBackgroundColor();

        // Step 1: Get values from DOM
        const onlineValue = parseInt(document.getElementById('online-value').textContent, 10);
        const offlineValue = parseInt(document.getElementById('offline-value').textContent, 10);

        // Step 2: Create the data table
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Status');
        data.addColumn('number', 'Online');
        data.addColumn('number', 'Offline');

        // Add the data rows for Online and Offline
        data.addRows([
            ['Online', onlineValue, 0],
            ['Offline', 0, offlineValue]
        ]);

        // Step 3: Set chart options
        const options = {
            title: '',
            isStacked: false,  // Stack the areas for better comparison
            backgroundColor: backgroundColor,
            hAxis: { title: '', textStyle: { fontSize: 12 } },
            vAxis: { title: '', minValue: 0 },
            // colors: ['#288048', '#e53434'],  // Custom colors for Online and Offline
            colors: [
                SharedColors.online,
                SharedColors.offline,
            ],
            chartArea: { width: '70%', height: '70%' },
            legend: { position: 'none' }  // Hide default legend
        };

        // Step 4: Draw the chart in the specified div
        const chartWrapper = document.getElementById('siteStatusChart');
        const chart = new google.visualization.SteppedAreaChart(chartWrapper);
        chart.draw(data, options);

        // Step 5: Draw the custom legend below the chart
        SiteStatusChart.createLegend(chartWrapper);
    },

    // Step 6: Create a custom legend with colored circles below the chart
    createLegend: (wrapper) => {
        const legendData = [
            { label: 'Online', color: SharedColors.online },
            { label: 'Offline', color: SharedColors.offline }
        ];
        const legendContainer = wrapper.parentNode.querySelector('.chart-legend');
        legendData.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');
            legendItem.innerHTML = `
                <span class="legend-color" style="background-color: ${item.color};"></span>
                <span class="legend-label">${item.label}</span>
            `;
            legendContainer.appendChild(legendItem);
        });
    }
};


// System Alarms Bar Chart
const SystemAlarmsChart = {
    init: () => {
        const systemAlarmsChart = document.getElementById('systemAlarmsChart');
        if (systemAlarmsChart) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(SystemAlarmsChart.drawChart);
        }
    },

    drawChart: () => {
        const data = new google.visualization.DataTable();
        const systemAlarmsChart = document.getElementById('systemAlarmsChart');

        // Define columns for alarm types and values
        data.addColumn('string', 'Alarm Type');
        data.addColumn('number', 'Count');
        data.addColumn({ type: 'string', role: 'style' }); // For bar colors

        // Add rows with alarm values and user-friendly labels
        Object.keys(AlarmsValues).slice(0, 6).forEach(alarmType => {
            const displayLabel = AlarmLabelMap[alarmType] || alarmType; // Map technical label to user-friendly label
            data.addRow([displayLabel, AlarmsValues[alarmType].value, `color: ${AlarmsValues[alarmType].color}`]);
        });

        // Chart options for vertical bars
        const options = {
            title: '',
            chartArea: { width: '80%', height: '70%' },
            hAxis: {
                title: '',
            },
            vAxis: {
                title: '',
                minValue: 0
            },
            legend: 'none',
        };

        // Draw the chart
        const chart = new google.visualization.ColumnChart(systemAlarmsChart);
        chart.draw(data, options);

        // Create the custom legend
        SystemAlarmsChart.createLegend(systemAlarmsChart);
    },

    // Create custom legend with colors and labels
    createLegend: (wrapper) => {
        // Add rows with alarm values and user-friendly labels
        const legendData = Object.keys(AlarmsValues).slice(0, 6).map(alarmType => ({
            label: alarmType,
            color: AlarmsValues[alarmType].color
        }));

        const legendContainer = wrapper.parentNode.querySelector('.chart-legend');
        legendContainer.innerHTML = ''; // Clear existing legend


        legendData.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');
            legendItem.innerHTML = `
          <span class="legend-color" style="background-color: ${item.color};"></span>
          <span class="legend-label">${AlarmLabelMap[item.label] || item.label}</span>
        `;
            legendContainer.appendChild(legendItem);
        });
    }
};

// System Alarms Donut Chart
const SystemAlarmsDonutChart = {
    init: () => {
        const systemAlarmsChart = document.getElementById('systemAlarmsDonutChart');
        if (systemAlarmsChart) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(SystemAlarmsDonutChart.drawChart);
        }
    },

    drawChart: () => {
        const data = new google.visualization.DataTable();

        // Define columns for alarm types and values
        data.addColumn('string', 'Alarm Type');
        data.addColumn('number', 'Count');

        // Add rows with alarm values and user-friendly labels
        Object.keys(AlarmsValues).slice(0, 6).forEach(alarmType => {
            const displayLabel = AlarmLabelMap[alarmType] || alarmType; // Map technical label to user-friendly label
            data.addRow([displayLabel, AlarmsValues[alarmType].value]);
        });

        // Chart options for donut chart
        const options = {
            title: '',
            pieHole: 0.4, // To make it a donut chart
            chartArea: { width: '80%', height: '80%' },
            colors: Object.keys(AlarmsValues).map(alarmType => AlarmsValues[alarmType].color),
            legend: 'none',
            pieSliceText: 'percentage', // Show percentage on the slices
            pieSliceTextStyle: {
                color: '#fff',
            },
            slices: {
                offset: 0.07,
            },
            // width: 699
        };

        // Draw the chart
        const systemAlarmsChart = document.getElementById('systemAlarmsDonutChart');
        const chart = new google.visualization.PieChart(systemAlarmsChart);
        chart.draw(data, options);

        // Create the custom legend
        SystemAlarmsDonutChart.createLegend(systemAlarmsChart);
    },

    // Create custom legend with colors and labels
    createLegend: (wrapper) => {
        // Add rows with alarm values and user-friendly labels
        const legendData = Object.keys(AlarmsValues).slice(0, 6).map(alarmType => ({
            label: alarmType,
            color: AlarmsValues[alarmType].color
        }));

        const legendContainer = wrapper.parentNode.querySelector('.chart-legend');
        legendContainer.innerHTML = ''; // Clear existing legend


        legendData.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');
            legendItem.innerHTML = `
          <span class="legend-color" style="background-color: ${item.color};"></span>
          <span class="legend-label">${AlarmLabelMap[item.label] || item.label}</span>
        `;
            legendContainer.appendChild(legendItem);
        });
    }
};

const OperationalAlarmsBarChart = {
    init: () => {
        const operationalAlarmsBarChart = document.getElementById('operationalAlarmsChart');
        if (operationalAlarmsBarChart) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(OperationalAlarmsBarChart.drawChart);
        }
    },

    drawChart: () => {
        const data = new google.visualization.DataTable();

        // Define columns for alarm types and values
        data.addColumn('string', 'Alarm Type');
        data.addColumn('number', 'Count');
        data.addColumn({ type: 'string', role: 'style' });

        // Filter the AlarmsValues to include only the two desired alarm types
        const alarmsToDisplay = ['SUDDEN_LOSS', 'DELIVERY_RECONCILIATION'];

        alarmsToDisplay.forEach(alarmType => {
            // Retrieve the values, colors, and labels from AlarmsValues
            const alarmValue = AlarmsValues[alarmType].value || 0; // Fallback to 0 if undefined
            const alarmColor = AlarmsValues[alarmType].color || '#000000'; // Default color if undefined
            const displayLabel = AlarmLabelMap[alarmType] || alarmType; // Map technical label to user-friendly label

            data.addRow([displayLabel, alarmValue, `color: ${alarmColor}`]);
        });

        // Chart options
        const options = {
            title: '',
            chartArea: { width: '70%', height: '50%' },
            legend: 'none',
            hAxis: {
                title: '',
            },
            vAxis: {
                title: '',
                minValue: 0
            },
        };

        // Draw the chart
        const operationalAlarmsBarChart = document.getElementById('operationalAlarmsChart');
        const chart = new google.visualization.BarChart(operationalAlarmsBarChart);
        chart.draw(data, options);

        // Create legend for the chart using the shared object
        OperationalAlarmsBarChart.createLegend(operationalAlarmsBarChart);
    },

    // Create custom legend with colors and labels for specific alarms
    createLegend: (wrapper) => {
        const alarmsToDisplay = ['SUDDEN_LOSS', 'DELIVERY_RECONCILIATION'];

        const legendData = alarmsToDisplay.map(alarmType => ({
            label: alarmType,
            color: AlarmsValues[alarmType].color
        }));

        const legendContainer = wrapper.parentNode.querySelector('.chart-legend');
        legendContainer.innerHTML = ''; // Clear existing legend

        legendData.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');
            legendItem.innerHTML = `
                <span class="legend-color" style="background-color: ${item.color};"></span>
                <span class="legend-label">${AlarmLabelMap[item.label] || item.label}</span>
            `;
            legendContainer.appendChild(legendItem);
        });
    }
};

const OperationalAlarmsDonutChart = {
    init: () => {
        const operationalAlarmsChart = document.getElementById('operationalDonutChart');
        if (operationalAlarmsChart) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(OperationalAlarmsDonutChart.drawChart);
        }
    },

    drawChart: () => {
        const data = new google.visualization.DataTable();

        // Define columns for alarm types and values
        data.addColumn('string', 'Alarm Type');
        data.addColumn('number', 'Count');

        // Use only the two specific alarms (SUDDEN_LOSS and DELIVERY_RECONCILIATION)
        const alarmsToDisplay = ['SUDDEN_LOSS', 'DELIVERY_RECONCILIATION'];
        alarmsToDisplay.forEach(alarmType => {
            const displayLabel = AlarmLabelMap[alarmType] || alarmType; // Map technical label to user-friendly label
            data.addRow([displayLabel, AlarmsValues[alarmType].value]);
        });

        // Chart options for donut chart
        const options = {
            title: '',
            pieHole: 0, // To make it a donut chart
            chartArea: { width: '65%', height: '65%' },
            colors: alarmsToDisplay.map(alarmType => AlarmsValues[alarmType].color),
            legend: 'none',
            pieSliceText: 'percentage', // Show percentage on the slices
            pieSliceTextStyle: {
                color: '#fff',
            },
            slices: {
                offset: 0.07,
            },
        };

        // Draw the chart
        const operationalAlarmsChart = document.getElementById('operationalDonutChart');
        const chart = new google.visualization.PieChart(operationalAlarmsChart);
        chart.draw(data, options);

        // Create the custom legend
        OperationalAlarmsDonutChart.createLegend(operationalAlarmsChart);
    },

    // Create custom legend with colors and labels
    createLegend: (wrapper) => {
        // Use only the two specific alarms (SUDDEN_LOSS and DELIVERY_RECONCILIATION)
        const alarmsToDisplay = ['SUDDEN_LOSS', 'DELIVERY_RECONCILIATION'];
        const legendData = alarmsToDisplay.map(alarmType => ({
            label: alarmType,
            color: AlarmsValues[alarmType].color
        }));

        const legendContainer = wrapper.parentNode.querySelector('.chart-legend');
        legendContainer.innerHTML = ''; // Clear existing legend

        legendData.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');
            legendItem.innerHTML = `
          <span class="legend-color" style="background-color: ${item.color};"></span>
          <span class="legend-label">${AlarmLabelMap[item.label] || item.label}</span>
        `;
            legendContainer.appendChild(legendItem);
        });
    }
};

const DownloadChart = {
    init: () => {

        // Select all download buttons and loop through them
        const downloadButtons = document.querySelectorAll('[data-popover-target="#download-chart"]');

        if (downloadButtons) {
            downloadButtons.forEach(button => {
                button.addEventListener('click', DownloadChart.openPopover);
            });

            // Select and set up event listeners for download options
            const downloadImageButton = document.getElementById('download-image');
            const downloadPDFButton = document.getElementById('download-pdf');

            if (downloadImageButton) {
                downloadImageButton.addEventListener('click', () => DownloadChart.download('image'));
            }

            if (downloadPDFButton) {
                downloadPDFButton.addEventListener('click', () => DownloadChart.download('pdf'));
            }
        }
    },

    openPopover: (e) => {
        const chartsWrapper = e.currentTarget.closest('.gts-charts');
        const chartArea = chartsWrapper.querySelector('.chart-area:not(.hide)'); // Find visible chart area
        if (chartArea) {
            const chartId = chartArea.id;
            const popover = document.querySelector('#download-chart'); // Assuming you have a popover with this ID
            popover.setAttribute('data-download-target', `#${chartId}`); // Set data attribute with chart ID

            // Open the popover
            const popoverBody = popover.querySelector('.popover-body');
            popover.style.display = 'block';

            // Set position and width (using your existing popover functions)
            Popover.setWidth(e.currentTarget, popoverBody);
            Popover.setPosition(e.currentTarget, popoverBody);
        }
    },

    download: (type) => {
        const popover = document.querySelector('#download-chart');
        const chartId = popover.getAttribute('data-download-target').slice(1);
        const chartsWrapper = document.querySelector(popover.getAttribute('data-download-target')).closest('.gts-charts');
        const chartElement = document.getElementById(chartId);
        const legendArea = chartsWrapper.querySelector('.chart-legend');
        if (type === 'image') {
            DownloadChart.downloadImage(chartsWrapper);
        } else if (type === 'pdf') {
            DownloadChart.downloadPDF(chartsWrapper);
        }
    },

    downloadImage: (chartsWrapper) => {
        // Use html2canvas or similar library to convert the chart to an image
        const excludeElement = chartsWrapper.querySelector('.gts-card-title');
        const chartTitle = excludeElement.querySelector('h3').textContent.trim();

        html2canvas(chartsWrapper, {
            ignoreElements: (element) => {
                return element === excludeElement; // Exclude the specified element
            }
        }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');

            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            const imageFileName = `${chartTitle.replace(/\s+/g, '_')}_${formattedDate}.png`;

            link.download = imageFileName; // Set the download file name
            link.click();
        });
    },

    downloadPDF: (chartsWrapper) => {
        // Use jsPDF or similar library to convert the chart to a PDF
        const excludeElement = chartsWrapper.querySelector('.gts-card-title');
        const chartTitle = excludeElement.querySelector('h3').textContent.trim();

        html2canvas(chartsWrapper, {
            ignoreElements: (element) => {
                return element === excludeElement; // Exclude the specified element
            }
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');

            // Create a new jsPDF instance
            window.jsPDF = window.jspdf.jsPDF;
            const pdf = new jsPDF();

            // Add the image to the PDF
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Adjust width and height as needed

            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            const imageFileName = `${chartTitle.replace(/\s+/g, '_')}_${formattedDate}.pdf`;

            // Save the PDF
            pdf.save(imageFileName);
        });
    }
};

const ToggleAlarmsCharts = {
    init: function () {
        // Attach event listeners to all toggle buttons
        const toggleChartNodes = document.querySelectorAll('.toggle-chart-btn');
        if (toggleChartNodes.length) {
            toggleChartNodes.forEach(button => {
                button.addEventListener('click', () => this.toggleCharts(button));
            });
        }
    },

    toggleCharts: function (button) {
        // Identify the chartsWrapper based on the button clicked
        const chartsWrapper = button.closest('.gts-charts');
        if (!chartsWrapper) return; // Exit if no parent found

        // Get the button ID to determine the context (system or operational)
        const buttonId = button.id;
        const iconTitle = chartsWrapper.querySelector('.gts-card-title-wrapper .mat-icon');
        const iconButton = button.querySelector('.mat-icon');

        // Define the icon and chart elements based on the button ID
        let chart, donutChart, chartIcon, donutIcon;

        if (buttonId === 'toggle-system') {
            // Icons for system alarms chart
            chartIcon = 'grouped_bar_chart';
            donutIcon = 'pie_chart';
            chart = chartsWrapper.querySelector('#systemAlarmsChart');
            donutChart = chartsWrapper.querySelector('#systemAlarmsDonutChart');
        } else if (buttonId === 'toggle-operational') {
            // Icons for operational alarms chart
            chartIcon = 'bar_chart';
            donutIcon = 'pie_chart';
            chart = chartsWrapper.querySelector('#operationalAlarmsChart');
            donutChart = chartsWrapper.querySelector('#operationalDonutChart');
        } else {
            return; // Exit if no valid button ID is found
        }

        // Determine which chart is currently displayed
        const isChartHidden = chart.classList.contains('hide');

        if (isChartHidden) {
            // Switch to the Bar chart
            iconTitle.innerHTML = chartIcon; // Change the icon in the title to bar chart
            iconButton.innerHTML = donutIcon; // Change the button icon to pie chart (for next toggle)

            // Hide the donut chart and show the bar chart
            donutChart.classList.add('hide');
            donutChart.innerHTML = '';

            chart.classList.remove('hide');

            // Only initialize the Bar chart if it's being displayed for the first time
            if (buttonId === 'toggle-system') {
                SystemAlarmsChart.init();
            } else {
                OperationalAlarmsBarChart.init();
            }

        } else {
            // Switch to the Donut chart
            iconTitle.innerHTML = donutIcon; // Change the icon in the title to pie chart
            iconButton.innerHTML = chartIcon; // Change the button icon to bar chart (for next toggle)

            // Hide the bar chart and show the donut chart
            chart.classList.add('hide');
            chart.innerHTML = '';
            donutChart.classList.remove('hide');

            // Only initialize the Donut chart if it's being displayed for the first time
            if (buttonId === 'toggle-system') {
                SystemAlarmsDonutChart.init();
            } else {
                OperationalAlarmsDonutChart.init();
            }
        }
    }

};

const TankVolumeBarChart = {
    init: () => {
        const tankVolumeChart = document.getElementById('tankVolumeChart');
        if (tankVolumeChart) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(TankVolumeBarChart.fetchTankData);
        }
    },

    fetchTankData: (siteName) => {
        // Fetch the tank data from the JSON file
        fetch('../../data/sites.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Find the site data based on the passed siteName
                const siteData = data.sites.find(site => site.siteName === siteName);

                if (siteData) {
                    // Draw the chart using the tanks data for the selected site
                    TankVolumeBarChart.drawChart(siteData.tanks);
                } else {
                    console.warn('Site not found');
                }
            })
            .catch(error => {
                console.error('Error fetching tank data:', error);
            });
    },

    drawChart: (tanks) => {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Tank Type');
        data.addColumn('number', 'Count');
        data.addColumn({ type: 'string', role: 'style' });

        // Populate the data table with tank information
        tanks.forEach(tank => {
            data.addRow([tank.product, tank.value, 'color: #3B76FD']); // You can adjust the color as needed
        });

        const options = {
            title: '',
            chartArea: { width: '70%', height: '60%' },
            hAxis: {
                title: '',
            },
            vAxis: {
                title: '',
                minValue: 0
            },
            legend: 'none',
        };

        // Draw the chart
        const tankVolumeChart = document.getElementById('tankVolumeChart');
        const chart = new google.visualization.ColumnChart(tankVolumeChart);
        chart.draw(data, options);
    }
};

const DeliveryBarChart = {
    init: () => {
        const deliveryVolumeChart = document.getElementById('deliveryVolumeChart');
        if (deliveryVolumeChart) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(DeliveryBarChart.fetchDeliveryData);
        }
    },

    fetchDeliveryData: (siteName) => {
        // Fetch the tank data from the JSON file
        fetch('../../data/sites.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Find the site data based on the passed siteName
                const siteData = data.sites.find(site => site.siteName === siteName);

                if (siteData) {
                    // Draw the chart using the tanks data for the selected site
                    DeliveryBarChart.drawChart(siteData.tanks);
                } else {
                    console.warn('Site not found');
                }
            })
            .catch(error => {
                console.error('Error fetching tank data:', error);
            });
    },

    drawChart: (tanks) => {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Tank Type');
        data.addColumn('number', 'Count');
        data.addColumn({ type: 'string', role: 'style' });

        // Populate the data table with tank information
        tanks.forEach(tank => {
            data.addRow([tank.product, tank.value, 'color: #3B76FD']); // You can adjust the color as needed
        });

        const options = {
            title: '',
            chartArea: { width: '70%', height: '60%' },
            hAxis: {
                title: '',
            },
            vAxis: {
                title: '',
                minValue: 0
            },
            legend: 'none',
        };

        // Draw the chart
        const deliveryVolumeChart = document.getElementById('deliveryVolumeChart');
        const chart = new google.visualization.ColumnChart(deliveryVolumeChart);
        chart.draw(data, options);
    }
};

// **** Demo Fetch Sites Into Page **** //
    const PopulateSiteLists = {
        // Initialization function to fetch data and populate lists
        init: async function () {
            try {
                const siteData = await this.fetchSiteData();
                this.populateLists(siteData);
                this.addEventListeners();
            } catch (error) {
                console.error("Error loading site data:", error);
            }
        },

        // Fetch site data from the JSON file
        fetchSiteData: async function () {
            const response = await fetch('../../data/sites.json');
            if (!response.ok) {
                throw new Error('Failed to fetch site data');
            }
            return await response.json();
        },

        // Populate the sites lists with fetched data
        populateLists: function (siteData) {
            const tanksListContainer = document.querySelector('#tanks-sites-list .sites-list ul');
            const deliveryListContainer = document.querySelector('#delivery-sites-list .sites-list ul');

            // Helper function to create site list items
            const createSiteListItem = (site, index, target) => {
                const listItem = document.createElement('li');
                const siteName = document.createElement('span');
                siteName.classList.add('site-name');
                siteName.textContent = site.siteName;

                const tankCount = document.createElement('span');
                tankCount.classList.add('tanks-length');
                tankCount.textContent = site.tanks.length;

                listItem.appendChild(siteName);
                listItem.appendChild(tankCount);
                if (index === 0) {
                    listItem.classList.add('selected');
                    const tankSiteName = listItem.querySelector('.site-name').textContent.trim();
                    TankVolumeBarChart.fetchTankData(tankSiteName);
                    const deliverySiteName = listItem.querySelector('.site-name').textContent.trim();
                    DeliveryBarChart.fetchDeliveryData(deliverySiteName);
                }

                return listItem;
            };

            // Populate both site lists with siteData
            siteData.sites.forEach((site, index, target) => {
                // Check if there's enough storage before adding new items
                try {                
                    tanksListContainer.appendChild(createSiteListItem(site, index, 'tanks'));
                    deliveryListContainer.appendChild(createSiteListItem(site, index, 'delivery'));
                } catch (e) {
                    if (e.name === 'QuotaExceededError') {
                        console.error('Storage limit exceeded. Consider clearing unused data.');
                        // Implement cleanup or notify user here
                    }
                }
            });
            
        },

        // Add event listeners for filtering
        addEventListeners: function () {
            const tanksFilterInput = document.querySelector('#tanks-sites-list .site-filter input');
            const deliveryFilterInput = document.querySelector('#delivery-sites-list .site-filter input');
            const tanksListContainer = document.querySelector('#tanks-sites-list .sites-list ul');
            const deliveryListContainer = document.querySelector('#delivery-sites-list .sites-list ul');

            // Add input event listener to each filter input
            tanksFilterInput.addEventListener('input', () => this.filterSites(tanksFilterInput, tanksListContainer));
            deliveryFilterInput.addEventListener('input', () => this.filterSites(deliveryFilterInput, deliveryListContainer));

            const tankListItems = document.querySelectorAll('#tanks-sites-list .sites-list li');
            tankListItems.forEach(item => {
                item.addEventListener('click', function () {
                    // Remove 'selected' class from all items
                    tankListItems.forEach(i => i.classList.remove('selected'));

                    // Add 'selected' class to the clicked item
                    this.classList.add('selected');

                    // Get the site name from the clicked item
                    const tankSiteName = this.querySelector('.site-name').textContent.trim(); // Get the site name

                    // Call fetchTankData to update the chart based on the selected site
                    TankVolumeBarChart.fetchTankData(tankSiteName);
                });
            });

            const deliveryListItems = document.querySelectorAll('#delivery-sites-list .sites-list li');
            deliveryListItems.forEach(item => {
                item.addEventListener('click', function () {
                    // Remove 'selected' class from all items
                    deliveryListItems.forEach(i => i.classList.remove('selected'));

                    // Add 'selected' class to the clicked item
                    this.classList.add('selected');

                    // Get the site name from the clicked item
                    const deliverySiteName = this.querySelector('.site-name').textContent.trim();

                    // Call fetchDeliveryData to update the chart based on the selected site
                    DeliveryBarChart.fetchDeliveryData(deliverySiteName);

                });
            });
        },

        // Filter function for site lists
        filterSites: function (input, container) {
            const filterValue = input.value.toLowerCase();
            const listItems = container.querySelectorAll('li');

            listItems.forEach((item) => {
                // Get the site name by excluding .tanks-length content
                const siteName = item.childNodes[0].textContent.toLowerCase().trim();
                item.style.display = siteName.includes(filterValue) ? '' : 'none';
            });
        }

    };
// **** End Demo Fetch Sites Into Page **** //


// We will Reload Charts on Menu Collapsed
const ReloadCharts = {
    // Initialize the menu toggle functionality
    init: () => {
        // Attach the click event listener to #toggle-menu
        document.getElementById('toggle-menu').addEventListener('click', ReloadCharts.chartReload);

        // Attach the event listener to appearnce toggle
        const appearanceWrapper = document.querySelector('#appearance-wrapper');
        if (appearanceWrapper) {
            const appearanceItems = appearanceWrapper.querySelectorAll('label');
            appearanceItems.forEach((item) => {
                item.addEventListener('click', ReloadCharts.chartReload);
            });
        }
    },

    chartReload: () => {
        // Step 1: Check if the .gts-charts element exists
        if (document.querySelector('.gts-charts')) {
            // Step 2: Kill current charts by clearing their containers
            const chartContainers = document.querySelectorAll('.gts-charts .chart-area');
            const chartLegend = document.querySelectorAll('.gts-charts .chart-legend'); // Assuming each chart has a wrapper
            chartContainers.forEach(container => {
                container.innerHTML = ''; // Clear the chart container
            });

            chartLegend.forEach(container => {
                container.innerHTML = ''; // Clear the chart container
            });

            // Optional: If your charts have specific cleanup logic, call that here
            // Example: GasolineUsagePieChart.clear(); or similar if implemented

            // Step 3: Reload the charts
            setTimeout(() => {
                RunCharts.init();
                const systemAlarmsChart = document.getElementById('systemAlarmsDonutChart');
                if (!systemAlarmsChart.classList.contains('hide')) {
                    SystemAlarmsDonutChart.init();
                }

                const operationalAlarmsChart = document.getElementById('operationalDonutChart');
                if (!operationalAlarmsChart.classList.contains('hide')) {
                    OperationalAlarmsDonutChart.init();
                }

                const selectedTankSiteElement = document.querySelector('#tanks-sites-list .sites-list li.selected');
                if (selectedTankSiteElement) {
                    const siteName = selectedTankSiteElement.querySelector('.site-name').textContent.trim();
                    TankVolumeBarChart.fetchTankData(siteName);
                }

                const selectedDeliverySiteElement = document.querySelector('#delivery-sites-list .sites-list li.selected');
                if (selectedDeliverySiteElement) {
                    const siteName = selectedDeliverySiteElement.querySelector('.site-name').textContent.trim();
                    DeliveryBarChart.fetchDeliveryData(siteName);
                }

            }, 0);
        }
    }
};

const RunCharts = {
    init: () => {
        GasolineUsagePieChart.init();
        FuelUsageAreaChart.init();
        SiteStatusChart.init();
        SystemAlarmsChart.init();
        OperationalAlarmsBarChart.init();
        TankVolumeBarChart.init();
    }
}

pageReady(() => {
    // Demo Function
        PopulateSiteLists.init();
    // End Demo

    GetCurrentProductValue.init();
    FormatNumbers.init();
    TrendingUpdates.init();
    RunCharts.init();
    ReloadCharts.init();
    ToggleAlarmsCharts.init();
    DownloadChart.init();
});