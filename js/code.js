const urlBase = 'http://cop4331.xyz/LAMPAPI';
const urlBase = 'http://cop4331.xyz/LAMPAPI';
const extension = 'php';

let userId = 1;
let firstName = "";
let lastName = "";
let ids = [];

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("Username").value;
	let password = document.getElementById("Password").value;
	let login = document.getElementById("Username").value;
	let password = document.getElementById("Password").value;
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
                // Clear input fields in form 
                document.getElementById("addMe").reset();
                // reload contacts table and switch view to show
                loadContacts();
                showTable();
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

        const ids = [];

        jsonObject.results.forEach((result, index) => {
            ids[index] = result.ID;

            // Create a new row
            const row = document.createElement("tr");
            row.setAttribute("id", `row${index}`);

            // First name cell
            const firstNameCell = document.createElement("td");
            firstNameCell.setAttribute("id", `first_Name${index}`);
            firstNameCell.innerHTML = `<span>${result.firstName}</span>`;
            row.appendChild(firstNameCell);

            // Last name cell
            const lastNameCell = document.createElement("td");
            lastNameCell.setAttribute("id", `last_Name${index}`);
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
            editButton.classList.add("w3-button", "w3-circle", "w3-lime");
            editButton.innerHTML = `<span class="glyphicon glyphicon-edit"></span>`;
            editButton.onclick = () => edit_row(index);
            actionsCell.appendChild(editButton);

            // Save button (initially hidden)
            const saveButton = document.createElement("button");
            saveButton.setAttribute("type", "button");
            saveButton.setAttribute("id", `save_button${index}`);
            saveButton.classList.add("w3-button", "w3-circle", "w3-lime");
            saveButton.style.display = "none";
            saveButton.innerHTML = `<span class="glyphicon glyphicon-saved"></span>`;
            saveButton.onclick = () => save_row(index);
            actionsCell.appendChild(saveButton);

            // Delete button
            const deleteButton = document.createElement("button");
            deleteButton.setAttribute("type", "button");
            deleteButton.classList.add("w3-button", "w3-circle", "w3-amber");
            deleteButton.innerHTML = `<span class="glyphicon glyphicon-trash"></span>`;
            deleteButton.onclick = () => delete_row(index);
            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);

            // Add row to table body
            tbody.appendChild(row);
        });
    } catch (error) {
        console.log(`Error fetching contacts: ${error.message}`);
    }
}

function searchContacts() {
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

