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

    mod.animation( '.tabletLayout', function () {

        return {
            addClass : function ( ele, clsName, done ) {
                if ( clsName === 'ng-hide' ) {
                    $( ele ).data( 'height', $( ele ).height() );
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

})( angular );

