import { Directive, ElementRef, Input, Output,
         Renderer, AfterViewInit, EventEmitter } from '@angular/core';
import { Content, Scroll } from 'ionic-angular';

import _ from 'lodash';

@Directive({
  selector: '[shrinkage]'
})
export class Shrinkage implements AfterViewInit {

  private lastHeaderTop: number = 0;
  private originHeaderTop: number = 0;
  private isShrinked: boolean = false;
  private isShrinkedStared: boolean = false;

  // Might end up separate shrinkageHeader, shrinkageFooter
  @Input('shrinkage') content: Content;
  @Input() target: any;
  @Input() scrolls: Scroll[];
  @Output() onShrinked = new EventEmitter();
  @Output() onExtended = new EventEmitter();

  constructor(
    private el: ElementRef,
    private renderer: Renderer
  ) {}

  ngAfterViewInit() {
    this.originHeaderTop = this.target.clientHeight;
    this.reset();

    // Kick of rendering
    this.render(null);
    // This listener only updates values. It doesn't do any rendering.
    this.content.addScrollListener((event) => {
      this.onPageScroll(event);
    });
    _.forEach(this.scrolls, (scroll) => {
      scroll.addScrollEventListener((event) => {
        this.onPageScroll(event);
      });
    });
  }

  reset() {
    this.isShrinked = false;
    this.isShrinkedStared = false;
    this.lastHeaderTop = this.originHeaderTop;
  }

  render(ts) {
    if(!this.isShrinked) {
      requestAnimationFrame(ts => this.render(ts));

      this.calculateRender(ts);
    }
  }

  private onPageScroll(event) {
    if(this.isShrinked || this.isShrinkedStared) {
      return;
    }

    if (event.target.scrollTop > 0) {
      this.isShrinkedStared = true;
      setTimeout(() => {
        this.renderer.setElementStyle(this.target, 'overflow', 'hidden');
        this.slide('out');
      }, 10);
    }
  }

  calculateRender(timestamp) {
    if(this.isShrinked || !this.isShrinkedStared) {
      return;
    }

    if (this.target.clientHeight <= 0) {
      this.isShrinked = true;
      this.lastHeaderTop = 0;
      this.onShrinked.emit();
    }
    this.content.resize();
  }

  extends() {
    if(!this.isShrinked) {
      return;
    }

    this.reset();
    console.log('test1');
    this.slide('in');
    setTimeout(() => {
      this.content.resize();
      this.onExtended.emit();
      this.render(null);
    }, 10);
  }

  slide(direction: string) {
    if(direction == 'out') {
      this.renderer.setElementClass(this.target, 'slide-in', false);
      this.renderer.setElementClass(this.target, 'slide-out', true);
    } else {
      this.renderer.setElementClass(this.target, 'slide-out', false);
      this.renderer.setElementClass(this.target, 'slide-in', true);
    }
  }
}
