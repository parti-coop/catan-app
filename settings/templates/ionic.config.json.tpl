{
  "name": "catan-app",
  "app_id": "",
  "v2": true,
  "typescript": true
  <% if(useProxy) { %>
  , "proxies":[
    {
      "path":"/proxy",
      "proxyUrl":"${constants.apiBaseUrl}"
    }
  ]
  <% } %>
}
