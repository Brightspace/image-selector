/* global describe, it, beforeEach, fixture, expect, sinon */

'use strict';

describe('<d2l-image-selector-tile>', function() {
	var widget,
		testPath = 'http://testPath',
		testImageHref = 'http://test.com/images/10',
		testBadImageHref = 'http://test.com/MUAHAHAHA/10';

	beforeEach(function() {
		widget = fixture('d2l-image-selector-tile-fixture');
		widget.image = window.D2L.Hypermedia.Siren.Parse({
			links: [{
				rel: ['self'],
				href: 'http://example.com'
			}],
			properties: {}
		});
	});

	it('loads element', function() {
		expect(widget).to.exist;
	});

	it('fires a image-selector-tile-image-selected message when clicked', function() {
		var messageSent = false;
		widget.addEventListener('image-selector-tile-image-selected', function() {
			messageSent = true;
		});

		widget.$$('button').click();

		expect(messageSent).to.equal(true);
	});

	describe('_getSetImageUrl', function() {
		it('returns an empty string if the image self href has the wrong format', function() {
			var self = {
				organization : {
					getActionByName: sinon.stub().returns({ href: testPath })
				},
				image : {
					getLinkByRel: sinon.stub().returns({ href: testBadImageHref })
				}
			};

			var result = widget._getSetImageUrl.call(self);
			expect(result).to.equal('');
		});

		it('returns an the correct image url', function() {
			var self = {
				organization : {
					getActionByName: sinon.stub().returns({ href: testPath })
				},
				image : {
					getLinkByRel: sinon.stub().returns({ href: testImageHref })
				}
			};

			var result = widget._getSetImageUrl.call(self);
			expect(result).to.equal(testPath + '?imagePath=/images/10');
		});
	});

	describe('_selectImage', function() {
		beforeEach(function() {
			widget._getSetImageUrl = sinon.stub().returns('http://example.com/foo');
			widget.telemetryEndpoint = 'http://example.com/bar';

			window.d2lfetch.fetch = sinon.stub()
				.returns(Promise.resolve({
					ok: true,
					json: function() { return Promise.resolve(); }
				}));
		});

		it('fires a set-course-image event with the "set" parameter', function() {
			widget._fireCourseImageMessage = sinon.stub();
			return widget._selectImage().then(function() {
				expect(widget._fireCourseImageMessage.calledWith('set')).to.equal(true);
			});
		});

		it('fires a "image-selector-tile-image-selected event"', function() {
			widget.fire = sinon.stub();
			return widget._selectImage().then(function() {
				expect(widget.fire.calledWith('image-selector-tile-image-selected')).to.equal(true);
			});
		});

		it('calls the set-image URL', function() {
			return widget._selectImage().then(function() {
				expect(window.d2lfetch.fetch.calledWith(
					sinon.match.has('url', widget._setImageUrl)
				)).to.equal(true);
			});
		});

		it('sends a telemetry event', function() {
			return widget._selectImage().then(function() {
				expect(window.d2lfetch.fetch.calledWith(
					sinon.match.has('url', widget.telemetryEndpoint)
				)).to.equal(true);
			});
		});

		it('fires a set-course-image event with the "success" parameter if the set succeeds', function() {
			widget._fireCourseImageMessage = sinon.stub();
			return widget._selectImage().then(function() {
				expect(widget._fireCourseImageMessage.calledWith('success')).to.equal(true);
			});
		});

		it('fires a set-course-image event with the "failure" parameter if the set fails', function() {
			widget._fireCourseImageMessage = sinon.stub();

			window.d2lfetch.fetch = sinon.stub()
				.withArgs(sinon.match.has('url', widget._setImageUrl))
				.returns(Promise.resolve({
					ok: false
				}));

			return widget._selectImage().catch(function() {
				expect(widget._fireCourseImageMessage.calledWith('failure')).to.equal(true);
			});
		});
	});

	describe('_fireCourseImageMessage', function() {
		it("fires a 'set-course-image' event with the image and passed in status", function() {
			var self = {
				fire: sinon.stub(),
				organization: { testData: 'testData' },
				image: 'Image'
			};
			widget._fireCourseImageMessage.call(self, 'status');

			expect(self.fire.firstCall.args[0]).to.equal('set-course-image');
			expect(self.fire.firstCall.args[1]).to.deep.equal({
				status: 'status',
				image: self.image,
				organization: self.organization
			});
		});
	});
});
