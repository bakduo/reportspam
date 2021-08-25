const app = require('../src/app');
var expect  = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

describe('App', function() {


   describe('CRUD Message', function(){

        it('Get all messages', function (done){

            chai.request(app).
            get('/api/messages/list')
            .end(function(err,res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                done();
            })
            
        })

        it('Get one message', function (done){

            chai.request(app).
            get('/api/messages/list/6115f519bce6ce1d15aeb600')
            .end(function(err,res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                done();
            })
            
        })

        it('add one message', function (done){

            const msg = {
                message:"sample2",
                domain:"domain.tld",
                email:"sample@domain.tld",
                ip:"1.1.1.2",
                description:"desc 2",
                time:Date.now()
            };

            chai.request(app).
            post('/api/messages/save')
            .send(msg)
            .end(function(err,res){
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('SUCCESS');
                res.body.SUCCESS.should.be.a('object');
                res.body.SUCCESS.should.have.property('message');
                res.body.SUCCESS.should.have.property('domain');
                res.body.SUCCESS.should.have.property('email');
                res.body.SUCCESS.should.have.property('ip');
                res.body.SUCCESS.should.have.property('time');
                res.body.SUCCESS.message.should.equal("sample2");
                res.body.SUCCESS.domain.should.equal("domain.tld");
                res.body.SUCCESS.email.should.equal("sample@domain.tld");
                res.body.SUCCESS.ip.should.equal("1.1.1.2");
                done();
            })
            
        })
   })

}); 
