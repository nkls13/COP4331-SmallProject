const contacts = [];

function openModal() {
    document.getElementById("contactModal").style.display = "block";
}

function closeModal() {
    document.getElementById("contactModal").style.display = "none";
}

function saveContact() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    if (firstName && lastName && email && phone) {
        contacts.push({ firstName, lastName, email, phone });
        closeModal();
        renderContacts();
    } else {
        alert("Please fill out all fields");
    }
}

function renderContacts() {
    const tbody = document.querySelector("#contactsTable tbody");
    tbody.innerHTML = ""; // Clear existing rows

    contacts.forEach(contact => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${contact.firstName}</td>
            <td>${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
        `;
        tbody.appendChild(row);
    });
}

function searchContacts() {
    const searchValue = document.getElementById("search").value.toLowerCase();
    const rows = document.querySelectorAll("#contactsTable tbody tr");

    rows.forEach(row => {
        const firstName = row.cells[0].textContent.toLowerCase();
        const lastName = row.cells[1].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        const phone = row.cells[3].textContent.toLowerCase();

        if (
            firstName.includes(searchValue) ||
            lastName.includes(searchValue) ||
            email.includes(searchValue) ||
            phone.includes(searchValue)
        ) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function resetSearch() {
    document.getElementById("search").value = "";
    searchContacts();
}

function setWelcomeMessage(userName) {
    document.getElementById("welcomeMessage").textContent = `Charge on, ${userName}!`;
}

// Assuming you pass the user's first name when they log in
setWelcomeMessage("John"); // Replace "John" with the actual user's name

