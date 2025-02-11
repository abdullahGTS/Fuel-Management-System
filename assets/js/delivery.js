//delivery.js
import { pageReady, Button, Drawer, Tab, DataTable, Select, DatePicker, DatatableFilter } from './script.js';
import { API_PATHS, fetchData, SharedColors, ChartBackgroundColor } from './constant.js';

const FetchData = {
    init: async() => {
        const response = await fetchData(API_PATHS.deliveryData);
        if (!response || Object.keys(response).length === 0) {
            console.error("No response data available");
            return;
        }
        return response;
    }
}

// Usage
const DeliveryFilter = {
    state: {
        response: [],
        filterOptions: {},
        selectedFilters: {},
    },

    init: async () => {
        const dtFilterWrapper = document.querySelector('#dtFilterWrapper');
        if (dtFilterWrapper) {
            const response = await FetchData.init();

            // Update state with alarms
            DeliveryFilter.state.response = response.tanks_list;

            const filterOptions = {
                'Site Numbers': {
                    options: [...new Set(response.tanks_list.map(item => item.sitenumber))],
                    originalKey: 'sitenumber'
                },
                'Tank': {
                    options: [...new Set(response.tanks_list.map(item => item.Tank))],
                    originalKey: 'Tank'
                },
                'Product': {
                    options: [...new Set(response.tanks_list.map(item => item.product))],
                    originalKey: 'product'
                },
                'Capacity': {
                    options: [...new Set(response.tanks_list.map(item => item.capacity))],
                    originalKey: 'capacity'
                },
                'Date Start Range': {
                    options: [...new Set(response.tanks_list.map(item => item.datestart))],
                    originalKey: 'datestart'
                },
                'Date End Range': {
                    options: [...new Set(response.tanks_list.map(item => item.dateend))],
                    originalKey: 'dateend'
                }
            };

            // Update state with filter options
            DeliveryFilter.state.filterOptions = filterOptions;
            const dateKeys = ['datestart', 'dateend'];

            // Initialize filters with the fetched alarm data
            const selectedFilters = await DatatableFilter.init(dtFilterWrapper, response.tanks_list, filterOptions, DeliveryFilter, DeliveryDT, dateKeys);

            // Update state with selected filters
            DeliveryFilter.state.selectedFilters = selectedFilters;

            if (selectedFilters) {
                DeliveryFilter.filterSubmit(selectedFilters);  // Apply filters on load
            }
        }
    },

    filterSubmit: async (filters) => {
        const { response } = DeliveryFilter.state;
        const filteredDelivery = await DeliveryFilter.applyFilters(filters, response);

        // Update DataTable with filtered responses
        DeliveryDT.init(filteredDelivery);
    },

    applyFilters: (filters, response, ) => {
        let filteredDelivery = response; // Start with the full responses list

        Object.entries(filters).forEach(([key, values]) => {
            if (['datestart', 'dateend'].includes(key) && values.from && values.to) {
                // Filter by date range
                const from = new Date(values.from);
                const to = new Date(values.to);
                filteredDelivery = filteredDelivery.filter(res => {
                    const responseDate = new Date(res[key]);
                    return responseDate >= from && responseDate <= to;
                });
            } else {
                // Other filters (multi-select)
                filteredDelivery = filteredDelivery.filter(res => {
                    return values.some(value => String(res[key]) === String(value));
                });
            }
        });

        return filteredDelivery; // Return filtered response
    },
};

const DeliveryDT = {
    // Initialize the Site DataTable
    init: async (filteredDelivery) => {

        const deliveryDT = document.querySelector("#deliveryDT");
        if (deliveryDT) {
            let delivery;
            if (!filteredDelivery) {
                delivery = await DeliveryDT.fetchData();
            } else {
                if (filteredDelivery.length) {
                    deliveryDT.innerHTML = '';
                    delivery = filteredDelivery;
                } else {
                    deliveryDT.innerHTML = '';
                    DeliveryDT.emptyState(deliveryDT);
                }
            }

            if (delivery && delivery.length > 0) {
                const formattedData = DeliveryDT.transformData(delivery);
                DataTable.init(".gts-dt-wrapper", {
                    data: formattedData,
                    columns: [
                        { title: `<span class="mat-icon material-symbols-sharp">numbers</span>`, data: "id" },
                        { title: `<span class="mat-icon material-symbols-sharp">location_on</span> Site Number`, data: "sitenumber" },
                        { title: `<span class="mat-icon material-symbols-sharp">verified</span> Site Name`, data: "sitename" },
                        { title: `<span class="mat-icon material-symbols-sharp">oil_barrel</span> Tank`, data: "Tank" },
                        { title: `<span class="mat-icon material-symbols-sharp">local_gas_station</span> Product`, data: "product" },
                        { title: `<span class="mat-icon material-symbols-sharp">valve</span> Capacity`, data: "capacity" },
                        { title: `<span class="mat-icon material-symbols-sharp">schedule</span> Start Date`, data: "datestart" },
                        { title: `<span class="mat-icon material-symbols-sharp">gas_meter</span> Start Vol`, data: "volstart" },
                        { title: `<span class="mat-icon material-symbols-sharp">schedule</span> End Date`, data: "dateend" },
                        { title: `<span class="mat-icon material-symbols-sharp">gas_meter</span> End Vol`, data: "volend" },
                        { title: `<span class="mat-icon material-symbols-sharp">gas_meter</span> Total Vol`, data: "voltotal" }
                    ],
                    responsive: true,
                    paging: formattedData.length > 10,
                    pageLength: 10,
                }, [
                    { width: "0px", targets: 0 },  // Hide the first column (id)
                    // { width: "280px", targets: 1 },
                    // { width: "280px", targets: 3 },
                ], "Delivery data table");
            } else {
                console.error("No delivery data available");
            }
        }
    },

    // Fetch data from the API
    fetchData: async () => {
        try {
            const response = await FetchData.init();
            const delivery = await DataTable.fetchData(response.tanks_list);
            return delivery;
        } catch (error) {
            console.error("Error fetching DeliveryDT data:", error);
            return [];
        }
    },

    // Transform the raw API data for the DataTable
    transformData: (data) => {
        return data.map((delivery) => ({
            id: delivery.id,
            datestart: delivery.datestart,
            volstart: delivery.volstart,
            dateend: delivery.dateend,
            volend: delivery.volend,
            voltotal: delivery.voltotal,
            sitename: delivery.sitename,
            sitenumber: delivery.sitenumber,
            Tank: delivery.Tank,
            product: delivery.product,
            capacity: delivery.capacity
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

const DeliveryOverview = {
    init: async () => {
        const totalDelivery = document.querySelector('#totalDelivery');
        const response = await FetchData.init();
        const totalDeliveryObj = {
            total_delivery: response.total_delivery,
            start: response.start,
            end: response.end
        }
        if ( totalDelivery ) {
            DeliveryOverview.totalDelivery(totalDeliveryObj, totalDelivery);
        }
        const productsDelivery = document.querySelector('#productsDelivery');
        if ( productsDelivery ) {
            DeliveryOverview.totalProducts(response.tanks_list, productsDelivery);
        }
    },
    totalDelivery: (totalDeliveryObj, totalDelivery) => {
        totalDelivery.querySelector('h2').innerHTML = totalDeliveryObj.total_delivery;
        const deliveryDateRange = document.querySelector('#deliveryDateRange');
    
        if (deliveryDateRange) {
            // Create container for date range
            const dateRangeContainer = document.createElement('div');
            dateRangeContainer.classList.add('date-range-container');
    
            // Create "Start Date" element
            const startDateElement = document.createElement('div');
            startDateElement.classList.add('date-item');
            startDateElement.innerHTML = `
                <span class="mat-icon material-symbols-sharp">date_range</span>
                <span class="date-label">Start at: </span>
                <span class="date-value">${totalDeliveryObj.start}</span>
            `;
    
            // Create "End Date" element
            const endDateElement = document.createElement('div');
            endDateElement.classList.add('date-item');
            endDateElement.innerHTML = `
                <span class="mat-icon material-symbols-sharp">date_range</span>
                <span class="date-label">End at: </span>
                <span class="date-value">${totalDeliveryObj.end}</span>
            `;
    
            // Append start and end dates to the container
            dateRangeContainer.appendChild(startDateElement);
            dateRangeContainer.appendChild(endDateElement);
    
            // Append the container to the deliveryDateRange element
            deliveryDateRange.appendChild(dateRangeContainer);
        }
    },
    totalProducts: (response, productsDelivery) => {
        // Create a map to sum up voltotal by product
        const productTotals = response.reduce((totals, item) => {
            const productKey = item.product.toLowerCase();
            if (!totals[productKey]) {
                totals[productKey] = {
                    total: 0,
                    label: item.product
                };
            }
            totals[productKey].total += parseFloat(item.voltotal);
            return totals;
        }, {});
    
        // Clear existing content inside productsDelivery
        productsDelivery.innerHTML = "";
    
        // Loop through the productTotals and create elements
        for (const [keyName, productData] of Object.entries(productTotals)) {
            const { total, label: labeledKeyName } = productData;
    
            // Create the main grid item container
            const gridItem = document.createElement("div");
            gridItem.classList.add("gts-grid-item");
    
            // Create the product content wrapper
            const productContent = document.createElement("div");
            productContent.classList.add("gts-product", "gts-item-content", keyName);
    
            // Create the value container
            const valueContainer = document.createElement("div");
            valueContainer.classList.add("gts-value");
    
            // Add the icon wrapper
            const iconWrapper = document.createElement("div");
            iconWrapper.classList.add("icon-wrapper");
            iconWrapper.innerHTML = `
                <span class="mat-icon material-symbols-sharp">local_gas_station</span>
            `;
    
            // Add the value and label
            const valueHTML = `
                <h3><span id="${keyName}-value">${total.toFixed(2)}</span> lts</h3>
                <p>${labeledKeyName}</p>
            `;
    
            // Append elements together
            valueContainer.appendChild(iconWrapper);
            valueContainer.innerHTML += valueHTML;
            productContent.appendChild(valueContainer);
            gridItem.appendChild(productContent);
    
            // Append to the productsDelivery container
            productsDelivery.appendChild(gridItem);
        }
    }    
}

pageReady(() => {
    DeliveryDT.init();
    DeliveryFilter.init();
    DeliveryOverview.init();
});