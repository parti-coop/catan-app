import { Injectable } from "@angular/core";

@Injectable()
export class PartiEnvironment {
  <% for(var key in constants) { %>
    public <%= key %>: string;
  <% } %>

  constructor() {
    <% for(var key in constants) { %>
      this.<%= key %> = "<%= constants[key] %>";
    <% } %>

    <% if(useProxy) { %>
      this.apiBaseUrl = "/proxy";
    <% } %>
  }
}
