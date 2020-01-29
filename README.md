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
##### App ID 
In your UI5.yaml you have to specify the app id like so:
![](gifs/ui5yaml-id.gif)

##### Serve-Static Middleware (Optional)
If you want to use the **_serve-static-middleware_**, which allows you
to load the *sap-ui-core.js* locally from your machine, you have to
specify the path to where you extract the SAPUI5 runtime like so:
![](gifs/ui5yaml-servestatic.gif)

#### Adding a Namespace to your Project
When you are working with SAPUI5 you need to define a namespace for your
app. There are a lot of places where you have to specify this namespace
e.g. the index.html, the manifest.json or in all the modules and
controllers like the Component.js or the BaseController.js. Here is a
list where you have to edit the namespace, so that the project works
fine (search for the string _namespace_ to know where to exactly change
it):
* controller/App.controller.js
* controller/BaseController.js
* model/ModelsHelper.js
* services/BackendCommunicationService.js
* util/Errorhandler.js
* Component.js
* index.html
* local.html
* manifest.json
* manifest_local.json

Here are two examples of how to specify the namespace in your project.

##### index.html
![](gifs/namespace-index.gif)

##### BaseController.js
![](gifs/namespace-baseController.gif)

#### Specifying the OData-Service
If you already have an OData-Service, which you can consume in your app,
then you have to enter the path to the service in the _manifest.json_
and _manifest_local.json_(If your are behind a corporate proxy) like so:

##### manifest.json (without proxy)
![](gifs/odata-noproxy.gif)

##### manifest_local.json (with proxy)
![](gifs/odata-proxy.gif)





