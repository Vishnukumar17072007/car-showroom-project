const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/UserSchema");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.emails[0].value.toLowerCase();

                let user = await User.findOne({ googleId });

                // create user if not exists
                if (!user) {
                    user = await User.create({
                        userName: profile.displayName,
                        googleId,
                        image: profile.photos?.[0]?.value || "",
                        role: "user",
                    });
                }

                done(null, user);

            } catch (error) {
                done(error, null);
            }
        }
    )
);

module.exports = passport;