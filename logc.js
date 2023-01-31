const Colors = {
  Green:     { background: "#428959", color: "#FFFFFF" },
  Blue:      { background: "#2A4F87", color: "#FFFFFF" },
  Yellow:    { background: "#F18F01", color: "#FFFFFF" },
  Red:       { background: "#C73E1D", color: "#FFFFFF" },
  Purple:    { background: "#621b3b", color: "#FFFFFF" },
  Analytics: { background: "#f3eed6", color: "black", "font-style": "italic" },
  Session:   { background: "#00FFFF", color: "black" },
  Indigo:    { background: "#3a1772", color: "#FFFFFF" }
}

const log = (str, options = {}) => {
  if(!Object.keys(options).length) return console.log(str);

  const payload = options['payload'] ?? '';
  const styles = formatLogs(options);
  return console.log(`%c ${ str } `, styles, payload);
}

const createLogger =
  (styles = {}) =>
    (message, payload = {}) =>
      log(message, { ...styles, ...{ payload: payload }});

const LogBox = {
  error: createLogger(Colors.Red),
  warn: createLogger(Colors.Yellow),
  success: createLogger(Colors.Green),
  info: createLogger(Colors.Blue),
  analytics: createLogger(Colors.Analytics),
  session: createLogger(Colors.Session),
  indigo: createLogger(Colors.Indigo)
};

const createHandler = () => {
  return {
    get: (target, prop, receiver) => {
      if(!(prop in target)) {
        target[prop] =
          (msg, value) =>
            createLogger({
              background: prop,
              color: 'white'
            })(msg, value);
      }
      return target[prop];
    }
  }
}

const wrapLog =
  ((defaultDivider = "*", defaultTabLength = 3) =>
    (msg, divider = defaultDivider) => {
      const div = divider ? divider[0] : defaultDivider;
      const tab = div.repeat(defaultTabLength);
      const newMsg = `${ tab } ${ msg } ${ tab }`;
      const wrapper = div.repeat(newMsg.length);
      return log(`${ wrapper }\n${ newMsg }\n${ wrapper }`);
    })();

const formatLogs =
  (styles) =>
    Object
      .entries(styles)
      .filter(([key, value]) => key != 'payload')
      .reduce((str, v) => str += `${ v[0] }: ${ v[1] }; `, '');



const logc = new Proxy(LogBox, createHandler());

module.exports = logc;



