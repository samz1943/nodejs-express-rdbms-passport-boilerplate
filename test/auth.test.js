const tokenStore = require('./testStore')
const app = require('../src/index')
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();

chai.use(chaiHttp);

describe('/Post login', function() {
  it('should log in and receive a token', function(done) {
    chai.request(app)
      .post('/api/login')
      .send({ email: 'user1@example.com', password: '1234' })
      .end((err, res) => {
        if (err) return done(err);

        res.should.have.status(200);
        res.body.should.have.property("accessToken")
        
        tokenStore.setUserToken(res.body.accessToken);
        done();
      });
  });

  it('should return 401 for invalid credentials', function(done) {
    chai.request(app)
      .post('/api/login')
      .send({ email: 'user1@example.com', password: 'wrongpassword' })
      .end((err, res) => {
        if (err) return done(err);

        res.should.have.status(401);
        res.body.should.have.property('message', 'Incorrect password')
        
        done();
      });
  });
});
