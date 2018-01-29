
class LinkParser {
  static ensureProtocol(url) {
    // Add https as default if protocol is missing
    if (url.indexOf('://') === -1) {
      url = 'https://' + url;
    }
    // Get rid of extra backslases
    url = url.replace(/^([^:]*):*\/*/, '$1://');
    return url;
  }
}

export {LinkParser};
