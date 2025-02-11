//alarms.js
import { pageReady, Button, Drawer, Tab, DataTable, Select, DatePicker, DatatableFilter } from '../script.js';
import { API_PATHS, fetchData, SharedColors, ChartBackgroundColor } from '../constant.js';
import { AppearanceToggle } from '../portal.js';


const FetchData = {
    init: async() => {
        const response = await fetchData(API_PATHS.siteSuddenLoss);
        if (!response || Object.keys(response).length === 0) {
            console.error("No response data available");
            return;
        }
        return response;
    }
}

const SitesOperationDT = {
    // Initialize the Site DataTable
    init: async (filteredData) => {

        const sitesOperationDT = document.querySelector("#sitesOperationDT");
        if (sitesOperationDT) {
            let sites;
            if (!filteredData) {
                sites = await SitesOperationDT.fetchData();
            } else {
                if (filteredData.length) {
                    sitesOperationDT.innerHTML = '';
                    sites = filteredData;
                } else {
                    sitesOperationDT.innerHTML = '';
                    SitesOperationDT.emptyState(sitesOperationDT);
                }
            }

            if (sites && sites.length > 0) {
                const formattedData = SitesOperationDT.transformData(sites);
                DataTable.init(".gts-dt-wrapper", {
                    data: formattedData,
                    columns: [
                        { title: `<span class="mat-icon material-symbols-sharp">numbers</span>`, data: "id" },
                        { title: `<span class="mat-icon material-symbols-sharp">location_on</span> Site Number`, data: "sitenumber" },
                        { title: `<span class="mat-icon material-symbols-sharp">verified</span> Site Name`, data: "name" },
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
                ], "Sites data table");
            } else {
                console.error("No data available");
            }
        }
    },

    // Fetch data from the API
    fetchData: async () => {
        try {
            const response = await FetchData.init();
            const sites = await DataTable.fetchData(response.sites);
            return sites;
        } catch (error) {
            console.error("Error fetching SitesOperationDT data:", error);
            return [];
        }
    },

    // Transform the raw API data for the DataTable
    transformData: (data) => {
        let counter = 1;
        return data.map((sites) => ({
            id: counter++,
            name: sites.name,
            sitenumber: sites.sitenumber,
            rate: sites.rate,
            timestamp: sites.timestamp
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


const SiteList = {
    init: async () => {
        const wrapper = document.querySelector("#siteListWrapper");
        if ( !wrapper ) return;
        const data = await FetchData.init();
        if (!data.sites || Object.keys(data.sites).length === 0) {
            console.error("No sites data available");
            SiteList.emptyState(wrapper);
            return;
        }

        SiteList.removeEmptyState(wrapper);

        // Set total sites count
        const totalSites = document.querySelector("#totalSites");
        if (totalSites) totalSites.textContent = Object.keys(data.sites).length;

        // Get the site list wrapper
        const siteListWrapper = document.querySelector("#siteListWrapper");
        if (siteListWrapper) {
            // Store the original list of sites
            SiteList.sites = data.sites;
            SiteList.siteList(siteListWrapper, data.sites);
        }

        // Handle the filter input event
        const filterInput = document.querySelector(".gts-filter input");
        if (filterInput) {
            filterInput.addEventListener("input", () => {
                const query = filterInput.value.toLowerCase();
                const filteredSites = SiteList.filterSites(query);
                SiteList.siteList(siteListWrapper, filteredSites);
            });
        }
    },

    // Filter sites based on the search query
    filterSites: (query) => {
        const { sites } = SiteList;
        const filteredSites = sites.filter((site) => {
            return (
                site.name.toLowerCase().includes(query) ||
                site.sitenumber.toString().includes(query)
            );
        });

        const siteListWrapper = document.querySelector("#siteListWrapper");
        if (!filteredSites.length) {
            SiteList.emptyState(siteListWrapper); // Call emptyState when no results
        } else {
            SiteList.removeEmptyState(siteListWrapper); // Remove emptyState if results exist
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
            // const location = site.longitud + ',' + site.latitud; // Get the location from the site data

            siteItem.innerHTML = `
                <div class="site-wrapper">
                    <div class="site-body" data-drawer-target="#siteDetails">
                        <div class="icon-wrapper">
                            <span class="mat-icon material-symbols-sharp">location_on</span>
                        </div>
                        <div class="site-details">
                            <p>${site.sitenumber}</p>
                            <h3>${site.name}</h3>
                            <p>Current: <b>${site.rate}</b></p>
                        </div>
                    </div>
                    <div class="site-control">
                        <button class="btn new-rate"> Set new rate </button>
                    </div>
                </div>
            `;

            // Add click event listener to clone and insert the drawer
            siteItem.querySelector(".site-body").addEventListener("click", () => {
                SiteDrawer.init(site);
            });

            siteItem.querySelector(".new-rate").addEventListener("click", () => {
                const rateForm = document.querySelector('#rateForm');
                document.querySelectorAll('.sites-list li').forEach((li) => {
                    li.classList.remove('selected');
                    li.querySelector('.btn').textContent = 'Set new rate';
                    li.querySelector('.mat-icon').innerHTML = 'location_on';
                });

                siteItem.classList.add('selected');
                siteItem.querySelector('.btn').innerHTML = 'Selected site'
                siteItem.querySelector('.mat-icon').innerHTML = 'check';

                rateForm.innerHTML = '';
                RateForm.createRateForm(site);
            });

            siteListContainer.appendChild(siteItem);
        });

        Drawer.init();
        Button.init();
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
                tankCard.classList.add( tank.productid__name.toLowerCase() );

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
                if ( capacityPercentage <= 20 ) {
                    progress.classList.add('red')
                }
                if ( capacityPercentage > 20 && capacityPercentage <= 80 ) {
                    progress.classList.add('orange')
                }
                if ( capacityPercentage > 80 && capacityPercentage <= 100 ) {
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

const RateLimit = {
    init: async () => {
        const highRate = document.querySelector('#highRate');
        const lowRate = document.querySelector('#lowRate');
        const response = await FetchData.init();
        if ( response.highRate && highRate ) highRate.textContent = response.highRate;
        if ( response.lowRate && lowRate ) lowRate.textContent = response.lowRate;
    }
}

const RateForm = {
    init: () => {
        const rateForm = document.querySelector('#rateForm');
        if ( rateForm ) {
            RateForm.emptyState(rateForm);
        }
    },

    createRateForm: (selectedSite) => {
        const rateForm = document.querySelector('#rateForm');        
    
        const currentRate = selectedSite.rate;
        
        // Create the gts-card-title element
        const cardTitle = document.createElement('div');
        cardTitle.classList.add('gts-card-title');
        cardTitle.innerHTML = `
            <div class="gts-card-title-wrapper">
                <span class="mat-icon material-symbols-sharp">waterfall_chart</span>
                <h3>Adjust Delivery Rate For Site #${selectedSite.sitenumber}</h3>
            </div>
        `;
        
        // Create the form element
        const form = document.createElement('form');
        form.classList.add('datatable-filter-form', 'no-margin-form');
        
        // Create the form content
        form.innerHTML = `
            <div class="datatable-filter-items" id="rec-filter">
                <div class="filter-item">
                    <label for="currentRate">Current Rate</label>
                    <div class="form-item sub-label">
                        <input type="text" placeholder="Current Rate" id="currentRate" name="currentRate" value="${currentRate}" disabled readonly />
                        <span class="rate-label">lts/hour</span>
                    </div>
                </div>
                <div class="filter-item">
                    <label for="newRate">New Rate</label>
                    <div class="form-item sub-label">
                        <input type="text" placeholder="Set new rate" id="newRate" name="newRate" />
                        <span class="rate-label">lts/hour</span>
                    </div>
                </div>
            </div>
            <div class="btn-wrapper">
                <button class="btn submit-button">Submit New Rate</button>
            </div>
        `;
        
        // Append the gts-card-title before the form
        rateForm.appendChild(cardTitle);
        rateForm.appendChild(form);

        const newRate = document.querySelector('#newRate');

        RateForm.postNewRate(rateForm, form, selectedSite.sitenumber, currentRate, newRate);
    },       

    postNewRate: (rateForm, form, siteSelect, currentRate, newRate) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = {
                site: siteSelect,
                old_rate: currentRate,
                new_rate: newRate.value,
            };
    
            Snackbar.show({
                text: 'New delivery rate have successfully submitted!', 
                pos: 'bottom-left',
                duration: 2800
            });

            setTimeout(() => {
                console.log('Form Data:', formData);
                document.querySelectorAll('.sites-list li').forEach((li) => {
                    li.classList.remove('selected');
                    li.querySelector('.btn').textContent = 'Set new rate';
                    li.querySelector('.mat-icon').innerHTML = 'location_on';
                });
                rateForm.innerHTML = '';
                RateForm.emptyState(rateForm);
                form.reset();
            }, 0);

        });
    },

    emptyState: (wrapper) => {
        if (!wrapper.querySelector(".emptyState")) {
            const emptyStateDiv = document.createElement("div");
            emptyStateDiv.className = "emptyState";

            // Create the heading (h3)
            const heading = document.createElement("h3");
            heading.textContent = "Select Site";

            // Create the brief (p)
            const brief = document.createElement("p");
            brief.textContent = "Select site to be able set new rate";

            // Append heading and brief to the empty state div
            emptyStateDiv.appendChild(heading);
            emptyStateDiv.appendChild(brief);

            // Insert the empty state div after the site list container
            wrapper.appendChild(emptyStateDiv);
        }
    }
}

pageReady(() => {
    SitesOperationDT.init();
    SiteList.init();
    RateLimit.init();
    RateForm.init();
});