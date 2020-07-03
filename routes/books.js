//adapted from example in "Using Sequelize ORM With Express" Workshop example
const express = require('express');
const { Sequelize } = require('sequelize');
const router = express.Router();
const Book = require('../models').Book;
const Op = Sequelize.Op;


/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

router.get('/', (req, res, next) => {
  res.redirect("/books")
});

/* GET book listing. */
router.get('/books', asyncHandler(async (req, res) => {
  console.log("Made it here");
  const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
  res.render("books/index", { books: books, title: "Books" });
}));


router.get('/books/search', asyncHandler(async (req, res) => {
  
  const searchterm = req.query.searchtext;

  console.log(req.query.searchtext);
  
  
  const books = await Book.findAll({
    where:
    
    Sequelize.or(
      {title: {[Op.like]: "%" + req.query.searchtext + "%"}},
      {author: {[Op.like]: "%" + req.query.searchtext + "%"}},
      {genre: {[Op.like]: "%" + req.query.searchtext + "%"}},
      {year: {[Op.like]: "%" + req.query.searchtext + "%"}}
      
    ),
    order: [["createdAt", "DESC"]]
  });
  
  res.render("books/index", { books: books, title: "Books", term: searchterm });
}));


/* Create a new book form. */
router.get('/books/new', (req, res) => {
  res.render("books/new-book", { book: {}, title: "New Book" });
});


/* POST create book. */
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new-book", { book: book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }  
  }
}));

/* Edit book form. */
router.get("/books/:id", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/update-book", { book: book, title: "Update Book" });      
  } else {
    res.sendStatus(404);
  }
}));



/* Update a book. */
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books"); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/update-book", { book: book, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }
}));


/* Delete individual book. */
router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;