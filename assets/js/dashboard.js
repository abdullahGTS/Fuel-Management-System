//dashboard.js
import { pageReady, Popover } from './script.js';
import { API_PATHS, fetchData, SharedColors, ChartBackgroundColor } from './constant.js';

const ProductLabels = {
    "gas95": "Gasoline 95",
    "gas92": "Gasoline 92",
    "gas91": "Gasoline 91",
    "gas80": "Gasoline 80",
    "diesel": "Diesel",
    "cng": "CNG"
}

// Shared Download Chart
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

// Fetch Product Data
const Products = {

    init: async () => {
            const products = await fetchData(API_PATHS.dashboardProducts);
            Products.renderProducts(products);
    },
    renderProducts: (products) => {
        const productsCards = document.getElementById('productsCards');
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
                quantityValue.textContent = Products.parseFormattedNumber(products[key]);
        
                // Add unit after the value
                quantityHeader.appendChild(quantityValue);
                quantityHeader.insertAdjacentText('beforeend', ' lts');
        
                // Create the product name/label as a paragraph
                const productLabel = document.createElement('p');
                productLabel.textContent = ProductLabels[key] || key;
        
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
        if ( Object.keys(products).length > 3 ) {
            Products.scrollProducts(productsCards, Object.keys(products).length);
        }
    },
    scrollProducts: (productsCards, items) => {
        // Get the width of the first product card
        const itemWidth = productsCards.querySelector('.gts-grid .gts-grid-item:first-child').offsetWidth;
        productsCards.querySelectorAll('.gts-grid .gts-grid-item').forEach((card) => {
            card.style.width = `${itemWidth}px`;
        });
        productsCards.style.width = `${itemWidth * 3} + 15` + `px`;
    },
    
    parseFormattedNumber: (numberStr) => {
        const formattedNumber = numberStr.replace(/,/g, '').trim();
        const parsedNumber = parseFloat(formattedNumber);
        
        if (isNaN(parsedNumber)) {
            console.error('Invalid number format:', numberStr);
            return '0'; // Return a string so it can be displayed
        }
    
        // Format the number with commas
        return parsedNumber.toLocaleString();
    },
}

// Product Usage
const ProductsUsage = {
    init: () => {
        const gasolineChartWrapper = document.getElementById('currentUsageChart');
        if (gasolineChartWrapper) {
            // Step 1: Load Google Charts library
            google.charts.load('current', { packages: ['corechart'] });

            // Step 2: Set callback to run when the library is loaded
            google.charts.setOnLoadCallback(ProductsUsage.drawPieChart);
        }
    },

    // Step 4: Function to draw the Pie Chart
    drawPieChart: async () => {
        const { backgroundColor } = await ChartBackgroundColor();
    
        // Create the data table
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Fuel Type');
        data.addColumn('number', 'Liters');
        data.addColumn({ type: 'string', role: 'style' });
    
        const products = await fetchData(API_PATHS.dashboardProducts);
        if (!products || Object.keys(products).length === 0) {
            console.error("No product data available");
            return;
        }
    
        // Populate data table and prepare slices for each product dynamically
        const slices = {};
        Object.keys(products).forEach((key, index) => {
            const productName = ProductLabels[key] || key;
            const productValue = Number(products[key]);
    
            if (!isNaN(productValue)) {
                let colorCode = key;
                if ( key === 'gas95' ) colorCode = 'gasoline95';
                if ( key === 'gas92' ) colorCode = 'gasoline92';
                if ( key === 'gas91' ) colorCode = 'gasoline91';
                if ( key === 'gas80' ) colorCode = 'gasoline80';
    
                const color = SharedColors[colorCode.toLowerCase()] || '#ccc';
                data.addRow([productName, productValue, `color: ${color}`]);
    
                // Use SharedColors with lowercase product name as the key
                slices[index] = {
                    offset: 0.04,
                    textStyle: { color: backgroundColor },
                    borderColor: backgroundColor,
                    borderWidth: 0,
                    color: color // Ensure the color is included here
                };
            } else {
                console.warn(`Invalid number value for ${productName}: ${products[key]}`);
            }
        });
    
        const windowWidth = window.innerWidth;
        // Set chart options with dynamically created slices
        const options = {
            title: '',
            is3D: false,
            backgroundColor: backgroundColor,
            slices: slices, // Dynamic slices based on data
            pieSliceBorderColor: backgroundColor,
            chartArea: {
                width: windowWidth < 769 ? '80%' : '75%',
                height: windowWidth < 769 ? '80%' : '75%'
            },
            pieSliceText: 'percentage',  // Show percentage in slices
            legend: { position: 'none' }  // Hide the default legend
        };
    
        // Draw the chart in the specified div
        const gasolineChartWrapper = document.getElementById('currentUsageChart');
        const chart = new google.visualization.PieChart(gasolineChartWrapper);
        chart.draw(data, options);
    
        // Step 5: Draw the legend beneath the chart
        ProductsUsage.createLegend(gasolineChartWrapper, data, options);
    },
    

    // Step 6: Create a custom legend with colored circles below the chart
    createLegend: (wrapper, data, options) => {
        const legendContainer = wrapper.parentNode.querySelector('.chart-legend');
        legendContainer.innerHTML = ''; // Clear any existing legend items

        // Loop through chart data to dynamically create legend items
        for (let i = 0; i < data.getNumberOfRows(); i++) {
            const label = data.getValue(i, 0);
            const color = options.slices[i].color || '#000';  // get color from slices

            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');
            legendItem.innerHTML = `
                <span class="legend-color" style="background-color: ${color};"></span>
                <span class="legend-label">${label}</span>
            `;
            legendContainer.appendChild(legendItem);
        }
    }
};

// Site Status
const SiteStatus = {
    init: () => {
        const onlineSites = document.getElementById('onlineSitesChart');
        const offlineSites = document.getElementById('offlineSitesChart');

        if (onlineSites && offlineSites) {
            // Step 1: Load Google Charts library
            google.charts.load('current', { packages: ['corechart'] });

            // Step 2: Set callback to run when the library is loaded
            google.charts.setOnLoadCallback(SiteStatus.drawChart);
        }
    },

    drawChart: async () => {
        // Fetch background color and site data
        const { secondaryBgColor, secondaryAlphaColor } = await ChartBackgroundColor();
        const sites = await fetchData(API_PATHS.dashboardOnlineOffline);
        if (!sites || Object.keys(sites).length === 0) {
            console.error("No sites data available");
            return;
        }

        // Calculate total sites
        const totalSites = sites.online + sites.offline;

        // Update total, online, and offline site values in HTML
        document.getElementById('totalSitesValue').textContent = totalSites;
        document.getElementById('onlineSitesValue').textContent = sites.online;
        document.getElementById('offlineSitesValue').textContent = sites.offline;

        // Draw the charts for online and offline sites
        SiteStatus.drawDonutChart('onlineSitesChart', sites.online, totalSites, SharedColors.online, secondaryBgColor, secondaryAlphaColor);
        SiteStatus.drawDonutChart('offlineSitesChart', sites.offline, totalSites, SharedColors.offline, secondaryBgColor, secondaryAlphaColor);
    },

    drawDonutChart: (elementId, value, total, color, secondaryBgColor, secondaryAlphaColor) => {
        const windowWidth = window.innerWidth;
        const data = google.visualization.arrayToDataTable([
            ['Status', 'Sites'],
            ['Value', value],
            ['Remaining', total - value],
        ]);

        const options = {
            pieHole: 0.65,
            pieStartAngle: 0,
            pieSliceText: 'none', // Hide value text inside the chart
            slices: {
                0: { color: color, offset: 0.1 },
                1: { color: secondaryAlphaColor },
            },
            backgroundColor: secondaryBgColor,
            legend: 'none', 
            pieSliceBorderColor: secondaryBgColor,
            chartArea: {
                width: windowWidth < 769 ? '80%' : '80%',
                height: windowWidth < 769 ? '80%' : '80%'
            }
        };

        // Create and draw the chart
        const chart = new google.visualization.PieChart(document.getElementById(elementId));
        chart.draw(data, options);
    },
};

// Sales Trend
const SalesTrend = {
    currentTab: 'today', // Default to 'today'

    init: () => {
        const salesTrendChart = document.getElementById('salesTrendChart');
        if (salesTrendChart) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(SalesTrend.fetchData);
            SalesTrend.tabSwtch(salesTrendChart);
        }
    },

    tabSwtch: (wrapper) => {
        const salesTabsNodeList = wrapper.parentNode.querySelectorAll('.tab-btn');
        if (salesTabsNodeList.length) {
            salesTabsNodeList.forEach((tab) => {
                tab.addEventListener('click', function() {
                    salesTabsNodeList.forEach((item) => {
                        item.classList.remove('active');
                    });
                    tab.classList.add('active');
                    const selectedTab = tab.getAttribute('data-tab-target');
                    console.log('salesTabsNodeList', selectedTab);
                    SalesTrend.setTab(selectedTab);
                });
            });
        }
    },

    // This function will set the current tab and trigger data fetching
    setTab: (tab) => {
        SalesTrend.currentTab = tab; // Set the current tab
        SalesTrend.fetchData(); // Fetch data based on the selected tab
    },

    fetchData: async () => {
        let salesByDate;
        let salesArray;

        // Use the currentTab to determine which sales data to fetch
        switch (SalesTrend.currentTab) {
            case 'today':
                salesByDate = API_PATHS.dashboardSalesToday;
                salesArray = 'sales_by_hour';
                break;
            case 'yesterday':
                salesByDate = API_PATHS.dashboardSalesYesterday;
                salesArray = 'sales_by_hour';
                break;
            case 'lastWeek':
                salesByDate = API_PATHS.dashboardSalesLastWeek;
                salesArray = 'sales_by_day';
                break;
            case 'lastMonth':
                salesByDate = API_PATHS.dashboardSalesLastMonth;
                salesArray = 'sales_by_week';
                break;
            default:
                console.error('Unknown tab:', SalesTrend.currentTab);
                return;
        }

        const sales = await fetchData(salesByDate);
        if (!sales || Object.keys(sales).length === 0) {
            console.error("No sales data available");
            return;
        }

        // Update the chart with new data
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => SalesTrend.drawChart(sales[salesArray]));
    },

    // Updated drawChart function
    drawChart: async (sales) => {
        const { backgroundColor } = await ChartBackgroundColor();
        // Create the DataTable
        const data = new google.visualization.DataTable();
        const products = [...new Set(sales.map(item => item.gradeid__name))];
    
        // Dynamically add columns based on the data structure
        switch (SalesTrend.currentTab) {
            case 'today':
            case 'yesterday':
                data.addColumn('string', 'Hour');
                break;
            case 'lastWeek':
                data.addColumn('string', 'Day');
                break;
            case 'lastMonth':
                data.addColumn('string', 'Week');
                break;
        }
    
        // Add columns dynamically for each product
        products.forEach(product => {
            data.addColumn('number', product); 
        });
    
        // Determine the correct time unit for the selected tab (hour, day, week)
        const timeUnit = SalesTrend.getTimeUnit(); // 'hour', 'day', or 'week'
    
        // Extract raw time units (no formatting yet)
        const timeUnits = [...new Set(sales.map(item => item[timeUnit]))];
    
        // If timeUnits are empty, log to debug
        if (timeUnits.length === 0) {
            console.error("No time units found. Check the sales data and time unit mapping.");
        }
    
        // Function to format the raw date into a readable string (e.g., "12:30 PM" for hours)
        const formatTimeUnit = (unit, timeUnit) => {
            const date = new Date(unit);  // Create a Date object from the time unit
    
            // Format according to the selected time unit (hour, day, or week)
            switch (timeUnit) {
                case 'hour':
                    const hours = date.getHours();
                    const minutes = date.getMinutes();
                    const period = hours >= 12 ? 'PM' : 'AM';
                    return `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
                case 'day':
                    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
                    return date.toLocaleDateString('en-US', options); // Format as 'Wed, Dec 07, 2022'
                case 'week':
                    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay())); // Get the start of the week
                    return `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                default:
                    return unit; // If no formatting needed
            }
        };
    
        // Prepare data rows based on the selected time period (hour, day, week)
        const formattedTimeUnits = timeUnits.map(unit => formatTimeUnit(unit, timeUnit)); // Format all time units
    
        formattedTimeUnits.forEach((unit, index) => {
            const row = [unit]; // Initialize row with the formatted time unit (hour, day, week)
    
            // For each product, filter the sales data and sum the total money for that time unit
            products.forEach(product => {
                const salesForProduct = sales.filter(item => item.gradeid__name === product && item[timeUnit] === timeUnits[index]);
                const totalMoney = salesForProduct.reduce((sum, item) => sum + parseFloat(item.total_money || 0), 0); // Sum the total money for that product
                row.push(totalMoney); // Add the total money for the product in that time unit
            });
    
            // Add the row to the DataTable
            data.addRow(row);
        });
    
        // Chart options
        const options = {
            title: '',
            // curveType: 'function',
            legend: { position: 'none' },
            isStacked: false,
            backgroundColor: backgroundColor,
            hAxis: {
                title: SalesTrend.getAxisLabel(),
            },
            vAxis: {
                title: '',
            },
            chartArea: {
                width: '75%',
                height: '80%',
            },
            colors: products.map((product, index) => SharedColors[product.toLowerCase()]),
            lineWidth: 3,
        };
    
        // Create and draw the chart
        const chart = new google.visualization.LineChart(document.getElementById('salesTrendChart'));
        chart.draw(data, options);
    },    
    
    // Utility function to get the time unit based on the selected tab
    getTimeUnit: () => {
        switch (SalesTrend.currentTab) {
            case 'today':
            case 'yesterday':
                return 'hour'; // Hourly data
            case 'lastWeek':
                return 'day'; // Daily data
            case 'lastMonth':
                return 'week'; // Weekly data
            default:
                return 'hour'; // Default to hour
        }
    },

    // Utility function to get the label for the x-axis based on the selected tab
    getAxisLabel: () => {
        switch (SalesTrend.currentTab) {
            case 'today':
            case 'yesterday':
                return 'Hour';
            case 'lastWeek':
                return 'Day';
            case 'lastMonth':
                return 'Week';
            default:
                return 'Time';
        }
    }
};

// Product Sales
const ProductSales = {
    init: () => {
        const productSalesChart = document.querySelector('#productSalesChart');
        if ( productSalesChart ) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(ProductSales.fetchData);
        }
    },
    fetchData: async () => {
        const sales = await fetchData(API_PATHS.dashboardSalesToday);
        if (!sales || Object.keys(sales).length === 0) {
            console.error("No sales data available");
            return;
        }

        // Update the chart with new data
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => ProductSales.drawChart(sales.sales_by_hour));
    },
    drawChart: async (sales) => {
        const { backgroundColor } = await ChartBackgroundColor();
        const data = new google.visualization.DataTable();
    
        // Add columns for the product name and total sales amount
        data.addColumn('string', 'Product');
        data.addColumn('number', 'Total Sales');
        data.addColumn({ type: 'string', role: 'style' });

        // Get unique products from the sales data
        const products = [...new Set(sales.map(item => item.gradeid__name))];

        // Calculate total sales and add rows with color for each product
        products.forEach(product => {
            const totalSales = sales
                .filter(item => item.gradeid__name === product)
                .reduce((sum, item) => sum + parseFloat(item.total_money), 0);

            const color = SharedColors[product.toLowerCase()] || '#ccc';
            data.addRow([product, totalSales, `color: ${color}`]); // Adding color to each row
        });
        // Set up chart options
        const options = {
            backgroundColor: backgroundColor,
            legend: { position: 'none' },
            bar: { groupWidth: '60%' },
            chartArea: {
                width: '80%',
                height: '80%',
            },
            hAxis: {
                title: '',
            },
            vAxis: {
                title: '',
            }
        };
    
        // Create and draw the bar chart
        const chart = new google.visualization.ColumnChart(document.getElementById('productSalesChart'));
        chart.draw(data, options);
    }    
}

// System Alarms
const SystemAlarms = {
    init: () => {
        const systemAlarmsChart = document.getElementById('systemAlarmsChart');
        if ( systemAlarmsChart ) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(SystemAlarms.fetchData);
        }
    },
    fetchData: async () => {
        const alarms = await fetchData(API_PATHS.systemAlarms);
        if (!alarms || Object.keys(alarms).length === 0) {
            console.error("No alarms data available");
            return;
        }

        // Update the chart with new data
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => SystemAlarms.drawChart(alarms));
    },

    drawChart: async (alarms) => {
        const { backgroundColor } = await ChartBackgroundColor();
        const data = new google.visualization.DataTable();
    
        // Define columns: 'Alarm Type' for the name, 'Count' for the value, and 'Style' for the color
        data.addColumn('string', 'Alarm Type');
        data.addColumn('number', 'Count');
        data.addColumn({ type: 'string', role: 'style' });
    
        // Function to format alarm names dynamically
        const formatAlarmName = (name) => {
            return name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        };
    
        // Populate rows dynamically based on fetched alarm data
        alarms.forEach(alarm => {
            const [name, count] = alarm; // Use first number in each array as the count
            const formattedName = formatAlarmName(name.toLowerCase());
            data.addRow([formattedName, count, '#6B6ED2']);
        });
    
        // Chart options for the waterfall chart
        const options = {
            backgroundColor: backgroundColor,
            legend: { position: 'none' }, // No legend needed
            bar: { groupWidth: '52%' },
            chartArea: {
                width: '80%',
                height: '80%',
            },
            hAxis: {
                title: '',
            },
            vAxis: {
                title: '',
            }
        };
    
        // Create and draw the waterfall chart
        const chart = new google.visualization.ColumnChart(document.getElementById('systemAlarmsChart'));
        chart.draw(data, options);
    }    
};

// Operational Alarms
const OperationalAlarms = {
    init: () => {
        const operationalAlarmsChart = document.getElementById('operationalAlarmsDonutChart');
        if (operationalAlarmsChart) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(OperationalAlarms.fetchData);
        }
    },

    fetchData: async () => {
        const alarms = await fetchData(API_PATHS.operationalAlarms);
        if (!alarms || alarms.length === 0) {
            console.error("No operational alarms data available");
            return;
        }

        // Load Google Charts and draw chart with fetched data
        google.charts.setOnLoadCallback(() => OperationalAlarms.drawChart(alarms));
    },

    drawChart: async (alarms) => {
        const { backgroundColor } = await ChartBackgroundColor();
        const data = new google.visualization.DataTable();

        // Define the columns
        data.addColumn('string', 'Alarm Type');
        data.addColumn('number', 'Count');

        // Map alarm data to chart data with formatted names
        alarms.forEach(alarm => {
            const alarmName = alarm[0]
                .toLowerCase()
                .replace(/_/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
            const alarmCount = alarm[1];
            data.addRow([alarmName, alarmCount]);
        });

        // Define the colors, alternating between #000 and #eeee
        const colors = alarms.map((_, index) => (index % 2 === 0 ? '#2D99FC' : '#83D0FF'));

        // Set up chart options
        const options = {
            backgroundColor: backgroundColor,
            pieSliceBorderColor: backgroundColor,
            colors: colors,
            pieHole: 0.5, 
            slices: {
                0: { offset: 0.1 },
            },
            legend: { position: 'none' },
            chartArea: { width: '80%', height: '80%' },
        };

        // Create and draw the pie chart
        const operationalAlarmsDonutChart = document.getElementById('operationalAlarmsDonutChart')
        const chart = new google.visualization.PieChart(operationalAlarmsDonutChart);
        chart.draw(data, options);

        OperationalAlarms.createLegend(operationalAlarmsDonutChart, data, colors);
    },

    createLegend: (wrapper, data, colors) => {
        const legendContainer = wrapper.parentNode.querySelector('.chart-legend');
        legendContainer.innerHTML = ''; // Clear any existing legend items

        // Loop through chart data to dynamically create legend items
        for (let i = 0; i < data.getNumberOfRows(); i++) {
            const label = data.getValue(i, 0);
            const legendItem = document.createElement('div');
            legendItem.classList.add('legend-item');
            legendItem.innerHTML = `
                <span class="legend-color" style="background-color: ${colors[i]};"></span>
                <span class="legend-label">${label}</span>
            `;
            legendContainer.appendChild(legendItem);
        }
    }
};

const TanksPercentage = 90;
const TanksVolume = {
    init: () => {
        const tankVolumeChart = document.querySelector('#tankVolumeChart');
        const tankPercentageChart = document.querySelector('#tankPercentageChart');
        if ( tankVolumeChart && tankPercentageChart) {
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(TanksVolume.fetchData);
        }
    },

    fetchData: async () => {
        const sitesData = await fetchData(API_PATHS.dashboardSites);
        if (!sitesData || !sitesData.sitesnumbers || sitesData.sitesnumbers.length === 0) {
            console.error("No sites data available");
            return;
        }

        const sites = sitesData.sitesnumbers;
        TanksVolume.siteDropDown(sites);
        google.charts.setOnLoadCallback(() => TanksVolume.drawColumnChart(sites));
        google.charts.setOnLoadCallback(() => TanksVolume.drawPieChart(sites));
    },

    siteDropDown: (sites) => {
        const sitesList = document.querySelector('#tanks-sites-list ul');
        const siteFilterInput = document.querySelector('#tanks-sites-list .site-filter input');
        const siteName = document.querySelector('.site-name');
        const tanksAmount = document.querySelector('#tanksAmount');


        // Populate the dropdown with site items
        sites.forEach((site, index) => {
            const listItem = document.createElement('li');

            const siteNumberSpan = document.createElement('span');
            siteNumberSpan.classList.add('site-number');
            siteNumberSpan.textContent = `#${site.sitenumber}`;
            
            const tanksLengthSpan = document.createElement('span');
            tanksLengthSpan.classList.add('tanks-length');
            tanksLengthSpan.textContent = `${site.tanks} Tanks`;
            
            listItem.appendChild(siteNumberSpan);
            listItem.appendChild(tanksLengthSpan);
            
            listItem.dataset.sitenumber = site.sitenumber;
            listItem.dataset.tanks = site.tanks;
            listItem.classList.add('site-item');
            
            // Add click event to update selected site
            listItem.addEventListener('click', () => {
                document.querySelectorAll('.site-item').forEach(item => item.classList.remove('active'));
                listItem.classList.add('active');
                siteName.textContent = `${site.sitenumber}`;
                tanksAmount.textContent = site.tanks;
            });
            

            // Select the first item by default
            if (index === 0) {
                listItem.classList.add('active');
                siteName.textContent = `${site.sitenumber}`;
                tanksAmount.textContent = site.tanks;
            }

            sitesList.appendChild(listItem);
        });

        // Filter sites by sitenumber
        siteFilterInput.addEventListener('input', () => {
            const filterValue = siteFilterInput.value.toLowerCase();
            document.querySelectorAll('.site-item').forEach(item => {
                const sitenumber = item.dataset.sitenumber.toString();
                if (sitenumber.includes(filterValue)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    },

    drawColumnChart: async (sites) => {},
    drawPieChart: async (sites) => {}
}

// Run All Charts
const RunCharts = {
    init: () => {
        ProductsUsage.init();
        SiteStatus.init();
        SalesTrend.init();
        ProductSales.init();
        SystemAlarms.init();
        OperationalAlarms.init();
        TanksVolume.init();
        // SiteStatusChart.init();
        // SystemAlarmsChart.init();
        // OperationalAlarmsBarChart.init();
        // TankVolumeBarChart.init();
        ReloadCharts.init();
    }
}

// We will Reload Charts on Menu Collapsed And Apperacnce Toggle
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
        if (document.querySelector('.chart-area')) {
            // Step 2: Kill current charts by clearing their containers
            const chartContainers = document.querySelectorAll('.chart-area');
            const chartLegend = document.querySelectorAll('.chart-legend');

            if ( chartContainers ) {
                chartContainers.forEach(container => {
                    container.innerHTML = ''; // Clear the chart container
                });
            }
            if ( chartLegend ) {
                chartLegend.forEach(container => {
                    container.innerHTML = ''; // Clear the chart container
                });
            }

            // Optional: If your charts have specific cleanup logic, call that here
            // Example: ProductsUsage.clear(); or similar if implemented

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

pageReady(() => {
    DownloadChart.init();
    Products.init();
    RunCharts.init();
});