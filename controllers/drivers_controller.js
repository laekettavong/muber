import Driver from '../models/driver'

class DriversController {
    static greeting = (req, res) => {
        res.send({ msg: 'Hello World' })
    }

    static index = (req, res, next) => {
        const { lng, lat } = req.query
        Driver.geoNear(
            { type: "Point", coordinates : [Number.parseFloat(lng), Number.parseFloat(lat)] },
            { maxDistance : 200000, spherical : true }
        )
        .then(drivers => res.send(drivers))
        .catch(next)
    }

    static create = (req, res, next) => {
        const driverProps = req.body
        Driver.create(driverProps)
            .then(driver => res.send(driver))
            .catch(next)
    }

    static edit = (req, res, next) => {
        const _id = req.params.id
        const driverProps = req.body
        Driver.findByIdAndUpdate({ _id }, driverProps)
            .then(() => Driver.findById({ _id }))
            .then((driver) => res.send(driver))
            .catch(next)
    }

    static delete = (req, res, next) => {
        const _id = req.params.id
        Driver.findByIdAndRemove({ _id })
            .then(driver => res.status(204).send(driver))
            .catch(next)
    }
}

module.exports = DriversController