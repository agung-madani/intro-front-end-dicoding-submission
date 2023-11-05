// Function executed when the DOM Content is loaded
document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("form-data-user");

    // Event Listener for the form submission
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("submit clicked")
        addBook();
    });
    // if (isStorageExist()) {
    //     loadDataFromStorage();
    // }
})

// const STORAGE_KEY = 'SHELFBOOKS_APPS'

// function isStorageExist() {
//     if (typeof (Storage) === undefined) {
//         alert('Browser tidak support local storage, ganti browser!');
//         return false;
//     }
//     return true;
// }

// function loadDataFromStorage() {
//     const serializedData = localStorage.getItem(STORAGE_KEY);
//     let data = JSON.parse(serializedData);

//     if (data !== null) {
//         for (const book of data) {
//             books.push(book);
//         }
//     }

//     document.dispatchEvent(new Event(RENDER_EVENT));
// }

// Function to add a new Book
function addBook() {
    const bookTitle = document.getElementById("title").value;
    const bookAuthor = document.getElementById("author").value;
    const bookYear = document.getElementById("year").value;
    const bookRead = document.getElementById("read").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(
        generatedID,
        bookTitle,
        bookAuthor,
        bookYear,
        bookRead
    );

    books.push(bookObject);
    
    // Dispatching an event for rendering the updated book list
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Function to generate a unique ID based on timestamp
function generateId() {
    return +new Date();
}

// Function to generate a book's object
function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}

// Array to store the book objects
const books = [];

// Event name for rendering the book list
const RENDER_EVENT = "render-book";

// Event Listener for rendering the book list
document.addEventListener(RENDER_EVENT, function () {
    const unfinishedBooksList = document.getElementById("reads");
    unfinishedBooksList.innerHTML = "";

    const finishedBooksList = document.getElementById("finish-reads");
    finishedBooksList.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) unfinishedBooksList.append(bookElement);
        else finishedBooksList.append(bookElement);
    }
});

// Function to create a book element
function makeBook(bookObject) {
    // Creating elements for the book item
    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = `Author: ${bookObject.author}`;

    const textYear = document.createElement("p");
    textYear.innerText = `Year Published: ${bookObject.year}`;

    // Creating containers and appendinf elements
    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("div");
    container.classList.add("container");
    container.append(textContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    // Adding event listeners for specific actions
    if (bookObject.isComplete) {
        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.setAttribute("type","button");
        undoButton.innerText = "Belum Selesai Dibaca";

        undoButton.addEventListener("click", function () {
            undoFinishedBook(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.setAttribute("type","button");
        trashButton.innerText = "Hapus Buku";

        trashButton.addEventListener("click", function () {
            removeBook(bookObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const finishButton = document.createElement("Button");
        finishButton.classList.add("finish-button");
        finishButton.setAttribute("type","Button");
        finishButton.innerText = "Sudah Selesai Dibaca";
        
        finishButton.addEventListener("click", function () {
            addFinishedBook(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.setAttribute("type","button");
        trashButton.innerText = "Hapus Buku";

        trashButton.addEventListener("click", function () {
            removeBook(bookObject.id);
        });

        container.append(finishButton, trashButton);
    }
    return container;
}