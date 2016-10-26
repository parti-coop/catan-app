import { Injectable, ChangeDetectorRef, Pipe } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AsyncPipe } from '@angular/common';
import moment from 'moment';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeWhile';

@Pipe({
  name: 'partiDateTimeFormatObservable'
})
@Injectable()
export class PartiDateTimeFormatObservablePipe {
  isFullFormat: boolean;
  timer: Observable<string>;

  constructor() {}

  transform(obj: any): any {
    this.isFullFormat = false;
    let date = moment(obj);
    if (date) {
      return this.getObservable(date);
    }
  }

  private getObservable(date: moment.Moment) {
    return Observable.interval(this.getUpdateIntervalAsSeconds(date) * 1000).startWith(0)
      .takeWhile(() => {
        return this.isYoung(date) || !this.isFullFormat;
      }).map(()=> {
        if(this.isYoung(date)) {
          this.isFullFormat = false;
          return date.from(moment());
        } else {
          this.isFullFormat = true;
          return date.format('YYYY. M. D');
        }
      });
  };

  private getUpdateIntervalAsSeconds(date: moment.Moment) {
    let howOld = this.getHowOld(date);
    if (howOld < 1) {
      return 30;
    } else if (howOld < 60) {
      return 60;
    } else if (howOld < 180) {
      return 60 * 10;
    } else {
      return 3600;
    }
  }

  private isYoung(date: moment.Moment) {
    return this.getHowOld(date) <= (24 * 60 * 5);
  }

  private getHowOld(date: moment.Moment) {
    return Math.abs(moment().diff(date, 'minute'));
  }
}
