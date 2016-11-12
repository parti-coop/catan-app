import { FormControl } from '@angular/forms';

export class EmailValidator {

  static checkEmail(control: FormControl){
    if(!control.value) {
      return null;
    }

    var lowercaseValue = control.value.toLowerCase();
    let regExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    if (!regExp.test(lowercaseValue)) {
      return { "invalidEmail": true };
    }

    return null;
  }

}
