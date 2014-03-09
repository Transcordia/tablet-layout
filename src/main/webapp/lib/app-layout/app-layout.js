(function ( ng ) {
    var mod = ng.module( 'app-layout', ['ngAnimate'] );

    mod.controller('LayoutController', ['$log', '$scope',
        function($log, $scope) {
            $scope.layout = {
                max : true,
                minimize : function() {
                    $scope.layout.max = false;
                },
                maximize : function() {
                    $scope.layout.max = true;
                }
            }
        }
    ]);

})( angular );

