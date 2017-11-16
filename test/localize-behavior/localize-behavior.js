describe('localize behavior', function() {
	var component;

	beforeEach(function() {
		document.documentElement.removeAttribute('lang');
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
