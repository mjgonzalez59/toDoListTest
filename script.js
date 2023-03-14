
//Add a new item to the items Array
const addAnItem = function (form, itemInput, itemsArray, elementsList) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const itemName = itemInput.value.trim();
        if(itemName.length === 0){
            alert("Please enter a task");
            return ;
        }
        const taskItem = {
            name: itemName,
            status: "toDo",
            addedAt: new Date().getTime(),
        }
        console.log(taskItem);
        addANewTask(taskItem, itemsArray, elementsList);
        renderItem(taskItem, elementsList);
        const taskElement = getActionIcons(taskItem, itemsArray, elementsList);
        insertHandleToActionIcons(taskElement, itemsArray, elementsList);
    });
}

//Load local storage items to itemsArray
const loadItems = function(itemsArray, elementsList){
    const localItems = getLocalStorage(itemsArray);
    // console.log("Local Items",localItems);
    const activeTab = getActiveTab();
    const filteredItems = getTaskStatus(activeTab, localItems);
    // console.log("Filtered Items",filteredItems);
    elementsList.innerHTML = "";
    // if(filteredItems.length > 0){
    if(filteredItems !== null || filteredItems !== undefined){
        filteredItems.forEach(item => { 
            renderItem(item, elementsList);
            const taskElement = getActionIcons(item, localItems, elementsList);
            insertHandleToActionIcons(taskElement, localItems, elementsList);
        });
    }else{
        setLocalStorage([]);
    }
}

const addANewTask = function(task, itemsArray, elementsList){
    if(task !== undefined){
        itemsArray = getLocalStorage(itemsArray);
        itemsArray.push(task);
        setLocalStorage(itemsArray);
    }
}

// Set in the local storage the items array
const setLocalStorage = function (itemsArray) {
    localStorage.setItem("todoItems", JSON.stringify(itemsArray));
}

// Get the items array saved in the Local Storage
const getLocalStorage = function(itemsArray){
    const toDoStoraged = localStorage.getItem("todoItems");
    itemsArray = toDoStoraged ? JSON.parse(toDoStoraged) : [];
    return itemsArray;
}

const updateItemLocalStorage = function (itemIndex, itemsArray) {
    const localItems = getLocalStorage(itemsArray);
    localItems[itemIndex] = itemsArray[itemIndex];
    setLocalStorage(localItems);
}

// Get the items array from local storage and set it into html elements
const renderItem = function(item, elementsList){
    let checkIcon = ""
    item.status === "toDo" ? checkIcon = "bi-check2" : checkIcon = "bi-check-circle-fill";
    // elementsList.innerHTML = "";
    // if(localStorageArray.length > 0){
    //     localStorageArray.forEach(item => {   
            const liTag = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${item.name}</span>
                <span data-time="${item.addedAt}">
                    <button class="btn iconbtn" title="data-done"><i class="bi ${checkIcon} green"></i></button>
                    <button type="button" class="btn iconbtn" title="data-edit" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bi bi-pencil blue" ></i></button>
                    <button class="btn iconbtn" title="data-delete"><i class="bi bi-x-circle-fill red"></i></button>
            </li>`
            elementsList.insertAdjacentHTML("beforeend", liTag);

    //     });
    // }else {
    //     // data-done
    //     // data-edit
    //     // data-delete
    // }
    
}

const getActionIcons = function(item, localStorageArray, elementsList){
    const dataTimeList = document.querySelectorAll('[data-time]');
    const dataTimeArray = Array.prototype.slice.call(dataTimeList);
    const spanElement = dataTimeArray.find(element => element.getAttribute('data-time') == item.addedAt);
    // const actionIcons = spanElement.querySelectorAll("button");
    return spanElement;
    // console.log("item", item);
    // console.log("localStorageArray", localStorageArray);
    // console.log("ElementsList", elementsList);
}

//Adding Event listener to ActionIcons
const insertHandleToActionIcons = function(spanElement, localStorageArray, elementsList){
    // const liList = document.querySelectorAll('.list-group-item');
    // const dataTimeList = document.querySelectorAll('[data-time]');
    // const dataTimeArray = Array.prototype.slice.call(dataTimeList);
    // const spanElement = dataTimeArray.find(element => element.getAttribute('data-time') == item.addedAt);
    const itemIndex = localStorageArray.findIndex(element => element.addedAt == spanElement.getAttribute('data-time'));
    const actionIcons = spanElement.querySelectorAll("button");
    // liList.forEach(item => {
        // const actionIcons = liTag.querySelectorAll("a");
        // console.log(dataTimeArray);
        actionIcons.forEach(actionIcon => {
            actionIcon.addEventListener("click", (event) => {
                event.preventDefault();
                localStorageArray = getLocalStorage(localStorageArray);
                // const itemIndex = findItemIndex(localStorageArray, item);
                // console.log(actionIcon.querySelector('[data-done]'));
                // console.log(actionIcon.querySelector('[name]'));
                // console.log(actionIcon.querySelector('.name'));
                // console.log(actionIcon.querySelector('.data-done'));
                if(actionIcon.title === "data-done"){
                    changeStatus(localStorageArray[itemIndex], actionIcon);
                    updateItemLocalStorage(itemIndex, localStorageArray, elementsList);
                    loadItems(localStorageArray, elementsList);
                    // setLocalStorage(localStorageArray);
                }else if(actionIcon.title === "data-delete"){
                    deleteItem(localStorageArray, itemIndex);
                    setLocalStorage(localStorageArray);
                    // updateItemLocalStorage(itemIndex, localStorageArray);
                    loadItems(localStorageArray, elementsList);
                    // getList(localStorageArray, elementsList);
                }else if(actionIcon.title === "data-edit"){
                    editItemInput.value = localStorageArray[itemIndex].name;
                    const modalForm = document.querySelector("#modalForm");
                    getArrayUpdated(modalForm, itemIndex, localStorageArray, elementsList);
                    // setLocalStorage(localStorageArray);
                    // loadItems(localStorageArray, elementsList);
                    // const modalComponent = document.querySelector("exampleModalCenter");
                    // document.querySelector("#objIndex").value = localStorageArray.indexOf(item);
                }
                // console.log(document.querySelectorAll('[linkedas]'));
                // console.log(document.querySelectorAll('.linkedas'));

                // console.log("After", itemSelected);
                // spanDataTimeNodeList.forEach(spanElement => {
                //     console.log(spanElement.getAttribute("data-time"))
                // });
                // changeStatus();
                // console.log("Clicked", event)
            });
        });
    // });

}

const getArrayUpdated = function(form, itemIndex, localStorageArray, elementsList){
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        updateName(localStorageArray[itemIndex], editItemInput.value);
        setLocalStorage(localStorageArray);
        loadItems(localStorageArray, elementsList);
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


const changeStatus = function(item, actionIcon, elementsList){
    let currentClass;
    let newClass;
    if(item.status === "toDo"){
        currentClass = "bi-check2";
        newClass = "bi-check-circle-fill";
        item.status = "done";
    }else{
        currentClass = "bi-check-circle-fill";
        newClass = "bi-check2";
        item.status = "toDo";
    }
    actionIcon.firstElementChild.classList.replace(currentClass, newClass);
}

const updateName = (item, newName) => item.name = newName;


const deleteItem = function(localStorageArray, itemIndex){
    localStorageArray.splice(itemIndex, 1);
}

const showTab = function(tabElement){
    // tabElement.classList.add("active");
    tabElement.firstElementChild.classList.add("active");
}

const hideAllTabs = function(tabsList){
    tabsList.forEach(tab => {
        // tab.classList.remove("active");
        tab.firstElementChild.classList.remove("active");
    });
}


const loadTabs = function(tabsList, itemsArray, elementsList){
    if(tabsList !== null || tabsList !== undefined){
        tabsList.forEach(tab => {
            tab.addEventListener("click", event => {
                event.preventDefault();
                hideAllTabs(tabsList);
                showTab(tab);
                loadItems(itemsArray, elementsList);
            });
        });
    }
}

const getTaskStatus = function(tab, itemsArray){
    const dataType = tab.getAttribute('data-type');
    if(dataType == "all"){
        return itemsArray;
    }
    const itemsFiltered = itemsArray.filter(task => task.status == dataType);
    // console.log();
    return itemsFiltered;
        // console.log(spanElement.getAttribute("data-time"))
}

const getActiveTab = function(){
    const navigationTabs = document.querySelectorAll(".nav-item button");
    let activeTab;
    navigationTabs.forEach(button => {
        if(button.getAttribute("class") === "nav-link active"){
            activeTab = button.parentElement;
        }
    });
    return activeTab;
}

// Creating Variables from DOM elements
const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const editItemInput = document.querySelector("#editItemInput");
const itemsList = document.querySelector("#itemsList");
const filters = document.querySelectorAll(".nav-item");
const navsTabs = document.querySelectorAll(".nav-item");


// Create the Empty Item List
let toDoItems = []




document.addEventListener("DOMContentLoaded", () => {
    loadTabs(navsTabs, toDoItems, itemsList);
    loadItems(toDoItems, itemsList);
    addAnItem(form, itemInput, toDoItems, itemsList);


    
    // const itemList = getLocalStorage(toDoItems);
    // console.log(itemList);
    // itemList.splice(0, 1); 
    // setLocalStorage(itemList);

    // const toDoItemsList = getLocalStorage(toDoItems);

    // insertHandleToActionIcons(toDoItemsList, itemsList);
});


