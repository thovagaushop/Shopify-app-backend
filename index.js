import express from "express";
import dotenv from 'dotenv';
import {Shopify} from '@shopify/shopify-api';
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

app.get("/", async (req, res) => {
   if (typeof shops[req.query.shop] === 'undefined') {
     res.redirect(`/login?shop=${req.query.shop}`);
   } else {
     res.send(req.query.accessToken);
   }
 });

 app.get('/login', async (req, res) => {
    let authRoute = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      '/auth/callback',
      true,
    );
    console.log(authRoute);
    res.redirect(authRoute);
});

app.get('/auth/callback', async (req, res) => {
    try {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
      );
      shops[session] = session.scope;
      console.log(session.accessToken);
    } catch (error) {
      console.error(error);
    }
    res.redirect(`/?accessToken=${session.accessToken}`);
});

app.listen(3000, () => {
console.log('your app is now listening on port 3000');
});