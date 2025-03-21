// const { default: readXlsxFile } = require("read-excel-file");

let baseUrl = null;
let tableVisibility = null;

let contentVisibility = null;
let enrollVisibility = null;
let entryDate = null
// import readXlsxFile from 'read-excel-file'
// import * as XLSX from 'xlsx';

document.addEventListener('DOMContentLoaded', event => {
    // baseUrl = 'http://localhost:3000';
    baseUrl = 'https://trackbackend-3c7y.onrender.com'

    if (sessionStorage.getItem('AuthenticationState') === null) {
        window.open("login.html", "_self");
    }
    //Is their authentication token still valid?
    else if (Date.now > new Date(sessionStorage.getItem('AuthenticationExpires'))) {
        window.open("login.html", "_self");
    }
    tableVisibility = document.getElementById("tbl-body");
    contentVisibility = document.getElementById("introContent");
    var greeting = document.querySelector('.greeting');
    var h1Tag = document.createElement('H1');
    h1Tag.innerHTML = "Welcome, " + "User";
    greeting.prepend(h1Tag);
    //BACKUO
    // document.getElementById("menu").addEventListener("click", openNav);
    // document.getElementById("closeNav").addEventListener("click", closeNav);
    // document.getElementById("openDash").addEventListener("click", openDashboard);
    // document.getElementById("search").addEventListener("click", searchTable);
    // document.getElementById("tbl-frm-body").addEventListener("click", handleTableClick);
    document.getElementById("enrollBtn").addEventListener('click', addData);
    enrollVisibility = document.getElementById("enrollBtn");
    document.getElementById("menu").addEventListener("click", openNav);
    document.getElementById("closeNav").addEventListener("click", closeNav);
    document.getElementById("openDash").addEventListener("click", openDashboard);
    document.getElementById("signout").addEventListener("click", logout);
    document.getElementById("search").addEventListener("click", searchTable);
    document.getElementById("tbl-frm-body").addEventListener("click", handleTableClick);
    // document.getElementById("prevPage").addEventListener("click", prevPage);
    // document.getElementById("nextPage").addEventListener("click", nextPage);
});
// async function readXlsxFile(event) {
//     const input = event.target.files[0];
//     var xlsx = new XLSX();
//     if (input) {
//         let workbook = xlsx.readXlsxFile(
//             (await((await fetch(input)).arrayBuffer())),
//             console.log(workbook)
//         )
//     }
// }
async function pullRecords(event) {
    const inputFile = event.target.files[0];
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: inputFile })
    };
    const res = await fetch(baseUrl + '/dashboard/searchTable', options);
    if (!res.ok) {
        const emptyRecords = [];
        generateRow(emptyRecords);
        tableVisibility.style.display = "block";
        throw new Error(`HTTP error! status: ${res.status}`);
    }
}

function logout(event) {
    event.preventDefault();
    sessionStorage.removeItem('AuthenticationState');
    sessionStorage.removeItem('AuthenticationExpires');
    window.open("login.html", "_self");
    alert('You have been logged out');
}

function openNav(event) {
    var isOpen = false
    if (!isOpen) {
        event.preventDefault();
        document.getElementById("sidebar").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        document.getElementById("footer").style.marginLeft = "250px";
        isOpen = true;
    }
    else {
        isOpen = false;
        closeNav(event);
    }

}

function closeNav(event) {
    event.preventDefault();
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("footer").style.marginLeft = "0";
}

function openDashboard(event) {
    enrollVisibility = document.getElementById("enrollBtn");
    event.preventDefault();
    if (tableVisibility.style.display === "block") {
        contentVisibility.style.display = "block";
        tableVisibility.style.display = "none";
        enrollVisibility.style.display = "none";
    } else {
        contentVisibility.style.display = "none";
        loadtable();
        enrollVisibility.style.display = "block";
        tableVisibility.style.display = "block";
    }
}

async function searchTable(event) {
    event.preventDefault();
    contentVisibility.style.display = "none";
    enrollVisibility.style.display = "block";
    var search = document.getElementById("searchVal").value;
    if (search === "") {
        loadtable();
        tableVisibility.style.display = "block";
        return;
    }
    else {
        console.log('Search value:', search); // Debugging log
        try {

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ businessName: search })
            };
            const res = await fetch(baseUrl + '/dashboard/searchTable', options);
            if (!res.ok) {
                const emptyRecords = [];
                generateRow(emptyRecords);
                tableVisibility.style.display = "block";
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const records = await res.json();
            console.log('Search results:', records); // Debugging log
            generateRow(records);
            tableVisibility.style.display = "block";
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

function displayTable(records, page) {
    generateHeader();
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedRecords = records.slice(start, end);

    let row = '';
    if (paginatedRecords.length > 0) {
        paginatedRecords.forEach(function (item) {
            row += `<tr>
                <td>${item.businessName}</td>
                <td>${item.businessLocation}</td>
                <td>${item.owner}</td>
                <td>${item.code}</td> 
                <td>${item.year}</td>
                <td>${item.entryDate}</td>
                <td><button class="edit-row-button">Edit</button></td>
                </tr>`;
        });
    } else {
        row += `<tr>
            <td colspan="7">No data available</td>
        </tr>`;
    }
    var dataTable = document.getElementById("tbl-frm-body");
    dataTable.innerHTML = row;

    // document.getElementById("pageInfo").innerText = `Page ${page} of ${Math.ceil(records.length / rowsPerPage)}`;
    // document.getElementById("prevPage").disabled = page === 1;
    // document.getElementById("nextPage").disabled = end >= records.length;
}


function generateRow(record) {
    generateHeader();
    let isPopulated = true;
    let row = '';
    if (record.length > 0) {
        record.forEach(function (item) {
            var stringdate = item.entryDate.toString();
            row += `<tr data-id="${item._id}">
                <td>${item.businessName}</td>
                <td>${item.businessLocation}</td>
                <td>${item.owner}</td>
                <td>${item.code}</td> 
                <td>${item.year}</td>
                <td>${item.storage}</td>
                <td>${formatDateToMMDDYYYYHHMMss(stringdate)}</td>
                <td>
                <button class="edit-row-button">Edit</button>
                <button class="delete-row-button">Delete</button>
                </td>
                </tr>`;
        });
    } else {
        isPopulated = false;
        row += `<tr>
            <td colspan="7">No data available</td>
        </tr>`;
    }
    var dataTable = document.getElementById("tbl-frm-body");
    dataTable.innerHTML = row;

    // document.getElementById("pageInfo").innerText = `Page ${page} of ${Math.ceil(records.length / rowsPerPage)}`;
    // document.getElementById("prevPage").disabled = page === 1;
    // document.getElementById("nextPage").disabled = end >= records.length;
}

function newrow2(record) {
    var stringdate = record.entryDate.toString();
    row = `<tr data-id="${record._id}">
        <td>${record.businessName}</td>
        <td>${record.businessLocation}</td>
        <td>${record.owner}</td>
        <td>${record.code}</td> 
        <td>${record.year}</td>
        <td>${record.storage}</td>
        <td>${formatDateToMMDDYYYYHHMMss(stringdate)}</td>
        <td>
        <button class="edit-row-button">Edit</button>
        <button class="delete-row-button">Delete</button>
        </td>
        </tr>`;
    return row;
}

function formatDateToMMDDYYYYHHMMss(dateString) {
    const date = new Date(dateString);
    const padZero = (num) => (num < 10 ? '0' + num : num);

    const month = padZero(date.getMonth() + 1); // Months are zero-based
    const day = padZero(date.getDate());
    const year = date.getFullYear();
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

function formatDateToMMDDYYYYHHMMSS(dateString) {
    const date = new Date(dateString);

    const pad = (num) => num.toString().padStart(2, '0');

    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const yyyy = date.getFullYear();
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    const ss = pad(date.getSeconds());

    return `${mm}/${dd}/${yyyy} ${hh}:${min}:${ss}`;
}

function generateHeader() {
    var headerOld = `<tr class="sticky-row-1">
        // <td colspan="8">
        //     <button id="Enroll" class="newRow">Enroll Business</button>
        // </td>
    </tr>
    <tr class="sticky-row-2">
        <th>Business Name</th>
        <th>Business Location</th>
        <th>Owner</th>
        <th>Code</th>
        <th>Year</th>
        <th>storage</th>
        <th>Entry Date</th>
        <th>Action</th>
    </tr>`;

    var header = `<tr class="sticky-row-1" id="tbl-frm-head" >
    <thead>
    <tr>
    <tr class="sticky-row-2">
    <th>Business Name</th>
    <th>Business Location</th>
    <th>Owner</th>
    <th>Code</th>
    <th>Year</th>
    <th>storage</th>
    <th>Entry Date</th>
    <th>Action</th>
    </tr>
    </thead>`;

    var tableHead = document.getElementById("tbl-frm-head");
    tableHead.innerHTML = header;
    // const addButton = tableHead.querySelector('.newRow');
    // addButton.addEventListener('click', addData);
}

function handleTableClick(event) {
    if (event.target.classList.contains('edit-row-button')) {
        handleEdit(event);
    } else if (event.target.classList.contains('save-edit-button')) {
        handleSave(event);
    } else if (event.target.classList.contains('cancel-edit-button')) {
        handleCancel(event);
    } else if (event.target.classList.contains('delete-row-button')) {
        handleDelete(event);
    }
}

function handleEdit(event) {
    const row = event.target.closest('tr');
    const businessName = row.children[0].innerText;
    businessName.readonly = true;
    const businessLocation = row.children[1].innerText;
    const owner = row.children[2].innerText;
    const code = row.children[3].innerText;
    const year = row.children[4].innerText;
    const storage = row.children[5].innerText;
    entryDate = row.children[6].innerText;

    row.innerHTML = `
        <td>${businessName}</td>
        <td><input class="location" type="text" value="${businessLocation}" required></td>
        <td><input class="owner" type="text" value="${owner}" required></td>
        <td>${code}</td>
        <td><input class="year" type="date" value="${year}" required></td>
        <td><input class="storage" type="text" value="${storage}" required></td>
        <td>${entryDate}</td>
        <td>
            <button class="save-edit-button">Save</button>
            <button class="cancel-edit-button">Cancel</button>
        </td>
    `;
}

async function handleSave(event) {
    event.preventDefault();
    const row = event.target.closest('tr');
    // const businessId = row.getattribute('_id');
    const _id = row.getAttribute('data-id');

    // const businessName = row.querySelector('.name').value;
    // const businessLocation = row.querySelector('.location').value;
    // const owner = row.querySelector('.owner').value;
    // const code = row.querySelector('.code').value;
    // const year = row.querySelector('.year').value;

    const businessName = row.children[0].innerText.toString();
    const businessLocation = row.querySelector('.location').value;
    const owner = row.querySelector('.owner').value;
    const code = row.children[3].innerText.toString(); 
    const year = row.querySelector('.year').value;
    const storage = row.querySelector('.storage').value;

    // const entryDate = row.children[5].innerText;
    // const updatedData = {
    //     businessName: newBusinessName,
    //     businessLocation: newBusinessLocation,
    //     owner: newOwner,
    //     code:newCode,
    //     year: newYear
    // };

    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id,
                businessLocation,
                owner,
                year,
                storage
            })
        };
        const res = await fetch(baseUrl + '/dashboard/updateBusiness', options);
        getResults(res);
        if (res.status == "400" || res.status == "405" || res.status == "406") {
            return;
        }
        const options2 = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ businessName: businessName, code: code })
        };
        const response = await fetch(baseUrl + '/dashboard/getData', options2);
        const records = await response.json();
        // generateRow(records);
        row.innerHTML = newrow2(records);
    }
    catch (error) {
        console.error('Error:', error);
    }
}
function handleCancel(event) {
    const row = event.target.closest('tr');
    const businessName = row.children[0].innerText;
    const businessLocation = row.querySelector('input[class="location"]').value;
    const owner = row.querySelector('input[class="owner"]').value;
    const code = row.children[3].innerText;
    const year = row.querySelector('input[class="year"]').value;
    const storage = row.querySelector('input[class="storage"]').value;
    enrolledDate = row.children[6].innerText;

    row.innerHTML = `
        <td>${businessName}</td>
        <td>${businessLocation}</td>
        <td>${owner}</td>
        <td>${code}</td>
        <td>${year}</td>
        <td>${storage}</td>
        <td>${enrolledDate}</td>        
        <td><button class="edit-row-button">Edit</button>
        <button class="delete-row-button">Delete</button>
        </td>
    `;
}

function addData() {
    event.preventDefault()
    const tableBody = document.querySelector('tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" placeholder="Business Name" required></td>
        <td><input type="text" placeholder="Business Location" required></td>
        <td><input type="text" placeholder="Owner" required></td>
        <td><input type="text" placeholder="Code" required></td>
        <td><input type="date" placeholder="Year" required></td>
        <td><input type="text" placeholder="Storage" required></td>
        <td></td>
        <td>
            <button class="save-row-button">Save</button>
            <button class="cancel-row-button">Cancel</button>
        </td>
    `;
    tableBody.appendChild(newRow);

    const saveButton = newRow.querySelector('.save-row-button');
    const cancelButton = newRow.querySelector('.cancel-row-button');

    saveButton.addEventListener('click', async () => {
        const tableBody = document.querySelector('tbody');
        event.preventDefault()
        const row = event.target.closest('tr');
        const businessName = newRow.querySelector('input[placeholder="Business Name"]').value;
        const businessLocation = newRow.querySelector('input[placeholder="Business Location"]').value;
        const owner = newRow.querySelector('input[placeholder="Owner"]').value;
        const code = newRow.querySelector('input[placeholder="Code"]').value;
        const year = newRow.querySelector('input[placeholder="Year"]').value;
        const storage = newRow.querySelector('input[placeholder="Storage"]').value;
        // const enrolledDate = new Date().toString();
        const enrolledDate = formatDateToMMDDYYYYHHMMss(new Date().toString());

        if (!businessName || !businessLocation || !owner || !code || !year || !storage) {
            alert('All fields are required. Please fill in all the fields.');
            return;
        }

        const res = await fetch(baseUrl + '/dashboard/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                businessName,
                businessLocation,
                owner,
                code,
                year,
                storage
            })
        });
        getResults(res);
        if (res.status == "400" || res.status == "405" || res.status == "406") {
            tableBody.removeChild(newRow);
            return;
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ businessName: businessName, code: code })
        };
        const response = await fetch(baseUrl + '/dashboard/getData', options);

        const records = await response.json();
        // generateRow(records);
        row.innerHTML = newrow2(records);
        // <tr>
        // tableBody.appendChild(row);
    });

    cancelButton.addEventListener('click', () => {
        tableBody.removeChild(newRow);
    });
}

async function loadtable() {
    const data = [];
    try {
        const response = await fetch(baseUrl + '/dashBoard/startTable');
        const records = await response.json();
        generateRow(records);
    } catch (err) {
        console.log(err);
    }
    console.log(data);
}

async function handleDelete(event) {
    event.preventDefault();
    if (!confirm('Are you sure?')) {
        return;
    }
    const row = event.target.closest('tr');
    const _id = row.getAttribute('data-id');
    const businessName = row.children[0].innerText;
    const code = row.children[3].innerText;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id, businessName, code })
    };
    const res = await fetch(baseUrl + '/dashboard/delete', options)
    if (getResults(res)) {
        row.remove(); // Remove the row from the table   
    }
    // const result = await res.json();
    // if (result.success) {
    //     // row.remove();
    //     alert('Record deleted successfully');
    // } else {
    //     alert('Failed to delete record');
    // }
}
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayTable(records, currentPage);
    }
}

function nextPage() {
    if (currentPage * rowsPerPage < records.length) {
        currentPage++;
        displayTable(records, currentPage);
    }
}
function getResults(res) {
    var result = false;
    switch (res.status) {
        case 200:
            alert('Database connection established');
            result = true;
            break;
        case 400:
            alert('Bad Request: Please check the data you provided.');
            break;
        case 401:
            alert('Unauthorized: Please log in.');
            break;
        case 403:
            alert('Forbidden: You do not have permission to perform this action.');
            break;
        case 404:
            alert('Not Found: The record could not be found.');
            break;
        case 405:
            alert('Duplicate enrollment: Business already exists');
            break;
        case 406:
            alert('code already exists');
            break;
        case 500:
            alert('Internal Server Error: Please try again later.');
            break;
        default:
            alert(`Unexpected error: ${res.status}`);
            break;
    }

    if (!res.ok) {
        return false;
    }
    return result;
}
