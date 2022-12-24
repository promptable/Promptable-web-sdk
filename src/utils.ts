// replace any escaped stop tokens like "\\n" their unescaped versions
export const unescapeStopTokens = (stop_tokens: any) => {
  if (Array.isArray(stop_tokens)) {
    console.log("found array of tokens");
    return stop_tokens.map((token) => {
      return JSON.parse(`"${token}"`);
    });
  } else {
    console.log("found single token", stop_tokens);
    return JSON.parse(`"${stop_tokens}"`);
  }
};
