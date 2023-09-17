/*
 *
 *
 *       Complete the API routing below
 *       
 *       
 */

'use strict';
let mongoose = require('mongoose');


module.exports = function (app) {

  const BookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    comments: [String]
  })

  const Book = mongoose.model('Book', BookSchema)

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await Book.find({})

      try {
        const format = books.map(book => {
          return {
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          }
        })
        res.send(format)
      } catch (error) {
        res.status(500).send(error)
      }

    })

    .post(async (req, res) => {
      const title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title) {
        return res.status(400).json({
          error: 'missing title'
        }); // Вернуть JSON с сообщением об ошибке
      }
      //response will contain new book object including atleast _id and title
      let book = new Book(req.body)

      try {
        await book.save()
        res.send(book)
      } catch (error) {
        res.status(500)
      }
    })

  /* .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({});
        res.status(200).send('complete delete successful');
      } catch (error) {
        console.error(error);
        res.status(500).send('error');
      }

    });
*/


  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const findBook = await Book.findById(bookid).exec();
        if (!findBook) {
          return res.status(404).send('no book exists');
        }
        res.json(findBook);
      } catch (error) {
        console.error(error);
        res.status(500).send('error');
      }
    })

    .post(async (req, res) => {
      const bookid = req.params.id;
      const comment = req.body.comment;
      //json res format same as .get
      if (!req.body.comment) {
        return res.status(400).send('missing required field comment');
      }

      try {
        const book = await Book.findById(bookid).exec();
        /*
         if (!findBook) {
         return res.status(404).send('no book exists');
         }
        */
        if (!book) {
          return res.status(404).send('no book exists');
        }

        book.comments.push(comment); // Добавляем комментарий в массив комментариев книги
        await book.save(); // Сохраняем обновленную книгу

        res.json(book); // Возвращаем обновленный объект книги
      } catch (error) {
        res.status(500).send('error')
      }
    })

    .delete(async (req, res) => {
      const bookId = req.params.id;
      // Попытка найти и удалить книгу по заданному _id
      try {
        const deletedBook = await Book.findByIdAndDelete(bookId);
        if (!deletedBook) {
          return res.status(404).send('no book exists');
        }
        res.send('delete successful');
      } catch (error) {
        res.status(500).send('internal server error');
      }
    });








};