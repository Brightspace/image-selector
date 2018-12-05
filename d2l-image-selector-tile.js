import '@polymer/polymer/polymer-legacy.js';
import 'd2l-course-image/d2l-course-image.js';
import 'd2l-fetch/d2l-fetch.js';
import 'd2l-icons/d2l-icons.js';
import 'd2l-organization-hm-behavior/d2l-organization-hm-behavior.js';
import './d2l-course-tile-grid-styles.js';
import './d2l-image-selector-tile-styles.js';
import './localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

Polymer({
  _template: html`
		<style include="d2l-image-selector-tile-styles">
			.d2l-image-selector-tile-hidden {
				opacity: 0;
			}

			.shown {
				animation-name: shown;
				animation-duration: 0.5s;
				animation-fill-mode: forwards;
			}

			@keyframes shown {
				0% { opacity: 0 }
				100% { opacity: 1; }
			}
		</style>

		<div class$="[[_getTileClass(image)]]">
			<div class="click-overlay" on-click="_toggleOverlayOn" on-blur="_toggleOverlayOff" tabindex="-1">
			</div>
			<div class="d2l-image-tile-overlay">
				<button class="overlay-button" on-tap="_selectImage" on-focus="_toggleOverlayOn" on-blur="_toggleOverlayOff">
					<div class="overlay-button-inner">
						<d2l-icon class="camera-icon" icon="d2l-tier1:pic" aria-hidden="true"></d2l-icon>
						<span class="overlay-button-text">{{localize('useThisImage')}}</span>
					</div>
				</button>
			</div>
			<div class="d2l-image-tile-content">
				<d2l-course-image image="[[image]]" sizes="[[_imageSizes]]" type="narrow"></d2l-course-image>
			</div>
		</div>
`,

  is: 'd2l-image-selector-tile',

  properties: {
	  image: Object,
	  _imageSizes: {
		  type: Object,
		  value: { mobile: { size: 100 }, tablet: { size: 50 }, desktop: { size: 33 } }
	  },
	  organization: Object,
	  _setImageUrl: String,
	  _imageClass: String
  },

  behaviors: [
	  D2L.PolymerBehaviors.ImageSelector.LocalizeBehavior,
	  D2L.PolymerBehaviors.Hypermedia.OrganizationHMBehavior
  ],

  _getTileClass: function(image) {
	  return image ? 'd2l-image-tile' : 'd2l-image-tile no-image';
  },

  _toggleOverlayOn: function() {
	  this.toggleClass('mobile-selected', true, this.$$('.d2l-image-tile'));
  },

  _toggleOverlayOff: function() {
	  this.toggleClass('mobile-selected', false, this.$$('.d2l-image-tile'));
  },

  _getSetImageUrl: function() {
	  if (this.organization && this.image) {
		  var setImageAction = this.organization.getActionByName('set-catalog-image') || {},
			  setImagePath = setImageAction.href || '';

		  var url = this.image.getLinkByRel('self').href,
			  regex = /\/images\/[^/?]*/i,
			  match = url.match(regex);

		  if (setImagePath !== '' && match) {
			  return setImagePath + '?imagePath=' + match[0];
		  }
	  }

	  return '';
  },

  _fireCourseImageMessage: function(status) {
	  this.fire('set-course-image', {
		  organization: this.organization,
		  image: this.image,
		  status: status
	  });
  },

  _selectImage: function() {
	  this._setImageUrl = this._getSetImageUrl();

	  var setImagePromise = window.d2lfetch
		  .fetch(new Request(this._setImageUrl, {
			  method: 'POST',
			  headers: {
				  Accept: 'application/vnd.siren+json'
			  }
		  }))
		  .then(function(response) {
			  return response.ok ? Promise.resolve() : Promise.reject();
		  })
		  .then(this._fireCourseImageMessage.bind(this, 'success'))
		  .catch(this._fireCourseImageMessage.bind(this, 'failure'));

	  this._fireCourseImageMessage('set');
	  this.fire('image-selector-tile-image-selected');

	  return setImagePromise;
  },

  _updateImageSource: function() {
	  var courseImage = dom(this.root).querySelector('img');
	  this._imageClass = 'd2l-image-selector-tile-hidden';
	  dom(courseImage).setAttribute('srcset', this.getImageSrcset(this.image, 'narrow'));
	  dom(courseImage).setAttribute('sizes', '(max-width: 767px) 100vw, (max-width: 991px) and (min-width: 768px) 50vw, 33vw');
  },

  _showImage: function() {
	  this._imageClass = 'shown';
  }
});
