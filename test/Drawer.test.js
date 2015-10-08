/*global describe, it, before, after*/

import expect from 'expect.js';
import Drawer from './../src/js/Drawer';
import { isExpanded } from './helpers';

describe('Drawer', () => {

	it('should initialise', () => {
		expect(new Drawer(document.body)).to.not.be(undefined);
	});

	it('should throw when no arguments are provided', () => {
		expect(() => new Drawer()).to.throwException(function (e) {
			expect(e).to.be.a(TypeError);
			expect(e.message).to.match(/missing required argument/);
		});
	});

	it('should accept a string argument', () => {
		new Drawer('body');
	});

	describe('Drawer.init()', () =>{
		before(() => {
			const element1 = document.createElement('div');
			element1.setAttribute('data-o-component', 'o-drawer');
			document.body.appendChild(element1);

			const element2 = document.createElement('div');
			element2.setAttribute('data-o-component', 'o-drawer');
			document.body.appendChild(element2);
		});

		it('should init all drawer elements', () => {
			const drawers = Drawer.init();
			expect(drawers.length).to.be(2);
		});

		it('should work when element is a selector', () => {
			const drawers = Drawer.init('body');
			expect(drawers.length).to.be(2);
		});
	});

	describe('Drawer.destroy()', () => {

		let bodyDelegate;

		before(() => {
			bodyDelegate = Drawer.bodyDelegate;
		});

		after(() => {
			Drawer.bodyDelegate = bodyDelegate;
		});

		it('should destroy', () => {
			let destroyed = false;
			Drawer.bodyDelegate = {
				destroy: () => { destroyed = true; }
			};

			Drawer.destroy();

			expect(destroyed).to.be(true);
		});

	});


	describe('open()', function(done) {
		it('should show the element', () => {
			const element = document.createElement('div');
			document.body.appendChild(element);

			const drawer = new Drawer(element);

			expect(isExpanded(element)).to.be(false);

			drawer.open();
			setTimeout(() =>{
				expect(isExpanded(element)).to.be(true);
				done();
			}, 100);

		});

		it('should emit oDrawer.open', function (done) {
			const element = document.createElement('div');
			document.body.appendChild(element);

			const drawer = new Drawer(element);

			element.addEventListener('oDrawer.open', function (e) {
				expect(e.target).to.be(element);
				done();
			});

			drawer.open();
		});
	});

	describe('close()', () => {
		it('should hide the element', () => {
			const element = document.createElement('div');
			document.body.appendChild(element);

			const drawer = new Drawer(element);
			drawer.open();
			drawer.close();

			expect(isExpanded(element)).to.be(false);
		});

		it('should emit oDrawer.close', function (done) {
			const element = document.createElement('div');
			document.body.appendChild(element);

			const drawer = new Drawer(element);

			element.addEventListener('oDrawer.close', function (e) {
				expect(e.target).to.be(element);
				done();
			});

			drawer.close();
		});
	});

	describe('toggle()', function(done) {
		it('should toggle the element open and close', () => {
			const element = document.createElement('div');
			document.body.appendChild(element);

			const drawer = new Drawer(element);
			drawer.toggle();
			setTimeout(() =>{
				expect(isExpanded(element)).to.be(true);
				drawer.toggle();
				expect(isExpanded(element)).to.be(false);
				done();
			}, 100);

		});
	});
});
