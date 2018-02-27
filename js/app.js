/*
	The use of IIFE (Immediately Invoked Function Expressions) is to wrap code inside a function scope

	It helps decreases chances of:

	1. clashing with other applications/libraries
	2. polluting superior (global most likely) scope

	You should note that it does not detect when the document is ready (Not some kind of document.load() or window.load())
	
	Any variables/functions declared in the IIFE will be 'private' and accessible within the function scope ONLY.
*/
(function() {
	// Get the id of the <ul> container for the purposes of controlling and loading new <li> into it
	const parentId = 'item-list';

	// Since each wedding item needs to be unique, we need to find a way of uniquely identify each item.
	let currentId = null; // Stores the last ID used to identify an item
	const idGenerator = () => {
		if(!currentId) currentId = 0;
		if(currentId < 0) currentId = 0;
		currentId = currentId + 1;
		return currentId;
	}

	// Store all the wedding items.
	let weddingItems = {};

	// Add a wedding item
	const addWeddingItem = (item) => {
		const itemId = idGenerator(); // Generate a unique ID for a new item to save
		item.id = itemId; // Add the id to the passed in wedding item
		weddingItems[itemId] = item; // Save the item in the weddingItems object
		return weddingItems[itemId];
	}

	// Remove a wedding item
	const removeWeddingItem = (itemId) => {
		const itemToRemove = weddingItems[itemId]; // Retrieve the item to remove
		delete weddingItems[itemId]; // Delete the property of the item to remove from the weddingsItem store
		return itemToRemove; // Return the item to remove for confirmation
	}

	// Update a wedding item (Unused yet)
	const updateWeddingItem = (itemId, name, price) => {
		const itemToUpate = weddingItems[itemId]; // Retrieve the item to update
		if(name) itemToUpate.name = name;	// Update name if name is not null in the args
		if(price) itemToUpate.price = price; // Update price if price is not null in the args
		weddingItems[itemId] = itemToUpate;	// Save the updates in the weddingItems store
		return itemToUpate; // Return the updated item for confirmation
	}

	// Update the DOM (Document Object Model) with changes reflected in the weddingItems store
	const updateUI = () => {
		var listElement = document.getElementById(parentId); // Retrieve the <tbody> element
		listElement.innerHTML = ''; // Clean everything in the <tbody> element
		// The for..in loop allows anyone to iterate over the properties of an object
		for(var item in weddingItems) {
			const currentItem =  weddingItems[item];
			var childElement = document.createElement('tr'); // Create a DOM element
			const content = `
				<td>${currentItem.id}</td>
				<td>${currentItem.name}</td>
				<td>${currentItem.price}</td>
				<td><a id='del-${item}' href='#'>Delete</a></td>
			`;
			childElement.innerHTML = content; // Add content to the created DOM element
			listElement.appendChild(childElement); // Append content to the DOM element

			handleDeleteEvent(item); // Ensure that the delete event is appended individually
		}
	}

	// Handle the delete event for each delete click. Very important to get this eventlistener separate
	const handleDeleteEvent = (id) => {
		document.getElementById(`del-${id}`).onclick = () => {
			const removedItem = removeWeddingItem(id); // Remove the wedding item using the item id (Also the iterated property)

			if(removedItem) {
				updateUI(); // Update UI to reflect changes
			} else alert('There\'s no wedding item to delete! Are you a scammer?');
		};
	}

	// Retrieve data from the inputs on the form and return the object to create
	const getSubmittedInputs = () => {
		const nameOfItem = document.getElementById('name').value; // Get the value from the input with id name
		const priceOfItem = document.getElementById('price').value;	// Get the value from the input with id price
		// Only process when both name and price are not null/undefined
		if(nameOfItem && priceOfItem) {
			return { 
				name: nameOfItem, 
				price: priceOfItem 
			};
		} else alert('You are a scammer!!');
	}

	// Clean out the inputs once some processing is done
	const cleanInputs = () => {
		const nameInput = document.getElementById('name');
		nameInput.value = '';	// Get the value from the input with id name and clear it
		document.getElementById('price').value = '';	// Get the value from the input with id name and clear it

		nameInput.focus(); // Keep the cursor on the name input
	}

	// Handle the submit event with the submit button
	var submitBtn = document.getElementById('add-item'); // Retrieve the submit button
	submitBtn.addEventListener('click', () => { // Add an event listener to the submit button
		const objectToSave = getSubmittedInputs(); // Get submitted inputs
		const addedItem = addWeddingItem(objectToSave); // Add submitted inputs to the the weddingItems store
		if(!addedItem) alert('We failed to do it!!'); // Check if save worked, if not flag an alert

		updateUI(); // Update the UI to see additions work
		cleanInputs(); // Clean inputs to accept new entry
	});
})();

/*

	Further Upgrades:

	1. Get update feature on the UI
	3. Store the weddingItems in a store eg. localStorage, cookies

*/