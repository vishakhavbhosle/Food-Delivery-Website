const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Stripe = require('stripe')

const app = express();
app.use(cors());;
app.use(express.json({ limit: "10mb" }))

const PORT = process.env.PORT || 8080;

// mongodb connection
mongoose.set('strictQuery', false);

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("connected to DB"))
    .catch((err) => console.log(err))

require('dotenv').config();

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    confirmPassword: String,
    image: String,
});

//model
const userModel = mongoose.model("user", userSchema);

// sign up
app.post("/signup", async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user already exists
        const result = await userModel.findOne({ email: email });
        if (result) {
            return res.send({ message: "Email id is already registered", alert: false });
        }

        // If the user does not exist, create a new user
        const data = new userModel(req.body);
        await data.save(); // Save the new user to the database

        res.send({ message: "Successfully Signed In", alert: true });

    }
    catch (err) {
        console.error(err);
        res.send({ message: "Internal server error", alert: false });
    }
});

// api login
app.post("/login", async (req, res) => {
    console.log(req.body);
    const { email } = req.body;

    try {
        // Check if the user already exists
        const result = await userModel.findOne({ email: email });
        if (result) {
            const dataSend = {
                _id: result._id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                image: result.image
            }
            console.log(dataSend);
            return res.send({ message: "Login successfully", alert: true, data: dataSend });
        }
        else {
            res.send({ message: "Enail is not available, please sign up", alert: false });
        }
    }
    catch (err) {
        console.error(err);
    }
});

// product section
const schemaProduct = mongoose.Schema({
    name: String,
    category: String,
    image: String,
    price: String,
    description: String
})
const productModel = mongoose.model("products", schemaProduct)

// save product in data
// api
app.post("/uploadProduct", async (req, res) => {
    console.log(req.body);
    const data = await productModel(req.body)
    const datasave = await data.save()
    res.send({ message: "Uploaded Successfully" })
})

// 
app.get("/product", async (req, res) => {
    const data = await productModel.find({})
    res.send(JSON.stringify(data))
})


// payment gateway
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
app.post("/checkout-payment", async (req, res) => {
    // console.log(req.body);
    // res.send({message : "Payment Gateway", success : true})

    try {
        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            billing_address_collection : "auto",
            shipping_options : [{shipping_rate : "shr_1PoXEU2MAwpxOiauFOoPtetz"}],
            line_items : req.body.map((item) => {
                return {
                    price_data : {
                        currency : "inr",
                        product_data : {
                            name : item.name,
                            // image : [item.image]
                        },
                        unit_amount : item.price * 100,
                    },
                    adjustable_quantity : {
                        enabled : true,
                        minimum : 1
                    },
                    quantity : item.qty
                }
            }),
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await stripe.checkout.sessions.create(params)
        res.status(200).json(session.id)
    }
    catch(err) {
        res.status(err.statusCode || 500).json(err.message)
    }
})

// server is running
app.listen(PORT, () => console.log("Server is running at PORT : " + PORT))




