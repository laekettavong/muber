import { assert } from 'chai'
import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'
const Driver = mongoose.model('driver')

describe('DriversController Test', () => {
    it('POST to \'/api/drivers\' creates a new driver', (done) => {
        Driver.count().then(count => {
            request(app)
                .post('/api/drivers')
                .send({ email: 'test@test.com' })
                .end(() => {
                    Driver.count().then(newCount => {
                        assert.equal(count + 1, newCount)
                    })
                    done()
                })
        })
    })

    it('PUT to \'/api/drivers/:id\' edits an existing driver', (done) => {
        const driver = new Driver({ email: 'foo@foo1.com' })
        driver.save().then(() => {
            request(app)
                .put(`/api/drivers/${driver._id}`)
                .send({ driving: true })
                .end(() => {
                    Driver.findOne({ email: driver.email })
                        .then(driver => {
                            assert.isTrue(driver.driving)
                            done()
                        })
                })
        })
    })

    it('DELETE to \'/api/drivers/:id\' can delete a driver', (done) => {
        const driver = new Driver({ email: 'bar@bar.com' })
        driver.save().then(() => {
            request(app)
                .delete(`/api/drivers/${driver._id}`)
                .end(() => {
                    Driver.findOne({ email: driver.email })
                        .then(driver => {
                            assert.isNull(driver)
                            done()
                        })
                })
        })
    })

    xit('GET to \'/api/drivers\' finds drivers in a location', (done) => {
        const seattleDriver = new Driver({
            email: 'seattle@test.com',
            geometry: { type: 'Point', coordindates: [-122.4759902, 47.6147628] }
        })

        const miamiDriver = new Driver({
            email: 'miami@test.com',
            geometry: { type: 'Point', coordindates: [80.253, 25.791] }
        })

        Promise.all([seattleDriver.save(), miamiDriver.save()])
            .then(() => {
                request(app)
                    .get('/api/drivers?lng=80&lat=25')
                    .end((err, response) => {
                        assert.equal(response.body.length, 1)
                        assert.equal(response.body[0].obj.email, 'miami@test.com')
                        done()
                    })
            })
    })
})