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
  @Input('targetItems') targetItems: any[];
  @Input() scrolls: Scroll[];
  @Output() onShrinked = new EventEmitter();
  @Output() onExtended = new EventEmitter();

  constructor(
    private el: ElementRef,
    private renderer: Renderer
  ) {}

  ngAfterViewInit() {
    this.originHeaderTop = this.target.clientHeight;
    this.initStyle();
    this.slide('in');
    this.reset();

    // Kick of rendering
    this.render(null);
    // This listener only updates values. It doesn't do any rendering.
    this.content.ionScroll.subscribe((event) => {
      this.onPageScroll(event);
    });
    _.forEach(this.scrolls, (scroll) => {
      scroll.addScrollEventListener((event) => {
        this.onPageScroll(event);
      });
    });
  }

  initStyle() {
    this.renderer.setElementStyle(this.target, 'overflow', 'hidden');
    this.renderer.setElementStyle(this.target, 'transition', 'all 200ms');
    _(this.targetItems).forEach((child) => {
      this.renderer.setElementStyle(child, 'transition', 'all 200ms');
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
    this.slide('in');
    setTimeout(() => {
      this.content.resize();
      this.onExtended.emit();
      this.render(null);
    }, 10);
  }

  slide(direction: string) {
    if(direction == 'out') {
      this.renderer.setElementStyle(this.target, 'height', '0');
      _(this.targetItems).forEach((child) => {
        this.renderer.setElementStyle(child, 'opacity', '0.5');
      });
    } else {
      this.renderer.setElementStyle(this.target, 'height', `${this.originHeaderTop}px`);
      _(this.targetItems).forEach((child) => {
        this.renderer.setElementStyle(child, 'opacity', '1');
      });
    }
  }
}
