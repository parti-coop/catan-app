import { trigger, state, style, transition, animate, AUTO_STYLE } from '@angular/core';

export const appAnimation: any[] = [
  trigger('fadeInOut', [
    state('in', style({
      opacity: 1,
      visibility: 'visible'
    })),
    state('out', style({
      opacity: 0,
      visibility: 'hidden'
    })),
    transition('out => in', [
      animate('200ms 500ms ease-in')
    ]),
    transition('in => out', [
      animate('200ms')
    ])
  ]),
  trigger('shrinkCover', [
    state('before, void', style({
      height: AUTO_STYLE,
      opacity: 1,
      visibility: 'visible'
    })),
    state('after', style({
      height: 0,
      opacity: 0,
      visibility: 'hidden'
    })),
    transition('before <=> after', [
      animate('100ms 200ms ease-in')
    ])
  ])
];
