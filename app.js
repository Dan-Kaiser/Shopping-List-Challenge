//main state var
var state = {
	items: []
};

var listItemTemplate = (
  '<li>' +
    '<span class="shopping-item js-shopping-item"></span>' +
    '<div class="shopping-item-controls">' +
      '<button class="js-shopping-item-toggle">' +
        '<span class="button-label">check</span>' +
      '</button>' +
      '<button class="js-shopping-item-delete">' +
        '<span class="button-label">delete</span>' +
      '</button>' +
    '</div>' +
  '</li>'
);

//State modifcation functions
function addItem(state, item) {
	state.items.push({
		displayName: item,
		checkedOff: false
	});
};

function deleteItem(state, itemIndex){
	state.items.splice(itemIndex, 1);;
}

function getItem(state, itemIndex) {
	return state.items[itemIndex];
}

function updateItem(state, itemIndex, newItemState) {
	state.items[itemIndex] = newItemState;
	console.log(newItemState);
}


//Functions that render HTML into a DOM element
function renderItem(item, itemID, itemTemplate, itemListNumber) {
	var element = $(itemTemplate);
	element.find('.js-shopping-item').text(item.displayName);
	if (item.checkedOff) {
		element.find('.js-shopping-item').addClass('shopping-item__checked');
	}
	//this matches the item list number to the index value of the item
	element.attr(itemListNumber, itemID);
	return element;
}

function renderList(state, listElement, itemListNumber){
	var itemsHTML = state.items.map(
		function(item, index){
		return renderItem(item, index, listItemTemplate, itemListNumber);
	});
	listElement.html(itemsHTML);
};

//Event listener functions
function handleItemToggles(listElement, toggleID, itemListNumber, state){
	listElement.on('click', toggleID, function(event){
		var itemID = $(event.currentTarget.closest('li')).attr(itemListNumber);
		var oldItem = getItem(state, itemID);
		
		updateItem(state, itemID, {
			displayName: oldItem.displayName,
			checkedOff: !oldItem.checkedOff
		});
		renderList(state, listElement, itemListNumber);
		//console.log('The check button can be used!');
	});
}

function handleItemDeletes(listElement, deleteID, itemListNumber, state){
	listElement.on('click', deleteID, function(event){
		var itemIndex = $(event.currentTarget.closest('li')).attr(itemListNumber);
		deleteItem(state, itemIndex);
		renderList(state, listElement, itemListNumber);
		//console.log('The delete button can be used!');
	});
}

function handleItemAdds(formElement, textInput, listElement, itemListNumber, state){
	formElement.submit(function(event){
		event.preventDefault();
		var newItem = formElement.find(textInput).val();
		addItem(state, newItem);
		renderList(state, listElement, itemListNumber);
		this.reset();
	});
}


$(function(){
	var formElement = $('#js-shopping-list-form');
	var listElement = $('.js-shopping-list');
	var textInput = $('#shopping-list-entry');
	var toggleID = '.js-shopping-item-toggle';
	var deleteID = '.js-shopping-item-delete';
	var itemListNumber = 'item-list-number';

	handleItemAdds(formElement, textInput, listElement, itemListNumber, state);
	handleItemToggles(listElement, toggleID, itemListNumber, state);
	handleItemDeletes(listElement, deleteID, itemListNumber, state);	
});