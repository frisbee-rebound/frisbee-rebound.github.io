let listItems = document.querySelectorAll('.productList li');
let selectedItems = document.querySelector('#selectedItems');
let totalElement = document.querySelector('#total');

const cashPaid = document.getElementById('cashPaid');
const amountToReturn = document.getElementById('cashToReturn');

function calculateAmountBack() {
    if (cashPaid.value <= 0.0) {
        return;
    }

    let difference = Number(cashPaid.value) - Number(totalElement.textContent);
    amountToReturn.textContent = difference;
}

cashPaid.addEventListener('input', (e) => {
    calculateAmountBack();
});

const clearCashToReturnButton = document.getElementById('clearCashToReturn');
clearCashToReturnButton.addEventListener('click', function () {
    cashPaid.value = 0;
    amountToReturn.textContent = '';
});

let statusBox = document.getElementById("statusBox");

let date = new Date();
let storageKey = date.toISOString().slice(0, 10);

function calculateBirthDateString(years) {
    let date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return date.toISOString().substring(0, 10);
}


let clearButton = document.getElementById('clearButton');
if (clearButton !== null) {
    clearButton.addEventListener("click", function () {
        let selectedItemsNodeList = document.querySelectorAll('#selectedItems li');
        selectedItemsNodeList.forEach(item => item.remove());
        statusBox.textContent = "";
        totalElement.textContent = "0";
        cashPaid.value = 0;
        amountToReturn.textContent = "0";
    });
}

for (let i = 0; i < listItems.length; i++) {
    listItems[i].addEventListener('click', function (event) {
        let price = Number(event.target.getAttribute('data-price'));

        let selectedItem = document.createElement('li');
        selectedItem.textContent = event.target.textContent;
        selectedItem.setAttribute('data-price', price);
        selectedItem.className = "remove";

        selectedItem.addEventListener('click', function (event) {
            let price = Number(event.target.getAttribute('data-price'));
            let currentTotal = Number(totalElement.textContent);
            totalElement.textContent = currentTotal - price;

            selectedItems.removeChild(event.target);
        });

        selectedItems.appendChild(selectedItem);

        let currentTotal = Number(totalElement.textContent);
        totalElement.textContent = currentTotal + price;
    });
}

let checkoutButtons = document.querySelectorAll(".checkoutButton");
checkoutButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {

        let selectedItemsNodeList = document.querySelectorAll('#selectedItems li');

        // Store the updated array back to localStorage
        let items = Array.from(selectedItemsNodeList).map(item => item.textContent);
        let paymentMethod = event.target.textContent;
        let checkoutData = {
            items: items,
            timestamp: new Date().toISOString(),
            paymentMethod: paymentMethod,
            total: Number(totalElement.textContent)
        };

        let checkoutJournal = JSON.parse(localStorage.getItem(storageKey));
        if (checkoutJournal === null) {
            checkoutJournal = [];
        }
        checkoutJournal.push(checkoutData);

        localStorage.setItem(storageKey, JSON.stringify(checkoutJournal));

        if (this.hasAttribute('data-paid')) {
            cashPaid.value = Number(this.getAttribute('data-paid'));
            calculateAmountBack();
        } else {
            cashPaid.value = 0.0;
            amountToReturn.textContent = "0";
        }

        // Clear selected items
        selectedItemsNodeList.forEach(item => item.remove());
        totalElement.textContent = '0';

        statusBox.textContent = "Kauf ist registriert";
    });
});

// Event listener for Report button
let reportButton = document.getElementById('reportButton');
if (reportButton !== null) {
    reportButton.addEventListener("click", function () {
        // Retrieve items from local storage
        let checkoutData = localStorage.getItem(storageKey);

        // Create a new Blob object using checkoutData
        let blob = new Blob([checkoutData], {type: 'application/json'});

        // Create a link node
        let a = document.createElement('a');

        // Create object URL
        let url = URL.createObjectURL(blob);

        // Set href of anchor element
        a.href = url;

        // set the download attribute, this will be the name of downloaded file
        a.download = 'catering_' + storageKey + '.json';

        // Append anchor to body
        document.body.appendChild(a);

        // Trigger click event on anchor
        a.click();

        // Cleanup DOM by removing anchor
        document.body.removeChild(a);
    });
}


let dateOfBirthBox = document.getElementById('dob');
if (dateOfBirthBox !== null) {
    dateOfBirthBox.addEventListener('change', function () {
        var dob = new Date(this.value);
        var diff_ms = Date.now() - dob.getTime();
        var age_dt = new Date(diff_ms);

        var age = Math.abs(age_dt.getUTCFullYear() - 1970);

        document.getElementById('age').textContent = "Alter: " + age;
    });

    document.getElementById('sixteen').textContent = calculateBirthDateString(16);
    document.getElementById('eighteen').textContent = calculateBirthDateString(18);
}
