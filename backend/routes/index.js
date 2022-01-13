var express = require('express');
const { getDomain } = require('../auth');
const { setSessionCookie } = require('../auth/cookie');
const { serialize } = require('../auth/session');
var router = express.Router();
const { serializeAuthState, deserializeAuthState, getAuthStateCookie, setAuthStateCookie } = require('../auth/state');


router.get("/auth/login", function (req, res, next) {
  const backToPath = req.query.backTo || "/private";
  console.log(serializeAuthState)
  const state = serializeAuthState({ backToPath });

  const authUrl = req.app.authClient.authorizationUrl({
    scope: "openid email profile",
    state,
  });

  setAuthStateCookie(res, state);

  console.log("Redirecting to =>", authUrl)
  res.redirect(authUrl);
});

router.get("/auth/callback", async (req, res, next) => {
  try {

    console.log("req.cookies", req.cookies);
    const state = getAuthStateCookie(req);

    const { backToPath } = deserializeAuthState(state);
    const client = req.app.authClient;

    const params = client.callbackParams(req);
    const tokenSet = await client.callback(
      `${getDomain()}/auth/callback`,
      params,
      { state }
    );
    const user = await client.userinfo(tokenSet);

    const sessionCookie = serialize({ tokenSet, user });
    setSessionCookie(res, sessionCookie);

    res.redirect(backToPath);
  } catch (err) {
    console.log("SOMETHING WENT WRONG", err);
    return next(err);
  }
});


module.exports = router;
