 const { Strategy } = require("passport-jwt");
const passport = require("passport");
const { SECRET } = require("../constants");
const db = require("../db");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};

const opts = {
  secretOrKey: SECRET,
  jwtFromRequest: cookieExtractor,
};

passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const { id } = payload;
      const result = await db.query(
        "SELECT user_id, email FROM users WHERE user_id = $1",
        [id]
      );
      if (result.rows.length === 0) {
        throw new Error("Unauthorized");
      }
      const user = { id: result.rows[0].user_id, email: result.rows[0].email };
      return done(null, user);
    } catch (error) {
      console.error("Error in authentication:", error.message);
      return done(error, false);
    }
  })
);

exports.userAuth = passport.authenticate("jwt", { session: false });
