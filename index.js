import express from "express";
import dotenv from 'dotenv';
import { Shopify } from '@shopify/shopify-api';
import cors from 'cors';
dotenv.config();

const host = '127.0.0.1';
const port = 3000;

const shops = {};

const {SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_API_SCOPES, HOST} = process.env;

Shopify.Context.initialize({
    API_KEY: SHOPIFY_API_KEY,
    API_SECRET_KEY: SHOPIFY_API_SECRET,
    SCOPES: SHOPIFY_API_SCOPES,
    HOST_NAME: HOST.replace(/https?:\/\//, ""),
    HOST_SCHEME: HOST.split("://")[0],
    IS_EMBEDDED_APP: true,
});

const app = express();

app.use(cors());

app.get('/', (req, res)=>{
    res.send('hello');
})

// app.get('/', async(req, res) => {
//     if (typeof shops[req.query.shop] !== 'undefined') {
//         res
//     } else {
//         res.redirect(`/login?shop=${req.query.shop}`);
//     }
// });

// app.get('/login', async(req, res) => {
//     const authRoute = await Shopify.Auth.beginAuth(
//         req,
//         res,
//         req.query.shop,
//         '/auth/callback',
//         false,
//     )
//     res.redirect(authRoute);
// })

// app.get('/auth/callback', async(req, res) => {
//     const session = await Shopify.Auth.validateAuthCallback(
//         req,
//         res,
//         req.query
//       );

//     const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

//     const products = await client.get({
//         path : 'products'
//     });

//     console.log(products.json());
// });


app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}/`);
});