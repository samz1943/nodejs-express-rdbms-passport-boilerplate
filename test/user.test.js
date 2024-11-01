const tokenStore = require('./testStore')
const app = require('../src/index')
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

describe('/GET User', function() {
  it('it should get all the users', function(done) {
    const token = tokenStore.getUserToken();
    chai
    .request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);

        res.should.have.status(200);
        res.body.should.have.property('message', 'Users retrieved successfully')

        res.body.should.have.property('data').that.is.an('array');
        res.body.data.forEach((user) => {
          user.should.have.property('id').that.is.a('number');
          user.should.have.property('username').that.is.a('string');
          user.should.have.property('email').that.is.a('string');
        });

        done();
      });
  });
});
