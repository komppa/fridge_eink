const { Client } = require("@googlemaps/google-maps-services-js")
const apiKey = Bun.env.GOOGLE_API_KEY


const client = new Client({})

const getPlaceId = async(query: string) => {
    try {
        const response = await client.findPlaceFromText({
            params: {
                input: query,
                inputtype: "textquery",
                key: apiKey,
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
                key: apiKey,
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


(async () => {
    const placeName = ""
    const placeId = await getPlaceId(placeName)
    if (placeId) {
        const openingHours = await getOpeningHours(placeId)
        console.log("Place opening hours", openingHours)
    } else {
        console.log("Place not found")
    }
})()