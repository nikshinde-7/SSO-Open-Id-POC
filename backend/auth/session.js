const TokenSet = require("openid-client")
const { toBase64, fromBase64 } = require("./encoding")

function serialize(session){
  return toBase64(session);
}

function deserialize(value){
  const raw = fromBase64(value);
  return {
    ...raw,
    tokenSet: raw.tokenSet,
  };
}

module.exports = { serialize, deserialize };
