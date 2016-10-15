module.exports = function(grunt) {

// 1. Toutes les configurations vont ici:
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			build: {
				expand: true,
				src: 'lib/*.js',
				dest: 'dist'
			}
		},

		copy: {
			main: {
				files: [
					{	expand: true,
						src: ['themes/*'],
						dest: 'dist',
						filter: 'isFile'}
				],
			},
		}

	});

// 3. Nous disons à Grunt que nous voulons utiliser ce plug-in.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

// 4. Nous disons à Grunt quoi faire lorsque nous tapons "grunt" dans la console.
	grunt.registerTask('default', ['uglify', 'copy']);

};