
import connectionDB from './db/connectiondb.js';
import { deleteCloudinary, deleteDB } from './deletefromCloudinary.js';
import * as routers from './src/modules/routersall.js';
import { globlhandler } from './src/utils/asyncHandeler.js';
import { createHandler } from 'graphql-http/lib/use/express';
import { reviewschema } from './src/modules/reviews/graphql/schema.js';
import  Playground from 'graphql-playground-middleware-express'
  const expressPlayground = Playground.default
  import cors from'cors';
import { webkook } from './src/modules/orders/order.controler.js';
import passport from 'passport';
import session from 'express-session';
import './src/middleware/googleAuth.js';


export const initApp=(express,app)=>{
const port = 5000
app.use(cors());

app.post("/orders/webhook", express.raw({ type: "application/json" }), webkook);
app.use(express.json());
 
 app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
 
connectionDB()

app.use(passport.initialize());
app.use(passport.session());

 
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

 
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const { token } = req.user;
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);
 app.use("/users",routers.userrouter)
 app.use("/categories",routers.categoryrouter)
 app.use("/subcategory",routers.subcategoryrouter)
 app.use("/brands",routers.brandrouter)
 app.use("/products",routers.productrouter)
 app.use("/coupons",routers.couponrouter)
 app.use("/carts",routers. cartrouter)
 app.use("/orders",routers. orderrouter)
 app.use("/reviews",routers. reviewrouter)
 app.use("/washlist",routers. washlistrouter)

 app.use('/graphql', createHandler({ schema:reviewschema }));

 app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

 app.get('*', (req, res,next) =>{
 res.json('hello world ?')
app.use(globlhandler,deleteCloudinary,deleteDB)

});

 app.listen(port, () => console.log(`Example app listening on port ${port}!`))

}