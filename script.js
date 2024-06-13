let listItems = document.querySelectorAll('.productList li');
let selectedItems = document.querySelector('#selectedItems');
let totalElement = document.querySelector('#total');

const cashPaid = document.getElementById('cashPaid');
const amountToReturn = document.getElementById('cashToReturn');


class Product {
    constructor(id, name, category, price) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
    }
}


function calculateAmountBack() {
    if (cashPaid.value <= 0.0) {
        return;
    }

    amountToReturn.textContent = Number(cashPaid.value) - Number(totalElement.textContent);
}

if (cashPaid !== null) {
    cashPaid.addEventListener('input', (e) => {
        calculateAmountBack();
    });
}


const clearCashToReturnButton = document.getElementById('clearCashToReturn');
if (clearCashToReturnButton !== null) {
    clearCashToReturnButton.addEventListener('click', function () {
        cashPaid.value = 0;
        amountToReturn.textContent = '';
    });
}


let statusBox = document.getElementById("statusBox");


function getStorageKey() {
    let date = new Date();
    return date.toISOString().slice(0, 10);
}


let voices = speechSynthesis.getVoices();
let selectedVoice = voices[0];

// let testMessage = new SpeechSynthesisUtterance("Willkommen!");
// for (let voice of voices) {
//     testMessage.voice = voice;
//     for (let voice of voices) {
//         if (voice.name === "German") {
//             selectedVoice = voice;
//             break;
//         }
//     }
//     break;
// }
// speechSynthesis.speak(testMessage);

let reportedDaySelection = document.getElementById("reportedDaySelection");
if (reportedDaySelection !== null) {
    let isFirst = true;
    let reportingDays = [];
    for (let i = 0; i < localStorage.length; i++) {
        let reportingDay = localStorage.key(i);
        reportingDays.push(reportingDay);
    }
    reportingDays.sort((a, b) => {
        if (a > b) {
            return -1;
        } else if (a < b) {
            return 1;
        } else {
            return 0;
        }
    });
    reportingDays.forEach(function (day) {
        let option = new Option(day, day);
        reportedDaySelection.append(option);
        isFirst = false;
    });
    let changeEvent = new Event('change');
    reportedDaySelection.dispatchEvent(changeEvent);
}

let exportButton = document.getElementById("exportButton");
if (exportButton !== null) {
    exportButton.addEventListener("click", function () {
        exportJournal(reportedDaySelection.value);
    });
}


function calculateBirthDateString(years) {
    let date = new Date();
    date.setFullYear(date.getFullYear() - years);
    return date.toISOString().substring(0, 10);
}

function announceNewOrder(item) {
    // Create a new SpeechSynthesisUtterance instance
    let message = new SpeechSynthesisUtterance();

    // Set the text message
    message.text = item;

    // Set parameters if you like
    message.volume = 1; // Volume: from 0 to 1, default 1
    message.rate = 1; // Rate: from 0.1 to 10, default 1
    message.pitch = 1; // Pitch: from 0 to 2, default 1
    message.voice = selectedVoice;

    // Play the text
    window.speechSynthesis.speak(message);
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

        if (event.target.hasAttribute('data-item')) {
            selectedItem.setAttribute('data-item', event.target.getAttribute('data-item'));
        }

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

        let kitchenItems = Array.from(selectedItemsNodeList);

        // @TODO: ensure that the items are stored as Product instance, so we can conveniently use it

        for (let i = 0; i < kitchenItems.length; i++) {
            let kitchenTask = kitchenItems[i];
            if (kitchenTask.hasAttribute('data-item')) {
                announceNewOrder(kitchenTask.getAttribute('data-item'));
            }
        }

        let paymentMethod = event.target.textContent;
        let checkoutData = {
            items: items,
            timestamp: new Date().toISOString(),
            paymentMethod: paymentMethod,
            total: Number(totalElement.textContent)
        };

        let storageKey = getStorageKey();

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

function exportJournal(day) {
    // Retrieve items from local storage
    let checkoutData = localStorage.getItem(day);

    // Create a new Blob object using checkoutData
    let blob = new Blob([checkoutData], {type: 'application/json'});

    // Create a link node
    let a = document.createElement('a');

    // Set href of anchor element
    a.href = URL.createObjectURL(blob);

    // set the download attribute, this will be the name of downloaded file
    a.download = 'catering_' + day + '.json';

    // Append anchor to body
    document.body.appendChild(a);

    // Trigger click event on anchor
    a.click();

    // Cleanup DOM by removing anchor
    document.body.removeChild(a);
}

// // Event listener for Report button
// let reportButton = document.getElementById('reportButton');
// if (reportButton !== null) {
//     reportButton.addEventListener("click", function () {
//         exportJournal(getStorageKey());
//     });
// }


function fillPurchasesList(day) {
    // get the items from localStorage
    let items = localStorage.getItem(day);

    // assuming items are stored as a stringified JSON array
    // if not, you'll need to modify this
    items = JSON.parse(items);

    // iterate through items and append each one to the ul
    for (let item of items) {
        let productItem = new Product(item);
        console.log(productItem);
        let li = document.createElement('li'); // create a new list item element
        li.textContent = item; // set its text content to the current item
        purchasesList.appendChild(li); // append it to the ul
    }
}

let purchasesList = document.getElementById('purchases');
if (purchasesList !== null) {
    reportedDaySelection.addEventListener("change", function () {
        let selectedDay = this.value;
        fillPurchasesList(selectedDay);
    });
    fillPurchasesList(reportedDaySelection.value);
}

let sixteenBirthdayBox = document.getElementById('sixteen');
if (sixteenBirthdayBox !== null) {
    sixteenBirthdayBox.textContent = calculateBirthDateString(16);
}

let eighteenBirthdayBox = document.getElementById('eighteen');
if (eighteenBirthdayBox !== null) {
    eighteenBirthdayBox.textContent = calculateBirthDateString(18);
}

let dateOfBirthBox = document.getElementById('dob');
if (dateOfBirthBox !== null) {
    dateOfBirthBox.addEventListener('change', function () {
        let dob = new Date(this.value);
        let diff_ms = Date.now() - dob.getTime();
        let age_dt = new Date(diff_ms);
        let age = Math.abs(age_dt.getUTCFullYear() - 1970);
        document.getElementById('age').textContent = "Alter: " + age;
    });
}
