const getQueryStringValue = key => decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" +
  encodeURIComponent(key).replace(/[.+*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));

export default getQueryStringValue;