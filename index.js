const initializeDatabase = require("./db/db.connect"); // Import directly
const hotelModels = require("./models/hotel.models");
const Hotel = require("./models/hotel.models");
const express = require("express")
const cors = require("cors")
const corsOptions = {
    origin: "*",
    credentials: true

}

initializeDatabase(); // Call the function

const app = express()
app.use(cors(corsOptions))
app.use(express.json())


// const newHotel = {
//     name: "New Hotel",
//     category: "Mid-Range",
//     location: "123 Main Street, Frazer Town",
//     rating: 4.0,
//     reviews: [],
//     website: "https://hotel-example.com",
//     phoneNumber: "+1234567890",
//     checkInTime: "2:00 PM",
//     checkOutTime: "12:00 PM",
//     amenities: ["Laundry", "Room Service"],
//     priceRange: "$$$ (31-60)",
//     reservationsNeeded: true,
//     isParkingAvailable: true,
//     isWifiAvailable: true,
//     isPoolAvailable: false,
//     isSpaAvailable: false,
//     isRestaurantAvailable: true,
//     photos: ["https://example.com/hotel-photo1.jpg", "https://example.com/hotel-photo2.jpg"],
//   };

async function createHotel(newHotel){
    try{
        const hotel = new Hotel(newHotel)
        const saveHotel = await hotel.save()
        return saveHotel
    }
    catch (error) {
        throw error
    }
}

app.post("/hotels", async (req, res) => {
    try{
        const savedHotel = await createHotel(req.body)
        res.status(201).json({message: "Hotel added successfully."})

    }catch(error){
        res.status(500).json({error: "Failed to add Hotel."})
    }
})

app.get("/hotels", async (req, res) => {
    try{
        const hotels = await Hotel.find()
        res.json(hotels)
    }catch(error){
        res.status(500).json({error: "error while fetching data"})
    }
})

async function deleteHotel(hotelId){
    try{
        const deletedHotel = await Hotel.findByIdAndDelete(hotelId)
        return deletedHotel
    }catch(error){
        console.log(error)
    }
}

async function getHotelByName(hotelName){
    try{
        const hotel = await hotelModels.findOne({name: hotelName})
        return hotel

    }catch(error){
        console.log(error)
    }
}

app.get("/hotels/hotelByName/:hotelName", async (req, res) => {
    try{
        const hotelByName = await getHotelByName(req.params.hotelName)
        if(hotelByName !=0){
            res.status(200).json({message: "Hotel found by name.", hotel: hotelByName})
        }else{
            res.status(404).json({error: "Hotel not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to get hotel details by name."})
    }
})

app.delete("/hotels/:hotelId", async (req, res) => {
    try{
        const deletedHotel = await deleteHotel(req.params.hotelId)
        if(deleteHotel){
            res.status(201).json({message: "hotel details deleted successfully."})
        }
    } catch(error){
        res.status(500).json({error: "Failed to delete Hotel details."})
    }
})

const PORT = 5000
app.listen(PORT, () => {
    console.log("Server running on", PORT)
})

