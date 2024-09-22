const urlBase = 'http://cop4331.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let ids = [];
let nloaded = 0;
let offset = 0;


function doLogin()
{
    userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("UsernameL");
	let password = document.getElementById("PasswordL");
    //THIS LINE HANDLES HASHING FOR LOGIN
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login.value,password:hash};
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

function passwordStrength(password){
    //regex to store special characters
    let special = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    //uppercase
    if(!/[A-Z]/.test(password)){
        return 0;
    }
    //lowercase
    if(!/[a-z]/.test(password)){
        return 0;
    }
    //number
    if(!/\d/.test(password)){
        return 0;
    }
    //length
    if(password.length < 8){
        return 0;
    }
    if(!special.test(password)){
        return 0;
    }
    return 1;
}

function passwordTips(labelId){
    let label = document.getElementById(labelId);
    if (!label.querySelector('.errorMessage')) {
        label.innerHTML += ' <span class="errorMessage" style="color: red;">Must fit requirements above</span>';
    }
}

function passwordConfirmTips(labelId){
    let label = document.getElementById(labelId);
    if (!label.querySelector('.errorMessage')) {
        label.innerHTML += ' <span class="errorMessage" style="color: red;">Passwords must match</span>';
    }
}

function createAccount()
{
	userId = 0;
    errorReg = false;
	
	let firstName = document.getElementById("firstName");
	let lastName = document.getElementById("lastName");
	let login = document.getElementById("Username");
	let password = document.getElementById("Password");
    let passwordConfirm = document.getElementById("PasswordConfirm")

   

    if(!firstName.value.trim()){
        errorReg = true;
        showError(firstName, "firstNameRegLabel");
    } else {
        removeError(firstName, "firstNameRegLabel");
    }
    if(!lastName.value.trim()){
        errorReg = true;
        showError(lastName, "lastNameRegLabel");
    } else {
        removeError(lastName, "lastNameRegLabel");
    }
    if(!login.value.trim()){
        errorReg = true;
        showError(login, "usernameRegLabel");
    } else {
        removeError(login, "usernameRegLabel");
    }
    if(!password.value.trim()){
        errorReg = true;  
        showError(password, "passwordRegLabel");     
    } else {
        removeError(password, "passwordRegLabel");
    }

    if(passwordStrength(password.value) == 0){
        errorReg = 1;
        showError(password, "passwordRegLabel"); 
        passwordTips("passwordRegLabel");   
    } else {
        removeError(password, "passwordRegLabel");
        removePasswordTips("passwordRegLabel");
    }

    if(passwordConfirm.value != password.value){
        errorReg = true;
        showError(passwordConfirm, "passwordRegLabelConfirm")
        passwordConfirmTips("passwordRegLabelConfirm")
    }
    else {
        removeError(passwordConfirm, "passwordRegLabelConfirm")
        removePasswordConfirm("passwordRegLabelConfirm");
    }
    
    //if at least one field has an error, return so user can correct input
    if(errorReg){
        return;
    }

 	var hash = md5( password );
	
	document.getElementById("registerResult").innerHTML = "";

	let tmp = {login:login.value,password:hash,firstName:firstName.value,lastName:lastName.value};
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

				// Display success message
				const successMessage = document.getElementById('successMessage');
				successMessage.textContent = "User successfully registered.";
				successMessage.style.display = 'block'; // Show the message
				console.log("Success message shown"); // Debugging
			
				// Hide the message after 3 seconds
				setTimeout(() => {
					successMessage.style.display = 'none';
					console.log("Success message hidden"); // Debugging
					window.location.href = "index.html";
				}, 2000);
			 
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

    let email = document.getElementById('emailText');
    let firstName = document.getElementById("firstNameText");
    let lastName = document.getElementById("lastNameText");
    let phone = document.getElementById("phoneText");
    //let genUserId = generateUniqueUserId();

    //check for all fields filled out correctly

    //use trim to remove spaces creating bugs
    // Validate first name
   errorChecker = validateInput(firstName, lastName, email, phone);

    if(errorChecker == true){
        console.log("Correct errors before submitting");
        return 1;
    }

    let tmp = {
        firstName: firstName.value,
        lastName: lastName.value,
        phone: phone.value,
        email: email.value,
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
                // Display success message
                const successMessage = document.getElementById('successMessage');
                successMessage.textContent = "Contact successfully added.";
                successMessage.style.display = 'block'; // Show the message
				console.log("Success message shown"); // Debugging

                
                // Hide the message after 3 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
					console.log("Success message hidden"); // Debugging
                }, 2000);

                // reload contacts table and switch view to show
                loadContacts();
                closeModal();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
    return 0;
}

function resetQuery() {
    ids = [];
    nloaded = 0;
    offset = 0;
    document.getElementById("tbody").innerHTML = "";
    loadContacts(true);
}

// Reset decides whether to clean tbody or not
// Used to fix duplicate row error from fast key input and await
async function loadContacts(reset = false) {

    const searchText = document.getElementById("searchText").value;
    console.log(searchText);

    const tmp = {
        search: searchText,
        userId: userId,
        limit: 20,
        offset : offset
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
        if(reset) tbody.innerHTML = "";

        (jsonObject.results || []).forEach((result, index) => {
            ids[nloaded+index] = result.id;

			console.log(ids[nloaded+index]);

            // Debugging: log the value of result.favorite
            //console.log(`Contact ID: ${result.id}, Favorite: ${result.favorite}`);

            // Create a new row
            const row = document.createElement("tr");
            row.setAttribute("id", `row${nloaded+index}`);

            // First name cell
            const firstNameCell = document.createElement("td");
            firstNameCell.setAttribute("id", `firstName${nloaded+index}`);
            firstNameCell.innerHTML = `<span>${result.firstName}</span>`;
            row.appendChild(firstNameCell);

            // Last name cell
            const lastNameCell = document.createElement("td");
            lastNameCell.setAttribute("id", `lastName${nloaded+index}`);
            lastNameCell.innerHTML = `<span>${result.lastName}</span>`;
            row.appendChild(lastNameCell);

            // Email cell
            const emailCell = document.createElement("td");
            emailCell.setAttribute("id", `email${nloaded+index}`);
            emailCell.innerHTML = `<span>${result.email}</span>`;
            row.appendChild(emailCell);

            // Phone cell
            const phoneCell = document.createElement("td");
            phoneCell.setAttribute("id", `phone${nloaded+index}`);
            phoneCell.innerHTML = `<span>${result.phone}</span>`;
            row.appendChild(phoneCell);

            // Action buttons
            const actionsCell = document.createElement("td");

            // favorite button
            const favoriteButton = document.createElement("button");
            favoriteButton.setAttribute("type", "button");
            favoriteButton.setAttribute("id", `favorite_button${nloaded+index}`);
            favoriteButton.setAttribute("data-favorite", result.favorite);
            favoriteButton.classList.add("custom-button", 'favorite-button');
            //vary if 1 or 0
            if (result.favorite === 1) {
                favoriteButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(255, 50, 50, 1);">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>`;
            } else  {
                favoriteButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 0.3);">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>`;
            }
            
            
            //favoriteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(255, 50, 50, 1);"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>`;

            favoriteButton.onclick = () => favoriteContact(parseInt(favoriteButton.getAttribute("id").slice(15)), parseInt(favoriteButton.getAttribute("data-favorite")));
            actionsCell.appendChild(favoriteButton);


            // Edit button
            const editButton = document.createElement("button");
            editButton.setAttribute("type", "button");
            editButton.setAttribute("id", `edit_button${nloaded+index}`);
            editButton.classList.add("custom-button", 'edit-button');
            editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"></path><path d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"></path></svg>`;
            editButton.onclick = () => editContact(parseInt(editButton.getAttribute("id").slice(11)));
            actionsCell.appendChild(editButton);

            // Delete button
            const deleteButton = document.createElement("button");
            deleteButton.setAttribute("type", "button");
            deleteButton.setAttribute("id", `delete_button${nloaded+index}`);
            deleteButton.classList.add("custom-button", 'delete-button');
            deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M14 11h8v2h-8zM4.5 8.552c0 1.995 1.505 3.5 3.5 3.5s3.5-1.505 3.5-3.5-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2z"></path></svg>`;
            deleteButton.onclick = () => deleteContact(parseInt(deleteButton.getAttribute("id").slice(13)));
            actionsCell.appendChild(deleteButton);


            row.appendChild(actionsCell);

            // Add row to table body
            tbody.appendChild(row);
        });

        nloaded += (jsonObject.results || []).length;
        offset += (jsonObject.results || []).length;
		console.log("ids at the end of load" + ids[7]);

        // Observe last row for more query if there are more to load
        if (jsonObject.results != null)
            myObserver.observe(document.getElementById(`row${nloaded-1}`));
    } catch (error) {
        console.log(`Error fetching contacts: ${error.message}`);
    }
}

// Lazy loading stuff
const callback = (entries, observer) => {
    console.log(entries);                                       // FIXME: Delete
    if(!entries[0].isIntersecting) return;
    console.log(document.getElementById(`row${nloaded-1}`));    // FIXME: Delete
    observer.unobserve(entries[0].target);
    loadContacts();
}
const myObserver = new IntersectionObserver(callback);

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

function favoriteContact(index, favoriteStatus) {
    // flip the number passed in because button is clicked
    const favorite = favoriteStatus === 1 ? 0 : 1;

   

    const firstName = document.getElementById(`firstName${index}`).innerText;
    const lastName = document.getElementById(`lastName${index}`).innerText;
    const email = document.getElementById(`email${index}`).innerText;
    const phone = document.getElementById(`phone${index}`).innerText;

    let tmp = {
        id: ids[index],
        firstName: firstName,
        lastName: lastName,
        email: email ,
        phone: phone,
        userId: userId,
        favorite: favorite
    };

    let jsonPayload = JSON.stringify(tmp)
    let url = urlBase + '/UpdateContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                console.log("Favorite status updated successfully");

                 // Update the button's appearance based on the new favorite status
                const favoriteButton = document.getElementById(`favorite_button${index}`);
                favoriteButton.setAttribute("data-favorite", favorite); // Update data attribute
                favoriteButton.innerHTML = parseInt(favorite) === 1 
                    ? `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(255, 50, 50, 1);">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>` // Filled heart
                    : `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 0.3);">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>`; // Empty heart        
                    //resetQuery();   
            } else {
                console.log("Error updating favorite status: " + this.statusText);
            }
        }
    };
    try {
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
    
}

// Save edited contact function
function saveContactEdit() {
	
    const index = document.getElementById("editContactIndex").value;
    const updatedFirstName = document.getElementById("editFirstName");
    const updatedLastName = document.getElementById("editLastName");
    const updatedEmail = document.getElementById("editEmail");
    const updatedPhone = document.getElementById("editPhone");

    //validate here
    errorCheckEdit = validateEditInput(updatedFirstName, updatedLastName, updatedEmail, updatedPhone)

    if(errorCheckEdit == true){
        console.log("Correct errors before submitting");
        return 1;
    }
    

const contactId = ids[index]; // Get contact ID from ids array
console.log("save row index: " + index);
console.log("save row array: " + ids);

let tmp = {
id: contactId,
firstName: updatedFirstName.value,
lastName: updatedLastName.value,
email: updatedEmail.value,
phone: updatedPhone.value,
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
        document.getElementById(`firstName${index}`).innerText = updatedFirstName.value;
        document.getElementById(`lastName${index}`).innerText = updatedLastName.value;
        document.getElementById(`email${index}`).innerText = updatedEmail.value;
        document.getElementById(`phone${index}`).innerText = updatedPhone.value;

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
                    offset--;
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

function validateEmail(email) {
    let emailCheck = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailCheck.test(email);
}

//create red box plus *
function showError(inputElement, labelId) {
    inputElement.style.border = "2px solid red";
    let label = document.getElementById(labelId);
    if (!label.querySelector('.error-asterisk')) {
        label.innerHTML += ' <span class="error-asterisk" style="color: red;">*</span>';
    }
}

function removePasswordTips(labelId) {
    let label = document.getElementById(labelId);
    let tips = label.querySelector('.errorMessage');
    if (tips) {
        //removes the password help
        tips.remove(); 
    }
}

function removePasswordConfirm(labelId) {
    let label = document.getElementById(labelId);
    let tips = label.querySelector('.errorMessage');
    if (tips) {
        //removes the password help
        tips.remove(); 
    }
}

//take away the red box + *
function removeError(inputElement, labelId) {
    inputElement.style.border = ""; // Remove red border
    let label = document.getElementById(labelId);
    let asterisk = label.querySelector('.error-asterisk');
    if (asterisk) {
        asterisk.remove(); // Remove the asterisk if present
    }
}

function showErrorEdit(inputElement, labelId) {
    inputElement.style.border = "2px solid red";
    let label = document.getElementById(labelId);
    if (!label.querySelector('.error-asterisk')) {
        label.innerHTML += ' <span class="error-asterisk" style="color: red;">*</span>';
    }
}

//take away the red box + *
function removeErrorEdit(inputElement, labelId) {
    inputElement.style.border = ""; // Remove red border
    let label = document.getElementById(labelId);
    let asterisk = label.querySelector('.error-asterisk');
    if (asterisk) {
        asterisk.remove(); // Remove the asterisk if present
    }
}

function validateInput(firstName, lastName, email, phone) {
    errorChecker = false;
    
    if (!firstName.value.trim()) {
        showError(firstName, "firstNameLabel");
        errorChecker = true;
    } else {
        removeError(firstName, "firstNameLabel");
    }

    // Validate last name
    if (!lastName.value.trim()) {
        showError(lastName, "lastNameLabel");
        errorChecker = true;
    } else {
        removeError(lastName, "lastNameLabel");
    }

    // Validate email using existing validateEmail function
    if (!validateEmail(email.value.trim())) {
        showError(email, "emailLabel");
        errorChecker = true;
    } else {
        removeError(email, "emailLabel");
    }

    // Validate phone number format
    let phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phonePattern.test(phone.value.trim())) {
        showError(phone, "phoneLabel");
        errorChecker = true;
    } else {
        removeError(phone, "phoneLabel");
    }
    return errorChecker;
}

function validateEditInput(firstName, lastName, email, phone) {
    errorChecker = false;
    
    if (!firstName.value.trim()) {
        showErrorEdit(firstName, "firstNameEditLabel");
        errorChecker = true;
    } else {
        removeErrorEdit(firstName, "firstNameEditLabel");
    }

    // Validate last name
    if (!lastName.value.trim()) {
        showErrorEdit(lastName, "lastNameEditLabel");
        errorChecker = true;
    } else {
        removeErrorEdit(lastName, "lastNameEditLabel");
    }

    // Validate email using existing validateEmail function
    if (!validateEmail(email.value.trim())) {
        showErrorEdit(email, "emailEditLabel");
        errorChecker = true;
    } else {
        removeErrorEdit(email, "emailEditLabel");
    }

    // Validate phone number format
    let phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phonePattern.test(phone.value.trim())) {
        showErrorEdit(phone, "phoneEditLabel");
        errorChecker = true;
    } else {
        removeErrorEdit(phone, "phoneEditLabel");
    }
    return errorChecker;
}

//wait for the full html to load
document.addEventListener('DOMContentLoaded', function() {
    //function to take input based on edit or add contact
    function formatPhoneNumber(inputElement) {
        inputElement.addEventListener('input', function (e) {
            //only let the user put in numbers
            let value = e.target.value.replace(/\D/g, ''); 
           
            //format phone number based on length of current input
            if (value.length > 3 && value.length <= 6) {
                e.target.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else if (value.length > 6) {
                e.target.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            } else if (value.length > 0) {
                e.target.value = `(${value.slice(0, 3)}`;
            } else {
                e.target.value = value;
            }
        });
    }

   
    const phoneText = document.getElementById('phoneText');
    const editPhoneText = document.getElementById('editPhone');
    
    //check if the field is filled before applying
    if (phoneText) formatPhoneNumber(phoneText); 
    if (editPhoneText) formatPhoneNumber(editPhoneText);
});


document.addEventListener('DOMContentLoaded', function() {

    //handle password reqs as each letter is typed
    document.getElementById('Password').addEventListener('input', function() {
        let password = this.value;

        //update each requirement based on password input
        updateRequirement(password.length >= 8, 'lengthReq');
        updateRequirement(/[A-Z]/.test(password), 'upperReq');
        updateRequirement(/[a-z]/.test(password), 'lowerReq');
        updateRequirement(/\d/.test(password), 'numberReq');
        updateRequirement(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password), 'specialReq');
    });
});

function updateRequirement(fitsReq, elementId) {
    let requirement = document.getElementById(elementId);
    let bubble = requirement.querySelector('.bubble');

    if (fitsReq) {
        //make the bubble green
        bubble.classList.add('filled'); 
    } else {
        //make the bubble grey
        bubble.classList.remove('filled');  
    }
}