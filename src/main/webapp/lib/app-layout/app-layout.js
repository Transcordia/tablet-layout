(function ( ng ) {
    var mod = ng.module( 'app-layout', ['ngAnimate'] );

    mod.controller( 'LayoutController', ['$log', '$scope',
        function ( $log, $scope ) {
            $scope.layout = {
                max : false,
                minimize : function () {
                    $scope.layout.max = false;
                },
                maximize : function () {
                    $scope.layout.max = true;
                }
            }
        }

    ] );

    mod.animation( '.sectionLayout', function () {
        function saveHeight( ele ) {
            if ( (ele).data( 'height' ) > 0 ) return;
            $( ele ).data( 'height', $( ele ).height() );
        }

        return {
            addClass : function ( ele, clsName, done ) {
                if ( clsName === 'ng-hide' ) {
                    saveHeight( ele );
                    $( ele )
                        .removeClass( 'ng-hide' )
                        .animate( {
                            height : 0
                        }, 250, function () {
                            $( this ).addClass( 'ng-hide' );
                            done();
                        } );
                } else {
                    done();
                }
            },
            removeClass : function ( ele, clsName, done ) {
                if ( clsName === 'ng-hide' ) {
                    $( ele )
                        .css( {height : 0} )
                        .removeClass( 'ng-hide' )
                        .animate( {
                            height : $( ele ).data( 'height' )
                        }, 250, done );
                } else {
                    done();
                }
            }
        }
    } );

    mod.animation( '.maxbody', ['$log', function ( $log ) {
        function resize( now, tween ) {
            $( 'main' ).css( {
                top : $( 'header' ).height(),
                bottom : $( 'footer' ).height()
            } )
        }

        return {
            addClass : function ( ele, clsName, done ) {
                $log.info( 'addClass', clsName );
                if ( clsName === 'maxbody' ) {
                    $( 'main' )
                        .animate( { opacity: 1 }, {
                            step : resize,
                            duration : 275,
                            complete : done } );
                } else {
                    done();
                }
            },
            removeClass : function ( ele, clsName, done ) {
                $log.info( 'removeClass', clsName );
                if ( clsName === 'maxbody' ) {
                    $( 'main' )
                        .animate( { opacity: 1 }, {
                            step : resize,
                            duration : 275,
                            complete : done } );
                } else {
                    done();
                }
            }
        }
    } ] );

})( angular );

