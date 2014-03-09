var log = require( 'ringo/logging' ).getLogger( module.id );

var createFoldersTests = function( service ) {
    describe( 'The createFoldersTests', function () {

        beforeEach( function () {
            service.connect();
        } );

        afterEach( function () {
            service.cleanTesting();
            service.close();
        } );

        it( 'should return an array of all the folders in the account', function () {
            var folders = service.getFolders();
            expect( folders).toBeArray();

            // One of the folders is INBOX
            // todo: Not really sure Inbox is a requirement. BTW, on Google it is spelled
            // INBOX, on Yahoo it is Inbox.
            expect( folders.some( function ( folder ) {
                return /INBOX/ig.test( folder.getName() );
            } ) ).toBeTruthy();
        } );

        it( 'should create 10 new folders', function () {
            var inbox = service.getInbox();

            // Create 10 new folders in the INBOX and store their names in `folderNames`
            var folderNames = [];
            for (var i = 0; i < 10; i++) {
                var folderName = '_mio_' + i;
                folderNames.push(folderName);
                var result = inbox.createFolderForMessages( folderName );
                expect( result && result.getName() ).toEqual( folderName );
            }

            // Retrieve all folders beginning with '_mio_', and remove each name from
            // `folderNames`.
            var folders = service.getFolders( '_mio_*' );
            folders.forEach(function(folder) {
                var index = folderNames.indexOf( folder.getName() );
                if (index >= 0) folderNames.splice( index, 1 );
            });

            // If all folders were created properly, then removed, `folderNames` should
            // be empty.
            expect( folderNames.length ).toEqual( 0 );
        } );

        it( 'should create ten levels of nested folders', function () {
            // Create 10 new folders in the INBOX and store their names in `folderNames`
            var folder = service.getInbox();
            var folderNames = [];
            for (var i = 0; i < 10; i++) {
                var folderName = '_mio_' + i;
                folderNames.push(folderName);
                folder = folder.createFolderForMessages( folderName );
                expect( folder.getName() ).toEqual( folderName );
            }

            // Retrieve all folders beginning with '_mio_', and remove each name from
            // `folderNames`.
            var folders = service.getFolders( '_mio_*' );
            folders.forEach(function(folder) {
                var index = folderNames.indexOf( folder.getName() );
                if (index >= 0) folderNames.splice( index, 1 );
            });

            // If all folders were created properly, then removed, `folderNames` should
            // be empty.
            expect( folderNames.length ).toEqual( 0 );

            // A recursive delete should eliminate all folders we created
            var topFolder = service.getFolders('_mio_0');
            expect( topFolder ).toBeArray();
            expect( topFolder.length ).toEqual( 1 );

            topFolder[0].remove();

            folders = service.getFolders( '_mio_*' );
            expect( folders ).toBeArray();
            expect( folders.length ).toEqual( 0 );
        } );

    } );
};

function readWriteTests( service ) {
    describe( 'The readWriteTests', function () {

        var folder;

        beforeEach( function () {
            service.connect();
            folder = service.getInbox().createFolderForMessages( '_mio_0' );
        } );

        afterEach( function () {
            service.cleanTesting();
            service.close();
        } );


        it( 'should allow me to write an email to the server', function () {
            var email = generateEmail( service.session );

            // Alright, our email is constructed, lets append it to the server.
            var result = folder.write( email );

            // Our returned successCount should be 1, and our errors should be empty
            expect( result.successCount ).toBe( 1 );
            expect( result.errors ).toEqual( [] );

            // Verify the email was written by reading it back
            var count = folder.getMessageCount();
            expect( count ).toEqual( 1 );

            var messages = folder.getMessages();
            expect( messages ).toBeArray();
            expect( messages.length ).toEqual( 1 );

            // Alright, we have our email, lets test it.
            var testEmail = messages[0];
            expect( testEmail.getSubject() ).toEqual( email.getSubject() );
        } );

        it( 'should allow me to write an email with an attachment to the server', function () {
            var email = generateEmail( service.session );

            var json = JSON.stringify( {
                'test' : email.getSubject()
            } );

            addAttachment( email, json );

            // Alright, our email is constructed, lets append it to the server.
            var result = folder.write( email );

            // Our returned successCount should be 1, and our errors should be empty
            expect( result.successCount ).toBe( 1 );
            expect( result.errors ).toEqual( [] );

            // Verify the email was written by reading it back
            var count = folder.getMessageCount();
            expect( count ).toEqual( 1 );

            var messages = folder.getMessages();
            expect( messages ).toBeArray();
            expect( messages.length ).toEqual( 1 );

            // Alright, we have our email, lets test it.
            var testEmail = messages[0];
            expect( testEmail.getSubject() ).toEqual( email.getSubject() );

            var emailTestMultiPart = testEmail.getContent();
            var attachmentTestPart, stringTestPart;

            for ( var i = 0; i < emailTestMultiPart.getCount(); i++ ) {
                if ( emailTestMultiPart.getBodyPart( i ).getDisposition() ) {
                    attachmentTestPart = emailTestMultiPart.getBodyPart( i );
                } else {
                    stringTestPart = emailTestMultiPart.getBodyPart( i );
                }
            }

            expect( attachmentTestPart ).toBeDefined();
            expect( attachmentTestPart.getDataHandler().getName() ).toBe( 'test.json' );
            expect( stringTestPart.getContent() ).toBe( 'Test email w/ attachment.' );
        } );

        function generateEmail(session) {
            // We need a mock email, and this email account isn't wiped, so let's generate a semi-random string and test for it.
            // Thanks, stack overflow: http://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
            var uid = ("0000" + (Math.random() * Math.pow( 36, 4 ) << 0).toString( 36 )).substr( -4 );

            // Now we need to start writing a new email.
            // The message constructor takes a session as an argument.
            var email = new javax.mail.internet.MimeMessage( session );

            // Now lets fill out some dummy data in the message.
            email.setSender( new javax.mail.internet.InternetAddress( 'Fred+Flintstone' ) );
            email.setFrom( new javax.mail.internet.InternetAddress( 'fred@bedrock.com' ) );
            email.setRecipient( javax.mail.Message.RecipientType.TO,
                new javax.mail.internet.InternetAddress( 'wilma@bedrock.com' ) );
            email.setRecipient( javax.mail.Message.RecipientType.CC,
                new javax.mail.internet.InternetAddress( 'barney@bedrock.com' ) );

            // This is the main thing we'll test for, since its the one that will be unique-ish.
            email.setSubject( uid );

            var sentDate = new java.util.Date();

            // This one is also going to be tested, since it **will** be unique.
            email.setSentDate( sentDate );

            // Completeness.
            email.setText( 'This is a test email. Hello!' );

            return email;
        }

        function addAttachment(email, data) {
            var bodyPart = new javax.mail.internet.MimeBodyPart();

            bodyPart.setText( 'Test email w/ attachment.' );

            var multipart = new javax.mail.internet.MimeMultipart();
            multipart.addBodyPart( bodyPart );

            var attachment = new javax.mail.internet.MimeBodyPart();

            //Found an easier way to do the attachment. using it
            var ds = new javax.mail.util.ByteArrayDataSource( data, 'application/json' );
            attachment.setDataHandler( new javax.activation.DataHandler( ds ) );
            attachment.setFileName( 'test.json' );
            multipart.addBodyPart( attachment );

            email.setContent( multipart );
        }
    } );
}


