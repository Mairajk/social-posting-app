
////===============>> starting  <<=============\\\\



import express from "express";
import cors from "cors";
import path from "path";
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import {
    stringToHash,
    varifyHash,
} from "bcrypt-inzi";
import mongoose from "mongoose";
// import { type } from "os";
// import { fileURLToPath } from "url";

const SECRET = process.env.SECRET || 'secuirity';

const app = express();

const port = process.env.PORT || 5001;


const mongodbURI = process.env.mongodbURI || 'mongodb+srv://MairajK:workhardin@cluster0.sihvwcq.mongodb.net/social-app?retryWrites=true&w=majority';


// app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', "*"],
    credentials: true
}));

///////////////////////////////// USER schema and model ////////////////////////

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: String },
    profilePhoto: { type: String },
    contact: { type: String }
});


const userModel = mongoose.model('Users', userSchema);

/////////////////////////// Product model and Schema //////////////////////////////////


let postSchema = new mongoose.Schema({
    // userName: { type: String, required: true },
    postText: { type: String },
    // postImage: { type: String },
    date: { type: Date, default: Date.now }
});

const postModel = mongoose.model('posts', postSchema);


//////////////////////////////////////////////////////////////////////////////



//////////////////  SIGNUP API ////////////////////////////////////

app.post('/api/v1/signup', (req, res) => {

    let body = req.body;


    if (
        !body.firstName
        ||
        !body.lastName
        ||
        !body.email
        ||
        !body.password
    ) {
        res.status(400).send({

            message: `required fields missing, example request : 
            {
                firstName : 'Mairaj',
                lastName : 'Khan',
                email : 'abc@123.com',
                password : '*******'
            }`}
        );
        return;
    }

    req.body.email = req.body.email.toLowerCase();

    userModel.findOne({ email: body.email }, (err, user) => {
        if (!err) {
            console.log('user ===> ', user);

            if (user) {
                console.log('user exist already ===>', user);

                res.status(400).send({
                    message: 'this email is already exist please try a different one.'
                });
                return;
            } else {

                stringToHash(body.password).then(hashedPassword => {
                    userModel.create({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        email: body.email,
                        password: hashedPassword
                    },
                        (err, user) => {
                            if (!err) {
                                console.log('user created ==> ', user);

                                (user.email === ADMIN) ?
                                    res.status(201).send({
                                        message: 'user created successfully',
                                        isAdmin: true
                                    })
                                    :
                                    res.status(201).send({
                                        message: 'user created successfully',
                                        isAdmin: false
                                    });
                            } else {
                                console.log("server error: ", err);
                                res.status(500).send({
                                    message: "server error",
                                    error: err
                                });
                            }
                        });
                });
            }
        } else {
            console.log("error ===> ", err);
            res.status(500).send({
                message: "server error",
                error: err
            });
            return;
        }
    });
});
//////////////////////////////////////////////////////////////////




//////////////////  LOGIN API ////////////////////////////////////

app.post('/api/v1/login', (req, res) => {
    let body = req.body;
    body.email = body.email.toLowerCase();

    if (
        !body.password || !body.email
    ) {
        res.status(400).send({
            message: `some thing is missing in required fields `,
            example: `here is a request example :
             {
                email: "abc@123.com",
                password: "*******"
             } `
        });
        return;
    }

    userModel.findOne({ email: body.email },
        'email password firstName lastName', (err, user) => {

            if (!err) {

                console.log('user ===> ', user);

                if (user) {
                    varifyHash(body.password, user.password)
                        .then(isMatch => {
                            console.log('isMatch ===>', isMatch);
                            if (isMatch) {

                                const token = jwt.sign({
                                    id: user._id,
                                    email: body.email,
                                    iat: Math.floor(Date.now() / 1000) - 30,
                                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)

                                }, SECRET);

                                console.log('token ===> ', token);

                                res.cookie('Token', token, {
                                    maxAge: 86_400_000,
                                    httpOnly: true
                                });

                                res.send({
                                    message: 'logedin successfully',
                                    isAdmin: true,
                                    userProfile: {
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        email: user.email,
                                        _id: user._id
                                    }
                                })
                                return;

                            } else {
                                console.log("password did not match");
                                res.status(401).send({
                                    message: "wrong password"
                                });
                                return;
                            }
                        });
                } else {
                    console.log('user not found');

                    res.status(401).send({
                        message: 'incorrect email user does not exist'
                    })
                    return;
                }

            } else {
                console.log('server error ===>', err);
                res.status(500).send({
                    message: "login failed, please try again later"
                });
                return;
            }
        });
});
///////////////////////////////////////////////////////////////////




//////////////////  LOGOUT API ////////////////////////////////////

app.post('/api/v1/logout', (req, res) => {
    res.cookie('Token', '', {
        maxAge: 1,
        httpOnly: true
    });

    res.send({
        message: 'Logout successfully'
    });
});
///////////////////////////////////////////////////////////////////






//////////////////  find user for forget password API ////////////////////////////////////

app.post('/api/v1/forget-password/find-account', async (req, res) => {

    try {

        const body = req.body;
        const email = body.email;

        if (!email) {
            res.status(400).send({
                message: 'email is required',
            });
            return;
        };




    } catch (err) {
        console.log('err ===>', err);
        res.status(500).send(err);
    }
});
///////////////////////////////////////////////////////////////////


///////////////////////////*******************////////////////////////////////////////

app.use('/api/v1', (req, res, next) => {

    console.log("req.cookies: ", req.cookies);

    if (!req?.cookies?.Token) {
        res.status(401).send({
            message: "include http-only credentials with every request"
        })
        return;
    }

    jwt.verify(req.cookies.Token, SECRET, (err, decodedData) => {
        if (!err) {

            console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {

                res.status(401);
                res.cookie('Token', '', {
                    maxAge: 1,
                    httpOnly: true
                });
                res.send({ message: "token expired" })

            } else {

                console.log("token approved");

                req.body.token = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
});

///////////////////////////////////////////////////////////////////////////////



///////////////////////////// update-password API //////////////////////////////////////

app.post('/api/v1/update-password', async (req, res) => {

    try {
        const body = req.body;
        const currentPassword = body.currentPassword;
        const newPassword = body.newPassword;
        // const confirmPassword = body.confirmPassword;
        const _id = req.body.token.id;

        const user = await userModel.findOne({ _id: _id }, 'password').exec();

        if (!user) throw new Error('User not found');

        const isMatch = await varifyHash(currentPassword, user.password);
        if (!isMatch) throw new Error('Invalid current password');

        const hashedPassword = await stringToHash(newPassword);

        await userModel.findOneAndUpdate({ _id: _id }, { password: hashedPassword }).exec();

        res.status(200).send({
            message: 'password updated successfully'
        });

    } catch (error) {
        console.log('error ===>', error);

        res.status(500).send({
            message: 'password update failed',
            error: error.message
        });
    }
});

///////////////////////////////////////////////////////////////////////////////



///////////////////////////// Profile API //////////////////////////////////////

app.get('/api/v1/profile', (req, res) => {
    let body = req.body;

    console.log("req.cookies: ", req.cookies);

    if (!req?.cookies?.Token) {
        res.status(401).send({
            message: "include http-only credentials with every request"
        });
        return;
    }

    jwt.verify(req.cookies.Token, SECRET, (err, decodedData) => {
        if (!err) {

            console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {

                res.status(401);
                res.cookie('Token', '', {
                    maxAge: 1,
                    httpOnly: true
                });
                res.send({ message: "token expired" });

            } else {

                console.log("token approved");

                res.send({
                    message: 'profile get successfully',
                    userProfile: decodedData.email
                });
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
});

//////////////////// Product adding API //////////////////////////////////

app.post('/api/v1/post', (req, res) => {
    const body = req.body;

    if (
        !body.postText
        &&
        !body.postImage
    ) {
        res.status(400).send({
            message: 'Atleast one prameter is required'
        });
        return;
    }

    postModel.create({
        postText: body.postText,
        date: new Date().toString(),
    }, (err, post) => {
        if (!err) {
            res.status(201).send({
                message: 'Post successfully added',
                data: post
            });
        }
        else {
            res.status(500).send({ message: 'server error' });
        }
    })
    // if (!post) throw new Error('server error').status(500);
    // if (!post) throw new Error({ message: 'server error', statusCode: 500 });
});

///////////////////////////////////////////////////////////////////////////////


//////////////////// all Products get API //////////////////////////////////

app.get('/api/v1/posts', async (req, res) => {

    postModel.find({}, (err, data) => {

        if (!err) {
            res.send({
                message: 'successfully get all posts :',
                data: data
            });
        } else {
            res.status(500).send({
                message: 'server error'
            });
        };
    });
});

///////////////////////////////////////////////////////////////////////////////


//////////////////// Product Delete API //////////////////////////////////

app.delete('/api/v1/post/:id', (req, res) => {
    const id = req.params.id;

    postModel.deleteOne({ _id: id }, (err, deletedProduct) => {
        if (!err) {
            if (deletedProduct.deletedCount != 0) {
                res.send({
                    message: 'post deleted successfully',
                    data: deletedProduct
                });
            }
            else {
                res.status(404).send({
                    message: 'post did not found of this id : ',
                    request_id: id
                });
            }
        }
        else {
            res.status(500).send({
                message: 'server error'
            });
        }
    });
});

///////////////////////////////////////////////////////////////////////////////



//////////////////// Product Edit API //////////////////////////////////

app.put('/api/v1/post/:id', async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    if (
        !body.postText
        &&
        !body.postImage
    ) {
        res.status(400).send({
            message: 'Atleast one prameter is required'
        });
        return;
    }

    try {
        let data = await postModel.findByIdAndUpdate(id, {
            postText: body.postText,
            postImage: body.image,
        },
            { new: true }
        ).exec();
        console.log(' updated data :===>', data);

        res.send({
            message: 'product modified successfully',
            updated_Data: data
        })
    }
    catch (err) {
        res.status(500).send({
            message: 'server error'
        });
    }
});

///////////////////////////////////////////////////////////////////////////////



//////////////////// Product Search API //////////////////////////////////

app.get('/api/v1/products/:name', (req, res) => {

    let findName = req.params.userName;

    postModel.find({ name: { $regex: `${findName}` } }, (err, data) => {
        if (!err) {

            if (data.length !== 0) {

                res.send({
                    message: 'successfully get all products :',
                    data: data
                });
            } else {
                res.status(404).send({
                    message: 'product not found'
                })
            }

        } else {
            res.status(500).send({
                message: 'server error'
            });
        }
    });
});

///////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////


const __dirname = path.resolve();

app.use("/", express.static(path.join(__dirname, "./web/build")));
app.use("*", express.static(path.join(__dirname, "./web/build/index.html")));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});




mongoose.connect(mongodbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////