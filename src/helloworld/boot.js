//es5 file to bootstrap our application
System.config({
	packages: {
		'helloworld': {
			defaultExtension: 'js'
		}
	}
});
System.import('helloworld/boot-app.js').catch(function (err) {
    console.error(err);
});