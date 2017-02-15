/* global describe, it, expect, fixture, beforeEach */

'use strict';

describe('localize behavior', function() {
	var component;

	beforeEach(function() {
		document.documentElement.removeAttribute('lang');
	});

	it('should have default locale', function() {
		component = fixture('default-fixture');

		expect(component.locale).to.equal('en-us');
		expect(component.localize('upload')).to.equal('Upload');
	});

	it('should use default locale if provided locale does not exist', function() {
		document.documentElement.setAttribute('lang', 'zz-ZZ');

		component = fixture('default-fixture');

		expect(component.locale).to.equal('zz-ZZ');
		expect(component.localize('upload')).to.equal('Upload');
	});

	describe('localize mappings', function() {
		it('should have translation for every english term', function() {
			component = fixture('default-fixture');
			var terms = Object.keys(component.resources['en']);
			var locales = Object.keys(component.resources);
			for (var i = 0; i < locales.length; i++) {
				var currentLocale = locales[i];
				for (var j = 0; j < terms.length; j++) {
					expect(component.resources[currentLocale].hasOwnProperty(terms[j]), 'missing term ' + terms[j] + ' on locale ' + currentLocale).to.be.true;
				}
			}
		});
	});

});
