# UI5 Baseproject
This is a base folder skeleton to quickly start with local UI5
development. It comes with some features like:
* A ui5.yaml config with "serve-static" and "liveReload" middleware
* A complete basic folder structure
* A BaseController with a lot of handy functions
* A Backend-Service-Module with handy ajax functions
* A predefined OData-Model and JSON-Model
* Some predefined i18n texts
* An Error-Handler-Module to intercept all OData-Errors
* A Validator-Module for checking forms
* Grunt configuration for deploying your app to a SAP Gateway Server
* Eslint configuration
* JsDoc configuration with a nice template
* A lot more..

### Prerequisites

* NodeJs (latest lts)
* Grunt (latest)
* @ui5/cli (latest)

### Installation

1. Download and Install [NodeJs](https://nodejs.org/en/download/)
2. Install Grunt globally with `npm i -g grunt`
3. Install the UI5 command line interface globally with `npm i -g
   @ui5/cli`
4. Install all devDependencies with `npm i`
4. Download a [SAPUI5 runtime](https://tools.hana.ondemand.com/#sapui5)
   (scroll down on that side) and extract it somewhere

### Post-Installation Steps

#### UI5.yaml
In your UI5.yaml you have to specify the app id like so:
[](gifs/ui5yaml-id.gif)



