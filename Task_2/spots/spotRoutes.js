
import { getSpotsByParameters } from "./spotController.js"

export default function (router) {

    router.get('/spots/latitude/:latitude/longitude/:longitude/radius/:radius/type/:type', async (req, res) => {
        try {
            const latitude = req.params.latitude
            const longitude = req.params.longitude
            const radius = req.params.radius
            const type = req.params.type
            const result = await getSpotsByParameters(latitude, longitude, radius, type)
            return res.status(result.code).json(result.data)
        } catch (error) {
            return res.status(error.code).json(error.data)

        }
    })
}
