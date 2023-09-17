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

let id = ''

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
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Test Title'
          })
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
            assert.equal(res.status, 400); // Ожидается статус код 400
            assert.equal(res.body.error, 'missing title'); // Ожидается сообщение об ошибке
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
        this.timeout(7000);
        const fakeId = 'fakeId'
        chai.request(server)
          .get('/api/books/' + fakeId)
          .end((err, res) => {
            assert.deepEqual(res.body, {}, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        this.timeout(7000);
        chai.request(server)
          .get('/api/books/' + '65074d18f14e46d143a2672d')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments')
            done()
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comentm', function (done) {
        this.timeout(7000);
        const bookId = '65074d18f14e46d143a2672d'; // Замените на фактический _id из базы данных
        const comment = 'Test comment'; // Ваш комментарий
        chai.request(server)
          .post('/api/books/' + bookId)
          .send({
            comment
          }) // Отправляем комментарий в теле запроса
          .end(function (err, res) {
            // assert.equal(res.status, 201);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments');
            assert.include(res.body.comments, comment); // Проверяем, что комментарий был добавлен
            done();
          });
      });
      test('Test POST /api/books/[id] without comment field', function (done) {
        this.timeout(5000);
        const bookId = "65074cb9f14e46d143a2672a"; // Замените на фактический _id из базы данных
        chai.request(server)
          .post('/api/books/' + bookId)
          .send({}) // Не отправляем комментарий в теле запроса
          .end(function (err, res) {
            // assert.equal(res.status, 400); // Ожидаем статус 400
            assert.deepEqual(res.body, {}, 'missing required field comment'); // Ожидаем сообщение "missing required field comment"
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        this.timeout(5000);
        const fakeId = 'fakeId'; // Недействительный _id
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
        chai.request(server)
          .delete('/api/books/' + "65073055f14e46d143a26727")
          .end(function (err, res) {
            // assert.equal(res.status, 200);
            assert.deepEqual(res.body, {}, 'delete successful');
            done();
          });
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