const app=require('../app');
const request=require('supertest');
const { isTypedArray } = require('util/types');

describe('GET /all_users',function(){
    it('Return list of Users ',function(done){
        request(app)
        .get('/API/auth/all_users')
        .expect(200)
        .expect((res)=>{
            console.log('Users List >>> '+JSON.stringify(res.body))
        }).end(done)
    })
})