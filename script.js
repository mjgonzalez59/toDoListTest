
//Add a new item to the items Array
const addAnItemTask = function (form, item, itemsArray, elementsList) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const itemName = item.value.trim();
        if(itemName.length === 0){
            alert("Please enter a task");
            return ;
        }
        const taskItem = {
            name: itemName,
            isDone: false,
            addedAt: new Date().getTime()
        }
        //Load local storage items to itemsArray
        itemsArray = getLocalStorage(itemsArray, elementsList);
        itemsArray.push(taskItem);
        setLocalStorage(itemsArray);
        getLocalStorage(itemsArray, elementsList);
        console.log("addAnItemTask Items", itemsArray);
    });
}

// Set in the local storage the items array
const setLocalStorage = function (itemsArray) {
    localStorage.setItem("todoItems", JSON.stringify(itemsArray));
}

// Get the items array saved in the Local Storage
const getLocalStorage = function(itemsArray, elementsList){
    const toDoStoraged = localStorage.getItem("todoItems");
    itemsArray = toDoStoraged ? JSON.parse(toDoStoraged) : [];
    getList(itemsArray, elementsList);
    return itemsArray;
}

// Get the items array from local storage and set it into html elements
const getList = function(localStorageArray, elementsList){
    elementsList.innerHTML = "";
    if(localStorageArray.length > 0){
        localStorageArray.forEach(item => {            
            const liTag = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${item.name}</span>
                <span data-time="${item.addedAt}">
                    <a href="#" title="data-done"><i class="bi bi-check2 green"></i></a>
                    <a href="#" title="data-edit"><i class="bi bi-pencil blue" ></i></a>
                    <a href="#" title="data-delete"><i class="bi bi-x-circle-fill red"></i></a>
                </span>
            </li>`
            elementsList.insertAdjacentHTML("beforeend", liTag);
        });
    }else {
        // data-done
        // data-edit
        // data-delete
    }
    
}

//Adding Event listener to ActionIcons
const insertHandleToActionIcons = function(localStorageArray, elementsList){
    const liList = document.querySelectorAll('.list-group-item')
    liList.forEach(item => {
        const actionIcons = item.querySelectorAll("a");
        actionIcons.forEach(actionIcon => {
            actionIcon.addEventListener("click", (event) => {
                const itemIndex = findItemIndex(localStorageArray, item);
                console.log(actionIcon);
                // console.log(actionIcon.querySelector('[data-done]'));
                // console.log(actionIcon.querySelector('[name]'));
                // console.log(actionIcon.querySelector('.name'));
                // console.log(actionIcon.querySelector('.data-done'));
                if(actionIcon.title === "data-done"){
                    changeStatus(localStorageArray[itemIndex]);
                    setLocalStorage(localStorageArray);
                }
                if(actionIcon.title === "data-delete"){
                    deleteItem(localStorageArray, itemIndex);
                    setLocalStorage(localStorageArray);
                    getList(localStorageArray, elementsList);
                }
                // console.log(document.querySelectorAll('[linkedas]'));
                // console.log(document.querySelectorAll('.linkedas'));

                // console.log("After", itemSelected);
                // spanDataTimeNodeList.forEach(spanElement => {
                //     console.log(spanElement.getAttribute("data-time"))
                //     console.log("--------");
                // });
                // changeStatus();
                // console.log("Clicked", event)
            });
        });
        // const checkButton = item.querySelector('[data-done]');
    });

}


const findItemIndex = function(localStorageArray, item){
    const spanDataTimeSelected = item.querySelector('[data-time]').getAttribute("data-time");
    const itemIndex = localStorageArray.findIndex(element => element.addedAt == spanDataTimeSelected)
    return itemIndex
    // const spanDataTimeNodeList = document.querySelectorAll("[data-time]");
    // const spanDataTimeArray = Array.prototype.slice.call(spanDataTimeNodeList);
    // const spanSelected = spanDataTimeArray.filter(spanElement => spanElement.getAttribute("data-time") == spanDataTimeSelected);
    // console.log(spanSelected);
    // console.log("***********");
}


const changeStatus = function(item){
    if(item.isDone){
        item.isDone = false;
    } else {
        item.isDone = true;
    }
}


const deleteItem = function(localStorageArray, itemIndex){
    localStorageArray.splice(itemIndex, 1);
}

// Creating Variables from DOM elements
const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemsList = document.querySelector("#itemsList");
const filters = document.querySelectorAll(".nav-item");



// Create the Empty Item List
let toDoItems = [];

document.addEventListener("DOMContentLoaded", () => {
    addAnItemTask(form, itemInput, toDoItems, itemsList);
    getLocalStorage(toDoItems, itemsList);
    const toDoItemsList = getLocalStorage(toDoItems, itemsList);
    insertHandleToActionIcons(toDoItemsList, itemsList);
});





