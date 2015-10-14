import DomDelegate from 'dom-delegate';
import componentHandler from 'o-component-handler';
import { dispatchEvent } from './utils';

const CSS_CLASS = 'o-drawer';

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

		this.target.classList.add(CSS_CLASS);

		const hasAlignmentClass = this.target.classList.contains(`${CSS_CLASS}-left`) ||
			this.target.classList.contains(`${CSS_CLASS}-right`);

		if (!hasAlignmentClass) {
			this.target.classList.add(`${CSS_CLASS}-left`);
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
					const drawer = getOrCreateInstance(t);

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
			t.classList.add(`${CSS_CLASS}-open`);
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
		this.target.classList.remove(`${CSS_CLASS}-open`);
		this.target.setAttribute('aria-expanded', true);
		dispatchEvent(this.target, 'oDrawer.close');

		if (this.target.classList.contains(`${CSS_CLASS}-animated`)) {
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
		const visible = this.target.classList.contains(`${CSS_CLASS}-open`);

		if (visible) {
			this.close();
		} else {
			this.open();
		}

		return this;
	}

}


/**
 * Destroys all Drawer Components on the page
 * @return {undefined} undefined
 */
Drawer.destroy = () => {
	if (Drawer.bodyDelegate) {
		Drawer.bodyDelegate.destroy();
	}
};


/**
 * Register this component with the component handler.
 */
componentHandler.register({
	constructor: Drawer,
	classAsString: 'Drawer',
	cssClass: CSS_CLASS
});


/**
 * Private
 */

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

function getOrCreateInstance(element) {
	let instance = componentHandler.getInstance(element, CSS_CLASS);

	if (!instance && element.classList.contains(CSS_CLASS)) {
		componentHandler.upgradeElement(element, 'Drawer');
		instance = componentHandler.getInstance(element, CSS_CLASS);
	}

	return instance;
}
