const urlBase = 'http://cop4331.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let ids = [];

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("UsernameL").value;
	let password = document.getElementById("PasswordL").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function createAccount()
{
	userId = 0;
	
	let firstName = document.getElementById("firstName").value;;
	let lastName = document.getElementById("lastName").value;;
	let login = document.getElementById("Username").value;
	let password = document.getElementById("Password").value;
//	var hash = md5( password );
	
	document.getElementById("registerResult").innerHTML = "";

	let tmp = {login:login,password:password,firstName:firstName,lastName:lastName};
//	var tmp = {login:login,password:hash,firstName:firstName,lastName:lastName};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("registerResult").innerHTML = "User is already registered";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				login = jsonObject.login;
				password = jsonObject.password

				saveCookie();
	
				window.location.href = "index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		updateWelcomeTitle();
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

// Update welcome title with user's first name
function updateWelcomeTitle() {
    // Get the title element
    const titleElement = document.getElementById("title");

    // Replace "USER" with the first name from the cookie
    if (firstName) {
        titleElement.textContent = `Charge on, ${firstName}!`;
    }
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function showTable() {
    var x = document.getElementById("addMe");
    var contacts = document.getElementById("contactsTable")
    if (x.style.display === "none") {
        x.style.display = "block";
        contacts.style.display = "none";
    } else {
        x.style.display = "none";
        contacts.style.display = "block";
    }
}

function addContact() {

    let firstName = document.getElementById("firstNameText").value;
    let lastName = document.getElementById("lastNameText").value;
    let phone = document.getElementById("phoneText").value;
    let email = document.getElementById("emailText").value;


    let tmp = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been added");
                
                // Clear input fields manually
                document.getElementById("firstNameText").value = "";
                document.getElementById("lastNameText").value = "";
                document.getElementById("phoneText").value = "";
                document.getElementById("emailText").value = "";

                // Reload contacts table and close the modal
                loadContacts();
                closeModal();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}


async function loadContacts() {
	
    const tmp = {
        search: "",
        userId: userId
    };

    const jsonPayload = JSON.stringify(tmp);

    const url = `${urlBase}/SearchContact.${extension}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: jsonPayload
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const jsonObject = await response.json();

        if (jsonObject.error) {
            console.log(jsonObject.error);
            return;
        }

        // Clear any existing content in the table body
        const tbody = document.getElementById("tbody");
        tbody.innerHTML = "";


        jsonObject.results.forEach((result, index) => {
            ids[index] = result.id;


			console.log(ids[index]);

            // Create a new row
            const row = document.createElement("tr");
            row.setAttribute("id", `row${index}`);

            // First name cell
            const firstNameCell = document.createElement("td");
            firstNameCell.setAttribute("id", `firstName${index}`);
            firstNameCell.innerHTML = `<span>${result.firstName}</span>`;
            row.appendChild(firstNameCell);

            // Last name cell
            const lastNameCell = document.createElement("td");
            lastNameCell.setAttribute("id", `lastName${index}`);
            lastNameCell.innerHTML = `<span>${result.lastName}</span>`;
            row.appendChild(lastNameCell);

            // Email cell
            const emailCell = document.createElement("td");
            emailCell.setAttribute("id", `email${index}`);
            emailCell.innerHTML = `<span>${result.email}</span>`;
            row.appendChild(emailCell);

            // Phone cell
            const phoneCell = document.createElement("td");
            phoneCell.setAttribute("id", `phone${index}`);
            phoneCell.innerHTML = `<span>${result.phone}</span>`;
            row.appendChild(phoneCell);

            // Action buttons
            const actionsCell = document.createElement("td");

            // Edit button
            const editButton = document.createElement("button");
            editButton.setAttribute("type", "button");
            editButton.setAttribute("id", `edit_button${index}`);
            editButton.classList.add("custom-button", 'edit-button');
            editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"></path><path d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"></path></svg>`;
            editButton.onclick = () => editContact(index);
            actionsCell.appendChild(editButton);

            // Delete button
            const deleteButton = document.createElement("button");
            deleteButton.setAttribute("type", "button");
            deleteButton.classList.add("custom-button", 'delete-button');
            deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M14 11h8v2h-8zM4.5 8.552c0 1.995 1.505 3.5 3.5 3.5s3.5-1.505 3.5-3.5-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2z"></path></svg>`;
            deleteButton.onclick = () => deleteContact(index);
            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);

            // Add row to table body
            tbody.appendChild(row);
        });
		console.log("ids at the end of load" + ids[7]);
    } catch (error) {
        console.log(`Error fetching contacts: ${error.message}`);
    }
}

// Edit row function to open the modal with contact data
function editContact(index) {
	console.log("edit row index: " + index);
	console.log("edit row array: " + ids);
    const firstName = document.getElementById(`firstName${index}`).innerText;
    const lastName = document.getElementById(`lastName${index}`).innerText;
    const email = document.getElementById(`email${index}`).innerText;
    const phone = document.getElementById(`phone${index}`).innerText;

    // Populate modal with current contact details
    document.getElementById("editFirstName").value = firstName;
    document.getElementById("editLastName").value = lastName;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPhone").value = phone;
    document.getElementById("editContactIndex").value = index;

    // Show the modal
    document.getElementById("editContactModal").style.display = "block";
}

// Save edited contact function
function saveContactEdit() {
	
    const index = document.getElementById("editContactIndex").value;
    const updatedFirstName = document.getElementById("editFirstName").value;
    const updatedLastName = document.getElementById("editLastName").value;
    const updatedEmail = document.getElementById("editEmail").value;
    const updatedPhone = document.getElementById("editPhone").value;

    const contactId = ids[index]; // Get contact ID from ids array
	console.log("save row index: " + index);
	console.log("save row array: " + ids);

    let tmp = {
        id: contactId,
        firstName: updatedFirstName,
        lastName: updatedLastName,
        email: updatedEmail,
        phone: updatedPhone,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Update the table with new values
                document.getElementById(`firstName${index}`).innerText = updatedFirstName;
                document.getElementById(`lastName${index}`).innerText = updatedLastName;
                document.getElementById(`email${index}`).innerText = updatedEmail;
                document.getElementById(`phone${index}`).innerText = updatedPhone;

                // Hide the modal
                document.getElementById("editContactModal").style.display = "none";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function deleteContact(index) {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    const contactId = ids[index];  // Retrieve contact ID from the ids array
    console.log("delete row " + contactId);

    // Send contactId as an array, even if it's just one ID
    let data = { ids: [contactId], userId: userId }; 

    let jsonPayload = JSON.stringify(data);
    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                if (response.error === "") {
                    // Remove the row from the table
                    document.getElementById(`row${index}`).remove();
                    console.log('Contact successfully deleted');
                } else {
                    alert('Failed to delete contact: ' + response.error);
                }
            } else {
                alert('Failed to communicate with server.');
            }
        }
    };

    xhr.send(jsonPayload);
}

function searchContacts() 
{
    const content = document.getElementById("searchText").value.toUpperCase().split(' ');
    const rows = document.querySelectorAll("#contacts tr");

    rows.forEach(row => {
        const firstNameCell = row.querySelector("td:nth-child(1)");
        const lastNameCell = row.querySelector("td:nth-child(2)");

        if (firstNameCell && lastNameCell) {
            const firstNameText = firstNameCell.textContent.toUpperCase();
            const lastNameText = lastNameCell.textContent.toUpperCase();
            
            let matchFound = content.some(selection => 
                firstNameText.includes(selection) || lastNameText.includes(selection)
            );
            
            // Show or hide the row based on the search result
            row.style.display = matchFound ? "" : "none";
        }
    });
}