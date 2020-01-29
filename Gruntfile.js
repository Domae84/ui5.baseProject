module.exports = function(grunt) {
    const sPwd = grunt.option('pwd');

    grunt.initConfig({
        nwabap_ui5uploader: {
            options: {
                conn: {
                    server: 'GW-Server-Host',
                    useStrictSSL:false
                },
                auth: {
                    user: "GW-User",
                    pwd: sPwd
                }
            },
            upload_build: {
                options: {
                    ui5: {
                        package: 'Package',
                        bspcontainer: 'BSP',
						bspcontainer_text: "BSP Description",
						transportno:"TA",
						calc_appindex:true
                    },
                    resources: {
                        cwd: 'dist',
                        src: '**/*.*'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-nwabap-ui5uploader');
    grunt.registerTask('default', ['nwabap_ui5uploader']);
    grunt.registerTask('deploy', ['nwabap_ui5uploader']);

};
