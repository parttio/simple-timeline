import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js'

/**
 * Element for single item in timeline.
 *
 * @fires click - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart circle - The the circle at timelime
 * @csspart line - The line from thext to circle
 * @csspart content - Text content or an element slot
 */
@customElement('simple-timeline-item')
export class SimpleTimelineItem extends LitElement {

  /**
   * Relative X position on timeline. 0=left 100=right.
   */
  @property({ attribute: true, reflect: true, type: Number }) x = 0;


  /**
   * Relative Y index on timeline. This can be integer value from -5 to 5 
   * representing the content distance from timeline and length of the connecting
   * line. Positive values are above the timeline and negative below. Default value is 1.
   */
  @property({ attribute: true, reflect: true, type: Number }) y = 1;

  
  static override styles = css`

      @import "./simple-timeline.css";

      @keyframes slidein {
          0% { transform: translate(-100%, 0); }
          100% { transform: translate(0, 0); }
      }

      :host {
  
    /* Default item styles */
    --simple-timeline-item-size: var(--lumo-size-s);
    --simple-timeline-item-width: 0.2rem;
    --simple-timeline-item-font-size: var(--lumo-font-size-s);
    --simple-timeline-item-style: solid;
    --simple-timeline-item-color: var(--simple-timeline-color);;
    --simple-timeline-item-fill: var(--simple-timeline-background-color);   

    position: absolute;
    box-sizing: border-box;
    display:flex;
    flex-direction: column-reverse;
    height: fit-content;
    bottom: 50%;
    background-color: transparent;
    border: 1px solid red;
    border-style: var(--simple-timeline-item-style, solid);
    border-width: 0;
    padding: 0;
    animation-name: slidein;
    animation-delay: 0s;
    animation-duration: 0.5s;
      }

  :host.em [part='content'],
  :host.em [part='circle'] ,
  :host(:hover) [part='content'],
  :host(:hover) [part='circle'] {
    transform: scale(1.2);
  }    

  :host(:hover) [part='content'],
  :host(:hover) [part='circle'] {
    cursor: pointer;
  }

  [part='line'] {
    position: relative;
    box-sizing: border-box;
    width: var(--simple-timeline-item-size, 1.8rem);
    height: 1rem; /* Default height only */
    left: calc(var(--simple-timeline-item-width, 0.1rem) * -0.5);
    background-color: transparent;
    border: 0;
    border-color: var(--simple-timeline-item-color);
    border-style: var(--simple-timeline-item-style, solid);
    border-left-width: var(--simple-timeline-item-width, 0.1rem);
  } 

  [part='circle'] {
    position: relative;
    z-index:1;
    box-sizing: border-box;
    width: var(--simple-timeline-item-size, 1.8rem);
    aspect-ratio: 1;
    left: calc(var(--simple-timeline-item-size, 1.8rem) * -0.5);
    border-radius: 50%;
    clip-path: circle();
    transition: all .2s ease-in-out;
    border-color: var(--simple-timeline-item-color);
    border-width: var(--simple-timeline-item-width, 0.1rem);
    border-style: var(--simple-timeline-item-style, solid);
    background-color: var(--simple-timeline-item-fill, white);
  }

  [part='content'] {
    line-height: 1.25rem;
    position: relative;
    bottom: 100%;
    left: -0.2rem;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    max-width: 6rem;
    color: var(--simple-timeline-item-color);
    transition: all .2s ease-in-out;
  }

  :host(.primary) {
    color: var(--simple-timeline-highlight-color, blue);
    --simple-timeline-item-color: var(--simple-timeline-highlight-color, blue);
  }
  
  :host(.secondary) {
    color: var(--simple-timeline-dim-color, gray);
    --simple-timeline-item-color: var(--simple-timeline-dim-color, gray);
  }
  
  :host(.error) {
    color: var(--simple-timeline-error-color, red);
    --simple-timeline-item-color: var(--simple-timeline-error-color, red);
  }
  
  :host(.filled) {
    font-variant: bold;
    --simple-timeline-item-fill: currentColor;
    --simple-timeline-item-color: currentColor;
  }

    `;

  override render() {
    return html`<div part="circle" @click=${this.handleClick}></div>
        <div part="line" style="height: ${this.y >= 0 ? this.y : -1 * this.y}em !important;" @click=${this.handleClick}></div>
        <div part="content" @click=${this.handleClick}><slot></slot></div>`;
  }
  handleClick(): void {
    const idx = Array.prototype.indexOf.call(this.parentElement?.children, this);
    this.dispatchEvent(new CustomEvent("simple-timeline-item-click", { detail: idx, bubbles: true }));
  }


  override connectedCallback(): void {
    super.connectedCallback();
    this.style.left = this.x + '%';

    let translateX = '0', translateY = '0';

    if (this.y > 0) {
      // Above line
      this.style.flexDirection = 'column-reverse';
      this.style.bottom = '50%';
      translateY = 'calc(0.5*var(--simple-timeline-item-size, 1.8em))'
    } else {
      // Below line
      this.style.flexDirection = 'column';
      this.style.top = '50%';
      translateY = 'calc(-0.5*var(--simple-timeline-item-size, 1.8em))'
    }
    if (this.x >= 90) {
      this.style.alignItems = 'flex-end';
      translateX = '-' + (this.x - 90) * 10 + '%';
    }
    this.style.translate = translateX + ' ' + translateY;
  }

  static get is() {
    return 'simple-timeline-item';
  }
}


/**
 * Timeline element presenting a relative 0% to 100% timeline of items.
 *
 * @fires click - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart circle - The the circle at timelime
 * @csspart line - The line from thext to circle
 * @csspart content - Text content or an element slot
 */
@customElement('simple-timeline')
export class SimpleTimeline extends LitElement {

  @property() caption?: string;
  @property({ attribute: true, reflect: true }) breaks = '';

  static override styles = css`
      @keyframes slidein {
          0% { transform: translate(-100%, 0); }
          20% { transform: translate(-100%, 0); }
          100% { transform: translate(0, 0); }
      }

      :host {
    /* Default timeline styles */
    --simple-timeline-color: var(--lumo-body-text-color, black);
    --simple-timeline-width: var(--lumo-space-xs, 0.25rem);
    --simple-timeline-background-color: var(--lumo-base-color, white);
  
    --simple-timeline-primary-color: var(--lumo-primary-text-color, blue);
    --simple-timeline-secondary-color: var(--lumo-secondary-text-color, gray);
    --simple-timeline-warning-color: var(--lumo-error-text-color, yellow);
    --simple-timeline-error-color: var(--lumo-error-text-color, red);

    position:relative;
    box-sizing: border-box;
    padding: 1rem;
    width: 600px;
    aspect-ratio: 1.6;
    display: block;
    overflow: hidden;
    color: var(--simple-timeline-color, black);
    background-color: var(--simple-timeline-background-color, white);
            
      }

    [part='caption'] {
      position: absolute;
        left: 0.5rem;
        top: 0.5rem;
        padding: 0;
        margin: 0;
        font-weight: normal;
    }
  
  [part='timeline'] {
    position: relative;
    box-sizing: border-box;
    height: var(--simple-timeline-width, 0.2rem);
    top: 50%;
    margin: calc(var(--simple-timeline-width, 0.2rem) * -0.5);
    padding: 0;
    border-radius: calc(var(--simple-timeline-width, 0.2rem) * 0.5);
    background-color: var(--simple-timeline-color, black);
    animation-name: slidein;
    animation-delay: 0s;
    animation-duration: 1s;
  }

  [part='break'] {
    position: absolute;
    top: 0;
    height: var(--simple-timeline-width, 0.2rem);
    width: calc(var(--simple-timeline-width, 0.2rem) *2);
    background-color: var(--simple-timeline-background-color, black);
  }

  [part='timeline-items'] {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    border: none;
    font-size: var(--simple-timeline-item-font-size)
  }

    `;

  override render() {
    return html`
          <h1 part="caption">${this.caption}</h1>
          <div part="timeline">
            ${this.breaks.split(',').map((br: string, idx: number) => {
      return html`<div part="break" style="left: ${br.indexOf('=') > 0 ? parseInt(br.split('=')[0]) : parseInt(br)}%;" id="break-${idx}">
                ${br.indexOf('=') > 0 ? parseInt(br.split('=')[1]) : ''}
                </div>`
    })
      }
          </div>
          <div part="timeline-items" @simple-timeline-item-click=${this.handleItemClick}>
            ${this._getItems().map((_item: HTMLElement, idx: number) => html`<slot name="item-${idx}"></slot>`)}
          </div>
        `;
  }

  _getItems(): HTMLElement[] {
    const elements = this.querySelectorAll("simple-timeline-item");
    const slots: HTMLElement[] = [];
    for (let i = 0; i < elements.length; i++) {
      elements[i].setAttribute("slot", "item-" + i);
      elements[i].setAttribute("index", "" + i);
      slots.push(elements[i] as HTMLElement);
    }
    return slots;
  }

  handleItemClick(e: CustomEvent): void {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("simple-timeline-click", { detail: e.detail }));
  }


  static get is() {
    return 'simple-timeline';
  }
}