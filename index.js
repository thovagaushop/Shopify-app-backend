import express from "express";
import dotenv from 'dotenv';
import {Shopify} from '@shopify/shopify-api';
import cors from 'cors';
import fetch from 'node-fetch';
dotenv.config();

const {SHOP, SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_API_SCOPES, HOST} = process.env;

Shopify.Context.initialize({
    API_KEY: SHOPIFY_API_KEY,
    API_SECRET_KEY: SHOPIFY_API_SECRET,
    SCOPES: SHOPIFY_API_SCOPES,
    HOST_NAME : HOST,
    IS_EMBEDDED_APP : true,
});

const shops = {};

const app = express();

app.use(cors());

app.get("/", async (req, res) => {
   if (typeof shops[req.query.shop] === 'undefined') {
     res.redirect(`/login?shop=${req.query.shop}`);
   } else {
        res.redirect(`/products?shop=${req.query.shop}`);
   }
 });

 app.get('/login', async (req, res) => {
    let authRoute = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      '/auth/callback',
      false,
    );
    res.redirect(authRoute);
});

app.get('/auth/callback', async (req, res) => {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
      );
      console.log(session);
      shops[session.shop] = session;
      res.redirect(`/products?shop=${req.query.shop}`);
});

app.get('/products', async(req, res) => {
    if (shops[req.query.shop] !== undefined) {
        var result = await fetch(`https://${req.query.shop}/admin/api/2022-04/products.json`, {
            method : 'get',
            headers : {
                'X-Shopify-Access-Token' : shops[req.query.shop].accessToken,
            }
        });
        result = await result.json();
        const products = result.products;
        console.log(products);
        res.json(products);
    } else {
        res.redirect(`/login?shop=${req.query.shop}`);
    }
    
    // products = result.products.products;
    // console.log(products);
    // res.json(products);
})

app.listen(3000, () => {
console.log('your app is now listening on port 3000');
});