document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form-data-user");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("submit clicked");
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const STORAGE_KEY = "BOOKSHELF_APP";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser tidak support local storage, ganti browser!");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

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

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

const books = [];

const RENDER_EVENT = "render-book";

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

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun Diterbitkan: ${bookObject.year}`;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("container");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.setAttribute("type", "button");
    undoButton.innerText = "Belum Selesai Dibaca";

    undoButton.addEventListener("click", function () {
      undoFinishedBook(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.setAttribute("type", "button");
    trashButton.innerText = "Hapus Buku";

    trashButton.addEventListener("click", function () {
      removeBook(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.setAttribute("type", "button");
    editButton.innerText = "Edit";

    editButton.addEventListener("click", function () {
      editBook(bookObject);
    });

    container.append(undoButton, trashButton, editButton);
  } else {
    const finishButton = document.createElement("Button");
    finishButton.classList.add("finish-button");
    finishButton.setAttribute("type", "Button");
    finishButton.innerText = "Sudah Selesai Dibaca";

    finishButton.addEventListener("click", function () {
      addFinishedBook(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.setAttribute("type", "button");
    trashButton.innerText = "Hapus Buku";

    trashButton.addEventListener("click", function () {
      removeBook(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.setAttribute("type", "button");
    editButton.innerText = "Edit";

    editButton.addEventListener("click", function () {
      editBook(bookObject);
    });

    container.append(finishButton, trashButton, editButton);
  }
  return container;
}

function addFinishedBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoFinishedBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
}

function removeBook(bookId) {
  const confirmation = confirm("Apakah Anda yakin ingin menghapusnya?");
  if (confirmation) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

const submitFindTitleForm = document.getElementById("form-find-title-book");
submitFindTitleForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchTitle = document.getElementById("find-title").value;
  const filteredBooks = filterBooksByTitle(searchTitle);
  renderFilteredBooks(filteredBooks);
});

function filterBooksByTitle(searchTitle) {
  return books.filter((tool) =>
    tool.title.toLowerCase().includes(searchTitle.toLowerCase())
  );
}

function renderFilteredBooks(filteredBooks) {
  const unfinishedBooksList = document.getElementById("reads");
  unfinishedBooksList.innerHTML = "";

  const finishedBooksList = document.getElementById("finish-reads");
  finishedBooksList.innerHTML = "";

  for (const bookItem of filteredBooks) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) unfinishedBooksList.append(bookElement);
    else finishedBooksList.append(bookElement);
  }
}

function editBook(bookObject) {
  const newTitle = prompt("Sunting Judul Buku:", bookObject.title);
  if (newTitle != null) {
    const newAuthor = prompt("Sunting Penulis Buku:", bookObject.author);
    const newYear = prompt("Sunting Tahun Penerbitan:", bookObject.year);

    const newBookObject = generateBookObject(
      bookObject.id,
      newTitle,
      newAuthor,
      newYear,
      bookObject.isComplete
    );
    updateBook(newBookObject);
  }
}

function updateBook(newBookObject) {
  const bookTarget = findBook(newBookObject.id);
  if (bookTarget === null) return;

  bookTarget.title = newBookObject.title;
  bookTarget.author = newBookObject.author;
  bookTarget.year = newBookObject.year;
  bookTarget.isComplete = newBookObject.isComplete;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
