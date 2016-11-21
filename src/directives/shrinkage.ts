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
    }
  }

  calculateRender(timestamp) {
    if(this.isShrinked || !this.isShrinkedStared) {
      return;
    }

    this.lastHeaderTop += -60;

    if (this.lastHeaderTop <= 0) {
      this.isShrinked = true;
      this.lastHeaderTop = 0;
      this.onShrinked.emit();
    }

    this.renderer.setElementStyle(this.target, 'height', `${this.lastHeaderTop}px`);
    this.renderer.setElementStyle(this.target, 'overflow', 'hidden');
    this.content.resize();
  }

  extends() {
    if(!this.isShrinked) {
      return;
    }

    this.reset();
    this.renderer.setElementStyle(this.target, 'height', 'initial');
    setTimeout(() => {
      this.content.resize();
      this.onExtended.emit();
      this.render(null);
    }, 10);
  }
}
