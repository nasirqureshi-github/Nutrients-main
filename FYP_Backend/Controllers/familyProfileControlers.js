const FamilyMember = require('../Models/FamilyMember');
const User = require('../Models/UserModel');
const Budget = require('../Models/Budget')
const Nutritional = require('../Models/Nutritional');
const Price = require('../Models/Price');



exports.addFamilMembers = async (req, res) => {
    const { data } = req.body;
    const familydata = Array.isArray(data);
    if (!familydata) {
        return res.status(404).json({ status: 404, message: "Invalid json" })
    }
    let familyStatus = true;
    const mydata = data.map((dta) => {
        if (!dta?.name || !dta?.gender || !dta?.dob || !dta?.maritalStatus || !dta?.lactationStatus || !dta?.familyStatus || !dta?.userid || !dta?.city) {
            familyStatus = false;
            return res.status(404).json({
                status: 404, message: "Provide All Fields",
                fields: {
                    name: {
                        type: String,
                        required: true,
                    },
                    gender: {
                        type: String,
                        enum: ['Male', 'Female', 'Other'],
                        required: true,
                    },
                    dob: {
                        type: Date,
                        required: true,
                    },
                    maritalStatus: {
                        type: String,
                        enum: ['Married', 'Unmarried', 'Divorced', 'Widowed'],
                        required: true,
                    },
                    lactationStatus: {
                        type: String,
                        enum: ['Pregnant', 'Lactating', 'None'],
                        default: 'None',
                    },
                    familyStatus: {
                        type: String,
                        enum: ['Father', 'Mother', 'Brother', 'Sister', 'Wife', 'Husband', 'Son', 'Daughter'],
                        required: true,
                    },
                    userid:
                    {
                        ref: 'User',
                    },
                }
            })
        } else {
            return dta
        }
    })
    if (familyStatus) {
        const newMember = await FamilyMember.insertMany(mydata);
        return res.status(200).json({ status: 200, Members: newMember })
    } else {
        return res.status(404).json({ status: 404, message: "Invalid json" })
    }
}
function calculateAge(birthDateString) {
    const today = new Date();
    const birthDate = new Date(birthDateString);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}
function classifyAge(age) {
    if (age >= 0 && age <= 0.5) return "0-6 m";
    if (age > 0.5 && age <= 1) return "7-12 m";
    if (age > 1 && age <= 3) return "1-3 year";
    if (age > 3 && age <= 8) return "4--8 year";
    if (age > 8 && age <= 13) return "9-13 year";
    if (age > 13 && age <= 18) return "14-18 year";
    if (age > 18 && age <= 30) return "19-30 year";
    if (age > 30 && age <= 50) return "31-50 year";
    if (age > 50 && age <= 70) return "51-70 year";
    if (age > 70) return "71-100 year";
    return "Unknown";
}
exports.getFamilMembers = async (req, res) => {
    const { id } = req.params;
    console.log('id', id);

    try {

        const user = await User.findById({ _id: id }).populate('city');
        if (!user) {
            return res.status(404).json({ status: 404, message: "User Not Found" });
        }
        const age = calculateAge(user.DoB);
        const ageCategory = classifyAge(age);
        let nutrients_ = await Nutritional.find({ age: ageCategory });
        nutrients_ = nutrients_.filter(dta => {
            if (dta.Group === 'Pregnancy' || dta.Group === 'Lactation') {

            } else {
                return dta
            }
        });

        const familyMembers = await FamilyMember.find({ userid: id }).populate('city')
        if (!familyMembers || familyMembers.length === 0) {
            return res.status(404).json({ status: 404, message: "Not Found" });
        }
        // Use Promise.all to handle asynchronous operations
        const updatedFamilyMembers = await Promise.all(familyMembers.map(async (data) => {
            const age = calculateAge(data.dob);
            const ageCategory = classifyAge(age);

            // Determine nutrients based on lactation status or age category
            let nutrients;
            if (data.lactationStatus === 'Pregnancy' || data.lactationStatus === 'Lactation') {
                nutrients = await Nutritional.find({ Group: data.lactationStatus });
            } else {
                nutrients = await Nutritional.find({ age: ageCategory, });
                nutrients = nutrients.filter(dta => {
                    if (dta.Group === 'Pregnancy' || dta.Group === 'Lactation') {

                    } else {
                        return dta
                    }
                });
            }

            // Convert Mongoose document to plain object for merging
            return {
                ...data.toObject(),
                nutrients
            };
        }));

        return res.status(200).json({ status: 200, currentUser: [user, { nutrients: nutrients_ }], data: updatedFamilyMembers });
    } catch (error) {
        console.error("Error fetching family members:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};

exports.UsedNeutrents = async (req, res) => {
    const source = await Price.find({ city: req.params?.id }).populate('source').populate('city');
    if (source) {
        return res.status(200).json({ data: source })

    } else {
        return res.status(404).json({ status: 404, message: "Not Found" })

    }

}
exports.addSourseToDaily = async (req, res) => {
    const { userid, fid, prices } = req.body;
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const date_ = `${day}/${month}/${year}`;

    try {
        let todayEntry;

        if (!fid) { // For the case when fid is not provided
            todayEntry = await Budget.findOneAndUpdate(
                { userid, date_, memberId: null, usertype: 'USER' }, // Looking for the existing entry
                { prices }, // Updating the prices
                { new: true }
            );

            if (!todayEntry) { // If no existing entry found, create a new one
                todayEntry = await Budget.create({ userid, prices, date_, usertype: 'USER' });
            }
        } else { // For the case when fid is provided
            todayEntry = await Budget.findOneAndUpdate(
                { userid, date_, memberId: fid, usertype: 'MEMBER' }, // Looking for the existing entry
                { prices }, // Updating the prices
                { new: true }
            );

            if (!todayEntry) { // If no existing entry found, create a new one
                todayEntry = await Budget.create({ userid, prices, memberId: fid, date_, usertype: 'MEMBER' });
            }
        }

        await todayEntry.save();
        return res.status(200).json({ Source: todayEntry });

    } catch (error) {
        console.error('Error in addSourseToDaily:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
exports.getSourseToDaily = async (req, res) => {
    const { userid, fid } = req.body;

    try {
        if (!fid && userid) {
            console.log('userid', userid);

            // Find all users based on userid and usertype
            const users = await Budget.find({ userid, usertype: "USER" }).exec();
            
            if (!users || users.length === 0) {
                return res.status(404).json({ message: "User not Found" });
            }

            // Fetch price details for each price ID in each user document
            const allPriceDetailsPromises = users.flatMap(user =>
                (user.prices || []).map(async (pricId) => {
                    return await Price.findById(pricId).exec();
                })
            );

            // Resolve all price details
            const allPriceDetails = await Promise.all(allPriceDetailsPromises);

            return res.status(200).json({ users, priceDetails: allPriceDetails });
        } else {
            // Find all users based on userid, fid, and usertype
            const users = await Budget.find({ userid, memberId: fid, usertype: "MEMBER" }).exec();
            
            if (!users || users.length === 0) {
                return res.status(404).json({ message: "Member not Found" });
            }

            // Fetch price details for each price ID in each user document
            const allPriceDetailsPromises = users.flatMap(user =>
                (user.prices || []).map(async (pricId) => {
                    return await Price.findById(pricId).exec();
                })
            );

            // Resolve all price details
            const allPriceDetails = await Promise.all(allPriceDetailsPromises);

            return res.status(200).json({ users, priceDetails: allPriceDetails });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


