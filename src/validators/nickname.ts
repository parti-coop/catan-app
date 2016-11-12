import { FormControl } from '@angular/forms';

import { UserData } from '../providers/user-data';

export class NicknameAsyncValidator {

  static existsNickname(control: FormControl, userData: UserData): Promise<any> {
    return NicknameAsyncValidator.checkNickname(control, userData, null, { "notFound": true });
  }

  static notExistsNickname(control: FormControl, userData: UserData): Promise<any> {
    return NicknameAsyncValidator.checkNickname(control, userData, { "found": true }, null);
  }

  static checkNickname(control: FormControl, userData: UserData, foundResult, notFoundResult): Promise<any> {
    return new Promise((resolve, reject) => {
      if(!control.value) {
        resolve(null);
        return;
      }
      userData.byNickname(control.value).subscribe(
        user => {
          if(!!user) {
            resolve(foundResult);
          } else{
            resolve(notFoundResult);
          }
        },
        err => resolve(notFoundResult)
      );
    });
  }

}
