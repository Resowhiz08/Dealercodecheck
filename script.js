const API_URL = "https://script.google.com/macros/s/AKfycbw2wpsWD4rFUFZo-exTybDR4yK0J-V4fUZfnfCIh5iGvwf1zA4Dsa1c_478Wt23ip1T/exec";

let dealers = [];
let lastUpdate = "";

const loadingBox = document.getElementById("loadingBox");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const dealerTable = document.getElementById("dealerTable");

// Hide Table
dealerTable.style.display = "none";

// Progress Animation
let progress = 0;

const loading = setInterval(() => {

    if (progress < 95) {

        progress++;

        progressBar.style.width = progress + "%";
        progressText.innerHTML = "Loading... " + progress + "%";

    }

}, 30);

// ================= First Load =================

fetch(API_URL)
.then(res => res.json())
.then(data => {

    dealers = data.dealers;
    lastUpdate = data.lastUpdate;

    showData(dealers);

    document.getElementById("totalDealer").innerHTML =
    "Total Dealers : " + dealers.length;

    document.getElementById("lastUpdate").innerHTML =
    "Last Updated : " + data.lastUpdate;

    clearInterval(loading);

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

// ================= Show Data =================


function showData(list){

    const body = document.getElementById("tableBody");

    if(list.length === 0){

        body.innerHTML = `
        <tr>
            <td colspan="2" style="padding:40px;font-size:18px;color:#666;">
                ❌ No Dealer Found
            </td>
        </tr>
        `;

        return;
    }

    body.innerHTML = list.map(item => `
        <tr>
            <td>${item.code}</td>
            <td>${item.name}</td>
        </tr>
    `).join("");

}

// ================= Search =================

document.getElementById("search").addEventListener("input", function(){

    const value = this.value.toLowerCase();

    const result = dealers.filter(d =>

        d.code.toLowerCase().includes(value) ||

        d.name.toLowerCase().includes(value)

    );

    showData(result);

});

// ================= Background Check =================

setInterval(() => {

    fetch(API_URL)
    .then(res => res.json())
    .then(data => {

        // Agar Google Sheet update nahi hui
        if(data.lastUpdate === lastUpdate){

            return;

        }

        // Update hua hai
        lastUpdate = data.lastUpdate;

        dealers = data.dealers;

        // Agar user search nahi kar raha to full data dikhao
        const search = document.getElementById("search").value.trim();

        if(search === ""){

            showData(dealers);

        }

        document.getElementById("totalDealer").innerHTML =
        "Total Dealers : " + dealers.length;

        document.getElementById("lastUpdate").innerHTML =
        "Last Updated : " + data.lastUpdate;

        console.log("Dealer Data Updated");

    })
    .catch(err => console.error(err));

}, 30000);
