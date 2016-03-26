( function( window, define, requirejs, undefined ) {
    'use strict';

    define( [
        'jquery'
    ], function( $ ) {

        describe( 'Loader', function() {

            before( function() {
                requirejs.undef( 'utils/loader' );
                requirejs.undef( 'utils/module' );
                requirejs.undef( 'jquery' );
                requirejs.undef( 'test' );
                requirejs.undef( 'test-priority' );
            } );

            afterEach( function() {
                requirejs.undef( 'utils/loader' );
                requirejs.undef( 'utils/module' );
                requirejs.undef( 'jquery' );
                requirejs.undef( 'test' );
                requirejs.undef( 'test-priority' );
            } );

            it( 'should initialize with document as default scope', function( done ) {
                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {} );

                    expect( loader.elementScope ).to.be.deep.equal( document );
                    done();
                } );
            } );

            it( 'should initialize with an element scope', function( done ) {
                var fakeElement = document.createElement( 'div' );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: fakeElement
                    } );

                    expect( loader.elementScope ).to.be.equal( fakeElement );
                    done();
                } );
            } );

            it( 'should accept a jquery element as its scope', function( done ) {
                var fakeElement = $( '<div></div>' );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: fakeElement
                    } );

                    expect( loader.elementScope ).to.be.equal( fakeElement.get( 0 ) );
                    done();
                } );
            } );

            it( 'should init a module with the default class', function( done ) {
                var fakeElement = $( '<div>' +
                        '<div class="auto-init" data-module="test"></div>' +
                    '</div>' ),
                    fakeModule = {
                        ready: sinon.spy()
                    };

                define( 'test', [], function() { return fakeModule; } );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: fakeElement
                    } );

                    setTimeout( function() {
                        expect( fakeModule.ready.calledOnce ).to.be.equal( true );
                        done();
                    }, 100 );
                } );
            } );

            it( 'should init a module with a custom class', function( done ) {
                var fakeElement = $( '<div>' +
                        '<div class="fancy-init" data-module="test"></div>' +
                    '</div>' ),
                    fakeModule = {
                        ready: sinon.spy()
                    };

                define( 'test', fakeModule );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: fakeElement,
                        autoInitSelector: '.fancy-init'
                    } );

                    setTimeout( function() {
                        expect( fakeModule.ready.calledOnce ).to.be.equal( true );
                        done();
                    }, 100 );
                } );
            } );

            it( 'should initialize multiple modules', function( done ) {
                var fakeElement = $( '<div>' +
                        '<div class="auto-init" data-module="test"></div>' +
                        '<div class="auto-init" data-module="test"></div>' +
                    '</div>' ),
                    fakeModule = {
                        ready: sinon.spy()
                    };

                define( 'test', fakeModule );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: fakeElement
                    } );

                    setTimeout( function() {
                        expect( fakeModule.ready.calledTwice ).to.be.equal( true );
                        done();
                    }, 100 );
                } );
            } );

            it( 'should initialize priorized modules first', function( done ) {
                var fakeElement = $( '<div>' +
                        '<div class="auto-init" data-priority="false" data-module="test"></div>' +
                        '<div class="auto-init" data-priority="true" data-module="test-priority">' +
                        '</div>' +
                    '</div>' ),
                    fakeModule = {
                        ready: sinon.spy()
                    },
                    fakePriority = {
                        ready: sinon.spy()
                    };

                define( 'test', fakeModule );
                define( 'test-priority', fakePriority );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: fakeElement
                    } );

                    setTimeout( function() {
                        expect( fakePriority.ready.calledBefore( fakeModule.ready ) )
                            .to.be.equal( true );
                        done();
                    }, 100 );
                } );
            } );

            it( 'should init global modules', function( done ) {
                var fakeElement = $( '<div>' +
                        '<div class="auto-init" data-module="test"></div>' +
                    '</div>' ),
                    fakeModule = {
                        isGlobal: true,
                        ready: function() {}
                    },
                    fakeApp = {};

                define( 'test', fakeModule );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: fakeElement,
                        globalScope: fakeApp
                    } );

                    setTimeout( function() {
                        expect( fakeApp.test ).to.be.an( 'object' );
                        done();
                    }, 50 );
                } );
            } );

            it( 'should init modules on a custom element', function( done ) {
                var scopeElement = $( '<div></div>' ),
                    fakeElement = $( '<div>' +
                        '<div class="auto-init" data-module="test"></div>' +
                    '</div>' ),
                    fakeModule = {
                        ready: sinon.spy()
                    };

                define( 'test', fakeModule );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: scopeElement
                    } );

                    loader.initModules( fakeElement );

                    setTimeout( function() {
                        expect( fakeModule.ready.calledOnce ).to.be.equal( true );
                        done();
                    }, 100 );
                } );
            } );

            it( 'should resolve a promise when all modules are loaded', function( done ) {
                var fakeElement = $( '<div>' +
                        '<div class="auto-init" data-module="test"></div>' +
                        '<div class="auto-init" data-module="test"></div>' +
                    '</div>' ),
                    fakeModule = {
                        ready: sinon.spy()
                    };

                define( 'test', fakeModule );

                require( [ 'utils/loader' ], function( Loader ) {
                    var loader = new Loader( {
                        elementScope: fakeElement,
                        autoInit: false
                    } );

                    loader.initModules().then( function() {
                        expect( fakeModule.ready.calledTwice )
                            .to.be.equal( true );
                        done();
                    } );
                } );
            } );

        } );

    } );

} )( this, this.define, this.requirejs );
