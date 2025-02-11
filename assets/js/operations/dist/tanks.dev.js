"use strict";

var _script = require("../script.js");

var _constant = require("../constant.js");

var _portal = require("../portal.js");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var FetchData = {
  init: function init() {
    var response;
    return regeneratorRuntime.async(function init$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.tankSuddenLoss));

          case 2:
            response = _context.sent;

            if (!(!response || Object.keys(response).length === 0)) {
              _context.next = 6;
              break;
            }

            console.error("No response data available");
            return _context.abrupt("return");

          case 6:
            return _context.abrupt("return", response);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};
var TanksOperationDT = {
  // Initialize the Site DataTable
  init: function init(filteredData) {
    var tanksOperationDT, tanks, formattedData;
    return regeneratorRuntime.async(function init$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            tanksOperationDT = document.querySelector("#tanksOperationDT");

            if (!tanksOperationDT) {
              _context2.next = 10;
              break;
            }

            if (filteredData) {
              _context2.next = 8;
              break;
            }

            _context2.next = 5;
            return regeneratorRuntime.awrap(TanksOperationDT.fetchData());

          case 5:
            tanks = _context2.sent;
            _context2.next = 9;
            break;

          case 8:
            if (filteredData.length) {
              tanksOperationDT.innerHTML = '';
              tanks = filteredData;
            } else {
              tanksOperationDT.innerHTML = '';
              TanksOperationDT.emptyState(tanksOperationDT);
            }

          case 9:
            if (tanks && tanks.length > 0) {
              formattedData = TanksOperationDT.transformData(tanks);

              _script.DataTable.init(".gts-dt-wrapper", {
                data: formattedData,
                columns: [{
                  title: "<span class=\"mat-icon material-symbols-sharp\">numbers</span>",
                  data: "id"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">local_gas_station</span> Tank",
                  data: "tank"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">verified</span> Site Name",
                  data: "site"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">waterfall_chart</span> Rate",
                  data: "rate"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">schedule</span> Timestamp",
                  data: "timestamp"
                }],
                responsive: true,
                paging: formattedData.length > 10,
                pageLength: 10
              }, [// { width: "0px", targets: 0 },  // Hide the first column (id)
                // { width: "480px", targets: 6 },
                // { width: "100px", targets: 7 },
              ], "Tanks sudden loss data");
            } else {
              console.error("No data available");
            }

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  // Fetch data from the API
  fetchData: function fetchData() {
    var response, tanks;
    return regeneratorRuntime.async(function fetchData$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(FetchData.init());

          case 3:
            response = _context3.sent;
            _context3.next = 6;
            return regeneratorRuntime.awrap(_script.DataTable.fetchData(response.tanks_table));

          case 6:
            tanks = _context3.sent;
            console.log('tanks', tanks);
            return _context3.abrupt("return", tanks);

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](0);
            console.error("Error fetching TanksOperationDT data:", _context3.t0);
            return _context3.abrupt("return", []);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 11]]);
  },
  // Transform the raw API data for the DataTable
  transformData: function transformData(data) {
    return data.map(function (tanks) {
      return {
        id: tanks.id,
        site: tanks.site,
        tank: tanks.tank,
        rate: tanks.rate,
        timestamp: tanks.timestamp
      };
    });
  },
  emptyState: function emptyState(wrapper) {
    // Check if the empty state message already exists
    if (!wrapper.querySelector(".emptyState")) {
      var emptyStateDiv = document.createElement("div");
      emptyStateDiv.className = "emptyState"; // Create the heading (h3)

      var heading = document.createElement("h3");
      heading.textContent = "No Results Found"; // Create the brief (p)

      var brief = document.createElement("p");
      brief.textContent = "We couldn't find any matches. Adjust your search and try again."; // Append heading and brief to the empty state div

      emptyStateDiv.appendChild(heading);
      emptyStateDiv.appendChild(brief); // Insert the empty state div after the site list container

      wrapper.appendChild(emptyStateDiv);
    }
  }
};
var ReconcilationTankFilter = {
  init: function init() {
    var filterWrap, tankVol, _ref, tanks, sites;

    return regeneratorRuntime.async(function init$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            filterWrap = document.querySelector('#filterWrap');
            tankVol = document.querySelector('#tankVol');

            if (!(filterWrap && tankVol)) {
              _context4.next = 11;
              break;
            }

            tankVol.innerHTML = '';
            ReconcilationTankFilter.generateTankEmptyState(tankVol);
            _context4.next = 7;
            return regeneratorRuntime.awrap(ReconcilationTankFilter.fetchData());

          case 7:
            _ref = _context4.sent;
            tanks = _ref.tanks;
            sites = _ref.sites;
            ReconcilationTankFilter.generateFilter(filterWrap, sites, tanks);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  fetchData: function fetchData() {
    var data;
    return regeneratorRuntime.async(function fetchData$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(FetchData.init());

          case 2:
            data = _context5.sent;
            return _context5.abrupt("return", {
              tanks: data.tanks_select,
              sites: data.tanks_table
            });

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  generateFilter: function generateFilter(wrap, sites, tanks) {
    var form = document.createElement('form');
    form.classList.add('datatable-filter-form', 'no-margin-form');
    var datatableFilterItems = document.createElement('div');
    datatableFilterItems.classList.add('datatable-filter-items');
    datatableFilterItems.id = 'rec-filter'; // Function to create a filter item (label + field)

    var createFilterItem = function createFilterItem(labelText, fieldId, fieldElement, className) {
      var filterItem = document.createElement('div');
      filterItem.classList.add('filter-item');
      var itemLabel = document.createElement('label');
      itemLabel.setAttribute('for', fieldId);
      itemLabel.textContent = labelText;
      var formItem = document.createElement('div');
      formItem.classList.add('form-item');
      fieldElement.id = fieldId;
      formItem.appendChild(fieldElement);
      var rateLabel = document.createElement('span');
      rateLabel.classList.add('rate-label');
      rateLabel.innerHTML = 'lts/hour';

      if (className === 'sub-label') {
        formItem.classList.add(className);
        formItem.appendChild(rateLabel);
      }

      filterItem.appendChild(itemLabel);
      filterItem.appendChild(formItem);
      return filterItem;
    }; // Create Site Dropdown


    var siteSelect = document.createElement('select');
    siteSelect.classList.add('custom-select', 'js-example-basic-single');
    siteSelect.innerHTML = "<option value=\"\">Select Site</option>";

    _toConsumableArray(new Set(sites.map(function (site) {
      return site.site;
    }))).forEach(function (site) {
      var option = document.createElement('option');
      option.value = site;
      option.textContent = site;
      siteSelect.appendChild(option);
    }); // Create Tank Dropdown (Initially Disabled)


    var tankSelect = document.createElement('select');
    tankSelect.classList.add('custom-select', 'js-example-basic-single');
    tankSelect.innerHTML = "<option value=\"\">Select Tank</option>";
    tankSelect.disabled = true; // Create Current Rate (Initially Disabled)

    var currentRate = document.createElement('input');
    currentRate.type = 'text';
    currentRate.placeholder = 'Enter Amount';
    currentRate.name = 'amount';
    currentRate.disabled = true;
    currentRate.readOnly = true; // <span class="rate-label">lts/hour</span>
    // Create New Rate (Initially Disabled)

    var updateRate = document.createElement('input');
    updateRate.type = 'text';
    updateRate.placeholder = 'New rate';
    updateRate.name = 'newRate';
    updateRate.disabled = true; // <span class="rate-label">lts/hour</span>
    // Append filter items

    datatableFilterItems.appendChild(createFilterItem('Select Site', 'siteSelect', siteSelect, 'no-label'));
    datatableFilterItems.appendChild(createFilterItem('Select Tank', 'tankSelect', tankSelect, 'no-label'));
    datatableFilterItems.appendChild(createFilterItem('Current Rate', 'currentRate', currentRate, 'sub-label'));
    datatableFilterItems.appendChild(createFilterItem('New Rate', 'newRate', updateRate, 'sub-label')); // Create Submit Button

    var btnWrapper = document.createElement('div');
    btnWrapper.classList.add('btn-wrapper');
    var submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    submitButton.classList.add('submit-button', 'btn');
    btnWrapper.appendChild(submitButton); // Append main filter container to form

    form.appendChild(datatableFilterItems);
    form.appendChild(btnWrapper); // Append form to wrap

    wrap.appendChild(form); // Event Listener: Site Selection

    $(siteSelect).on('change', function (e) {
      var tankVol = document.querySelector('#tankVol');
      tankVol.innerHTML = '';
      ReconcilationTankFilter.generateTankEmptyState(tankVol);
      var selectedSite = e.target.value;
      var filteredTanks = sites.filter(function (site) {
        return site.site === selectedSite;
      }); // Reset Tank Dropdown

      tankSelect.innerHTML = "<option value=\"\">Select Tank</option>";
      tankSelect.disabled = !filteredTanks.length; // Populate Tanks based on selected site

      _toConsumableArray(new Set(filteredTanks.map(function (site) {
        return site.tank;
      }))).forEach(function (tankId) {
        var option = document.createElement('option');
        option.value = tankId;
        option.textContent = tankId;
        tankSelect.appendChild(option);
      });
    }); // Event Listener: Tank Selection

    var selectedTank;
    $(tankSelect).on('change', function (e) {
      var tankVol = document.querySelector('#tankVol');
      tankVol.innerHTML = '';
      ReconcilationTankFilter.generateTankEmptyState(tankVol);
      selectedTank = e.target.value;
      var tankDetails = tanks.find(function (tank) {
        return tank.fusiontankid == selectedTank.replace('Tank ', '');
      });

      if (tankDetails) {
        ReconcilationTankFilter.generateTankUI(tankDetails); // currentRate.disabled = false;

        currentRate.value = tankDetails.rate;
        updateRate.disabled = false;
      }
    });
    ReconcilationTankFilter.submitForm(form, siteSelect, tankSelect, currentRate, updateRate);

    _script.Select.init();
  },
  submitForm: function submitForm(form, siteSelect, tankSelect, currentRate, updateRate) {
    // Event Listener for Form Submission
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent default form submission

      var tankVol = document.querySelector('#tankVol');
      var formData = {
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
      setTimeout(function () {
        console.log('Form Data:', formData);
        tankVol.innerHTML = '';
        ReconcilationTankFilter.generateTankEmptyState(tankVol);
        $(siteSelect).val('').trigger('change');
        $(tankSelect).val('').trigger('change');
        form.reset();
      }, 0);
    });
  },
  generateTankUI: function generateTankUI(tankDetails) {
    var tankVol = document.querySelector('#tankVol');
    tankVol.innerHTML = '';
    var capacityWrap = document.createElement('div');
    capacityWrap.classList.add('capacityWrap');
    var productsTank = document.createElement('div');
    productsTank.classList.add('products-tank');
    var liquid = document.createElement('div');
    liquid.classList.add('liquid'); // Add SVG for products

    var svgNamespace = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNamespace, 'svg');
    svg.classList.add('products');
    svg.setAttribute('viewBox', '0 0 200 100');
    var path = document.createElementNS(svgNamespace, 'path'); // path.setAttribute('fill', SharedColors[tank.product]);

    var fillColor;

    if (tankDetails.prodvol < tankDetails.capacity / 2) {
      fillColor = _constant.SharedColors.Volume.Less;
    } else if (tankDetails.prodvol > tankDetails.capacity / 2) {
      fillColor = _constant.SharedColors.Volume.More;
    } else {
      fillColor = _constant.SharedColors.Volume.Same;
    }

    path.setAttribute('fill', fillColor);
    path.setAttribute('d', "\n                M 0,0 v 100 h 200 v -100 \n                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n                c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n        ");
    svg.appendChild(path);
    liquid.appendChild(svg); // Calculate products level

    var productsLevel = tankDetails.prodvol / tankDetails.capacity * 100;
    svg.style.top = "calc(97.5% - ".concat(productsLevel, "%)"); // Add liquid container to the tank

    productsTank.appendChild(liquid); // Add indicators

    [25, 50, 75].forEach(function (value) {
      var indicator = document.createElement('div');
      indicator.classList.add('indicator');
      indicator.setAttribute('data-value', value);
      indicator.style.bottom = "".concat(value, "%");
      productsTank.appendChild(indicator);
    }); // Add label

    var label = document.createElement('div');
    label.classList.add('label'); // label.style.bottom = `${productsLevel}%`;

    var currentValue = parseFloat(tankDetails.prodvol).toFixed(2);
    label.innerHTML = "".concat(currentValue, "<span>lts</span>");
    productsTank.appendChild(label);
    capacityWrap.innerHTML = "<b>Capacity</b>: ".concat(tankDetails.capacity);
    tankVol.appendChild(capacityWrap); // Insert returned HTML

    tankVol.appendChild(productsTank); // Insert returned HTML

    var tankVolRect = liquid.getBoundingClientRect();
    var labelRect = label.getBoundingClientRect();
    var labelBottom = productsLevel; // Initial bottom position in %

    var labelHeightPercent = labelRect.height / tankVolRect.height * 100; // Convert height to %

    if (labelBottom > 100 - labelHeightPercent) {
      labelBottom = 100 - labelHeightPercent; // Prevent overflow
    }

    label.style.bottom = "".concat(labelBottom, "%");
  },
  generateTankEmptyState: function generateTankEmptyState(wrapper) {
    if (!wrapper.querySelector(".emptyState")) {
      var emptyStateDiv = document.createElement("div");
      emptyStateDiv.className = "emptyState"; // Create the heading (h3)

      var heading = document.createElement("h3");
      heading.textContent = "Select Tank"; // Create the brief (p)

      var brief = document.createElement("p");
      brief.textContent = "Select a tank to be able to visualize the volume"; // Append heading and brief to the empty state div

      emptyStateDiv.appendChild(heading);
      emptyStateDiv.appendChild(brief); // Insert the empty state div after the site list container

      wrapper.appendChild(emptyStateDiv);
    }
  }
};
(0, _script.pageReady)(function () {
  TanksOperationDT.init();
  ReconcilationTankFilter.init();
});