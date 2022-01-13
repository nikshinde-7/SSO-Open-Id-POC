require('dotenv').config();
const { Issuer } = require("openid-client");
const { getSessionCookie, setSessionCookie } = require('./cookie');
const { deserialize } = require('./session');

function getDomain(){
  return `http://${process.env.HOST}:3001`;
}

async function initialize(
    req,
    res,
    next
) {
    if (req.app.authIssuer) {
      return next();
    }
  
    const googleIssuer = await Issuer.discover("https://accounts.google.com");
   
    console.log("OpendId issuer created");
    const client = new googleIssuer.Client({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      redirect_uris: [`${getDomain()}/auth/callback`],
      response_types: ["code"],
    });
  
    req.app.authIssuer = googleIssuer;
    req.app.authClient = client;
  
    next();
}

function requireAuth(
  req,
  res,
  next
) {
  const session = req.session;
  if (!session) {
    return next(new Error("unauthenticated"));
  }

  next();
}

async function session(req, res, next) {
  const sessionCookie = getSessionCookie(req);
  if (!sessionCookie) {
    return next();
  }

  const client = req.app.authClient;
  const session = deserialize(sessionCookie);

  console.log(session, " > >>> > >")

  if (Date.now() >= session.tokenSet.expires_at * 1000) {
    try {
      const refreshedTokenSet = await client.refresh(session.tokenSet);
      console.log( refreshedTokenSet , " < < << < < < < < < <");
      session.tokenSet = refreshedTokenSet;
      setSessionCookie(res, serialize(session));
    } catch (err) {
      // this can throw when the refresh token has expired, logout completely when that happens
      clearSessionCookie(res);
      return next();
    }
  }

  const validate = req.app.authClient.validateIdToken;

  console.log("----------------------_>>>>> ", validate)
  try {
    await validate.call(client, session.tokenSet);
  } catch (err) {
    console.log("bad token signature found in auth cookie");
    return next(new Error(err));
  }

  console.log(" >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  ----------------  ", session);
  req.session = session;

  next();
}

module.exports = {
    initialize,
    getDomain,
    requireAuth,
    session
};

  