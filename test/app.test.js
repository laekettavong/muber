import { assert } from 'chai'
import request from 'supertest'
import app from '../app'

describe('Express App Test', () => {
    it('handles a GET request to \'/api\'', (done) => {
        request(app)
            .get('/api')
            .end((err, response) => {
                assert.equal(response.body.msg, 'Hello World')
                assert.equal(response.statusCode, 200)
                done()
            })
    })
})
