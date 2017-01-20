/* jshint node: true */
'use strict';

const electron			= require('electron');
const path				= require('path');
const app				= electron.app;
const BrowserWindow		= electron.BrowserWindow;
const dirname			= __dirname || path.resolve(path.dirname());
const emberAppLocation	= `file://${dirname}/dist/index.html`;

let mainWindow = null;

function onWindowAllClosed() 
{
	if (process.platform !== 'darwin') 
	{
		app.quit();
	}
}

function onReady() 
{
	mainWindow = new BrowserWindow({ width: 800, height: 600, frame: false });

	delete mainWindow.module;

	// If you want to open up dev tools programmatically, call
	mainWindow.openDevTools();

	// By default, we'll open the Ember App by directly going to the
	// file system.
	//
	// Please ensure that you have set the locationType option in the
	// config/environment.js file to 'hash'. For more information,
	// please consult the ember-electron readme.
	mainWindow.loadURL(emberAppLocation);

	function loadFail()
	{
		// If a loading operation goes wrong, we'll send Electron back to
		// Ember App entry point
		mainWindow.loadURL(emberAppLocation);
	}

	// Handle an unhandled error in the main thread
	//
	// Note that 'uncaughtException' is a crude mechanism for exception handling intended to
	// be used only as a last resort. The event should not be used as an equivalent to
	// "On Error Resume Next". Unhandled exceptions inherently mean that an application is in
	// an undefined state. Attempting to resume application code without properly recovering
	// from the exception can cause additional unforeseen and unpredictable issues.
	//
	// Attempting to resume normally after an uncaught exception can be similar to pulling out
	// of the power cord when upgrading a computer -- nine out of ten times nothing happens -
	// but the 10th time, the system becomes corrupted.
	//
	// The correct use of 'uncaughtException' is to perform synchronous cleanup of allocated
	// resources (e.g. file descriptors, handles, etc) before shutting down the process. It is
	// not safe to resume normal operation after 'uncaughtException'.
	function exceptionHandler(err)
	{
		console.log('An exception in the main thread was not handled.');
		console.log('This is a serious issue that needs to be handled and/or debugged.');
		console.log(`Exception: ${err}`);
	}

	function crash()
	{
		console.log('Your Ember app (or other code) in the main window has crashed.');
		console.log('This is a serious issue that needs to be handled and/or debugged.');
	}

	function unresponsive()
	{
		console.log('Your Ember app (or other code) has made the window unresponsive.');
	}

	function responsive()
	{
		console.log('The main window has become responsive again.');
	}

	function close()
	{
		mainWindow = null;
	}

	mainWindow.webContents.on('did-fail-load', loadFail);
	mainWindow.webContents.on('crashed', crash);
	mainWindow.on('unresponsive', unresponsive);
	mainWindow.on('responsive', responsive);
	mainWindow.on('closed', close);
	process.on('uncaughtException', exceptionHandler);
}

app.on('window-all-closed', onWindowAllClosed);
app.on('ready', onReady);
