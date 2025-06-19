
 
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from'jsonwebtoken';
import usermodel from '../../db/models/usermodel.js';

passport.use(new GoogleStrategy({
  clientID: "850529878126-fuefkqfjg5m6mcloo6f809hq859edbui.apps.googleusercontent.com",
  clientSecret:"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",
  callbackURL: "http://localhost:5000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    let user = await usermodel.findOne({ email });

    if (!user) {
      user = await usermodel.create({
        name: profile.displayName,
        email,
        googleId: profile.id,
        picture: profile.photos[0].value,
        confirmed: true,
        loggedIn: true,
        role: 'user'
      });
    }

    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.signatuer, 
      
    );

    return done(null, { user, token });
  } catch (err) {
    return done(err, false);
  }
}));

 
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
