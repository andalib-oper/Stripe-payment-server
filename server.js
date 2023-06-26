
const stripe = require("stripe")(
  "sk_test_51LdvZxSDey7UZnXPUNskBjuE29JENdaDtKZIQTm5V45LlHNxvGsWUWMmFrRRhalse4TzllleIzmZlhVGIXL1JObP00uA5q2c6i"
);

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json())

app.get('/',(req, res)=>{
    res.send("Hello goPay server started")
})


app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.

    const {amount, currency} = req.body

    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2022-08-01'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      payment_method_types: [ 'card'],
    });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  });

app.listen(4002, ()=> console.log("Running on http://localhost:4002"))
