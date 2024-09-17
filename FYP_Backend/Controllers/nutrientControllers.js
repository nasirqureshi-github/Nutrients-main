const nutrientModel = require('../Models/nutrientModel');
const Province = require('../Models/ProvinceModel');
const Nutritional = require('../Models/Nutritional');
const City = require('../Models/City');
const Food = require('../Models/Food');
const Price = require('../Models/Price');


const SourceNutritional = require('../Models/SourceNutrents');

exports.getnutrient = async (req, res) => {
    try {
        const getnutrient = await nutrientModel.find();
        if (getnutrient.length > 0) {
            return res.json({
                status: 200,
                message: "Nutrients found",
                data: getnutrient
            });
        } else {
            return res.json({
                status: 404,
                message: "No nutrients found",
                data: []
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message
        });
    }
};
exports.Provience_ = async (req, res) => {
    try {
        const getnutrient = await Province.find();
        if (getnutrient.length > 0) {
            return res.json({
                status: 200,
                message: "Province found",
                data: getnutrient
            });
        } else {
            return res.json({
                status: 404,
                message: "No Province found",
                data: []
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message
        });
    }
};
exports.getSource = async (req, res) => {
    try {

        let { name } = req.params;

        const foods = await Food.find({}, `${name} foodName category likelyToEatIn quantity unit`);

        // Check if any documents were found
        if (foods.length > 0) {
            return res.status(200).json({
                count: foods.length,
                success: true,
                message: 'Source data retrieved successfully!',
                data: foods
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'No food data found'
            });
        }
    } catch (error) {
        console.error('Error retrieving nutritional data:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve nutritional data',
            error: error.message
        });
    }
};
exports.updateSource = async (req, res) => {
    console.log('sasasas')
    try {
        let { id } = req.params;
        console.log('id', id)
        // Find the existing food item
        const food = await Food.findById(id);
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        console.log('food', food)
        // Update the food item
        const updatedFood = await Food.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedFood) {
            return res.status(500).json({ message: 'Failed to update food item' });
        }

        // Send the updated data
        res.status(200).json({ message: 'Food item updated successfully', data: updatedFood });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.deletgetallsourceeSource = async (req, res) => {
    try {

        let { name } = req.params;

        const foods = await Food.find();

        // Check if any documents were found
        if (foods.length > 0) {
            return res.status(200).json({
                count: foods.length,
                success: true,
                message: 'Source data retrieved successfully!',
                data: foods
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'No food data found'
            });
        }
    } catch (error) {
        console.error('Error retrieving nutritional data:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve nutritional data',
            error: error.message
        });
    }
};
exports.deleteSource = async (req, res) => {

    try {
        let { id } = req.params;

        const food = await Food.findById(id);
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        // Update the food item
        const updatedFood = await Food.findByIdAndDelete(id);
        if (!updatedFood) {
            return res.status(500).json({ message: 'Failed to Delete food item' });
        }

        // Send the updated data
        res.status(200).json({ message: 'Food item Deleted successfully' });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: 'Server error', error });
    }
}

exports.Nutritional_ = async (req, res) => {
    try {
        // Fetch all nutritional data from the database and populate the n_id field
        const getnutrient = await Nutritional.find().populate('n_id');

        if (getnutrient.length > 0) {
            // If data is found, respond with status 200 and data
            return res.json({
                status: 200,
                message: "Data found",
                count: getnutrient.length,
                data: getnutrient
            });
        } else {
            // If no data is found, respond with status 404 and empty data array
            return res.json({
                status: 404,
                message: "No Data found",
                data: []
            });
        }
    } catch (error) {
        // Handle errors (e.g., database connection issues)
        console.error('Error fetching nutritional data:', error);
        return res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message
        });
    }

};

exports.addSource = async (req, res) => {
    try {
        const { foodName } = req.body;

        // Check if a source with the given name already exists
        const existingSource = await Food.findOne({ foodName });

        if (!existingSource) {
            // If the source does not exist, create a new source
            const newSource = new Food(req.body);
            const savedSource = await newSource.save();

            // Respond with success and the saved source data
            return res.status(201).json({
                success: true,
                message: 'Source added successfully!',
                data: savedSource,
            });
        } else {
            // If the source already exists, respond with an error
            return res.status(400).json({
                success: false,
                message: 'Source with this name already exists',
            });
        }
    } catch (error) {
        console.error('Error adding source:', error);

        // Handle errors that occur during the process
        return res.status(500).json({
            success: false,
            message: 'Failed to add source',
            error: error.message,
        });
    }
};
exports.addPrice = async (req, res) => {
    try {
        const { source, city, quantity, price, unit, image } = req.body;
        // dozen
        // Validate the input
        if (!source || !city || !quantity || !price || !unit) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        // Check if a price entry with the same source and city already exists
        const existingPrice = await Price.findOne({ source, city });

        if (existingPrice) {
            // If an entry already exists, respond with a message
            return res.status(400).json({
                success: false,
                message: 'Price entry for this source and city already exists',
            });
        }
        let newPrice_ = unit === 'dozen' ? price / 12 : price / 10;
        // Create a new price entry
        const newPrice = new Price({
            source,
            city,
            quantity,
            price: newPrice_,
            unit,
        });
        if (image) {
            const update_food = await Food.findByIdAndUpdate({ _id: source }, { image }, { new: true })
        }
        const savedPrice = await newPrice.save();

        // Respond with the newly created price entry
        return res.status(201).json({
            success: true,
            data: savedPrice,
        });
    } catch (error) {
        console.error('Error adding price:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add price',
        });
    }
};

exports.getPrices = async (req, res) => {
    try {
        // Retrieve the city ID from query parameters
        const { city } = req.query;

        // Construct query object based on whether city ID is provided
        const query = city ? { city } : {};

        // Find prices based on the query and populate the 'source' and 'city' fields
        const prices = await Price.find(query)
            .populate({
                path: 'source',
            })
            .populate({
                path: 'city',
            });

        // Respond with the list of prices
        return res.status(200).json({
            success: true,
            data: prices,
        });
    } catch (error) {
        console.error('Error retrieving prices:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve prices',
        });
    }
};


exports.updatePrices = async (req, res) => {
    const { id } = req.params;
    console.log('id', id)
    const { quantity, price, unit } = req.body;
    try {
        const updatedPrice = await Price.findByIdAndUpdate(id, { quantity, price, unit }, { new: true });
        res.json({ message: 'Price updated successfully', data: updatedPrice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



exports.getAllSources = async (req, res) => {
    const { pid, nid } = req.body; // Extract `pid` and `nid` from request body

    try {
        // Build query object based on provided `nid`
        const query = {};
        if (nid) query.nid = nid;

        // Find sources with optional filters and populate the fields
        const sources = await SourceNutritional.find(query)
            .populate('nid', 'name') // Populate Nutrient name
            .populate('prices.province', 'name') // Populate Province name in prices array
            .exec();
        // console.log({ sources })
        // Process sources to include only the price for the specific province
        const processedSources = sources.map(source => {
            // Find the price for the specified province
            console.log(source.prices[0]?.province._id.toString())

            const priceEntry = source.prices.find(price => price.province._id.toString() === pid);
            console.log({ priceEntry })
            return {
                _id: source._id,
                name: source.name,
                nid: source.nid.name,
                price: priceEntry ? priceEntry.price : '-',
                image: source.image,
                pid: priceEntry ? priceEntry.province.name : '-', // Get province name from priceEntry
                unit: source.unit
            };
        });

        res.status(200).json({
            success: true,
            data: processedSources
        });
    } catch (error) {
        console.error('Error fetching sources:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sources',
            error: error.message
        });
    }
};



exports.getCities = async (req, res) => {
    try {
        const cities = await City.find();
        res.json({ success: true, data: cities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add a new city
exports.addCities = async (req, res) => {
    try {
        const newCity = new City(req.body);
        const city = await newCity.save();
        res.json({ success: true, data: city });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a city
exports.updateCities = async (req, res) => {
    try {
        const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!city) {
            return res.status(404).json({ success: false, message: 'City not found' });
        }
        res.json({ success: true, data: city });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a city
exports.deleteCities = async (req, res) => {
    try {
        const city = await City.findByIdAndDelete(req.params.id);
        if (!city) {
            return res.status(404).json({ success: false, message: 'City not found' });
        }
        res.json({ success: true, message: 'City deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};























// exports.updateSource = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, unit, price, image, pid, nid } = req.body;

//         // Find the source by id
//         const source = await SourceNutritional.findById(id);

//         if (!source) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Source not found',
//             });
//         }

//         // Update other fields
//         if (name) source.name = name;
//         if (unit) source.unit = unit;
//         if (image) source.image = image;
//         if (nid) source.nid = nid;

//         // Update or add the price for the given province
//         if (pid && price !== undefined) {
//             // Check if the price entry for the province already exists
//             const priceEntry = source.prices.find(p => p.province.toString() === pid);

//             if (priceEntry) {
//                 // Update existing price entry
//                 priceEntry.price = Number(price);
//             } else {
//                 // Add new price entry
//                 source.prices.push({
//                     province: pid,
//                     price: Number(price)
//                 });
//             }
//         }

//         // Save the updated source
//         const updatedSource = await source.save();

//         // Respond with the updated source
//         res.status(200).json({
//             success: true,
//             message: 'Source updated successfully!',
//             data: updatedSource
//         });
//     } catch (error) {
//         console.error('Error updating source:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to update source',
//             error: error.message
//         });
//     }
// };


exports.getAllSourcesNutritional = async (req, res) => {
    try {
        // Find sources and populate the related fields
        const sources = await SourceNutritional.find()
            .populate('nid', 'name') // Populate Nutrient name
            .populate('prices.province', 'name') // Populate Province name in prices array
            .exec();
        console.log(sources[0].prices)

        // Process sources to format the response data
        const processedSources = sources.map(source => {
            return {
                _id: source._id,
                name: source.name,
                unit: source.unit,
                image: source.image,
                nid: source.nid ? source.nid.name : '-', // Nutrient name or '-' if not available
                price: source.prices.map(priceEntry => {
                    console.log(priceEntry)
                    return {
                        province: priceEntry.province ? priceEntry.province.name : '-', // Province name or '-' if not available
                        price: priceEntry.price
                    }
                })
            };
        });
        console.log({ processedSources })

        res.status(200).json({
            success: true,
            data: processedSources
        });
    } catch (error) {
        console.error('Error fetching sources:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sources',
            error: error.message
        });
    }
};


exports.deletesource = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the source by ID and delete it
        const source = await SourceNutritional.findByIdAndDelete(id);

        if (!source) {
            return res.status(404).json({ success: false, message: 'Source not found' });
        }

        // // Optionally: If you have an image, you might want to delete it from the server
        // if (source.image) {
        //     const fs = require('fs');
        //     const path = require('path');
        //     const imagePath = path.join(__dirname, '..', 'uploads', source.image);

        //     if (fs.existsSync(imagePath)) {
        //         fs.unlinkSync(imagePath);
        //     }
        // }

        res.json({ success: true, message: 'Source deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}