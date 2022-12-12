/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {SimpleTimeline} from '../simple-timeline';

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('simple-timeline', () => {
  test('is defined', () => {
    const el = document.createElement('simple-timeline');
    assert.instanceOf(el, SimpleTimeline);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<simple-timeline></simple-timeline>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('renders with a set name', async () => {
    const el = await fixture(html`<simple-timeline name="Test"></simple-timeline>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, Test!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('handles a click', async () => {
    const el = (await fixture(html`<simple-timeline></simple-timeline>`)) as SimpleTimeline;
    const button = el.shadowRoot!.querySelector('button')!;
    button.click();
    await el.updateComplete;
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 1</button>
      <slot></slot>
    `
    );
  });

  test('styling applied', async () => {
    const el = (await fixture(html`<simple-timeline></simple-timeline>`)) as SimpleTimeline;
    await el.updateComplete;
    assert.equal(getComputedStyle(el).paddingTop, '16px');
  });
});
