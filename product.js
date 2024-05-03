// Product class
class Product {
    constructor(id, name, category, price) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
    }
}

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
let db;
let request = window.indexedDB.open("ProductDB", 1);

request.onerror = function (event) {
    console.log("error: ", event.target.error);
};

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: " + db);
    loadProducts();
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    let objectStore = db.createObjectStore("products", {keyPath: "id", autoIncrement: true});

    objectStore.createIndex("name", "name", {unique: false});
    objectStore.createIndex("category", "category", {unique: false});
};