// controllers/userController.js
const User = require('../Models/UserModel');
const { EmailFuncationality } = require("../Service/VerifyEmail");
const { validationResult } = require('express-validator');
const { generateToken } = require("../Config/jwtToken");
const { generateOtpToken } = require("../Config/otpToken");
const { generateRefreshToken } = require("../Config/refreshtoken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Controller function to create a new user
function generateOTP() {
    var characters = 'ABCDEFGHiJKLMNOPQRSTUVWXYZabcdefghijkLmnopqrstuvwxyz0123456789@$';
    var otp = '';
    for (var i = 0; i < 6; i++) {
        otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
}
exports.createUser = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send({ status: 400, errors: result.array() });
    }
    try {

        let finduser = await User.findOne({ email: req.body.email })
        if (finduser) {
            return res.send({
                status: 400,
                errors: [{
                    "type": "field",
                    "value": req.body.email,
                    "msg": "User Already Exist",
                    "path": "email",
                    "location": "body"
                }]
            });
        }
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            age: req.body.age,
            DoB: req.body.DoB,
            Areyou: req.body.Areyou,
            Province: req.body?.Province
        });
        const newUser = await user.save();

        const otp = generateOTP();
        console.log({ otp })
        let otpToken = generateOtpToken({ id: newUser._id, email: newUser.email });
        var otpArray = otp.split('');
        const updateuser = await User.findByIdAndUpdate(
            newUser._id,
            {
                otpCode: otp,
            },
            { new: true }
        );
        let emailsend = await EmailFuncationality(newUser.email, "OTP Varification", `<!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  background-color: #f2f2f2;
                  font-family: 'Roboto', Arial, sans-serif;
              }

              .container {
                  max-width: 600px;
                  margin: 40px auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                  border:1px solid #004e92;
              }

              .header {
                  background-color: #004e92;
                  color: #ffffff;
                  padding: 40px 20px;
                  text-align: center;
                  font-size: 24px;
                  font-weight: bold;
                  position: relative;
              }

              .header::after {
                  content: '';
                  display: block;
                  width: 50px;
                  height: 4px;
                  background-color: #00aaff;
                  margin: 10px auto 0;
                  border-radius: 2px;
              }

              .content {
                  padding: 40px 20px;
                  text-align: center;
              }

              .otp-code {
                  font-size: 36px;
                  color: #004e92;
                  margin: 20px 0;
                  font-weight: bold;
                  letter-spacing: 5px;
              }

              .otp-code span {
                  position: relative;
                  display: inline-block;
              }

              .color-line {
                  position: absolute;
                  bottom: 20px;
                  left: 0;
                  width: 100%;
                  height: 4px;
                  border-radius: 2px;
              }

              .color-line.red-line {
                  background-color: #d90429;
              }

              .color-line.green-line {
                  background-color: #3cba54;
              }

              .color-line.blue-line {
                  background-color: #4285f4;
              }

              .message {
                  font-size: 16px;
                  color: #333333;
                  margin: 20px 0;
              }

              .button {
                  display: inline-block;
                  padding: 15px 30px;
                  margin: 20px 0;
                  background-color: #00aaff;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-size: 18px;
                  font-weight: bold;
                  transition: background-color 0.3s ease;
              }

              .button:hover {
                  background-color: #008fcc;
              }

              .footer {
                  background-color: #f7f7f7;
                  padding: 20px;
                  text-align: center;
                  font-size: 14px;
                  color: #777777;
              }

              .footer a {
                  color: #004e92;
                  text-decoration: none;
              }

              .footer a:hover {
                  text-decoration: underline;
              }

              @media only screen and (max-width: 600px) {
                  .content {
                      padding: 20px;
                  }

                  .otp-code {
                      font-size: 28px;
                      letter-spacing: 3px;
                  }

                  .button {
                      padding: 12px 24px;
                      font-size: 16px;
                  }
              }

              /* Unique style for H1 */
              h1 {
                  color: #004e92;
                  font-size: 32px;
                  margin-bottom: 20px;
              }
          </style>
      </head>

      <body>
          <div class="container">
              <div class="header">
                  Ecommerce
              </div>
              <div class="content">
                  <h1>OTP VERIFICATION</h1>
                  <p class="message">Please use the code below to verify your email address. This code is valid for the next
                      5 minutes.</p>
                  <div class="otp-code">
                      <span>${otpArray[0]}<span class="color-line red-line"></span></span>
                      <span>${otpArray[1]}<span class="color-line green-line"></span></span>
                      <span>${otpArray[2]}<span class="color-line blue-line"></span></span>
                      <span>${otpArray[3]}<span class="color-line red-line"></span></span>
                      <span>${otpArray[4]}<span class="color-line green-line"></span></span>
                      <span>${otpArray[5]}<span class="color-line blue-line"></span></span>
                  </div>
                 
              </div>
              
          </div>
      </body>

             </html>`);
        if (!emailsend) {
            return res.send({

                status: 400,

                errors: [{
                    "type": "field",
                    "value": "Email",
                    "msg": "Email not send Something went wrong try again",
                }]
            });
        }
        const userObj = {
            status: 201,
            message: "User Created Successfully",
            user: {
                otpToken: otpToken,
            }
        }
        return res.json(userObj);

    } catch (err) {
        return res.send({
            status: 400,
            errors: [{
                "type": "field",
                "value": "error",
                "msg": err.message,
            }]
        });
    }
};

exports.login = async (req, res) => {
    console.log("abcd", req.body)
    // Validate incoming request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ status: 400, errors: result.array() });
    }

    // Extract email and password from request body
    const { email, password } = req.body;
    console.log("body", req.body)
    try {
        // Find user by email
        let findUser = await User.findOne({ email, verify: true, role: "Admin" });
        console.log({ users: findUser })
        // If user not found, respond with error
        if (!findUser) {
            return res.status(400).json({
                status: 400,
                errors: [{
                    type: "field",
                    value: "error",
                    msg: "Invalid credentials",
                }]
            });
        }

        // Compare passwords
        if (!(await bcrypt.compare(password, findUser.password))) {
            return res.status(400).json({
                status: 400,
                errors: [{
                    type: "field",
                    value: "error",
                    msg: "Invalid credentials",
                }]
            });
        }

        // Update user document with new refresh token and set isVerified to true
        const updatedUser = await User.findByIdAndUpdate(
            { _id: findUser._id },
            {
                refreshToken: generateRefreshToken({ id: findUser._id, email: findUser.email, role: findUser.role }),
                isVerified: true,
            },
            { new: true }
        );

        // Respond with success message and user data
        return res.json({
            status: 200,
            message: "Login successfully",
            user: {
                _id: findUser._id,
                email: findUser.email,
                name: findUser.name
            },
            token: generateToken({ id: findUser._id, email: findUser.email })
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};
exports.loginuser = async (req, res) => {
    // console.log("abcd", req.body)
    // Validate incoming request
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ status: 400, errors: result.array() });
    }

    // Extract email and password from request body
    const { email, password } = req.body;
    console.log("body", req.body)
    try {
        // Find user by email
        let findUser = await User.findOne({ email, verify: true, role: "User" });
        console.log({ users: findUser })
        // If user not found, respond with error
        if (!findUser) {
            return res.status(400).json({
                status: 400,
                errors: [{
                    type: "field",
                    value: "error",
                    msg: "Invalid credentials",
                }]
            });
        }

        // Compare passwords
        if (!(await bcrypt.compare(password, findUser.password))) {
            return res.status(400).json({
                status: 400,
                errors: [{
                    type: "field",
                    value: "error",
                    msg: "Invalid credentials",
                }]
            });
        }

        // Update user document with new refresh token and set isVerified to true
        const updatedUser = await User.findByIdAndUpdate(
            { _id: findUser._id },
            {
                refreshToken: generateRefreshToken({ id: findUser._id, email: findUser.email, role: findUser.role }),
                isVerified: true,
            },
            { new: true }
        );

        // Respond with success message and user data
        return res.json({
            status: 200,
            message: "Login successfully",
            user: {
                _id: findUser._id,
                email: findUser.email,
                name: findUser.name
            },
            token: generateToken({ id: findUser._id, email: findUser.email })
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};
exports.addadmin = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send({ status: 400, errors: result.array() });
    }
    try {

        let finduser = await User.findOne({ email: req.body.email })
        if (finduser) {
            return res.send({
                status: 400,
                errors: [{
                    "type": "field",
                    "value": req.body.email,
                    "msg": "User Already Exist",
                    "path": "email",
                    "location": "body"
                }]
            });
        }
        const salt = await bcrypt.genSaltSync(10);
        const otp = generateOTP();
        const hash = await bcrypt.hash(otp, salt);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            age: req.body.age,
            DoB: req.body.DoB,
            Areyou: req.body.Areyou,
            role: "Admin",
            Province: req.body?.Province,
            city: req.body?.city,
            verify: true
        });
        const newUser = await user.save();

        var otpArray = otp.split('');

        console.log({ otp })
        let emailsend = await EmailFuncationality(newUser.email, "Your Credentials", `<!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Credentials</title>
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  background-color: #f2f2f2;
                  font-family: 'Roboto', Arial, sans-serif;
              }

              .container {
                  max-width: 600px;
                  margin: 40px auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                  border:1px solid #004e92;
              }

              .header {
                  background-color: #004e92;
                  color: #ffffff;
                  padding: 40px 20px;
                  text-align: center;
                  font-size: 24px;
                  font-weight: bold;
                  position: relative;
              }

              .header::after {
                  content: '';
                  display: block;
                  width: 50px;
                  height: 4px;
                  background-color: #00aaff;
                  margin: 10px auto 0;
                  border-radius: 2px;
              }

              .content {
                  padding: 40px 20px;
                  text-align: center;
              }

              .otp-code {
                  font-size: 36px;
                  color: #004e92;
                  margin: 20px 0;
                  font-weight: bold;
                  letter-spacing: 5px;
              }

              .otp-code span {
                  position: relative;
                  display: inline-block;
              }

              .color-line {
                  position: absolute;
                  bottom: 20px;
                  left: 0;
                  width: 100%;
                  height: 4px;
                  border-radius: 2px;
              }

              .color-line.red-line {
                  background-color: #d90429;
              }

              .color-line.green-line {
                  background-color: #3cba54;
              }

              .color-line.blue-line {
                  background-color: #4285f4;
              }

              .message {
                  font-size: 16px;
                  color: #333333;
                  margin: 20px 0;
              }

              .button {
                  display: inline-block;
                  padding: 15px 30px;
                  margin: 20px 0;
                  background-color: #00aaff;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-size: 18px;
                  font-weight: bold;
                  transition: background-color 0.3s ease;
              }

              .button:hover {
                  background-color: #008fcc;
              }

              .footer {
                  background-color: #f7f7f7;
                  padding: 20px;
                  text-align: center;
                  font-size: 14px;
                  color: #777777;
              }

              .footer a {
                  color: #004e92;
                  text-decoration: none;
              }

              .footer a:hover {
                  text-decoration: underline;
              }

              @media only screen and (max-width: 600px) {
                  .content {
                      padding: 20px;
                  }

                  .otp-code {
                      font-size: 28px;
                      letter-spacing: 3px;
                  }

                  .button {
                      padding: 12px 24px;
                      font-size: 16px;
                  }
              }

              /* Unique style for H1 */
              h1 {
                  color: #004e92;
                  font-size: 32px;
                  margin-bottom: 20px;
              }
          </style>
      </head>

      <body>
          <div class="container">
              <div class="header">
                  Ecommerce
              </div>
              <div class="content">
                  <h1>${newUser.email}</h1>
                  <p class="message">Password</p>
                  <div class="otp-code">
                      <span>${otpArray[0]}<span class="color-line red-line"></span></span>
                      <span>${otpArray[1]}<span class="color-line green-line"></span></span>
                      <span>${otpArray[2]}<span class="color-line blue-line"></span></span>
                      <span>${otpArray[3]}<span class="color-line red-line"></span></span>
                      <span>${otpArray[4]}<span class="color-line green-line"></span></span>
                      <span>${otpArray[5]}<span class="color-line blue-line"></span></span>
                  </div>
                 
              </div>
             
          </div>
      </body>

             </html>`);
        if (!emailsend) {
            return res.send({

                status: 400,

                errors: [{
                    "type": "field",
                    "value": "Email",
                    "msg": "Email not send Something went wrong try again",
                }]
            });
        }
        console.log({ newUser })
        const userObj = {
            status: 201,
            message: "User Created Successfully",
        }
        return res.json(userObj);

    } catch (err) {
        return res.send({
            status: 400,
            errors: [{
                "type": "field",
                "value": "error",
                "msg": err.message,
            }]
        });
    }
};
exports.verifyOtp = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send({ status: 400, errors: result.array() });
    }
    const { otpCode, _id } = req.user;
    console.log({ otpCode, _id })
    const { code } = req.body;

    if (otpCode !== code) {
        return res.send({
            status: 400,
            errors: [{
                "type": "field",
                "value": req.body.code,
                "msg": "Invalid Otp",
                "path": "otpCode",
                "location": "body"
            }]
        })
    }
    const updateuser = await User.findByIdAndUpdate(
        _id,
        {
            // refreshToken: generateRefreshToken({ id: newUser._id, email: newUser.email }),
            otpCode: "",
            verify: true,
        },
        { new: true }
    );
    return res.json({
        status: 200,
        message: "Email Verified Successfully"
    });
}
exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    console.log("id", id)
    let deletedUser = await User.findByIdAndDelete({ _id: id });
    if (deletedUser) {
        return res.json({
            status: 200,
            message: "User Deleted Successfully"
        });
    }

}

// Controller function to get all users
exports.getAllUsers = async (req, res) => {
    try {
        const { skip, limit, search } = req.query;

        // Convert skip and limit values to integers
        const skipInt = parseInt(skip);
        const limitInt = parseInt(limit);

        const searchCondition = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        } : {};

        // Fetch users with skip, limit, and search condition
        const users = await User.find(searchCondition).select("-password  -otpCode").skip(skipInt).limit(limitInt);
        const count = users.length;
        res.json({
            statue: 201,
            count,
            message: "Users Found",
            Users: users,
        });
    } catch (err) {
        return res.send({
            errors: [{
                "type": "field",
                "value": "error",
                "msg": err.message,
                "path": "",
                "location": ""
            }]
        });
    }
};

// Controller function to get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const id = req.user._id;
        let user = await User.findById(id)
            .select("-password  -otpCode");
        if (user) {
            return res.json({
                status: 201,
                message: "User Found",
                user
            })
        } else {
            return res.send({
                errors: [{
                    "type": "field",
                    "value": "user",
                    "msg": "User Not Found",
                    "path": "",
                    "location": ""
                }]
            });
        }
    } catch (error) {
        return res.send({
            errors: [{
                "type": "field",
                "value": "error",
                "msg": error.message,
                "path": "",
                "location": ""
            }]
        });
    }
};


exports.updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const updateFields = [
        'name',
        'phone',
        'image',
        'address',
        'facebookUrl',
        'youtubeUrl',
        'instagramUrl',
        'tiktokUrl',
        'twitterUrl',
        'agencyName',
        'agencyLogo',
        'agencyAddress',
        'agencyLandline',
        'agencyPhone',
        'agencyAbout'
    ];

    // Construct the update object
    const updateData = {};
    updateFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    });

    try {
        const userId = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select("-password -refreshToken -otpCode");

        if (!updatedUser) {
            return res.send({
                errors: [{
                    "type": "field",
                    "value": "user",
                    "msg": "User Not Found",
                    "path": "",
                    "location": ""
                }]
            });
        }

        return res.json({
            status: 201,
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (err) {
        return res.send({
            errors: [{
                "type": "field",
                "value": "user",
                "msg": "User Not Found",
                "path": "",
                "location": ""
            }]
        });
    }
};


