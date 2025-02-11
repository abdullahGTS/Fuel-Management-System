//alarms.js
import { pageReady, Button, Drawer, Tab, DataTable, Select, DatePicker, DatatableFilter } from '../script.js';
import { API_PATHS, fetchData, SharedColors, ChartBackgroundColor } from '../constant.js';
import { AppearanceToggle } from '../portal.js';


const FetchData = {
    init: async() => {
        const response = await fetchData(API_PATHS.tankSuddenLoss);
        if (!response || Object.keys(response).length === 0) {
            console.error("No response data available");
            return;
        }
        return response;
    }
}

const TanksOperationDT = {
    // Initialize the Site DataTable
    init: async (filteredData) => {

        const tanksOperationDT = document.querySelector("#tanksOperationDT");
        if (tanksOperationDT) {
            let tanks;
            if (!filteredData) {
                tanks = await TanksOperationDT.fetchData();
            } else {
                if (filteredData.length) {
                    tanksOperationDT.innerHTML = '';
                    tanks = filteredData;
                } else {
                    tanksOperationDT.innerHTML = '';
                    TanksOperationDT.emptyState(tanksOperationDT);
                }
            }

            if (tanks && tanks.length > 0) {
                const formattedData = TanksOperationDT.transformData(tanks);
                DataTable.init(".gts-dt-wrapper", {
                    data: formattedData,
                    columns: [
                        { title: `<span class="mat-icon material-symbols-sharp">numbers</span>`, data: "id" },
                        { title: `<span class="mat-icon material-symbols-sharp">local_gas_station</span> Tank`, data: "tank" },
                        { title: `<span class="mat-icon material-symbols-sharp">verified</span> Site Name`, data: "site" },
                        { title: `<span class="mat-icon material-symbols-sharp">waterfall_chart</span> Rate`, data: "rate" },
                        { title: `<span class="mat-icon material-symbols-sharp">schedule</span> Timestamp`, data: "timestamp" }

                    ],
                    responsive: true,
                    paging: formattedData.length > 10,
                    pageLength: 10,
                }, [
                    // { width: "0px", targets: 0 },  // Hide the first column (id)
                    // { width: "480px", targets: 6 },
                    // { width: "100px", targets: 7 },
                ], "Tanks sudden loss data");
            } else {
                console.error("No data available");
            }
        }
    },

    // Fetch data from the API
    fetchData: async () => {
        try {
            const response = await FetchData.init();
            const tanks = await DataTable.fetchData(response.tanks_table);
            console.log('tanks', tanks);
            return tanks;
        } catch (error) {
            console.error("Error fetching TanksOperationDT data:", error);
            return [];
        }
    },

    // Transform the raw API data for the DataTable
    transformData: (data) => {
        return data.map((tanks) => ({
            id: tanks.id,
            site: tanks.site,
            tank: tanks.tank,
            rate: tanks.rate,
            timestamp: tanks.timestamp
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
        return { tanks: data.tanks_select, sites: data.tanks_table };
    },

    generateFilter: (wrap, sites, tanks) => {
        const form = document.createElement('form');
        form.classList.add('datatable-filter-form', 'no-margin-form');
    
        const datatableFilterItems = document.createElement('div');
        datatableFilterItems.classList.add('datatable-filter-items');
        datatableFilterItems.id = 'rec-filter';
    
        // Function to create a filter item (label + field)
        const createFilterItem = (labelText, fieldId, fieldElement, className) => {
            const filterItem = document.createElement('div');
            filterItem.classList.add('filter-item');
                    
            const itemLabel = document.createElement('label');
            itemLabel.setAttribute('for', fieldId);
            itemLabel.textContent = labelText;
    
            const formItem = document.createElement('div');
            formItem.classList.add('form-item');
    
            fieldElement.id = fieldId;
            formItem.appendChild(fieldElement);
    
            const rateLabel = document.createElement('span');
            rateLabel.classList.add('rate-label');
            rateLabel.innerHTML = 'lts/hour';

            if ( className === 'sub-label' ) {
                formItem.classList.add(className);
                formItem.appendChild(rateLabel);
            }

            filterItem.appendChild(itemLabel);
            filterItem.appendChild(formItem);
    
            return filterItem;
        };
    
        // Create Site Dropdown
        const siteSelect = document.createElement('select');
        siteSelect.classList.add('custom-select', 'js-example-basic-single');
        siteSelect.innerHTML = `<option value="">Select Site</option>`;
        [...new Set(sites.map(site => site.site))].forEach(site => {
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
    
        // Create Current Rate (Initially Disabled)
        const currentRate = document.createElement('input');
        currentRate.type = 'text';
        currentRate.placeholder = 'Enter Amount';
        currentRate.name = 'amount';
        currentRate.disabled = true;
        currentRate.readOnly = true;
        // <span class="rate-label">lts/hour</span>

    
        // Create New Rate (Initially Disabled)
        const updateRate = document.createElement('input');
        updateRate.type = 'text';
        updateRate.placeholder = 'New rate';
        updateRate.name = 'newRate';
        updateRate.disabled = true;
        // <span class="rate-label">lts/hour</span>


        // Append filter items
        datatableFilterItems.appendChild(createFilterItem('Select Site', 'siteSelect', siteSelect, 'no-label'));
        datatableFilterItems.appendChild(createFilterItem('Select Tank', 'tankSelect', tankSelect, 'no-label'));
        datatableFilterItems.appendChild(createFilterItem('Current Rate', 'currentRate', currentRate, 'sub-label'));
        datatableFilterItems.appendChild(createFilterItem('New Rate', 'newRate', updateRate, 'sub-label'));
    
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
            const filteredTanks = sites.filter(site => site.site === selectedSite);
    
            // Reset Tank Dropdown
            tankSelect.innerHTML = `<option value="">Select Tank</option>`;
            tankSelect.disabled = !filteredTanks.length;
    
            // Populate Tanks based on selected site
            [...new Set(filteredTanks.map(site => site.tank))].forEach(tankId => {
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
                // currentRate.disabled = false;
                currentRate.value = tankDetails.rate;
                updateRate.disabled = false;
            }
        });

        ReconcilationTankFilter.submitForm(form, siteSelect, tankSelect, currentRate, updateRate);
        Select.init();
    },

    submitForm: (form, siteSelect, tankSelect, currentRate, updateRate) => {
        // Event Listener for Form Submission
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent default form submission
            const tankVol = document.querySelector('#tankVol');

            const formData = {
                site: siteSelect.value,
                tank: tankSelect.value,
                old_rate: currentRate.value,
                new_rate: updateRate.value
            };
    
            Snackbar.show({
                text: 'Reconciliation have successfully ordered!', 
                pos: 'bottom-left',
                duration: 2800
            });

            setTimeout(() => {
                console.log('Form Data:', formData);
                tankVol.innerHTML = '';
                ReconcilationTankFilter.generateTankEmptyState(tankVol);
                $(siteSelect).val('').trigger('change');
                $(tankSelect).val('').trigger('change');
                form.reset();
            }, 0);

        });
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
            brief.textContent = "Select a tank to be able to visualize the volume";

            // Append heading and brief to the empty state div
            emptyStateDiv.appendChild(heading);
            emptyStateDiv.appendChild(brief);

            // Insert the empty state div after the site list container
            wrapper.appendChild(emptyStateDiv);
        }
    }

}

pageReady(() => {
    TanksOperationDT.init();
    ReconcilationTankFilter.init();
});