const { generators } = require("openid-client");

const STATE_COOKIE = "state";

function fromBase64(value){
  return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
}

function toBase64(data){
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

function serializeAuthState(state){
    // Encoding the state
    return toBase64({
      ...state,
      bytes: generators.state(),
    });
}
  
function deserializeAuthState(value){
    return fromBase64(value);
}

function setAuthStateCookie(res, state){
  res.cookie(STATE_COOKIE, state, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    sameSite: false,
  });
}

function getAuthStateCookie(req){
  return req.cookies[STATE_COOKIE];
}

module.exports = {
  serializeAuthState: serializeAuthState,
  deserializeAuthState: deserializeAuthState,
  setAuthStateCookie: setAuthStateCookie,
  getAuthStateCookie: getAuthStateCookie
}