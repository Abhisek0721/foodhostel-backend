// import passport from "passport";
// import GoogleStrategyImport from "passport-google-oauth";
// import MicrosoftStrategyImport from "passport-microsoft";
// import DiscordStrategyImport from "passport-discord";
// import properties from "./properties";

// const passportConfig = () => {
//   const GoogleStrategy = GoogleStrategyImport.OAuth2Strategy;
//   const MicrosoftStrategy = MicrosoftStrategyImport.Strategy;
//   const DiscordStrategy = DiscordStrategyImport.Strategy;

//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: properties.GOOGLE_CLIENT_ID,
//         clientSecret: properties.GOOGLE_CLIENT_SECRET,
//         callbackURL: `${properties.SERVER_URL}/api/v1/auth/google/callback`,
//         passReqToCallback: true,
//       },
//       function (req, accessToken, refreshToken, profile, done) {
//         let userProfile: any = {};
//         userProfile.accessToken = accessToken;
//         userProfile.refreshToken = refreshToken;
//         req.user = { ...userProfile, ...profile };
//         return done(null, { ...userProfile, ...profile });
//       }
//     )
//   );

//   passport.use(
//     new MicrosoftStrategy(
//       {
//         clientID: properties.MICROSOFT_APP_ID,
//         clientSecret: properties.MICROSOFT_CLIENT_SECRET,
//         callbackURL: `${properties.SERVER_URL}/api/v1/auth/microsoft/callback`,
//         scope: ["user.read"],
//         // [Optional] The tenant for the application. Defaults to 'common'.
//         // Used to construct the authorizationURL and tokenURL
//         tenant: "common",
//         // [Optional] The authorization URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`
//         authorizationURL:
//           "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
//         // [Optional] The token URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`
//         tokenURL: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
//       },
//       function (
//         accessToken: string | undefined,
//         refreshToken: string | undefined,
//         profile: any,
//         done: any
//       ) {
//         let userProfile: any = {};
//         userProfile.accessToken = accessToken;
//         userProfile.refreshToken = refreshToken;
//         return done(null, { ...userProfile, ...profile });
//       }
//     )
//   );

//   passport.use(
//     new DiscordStrategy(
//       {
//         clientID: properties.DISCORD_APP_ID,
//         clientSecret: properties.DISCORD_CLIENT_SECRET,
//         callbackURL: `${properties.SERVER_URL}/api/v1/auth/discord/callback`,
//         scope: ['identify', 'email', 'guilds', 'guilds.join']
//       },
//       function (
//         accessToken: string | undefined,
//         refreshToken: string | undefined,
//         profile: any,
//         done: any
//       ) {
//         let userProfile: any = {};
//         userProfile.accessToken = accessToken;
//         userProfile.refreshToken = refreshToken;
//         return done(null, { ...userProfile, ...profile });
//       }
//     )
//   );

//   // serializeUser function to persist user data
//   // (after successful authentication) into session.
//   passport.serializeUser(function (user, cb) {
//     cb(null, user);
//   });

//   // deserializeUser is used to retrieve user data from session
//   passport.deserializeUser(function (user: any, cb) {
//     cb(null, user);
//   });
// };

// export default passportConfig;
