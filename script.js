let modal = document.getElementById('modal');
let modalShow = document.getElementById('show-modal');
let modalClose= document.getElementById('close-modal');
let bookmarkForm = document.getElementById('bookmark-form');
let websiteNameElement = document.getElementById('website-name');
let websiteUrlElement = document.getElementById('website-url');
let bookmarksContainer = document.getElementById('bookmark-container');

let bookmarks = [];

//show modal, focus on input
// add the show modal class in css
 function showModal(){
     modal.classList.add('show-modal');
     websiteNameElement.focus();
 }

// modal event listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', ()=> modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

//validating the form
function validate(nameValue, urlValue){
    let expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    let regex = new RegExp(expression);
    if (!nameValue || !urlValue){
        alert('please submit value for both fields.');
        return false;
    } 
    if (!urlValue.match(regex)){
        alert('Please provide a valid web Address');
        return false;
    }
    return true;
}

//build bookmarks dom

function buildBookmarks(){
    //remove all bookmark elements
    bookmarksContainer.textContent  = '';
    //building the items
    bookmarks.forEach((bookmark) => {
        let { name, url} = bookmark;
        
        //creating the html elements here
         let item = document.createElement('div');
             item.classList.add('item');
        
         //the close icon
         let closeIcon = document.createElement('i');
            closeIcon.classList.add('fas', 'fa-times');
            closeIcon.setAttribute('title', 'Delete Bookmark');
            closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        
        //favicon/ link container
         let linkInfo = document.createElement('div');
         linkInfo.classList.add('name');

         //favicon
         let favicon = document.createElement('img');
            favicon.setAttribute('src', `https://www.google.com/s2/u/0/favicons?domain=${url}`);
            favicon.setAttribute('alt', 'favicon');

        //link itself now
        let link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        
        //append to bookmark container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);

    });
}

//fetch bookmark from localstorage
function fetchBookmark(){
    //get bookmark from local storage if available

    if (localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
    else {
        // create a bookmarks array in local storage
        bookmarks = [
            {
               name: 'google',
               url: 'https://google.com',
            },
             
        ];
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    }
   buildBookmarks();
}

//delete the bookmark
function deleteBookmark(url){
    bookmarks.forEach((bookmark, i)=>{
        if (bookmark.url === url){
            bookmarks.splice(i, 1);
        }
    });
    // update bookmarks array in localStorage, re-populate dom
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmark();

}

//saving bookmarks function/ handle data from form
function storeBookmark(e){
    e.preventDefault();
    let nameValue = websiteNameElement.value;
    let urlValue = websiteUrlElement.value;
// Add 'https://' if not there
    if (!urlValue.includes('https://') && !urlValue.includes('http://')){
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue, urlValue)){
        return false;
    }
    let bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmark();
    bookmarkForm.reset();
    websiteNameElement.focus();
}
//handling and validatng the form data
bookmarkForm.addEventListener('submit', storeBookmark);

//on load, fetch bookmarks
fetchBookmark();