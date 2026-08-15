const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/UserSchema");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.NODE_ENV === "production"
                ? `${process.env.SERVER_URL}/api/auth/google/callback`   // ← absolute URL
                : "http://localhost:5000/api/auth/google/callback",
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.id;
                const email = profile.emails?.[0]?.value?.toLowerCase().trim();
        
                // 1. Check if this Google account has already logged in before
                let user = await User.findOne({ googleId });
                if (user) {
                    return done(null, user);
                }
        
                // 2. Not linked yet — check if an account with this email already exists
                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        // Link Google to the existing email/password account
                        user.googleId = googleId;
                        if (!user.image && profile.photos?.[0]?.value) {
                            user.image = profile.photos[0].value;
                        }
                        await user.save();
                        return done(null, user);
                    }
                }
        
                // 3. Brand new user — create as usual
                user = await User.create({
                    userName: profile.displayName,
                    email,
                    googleId,
                    image: profile.photos?.[0]?.value || "",
                    role: "user",
                });
        
                return done(null, user);
        
            } catch (error) {
                done(error, null);
            }
        }
    )
);

module.exports = passport;