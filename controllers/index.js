var express = require( 'express' )
    , router = express.Router()
    , winston = require( 'winston' );

/**
 * Load all controllers
 */
// NOTE: no additional controllers needed

/**
 * Define routes that have not been handled by specific controllers
 */
router.get( '/', function( req, res ) {
    res.write( 'Welcome to Murlan' );
    res.send();
} );

// router.get( '/concat/:presentationId/:participantId/:start/:end', function( req, res ) {
    // var presentationId = req.params.presentationId,
        // participantId = req.params.participantId,
        // start = req.params.start,
        // end = req.params.end
    // concatenate( presentationId, participantId, start, end, function( err, result ) {
        // if( err ) {
            // winston.log( 'error', err );
            // res.send( 'Could not concatenate' );
            // return;
        // }
        // //res.send( result );
    // } );
// } );

module.exports = router;