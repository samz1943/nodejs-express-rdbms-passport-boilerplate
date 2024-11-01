const tokenStore = require('./testStore')
const app = require('../src/index')
const chai = require("chai")
const chaiHttp = require("chai-http")
const db = require('../src/models')

chai.use(chaiHttp);

describe('/GET Post', function() {
  it('it should get all the post', function(done) {
    const token = tokenStore.getUserToken();
    chai.request(app)
      .get('/api/post')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);

        res.should.have.status(200);
        res.body.should.have.property('message', 'Posts retrieved successfully')

        res.body.should.have.property('data').that.is.an('array');
        res.body.data.forEach((post) => {
          post.should.have.property('id').that.is.a('number');
          post.should.have.property('title').that.is.a('string');
          post.should.have.property('content').that.is.a('string');

          // Check `publishedBy` object structure
          post.should.have.property('publishedBy').that.is.an('object');
          post.publishedBy.should.have.property('id').that.is.a('number');
          post.publishedBy.should.have.property('username').that.is.a('string');
          post.publishedBy.should.have.property('email').that.is.a('string');
          
          // Check date fields
          post.should.have.property('createdAt').that.is.a('string');
          post.should.have.property('updatedAt').that.is.a('string');
        });

        done();
      });
  });
});

describe('/POST Post', function() {
  it('it should create post', function(done) {
    const token = tokenStore.getUserToken();
    chai.request(app)
      .post('/api/post')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'test create', content: 'test create post successful' })
      .end(async (err, res) => {
        if (err) return done(err);

        res.should.have.status(201);
        res.body.should.have.property('message', 'Post created successfully')

        try {
          // Query the database to check if the post was created
          const post = await db.Post.findOne({
            where: { title: 'test create', content: 'test create post successful' }
          });

          // Assert the post was found and has the correct properties
          post.should.exist;
          post.should.have.property('title', 'test create');
          post.should.have.property('content', 'test create post successful');

          // Optionally, clean up the test data
          await post.destroy();

          done();
        } catch (dbErr) {
          done(dbErr); // Pass any database errors to Mocha
        }
      });
  });
});