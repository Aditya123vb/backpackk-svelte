import { l as listen, b as bubble, p as prevent_default, d as stop_propagation, g as getContext, c as create_ssr_component, f as compute_rest_props, h as get_current_component, i as spread, e as escape, j as escape_object, k as add_attribute, v as validate_component, m as missing_component, a as subscribe, s as setContext, o as set_store_value } from "../../chunks/ssr.js";
/* empty css               */
import "../../chunks/client.js";
import { w as writable } from "../../chunks/index.js";
import { createStitches, defaultThemeMap } from "@stitches/core";
import { i as is_void } from "../../chunks/names.js";
function useActions(node, actions) {
  const actionReturns = [];
  if (actions) {
    for (let i = 0; i < actions.length; i++) {
      const actionEntry = actions[i];
      const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
      if (Array.isArray(actionEntry) && actionEntry.length > 1) {
        actionReturns.push(action(node, actionEntry[1]));
      } else {
        actionReturns.push(action(node));
      }
    }
  }
  return {
    update(actions2) {
      if ((actions2 && actions2.length || 0) != actionReturns.length) {
        throw new Error("You must not change the length of an actions array.");
      }
      if (actions2) {
        for (let i = 0; i < actions2.length; i++) {
          const returnEntry = actionReturns[i];
          if (returnEntry && returnEntry.update) {
            const actionEntry = actions2[i];
            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
              returnEntry.update(actionEntry[1]);
            } else {
              returnEntry.update();
            }
          }
        }
      }
    },
    destroy() {
      for (let i = 0; i < actionReturns.length; i++) {
        const returnEntry = actionReturns[i];
        if (returnEntry && returnEntry.destroy) {
          returnEntry.destroy();
        }
      }
    }
  };
}
const MODIFIER_DIVIDER = "!";
const modifierRegex = new RegExp(`^[^${MODIFIER_DIVIDER}]+(?:${MODIFIER_DIVIDER}(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$`);
function createEventForwarder(component, except = []) {
  let $on;
  const events = [];
  component.$on = (fullEventType, callback) => {
    const eventType = fullEventType;
    let destructor = () => {
    };
    for (const exception of except) {
      if (typeof exception === "string" && exception === eventType) {
        const callbacks = component.$$.callbacks[eventType] || (component.$$.callbacks[eventType] = []);
        callbacks.push(callback);
        return () => {
          const index = callbacks.indexOf(callback);
          if (index !== -1)
            callbacks.splice(index, 1);
        };
      }
      if (typeof exception === "object" && exception["name"] === eventType) {
        const oldCallback = callback;
        callback = (...props) => {
          if (!(typeof exception === "object" && exception["shouldExclude"]())) {
            oldCallback(...props);
          }
        };
      }
    }
    if ($on) {
      destructor = $on(eventType, callback);
    } else {
      events.push([eventType, callback]);
    }
    return () => {
      destructor();
    };
  };
  function forward(e) {
    bubble(component, e);
  }
  return (node) => {
    const destructors = [];
    const forwardDestructors = {};
    $on = (fullEventType, callback) => {
      let eventType = fullEventType;
      let handler = callback;
      let options = false;
      const modifierMatch = eventType.match(modifierRegex);
      if (modifierMatch) {
        const parts = eventType.split(MODIFIER_DIVIDER);
        eventType = parts[0];
        const eventOptions = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
        if (eventOptions.passive) {
          options = options || {};
          options.passive = true;
        }
        if (eventOptions.nonpassive) {
          options = options || {};
          options.passive = false;
        }
        if (eventOptions.capture) {
          options = options || {};
          options.capture = true;
        }
        if (eventOptions.once) {
          options = options || {};
          options.once = true;
        }
        if (eventOptions.preventDefault) {
          handler = prevent_default(handler);
        }
        if (eventOptions.stopPropagation) {
          handler = stop_propagation(handler);
        }
      }
      const off = listen(node, eventType, handler, options);
      const destructor = () => {
        off();
        const idx = destructors.indexOf(destructor);
        if (idx > -1) {
          destructors.splice(idx, 1);
        }
      };
      destructors.push(destructor);
      if (!(eventType in forwardDestructors)) {
        forwardDestructors[eventType] = listen(node, eventType, forward);
      }
      return destructor;
    };
    for (let i = 0; i < events.length; i++) {
      $on(events[i][0], events[i][1]);
    }
    return {
      destroy: () => {
        for (let i = 0; i < destructors.length; i++) {
          destructors[i]();
        }
        for (const entry of Object.entries(forwardDestructors)) {
          entry[1]();
        }
      }
    };
  };
}
const key = {};
function useSvelteUIThemeContext() {
  return getContext(key);
}
const colorScheme = writable("light");
const colors = {
  primary: "#228be6",
  white: "#ffffff",
  black: "#000000",
  dark50: "#C1C2C5",
  dark100: "#A6A7AB",
  dark200: "#909296",
  dark300: "#5c5f66",
  dark400: "#373A40",
  dark500: "#2C2E33",
  dark600: "#25262b",
  dark700: "#1A1B1E",
  dark800: "#141517",
  dark900: "#101113",
  gray50: "#f8f9fa",
  gray100: "#f1f3f5",
  gray200: "#e9ecef",
  gray300: "#dee2e6",
  gray400: "#ced4da",
  gray500: "#adb5bd",
  gray600: "#868e96",
  gray700: "#495057",
  gray800: "#343a40",
  gray900: "#212529",
  red50: "#fff5f5",
  red100: "#ffe3e3",
  red200: "#ffc9c9",
  red300: "#ffa8a8",
  red400: "#ff8787",
  red500: "#ff6b6b",
  red600: "#fa5252",
  red700: "#f03e3e",
  red800: "#e03131",
  red900: "#c92a2a",
  pink50: "#fff0f6",
  pink100: "#ffdeeb",
  pink200: "#fcc2d7",
  pink300: "#faa2c1",
  pink400: "#f783ac",
  pink500: "#f06595",
  pink600: "#e64980",
  pink700: "#d6336c",
  pink800: "#c2255c",
  pink900: "#a61e4d",
  grape50: "#f8f0fc",
  grape100: "#f3d9fa",
  grape200: "#eebefa",
  grape300: "#e599f7",
  grape400: "#da77f2",
  grape500: "#cc5de8",
  grape600: "#be4bdb",
  grape700: "#ae3ec9",
  grape800: "#9c36b5",
  grape900: "#862e9c",
  violet50: "#f3f0ff",
  violet100: "#e5dbff",
  violet200: "#d0bfff",
  violet300: "#b197fc",
  violet400: "#9775fa",
  violet500: "#845ef7",
  violet600: "#7950f2",
  violet700: "#7048e8",
  violet800: "#6741d9",
  violet900: "#5f3dc4",
  indigo50: "#edf2ff",
  indigo100: "#dbe4ff",
  indigo200: "#bac8ff",
  indigo300: "#91a7ff",
  indigo400: "#748ffc",
  indigo500: "#5c7cfa",
  indigo600: "#4c6ef5",
  indigo700: "#4263eb",
  indigo800: "#3b5bdb",
  indigo900: "#364fc7",
  blue50: "#e7f5ff",
  blue100: "#d0ebff",
  blue200: "#a5d8ff",
  blue300: "#74c0fc",
  blue400: "#4dabf7",
  blue500: "#339af0",
  blue600: "#228be6",
  blue700: "#1c7ed6",
  blue800: "#1971c2",
  blue900: "#1864ab",
  cyan50: "#e3fafc",
  cyan100: "#c5f6fa",
  cyan200: "#99e9f2",
  cyan300: "#66d9e8",
  cyan400: "#3bc9db",
  cyan500: "#22b8cf",
  cyan600: "#15aabf",
  cyan700: "#1098ad",
  cyan800: "#0c8599",
  cyan900: "#0b7285",
  teal50: "#e6fcf5",
  teal100: "#c3fae8",
  teal200: "#96f2d7",
  teal300: "#63e6be",
  teal400: "#38d9a9",
  teal500: "#20c997",
  teal600: "#12b886",
  teal700: "#0ca678",
  teal800: "#099268",
  teal900: "#087f5b",
  green50: "#ebfbee",
  green100: "#d3f9d8",
  green200: "#b2f2bb",
  green300: "#8ce99a",
  green400: "#69db7c",
  green500: "#51cf66",
  green600: "#40c057",
  green700: "#37b24d",
  green800: "#2f9e44",
  green900: "#2b8a3e",
  lime50: "#f4fce3",
  lime100: "#e9fac8",
  lime200: "#d8f5a2",
  lime300: "#c0eb75",
  lime400: "#a9e34b",
  lime500: "#94d82d",
  lime600: "#82c91e",
  lime700: "#74b816",
  lime800: "#66a80f",
  lime900: "#5c940d",
  yellow50: "#fff9db",
  yellow100: "#fff3bf",
  yellow200: "#ffec99",
  yellow300: "#ffe066",
  yellow400: "#ffd43b",
  yellow500: "#fcc419",
  yellow600: "#fab005",
  yellow700: "#f59f00",
  yellow800: "#f08c00",
  yellow900: "#e67700",
  orange50: "#fff4e6",
  orange100: "#ffe8cc",
  orange200: "#ffd8a8",
  orange300: "#ffc078",
  orange400: "#ffa94d",
  orange500: "#ff922b",
  orange600: "#fd7e14",
  orange700: "#f76707",
  orange800: "#e8590c",
  orange900: "#d9480f"
};
const colorNameMap = {
  blue: "blue",
  cyan: "cyan",
  dark: "dark",
  grape: "grape",
  gray: "gray",
  green: "green",
  indigo: "indigo",
  lime: "lime",
  orange: "orange",
  pink: "pink",
  red: "red",
  teal: "teal",
  violet: "violet",
  yellow: "yellow"
};
const { css, globalCss, keyframes, getCssText, theme, createTheme, config, reset } = createStitches({
  prefix: "svelteui",
  theme: {
    colors,
    space: {
      0: "0rem",
      xs: 10,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
      xsPX: "10px",
      smPX: "12px",
      mdPX: "16px",
      lgPX: "20px",
      xlPX: "24px",
      1: "0.125rem",
      2: "0.25rem",
      3: "0.375rem",
      4: "0.5rem",
      5: "0.625rem",
      6: "0.75rem",
      7: "0.875rem",
      8: "1rem",
      9: "1.25rem",
      10: "1.5rem",
      11: "1.75rem",
      12: "2rem",
      13: "2.25rem",
      14: "2.5rem",
      15: "2.75rem",
      16: "3rem",
      17: "3.5rem",
      18: "4rem",
      20: "5rem",
      24: "6rem",
      28: "7rem",
      32: "8rem",
      36: "9rem",
      40: "10rem",
      44: "11rem",
      48: "12rem",
      52: "13rem",
      56: "14rem",
      60: "15rem",
      64: "16rem",
      72: "18rem",
      80: "20rem",
      96: "24rem"
    },
    fontSizes: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px"
    },
    fonts: {
      standard: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
      mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace",
      fallback: "Segoe UI, system-ui, sans-serif"
    },
    fontWeights: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    lineHeights: {
      xs: 1,
      sm: 1.25,
      md: 1.5,
      lg: 1.625,
      xl: 1.75
    },
    letterSpacings: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em"
    },
    sizes: {},
    radii: {
      xs: "2px",
      sm: "4px",
      md: "8px",
      lg: "16px",
      xl: "32px",
      squared: "33%",
      rounded: "50%",
      pill: "9999px"
    },
    shadows: {
      xs: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
      sm: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px",
      md: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
      lg: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 28px 23px -7px, rgba(0, 0, 0, 0.04) 0px 12px 12px -7px",
      xl: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 36px 28px -7px, rgba(0, 0, 0, 0.04) 0px 17px 17px -7px"
    },
    zIndices: {
      1: "100",
      2: "200",
      3: "300",
      4: "400",
      5: "500",
      10: "1000",
      max: "9999"
    },
    borderWidths: {
      light: "1px",
      normal: "2px",
      bold: "3px",
      extrabold: "4px",
      black: "5px",
      xs: "1px",
      sm: "2px",
      md: "3px",
      lg: "4px",
      xl: "5px"
    },
    breakpoints: {
      xs: 576,
      sm: 768,
      md: 992,
      lg: 1200,
      xl: 1400
    },
    borderStyles: {},
    transitions: {}
  },
  media: {
    xs: "(min-width: 576px)",
    sm: "(min-width: 768px)",
    md: "(min-width: 992px)",
    lg: "(min-width: 1200px)",
    xl: "(min-width: 1400px)"
  },
  utils: {
    focusRing: (value) => ({
      WebkitTapHighlightColor: "transparent",
      "&:focus": {
        outlineOffset: 2,
        outline: value === "always" || value === "auto" ? "2px solid $primary" : "none"
      },
      "&:focus:not(:focus-visible)": {
        outline: value === "auto" || value === "never" ? "none" : void 0
      }
    }),
    /** padding top */
    p: (value) => ({
      padding: value
    }),
    pt: (value) => ({
      paddingTop: value
    }),
    pr: (value) => ({
      paddingRight: value
    }),
    pb: (value) => ({
      paddingBottom: value
    }),
    pl: (value) => ({
      paddingLeft: value
    }),
    px: (value) => ({
      paddingLeft: value,
      paddingRight: value
    }),
    py: (value) => ({
      paddingTop: value,
      paddingBottom: value
    }),
    /** margin */
    m: (value) => ({
      margin: value
    }),
    /** margin-top */
    mt: (value) => ({
      marginTop: value
    }),
    mr: (value) => ({
      marginRight: value
    }),
    mb: (value) => ({
      marginBottom: value
    }),
    ml: (value) => ({
      marginLeft: value
    }),
    mx: (value) => ({
      marginLeft: value,
      marginRight: value
    }),
    my: (value) => ({
      marginTop: value,
      marginBottom: value
    }),
    ta: (value) => ({
      textAlign: value
    }),
    tt: (value) => ({
      textTransform: value
    }),
    to: (value) => ({
      textOverflow: value
    }),
    d: (value) => ({ display: value }),
    dflex: (value) => ({
      display: "flex",
      alignItems: value,
      justifyContent: value
    }),
    fd: (value) => ({
      flexDirection: value
    }),
    fw: (value) => ({ flexWrap: value }),
    ai: (value) => ({
      alignItems: value
    }),
    ac: (value) => ({
      alignContent: value
    }),
    jc: (value) => ({
      justifyContent: value
    }),
    as: (value) => ({
      alignSelf: value
    }),
    fg: (value) => ({ flexGrow: value }),
    fs: (value) => ({
      fontSize: value
    }),
    fb: (value) => ({
      flexBasis: value
    }),
    bc: (value) => ({
      backgroundColor: value
    }),
    bf: (value) => ({
      backdropFilter: value
    }),
    bg: (value) => ({
      background: value
    }),
    bgBlur: (value) => ({
      bf: "saturate(180%) blur(10px)",
      bg: value
    }),
    bgColor: (value) => ({
      backgroundColor: value
    }),
    backgroundClip: (value) => ({
      WebkitBackgroundClip: value,
      backgroundClip: value
    }),
    bgClip: (value) => ({
      WebkitBackgroundClip: value,
      backgroundClip: value
    }),
    br: (value) => ({
      borderRadius: value
    }),
    bw: (value) => ({
      borderWidth: value
    }),
    btrr: (value) => ({
      borderTopRightRadius: value
    }),
    bbrr: (value) => ({
      borderBottomRightRadius: value
    }),
    bblr: (value) => ({
      borderBottomLeftRadius: value
    }),
    btlr: (value) => ({
      borderTopLeftRadius: value
    }),
    bs: (value) => ({
      boxShadow: value
    }),
    normalShadow: (value) => ({
      boxShadow: `0 4px 14px 0 $${value}`
    }),
    lh: (value) => ({
      lineHeight: value
    }),
    ov: (value) => ({ overflow: value }),
    ox: (value) => ({
      overflowX: value
    }),
    oy: (value) => ({
      overflowY: value
    }),
    pe: (value) => ({
      pointerEvents: value
    }),
    events: (value) => ({
      pointerEvents: value
    }),
    us: (value) => ({
      WebkitUserSelect: value,
      userSelect: value
    }),
    userSelect: (value) => ({
      WebkitUserSelect: value,
      userSelect: value
    }),
    w: (value) => ({ width: value }),
    h: (value) => ({
      height: value
    }),
    minW: (value) => ({
      minWidth: value
    }),
    minH: (value) => ({
      minWidth: value
    }),
    mw: (value) => ({
      maxWidth: value
    }),
    maxW: (value) => ({
      maxWidth: value
    }),
    mh: (value) => ({
      maxHeight: value
    }),
    maxH: (value) => ({
      maxHeight: value
    }),
    size: (value) => ({
      width: value,
      height: value
    }),
    minSize: (value) => ({
      minWidth: value,
      minHeight: value,
      width: value,
      height: value
    }),
    sizeMin: (value) => ({
      minWidth: value,
      minHeight: value,
      width: value,
      height: value
    }),
    maxSize: (value) => ({
      maxWidth: value,
      maxHeight: value
    }),
    sizeMax: (value) => ({
      maxWidth: value,
      maxHeight: value
    }),
    appearance: (value) => ({
      WebkitAppearance: value,
      appearance: value
    }),
    scale: (value) => ({
      transform: `scale(${value})`
    }),
    linearGradient: (value) => ({
      backgroundImage: `linear-gradient(${value})`
    }),
    tdl: (value) => ({
      textDecorationLine: value
    }),
    // Text gradient effect
    textGradient: (value) => ({
      backgroundImage: `linear-gradient(${value})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    })
  },
  themeMap: {
    ...defaultThemeMap,
    width: "space",
    height: "space",
    minWidth: "space",
    maxWidth: "space",
    minHeight: "space",
    maxHeight: "space",
    flexBasis: "space",
    gridTemplateColumns: "space",
    gridTemplateRows: "space",
    blockSize: "space",
    minBlockSize: "space",
    maxBlockSize: "space",
    inlineSize: "space",
    minInlineSize: "space",
    maxInlineSize: "space",
    borderWidth: "borderWeights"
  }
});
const dark = createTheme("dark-theme", {
  colors,
  shadows: {
    xs: "-4px 0 15px rgb(0 0 0 / 50%)",
    sm: "0 5px 20px -5px rgba(20, 20, 20, 0.1)",
    md: "0 8px 30px rgba(20, 20, 20, 0.15)",
    lg: "0 30px 60px rgba(20, 20, 20, 0.15)",
    xl: "0 40px 80px rgba(20, 20, 20, 0.25)"
  }
});
globalCss({
  a: {
    focusRing: "auto"
  },
  body: {
    [`${dark.selector} &`]: {
      backgroundColor: "$dark700",
      color: "$dark50"
    },
    backgroundColor: "$white",
    color: "$black"
  }
});
globalCss({
  html: {
    fontFamily: "sans-serif",
    lineHeight: "1.15",
    textSizeAdjust: "100%",
    margin: 0
  },
  body: {
    margin: 0
  },
  "article, aside, footer, header, nav, section, figcaption, figure, main": {
    display: "block"
  },
  h1: {
    fontSize: "2em",
    margin: 0
  },
  hr: {
    boxSizing: "content-box",
    height: 0,
    overflow: "visible"
  },
  pre: {
    fontFamily: "monospace, monospace",
    fontSize: "1em"
  },
  a: {
    background: "transparent",
    textDecorationSkip: "objects"
  },
  "a:active, a:hover": {
    outlineWidth: 0
  },
  "abbr[title]": {
    borderBottom: "none",
    textDecoration: "underline"
  },
  "b, strong": {
    fontWeight: "bolder"
  },
  "code, kbp, samp": {
    fontFamily: "monospace, monospace",
    fontSize: "1em"
  },
  dfn: {
    fontStyle: "italic"
  },
  mark: {
    backgroundColor: "#ff0",
    color: "#000"
  },
  small: {
    fontSize: "80%"
  },
  "sub, sup": {
    fontSize: "75%",
    lineHeight: 0,
    position: "relative",
    verticalAlign: "baseline"
  },
  sup: {
    top: "-0.5em"
  },
  sub: {
    bottom: "-0.25em"
  },
  "audio, video": {
    display: "inline-block"
  },
  "audio:not([controls])": {
    display: "none",
    height: 0
  },
  img: {
    borderStyle: "none",
    verticalAlign: "middle"
  },
  "svg:not(:root)": {
    overflow: "hidden"
  },
  "button, input, optgroup, select, textarea": {
    fontFamily: "sans-serif",
    fontSize: "100%",
    lineHeight: "1.15",
    margin: 0
  },
  "button, input": {
    overflow: "visible"
  },
  "button, select": {
    textTransform: "none"
  },
  "button, [type=reset], [type=submit]": {
    WebkitAppearance: "button"
  },
  "button::-moz-focus-inner, [type=button]::-moz-focus-inner, [type=reset]::-moz-focus-inner, [type=submit]::-moz-focus-inner": {
    borderStyle: "none",
    padding: 0
  },
  "button:-moz-focusring, [type=button]:-moz-focusring, [type=reset]:-moz-focusring, [type=submit]:-moz-focusring": {
    outline: "1px dotted ButtonText"
  },
  legend: {
    boxSizing: "border-box",
    color: "inherit",
    display: "table",
    maxWidth: "100%",
    padding: 0,
    whiteSpace: "normal"
  },
  progress: {
    display: "inline-block",
    verticalAlign: "baseline"
  },
  textarea: {
    overflow: "auto"
  },
  "[type=checkbox], [type=radio]": {
    boxSizing: "border-box",
    padding: 0
  },
  "[type=number]::-webkit-inner-spin-button, [type=number]::-webkit-outer-spin-button": {
    height: "auto"
  },
  "[type=search]": {
    appearance: "textfield",
    outlineOffset: "-2px"
  },
  "[type=search]::-webkit-search-cancel-button, [type=search]::-webkit-search-decoration": {
    appearance: "none"
  },
  "::-webkit-file-upload-button": {
    appearance: "button",
    font: "inherit"
  },
  "details, menu": {
    display: "block"
  },
  summary: {
    display: "list-item"
  },
  canvas: {
    display: "inline-block"
  },
  template: {
    display: "none"
  },
  "[hidden]": {
    display: "none"
  }
});
function themeColor(color, shade = 0) {
  const theme2 = useSvelteUIThemeContext()?.theme || useSvelteUITheme();
  let _shade = "50";
  if (!isSvelteUIColor(color))
    return color;
  if (shade !== Number(0))
    _shade = `${shade.toString()}00`;
  return theme2.colors[`${color}${_shade}`]?.value;
}
function isSvelteUIColor(color) {
  let valid = false;
  switch (color) {
    case "dark":
      valid = true;
      break;
    case "gray":
      valid = true;
      break;
    case "red":
      valid = true;
      break;
    case "pink":
      valid = true;
      break;
    case "grape":
      valid = true;
      break;
    case "violet":
      valid = true;
      break;
    case "indigo":
      valid = true;
      break;
    case "blue":
      valid = true;
      break;
    case "cyan":
      valid = true;
      break;
    case "teal":
      valid = true;
      break;
    case "green":
      valid = true;
      break;
    case "lime":
      valid = true;
      break;
    case "yellow":
      valid = true;
      break;
    case "orange":
      valid = true;
      break;
    default:
      valid = false;
      break;
  }
  return valid;
}
function createConverter(units) {
  return (px) => {
    if (typeof px === "number") {
      return `${px / 16}${units}`;
    }
    if (typeof px === "string") {
      const replaced = px.replace("px", "");
      if (!Number.isNaN(Number(replaced))) {
        return `${Number(replaced) / 16}${units}`;
      }
    }
    return px;
  };
}
const rem = createConverter("rem");
function cover(offset = 0) {
  return {
    position: "absolute",
    top: rem(offset),
    right: rem(offset),
    left: rem(offset),
    bottom: rem(offset)
  };
}
function size(props) {
  if (typeof props.size === "number") {
    return props.size;
  }
  if (typeof props.sizes[props.size] === "number") {
    return props.sizes[props.size];
  }
  return +props.sizes[props.size]?.value || +props.sizes.md?.value;
}
function radius(radii) {
  const theme2 = useSvelteUIThemeContext()?.theme || useSvelteUITheme();
  if (typeof radii === "number") {
    return radii;
  }
  return theme2.radii[radii].value;
}
function isHexColor(hex) {
  const replaced = hex.replace("#", "");
  return typeof replaced === "string" && replaced.length === 6 && !Number.isNaN(Number(`0x${replaced}`));
}
function hexToRgba(color) {
  const replaced = color.replace("#", "");
  const parsed = parseInt(replaced, 16);
  const r = parsed >> 16 & 255;
  const g = parsed >> 8 & 255;
  const b = parsed & 255;
  return {
    r,
    g,
    b,
    a: 1
  };
}
function rgbStringToRgba(color) {
  const [r, g, b, a] = color.replace(/[^0-9,.]/g, "").split(",").map(Number);
  return { r, g, b, a: a || 1 };
}
function toRgba(color) {
  if (isHexColor(color)) {
    return hexToRgba(color);
  }
  if (color.startsWith("rgb")) {
    return rgbStringToRgba(color);
  }
  return {
    r: 0,
    g: 0,
    b: 0,
    a: 1
  };
}
function rgba(color, alpha = 1) {
  if (typeof color !== "string" || alpha > 1 || alpha < 0) {
    return "rgba(0, 0, 0, 1)";
  }
  const { r, g, b } = toRgba(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
const DEFAULT_GRADIENT = {
  from: "indigo",
  to: "cyan",
  deg: 45
};
function variant({ variant: variant2, color, gradient }) {
  const theme2 = useSvelteUIThemeContext()?.theme || useSvelteUITheme();
  const primaryShade = 6;
  if (variant2 === "light") {
    return {
      border: "transparent",
      background: [rgba(themeColor(color, 8), 0.35), rgba(themeColor(color, 0), 1)],
      color: [
        color === "dark" ? themeColor("dark", 0) : themeColor(color, 2),
        color === "dark" ? themeColor("dark", 9) : themeColor(color, primaryShade)
      ],
      // themeColor(color, theme.colorScheme === 'dark' ? 2 : getPrimaryShade('light')),
      hover: [rgba(themeColor(color, 7), 0.45), rgba(themeColor(color, 1), 0.65)]
    };
  }
  if (variant2 === "default") {
    return {
      border: [themeColor("dark", 5), themeColor("gray", 4)],
      background: [themeColor("dark", 5), theme2.colors.white.value],
      color: [theme2.colors.white.value, theme2.colors.black.value],
      hover: [themeColor("dark", 4), themeColor("gray", 0)]
    };
  }
  if (variant2 === "white") {
    return {
      border: "transparent",
      background: theme2.colors.white.value,
      color: themeColor(color, primaryShade),
      hover: null
    };
  }
  if (variant2 === "outline") {
    return {
      border: [themeColor(color, 4), themeColor(color, primaryShade)],
      background: "transparent",
      color: [themeColor(color, 4), themeColor(color, primaryShade)],
      hover: [rgba(themeColor(color, 4), 0.05), rgba(themeColor(color, 0), 0.35)]
    };
  }
  if (variant2 === "gradient") {
    const merged = {
      from: gradient?.from || DEFAULT_GRADIENT.from,
      to: gradient?.to || DEFAULT_GRADIENT.to,
      deg: gradient?.deg || DEFAULT_GRADIENT.deg
    };
    return {
      background: `linear-gradient(${merged.deg}deg, ${themeColor(merged.from, primaryShade)} 0%, ${themeColor(merged.to, primaryShade)} 100%)`,
      color: theme2.colors.white.value,
      border: "transparent",
      hover: null
    };
  }
  if (variant2 === "subtle") {
    return {
      border: "transparent",
      background: "transparent",
      color: [
        color === "dark" ? themeColor("dark", 0) : themeColor(color, 2),
        color === "dark" ? themeColor("dark", 9) : themeColor(color, primaryShade)
      ],
      hover: [rgba(themeColor(color, 8), 0.35), rgba(themeColor(color, 0), 1)]
    };
  }
  return {
    border: "transparent",
    background: [themeColor(color, 8), themeColor(color, primaryShade)],
    color: theme2.colors.white.value,
    hover: themeColor(color, 7)
  };
}
const fns = {
  cover,
  size,
  radius,
  themeColor,
  variant,
  rgba
};
function useSvelteUITheme() {
  let observer;
  colorScheme?.subscribe((mode) => {
    observer = mode;
  });
  const DEFAULT_THEME = {
    // @ts-ignore
    ...theme,
    colorNames: colorNameMap,
    colorScheme: observer,
    dark: dark?.selector,
    fn: {
      cover: fns.cover,
      themeColor: fns.themeColor,
      size: fns.size,
      radius: fns.radius,
      rgba: fns.rgba,
      variant: fns.variant
    }
  };
  return DEFAULT_THEME;
}
const hasOwn = {}.hasOwnProperty;
function cx(...args) {
  const classes = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg)
      continue;
    const argType = typeof arg;
    if (argType === "string" || argType === "number") {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = { ...arg };
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === "object") {
      if (arg.toString === Object.prototype.toString) {
        for (const key2 in arg) {
          if (hasOwn.call(arg, key2) && arg[key2]) {
            classes.push(key2);
          }
        }
      } else {
        classes.push(arg.toString());
      }
    }
  }
  return classes.join(" ");
}
function cssFactory() {
  return { cx };
}
function fromEntries(entries) {
  const o = {};
  Object.keys(entries).forEach((key2) => {
    const [k, v] = entries[key2];
    o[k] = v;
  });
  return o;
}
const CLASS_KEY = "svelteui";
function createRef(refName) {
  return `__svelteui-ref-${refName || ""}`;
}
function sanitizeCss(object, theme2) {
  const refs = [];
  const classMap = {};
  const _sanitizeVariants = (obj) => {
    const variantsObject = obj.variation ?? obj;
    const variants = Object.keys(variantsObject);
    for (const variant2 of variants) {
      _sanitize(variantsObject[variant2]);
    }
  };
  const _sanitize = (obj) => {
    Object.keys(obj).map((value) => {
      if (value === "variants") {
        _sanitizeVariants(obj[value]);
        return;
      }
      if (value === "ref") {
        refs.push(obj.ref);
      }
      if (value === "darkMode") {
        obj[`${theme2.dark} &`] = obj.darkMode;
      }
      if (obj[value] === null || typeof obj[value] !== "object")
        return;
      _sanitize(obj[value]);
      if (value === "darkMode") {
        delete obj[value];
      } else if (value.startsWith("@media")) ;
      else if (!value.startsWith("&") && !value.startsWith(theme2.dark)) {
        const getStyles = css(obj[value]);
        classMap[value] = getStyles().toString();
        obj[`& .${getStyles().toString()}`] = obj[value];
        delete obj[value];
      }
    });
  };
  _sanitize(object);
  delete object["& .root"];
  return { classMap, refs: Array.from(new Set(refs)) };
}
function createStyles(input) {
  const getCssObject = typeof input === "function" ? input : () => input;
  function useStyles2(params = {}, options) {
    const theme2 = useSvelteUIThemeContext()?.theme || useSvelteUITheme();
    const { cx: cx2 } = cssFactory();
    const { override, name } = options || {};
    const dirtyCssObject = getCssObject(theme2, params, createRef);
    const sanitizedCss = Object.assign({}, dirtyCssObject);
    const { classMap, refs } = sanitizeCss(sanitizedCss, theme2);
    const root = dirtyCssObject["root"] ?? void 0;
    const cssObjectClean = root !== void 0 ? { ...root, ...sanitizedCss } : dirtyCssObject;
    const getStyles = css(cssObjectClean);
    const classes = fromEntries(Object.keys(dirtyCssObject).map((keys) => {
      const ref = refs.find((r) => r.includes(keys)) ?? "";
      const getRefName = ref?.split("-") ?? [];
      const keyIsRef = ref?.split("-")[getRefName?.length - 1] === keys;
      const value = keys.toString();
      let transformedClasses = classMap[value] ?? value;
      if (ref && keyIsRef) {
        transformedClasses = `${transformedClasses} ${ref}`;
      }
      if (keys === "root") {
        transformedClasses = getStyles({ css: override }).toString();
      }
      let libClass = `${CLASS_KEY}-${keys.toString()}`;
      if (name) {
        libClass = `${CLASS_KEY}-${name}-${keys.toString()}`;
        transformedClasses = `${transformedClasses} ${libClass}`;
      }
      return [keys, transformedClasses];
    }));
    return {
      cx: cx2,
      theme: theme2,
      classes,
      getStyles: css(cssObjectClean)
    };
  }
  return useStyles2;
}
const SYSTEM_PROPS = {
  mt: "marginTop",
  mb: "marginBottom",
  ml: "marginLeft",
  mr: "marginRight",
  pt: "paddingTop",
  pb: "paddingBottom",
  pl: "paddingLeft",
  pr: "paddingRight"
};
const NEGATIVE_VALUES = ["-xs", "-sm", "-md", "-lg", "-xl"];
function isValidSizeValue(margin) {
  return typeof margin === "string" || typeof margin === "number";
}
function getSizeValue(margin, theme2) {
  if (NEGATIVE_VALUES.includes(margin)) {
    return theme2.fn.size({ size: margin.replace("-", ""), sizes: theme2.space }) * -1;
  }
  return theme2.fn.size({ size: margin, sizes: theme2.space });
}
function getSystemStyles(systemStyles, theme2) {
  const styles = {};
  if (isValidSizeValue(systemStyles.p)) {
    const value = getSizeValue(systemStyles.p, theme2);
    styles.padding = value;
  }
  if (isValidSizeValue(systemStyles.m)) {
    const value = getSizeValue(systemStyles.m, theme2);
    styles.margin = value;
  }
  if (isValidSizeValue(systemStyles.py)) {
    const value = getSizeValue(systemStyles.py, theme2);
    styles.paddingTop = value;
    styles.paddingBottom = value;
  }
  if (isValidSizeValue(systemStyles.px)) {
    const value = getSizeValue(systemStyles.px, theme2);
    styles.paddingLeft = value;
    styles.paddingRight = value;
  }
  if (isValidSizeValue(systemStyles.my)) {
    const value = getSizeValue(systemStyles.my, theme2);
    styles.marginTop = value;
    styles.marginBottom = value;
  }
  if (isValidSizeValue(systemStyles.mx)) {
    const value = getSizeValue(systemStyles.mx, theme2);
    styles.marginLeft = value;
    styles.marginRight = value;
  }
  Object.keys(SYSTEM_PROPS).forEach((property) => {
    if (isValidSizeValue(systemStyles[property])) {
      styles[SYSTEM_PROPS[property]] = theme2.fn.size({
        size: getSizeValue(systemStyles[property], theme2),
        sizes: theme2.space
      });
    }
  });
  return styles;
}
const Box = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let getCSSStyles;
  let BoxStyles;
  let systemStyles;
  let $$restProps = compute_rest_props($$props, [
    "use",
    "element",
    "class",
    "css",
    "root",
    "m",
    "my",
    "mx",
    "mt",
    "mb",
    "ml",
    "mr",
    "p",
    "py",
    "px",
    "pt",
    "pb",
    "pl",
    "pr"
  ]);
  let { use = [], element = void 0, class: className = "", css: css$1 = {}, root = void 0, m = void 0, my = void 0, mx = void 0, mt = void 0, mb = void 0, ml = void 0, mr = void 0, p = void 0, py = void 0, px = void 0, pt = void 0, pb = void 0, pl = void 0, pr = void 0 } = $$props;
  const forwardEvents = createEventForwarder(get_current_component());
  const castRoot = () => root;
  const theme2 = useSvelteUIThemeContext()?.theme || useSvelteUITheme();
  let isHTMLElement;
  let isComponent;
  if ($$props.use === void 0 && $$bindings.use && use !== void 0) $$bindings.use(use);
  if ($$props.element === void 0 && $$bindings.element && element !== void 0) $$bindings.element(element);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.css === void 0 && $$bindings.css && css$1 !== void 0) $$bindings.css(css$1);
  if ($$props.root === void 0 && $$bindings.root && root !== void 0) $$bindings.root(root);
  if ($$props.m === void 0 && $$bindings.m && m !== void 0) $$bindings.m(m);
  if ($$props.my === void 0 && $$bindings.my && my !== void 0) $$bindings.my(my);
  if ($$props.mx === void 0 && $$bindings.mx && mx !== void 0) $$bindings.mx(mx);
  if ($$props.mt === void 0 && $$bindings.mt && mt !== void 0) $$bindings.mt(mt);
  if ($$props.mb === void 0 && $$bindings.mb && mb !== void 0) $$bindings.mb(mb);
  if ($$props.ml === void 0 && $$bindings.ml && ml !== void 0) $$bindings.ml(ml);
  if ($$props.mr === void 0 && $$bindings.mr && mr !== void 0) $$bindings.mr(mr);
  if ($$props.p === void 0 && $$bindings.p && p !== void 0) $$bindings.p(p);
  if ($$props.py === void 0 && $$bindings.py && py !== void 0) $$bindings.py(py);
  if ($$props.px === void 0 && $$bindings.px && px !== void 0) $$bindings.px(px);
  if ($$props.pt === void 0 && $$bindings.pt && pt !== void 0) $$bindings.pt(pt);
  if ($$props.pb === void 0 && $$bindings.pb && pb !== void 0) $$bindings.pb(pb);
  if ($$props.pl === void 0 && $$bindings.pl && pl !== void 0) $$bindings.pl(pl);
  if ($$props.pr === void 0 && $$bindings.pr && pr !== void 0) $$bindings.pr(pr);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    getCSSStyles = typeof css$1 === "function" ? css$1 : () => css$1;
    {
      {
        isHTMLElement = root && typeof root === "string";
        isComponent = root && typeof root === "function";
      }
    }
    BoxStyles = css({});
    systemStyles = getSystemStyles(
      {
        m,
        my,
        mx,
        mt,
        mb,
        ml,
        mr,
        p,
        py,
        px,
        pt,
        pb,
        pl,
        pr
      },
      theme2
    );
    $$rendered = ` ${isHTMLElement ? ` ${((tag) => {
      return tag ? `<${castRoot()}${spread(
        [
          {
            class: escape(className, true) + " " + escape(
              BoxStyles({
                css: { ...getCSSStyles(theme2), ...systemStyles }
              }),
              true
            )
          },
          escape_object($$restProps)
        ],
        {}
      )}${add_attribute("this", element, 0)}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
    })(castRoot())}` : `${isComponent && typeof root !== "string" ? `${validate_component(root || missing_component, "svelte:component").$$render(
      $$result,
      Object.assign(
        {},
        { use: [forwardEvents, [useActions, use]] },
        {
          class: className + " " + BoxStyles({
            css: { ...getCSSStyles(theme2), ...systemStyles }
          })
        },
        $$restProps,
        { this: element }
      ),
      {
        this: ($$value) => {
          element = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}` : `<div${spread(
      [
        {
          class: escape(className, true) + " " + escape(
            BoxStyles({
              css: { ...getCSSStyles(theme2), ...systemStyles }
            }),
            true
          )
        },
        escape_object($$restProps)
      ],
      {}
    )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}</div>`}`}`;
  } while (!$$settled);
  return $$rendered;
});
const useStyles$1 = createStyles((theme2, { align, spacing, justify }) => {
  return {
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: justify,
      alignItems: align,
      margin: -1 * theme2.fn.size({ size: spacing, sizes: theme2.space }) / 2
    }
  };
});
const ctx = "Grid";
const Grid$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cx2;
  let classes;
  let $$restProps = compute_rest_props($$props, ["use", "element", "class", "override", "align", "cols", "grow", "spacing", "justify"]);
  let $contextStore, $$unsubscribe_contextStore;
  let { use = [], element = void 0, class: className = "", override = {}, align = "stretch", cols = 12, grow = false, spacing = "md", justify = "flex-start" } = $$props;
  const contextStore = writable({ cols, grow, spacing });
  $$unsubscribe_contextStore = subscribe(contextStore, (value) => $contextStore = value);
  setContext(ctx, contextStore);
  if ($$props.use === void 0 && $$bindings.use && use !== void 0) $$bindings.use(use);
  if ($$props.element === void 0 && $$bindings.element && element !== void 0) $$bindings.element(element);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.override === void 0 && $$bindings.override && override !== void 0) $$bindings.override(override);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0) $$bindings.align(align);
  if ($$props.cols === void 0 && $$bindings.cols && cols !== void 0) $$bindings.cols(cols);
  if ($$props.grow === void 0 && $$bindings.grow && grow !== void 0) $$bindings.grow(grow);
  if ($$props.spacing === void 0 && $$bindings.spacing && spacing !== void 0) $$bindings.spacing(spacing);
  if ($$props.justify === void 0 && $$bindings.justify && justify !== void 0) $$bindings.justify(justify);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    set_store_value(contextStore, $contextStore = { cols, grow, spacing }, $contextStore);
    ({ cx: cx2, classes } = useStyles$1({ align, spacing, justify }, { override, name: "Grid" }));
    $$rendered = ` ${validate_component(Box, "Box").$$render(
      $$result,
      Object.assign({}, { use }, { class: cx2(className, classes.root) }, $$restProps, { element }),
      {
        element: ($$value) => {
          element = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_contextStore();
  return $$rendered;
});
const SIZES = ["xs", "sm", "md", "lg", "xl"];
const columnWidth = (span, columns) => `${100 / (columns / span)}%`;
const columnOffset = (offset, columns) => offset ? `${100 / (columns / offset)}%` : void 0;
const breakpointsStyles = (sizes, offsets, theme2, columns, grow) => {
  return SIZES.reduce((acc, size2) => {
    if (typeof sizes[size2] === "number") {
      acc[`@media (min-width: ${parseInt(theme2.breakpoints[size2].value) + 1}px)`] = {
        flexBasis: columnWidth(sizes[size2], columns),
        flexShrink: 0,
        maxWidth: grow ? "unset" : columnWidth(sizes[size2], columns),
        marginLeft: columnOffset(offsets[size2], columns),
        padding: theme2.fn.size({ size: size2, sizes: theme2.space }) / 2
      };
    }
    return acc;
  }, {});
};
const useStyles = createStyles((theme2, { cols, grow, spacing, span, offset, offsetXs, offsetSm, offsetMd, offsetLg, offsetXl, xs, sm, md, lg, xl }) => {
  return {
    root: {
      boxSizing: "border-box",
      flexGrow: grow ? 1 : 0,
      padding: theme2.fn.size({ size: spacing, sizes: theme2.space }) / 2,
      marginLeft: columnWidth(offset, cols),
      flexBasis: columnWidth(span, cols),
      flexShrink: 0,
      maxWidth: grow ? "unset" : columnWidth(span, cols),
      ...breakpointsStyles({ xs, sm, md, lg, xl }, {
        xs: offsetXs,
        sm: offsetSm,
        md: offsetMd,
        lg: offsetLg,
        xl: offsetXl
      }, theme2, cols, grow)
    }
  };
});
function isSpanValid(span) {
  return typeof span === "number" && span > 0 && span % 1 === 0;
}
const Col = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cols;
  let grow;
  let spacing;
  let _span;
  let valid;
  let cx2;
  let classes;
  let getStyles;
  let $$restProps = compute_rest_props($$props, [
    "use",
    "element",
    "class",
    "override",
    "span",
    "offset",
    "offsetXs",
    "offsetSm",
    "offsetMd",
    "offsetLg",
    "offsetXl",
    "xs",
    "sm",
    "md",
    "lg",
    "xl"
  ]);
  let $state, $$unsubscribe_state;
  let { use = [], element = void 0, class: className = "", override = {}, span = void 0, offset = 0, offsetXs = 0, offsetSm = 0, offsetMd = 0, offsetLg = 0, offsetXl = 0, xs = void 0, sm = void 0, md = void 0, lg = void 0, xl = void 0 } = $$props;
  const state = getContext("Grid");
  $$unsubscribe_state = subscribe(state, (value) => $state = value);
  if ($$props.use === void 0 && $$bindings.use && use !== void 0) $$bindings.use(use);
  if ($$props.element === void 0 && $$bindings.element && element !== void 0) $$bindings.element(element);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.override === void 0 && $$bindings.override && override !== void 0) $$bindings.override(override);
  if ($$props.span === void 0 && $$bindings.span && span !== void 0) $$bindings.span(span);
  if ($$props.offset === void 0 && $$bindings.offset && offset !== void 0) $$bindings.offset(offset);
  if ($$props.offsetXs === void 0 && $$bindings.offsetXs && offsetXs !== void 0) $$bindings.offsetXs(offsetXs);
  if ($$props.offsetSm === void 0 && $$bindings.offsetSm && offsetSm !== void 0) $$bindings.offsetSm(offsetSm);
  if ($$props.offsetMd === void 0 && $$bindings.offsetMd && offsetMd !== void 0) $$bindings.offsetMd(offsetMd);
  if ($$props.offsetLg === void 0 && $$bindings.offsetLg && offsetLg !== void 0) $$bindings.offsetLg(offsetLg);
  if ($$props.offsetXl === void 0 && $$bindings.offsetXl && offsetXl !== void 0) $$bindings.offsetXl(offsetXl);
  if ($$props.xs === void 0 && $$bindings.xs && xs !== void 0) $$bindings.xs(xs);
  if ($$props.sm === void 0 && $$bindings.sm && sm !== void 0) $$bindings.sm(sm);
  if ($$props.md === void 0 && $$bindings.md && md !== void 0) $$bindings.md(md);
  if ($$props.lg === void 0 && $$bindings.lg && lg !== void 0) $$bindings.lg(lg);
  if ($$props.xl === void 0 && $$bindings.xl && xl !== void 0) $$bindings.xl(xl);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    ({ cols, grow, spacing } = $state);
    _span = span || cols || 0;
    valid = isSpanValid(_span) && _span <= cols;
    ({ cx: cx2, classes, getStyles } = useStyles(
      {
        span: _span,
        cols,
        grow,
        spacing,
        offset,
        offsetXs,
        offsetSm,
        offsetMd,
        offsetLg,
        offsetXl,
        xs,
        sm,
        md,
        lg,
        xl
      },
      { name: "Col" }
    ));
    $$rendered = `${valid ? `${validate_component(Box, "Box").$$render(
      $$result,
      Object.assign(
        {},
        { use },
        {
          class: cx2(className, classes.root, getStyles({ css: override }))
        },
        $$restProps,
        { element }
      ),
      {
        element: ($$value) => {
          element = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}` : ``}`;
  } while (!$$settled);
  $$unsubscribe_state();
  return $$rendered;
});
Grid$1.Col = Col;
const Grid = Grid$1;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<body class="w-full pl-5 pr-5 md:pl-6 md:pr-4 xl:pl-8 xl:pr-12 pt-8 bg-[#1B1B1B]">${validate_component(Grid, "Grid").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Grid.Col, "Grid.Col").$$render($$result, { sm: 6, md: 6, xs: 12, lg: 6, xl: 6 }, {}, {
        default: () => {
          return `<div class="w-full h-full align-middle "><div class="mt-24 " data-svelte-h="svelte-amkwe6"><p class="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl extra:text-8xl text-white text-center sm:text-center md:text-left lg:text-left xl:text-left">Crafting <br> Unforgettable <br> Journeys</p> <p class="text-base sm:text-base md:text-base lg:text-lg xl:text-xl extra:text-3xl text-gray-400 text-center sm:text-center md:text-left lg:text-left xl:text-left mt-7">Experience the joy of hassle-free travel <br> planning with our AI itinerary builder.</p></div> <div class="flex align-top items-center justify-center sm:flex sm:items-center sm:justify-center md:flex md:items-start md:justify-start"><button class="object-scale-down py-3 px-5 sm:sm:px-5 sm:py-3 md:py-3 md:px-6 extra:py-5 extra:px-12 bg-[#FF830F] text-white rounded-xl mt-6 flex text-sm sm:text-md md:text-lg extra:text-2xl hover:bg-[#FF9900] hover:scale-105 active:bg-[#FF6600] active:scale-95 transition duration-300 ease-in-out" data-svelte-h="svelte-18ib45p">Create Now</button></div></div>`;
        }
      })} ${validate_component(Grid.Col, "Grid.Col").$$render($$result, { sm: 6, md: 6, xs: 12, lg: 6, xl: 6 }, {}, {
        default: () => {
          return `<div class="w-full flex-col align-top items-start justify-end visible md:flex hidden " data-svelte-h="svelte-19j5kik"><img class="image" src="/front.png"></div>`;
        }
      })} ${validate_component(Grid.Col, "Grid.Col").$$render(
        $$result,
        {
          class: "sm=12 md=12 xs=12 lg=12 xl=12"
        },
        {},
        {
          default: () => {
            return `<div class="flex w-full justify-center" data-svelte-h="svelte-ofn3so"><h1 class="mt-32 text-2xl sm:text-lg md:text-2xl lg:text-2xl xl:text-3xl extra:text-5xl font-sans text-white">Features</h1></div>`;
          }
        }
      )} ${validate_component(Grid.Col, "Grid.Col").$$render($$result, { xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }, {}, {
        default: () => {
          return `<div class="mt-5 w-full md:h-36 lg:h-40 xl:h-44 extra:h-64 flex items-center align-middle justify-center " data-svelte-h="svelte-925axv"><div class="m-5 ml-0 mr-0 rounded-lg w-full h-full border flex-col align-middle items-center justify-center border-black bg-[#2C3036]"><div class="mt-6 flex align-middle items-center justify-center w-full"><img class="ml-3 align-middle w-10 extra:size-1/12 md:w-8 " src="budget.png"> <h1 class="ml-3 sm:text-md md:text-base lg:text-base xl:text-base extra:text-3xl text-white">Budget Optimized Itineraries (Upcoming)</h1></div> <div class="mt-3 w-full h-2/4 flex flex-col items-center align-middle justify-center "><h2 class="mb-6 md:text-sm lg:text-base xl:text-lg extra:text-2xl ml-3 mr-3 text-[#9CA3AF] text-center">Personalized travel plans that respect your budget, ensuring an affordable travel experience without compromising on fun.</h2></div></div></div>`;
        }
      })} ${validate_component(Grid.Col, "Grid.Col").$$render($$result, { xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }, {}, {
        default: () => {
          return `<div class="mt-5 w-full md:h-36 lg:h-40 xl:h-44 extra:h-64 flex items-center align-middle justify-center " data-svelte-h="svelte-rvcszr"><div class="m-5 ml-0 mr-0 rounded-lg w-full h-full border flex-col align-middle items-center justify-center border-black bg-[#2C3036]"><div class="mt-6 flex align-middle items-center justify-center w-full"><img class="ml-3 align-middle w-10 extra:size-1/12 md:w-8 " src="time.png"> <h1 class="ml-3 sm:text-md md:text-base lg:text-base xl:text-base extra:text-3xl text-white">Time-Optimized Plans (Upcoming)</h1></div> <div class="mt-3 w-full h-2/4 flex flex-col items-center align-middle justify-center "><h2 class="mb-6 md:text-sm lg:text-base xl:text-lg extra:text-2xl ml-3 mr-3 text-[#9CA3AF] text-center">Efficient itineraries crafted to make the most of your available time, ensuring a maximized travel experience.</h2></div></div></div>`;
        }
      })} ${validate_component(Grid.Col, "Grid.Col").$$render($$result, { xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }, {}, {
        default: () => {
          return `<div class="mt-5 w-full md:h-36 lg:h-40 xl:h-44 extra:h-64 flex items-center align-middle justify-center " data-svelte-h="svelte-jh3gnt"><div class="m-5 ml-0 mr-0 rounded-lg w-full h-full border flex-col align-middle items-center justify-center border-black bg-[#2C3036]"><div class="mt-6 flex align-middle items-center justify-center w-full"><img class="ml-3 align-middle w-10 extra:size-1/12 md:w-8 " src="customize.png"> <h1 class="ml-3 sm:text-md md:text-base lg:text-base xl:text-base extra:text-3xl text-white">Customizable Travel Plans (Upcoming)</h1></div> <div class="mt-3 w-full h-2/4 flex flex-col items-center align-middle justify-center "><h2 class="mb-6 md:text-sm lg:text-base xl:text-lg extra:text-2xl ml-3 mr-3 text-[#9CA3AF] text-center">Tailor your itinerary to match your personal interests and preferences, with the flexibility to adjust as you go.</h2></div></div></div>`;
        }
      })} ${validate_component(Grid.Col, "Grid.Col").$$render($$result, { xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }, {}, {
        default: () => {
          return `<div class="mt-5 w-full md:h-36 lg:h-40 xl:h-44 extra:h-64 flex items-center align-middle justify-center " data-svelte-h="svelte-ck1y0t"><div class="m-5 ml-0 mr-0 rounded-lg w-full h-full border flex-col align-middle items-center justify-center border-black bg-[#2C3036]"><div class="mt-6 flex align-middle items-center justify-center w-full"><img class="ml-3 align-middle w-10 extra:size-1/12 md:w-8 " src="customize.png"> <h1 class="ml-3 sm:text-md md:text-base lg:text-base xl:text-base extra:text-3xl text-white">Reliable Recommendations</h1></div> <div class="mt-3 w-full h-2/4 flex flex-col items-center align-middle justify-center "><h2 class="mb-6 md:text-sm lg:text-base xl:text-lg extra:text-2xl ml-3 mr-3 text-[#9CA3AF] text-center">Trustworthy suggestions for accommodations and activities curated by travel experts for a stress-free journey.</h2></div></div></div>`;
        }
      })} ${validate_component(Grid.Col, "Grid.Col").$$render($$result, { xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }, {}, {
        default: () => {
          return `<div class="mt-5 w-full md:h-36 lg:h-40 xl:h-44 extra:h-64 flex items-center align-middle justify-center " data-svelte-h="svelte-1arb2v8"><div class="m-5 ml-0 mr-0 rounded-lg w-full h-full border flex-col align-middle items-center justify-center border-black bg-[#2C3036]"><div class="mt-6 flex align-middle items-center justify-center w-full"><img class="ml-3 align-middle w-10 extra:size-1/12 md:w-8 " src="customize.png"> <h1 class="ml-3 sm:text-md md:text-base lg:text-base xl:text-base extra:text-3xl text-white">Interactive Map Integration (Upcoming)</h1></div> <div class="mt-3 w-full h-2/4 flex flex-col items-center align-middle justify-center "><h2 class="mb-6 md:text-sm lg:text-base xl:text-lg extra:text-2xl ml-3 mr-3 text-[#9CA3AF] text-center">Visualize your travel plans with interactive maps, explore destinations, and efficiently plan out your adventure.</h2></div></div></div>`;
        }
      })} ${validate_component(Grid.Col, "Grid.Col").$$render($$result, { xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }, {}, {
        default: () => {
          return `<div class="mt-5 w-full md:h-36 lg:h-40 xl:h-44 extra:h-64 flex items-center align-middle justify-center " data-svelte-h="svelte-sqk8c"><div class="m-5 ml-0 mr-0 rounded-lg w-full h-full border flex-col align-middle items-center justify-center border-black bg-[#2C3036]"><div class="mt-6 flex align-middle items-center justify-center w-full"><img class="ml-3 align-middle w-10 extra:size-1/12 md:w-8 " src="customize.png"> <h1 class="ml-3 sm:text-md md:text-base lg:text-base xl:text-base extra:text-3xl text-white">Multi-Destination Support (Upcoming)</h1></div> <div class="mt-3 w-full h-2/4 flex flex-col items-center align-middle justify-center "><h2 class="mb-6 md:text-sm lg:text-base xl:text-lg extra:text-2xl ml-3 mr-3 text-[#9CA3AF] text-center">Plan complex trips with ease, whether you&#39;re hopping cities or countries, we&#39;ve got you covered every step of the way.</h2></div></div></div>`;
        }
      })} ${validate_component(Grid.Col, "Grid.Col").$$render(
        $$result,
        {
          class: "sm=12 md=12 xs=12 lg=12 xl=12"
        },
        {},
        {
          default: () => {
            return `<div class="flex w-full justify-center" data-svelte-h="svelte-6pco1h"><h1 class="mt-32 text-2xl sm:text-lg md:text-2xl lg:text-2xl xl:text-3xl extra:text-5xl font-sans text-white">Frequently Asked Questions</h1></div>`;
          }
        }
      )} ${validate_component(Grid.Col, "Grid.Col").$$render($$result, { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }, {}, {
        default: () => {
          return `<div class="mt-5 w-full md:h-36 lg:h-40 xl:h-44 extra:h-64 flex items-center align-middle justify-center " data-svelte-h="svelte-1p89wfc"><div class="m-5 ml-0 mr-0 rounded-lg w-full h-full border flex-col align-middle items-center justify-center border-black bg-[#2C3036]"><div class="mt-7 ml-8 mr-8 flex align-middle items-start justify-start w-full "><h1 class="text-left sm:text-md md:text-base lg:text-lg xl:text-xl extra:text-3xl text-white">What is Backpack?</h1></div> <div class="w-full h-3/4 flex flex-col items-center align-middle justify-center "><h2 class="mb-6 ml-8 mr-8 md:text-sm lg:text-base xl:text-lg extra:text-2xl text-[#9CA3AF] text-left">Backpack is an AI-driven travel planner that automatically generates personalized itineraries based on user preferences, travel dates, and destinations. It’s designed to streamline the travel planning process, saving users time and effort.</h2></div></div></div>`;
        }
      })} ${validate_component(Grid.Col, "Grid.Col").$$render($$result, { xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }, {}, {
        default: () => {
          return `<div class="mt-5 w-full md:h-36 lg:h-40 xl:h-44 extra:h-64 flex items-center align-middle justify-center " data-svelte-h="svelte-z8das2"><div class="m-5 ml-0 mr-0 rounded-lg w-full h-full border flex-col align-middle items-center justify-center border-black bg-[#2C3036]"><div class="mt-7 ml-8 mr-8 flex align-middle items-start justify-start w-full "><h1 class="text-left sm:text-md md:text-base lg:text-lg xl:text-xl extra:text-3xl text-white">How does Backpack create travel plans?</h1></div> <div class="w-full h-3/4 flex flex-col items-center align-middle justify-center "><h2 class="mb-6 ml-8 mr-8 md:text-sm lg:text-base xl:text-lg extra:text-2xl text-[#9CA3AF] text-left">Backpack uses advanced AI algorithms to analyze user inputs, such as preferred destination, interests, and travel dates. It then generates a customized itinerary that includes recommendations for places to explore.</h2></div></div></div>`;
        }
      })}`;
    }
  })}</body>  ${slots.default ? slots.default({}) : ``}`;
});
export {
  Page as default
};
