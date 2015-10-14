# o-drawer [![Build Status](https://travis-ci.org/Pearson-Higher-Ed/o-drawer.svg?branch=master)](https://travis-ci.org/Pearson-Higher-Ed/o-drawer) [![Coverage Status](https://coveralls.io/repos/Pearson-Higher-Ed/o-drawer/badge.svg?branch=master&service=github)](https://coveralls.io/github/Pearson-Higher-Ed/o-drawer?branch=master)

## Quick start

Add `class="o-drawer"` to the target element to enable drawer. You can use a link with `href` or a button with `data-target` as the trigger:

```html
<a href="#drawer-example" data-toggle="o-drawer">Link trigger</a>
<button data-toggle="o-drawer" data-target="#drawer-example">Button trigger</button>
<div id="drawer-example" class="o-drawer o-drawer-right o-drawer-animated">Quisque in tortor finibus, dictum sem vel, convallis felis. Nunc ac mi in urna euismod eleifend in vitae augue. Suspendisse blandit feugiat vulputate. Praesent sit amet fringilla eros. Mauris nunc nisl, laoreet sit amet molestie vitae, sodales et diam.</div>
```

## Enabling using JavaScript

```js
new Drawer(document.querySelector('#myDrawer'));
```

You can use the static `init` method to initialize all drawer elements within a specified element:

```js
Drawer.init(document.body);
```

This module will also listen for the `o.DOMContentLoaded` event; when fired, it will initialize all drawer elements on the page.

## API

### Constructor

`Drawer(element)`

Initializes a drawer element, where `element` is the target element and an instance of `HTMLElement`.

### Methods

`open()`

Expands the target element.

`close()`

Collapses the target element.

`toggle()`

Toggles the target element, depending on its current state.

### Events

| Event Name							 | Description																				 |
|--------------------------|-----------------------------------------------------|
| oDrawer.open						 | Fires immediately when the `open` method is called. |
| oDrawer.close						| Fires immediately when the `close` method is called. |

```js
document.querySelector('#myDrawer').addEventListener('oDrawer.open', function (e) {
	// Do something
});
```

## Accessibility

The module will automatically update `aria-expanded` depending on the state of the target element.

## License

This software is published by Pearson Education under the [MIT license](LICENSE).
