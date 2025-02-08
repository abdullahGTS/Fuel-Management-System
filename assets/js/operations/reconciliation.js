//alarms.js
import { pageReady, Button, Drawer, Tab, DataTable, Select, DatePicker, DatatableFilter } from '../script.js';
import { API_PATHS, fetchData, SharedColors, ChartBackgroundColor } from '../constant.js';
import { AppearanceToggle } from '../portal.js';


const FetchData = {
    init: async() => {
        const response = await fetchData(API_PATHS.reconcilationData);
        if (!response || Object.keys(response).length === 0) {
            console.error("No response data available");
            return;
        }
        return response;
    }
}

const ReconcilationDT = {
    // Initialize the Site DataTable
    init: async (filteredData) => {

        const reconcilationDT = document.querySelector("#reconcilationDT");
        if (reconcilationDT) {
            let data;
            if (!filteredData) {
                data = await ReconcilationDT.fetchData();
            } else {
                if (filteredData.length) {
                    reconcilationDT.innerHTML = '';
                    data = filteredData;
                } else {
                    reconcilationDT.innerHTML = '';
                    ReconcilationDT.emptyState(reconcilationDT);
                }
            }

            if (data && data.length > 0) {
                const formattedData = ReconcilationDT.transformData(data);
                DataTable.init(".gts-dt-wrapper", {
                    data: formattedData,
                    columns: [
                        { title: `<span class="mat-icon material-symbols-sharp">numbers</span>`, data: "id" },
                        { title: `<span class="mat-icon material-symbols-sharp">verified</span> Site Name`, data: "name" },
                        { title: `<span class="mat-icon material-symbols-sharp">oil_barrel</span> Tank`, data: "fusiontankid" },
                        { title: `<span class="mat-icon material-symbols-sharp">valve</span> Capacity`, data: "capacity" },
                        { title: `<span class="mat-icon material-symbols-sharp">donut_small</span> Product Vol.`, data: "prodvol" },
                        { title: `<span class="mat-icon material-symbols-sharp">legend_toggle</span> Amount`, data: "amount" },
                        { title: `<span class="mat-icon material-symbols-sharp">calendar_month</span> Es. Date`, data: "estimatedtime" },
                        { title: `<span class="mat-icon material-symbols-sharp">schedule</span> Timestamp`, data: "timestamp" },
                        {
                            title: `<span class="mat-icon material-symbols-sharp">network_check</span> Status`, data: "status",
                            render: (data, type, row) => {
                                const statusClass = data === "Opened" ? "opened" : "Closed";
                                return `<div class="status-dt"><span class="${statusClass}">${data}</span></div>`;
                            }
                        },
                    ],
                    responsive: true,
                    paging: formattedData.length > 10,
                    pageLength: 10,
                    fixedHeader: {
                        header: false,
                        footer: false
                    },
                }, 
                [
                    { width: "0px", targets: 0},
                ], "Delivery Reconciliation Data");
            } else {
                console.error("No data available");
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
            const data = await DataTable.fetchData(response.tanks_recon_data);
            return data;
        } catch (error) {
            console.error("Error fetching SitesReports data:", error);
            return [];
        }
    },

    // Transform the raw API data for the DataTable
    transformData: (data) => {
        return data.map((site, index) => ({
            id: index++,
            name: site.name,
            fusiontankid: site.fusiontankid,
            capacity: site.capacity,
            prodvol: site.prodvol,
            amount: site.amount,
            estimatedtime: site.estimatedtime,
            timestamp: site.timestamp,
            status: site.status === "opened" ? "Opened" : "Closed",

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

const ReconcilationTankFilter = {
    init: async() => {
        const filterWrap = document.querySelector('#filterWrap');
        const tankVol = document.querySelector('#tankVol');

        if ( filterWrap && tankVol ) {
            tankVol.innerHTML = '';
            ReconcilationTankFilter.generateTankEmptyState(tankVol);

            const { tanks, sites } = await ReconcilationTankFilter.fetchData();
            ReconcilationTankFilter.generateFilter(filterWrap, sites, tanks);
        }
    },
    fetchData: async() => {
        const data = await FetchData.init();
        return { tanks: data.tanks_data, sites: data.tanks_recon_data };
    },

    generateFilter: (wrap, sites, tanks) => {
        const form = document.createElement('form');
        form.classList.add('datatable-filter-form', 'no-margin-form');
    
        const datatableFilterItems = document.createElement('div');
        datatableFilterItems.classList.add('datatable-filter-items');
        datatableFilterItems.id = 'rec-filter';
    
        // Function to create a filter item (label + field)
        const createFilterItem = (labelText, fieldId, fieldElement) => {
            const filterItem = document.createElement('div');
            filterItem.classList.add('filter-item');
    
            const itemLabel = document.createElement('label');
            itemLabel.setAttribute('for', fieldId);
            itemLabel.textContent = labelText;
    
            const formItem = document.createElement('div');
            formItem.classList.add('form-item');
    
            fieldElement.id = fieldId;
            formItem.appendChild(fieldElement);
    
            filterItem.appendChild(itemLabel);
            filterItem.appendChild(formItem);
    
            return filterItem;
        };
    
        // Create Site Dropdown
        const siteSelect = document.createElement('select');
        siteSelect.classList.add('custom-select', 'js-example-basic-single');
        siteSelect.innerHTML = `<option value="">Select Site</option>`;
        [...new Set(sites.map(site => site.name))].forEach(site => {
            const option = document.createElement('option');
            option.value = site;
            option.textContent = site;
            siteSelect.appendChild(option);
        });
    
        // Create Tank Dropdown (Initially Disabled)
        const tankSelect = document.createElement('select');
        tankSelect.classList.add('custom-select', 'js-example-basic-single');
        tankSelect.innerHTML = `<option value="">Select Tank</option>`;
        tankSelect.disabled = true;
    
        // Create Input for Amount (Initially Disabled)
        const amountInput = document.createElement('input');
        amountInput.type = 'text';
        amountInput.placeholder = 'Enter Amount';
        amountInput.name = 'amount';
        amountInput.disabled = true;
    
        // Create Fill Button
        const fillButton = document.createElement('button');
        fillButton.type = 'button'; // Prevent form submission on click
        fillButton.textContent = 'Fill';
        fillButton.disabled = true;
        fillButton.classList.add('fill-button', 'btn');
    
        // Create a container div for Amount Input and Fill Button
        const amountContainer = document.createElement('div');
        amountContainer.classList.add('amount-container');
        amountContainer.appendChild(amountInput);
        amountContainer.appendChild(fillButton);
    
        // Create Date Picker (Initially Disabled)
        const dateInput = document.createElement('input');
        dateInput.type = 'text';
        dateInput.placeholder = 'Pick a delivery date';
        dateInput.name = 'filterDate';
        dateInput.classList.add('data-picker-wrapper');
        dateInput.disabled = true;
    
        // Append filter items
        datatableFilterItems.appendChild(createFilterItem('Select Site', 'siteSelect', siteSelect));
        datatableFilterItems.appendChild(createFilterItem('Select Tank', 'tankSelect', tankSelect));
        datatableFilterItems.appendChild(createFilterItem('Enter Amount', 'amountInput', amountContainer));
        datatableFilterItems.appendChild(createFilterItem('Select Date', 'filterDateFrom-1', dateInput));
    
        // Create Submit Button
        const btnWrapper = document.createElement('div');
        btnWrapper.classList.add('btn-wrapper');

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Submit';
        submitButton.classList.add('submit-button', 'btn');
        btnWrapper.appendChild(submitButton);
        // Append main filter container to form
        form.appendChild(datatableFilterItems);
        form.appendChild(btnWrapper);
    
        // Append form to wrap
        wrap.appendChild(form);
    
        // Event Listener: Site Selection
        $(siteSelect).on('change', function (e) {
            const tankVol = document.querySelector('#tankVol');
            tankVol.innerHTML = '';
            ReconcilationTankFilter.generateTankEmptyState(tankVol);

            const selectedSite = e.target.value;
            const filteredTanks = sites.filter(site => site.name === selectedSite);
    
            // Reset Tank Dropdown
            tankSelect.innerHTML = `<option value="">Select Tank</option>`;
            tankSelect.disabled = !filteredTanks.length;
    
            // Populate Tanks based on selected site
            [...new Set(filteredTanks.map(site => site.fusiontankid))].forEach(tankId => {
                const option = document.createElement('option');
                option.value = tankId;
                option.textContent = tankId;
                tankSelect.appendChild(option);
            });
        });
    
        // Event Listener: Tank Selection
        let selectedTank;
        $(tankSelect).on('change', function (e) {
            const tankVol = document.querySelector('#tankVol');
            tankVol.innerHTML = '';
            ReconcilationTankFilter.generateTankEmptyState(tankVol);

            selectedTank = e.target.value;
            const tankDetails = tanks.find(tank => tank.fusiontankid == selectedTank.replace('Tank ', ''));
    
            if (tankDetails) {
                ReconcilationTankFilter.generateTankUI(tankDetails);
                amountInput.disabled = false;
                fillButton.disabled = false;
                dateInput.disabled = false;
            }
        });
    
        // Event Listener: Amount Input
        $(amountInput).on('input', function () {
            const addedAmount = parseFloat(amountInput.value) || 0;
            ReconcilationTankFilter.updateTank(tanks, selectedTank, addedAmount);
        });
    
        // Event Listener for Fill Button
        fillButton.addEventListener('click', function () {
            const tankDetails = tanks.find(tank => tank.fusiontankid == selectedTank.replace('Tank ', ''));
    
            if (tankDetails) {
                amountInput.value = parseFloat(tankDetails.capacity) - parseFloat(tankDetails.prodvol);
                ReconcilationTankFilter.updateTank(tanks, selectedTank, amountInput.value);
            }
        });    
    
        ReconcilationTankFilter.submitForm(form, siteSelect, tankSelect, amountInput, dateInput);

        DatePicker.init();
        Select.init();
    },

    submitForm: (form, siteSelect, tankSelect, amountInput, dateInput) => {
        // Event Listener for Form Submission
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default form submission
    
            const formData = {
                site: siteSelect.value,
                tank: tankSelect.value,
                amount: amountInput.value,
                date: dateInput.value
            };
    
            console.log('Form Data:', formData);
            Snackbar.show({
                text: 'Reconciliation have successfully ordered!', 
                pos: 'bottom-left',
                duration: 2800
            });
        });
    },

    updateTank: (tanks, selectedTank, addedAmount) => {
        const tankVol = document.querySelector('#tankVol');

        // const currentTank = tanks.find(tank => tank.fusiontankid == tankSelect.value);
        const currentTank = tanks.find(tank => tank.fusiontankid == selectedTank.replace('Tank ', ''));
        if (!currentTank) return;
        console.log('addedAmount', addedAmount);
        const newTotal = parseFloat(currentTank.prodvol) + parseFloat(addedAmount);

        if (newTotal > currentTank.capacity) {
            console.error('Error: Exceeding tank capacity!');
            toastr.error('New Vol Exceeding Tank Capacity!', '', {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": true,
                "positionClass": "toast-top-right",
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut",
                "onShown": function() {
                    $('.toast').css({
                        transform: 'translateX(700px)',  // Initially off-screen to the right
                        opacity: 0
                    }).animate({ opacity: 1 }, {
                        duration: 200,
                        step: function(now) {
                            $(this).css('transform', `translateX(${700 - now * 700}px)`);
                        }
                    });
                },
                "onHidden": function() {
                    $('.toast').animate({ opacity: 0 }, {
                        duration: 200,
                        step: function(now) {
                            $(this).css('transform', `translateX(${now * 700}px)`);
                        }
                    });
                }
            });
            return false;
        }

        // Update label dynamically
        const label = tankVol.querySelector('.label');
        label.innerHTML = `${newTotal.toFixed(2)}<span>lts</span>`;


         // Add SVG overlay for liquid representation
         const liquid = tankVol.querySelector('.liquid');
         const svgNamespace = "http://www.w3.org/2000/svg";
         let svg = tankVol.querySelector('.products-svg');
         if (!svg) {
             svg = document.createElementNS(svgNamespace, 'svg');
             svg.classList.add('products-svg');
             svg.setAttribute('viewBox', '0 0 200 100');
             liquid.appendChild(svg);
         }
 
         let path = svg.querySelector('path');
         if (!path) {
             path = document.createElementNS(svgNamespace, 'path');
             svg.appendChild(path);
         }
 
         const productsLevel = (newTotal / currentTank.capacity) * 100;
         svg.style.top = `calc(97.5% - ${productsLevel}%)`;

         const tankVolRect = liquid.getBoundingClientRect();
         const labelRect = label.getBoundingClientRect();
         let labelBottom = productsLevel; // Initial bottom position in %
         
         const labelHeightPercent = (labelRect.height / tankVolRect.height) * 100; // Convert height to %
         
         if (labelBottom > 100 - labelHeightPercent) {
             labelBottom = 100 - labelHeightPercent; // Prevent overflow
         }

         label.style.bottom = `${labelBottom}%`;

         path.setAttribute('fill', '#cccccc');
         path.setAttribute('fill-opacity', '0.2'); // Value between 0 (fully transparent) and 1 (fully opaque)

         path.setAttribute('d', `
            M 0,0 v 100 h 200 v -100 
            c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5
            c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5
            c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5
            c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5
        `);
    },

    generateTankUI: (tankDetails) => {
        const tankVol = document.querySelector('#tankVol');
        tankVol.innerHTML = '';
        const capacityWrap = document.createElement('div');
        capacityWrap.classList.add('capacityWrap');

        const productsTank = document.createElement('div');
        productsTank.classList.add('products-tank');
        const liquid = document.createElement('div');
        liquid.classList.add('liquid');

        // Add SVG for products
        const svgNamespace = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNamespace, 'svg');
        svg.classList.add('products');
        svg.setAttribute('viewBox', '0 0 200 100');

        const path = document.createElementNS(svgNamespace, 'path');
        // path.setAttribute('fill', SharedColors[tank.product]);
        let fillColor;
        if (tankDetails.prodvol < (tankDetails.capacity / 2)) {
            fillColor = SharedColors.Volume.Less;
        } else if (tankDetails.prodvol > (tankDetails.capacity / 2)) {
            fillColor = SharedColors.Volume.More;
        } else {
            fillColor = SharedColors.Volume.Same;
        }
    
        path.setAttribute('fill', fillColor);

        path.setAttribute('d', `
                M 0,0 v 100 h 200 v -100 
                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5
                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5
                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5
                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5
        `);

        svg.appendChild(path);
        liquid.appendChild(svg);

        // Calculate products level
        const productsLevel = (tankDetails.prodvol / tankDetails.capacity) * 100;
        svg.style.top = `calc(97.5% - ${productsLevel}%)`;

        // Add liquid container to the tank
        productsTank.appendChild(liquid);

        // Add indicators
        [25, 50, 75].forEach(value => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            indicator.setAttribute('data-value', value);
            indicator.style.bottom = `${value}%`;
            productsTank.appendChild(indicator);
        });

        // Add label
        const label = document.createElement('div');
        label.classList.add('label');
        // label.style.bottom = `${productsLevel}%`;
        const currentValue = parseFloat(tankDetails.prodvol).toFixed(2);

        label.innerHTML = `${currentValue}<span>lts</span>`;
        productsTank.appendChild(label);
        capacityWrap.innerHTML = `<b>Capacity</b>: ${tankDetails.capacity}`;
        tankVol.appendChild(capacityWrap); // Insert returned HTML
        tankVol.appendChild(productsTank); // Insert returned HTML

        const tankVolRect = liquid.getBoundingClientRect();
        const labelRect = label.getBoundingClientRect();
        let labelBottom = productsLevel; // Initial bottom position in %
        
        const labelHeightPercent = (labelRect.height / tankVolRect.height) * 100; // Convert height to %
        
        if (labelBottom > 100 - labelHeightPercent) {
            labelBottom = 100 - labelHeightPercent; // Prevent overflow
        }
        label.style.bottom = `${labelBottom}%`;
    },

    generateTankEmptyState: (wrapper) => {
        if (!wrapper.querySelector(".emptyState")) {
            const emptyStateDiv = document.createElement("div");
            emptyStateDiv.className = "emptyState";

            // Create the heading (h3)
            const heading = document.createElement("h3");
            heading.textContent = "Select Tank";

            // Create the brief (p)
            const brief = document.createElement("p");
            brief.textContent = "Select Tank To Visualize the Volume";

            // Append heading and brief to the empty state div
            emptyStateDiv.appendChild(heading);
            emptyStateDiv.appendChild(brief);

            // Insert the empty state div after the site list container
            wrapper.appendChild(emptyStateDiv);
        }
    }

}

pageReady(() => {
    ReconcilationDT.init();
    ReconcilationTankFilter.init();
});