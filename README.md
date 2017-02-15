# d2l-image-selector

A [Polymer](https://www.polymer-project.org/1.0/)-based web component D2L image selector.

For further information on this and other D2L UI components, see the docs at [ui.valence.d2l.com](http://ui.valence.d2l.com/).

## Installation

`d2l-image-selector` can be installed from Bower:
```shell
bower install git://github.com/Brightspace/image-selector.git#v0.0.1
```
## Usage
```html
<d2l-basic-image-selector
	image-catalog-location="https://course-image-catalog.api.brightspace.com"
	organization="{ ... }"
	user-id="169"
	tenant-id="ec63dd64-de40-489c-a63f-b1295d8a277f"
	telemetry-endpoint="https://telemetry-dev.cloud.desire2learn.com/api/events/c4d46116-d70c-41cc-99f0-607bc86424a7">
</d2l-basic-image-selector>
```
`image-catalog-location` is the URL of the course image catalog HM service
`organization` is the Siren representation of an organization in the LMS
`user-id` is the ID of the user in Brightspace who is currently using the image-selector
`tenant-id` is the tenant ID of the Brightspace instance
`telemetry-endpoint` is the URL of the telemetry service that events are being sent to

For more examples, see its use in the [My Courses](https://github.com/Brightspace/d2l-my-courses-ui/blob/master/d2l-my-courses.html#L134) widget.

## Running tests locally in Windows

Tests in this repo use web-component-tester (WCT). Currently WCT has an issue in Windows with tests taking about a minute to start.  A workaround is to set two environment variables for Launchpad (a library used by WCT).  These help bypass browser searching which is what causes the delay.  For example:
LAUNCHPAD_BROWSERS=CHROME
LAUNCHPAD_CHROME-'C:\Program Files (x86)\Google\Chrome\Application'

## Coding styles

See the [Best Practices & Style Guide](https://github.com/Brightspace/valence-ui-docs/wiki/Best-Practices-&-Style-Guide) for information on naming conventions, plus information about the [EditorConfig](http://editorconfig.org) rules used in this repo.
