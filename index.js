import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fetch, { Headers } from 'node-fetch';
import cors from 'cors';
import { Shopify } from '@shopify/shopify-api';

dotenv.config();

const port = 3000;

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY, SHOPIFY_API_SCOPES, HOST } = process.env;
const shops = {};

Shopify.Context.initialize({
    API_KEY : SHOPIFY_API_KEY,
    API_SECRET_KEY : SHOPIFY_API_SECRET_KEY,
    SCOPES: SHOPIFY_API_SCOPES,
    HOST_NAME: HOST,
    IS_EMBEDDED_APP: false,
});

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors());

app.get('/', async (req, res, next) => {
    if (typeof shops[req.query.shop] !== 'undefined') {
        console.log(req.session.products)
        res.json(req.session.products);
    } else {
        res.redirect(`/login?shop=${req.query.shop}`);
    }
})

app.get(`/login`, async (req, res, next) => {
    let authRoute = await Shopify.Auth.beginAuth(
        req,
        res,
        req.query.shop,
        '/auth/callback',
        false,
    );

    return res.redirect(authRoute);
})

app.get('/auth/callback', async (req, res, next) => {
    const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
    );
    shops[session] = session;
    console.log(shops[session]);

    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Server is running on port :  ${port}`)
})