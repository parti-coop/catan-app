import { FormControl } from '@angular/forms';

import { UserData } from '../providers/user-data';

export class NicknameAsyncValidator {

  static checkNickname(control: FormControl, userData: UserData): Promise<any> {
    return new Promise((resolve, reject) => {
      if(!control.value) {
        resolve(null);
        return;
      }
      userData.byNickname(control.value).subscribe(
        user => {
          if(!!user) {
            resolve(null);
          } else{
            resolve({ "notFound": true });
          }
        },
        err => resolve({ "notFound": true })
      );
    });
  }

}
