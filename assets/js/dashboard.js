//dashboard.js

// Unified Product Colors
const productColors = {
    gasoline95: '#25A96C',
    gasoline91: '#E92733',
    diesel: '#EF9F02',
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

// Tending Value for Product Usage from Last Monther
const TrendingUpdates = {
    init: () => {

        // Call the applyTrendingUpdates function
        TrendingUpdates.applyTrendingUpdates(1020038.997, GetCurrentProductValue.currentGasoline95Value, 'gasoline95'); 
        TrendingUpdates.applyTrendingUpdates(221038.997, GetCurrentProductValue.currentGasoline91Value, 'gasoline91');  
        TrendingUpdates.applyTrendingUpdates(608038.997, GetCurrentProductValue.currentDieselValue, 'diesel');  
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

        // Remove existing 'up' or 'down' classes
        trendingElement.classList.remove('up', 'down');
        trendingTagElement.innerHTML = ''; // Clear existing content

        // Add class and icon based on trend
        if (percentageChange > 0) {
            trendingElement.classList.add('up');
            trendingTagElement.innerHTML = `
                <span class="mat-icon material-symbols-sharp">trending_up</span> ${formattedPercentage}%
            `;
        } else if (percentageChange < 0) {
            trendingElement.classList.add('down');
            trendingTagElement.innerHTML = `
                <span class="mat-icon material-symbols-sharp">trending_down</span> ${formattedPercentage}%
            `;
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
        // Step 1: Load Google Charts library
        google.charts.load('current', { packages: ['corechart'] });

        // Step 2: Set callback to run when the library is loaded
        google.charts.setOnLoadCallback(GasolineUsagePieChart.drawPieChart);
    },

    // Step 4: Function to draw the Pie Chart
    drawPieChart: () => {

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

        // Set chart options (no 3D and custom colors with borders)
        const options = {
            title: '',
            is3D: false,
            slices: {
                0: { 
                    offset: 0.07, 
                    textStyle: { color: 'white' }, 
                    color: productColors.gasoline95, 
                    borderColor: '#990000', 
                    borderWidth: 0
                },  // Gasoline 95
                1: { 
                    offset: 0.12, 
                    textStyle: { color: 'white' }, 
                    backgroundColor: '#00ff00', 
                    color: productColors.gasoline91, 
                    borderColor: '#009900', 
                    borderWidth: 0
                },  // Gasoline 91
                2: { 
                    offset: 0.07, 
                    textStyle: { color: 'white' }, 
                    color: productColors.diesel, 
                    fillOpacity: 0.3,
                    borderColor: '#000099', 
                    borderWidth: 0 ,
                }   // Diesel
            },
            // chartArea: { width: '100%', height: '100%' },
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
            { label: 'Gasoline 95', color: productColors.gasoline95 },
            { label: 'Gasoline 91', color: productColors.gasoline91 },
            { label: 'Diesel', color: productColors.diesel }
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
    // init: () => {
    //     // Load Google Charts library
    //     google.charts.load('current', { packages: ['corechart'] });

    //     // Set callback to run when the library is loaded
    //     google.charts.setOnLoadCallback(FuelUsageAreaChart.drawAreaChart);
    // },

    // // Function to draw the Area Chart
    // drawAreaChart: () => {
    //     // Create the data table
    //     const data = new google.visualization.DataTable();
    //     data.addColumn('string', 'Fuel Type');
    //     data.addColumn('number', 'Current Value');

    //     // Add the data rows using the unified current values
    //     data.addRows([
    //         ['Gasoline 95', GetCurrentProductValue.currentGasoline95Value],
    //         ['Gasoline 91', GetCurrentProductValue.currentGasoline91Value],
    //         ['Diesel', GetCurrentProductValue.currentDieselValue]
    //     ]);

    //     // Set chart options
    //     const options = {
    //         colors: [productColors.gasoline95, productColors.gasoline91, productColors.diesel],
    //         isStacked: true,
    //         legend: { 
    //             position: 'none'  // Hides the default legend
    //         },
    //         vAxis: {
    //             title: 'Value',
    //             format: 'currency',  // Example: currency formatting for values
    //         },
    //         hAxis: {
    //             title: 'Fuel Type',
    //         },
    //         height: 400,
    //         animation: {
    //             startup: true,
    //             duration: 1000,
    //             easing: 'out'
    //         },
    //     };

    //     // Draw the chart in the specified div
    //     const areaChartWrapper = document.getElementById('comparisonUsageChart'); // Ensure this ID matches your HTML
    //     const chart = new google.visualization.AreaChart(areaChartWrapper);
    //     chart.draw(data, options);
        
    //     // Custom legend
    //     FuelUsageAreaChart.drawLegend(areaChartWrapper);
    // },

    // // Function to draw a custom legend
    // drawLegend: (wrapper) => {
    //     const legendData = [
    //         { label: 'Gasoline 95', color: productColors.gasoline95 },
    //         { label: 'Gasoline 91', color: productColors.gasoline91 },
    //         { label: 'Diesel', color: productColors.diesel }
    //     ];
    //     const legendContainer = wrapper.parentNode.querySelector('.chart-legend');
    //     legendData.forEach(item => {
    //         const legendItem = document.createElement('div');
    //         legendItem.classList.add('legend-item');
    //         legendItem.innerHTML = `
    //         <span class="legend-color" style="background-color: ${item.color};"></span>
    //         <span class="legend-label">${item.label}</span>
    //       `;
    //         legendContainer.appendChild(legendItem);
    //     });
    // }

    init: () => {
        // Load Google Charts library
        google.charts.load('current', { packages: ['corechart'] });
        
        // Set callback to run when the library is loaded
        google.charts.setOnLoadCallback(FuelUsageAreaChart.drawAreaChart);
    },

    // Function to draw the Area Chart
    drawAreaChart: () => {
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
        const options = {
            title: '',
            isStacked: false,  // Stack the areas (true, false, 'relative', 'percent')
            colors: [
                productColors.gasoline95,
                productColors.gasoline91,
                productColors.diesel
            ],
            legend: { position: 'none' }, // Position the legend at the bottom
            hAxis: {
                title: ''
            },
            vAxis: {
                title: ''
            },
            keepInBounds: true,
            curveType: 'function',            
        };

        // Draw the chart in the specified div
        const areaChartWrapper = document.getElementById('comparisonUsageChart');
        const chart = new google.visualization.LineChart(areaChartWrapper); // AreaChart or LineChart
        chart.draw(data, options);

        // Create a custom legend below the chart
        FuelUsageAreaChart.createLegend(areaChartWrapper);
    },

    // Create a custom legend with colored circles below the chart
    createLegend: (wrapper) => {
        const legendData = [
            { label: 'Gasoline 95', color: productColors.gasoline95 },
            { label: 'Gasoline 91', color: productColors.gasoline91 },
            { label: 'Diesel', color: productColors.diesel }
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

pageReady(() => {
    GetCurrentProductValue.init();
    FormatNumbers.init();
    GasolineUsagePieChart.init();
    FuelUsageAreaChart.init();
    TrendingUpdates.init();
});