const API_URL = "https://script.google.com/macros/s/AKfycbw2wpsWD4rFUFZo-exTybDR4yK0J-V4fUZfnfCIh5iGvwf1zA4Dsa1c_478Wt23ip1T/exec";

let dealers = [];

const loadingBox = document.getElementById("loadingBox");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const dealerTable = document.getElementById("dealerTable");

// Table hide
dealerTable.style.display = "none";

// Progress Start
let progress = 0;

const loading = setInterval(() => {

    if (progress < 95) {

        progress++;

        progressBar.style.width = progress + "%";
        progressText.innerHTML = "Loading... " + progress + "%";

    }

}, 30);


// Fetch Data
fetch(API_URL)
.then(res => res.json())
.then(data => {

    dealers = data;

    showData(data);


document.getElementById("totalDealer").innerHTML =
"Total Dealers : " + dealers.length;

document.getElementById("lastUpdate").innerHTML =
"Last Updated : " + new Date().toLocaleString("en-IN");





    clearInterval(loading);

    progress = 100;
    progressBar.style.width = "100%";
    progressText.innerHTML = "Loading... 100%";

    setTimeout(() => {

        loadingBox.style.display = "none";
        dealerTable.style.display = "table";

    }, 500);

})
.catch(err => {

    clearInterval(loading);

    progressText.innerHTML = "❌ Data Load Failed";

    console.error(err);

});

function showData(list) {

    const body = document.getElementById("tableBody");

    body.innerHTML = "";

    list.forEach(item => {

        body.innerHTML += `
        <tr>
            <td>${item.code}</td>
            <td>${item.name}</td>
        </tr>
        `;

    });

}

document.getElementById("search").addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const result = dealers.filter(d =>
        d.code.toLowerCase().includes(value) ||
        d.name.toLowerCase().includes(value)
    );

    showData(result);

});



setInterval(() => {

    fetch(API_URL)
    .then(res => res.json())
    .then(data => {

        dealers = data;

        showData(data);

        document.getElementById("totalDealer").innerHTML =
        "Total Dealers : " + dealers.length;

        document.getElementById("lastUpdate").innerHTML =
        "Last Updated : " + new Date().toLocaleString("en-IN");

    });

}, 30000);
