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
            return regeneratorRuntime.awrap((0, _constant.fetchData)(_constant.API_PATHS.reconcilationData));

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
var ReconcilationDT = {
  // Initialize the Site DataTable
  init: function init(filteredData) {
    var reconcilationDT, data, formattedData;
    return regeneratorRuntime.async(function init$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            reconcilationDT = document.querySelector("#reconcilationDT");

            if (!reconcilationDT) {
              _context2.next = 10;
              break;
            }

            if (filteredData) {
              _context2.next = 8;
              break;
            }

            _context2.next = 5;
            return regeneratorRuntime.awrap(ReconcilationDT.fetchData());

          case 5:
            data = _context2.sent;
            _context2.next = 9;
            break;

          case 8:
            if (filteredData.length) {
              reconcilationDT.innerHTML = '';
              data = filteredData;
            } else {
              reconcilationDT.innerHTML = '';
              ReconcilationDT.emptyState(reconcilationDT);
            }

          case 9:
            if (data && data.length > 0) {
              formattedData = ReconcilationDT.transformData(data);

              _script.DataTable.init(".gts-dt-wrapper", {
                data: formattedData,
                columns: [{
                  title: "<span class=\"mat-icon material-symbols-sharp\">numbers</span>",
                  data: "id"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">verified</span> Site Name",
                  data: "name"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">oil_barrel</span> Tank",
                  data: "fusiontankid"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">valve</span> Capacity",
                  data: "capacity"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">donut_small</span> Product Vol.",
                  data: "prodvol"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">legend_toggle</span> Amount",
                  data: "amount"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">calendar_month</span> Es. Date",
                  data: "estimatedtime"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">schedule</span> Timestamp",
                  data: "timestamp"
                }, {
                  title: "<span class=\"mat-icon material-symbols-sharp\">network_check</span> Status",
                  data: "status",
                  render: function render(data, type, row) {
                    var statusClass = data === "Opened" ? "opened" : "Closed";
                    return "<div class=\"status-dt\"><span class=\"".concat(statusClass, "\">").concat(data, "</span></div>");
                  }
                }],
                responsive: true,
                paging: formattedData.length > 10,
                pageLength: 10,
                fixedHeader: {
                  header: false,
                  footer: false
                }
              }, [{
                width: "0px",
                targets: 0
              }], "Delivery Reconciliation Data");
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
  parseFormattedNumber: function parseFormattedNumber(numberStr) {
    var formattedNumber = numberStr.toString().replace(/,/g, '').trim();
    var parsedNumber = parseFloat(formattedNumber);

    if (isNaN(parsedNumber)) {
      console.error('Invalid number format:', numberStr);
      return '0'; // Return a string so it can be displayed
    } // Format the number with commas


    return parsedNumber.toLocaleString();
  },
  // Fetch data from the API
  fetchData: function fetchData() {
    var response, data;
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
            return regeneratorRuntime.awrap(_script.DataTable.fetchData(response.tanks_recon_data));

          case 6:
            data = _context3.sent;
            return _context3.abrupt("return", data);

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](0);
            console.error("Error fetching SitesReports data:", _context3.t0);
            return _context3.abrupt("return", []);

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },
  // Transform the raw API data for the DataTable
  transformData: function transformData(data) {
    return data.map(function (site, index) {
      return {
        id: index++,
        name: site.name,
        fusiontankid: site.fusiontankid,
        capacity: site.capacity,
        prodvol: site.prodvol,
        amount: site.amount,
        estimatedtime: site.estimatedtime,
        timestamp: site.timestamp,
        status: site.status === "opened" ? "Opened" : "Closed"
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
              tanks: data.tanks_data,
              sites: data.tanks_recon_data
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

    var createFilterItem = function createFilterItem(labelText, fieldId, fieldElement) {
      var filterItem = document.createElement('div');
      filterItem.classList.add('filter-item');
      var itemLabel = document.createElement('label');
      itemLabel.setAttribute('for', fieldId);
      itemLabel.textContent = labelText;
      var formItem = document.createElement('div');
      formItem.classList.add('form-item');
      fieldElement.id = fieldId;
      formItem.appendChild(fieldElement);
      filterItem.appendChild(itemLabel);
      filterItem.appendChild(formItem);
      return filterItem;
    }; // Create Site Dropdown


    var siteSelect = document.createElement('select');
    siteSelect.classList.add('custom-select', 'js-example-basic-single');
    siteSelect.innerHTML = "<option value=\"\">Select Site</option>";

    _toConsumableArray(new Set(sites.map(function (site) {
      return site.name;
    }))).forEach(function (site) {
      var option = document.createElement('option');
      option.value = site;
      option.textContent = site;
      siteSelect.appendChild(option);
    }); // Create Tank Dropdown (Initially Disabled)


    var tankSelect = document.createElement('select');
    tankSelect.classList.add('custom-select', 'js-example-basic-single');
    tankSelect.innerHTML = "<option value=\"\">Select Tank</option>";
    tankSelect.disabled = true; // Create Input for Amount (Initially Disabled)

    var amountInput = document.createElement('input');
    amountInput.type = 'text';
    amountInput.placeholder = 'Enter Amount';
    amountInput.name = 'amount';
    amountInput.disabled = true; // Create Fill Button

    var fillButton = document.createElement('button');
    fillButton.type = 'button'; // Prevent form submission on click

    fillButton.textContent = 'Fill';
    fillButton.disabled = true;
    fillButton.classList.add('fill-button', 'btn'); // Create a container div for Amount Input and Fill Button

    var amountContainer = document.createElement('div');
    amountContainer.classList.add('amount-container');
    amountContainer.appendChild(amountInput);
    amountContainer.appendChild(fillButton); // Create Date Picker (Initially Disabled)

    var dateInput = document.createElement('input');
    var today = new Date();
    dateInput.type = 'text';
    dateInput.placeholder = 'Pick a delivery date';
    dateInput.name = 'filterDate';
    dateInput.classList.add('data-picker-wrapper');
    dateInput.disabled = true;
    dateInput.setAttribute('minDate', 'today'); // Append filter items

    datatableFilterItems.appendChild(createFilterItem('Select Site', 'siteSelect', siteSelect));
    datatableFilterItems.appendChild(createFilterItem('Select Tank', 'tankSelect', tankSelect));
    datatableFilterItems.appendChild(createFilterItem('Enter Amount', 'amountInput', amountContainer));
    datatableFilterItems.appendChild(createFilterItem('Select Date', 'filterDateFrom-1', dateInput)); // Create Submit Button

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
        return site.name === selectedSite;
      }); // Reset Tank Dropdown

      tankSelect.innerHTML = "<option value=\"\">Select Tank</option>";
      tankSelect.disabled = !filteredTanks.length; // Populate Tanks based on selected site

      _toConsumableArray(new Set(filteredTanks.map(function (site) {
        return site.fusiontankid;
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
        ReconcilationTankFilter.generateTankUI(tankDetails);
        amountInput.disabled = false;
        fillButton.disabled = false;
        dateInput.disabled = false;
      }
    }); // Event Listener: Amount Input

    $(amountInput).on('input', function () {
      var addedAmount = parseFloat(amountInput.value) || 0;
      ReconcilationTankFilter.updateTank(tanks, selectedTank, addedAmount);
    }); // Event Listener for Fill Button

    fillButton.addEventListener('click', function () {
      var tankDetails = tanks.find(function (tank) {
        return tank.fusiontankid == selectedTank.replace('Tank ', '');
      });

      if (tankDetails) {
        amountInput.value = parseFloat(tankDetails.capacity) - parseFloat(tankDetails.prodvol);
        ReconcilationTankFilter.updateTank(tanks, selectedTank, amountInput.value);
      }
    });
    ReconcilationTankFilter.submitForm(form, siteSelect, tankSelect, amountInput, dateInput);
    var options = {
      minDate: 'today'
    };

    _script.DatePicker.init(options);

    _script.Select.init();
  },
  submitForm: function submitForm(form, siteSelect, tankSelect, amountInput, dateInput) {
    // Event Listener for Form Submission
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent default form submission

      var tankVol = document.querySelector('#tankVol');
      var formData = {
        site: siteSelect.value,
        tank: tankSelect.value,
        amount: amountInput.value,
        date: dateInput.value
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
  updateTank: function updateTank(tanks, selectedTank, addedAmount) {
    var tankVol = document.querySelector('#tankVol'); // const currentTank = tanks.find(tank => tank.fusiontankid == tankSelect.value);

    var currentTank = tanks.find(function (tank) {
      return tank.fusiontankid == selectedTank.replace('Tank ', '');
    });
    if (!currentTank) return;
    console.log('addedAmount', addedAmount);
    var newTotal = parseFloat(currentTank.prodvol) + parseFloat(addedAmount);

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
        "onShown": function onShown() {
          $('.toast').css({
            transform: 'translateX(700px)',
            // Initially off-screen to the right
            opacity: 0
          }).animate({
            opacity: 1
          }, {
            duration: 200,
            step: function step(now) {
              $(this).css('transform', "translateX(".concat(700 - now * 700, "px)"));
            }
          });
        },
        "onHidden": function onHidden() {
          $('.toast').animate({
            opacity: 0
          }, {
            duration: 200,
            step: function step(now) {
              $(this).css('transform', "translateX(".concat(now * 700, "px)"));
            }
          });
        }
      });
      return false;
    } // Update label dynamically


    var label = tankVol.querySelector('.label');
    label.innerHTML = "".concat(newTotal.toFixed(2), "<span>lts</span>"); // Add SVG overlay for liquid representation

    var liquid = tankVol.querySelector('.liquid');
    var svgNamespace = "http://www.w3.org/2000/svg";
    var svg = tankVol.querySelector('.products-svg');

    if (!svg) {
      svg = document.createElementNS(svgNamespace, 'svg');
      svg.classList.add('products-svg');
      svg.setAttribute('viewBox', '0 0 200 100');
      liquid.appendChild(svg);
    }

    var path = svg.querySelector('path');

    if (!path) {
      path = document.createElementNS(svgNamespace, 'path');
      svg.appendChild(path);
    }

    var productsLevel = newTotal / currentTank.capacity * 100;
    svg.style.top = "calc(97.5% - ".concat(productsLevel, "%)");
    var tankVolRect = liquid.getBoundingClientRect();
    var labelRect = label.getBoundingClientRect();
    var labelBottom = productsLevel; // Initial bottom position in %

    var labelHeightPercent = labelRect.height / tankVolRect.height * 100; // Convert height to %

    if (labelBottom > 100 - labelHeightPercent) {
      labelBottom = 100 - labelHeightPercent; // Prevent overflow
    }

    label.style.bottom = "".concat(labelBottom, "%");
    path.setAttribute('fill', '#cccccc');
    path.setAttribute('fill-opacity', '0.2'); // Value between 0 (fully transparent) and 1 (fully opaque)

    path.setAttribute('d', "\n            M 0,0 v 100 h 200 v -100 \n            c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n            c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n            c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n            c -10,0 -15,5 -25,5 c -10,0 -15,-5 -25,-5\n        ");
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
  ReconcilationDT.init();
  ReconcilationTankFilter.init();
});