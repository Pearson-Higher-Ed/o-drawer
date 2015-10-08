import DomDelegate from 'dom-delegate';
import { dispatchEvent } from './utils';

export default class Drawer {

	constructor(el) {
		if (!el) {
			throw new TypeError('missing required argument: element');
		}
		if (typeof el === 'string') {
			el = document.querySelector(el);
		}

		const triggerSelector =
			'[data-toggle="o-drawer"][href="#' + el.id + '"],' +
			'[data-toggle="o-drawer"][data-target="#' + el.id + '"]';

		this.target = el;
		this.trigger = document.querySelectorAll(triggerSelector);
		Drawer.cache.set(el, this);

		this.target.classList.add('o-drawer');

		const hasAlignmentClass = this.target.classList.contains('o-drawer-left') ||
			this.target.classList.contains('o-drawer-right');

		if (!hasAlignmentClass) {
			this.target.classList.add('o-drawer-left');
		}

		this.target.setAttribute('aria-expanded', false);

		if (!Drawer.delegate) {
			const delegate = new DomDelegate(document.body);

			delegate.on('click', '[data-toggle="o-drawer"], [data-close="o-drawer"], [data-open="o-drawer"]', (e) => {
				e.preventDefault();

				const trigger = getTrigger(e.target);
				const target = getTargetFromTrigger(trigger);

				for (let i=0, l = target.length; i<l; i++) {
					const t = target[i];
					let drawer = Drawer.cache.get(t);

					if (!drawer && t.getAttribute('data-o-component') === 'o-collapse') {
						drawer = new Drawer(t);
					}

					if (drawer) {
						const action = openCloseToggle(trigger);
						drawer[action]();
					}
				}
			});

			Drawer.delegate = delegate;
		}
	}

	/**
	 * Opens the Drawer
	 * @return {Drawer} self, for chainability
	 */
	open() {
		this.target.style.display = 'block';
		const t = this.target;
		setTimeout(function () {
			t.classList.add('o-drawer-open');
			t.setAttribute('aria-expanded', true);
		}, 50);

		dispatchEvent(this.target, 'oDrawer.open');

		return this;
	}

	/**
	 * Closes the Drawer
	 * @return {Drawer} self, for chainability
	 */
	close() {
		this.target.classList.remove('o-drawer-open');
		this.target.setAttribute('aria-expanded', true);
		dispatchEvent(this.target, 'oDrawer.close');

		if (this.target.classList.contains('o-drawer-animated')) {
			const t = this.target;
			setTimeout(function(){
				t.style.display = 'none';
			}, 400);
		} else {
			this.target.style.display = 'none';
		}

		return this;
	}

	/**
	 * Toggles the Drawer based on its current state
	 * @return {Drawer} self, for chainability
	 */
	toggle() {
		const visible = this.target.classList.contains('o-drawer-open');

		if (visible) {
			this.close();
		} else {
			this.open();
		}

		return this;
	}

}

Drawer.cache = new WeakMap();

/**
 * Initializes all drawer elements on the page or within
 * the element passed in.
 * @param	{HTMLElement|string} element DOM element or selector.
 * @return {DropdownMenu[]} List of Drawer instances that
 * have been initialized.
 */
Drawer.init = (element) => {
	const drawerEls = selectAll(element);
	const drawers = [];

	for (let i = 0, l = drawerEls.length; i < l; i++){
		drawers.push(new Drawer(drawerEls[i]));
	}

	return drawers;
};

/**
 * Destroys all Drawer Components on the page
 * @return {undefined} undefined
 */
Drawer.destroy = () => {
	if (Drawer.bodyDelegate) {
		Drawer.bodyDelegate.destroy();
	}
};

function selectAll(element) {
	if (!element) {
		element = document.body;
	}
	else if (!(element instanceof HTMLElement)) {
		element = document.querySelectorAll(element)[0];
	}

	return element.querySelectorAll('[data-o-component="o-drawer"]');
}

function openCloseToggle(el) {
	if (el) {
		if (el.getAttribute('data-toggle') === 'o-drawer') {
			return 'toggle';
		}
		else if (el.getAttribute('data-close') === 'o-drawer') {
			return 'close';
		}
		else if (el.getAttribute('data-open') === 'o-drawer') {
			return 'open';
		}
	}

	return false;
}

function getTrigger(element) {
	while (element && element.getAttribute('data-toggle') !== 'o-drawer' &&
					element.getAttribute('data-close') !== 'o-drawer' &&
					element.getAttribute('data-open') !== 'o-drawer') {
		element = element.parentElement;
	}

	return element;
}

function getTargetFromTrigger(element) {
	const target = element.getAttribute('data-target') || element.getAttribute('href');
	return document.querySelectorAll(target);
}
