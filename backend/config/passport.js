// import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import bcrypt from "bcrypt";
// import { findUserByEmail, findUserById } from "../data/users.js";

// const strategy = new LocalStrategy(
//   {
//     usernameField: "email",
//     passwordField: "password",
//   },
//   async (email, password, done) => {
//     try {
//       const user = findUserByEmail(email);

//       if (!user) {
//         // Case 2. User not found or password incorrect
//         return done(null, false, { message: "User or password incorrect" });
//       }

//       const isValidPassword = await bcrypt.compare(password, user.passwordHash);

//       if (!isValidPassword) {
//         // Case 2. User not found or password incorrect
//         return done(null, false, { message: "User or password incorrect" });
//       }

//       const safeUser = {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//       };

//       // delete user.passwordHash;
//       // Case 3. User found and password correct
//       return done(null, safeUser);
//     } catch (error) {
//       // Case 1. There is an error
//       done(error);
//     }
//   }
// );

// passport.use(strategy);

// // Serialize user (what to store in session)
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // Deserialize user (how to retrieve user from session)
// passport.deserializeUser((id, done) => {
//   try {
//     const user = findUserById(id);

//     if (!user) {
//       return done(null, false);
//     }

//     const safeUser = {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//     };

//     done(null, safeUser);
//   } catch (error) {
//     done(error);
//   }
// });

// export default passport;

////Mongdb option/////
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { findUserByEmail, findUserById } from "../data/users.js";

const strategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await findUserByEmail(email);

      if (!user) {
        return done(null, false, { message: "User or password incorrect" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        return done(null, false, { message: "User or password incorrect" });
      }

      return done(null, {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      return done(error);
    }
  }
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);

    if (!user) {
      return done(null, false);
    }

    return done(null, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return done(error);
  }
});

export default passport;
