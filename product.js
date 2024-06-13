// Product class
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
let db;

let db_request = window.indexedDB.open("ProductDB", 1);

db_request.onerror = function (event) {
    console.log("error: ", event.target.error);
};

db_request.onsuccess = function (event) {
    db = db_request.result;
    console.log("success: " + db);
    loadProducts();
};

db_request.onupgradeneeded = function (event) {
    db = event.target.result;
    let objectStore = db.createObjectStore("products", {keyPath: "id", autoIncrement: true});

    objectStore.createIndex("name", "name", {unique: false});
    objectStore.createIndex("category", "category", {unique: false});
};