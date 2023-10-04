import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js"
import { transformOpeningHours } from "./dataTransformers"
import express from "express"
const apiKey = Bun.env.GOOGLE_API_KEY


const client = new Client({})
const app = express()
const PORT = 3000


app.get('/hello', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

const getPlaceId = async(query: string) => {
    try {
        const response = await client.findPlaceFromText({
            params: {
                input: query,
                inputtype: PlaceInputType.textQuery,
                key: apiKey ?? "",
            },
        })

        if (response.data.candidates && response.data.candidates.length > 0) {
            return response.data.candidates[0].place_id
        }
        return null
    } catch (error) {
        console.error(error)
        return null
    }
}

const getOpeningHours = async (placeId: string, fromMemory: boolean = false) => {

    if (fromMemory) {
        // Read the opening hours from the JSON file using Bun
        const fd = Bun.file("opening_hours.json")
        if (fd) {
            return JSON.parse(await fd.text())
        }
    }
    
    try {
        const response = await client.placeDetails({
            params: {
                place_id: placeId,
                fields: ["opening_hours"],
                key: apiKey ?? "",
            },
        })

        // Write the opening hours to the JSON file using Bun
        Bun.write("opening_hours.json", JSON.stringify(response.data.result, null, 2))

        return response.data.result
    } catch (error) {
        console.error(error)
        return null
    }

}


// (async () => {
//     const placeName = ""
//     const placeId = await getPlaceId(placeName)

//     if (!apiKey) {
//         console.error("No API key provided")
//         return
//     }

//     if (placeId) {
//         const openingHours = await getOpeningHours(placeId)
//         console.log(
//             transformOpeningHours(openingHours)
//         )
//     } else {
//         console.log("Place not found")
//     }
// })()