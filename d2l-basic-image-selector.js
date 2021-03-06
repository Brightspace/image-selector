/**
`d2l-basic-image-selector`
Polymer-based web component for a D2L image selector

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-colors/d2l-colors.js';
import 'd2l-fetch/d2l-fetch.js';
import 'd2l-icons/d2l-icons.js';
import 'd2l-loading-spinner/d2l-loading-spinner.js';
import 'd2l-search-widget/d2l-search-widget.js';
import SirenParse from 'siren-parser';
import './d2l-image-tile-grid.js';
import './localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-basic-image-selector">
	<template strip-whitespace="">
		<style>
			#image-search{
				width: 50%;
			}

			.no-results-search-text {
				font-weight: bolder;
				word-wrap: break-word;
			}

			.no-results-text {
				font-size: 1.5rem;
				margin-bottom: 12px;
			}

			.top-section {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 45px;
			}

			div.upload {
				cursor: pointer;
			}

			.upload-text {
				margin-left: 5px;
			}

			.upload:focus .upload-text,
			.upload:hover .upload-text,
			.upload:focus .upload-icon,
			.upload:hover .upload-icon {
				text-decoration: underline;
				color: var(--d2l-color-celestine);
			}

			#lazyLoadSpinner {
				display: block;
				margin: auto;
				margin-bottom: 30px;
			}

			#lazyLoadSpinner.d2l-basic-image-selector-hidden {
				display: none;
			}
		</style>

		<div class="top-section">
			<d2l-search-widget id="image-search" search-action="[[_searchAction]]" placeholder-text="[[localize('search')]]" search-field-name="search">
			</d2l-search-widget>

			<template is="dom-if" if="[[_organizationChangeImageHref]]" restamp="true">
				<div role="button" tabindex="0" class="upload" on-tap="_handleUpload" on-keydown="_handleUpload">
					<d2l-icon class="upload-icon" icon="d2l-tier2:upload" aria-hidden="true"></d2l-icon>
					<span class="upload-text">[[localize('upload')]]</span>
				</div>
			</template>

		</div>

		<template is="dom-if" if="[[_showGrid]]">
			<d2l-image-tile-grid id="image-grid" organization="[[organization]]" images="[[_images]]"></d2l-image-tile-grid>
		</template>

		<template is="dom-if" if="[[!_showGrid]]">
			<div class="no-results-area">
				<div class="no-results-text">
					<span>[[_noResultsTextStart]]</span><span class="no-results-search-text">[[_noResultsTextMid]]</span><span>[[_noResultsTextEnd]]</span>
				</div>
				[[localize('images.pleaseModify')]]
			</div>
		</template>
		<d2l-loading-spinner id="lazyLoadSpinner" class$="[[_loadingSpinnerClass]]" size="100">
		</d2l-loading-spinner>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-basic-image-selector',
	ready: function() {
		this._images = this._defaultImages;
	},
	properties: {
		courseImageUploadCb: Function,
		imageCatalogLocation: String,
		organization: Object,
		_searchString: String,
		_images: Array,
		_searchAction: String,
		_noResultsTextStart: String,
		_noResultsTextMid: String,
		_noResultsTextEnd: String,
		_showGrid: Boolean,
		_organizationChangeImageHref: String,
		_nextSearchResultPage: String,
		_nextDefaultResultPage: String,
		_loadingSpinnerClass: {
			type: String,
			value: 'd2l-basic-image-selector-hidden'
		}
	},
	behaviors: [ D2L.PolymerBehaviors.ImageSelector.LocalizeBehavior ],
	listeners: {
		'd2l-simple-overlay-opening': 'initializeSearch',
		'd2l-simple-overlay-closed': 'clearSearch'
	},
	observers: [
		'_onOrganizationChanged(organization)'
	],
	attached: function() {
		this.listen(
			this.$$('d2l-search-widget'),
			'd2l-search-widget-results-changed',
			'_searchResultsChanged'
		);
	},
	detached: function() {
		this.unlisten(
			this.$$('d2l-search-widget'),
			'd2l-search-widget-results-changed',
			'_searchResultsChanged'
		);
	},
	_searchImages: [],
	_defaultImages: [],
	_searchResultsChanged: function(response) {
		if (response.detail.searchValue) {
			this._displaySearchResults(response.detail.searchValue, response.detail.searchResponse);
			this._setNextPage(response.detail.searchResponse, false);
		} else {
			// Throw out empty searches
			// TODO: d2l-search-widget property that sends events instead of making network calls
			this._displayDefaultResults();
		}

		this._updateImages();
	},
	_displaySearchResults: function(userSearchText, searchResults) {
		var delimiter = '$$$DELIMITER???',
			noResultsText = this.localize('images.noResults', 'search', delimiter),
			noResultsSplit = noResultsText.split(delimiter);

		this._searchImages = searchResults.entities || [];
		this._noResultsTextStart = noResultsSplit[0];
		this._noResultsTextMid = userSearchText;
		this._noResultsTextEnd = noResultsSplit[1];

		this._showGrid = (userSearchText || '') === '' || this._searchImages.length > 0;
	},
	_setNextPage: function(response, isDefault) {

		if (!response) {
			return;
		}

		var nextPage = response.getLinkByRel('next') || {},
			nextPageHref = nextPage.href || null;

		if (isDefault) {
			this._nextDefaultResultPage = nextPageHref;
		} else {
			this._nextSearchResultPage = nextPageHref;
		}

		this.fire('clear-image-scroll-threshold');
	},
	_displayDefaultResults: function() {
		this._searchImages = [];
		this._showGrid = true;
		this._nextSearchResultPage = null;
	},
	_onImagesRequestResponse: function(responseEntity, loadMore, isDefault) {
		this._loadingSpinnerClass = 'd2l-basic-image-selector-hidden';

		var newImages;

		if (loadMore) {
			newImages = (isDefault ? this._defaultImages : this._searchImages) || [];
			if (responseEntity && responseEntity.entities) {
				newImages = newImages.concat(responseEntity.entities);
			}
		} else {
			newImages = responseEntity.entities;
		}

		if (isDefault) {
			this._defaultImages = newImages;
		} else {
			this._searchImages = newImages;
		}
		this._setNextPage(responseEntity, isDefault);
		this._updateImages();
	},
	_onOrganizationChanged: function(organization) {
		if (!organization.getLinkByRel) {
			this.organization = SirenParse(organization);
		}
	},
	initializeSearch: function() {
		this._searchAction = JSON.stringify(this._getSearchAction());
		this._showGrid = true;
		this.$$('d2l-search-widget').clear();
		this._organizationChangeImageHref = this._getChangeCourseImageLink(this.organization);

		// TODO: Add 'department' to the organization HM entity and use that information here
		if (this.organization && (this.organization.properties || {}).name) {
			this._searchString = this._getSearchStringValue(this.organization.properties.name, true);
		} else {
			// This is better than 'default' because we get random defaults rather than starting at 0
			this._searchString = this._getSearchStringValue('THIS_WILL_RETURN_NOTHING', true);
		}

		if (this._searchString !== undefined && this._searchString !== null) {
			return this._fetchSirenEntity(this._searchString)
				.then(this._onDefaultImagesRequestResponse.bind(this));
		}
	},
	clearSearch: function() {
		this._searchString = '';
		this._images = [];
		this._searchImages = [];
		this._defaultImages = [];
		this._nextSearchResultPage = null;
		this._nextDefaultResultPage = null;
		this._showGrid = true;
	},
	_getSearchAction: function() {
		return {
			name: 'search-catalog-image',
			method: 'GET',
			href: this._searchPath,
			fields: [
				{ name: 'search', type: 'search', value: '' }
			]
		};
	},
	get _searchPath() {
		if (!this.imageCatalogLocation) {
			return null;
		}

		var endSlash = this.imageCatalogLocation.slice(-1) === '/' ? '' : '/';
		return this.imageCatalogLocation + endSlash + 'images';
	},
	_getSearchStringValue: function(search, appendMore) {
		var appendMoreQuery = appendMore ? '&appendMore=1' : '';
		return this._searchPath + '?search=' + search + appendMoreQuery;
	},
	_updateImages: function() {
		var searchImages = this._searchImages || [];
		this._images = (searchImages.length > 0) ? searchImages : this._defaultImages;
	},
	_getChangeCourseImageLink: function(organization) {
		var rel = /course-offering-info-page/;
		var editImagePage = organization && organization.getLinkByRel(rel);
		if (editImagePage) {
			return editImagePage.href;
		}
	},
	loadMore: function() {
		if (!this._showGrid) {
			this._loadingSpinnerClass = 'd2l-basic-image-selector-hidden';
			return;
		}

		if (this._nextSearchResultPage) {
			this._loadingSpinnerClass = '';
			this.$.lazyLoadSpinner.scrollIntoView();
			return this._fetchSirenEntity(this._nextSearchResultPage)
				.then(this._moreSearchImagesRequestResponse.bind(this));
		} else if (this._nextDefaultResultPage && (this._searchImages || []).length === 0) {
			this._loadingSpinnerClass = '';
			this.$.lazyLoadSpinner.scrollIntoView();
			return this._fetchSirenEntity(this._nextDefaultResultPage)
				.then(this._moreDefaultImagesRequestResponse.bind(this));
		} else {
			this._loadingSpinnerClass = 'd2l-basic-image-selector-hidden';
		}
	},
	_moreDefaultImagesRequestResponse: function(responseEntity) {
		this._onImagesRequestResponse(responseEntity, true, true);
	},
	_moreSearchImagesRequestResponse: function(responseEntity) {
		this._onImagesRequestResponse(responseEntity, true, false);
	},
	_onDefaultImagesRequestResponse: function(responseEntity) {
		this._onImagesRequestResponse(responseEntity, false, true);
	},
	_handleUpload: function(e) {
		if ((e.type === 'keydown' && e.keyCode === 13) || (e.type === 'tap')) {
			if (this.courseImageUploadCb) {
				this.courseImageUploadCb();
			} else {
				window.location.href = this._organizationChangeImageHref;
			}
		}
	},
	_fetchSirenEntity: function(url) {
		return window.d2lfetch
			.fetch(new Request(url, {
				headers: {
					Accept: 'application/vnd.siren+json'
				}
			}))
			.then(function(response) {
				if (response.ok) {
					return response.json();
				}
				Promise.reject(response.status + ' ' + response.statusText);
			})
			.then(SirenParse);
	}
});
