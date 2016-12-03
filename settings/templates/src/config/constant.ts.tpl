import { Injectable } from "@angular/core";

@Injectable()
export class PartiEnvironment {
  <% for(var key in constants) { %>
    public <%= key %>: string;
  <% } %>

  public isProxy: boolean;
  public originalApiBaseUrl: string;

  constructor() {
    <% for(var key in constants) { %>
      this.<%= key %> = "<%= constants[key] %>";
    <% } %>

    <% if(useProxy) { %>
      this.originalApiBaseUrl = "<%= constants['apiBaseUrl'] %>";
      this.apiBaseUrl = "/proxy";
      this.isProxy = true;
    <% } else { %>
      this.isProxy = false;
    <% } %>
  }
}
