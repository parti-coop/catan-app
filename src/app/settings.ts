import {Injectable} from "@angular/core";

@Injectable()
export class Settings {
  public appTitle: string;

  constructor() {
    console.log(ENVIRONMENT);
    if(ENVIRONMENT == "prod") {
       this.appTitle = '빠띠';
    } else {
      this.appTitle = '빠띠 dev';
    }
  }
}
