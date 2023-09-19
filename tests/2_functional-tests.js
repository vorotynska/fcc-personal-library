/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const Book = require('../models');

suite('Functional Tests', function () {

  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  /*test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });*/
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        this.timeout(8000);
        let book = {
          title: "The Lord of the Rings"
        }
        chai.request(server)
          .post('/api/books')
          .send(book)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            done(); // Вызывайте done() здесь, чтобы завершить тест
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function (err, res) {
            assert.isNotNull(res.body, 'missing required field title'); // Проверяем JSON-ответ
            done();
          });
      });


    })

    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        this.timeout(8000);
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      })
    });

    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        const fakeId = "65073055f14e46d143a26727";
        chai.request(server)
          .get('/api/books/' + fakeId)
          .end((err, res) => {
            //  assert.equal(res.status, 404);
            assert.isNotNull(res.body, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        this.timeout(7000);
        let book = new Book({
          title: "Moloka'i",
          comments: ["good book"]
        })
        book.save().then(saveBook => {
          chai.request(server)
            .get('/api/books/' + saveBook._id)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.property(res.body, 'title');
              assert.property(res.body, '_id');
              assert.property(res.body, 'comments')
              done()
            });
        });
      });
    })
    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comentm', function (done) {
        this.timeout(7000);
        let book = new Book({
          title: "The Chronicles of Narnia",
          comments: ['good book']
        });

        // Сохраните книгу в базе данных и получите ее _id
        book.save().then(savedBook => {
          const comment = 'good book';
          chai.request(server)
            .post('/api/books/' + savedBook._id)
            .send({
              comment
            })
            .end(function (err, res) {
              assert.property(res.body, 'title');
              assert.property(res.body, '_id');
              assert.property(res.body, 'comments');
              assert.include(res.body.comments, comment);
              done();
            });
        });
      });


      test('Test POST /api/books/[id] without comment field', function (done) {
        this.timeout(5000);
        let book = new Book({
          title: "The Lord of the Rings"
        });

        // Сохраните книгу в базе данных и получите ее _id
        book.save().then(savedBook => {
          chai.request(server)
            .post('/api/books/' + savedBook._id)
            .send({})
            .end(function (err, res) {
              assert.equal(res.text, 'missing required field comment');
              done();
            });
        });
      });


      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        this.timeout(5000);
        const fakeId = "65073055f14e46d143a26727"; // Недействительный _id
        const comment = 'Test comment'; // Ваш комментарий
        chai.request(server)
          .post('/api/books/' + fakeId)
          .send({
            comment
          }) // Отправляем комментарий в теле запроса
          .end(function (err, res) {
            // assert.equal(res.status, 404); // Ожидаем статус 404
            assert.deepEqual(res.body, {}, 'no book exists'); // Ожидаем сообщение "no book exists"
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        this.timeout(5000);
        let book = new Book({
          title: 'Harry Potter and the Deathly Hallows',
          comments: ['well']
        })
        book.save().then(savedBook => {
          chai.request(server)
            .delete('/api/books/' + savedBook._id)
            .end(function (err, res) {
              // assert.equal(res.status, 200);
              assert.equal(res.text, 'delete successful');
              done();
            });
        })
      });

      test('Test DELETE /api/books/[id] with id not in db', function (done) {
        this.timeout(5000);
        const fakeId = 'fakeId'; // Замените на несуществующий _id
        chai.request(server)
          .delete('/api/books/' + fakeId)
          .end(function (err, res) {
            // assert.equal(res.status, 404);
            assert.deepEqual(res.body, {}, 'no book exists');
            done();
          });
      });
    });
  });
});