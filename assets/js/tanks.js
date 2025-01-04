//tanks.js
import { pageReady, Button, Drawer, Tab, DataTable, Select, DatePicker, DatatableFilter } from './script.js';
import { API_PATHS, fetchData, SharedColors, ChartBackgroundColor } from './constant.js';
import { AppearanceToggle } from './portal.js';

const FetchData = {
    init: async() => {
        const response = await fetchData(API_PATHS.tanksData);
        if (!response || Object.keys(response).length === 0) {
            console.error("No response data available");
            return;
        }
        return response;
    }
}

// Usage
const TanksFilter = {
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
            TanksFilter.state.response = response;

            const filterOptions = {
                'Site Numbers': {
                    options: [...new Set(response.map(item => item.sitenumber))],
                    originalKey: 'sitenumber'
                },
                'Tank': {
                    options: [...new Set(response.map(item => item.Tank))],
                    originalKey: 'Tank'
                },
                'Product': {
                    options: [...new Set(response.map(item => item.product))],
                    originalKey: 'product'
                },
                'Capacity': {
                    options: [...new Set(response.map(item => item.capacity))],
                    originalKey: 'capacity'
                },
                'Product Volume': {
                    options: [...new Set(response.map(item => item.productvolume))],
                    originalKey: 'productvolume'
                },
                'Water Volume': {
                    options: [...new Set(response.map(item => item.watervolume))],
                    originalKey: 'watervolume'
                },
                'Time Range': {
                    options: [...new Set(response.map(item => item.timestamp))],
                    originalKey: 'timestamp'
                }
            };

            // Update state with filter options
            TanksFilter.state.filterOptions = filterOptions;
            const dateKeys = ['timestamp'];

            // Initialize filters with the fetched alarm data
            const selectedFilters = await DatatableFilter.init(dtFilterWrapper, response, filterOptions, TanksFilter, TanksDT, dateKeys);

            
            // Update state with selected filters
            TanksFilter.state.selectedFilters = selectedFilters;

            if (selectedFilters) {
                TanksFilter.filterSubmit(selectedFilters);  // Apply filters on load
            }
        }
    },

    filterSubmit: async (filters) => {
        const { response } = TanksFilter.state;
        const filteredTanks = await TanksFilter.applyFilters(filters, response);

        // Update DataTable with filtered responses
        TanksDT.init(filteredTanks);
    },

    applyFilters: (filters, response) => {
        let filteredTanks = response; // Start with the full responses list

        Object.entries(filters).forEach(([key, values]) => {
            if (key === 'datestart' && values.from && values.to) {
                // Filter by date range
                const from = new Date(values.from);
                const to = new Date(values.to);
                filteredTanks = filteredTanks.filter(res => {
                    const responsesDate = new Date(res[key]);
                    return responsesDate >= from && alarmDate <= to;
                });
            }  else {
                // Other filters (multi-select)
                filteredTanks = filteredTanks.filter(res => {
                    return values.some(value => String(res[key]) === String(value));
                });
            }
        });


    //     else if (key === 'dateend' && values.from && values.to) {
    //         // Filter by date range
    //         const from = new Date(values.from);
    //         const to = new Date(values.to);
    //         filteredTanks = filteredTanks.filter(res => {
    //             const responsesDate = new Date(res[key]);
    //             return responsesDate >= from && alarmDate <= to;
    //         });
        
    // }

        return filteredTanks; // Return filtered response
    },
};

const TanksDT = {
    // Initialize the Site DataTable
    init: async (filteredTanks) => {

        const tanksDT = document.querySelector("#tanksDT");
        if (tanksDT) {
            let tanks;
            if (!filteredTanks) {
                tanks = await TanksDT.fetchData();
            } else {
                if (filteredTanks.length) {
                    tanksDT.innerHTML = '';
                    tanks = filteredTanks;
                } else {
                    tanksDT.innerHTML = '';
                    TanksDT.emptyState(tanksDT);
                }
            }

            if (tanks && tanks.length > 0) {
                const formattedData = TanksDT.transformData(tanks);
                DataTable.init(".gts-dt-wrapper", {
                    data: formattedData,
                    columns: [
                        { title: `<span class="mat-icon material-symbols-sharp">numbers</span>`, data: "id" },
                        { title: `<span class="mat-icon material-symbols-sharp">location_on</span> Site Number`, data: "sitenumber" },
                        { title: `<span class="mat-icon material-symbols-sharp">verified</span> Site Name`, data: "sitename" },
                        { title: `<span class="mat-icon material-symbols-sharp">oil_barrel</span> Tank`, data: "Tank" },
                        { title: `<span class="mat-icon material-symbols-sharp">local_gas_station</span> Product`, data: "product" },
                        { title: `<span class="mat-icon material-symbols-sharp">valve</span> Capacity`, data: "capacity" },
                        { title: `<span class="mat-icon material-symbols-sharp">schedule</span> Product Volume`, data: "productvolume" },
                        { title: `<span class="mat-icon material-symbols-sharp">gas_meter</span> Water Volume`, data: "watervolume" },
                        { title: `<span class="mat-icon material-symbols-sharp">schedule</span> Time`, data: "timestamp" }
                    ],
                    responsive: true,
                    paging: formattedData.length > 10,
                    pageLength: 10,
                }, [
                    { width: "0px", targets: 0 },  // Hide the first column (id)
                    // { width: "280px", targets: 1 },
                    // { width: "280px", targets: 3 },
                ], "Tanks data table");
            } else {
                console.error("No tanks data available");
            }
        }
    },

    // Fetch data from the API
    fetchData: async () => {
        try {
            const response = await FetchData.init();
            const tanks = await DataTable.fetchData(response);
            return tanks;
        } catch (error) {
            console.error("Error fetching TanksDT data:", error);
            return [];
        }
    },

    // Transform the raw API data for the DataTable
    transformData: (data) => {
        return data.map((tanks) => ({
            id: tanks.id,
            sitename: tanks.sitename,
            sitenumber: tanks.sitenumber,
            Tank: tanks.Tank,
            product: tanks.product,
            capacity: tanks.capacity,
            productvolume: tanks.productvolume,
            watervolume: tanks.watervolume,
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

// const DeepView = {
//     init: async () => {
//         const siteListTanksWrapper = document.querySelector('#siteListTanksWrapper');
//         if ( siteListTanksWrapper ) {
//             const response = await FetchData.init();
//             DeepView.groupSites(response, siteListTanksWrapper);
//         }
//     },

//     groupSites: (response, siteListTanksWrapper) => {
//         const groupedSites = [];
        
//         // Extract unique sites
//         response.forEach((site) => {
//             if (!groupedSites.some(s => s.sitenumber === site.sitenumber)) {
//                 groupedSites.push({
//                     sitenumber: site.sitenumber,
//                     sitename: site.sitename
//                 });
//             }
//         });
    
//         DeepView.createList(response, groupedSites, siteListTanksWrapper);
//     },
    

//     createList: (response, groupedSites, siteListTanksWrapper) => {
//         const siteListContainer = siteListTanksWrapper.querySelector(".sites-list ul");
//         if (!siteListContainer) return;
    
//         siteListContainer.innerHTML = ""; // Clear existing content
    
//         groupedSites.forEach((site) => {
//             const siteItem = document.createElement("li");
//             siteItem.classList.add("site-item");
    
//             siteItem.innerHTML = `
//                 <div class="site-wrapper" data-drawer-target="#siteDetails">
//                     <div class="site-body">
//                         <div class="icon-wrapper">
//                             <span class="mat-icon material-symbols-sharp">location_on</span>
//                         </div>
//                         <div class="site-details">
//                             <p>${site.sitenumber}</p>
//                             <h3>${site.sitename}</h3>
//                         </div>
//                     </div>
//                     <div class="site-control">
//                         <button role="button" class="btn">
//                             Details
//                         </button>
//                     </div>
//                 </div>
//             `;
    
//             siteItem.querySelector(".site-wrapper").addEventListener("click", () => {
//                 DeepView.siteDetails(response, site.sitenumber);
//             });
    
//             siteListContainer.appendChild(siteItem);

//             Drawer.init();
//             Button.init();
//         });
//     },
    

//     siteDetails: (response, sitenumber) => {
//         const siteData = response.filter(site => site.sitenumber === sitenumber);
    
//         // Use a drawer component to display details
//         const drawerContent = `
//             <h2>Details for Site ${siteData[0].sitename} (${sitenumber})</h2>
//             <ul>
//                 ${siteData.map(tank => `
//                     <li>
//                         <div>
//                             <strong>Tank:</strong> ${tank.Tank}
//                         </div>
//                         <div>
//                             <strong>Product:</strong> ${tank.product}
//                         </div>
//                         <div>
//                             <strong>Capacity:</strong> ${tank.capacity} L
//                         </div>
//                         <div>
//                             <strong>Volume:</strong> ${tank.productvolume} L
//                         </div>
//                     </li>
//                 `).join('')}
//             </ul>
//         `;

//         SiteDrawer.init(siteData); // Assuming SiteDrawer accepts HTML content
//     },
    

// }

// const SiteDrawer = {
//     // Clone and insert the drawer inside the clicked siteItem
//     init: async (response) => {
//         console.log('response', response)

//         const sharedDrawer = document.querySelector("#siteDetails");
//         if (!sharedDrawer) {
//             console.error("Shared drawer element not found.");
//             return;
//         }

//         await SiteDrawer.siteDetails(sharedDrawer, response);
//     },
//     siteDetails: async (drawer, site) => {
//         const sitestatus = drawer.querySelector('.drawer-title .icon-wrapper');

//         const sitenumber = drawer.querySelector('.drawer-title .drawer-title-wrapper p');

//         if (sitenumber) sitenumber.textContent = site.sitenumber;

//         const sitename = drawer.querySelector('.drawer-title .drawer-title-wrapper h2');
//         if (sitename) sitename.textContent = site.sitename;
//     }
// }


const DeepView = {
    init: async () => {
        const siteListTanksWrapper = document.querySelector('#siteListTanksWrapper');
        if (siteListTanksWrapper) {
            const response = await FetchData.init();
            if (!response || Object.keys(response).length === 0) {
                console.error("No sites data available");
                DeepView.emptyState(siteListTanksWrapper);
                return;
            }
            DeepView.removeEmptyState(siteListTanksWrapper);
            DeepView.groupSites(response, siteListTanksWrapper);

            // Handle the filter input event
            const filterInput = document.querySelector(".gts-filter input");
            if (filterInput) {
                filterInput.addEventListener("input", async () => {
                    const query = filterInput.value.toLowerCase();
                    const filteredSites = await DeepView.filterSites(query, siteListTanksWrapper);
                    DeepView.createList(response, filteredSites, siteListTanksWrapper);
                });
            }
        }
    },

    groupSites: (response, siteListTanksWrapper) => {
        const groupedSites = [];

        // Extract unique sites
        response.forEach((site) => {
            if (!groupedSites.some(s => s.sitenumber === site.sitenumber)) {
                groupedSites.push({
                    sitenumber: site.sitenumber,
                    sitename: site.sitename,
                });
            }
        });

        DeepView.createList(response, groupedSites, siteListTanksWrapper);
    },

    createList: (response, groupedSites, siteListTanksWrapper) => {
        const siteListContainer = siteListTanksWrapper.querySelector(".sites-list ul");
        if (!siteListContainer) return;
    
        siteListContainer.innerHTML = ""; // Clear existing content
    
        groupedSites.forEach((site) => {
            const siteItem = document.createElement("li");
            siteItem.classList.add("site-item");
    
            siteItem.innerHTML = `
                <div class="site-wrapper" data-drawer-target="#siteDetails">
                    <div class="site-body">
                        <div class="icon-wrapper">
                            <span class="mat-icon material-symbols-sharp">location_on</span>
                        </div>
                        <div class="site-details">
                            <p>${site.sitenumber}</p>
                            <h3>${site.sitename}</h3>
                        </div>
                    </div>
                    <div class="site-control">
                        <button role="button" class="btn">
                            Details
                        </button>
                    </div>
                </div>
            `;
    
            // Pass selected site and related tanks to SiteDrawer
            siteItem.querySelector(".site-wrapper").addEventListener("click", () => {
                DeepView.siteDetails(response, site);
            });
    
            siteListContainer.appendChild(siteItem);
        });
    
        Drawer.init();
        Button.init();
    },
    
    filterSites: async (query, siteListTanksWrapper) => {
        const response = await FetchData.init();
        const groupedSites = [];

        // Extract unique sites
        response.forEach((site) => {
            if (!groupedSites.some(s => s.sitenumber === site.sitenumber)) {
                groupedSites.push({
                    sitenumber: site.sitenumber,
                    sitename: site.sitename,
                });
            }
        });

        const filteredSites = groupedSites.filter((site) => {
            return (
                site.sitename.toLowerCase().includes(query) ||
                site.sitenumber.toString().includes(query)
            );
        });

        const siteListWrapper = document.querySelector("#siteListTanksWrapper");
        if (!filteredSites.length) {
            DeepView.emptyState(siteListWrapper); // Call emptyState when no results
        } else {
            DeepView.removeEmptyState(siteListWrapper); // Remove emptyState if results exist
        }

        return filteredSites;
    },

    emptyState: (wrapper) => {
        const siteListContainer = wrapper.querySelector(".sites-list ul");

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
            siteListContainer.parentNode.insertBefore(emptyStateDiv, siteListContainer.nextSibling);
        }
    },

    removeEmptyState: (wrapper) => {
        const emptyStateDiv = wrapper.querySelector(".emptyState");
        if (emptyStateDiv) {
            emptyStateDiv.remove();
        }
    },

    siteDetails: (response, selectedSite) => {
        const siteData = response.filter(site => site.sitenumber === selectedSite.sitenumber);
        SiteDrawer.init(selectedSite, siteData);
    },
};

const SiteDrawer = {
    init: (site, tanks) => {
        const sharedDrawer = document.querySelector("#siteDetails");
        if (!sharedDrawer) {
            console.error("Shared drawer element not found.");
            return;
        }
        SiteDrawer.siteDetails(sharedDrawer, site, tanks);
    },

    siteDetails: (drawer, site, tanks) => {
        // Update drawer header with site details
        const sitestatus = drawer.querySelector('.drawer-title .icon-wrapper');
        const sitenumber = drawer.querySelector('.drawer-title .drawer-title-wrapper p');
        const sitename = drawer.querySelector('.drawer-title .drawer-title-wrapper h2');
    
        if (sitenumber) sitenumber.textContent = site.sitenumber;
        if (sitename) sitename.textContent = site.sitename;
    
        // Populate tanks details
        const tankTabContainer = drawer.querySelector('#tankTabContainer');
        if (!tanks || tanks.length === 0) {
            tankTabContainer.innerHTML = ''; // Clear previous content if any
            if (!tankTabContainer.querySelector(".emptyState")) {
                const emptyStateDiv = document.createElement("div");
                emptyStateDiv.className = "emptyState";
    
                // Create the heading (h3)
                const heading = document.createElement("h3");
                heading.textContent = "No Tanks Found";
    
                // Create the brief (p)
                const brief = document.createElement("p");
                brief.textContent = "We couldn't find any tanks for this site, try again later.";
    
                // Append heading and brief to the empty state div
                emptyStateDiv.appendChild(heading);
                emptyStateDiv.appendChild(brief);
    
                // Insert the empty state div after the site list container
                tankTabContainer.appendChild(emptyStateDiv);
            }
            return;
        }
    
        tankTabContainer.innerHTML = ''; // Clear previous content if any
    
        // Group tanks by product and select the one with the closest timestamp
        const groupedTanks = tanks.reduce((acc, tank) => {
            console.log('tank', tank)

            const productName = tank.Tank || "Unknown Product";
            let timestamp = new Date(tank.timestamp);
        
            console.log('timestamp', timestamp)

            // If the timestamp is invalid, assign a default fallback
            if (isNaN(timestamp.getTime())) {
                timestamp = new Date(0); // Fallback if the timestamp is invalid
            }
        
            // If this product hasn't been added or this timestamp is closer to the current date, update it
            if (!acc[productName] || Math.abs(new Date() - timestamp) < Math.abs(new Date() - acc[productName].timestamp)) {
                acc[productName] = { ...tank, timestamp };
            }

            return acc;
        }, {});
        
    
        // Iterate over the grouped tanks and display their details
        Object.entries(groupedTanks).forEach(([productName, tank]) => {
            const tankCard = document.createElement('div');
            tankCard.classList.add('tank-card');
            tankCard.classList.add(tank.product.toLowerCase());
    
            // Tank label (Product Name)
            const labelWrapper = document.createElement('div');
            labelWrapper.classList.add('label-wrapper');
            tankCard.appendChild(labelWrapper);
    
            const labelIcon = document.createElement('div');
            labelIcon.classList.add('icon-wrapper');
            const gasIcon = document.createElement('span');
            gasIcon.classList.add('mat-icon');
            gasIcon.classList.add('material-symbols-sharp');
            gasIcon.textContent = 'gas_meter';
            labelIcon.appendChild(gasIcon);
            labelWrapper.appendChild(labelIcon);
    
            const label = document.createElement('p');
            label.textContent = tank.product;
            label.classList.add('tank-label');
            labelWrapper.appendChild(label);
    
            const tankName = document.createElement('h3');
            tankName.textContent = tank.Tank;
            tankName.classList.add('tank-name');
            labelWrapper.appendChild(tankName);
    
            // Tank progress bar for capacity
            const progressContainer = document.createElement('div');
            progressContainer.classList.add('progress-container');
    
            const progress = document.createElement('div');
            progress.classList.add('progress-bar');
    
            // Calculate and set width based on capacity percentage
            const capacityPercentage = (tank.productvolume / tank.capacity) * 100;
            console.log('capacityPercentage', capacityPercentage)
            progress.style.width = `${capacityPercentage}%`;
            if (capacityPercentage <= 20) {
                progress.classList.add('red');
            }
            if (capacityPercentage > 20 && capacityPercentage <= 80) {
                progress.classList.add('orange');
            }
            if (capacityPercentage > 80 && capacityPercentage <= 100) {
                progress.classList.add('green');
            }
    
            // Create and append dashes
            [20, 80].forEach(percent => {
                const dash = document.createElement('span');
                dash.classList.add('dash');
                dash.style.left = `${percent}%`; // Positioning the dash
                progressContainer.appendChild(dash);
            });
    
            // Append progress bar to container
            progressContainer.appendChild(progress);
            tankCard.appendChild(progressContainer);
    
            // Create a wrapper div for the capacity information
            const capacityWrapper = document.createElement('div');
            capacityWrapper.classList.add('capacity-wrapper');
    
            // Create div for `tanklastinfoid__prodvol`
            const currentVolumeDiv = document.createElement('div');
            currentVolumeDiv.classList.add('current-volume');
            currentVolumeDiv.textContent = tank.productvolume;
    
            // Create div for `icon`
            const capacityIcon = document.createElement('span');
            capacityIcon.classList.add('mat-icon', 'material-symbols-sharp');
            capacityIcon.textContent = 'oil_barrel';
            currentVolumeDiv.prepend(capacityIcon);
    
            // Add span for "Ltr" inside `currentVolumeDiv`
            const currentVolumeSpan = document.createElement('span');
            currentVolumeSpan.textContent = 'Ltr';
            currentVolumeDiv.appendChild(currentVolumeSpan);
    
            // Create div for `capacity`
            const capacityDiv = document.createElement('div');
            capacityDiv.classList.add('tank-capacity');
            capacityDiv.textContent = tank.capacity;
    
            // Add span for "Ltr" inside `capacityDiv`
            const capacitySpan = document.createElement('span');
            capacitySpan.textContent = 'Ltr';
            capacityDiv.appendChild(capacitySpan);
    
            // Append the two divs to the wrapper
            capacityWrapper.appendChild(currentVolumeDiv);
            capacityWrapper.appendChild(capacityDiv);
    
            // Add the wrapper to the tank card
            tankCard.appendChild(capacityWrapper);
    
            // Append the tank card to the container
            tankTabContainer.appendChild(tankCard);
        });
    }
    
};

pageReady(() => {
    TanksDT.init();
    DeepView.init();
    TanksFilter.init();
});