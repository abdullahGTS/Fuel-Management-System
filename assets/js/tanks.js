//tanks.js
import { pageReady, Button, Drawer, Tab, DataTable, Select, DatePicker, DatatableFilter } from './script.js';
import { API_PATHS, fetchData, SharedColors, ChartBackgroundColor } from './constant.js';
import { AppearanceToggle } from './portal.js';

const FetchData = {
    init: async () => {
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
            } else {
                // Other filters (multi-select)
                filteredTanks = filteredTanks.filter(res => {
                    return values.some(value => String(res[key]) === String(value));
                });
            }
        });

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
                        { title: `<span class="mat-icon material-symbols-sharp">schedule</span> Time`, data: "timestamp" },
                        { title: "", data: "details" },
                    ],
                    responsive: true,
                    paging: formattedData.length > 10,
                    pageLength: 10,
                }, [{
                    targets: -1, // Target the last column
                    orderable: false, // Disable sorting
                    responsivePriority: 1, // Ensure it's always visible
                    render: (data, type, row) => {
                        return `<button class="btn btn-icon view-more" data-tank="${row.Tank}" data-drawer-target="#tankDetails"><span class="mat-icon material-symbols-sharp">visibility</span></button>`;
                    },
                },
                { width: "0px", targets: 0 },
                { width: "80px", targets: 9 },
                ], "Tanks data table");

                // Attach click event to dynamically generated "view-more" buttons
                document.querySelector(".gts-dt-wrapper").addEventListener("click", (event) => {
                    const button = event.target.closest(".view-more");
                    if (button) {
                        const tankId = button.getAttribute("data-tank");
                        const tank = tanks.find((tank) => tank.Tank.toString() === tankId);
                        if (tank) {
                            TankDrawer.init(tank);
                        } else {
                            console.error(`Site with ID ${tankId} not found.`);
                        }
                    }
                });

                Drawer.init();

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
            timestamp: tanks.timestamp,
            details: ''
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
                    // DeepView.createList(response, filteredSites, siteListTanksWrapper);
                });
            }

            const siteListWrapper = document.querySelector("#siteListTanksWrapper");
            if (siteListWrapper) {
                const sites = await fetchData(API_PATHS.sitesData);
                if (!sites || Object.keys(sites).length === 0) {
                    console.error("No sites data available");
                    DeepView.emptyState(wrapper);
                    return;
                }

                // Store the original list of sites
                // DeepView.sites = sites;
                DeepView.siteList(siteListWrapper, sites);
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

    // Render the site list
    siteList: (wrapper, sites) => {
        const siteListContainer = wrapper.querySelector(".sites-list ul");
        if (!siteListContainer) return;

        // Clear any existing site list content
        siteListContainer.innerHTML = "";

        // Generate site list items
        sites.forEach((site) => {
            const siteItem = document.createElement("li");
            siteItem.classList.add("site-item");
            const location = site.longitud + ',' + site.latitud; // Get the location from the site data

            siteItem.innerHTML = `
                <div class="site-wrapper">
                    <div class="site-body" data-drawer-target="#siteDetails">
                        <div class="icon-wrapper ${site.status.toLowerCase()}">
                            <span class="mat-icon material-symbols-sharp">location_on</span>
                        </div>
                        <div class="site-details">
                            <p>${site.sitenumber}</p>
                            <h3>${site.name}</h3>
                        </div>
                    </div>
                    <div class="site-control">
                        <a role="button" href="https://www.google.com/maps?q=${location}" target="_blank" class="btn">
                            Direction
                        </a>
                    </div>
                </div>
            `;

            // Add click event listener to clone and insert the drawer
            siteItem.querySelector(".site-body").addEventListener("click", () => {
                SiteDrawer.init(site);
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
    // Clone and insert the drawer inside the clicked siteItem
    init: (site) => {
        const sharedDrawer = document.querySelector("#siteDetails");
        if (!sharedDrawer) {
            console.error("Shared drawer element not found.");
            return;
        }
        // sharedDrawer.innerHTML = '';
        SiteDrawer.siteDetails(sharedDrawer, site);
    },

    siteDetails: async (drawer, site) => {
        const sitestatus = drawer.querySelector('.drawer-title .icon-wrapper');
        if (sitestatus) {
            sitestatus.classList.toggle('online', site.status === 'online');
            sitestatus.classList.toggle('offline', site.status === 'offline');
        }

        const sitenumber = drawer.querySelector('.drawer-title .drawer-title-wrapper p');
        if (sitenumber) sitenumber.textContent = site.sitenumber;

        const sitename = drawer.querySelector('.drawer-title .drawer-title-wrapper h2');
        if (sitename) sitename.textContent = site.name;

        const siteData = await fetchData(API_PATHS.siteDetails);
        if (!siteData || Object.keys(siteData).length === 0) {
            console.error("No site data available");
            return;
        }

        // Fetch the tanks and alarms
        const tanks = siteData.tanks;
        const alarms = siteData.alarms;
        const pumps = siteData.pumps;

        // Check if tanks data exists
        if (tanks && tanks.length > 0) {
            const tankTabContainer = document.getElementById('tankTabContainer');
            tankTabContainer.innerHTML = ''; // Clear previous content if any

            tanks.forEach(tank => {
                // Create the tank card
                const tankCard = document.createElement('div');
                tankCard.classList.add('tank-card');
                tankCard.classList.add(tank.productid__name.toLowerCase());

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
                label.textContent = tank.productid__name;
                label.classList.add('tank-label');
                labelWrapper.appendChild(label);

                const tankName = document.createElement('h3');
                tankName.textContent = 'Tank ' + tank.fusiontankid;
                tankName.classList.add('tank-name');
                labelWrapper.appendChild(tankName);

                // Tank progress bar for capacity
                const progressContainer = document.createElement('div');
                progressContainer.classList.add('progress-container');

                const progress = document.createElement('div');
                progress.classList.add('progress-bar');

                // Calculate and set width based on capacity percentage
                const capacityPercentage = (tank.tanklastinfoid__prodvol / tank.capacity) * 100;
                progress.style.width = `${capacityPercentage}%`;
                if (capacityPercentage <= 20) {
                    progress.classList.add('red')
                }
                if (capacityPercentage > 20 && capacityPercentage <= 80) {
                    progress.classList.add('orange')
                }
                if (capacityPercentage > 80 && capacityPercentage <= 100) {
                    progress.classList.add('green')
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
                currentVolumeDiv.textContent = tank.tanklastinfoid__prodvol;

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

                // // Add the wrapper to the tank card
                tankCard.appendChild(capacityWrapper);


                // Add alarms related to this tank
                const tankAlarms = alarms.filter(alarm => alarm.device === `Tank ${tank.fusiontankid}`);
                const alarmList = document.createElement('ul');
                alarmList.classList.add('alarm-list');

                if (tankAlarms.length > 0) {
                    tankAlarms.forEach(alarm => {
                        const alarmItem = document.createElement('li');

                        // Create alarm div with specific severity styling
                        const alarmDiv = document.createElement('div');
                        alarmDiv.classList.add('alarm-item', alarm.severity.toLowerCase());

                        // Determine icon based on severity
                        const severityDiv = document.createElement('div');
                        severityDiv.classList.add('severity');
                        severityDiv.textContent = alarm.severity;

                        const icon = document.createElement('span');
                        icon.classList.add('mat-icon', 'material-symbols-sharp');
                        icon.textContent = alarm.severity === 'Warning'
                            ? 'warning'
                            : alarm.severity === 'Info'
                                ? 'error'
                                : 'cancel';

                        // Add text content for alarm details
                        severityDiv.prepend(icon);
                        alarmDiv.appendChild(severityDiv);

                        const alarmTypeSpan = document.createElement('span');
                        alarmTypeSpan.classList.add('alarm-type');
                        alarmTypeSpan.textContent = alarm.type;
                        alarmDiv.appendChild(alarmTypeSpan);

                        // Create the alarm-status div
                        const alarmStatusDiv = document.createElement('div');
                        alarmStatusDiv.classList.add('alarm-status');

                        // Add the first icon (check or close) with appropriate class based on `isactive`
                        const statusIcon = document.createElement('span');
                        statusIcon.classList.add('mat-icon', 'material-symbols-sharp', alarm.isactive === 'solved' ? 'is-active' : 'not-active');
                        statusIcon.textContent = alarm.isactive === 'solved' ? 'check_circle' : 'circle_notifications';
                        alarmStatusDiv.appendChild(statusIcon);

                        // Add hover events for the tooltip
                        statusIcon.addEventListener('mouseenter', () => {
                            // Create the tooltip
                            const tooltip = document.createElement('div');
                            tooltip.classList.add('tooltip');
                            tooltip.textContent = alarm.isactive;
                            document.body.appendChild(tooltip);

                            // Position the tooltip near the icon
                            const rect = statusIcon.getBoundingClientRect();
                            const tooltipRect = tooltip.getBoundingClientRect();

                            tooltip.style.position = 'absolute';
                            tooltip.style.left = `${rect.left - tooltipRect.width + rect.width}px`;
                            tooltip.style.top = `${rect.bottom + 5}px`;
                            tooltip.setAttribute('id', 'alarm-tooltip');
                        });

                        statusIcon.addEventListener('mouseleave', () => {
                            // Remove the tooltip
                            const tooltip = document.getElementById('alarm-tooltip');
                            if (tooltip) {
                                tooltip.remove();
                            }
                        });

                        // Add the time icon with tooltip functionality
                        const timeIcon = document.createElement('span');
                        timeIcon.classList.add('mat-icon', 'material-symbols-sharp');
                        timeIcon.setAttribute('id', 'alarmTime');
                        timeIcon.textContent = 'schedule';

                        // Add hover events for the tooltip
                        timeIcon.addEventListener('mouseenter', () => {
                            // Create the tooltip
                            const tooltip = document.createElement('div');
                            tooltip.classList.add('tooltip');
                            tooltip.textContent = alarm.time;
                            document.body.appendChild(tooltip);

                            // Position the tooltip near the icon
                            const rect = timeIcon.getBoundingClientRect();
                            const tooltipRect = tooltip.getBoundingClientRect();

                            tooltip.style.position = 'absolute';
                            tooltip.style.left = `${rect.left - tooltipRect.width + rect.width}px`;
                            tooltip.style.top = `${rect.bottom + 5}px`;
                            tooltip.setAttribute('id', 'alarm-tooltip');
                        });

                        timeIcon.addEventListener('mouseleave', () => {
                            // Remove the tooltip
                            const tooltip = document.getElementById('alarm-tooltip');
                            if (tooltip) {
                                tooltip.remove();
                            }
                        });

                        alarmStatusDiv.appendChild(timeIcon);

                        // Append the alarm-status div to the alarmDiv
                        alarmDiv.appendChild(alarmStatusDiv);


                        // Append alarmDiv to alarmItem
                        alarmItem.appendChild(alarmDiv);
                        alarmList.appendChild(alarmItem);
                    });
                } else {
                    const noAlarmItem = document.createElement('li');
                    // Create "No Alarms" div
                    const noAlarmDiv = document.createElement('div');
                    noAlarmDiv.classList.add('no-alarms');

                    // Add icon and text
                    const noAlarmIcon = document.createElement('span');
                    noAlarmIcon.classList.add('mat-icon', 'material-symbols-sharp');
                    noAlarmIcon.textContent = 'notifications_off';

                    const noAlarmText = document.createTextNode('No Alarms');

                    // Append icon and text to the div
                    noAlarmDiv.appendChild(noAlarmIcon);
                    noAlarmDiv.appendChild(noAlarmText);

                    // Append div to list item
                    noAlarmItem.appendChild(noAlarmDiv);
                    tankCard.appendChild(noAlarmItem);
                    alarmList.appendChild(noAlarmItem);
                }

                tankCard.appendChild(alarmList);
                // Append the tank card to the container
                tankTabContainer.appendChild(tankCard);
            });
        } else {
            // Check if the empty state message already exists
            const tankTabContainer = document.getElementById('tankTabContainer');
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
        }

        if (pumps && pumps.length > 0) {
            const pumpsTabContainer = document.querySelector("#pumpsTabContainer");
            pumpsTabContainer.innerHTML = ''; // Clear previous content if any

            const pumpsGroupedByFusionId = pumps.reduce((acc, pump) => {
                if (!acc[pump.fusionid]) {
                    acc[pump.fusionid] = {
                        fusionid: pump.fusionid,
                        brand: pump.brand,
                        nozzles: []
                    };
                }
                acc[pump.fusionid].nozzles.push(pump);

                return acc;
            }, {});

            // Create cards for each pump (grouped by fusionid)
            Object.values(pumpsGroupedByFusionId).forEach((group) => {
                const pumpCard = document.createElement("div");
                pumpCard.classList.add("pump-card");

                // Pump header (with same style as tank headers)
                const labelWrapper = document.createElement("div");
                labelWrapper.classList.add("label-wrapper");

                const labelIcon = document.createElement("div");
                labelIcon.classList.add("icon-wrapper");
                const pumpIcon = document.createElement("span");
                pumpIcon.classList.add("mat-icon", "material-symbols-sharp");
                pumpIcon.textContent = "local_gas_station"; // Pump icon
                labelIcon.appendChild(pumpIcon);
                labelWrapper.appendChild(labelIcon);

                const label = document.createElement("p");
                label.textContent = group.brand;
                label.classList.add("pump-label");
                labelWrapper.appendChild(label);

                const pumpName = document.createElement("h3");
                pumpName.textContent = `Pump ${group.fusionid}`;
                pumpName.classList.add("pump-name");
                labelWrapper.appendChild(pumpName);

                pumpCard.appendChild(labelWrapper);

                // Nozzles and their sales data
                const nozzlesWrapper = document.createElement("div");
                nozzlesWrapper.classList.add("nozzles-wrapper");

                group.nozzles.forEach((nozzle) => {
                    const nozzleItem = document.createElement("div");
                    nozzleItem.classList.add("nozzle-item");
                    nozzleItem.classList.add(nozzle.hose__gradeid__name.toLowerCase());

                    const nozzleHeader = document.createElement("div");
                    nozzleHeader.classList.add("nozzle-header");

                    // Create the nozzle icon container
                    const nozzleIcon = document.createElement("div");
                    nozzleIcon.classList.add("nozzle-icon");

                    // Add the material icon span
                    const nozzleIconSpan = document.createElement("span");
                    nozzleIconSpan.classList.add("mat-icon");
                    nozzleIconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" width="400px" height="400px"><path d="M25,30C25,27.239,20,20,20,20S15,27.239,15,30S17.239,35,20,35S25,32.761,25,30Z" stroke="none"></path><path d="M20,50C20,52.761,22.239,55,25,55S30,52.761,30,50S25,40,25,40S20,47.239,20,50Z" stroke="none"></path><path d="M75,30L65,30L55,20L51.768,23.232L42.197,13.661C39.835,11.3,36.697,10,33.358,10L20,10L20,15L33.358,15C35.361,15,37.245,15.78,38.661,17.196L48.232,26.767L45,30L55,40L45,50L45,80C45,85.523,49.477,90,55,90L80,90L80,65L85,60L85,40C85,34.477,80.523,30,75,30ZM70,85L55,85C52.239,85,50,82.761,50,80L50,55L60,55C60,59.094,60,69.41,55.264,78.882L59.736,81.118C65,70.59,65,59.447,65,55C67.761,55,70,57.239,70,60L70,85Z" stroke="none"></path></svg>`; // Nozzle icon
                    nozzleIcon.appendChild(nozzleIconSpan);

                    // Append the icon container to the header
                    nozzleHeader.appendChild(nozzleIcon);

                    // Create the nozzle label container
                    const nozzleLabel = document.createElement("div");
                    nozzleLabel.classList.add("nozzle-label");

                    // Add the nozzle number paragraph
                    const nozzleNumber = document.createElement("p");
                    nozzleNumber.textContent = `Nozzle #: ${nozzle.hose__logicalid}`;
                    nozzleLabel.appendChild(nozzleNumber);

                    // Add the nozzle grade name header
                    const nozzleLabelHeader = document.createElement("h4");
                    nozzleLabelHeader.textContent = `${nozzle.hose__gradeid__name}`;
                    nozzleLabel.appendChild(nozzleLabelHeader);

                    // Append the label container to the header
                    nozzleHeader.appendChild(nozzleLabel);

                    // Append the header to the nozzle item
                    nozzleItem.appendChild(nozzleHeader);


                    const nozzleSale = document.createElement("div");
                    nozzleSale.classList.add("nozzle-sale");
                    const saleMoney = document.createElement("p");
                    saleMoney.classList.add('sale-money');

                    // saleMoney.innerHTML = `${nozzle.last_sale_money} <span>SAR</span>`;
                    const [integerPart, decimalPart] = nozzle.last_sale_money.split('.');

                    // Create the formatted HTML structure
                    saleMoney.innerHTML = `
                    <span>SAR</span> ${integerPart}<span class="decimal">.${decimalPart}</span>
                    `;

                    const saleVolume = document.createElement("p");
                    saleVolume.classList.add('sale-volume');

                    saleVolume.innerHTML = `${nozzle.last_sale_volume} <span>Ltr</span>`;
                    nozzleSale.appendChild(saleMoney);
                    nozzleSale.appendChild(saleVolume);
                    nozzleItem.appendChild(nozzleSale);

                    const nozzleTime = document.createElement("div");
                    nozzleTime.classList.add("nozzle-time");
                    const saleStartDate = document.createElement("p");
                    // saleStartDate.textContent = `${nozzle.last_sale_startdate}`;
                    const startDate = new Date(nozzle.last_sale_startdate);
                    saleStartDate.innerHTML = `<span>Start at:</span> ${startDate.toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Optional: Change to `false` for 24-hour format
                    })}`

                    const saleEndDate = document.createElement("p");
                    // saleEndDate.textContent = `${nozzle.last_sale_enddate}`;
                    const endDate = new Date(nozzle.last_sale_enddate);
                    saleEndDate.innerHTML = `<span>End at:</span> ${endDate.toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Optional: Change to `false` for 24-hour format
                    })}`

                    nozzleTime.appendChild(saleStartDate);
                    nozzleTime.appendChild(saleEndDate);
                    nozzleItem.prepend(nozzleTime);

                    nozzlesWrapper.appendChild(nozzleItem);
                });


                // Add alarms related to this tank
                const pumpsAlarms = alarms.filter(alarm => alarm.device === `Pump ${group.fusionid}`);
                const alarmList = document.createElement('ul');
                alarmList.classList.add('alarm-list');

                if (pumpsAlarms.length > 0) {
                    pumpsAlarms.forEach(alarm => {
                        const alarmItem = document.createElement('li');

                        // Create alarm div with specific severity styling
                        const alarmDiv = document.createElement('div');
                        alarmDiv.classList.add('alarm-item', alarm.severity.toLowerCase());

                        // Determine icon based on severity
                        const severityDiv = document.createElement('div');
                        severityDiv.classList.add('severity');
                        severityDiv.textContent = alarm.severity;

                        const icon = document.createElement('span');
                        icon.classList.add('mat-icon', 'material-symbols-sharp');
                        icon.textContent = alarm.severity === 'Warning'
                            ? 'warning'
                            : alarm.severity === 'Info'
                                ? 'error'
                                : 'cancel';

                        // Add text content for alarm details
                        severityDiv.prepend(icon);
                        alarmDiv.appendChild(severityDiv);

                        const alarmTypeSpan = document.createElement('span');
                        alarmTypeSpan.classList.add('alarm-type');
                        alarmTypeSpan.textContent = alarm.type;
                        alarmDiv.appendChild(alarmTypeSpan);

                        // Create the alarm-status div
                        const alarmStatusDiv = document.createElement('div');
                        alarmStatusDiv.classList.add('alarm-status');

                        // Add the first icon (check or close) with appropriate class based on `isactive`
                        const statusIcon = document.createElement('span');
                        statusIcon.classList.add('mat-icon', 'material-symbols-sharp', alarm.isactive === 'solved' ? 'is-active' : 'not-active');
                        statusIcon.textContent = alarm.isactive === 'solved' ? 'check_circle' : 'circle_notifications';
                        alarmStatusDiv.appendChild(statusIcon);

                        // Add hover events for the tooltip
                        statusIcon.addEventListener('mouseenter', () => {
                            // Create the tooltip
                            const tooltip = document.createElement('div');
                            tooltip.classList.add('tooltip');
                            tooltip.textContent = alarm.isactive;
                            document.body.appendChild(tooltip);

                            // Position the tooltip near the icon
                            const rect = statusIcon.getBoundingClientRect();
                            const tooltipRect = tooltip.getBoundingClientRect();

                            tooltip.style.position = 'absolute';
                            tooltip.style.left = `${rect.left - tooltipRect.width + rect.width}px`;
                            tooltip.style.top = `${rect.bottom + 5}px`;
                            tooltip.setAttribute('id', 'alarm-tooltip');
                        });

                        statusIcon.addEventListener('mouseleave', () => {
                            // Remove the tooltip
                            const tooltip = document.getElementById('alarm-tooltip');
                            if (tooltip) {
                                tooltip.remove();
                            }
                        });

                        // Add the time icon with tooltip functionality
                        const timeIcon = document.createElement('span');
                        timeIcon.classList.add('mat-icon', 'material-symbols-sharp');
                        timeIcon.setAttribute('id', 'alarmTime');
                        timeIcon.textContent = 'schedule';

                        // Add hover events for the tooltip
                        timeIcon.addEventListener('mouseenter', () => {
                            // Create the tooltip
                            const tooltip = document.createElement('div');
                            tooltip.classList.add('tooltip');
                            tooltip.textContent = alarm.time;
                            document.body.appendChild(tooltip);

                            // Position the tooltip near the icon
                            const rect = timeIcon.getBoundingClientRect();
                            const tooltipRect = tooltip.getBoundingClientRect();

                            tooltip.style.position = 'absolute';
                            tooltip.style.left = `${rect.left - tooltipRect.width + rect.width}px`;
                            tooltip.style.top = `${rect.bottom + 5}px`;
                            tooltip.setAttribute('id', 'alarm-tooltip');
                        });

                        timeIcon.addEventListener('mouseleave', () => {
                            // Remove the tooltip
                            const tooltip = document.getElementById('alarm-tooltip');
                            if (tooltip) {
                                tooltip.remove();
                            }
                        });

                        alarmStatusDiv.appendChild(timeIcon);

                        // Append the alarm-status div to the alarmDiv
                        alarmDiv.appendChild(alarmStatusDiv);


                        // Append alarmDiv to alarmItem
                        alarmItem.appendChild(alarmDiv);
                        alarmList.appendChild(alarmItem);
                    });
                } else {
                    const noAlarmItem = document.createElement('li');
                    // Create "No Alarms" div
                    const noAlarmDiv = document.createElement('div');
                    noAlarmDiv.classList.add('no-alarms');

                    // Add icon and text
                    const noAlarmIcon = document.createElement('span');
                    noAlarmIcon.classList.add('mat-icon', 'material-symbols-sharp');
                    noAlarmIcon.textContent = 'notifications_off';

                    const noAlarmText = document.createTextNode('No Alarms');

                    // Append icon and text to the div
                    noAlarmDiv.appendChild(noAlarmIcon);
                    noAlarmDiv.appendChild(noAlarmText);

                    // Append div to list item
                    noAlarmItem.appendChild(noAlarmDiv);
                    pumpCard.appendChild(noAlarmItem);
                    alarmList.appendChild(noAlarmItem);
                }

                pumpCard.appendChild(nozzlesWrapper);
                pumpCard.appendChild(alarmList);

                // Add the pump card to the container
                pumpsTabContainer.appendChild(pumpCard);
            });

        } else {
            // Check if the empty state message already exists
            const pumpsTabContainer = document.querySelector("#pumpsTabContainer");
            pumpsTabContainer.innerHTML = ''; // Clear previous content if any

            if (!pumpsTabContainer.querySelector(".emptyState")) {
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
        }

    }
}

const TankDrawer = {
    // Clone and insert the drawer inside the clicked siteItem
    init: async (tank) => {
        const sharedDrawer = document.querySelector("#tankDetails");
        if (!sharedDrawer) {
            console.error("Shared drawer element not found.");
            return;
        }

        await TankDrawer.siteDetails(sharedDrawer, tank);
    },

    siteDetails: async (drawer, tank) => {
        const body = drawer.querySelector('.drawer-body');
        if (body) body.innerHTML = ''; // Clear existing content

        // Create tank details dynamically
        const tankDetailsHTML = `
            <div class="drawer-title">
                <div class="icon-wrapper ${tank.online ? 'online' : 'offline'}">
                    <span class="mat-icon material-symbols-sharp">location_on</span>
                </div>
                <div class="drawer-title-wrapper">
                    <p>${tank.sitenumber}</p>
                    <h2>${tank.sitename}</h2>
                </div>
            </div>

            <div class="tank-card">
                <div class="label-wrapper">
                    <p class="tank-label">${tank.product}</p>
                    <h3 class="tank-name">${tank.Tank}</h3>
                </div>
            </div>

            <div class="tank-visualization">
                <div class="product-visualization"></div>
                <div class="water-visualization"></div>
            </div>

            <div class="tank-capacity">
                <p class="tank-capacity-label"><strong>Tank Capacity</strong>: ${tank.capacity} L</p>
                <p><strong>On Date</strong>: ${new Date(tank.timestamp).toLocaleString()}</p>
            </div>

        `;
    
        // Append tank details to the body
        body.innerHTML = tankDetailsHTML;
        await TankDrawer.tankFill(body, tank);
        await TankDrawer.waterFill(body, tank);
    },
    
    tankFill: async (body, tank) => {
        const productsTank = document.createElement('div');
        productsTank.classList.add('products-tank');

        const productsTankLabel = document.createElement('p');
        productsTankLabel.classList.add('products-tank-label');
        productsTankLabel.textContent = 'Product Volume'

        const liquid = document.createElement('div');
        liquid.classList.add('liquid');

        // Add SVG for products
        const svgNamespace = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNamespace, 'svg');
        svg.classList.add('products');
        svg.setAttribute('viewBox', '0 0 200 100');

        const path = document.createElementNS(svgNamespace, 'path');
        path.setAttribute('fill', SharedColors[tank.product]);
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
        const productsLevel = (tank.productvolume / tank.capacity) * 100;
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
        label.style.bottom = `${productsLevel}%`;
        // label.textContent = `${Math.round(productsLevel)}%`;
        const currentValue = parseFloat(tank.productvolume).toFixed(2);

        label.innerHTML = `${currentValue}<span>lts</span>`;
        productsTank.appendChild(label);

        // Append the products tank to the body
        // body.appendChild(productsTank);
        const tankVisualizationContainer = body.querySelector('.tank-visualization .product-visualization');
        if (tankVisualizationContainer) {
            tankVisualizationContainer.appendChild(productsTank); // Insert returned HTML
            tankVisualizationContainer.appendChild(productsTankLabel); // Insert returned HTML
        }
    },    

    waterFill: async (body, tank) => {
        const productsTank = document.createElement('div');
        productsTank.classList.add('products-tank');

        const productsTankLabel = document.createElement('p');
        productsTankLabel.classList.add('products-tank-label');
        productsTankLabel.textContent = 'Water Volume'

        const liquid = document.createElement('div');
        liquid.classList.add('liquid');

        // Add SVG for products
        const svgNamespace = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNamespace, 'svg');
        svg.classList.add('products');
        svg.setAttribute('viewBox', '0 0 200 100');

        const path = document.createElementNS(svgNamespace, 'path');
        path.setAttribute('fill', SharedColors.WaterColor);
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
        const productsLevel = (tank.watervolume / tank.capacity) * 100;
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
        label.style.bottom = `${productsLevel}%`;
        // label.textContent = `${Math.round(productsLevel)}%`;
        const currentValue = parseFloat(tank.watervolume).toFixed(2);

        label.innerHTML = `${currentValue}<span>lts</span>`;
        productsTank.appendChild(label);

        // Append the products tank to the body
        // body.appendChild(productsTank);
        const tankVisualizationContainer = body.querySelector('.tank-visualization .water-visualization');
        if (tankVisualizationContainer) {
            tankVisualizationContainer.appendChild(productsTank); // Insert returned HTML
            tankVisualizationContainer.appendChild(productsTankLabel); // Insert returned HTML

            
        }
    }    

};


pageReady(() => {
    TanksDT.init();
    DeepView.init();
    TanksFilter.init();
});