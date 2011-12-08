/*
 * File:        secret.js
 * CVS:         $Id$
 * Description: Locate characters on a page from a string and display in a 'funky' manner
 * Author:      Allan Jardine
 * Created:     21-2-2009
 * Modified:    $Date$ by $Author$
 * Language:    JavaScript
 * 
 * Copyright 2009 Allan Jardine. All rights reserved.
 */

/*
 * Issue - Firefox 3.0 has slight alignement issues. 3.1b2 and 3.2a1 have also be tested and
 *         have the same issues. Bug 480030 has been filed on bugzilla.mozilla.org
 * Issue - Totally not compatiable with IE...
 */

/*
 * Variable: Secret
 * Purpose:	 Container object for Secret controller
 * Scope:	   Global
 */
var Secret;

(function() {
Secret = {
	/*
	 * Variable: iCharsPerLine
	 * Purpose:  Number of allowed characters on each display line
	 * Scope:    Secret
	 */
	iCharsPerLine: 10,
	
	/*
	 * Variable: iLineHeight
	 * Purpose:  Distance between each display line
	 * Scope:    Secret
	 */
	iLineHeight: 70,
	
	/*
	 * Variable: iCharSpacing
	 * Purpose:  Spacing between each display character (could make this dynamic)
	 * Scope:    Secret
	 */
	iCharSpacing: 50,
	
	/*
	 * Variable: iCharDelay
	 * Purpose:  Delay time between each character being displayed
	 * Scope:    Secret
	 */
	iCharDelay: 200,
	
	/*
	 * Variable: iExitDelay
	 * Purpose:  Delay time between character exits
	 * Scope:    Secret
	 */
	iExitDelay: 100,
	
	/*
	 * Variable: bAutoOut
	 * Purpose:  Should it automatically remove the characters in the display
	 * Scope:    Secret
	 */
	bAutoOut: true,
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Initialisation
	 */
	
	/*
	 * Function: fnMessage
	 * Purpose:  Initialisater and logic processing for Secret
	 * Returns:  -
	 * Inputs:   string:sSecret - string of interest
	 */
	fnMessage: function ( sSecret )
	{
		if ( !document.defaultView )
		{
			Secret.fnDisplayError( 'You need a browser with document.defaultView capabilities in order '+
				'to use Secret. Firefox, Safari, Opera, Chrome etc...');
			return;
		}
		
		if ( !document.body.getBoundingClientRect )
		{
			Secret.fnDisplayError( 'You need a browser with Element.getBoundingClientRect capabilities '+
				'in order to use Secret. Firefox, Opera, Webkit (after 10th Feb 09)');
			return;
		}
		
		var iTest = 0;
		var aCharInfo = this.fnCreate( sSecret );
		
		for ( var i=0 ; i<aCharInfo.length ; i++ )
		{
			for ( var j=0 ; j<aCharInfo[i].length ; j++ )
			{
				if ( aCharInfo[i][j].cChar != " " )
				{
					iTest = this.fnObtainCharacter( aCharInfo[i][j] );
					if ( iTest == -1 )
					{
						break;
					}
				}
				if ( iTest == -1 )
				{
					break;
				}
			}
		}
		
		if ( iTest != -1 )
		{
			Secret.fnPositionChars( aCharInfo, 0, 0 );
		}
		else
		{
			Secret.fnDisplayError( 'Could not find the characters on the page to display "'+ sSecret +'"');
		}
	},
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Display methods
	 */
	
	/*
	 * Function: fnDisplayError
	 * Purpose:  Display an error message on the screen from Secret
	 * Returns:  -
	 * Inputs:   string:sDisplay - error string to display
	 */
	fnDisplayError: function ( sDisplay )
	{
		var oPos = this.fnGetScrollingPosition();
		var oViewPort = this.fnViewPortSize();
		
		var nError = document.createElement( 'div' );
		nError.style.position = 'absolute';
		nError.style.top = '50%';
		nError.style.left = '50%';
		nError.style.width = '500px';
		nError.style.height = '40px';
		nError.style.marginTop = '-20px';
		nError.style.marginLeft = '-250px';
		nError.style.background = '#FFE3E3';
		nError.style.border = '1px solid #FF9292';
		nError.style.padding = "20px";
		nError.style.textAlign = "center";
		nError.innerHTML = sDisplay;
		
	  YAHOO.util.Dom.setStyle(nError, 'opacity', 0);
		document.body.appendChild( nError );
	 
		var yuiOpacityIn = new YAHOO.util.Anim( nError, { opacity: { to: 1 } },
			3, YAHOO.util.Easing.easeBoth ); 
	 
		var yuiOpacityOut = new YAHOO.util.Anim( nError, { opacity: { to: 0 } },
			3, YAHOO.util.Easing.easeBoth ); 
		
		yuiOpacityIn.onComplete.subscribe(function() {
			yuiOpacityOut.animate(); 
		});
		
		yuiOpacityOut.onComplete.subscribe(function() {
			nError.parentNode.removeChild( nError ); 
		});
		
		yuiOpacityIn.animate();
	},
	
	
	/*
	 * Function: fnPositionChar
	 * Purpose:  Animation the letters into the position that they need to be for reading...
	 * Returns:  -
	 * Inputs:   array:aCharInfo - character information
	 */
	fnPositionChars: function ( aCharInfo, iLine, iChar )
	{
		this.fnPositionChar( aCharInfo[iLine][iChar] );
		
		if ( typeof aCharInfo[iLine][iChar+1] != 'undefined' )
		{
			if ( this.iCharDelay == 0 )
			{
				this.fnPositionChars( aCharInfo, iLine, iChar+1 );
			}
			else
			{
				setTimeout( function() { Secret.fnPositionChars( aCharInfo, iLine, iChar+1 ) }, this.iCharDelay );
			}
		}
		else if ( typeof aCharInfo[iLine+1] != 'undefined' )
		{
			if ( this.iCharDelay == 0 )
			{
				this.fnPositionChars( aCharInfo, iLine+1, 0 );
			}
			else
			{
				setTimeout( function() { Secret.fnPositionChars( aCharInfo, iLine+1, 0 ) }, this.iCharDelay );
			}
		}
		else
		{
			if ( this.bAutoOut )
			{
				setTimeout( function() {
					Secret.fnExit( aCharInfo, 0, 0 );
				}, 5000 );
			}
		}
	},
	
	
	/*
	 * Function: fnPositionChar
	 * Purpose:  Animation the letters into the position that they need to be for reading...
	 * Returns:  -
	 * Inputs:   object:oChars - character information
	 */
	fnPositionChar: function ( oChar )
	{
		if ( oChar.nDisplay )
		{
			var oPos = this.fnGetScrollingPosition();
			YAHOO.util.Dom.setStyle(oChar.nDisplay, 'opacity', 0);
			
			var nBackground = document.createElement( 'div' );
			nBackground.style.position = 'absolute';
			nBackground.style.top = '-20px';
			nBackground.style.left = '-46px';
			nBackground.style.height = '60px';
			nBackground.style.width = '100px';
			nBackground.style.background = 'url(http://www.sprymedia.co.uk/secret/fade.png)';
			
			oChar.nDisplay.innerHTML = '<div style="position:relative;">'+oChar.nDisplay.innerHTML+'</div>';
			oChar.nDisplay.insertBefore( nBackground, oChar.nDisplay.childNodes[0] );
			oChar.nDisplay.style.display = 'block';
			
			oChar.yuiOpacity = new YAHOO.util.Anim(
				oChar.nDisplay,
				{ 
			    opacity: { to: 1 }
				},
				1,
				YAHOO.util.Easing.easeBoth
			); 
			
			oChar.yuiMotion = new YAHOO.util.Motion(
				oChar.nDisplay,
				{
					points: { 
						to: [oChar.iLeft+oPos.iLeft, oChar.iTop+oPos.iTop], 
						control: this.fnRandomCoords( oChar ) },
					fontSize: {
						to: 20, unit: 'px'
					}
				},
				4,
				YAHOO.util.Easing.easeBothStrong
			);
			
			oChar.yuiOpacity.onComplete.subscribe(function() {
				oChar.yuiMotion.animate(); 
			});
			oChar.yuiOpacity.animate();
		}
	},
	
	
	/*
	 * Function: fnExit
	 * Purpose:  Remove all characters, with a lovely little animation...
	 * Returns:  -
	 * Inputs:   array:aCharInfo - character information
	 */
	fnExit: function ( aCharInfo, iLine, iChar )
	{
		this.fnKillChar( aCharInfo[iLine][iChar] );
		
		if ( typeof aCharInfo[iLine][iChar+1] != 'undefined' )
		{
			if ( this.iExitDelay == 0 )
			{
				this.fnExit( aCharInfo, iLine, iChar+1 );
			}
			else
			{
				setTimeout( function() { Secret.fnExit( aCharInfo, iLine, iChar+1 ) }, this.iExitDelay );
			}
		}
		else if ( typeof aCharInfo[iLine+1] != 'undefined' )
		{
			if ( this.iExitDelay == 0 )
			{
				this.fnExit( aCharInfo, iLine+1, 0 );
			}
			else
			{
				setTimeout( function() { Secret.fnExit( aCharInfo, iLine+1, 0 ) }, this.iExitDelay );
			}
		}
	},
	
	
	/*
	 * Function: fnKillChar
	 * Purpose:  Animate a character off the sceen and then remove the node
	 * Returns:  -
	 * Inputs:   object:oChars - character information
	 */
	fnKillChar: function ( oChar )
	{
		if ( oChar.nDisplay )
		{
			var yuiOpacity = new YAHOO.util.Anim(
				oChar.nDisplay,
				{ 
			    opacity: { to: 0 },
			    top: { by: 50 }
				},
				1,
				YAHOO.util.Easing.easeBoth
			);
			
			yuiOpacity.onComplete.subscribe(function() {
				oChar.nDisplay.parentNode.removeChild( oChar.nDisplay );
			});
			yuiOpacity.animate();
		}
	},
	
	
	/*
	 * Function: fnRandomCoords
	 * Purpose:  Create an array of random coords for YUI motion, with bias towards the final point
	 * Returns:  array array:aRet - random coords
	 * Inputs:   object:oChar - character information
	 */
	fnRandomCoords: function ( oChar )
	{
		var x;
		var y;
		var w;
		var h;
		var aRet = [];
		var oViewPort = this.fnViewPortSize();
		var oPos = this.fnGetScrollingPosition();
		
		aRet[0] = [ this.fnRandom(oViewPort.iWidth)+oPos.iLeft, this.fnRandom(oViewPort.iHeight)+oPos.iTop ];
		
		x = (2*oChar.iLeft) / 3;
		y = (2*oChar.iTop) / 3;
		w = (2*oViewPort.iWidth) / 3;
		h = (2*oViewPort.iHeight) / 3;
		aRet[1] = [ this.fnRandom(x, x+w)+oPos.iLeft, this.fnRandom(y, y+h)+oPos.iTop ];
		
		x = oChar.iLeft / 3;
		y = oChar.iTop / 3;
		w = oViewPort.iWidth / 3;
		h = oViewPort.iHeight / 3;
		aRet[2] = [ this.fnRandom(x, x+w)+oPos.iLeft, this.fnRandom(y, y+h)+oPos.iTop ];
		
		return aRet;
	},
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Character information positioning methods
	 */
	
	/*
	 * Function: fnSecretCreate
	 * Purpose:  Create the string information needed for character location and positioning
	 * Returns:  array object: - information about each character that is required for display
	 * Inputs:   string:sSecret - the string to get information about
	 */
	fnCreate: function ( sSecret )
	{
		var aWords = sSecret.split(" ");
		var aaoChars = [[]];
		var iLine = 0;
		var iOldLine = -1;
		var iWord = 0;
		var i, j;
		
		for ( i=0 ; i<aWords.length ; i++ )
		{
			if ( aaoChars[iLine].length + aWords[i].length > this.iCharsPerLine )
			{
				iLine++;
				aaoChars[iLine] = [];
			}
			
			/* Add a space between characters on the same line */
			if ( iOldLine == iLine )
			{
				aaoChars[iLine].push( {
					"cChar": " ",
					"iWord": -1,
					"iLine": iLine,
					"iTop": 0,
					"iLeft": 0,
					"nDisplay": null
				} );
			}
			
			var aChar = aWords[i].split("");
			for ( j=0 ; j<aChar.length ; j++ )
			{
				aaoChars[iLine].push( {
					"cChar": aChar[j],
					"iWord": iWord,
					"iLine": iLine,
					"iTop": 0,
					"iLeft": 0,
					"nDisplay": null
				} );
			}
			
			iWord++;
			iOldLine = iLine;
		}
		
		this.fnPositionY( aaoChars );
		this.fnPositionX( aaoChars );
		return aaoChars;
	},
	
	
	/*
	 * Function: fnPositionY
	 * Purpose:  Calculate the 'top' position for each line in the display
	 * Returns:  -
	 * Outputs:  array array object:aaoInfo - Information array about each character
	 */
	fnPositionY: function ( aaoInfo )
	{
		var iLines = aaoInfo.length;
		var oViewport = this.fnViewPortSize();
		var iCenter = oViewport.iHeight / 2;
		var iTopLine = iCenter - ( (iLines/2) * this.iLineHeight ) + (this.iLineHeight/2);
		
		for ( var i=0 ; i<aaoInfo.length ; i++ )
		{
			for ( var j=0 ; j<aaoInfo[i].length ; j++ )
			{
				aaoInfo[i][j].iTop = iTopLine + (this.iLineHeight * i);
			}
		}
	},
	
	
	/*
	 * Function: fnPositionX
	 * Purpose:  Calculate the 'left' position for each line in the display
	 * Returns:  -
	 * Outputs:  array array object:aaoInfo - Information array about each character
	 */
	fnPositionX: function ( aaoInfo )
	{
		var iLines = aaoInfo.length;
		var oViewport = this.fnViewPortSize();
		var iCenter = oViewport.iWidth / 2;
		
		for ( var i=0 ; i<iLines ; i++ )
		{
			var iLen = aaoInfo[i].length;
			var iLeftMost = iCenter - ( (iLen/2) * this.iCharSpacing ) + (this.iCharSpacing/2);
			
			for ( var j=0 ; j<aaoInfo[i].length ; j++ )
			{
				aaoInfo[i][j].iLeft = iLeftMost + (this.iCharSpacing * j );
			}
		}
	},
	
	
	/*
	 * Function: fnViewPortSize
	 * Purpose:  Get information about the viewport dimensions
	 * Returns:  object: iWidth - width of viewport
	 *                   iHeight - height of viewport
	 * Inputs:   -
	 */
	fnViewPortSize: function ()
	{
		/* Totally not IE compatible... - not bothered */
		var iBodyHeight = document.body.offsetHeight;
		var iBodyWidth = document.body.offsetWidth;
		
		var iViewportHeight = document.documentElement.clientHeight;
		var iViewportWidth = document.documentElement.clientWidth;
		
		return { "iWidth": iBodyWidth, "iHeight": iViewportHeight };
	},
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Character location and duplication methods
	 */
	
	/*
	 * Function: fnObtainCharacter
	 * Purpose:  Take a character, find it in the visible DOM and duplicate it
	 * Returns:  node: - the new single character node
	 * Inputs:   char:cSecret - the character in question
	 */
	fnObtainCharacter: function ( oChar, bAllWindow )
	{
		if ( typeof bAllWindow == 'undefined' )
		{
			bAllWindow = false;
		}
		
		var cSecret = oChar.cChar;
		
		/* Figure out which nodes are visible in the viewport */
		var nVisNodes = this.fnGetVisTextNodes( document.body, bAllWindow );
		
		/* Get the information about each of the found nodes */
		var aVisText = [];
		for ( var i=0 ; i<nVisNodes.length ; i++ )
		{
			var aInner = this.fnGetDisplayInfo( nVisNodes[i] );
			if ( aInner.length !== 0 )
			{
				aVisText = aVisText.concat( aInner );
			}
		}
		
		/* Count the occrances of the target character so we can randomly select one */
		var iInstances = 0;
		for ( i=0 ; i<aVisText.length ; i++ )
		{
			if ( typeof aVisText[i].oChars[cSecret] != 'undefined' )
			{
				iInstances += aVisText[i].oChars[cSecret];
			}
		}
		
		/* Pick a random position */
		var iRandomIndex = this.fnRandom( iInstances );
		
		/* Find out where the target character is in the DOM */
		var oCharLoc = this.fnLocateChar( aVisText, cSecret, iRandomIndex );
		
		/*
		 * If we couldn't find the character, then we either try again in the whole document, or
		 * report an error
		 */
		if ( oCharLoc == null )
		{
			if ( bAllWindow )
			{
				this.fnLog( 'Could not find character '+cSecret+' in whole document' );
				return -1;
			}
			else
			{
				this.fnLog( 'Could not find character '+cSecret+' in visible document' );
				return this.fnObtainCharacter( oChar, true );
			}
		}
		
		/* Inject a span around the target so we can get it's position */
		var sReconstructed = this.fnInsertTextSpan( oCharLoc.oNode.sText, oCharLoc, cSecret );
		
		/* Duplicate the target */
		var nText = this.fnInjectDom( oCharLoc.oNode.nNode, sReconstructed );
		
		oChar.nDisplay = this.fnDuplicateCharNode( nText );
		return 0;
	},
	
	/*
	 * Function: fnDuplicateCharNode
	 * Purpose:  Take a node and clone it. Place the cloned node on top of the original, but
	 *   as a child of 'body'
	 * Returns:  node:nDuplicate - the clone
	 * Inputs:   node:nTarget - the node to clone
	 */
	fnDuplicateCharNode: function ( nTarget )
	{
		if ( nTarget )
		{
			var nDuplicate = nTarget.cloneNode( true );
			var oPos = this.fnGetScrollingPosition();
			var oBox = nTarget.getBoundingClientRect();
			
			nDuplicate.style.position = "absolute";
			nDuplicate.style.top = (oBox.top+oPos.iTop)+'px';
			nDuplicate.style.left = (oBox.left+oPos.iLeft)+'px';
			nDuplicate.style.color = "#f00";
			nDuplicate.style.display = "none";
			
			var oStyle = document.defaultView.getComputedStyle( nTarget, null );
			nDuplicate.style.fontSize = oStyle.fontSize;
			nDuplicate.style.fontWeight = oStyle.fontWeight;
			nDuplicate.style.fontFamily = oStyle.fontFamily;
			
			document.body.appendChild( nDuplicate );
			return nDuplicate;
		}
		return null;
	},
	
	
	/*
	 * Function: fnInjectDom
	 * Purpose:  Take a text node and replace it with an injection string
	 * Returns:  node:nTarget - the span that we are interested in with the single char
	 * Inputs:   node:nNode - the #text node to replace
	 *           string:sInject - the string to inject in the #text nodes place
	 */
	fnInjectDom: function ( nNode, sInject )
	{
		var nTarget;
		
		/* Have the browser do the hard work for us, and create a childNodes array which we want */
		var nSpan = document.createElement( 'span' );
		nSpan.innerHTML = sInject;
		
		/* Work backwards so we don't mess up the childNodes array by moving things around */
		for ( i=nSpan.childNodes.length-1 ; i>=0 ; i-- )
		{
			if ( nSpan.childNodes[i].nodeName == 'SPAN' )
			{
				nTarget = nSpan.childNodes[i];
			}
			nNode.parentNode.insertBefore( nSpan.childNodes[i], nNode.nextSibling );
		}
		nNode.parentNode.removeChild( nNode );
		return nTarget;
	},
	
	
	/*
	 * Function: fnInsertTextSpan
	 * Purpose:  Inject a span into a string in place of a certain character
	 * Returns:  string:sReconstructed - original string with injected span
	 * Inputs:   string:sText - text to inject into
	 *           object:oLoc - object with the index (iOccurrence) of the character we want to replace
	 *           char:cChar - the character to have the span wrapped around it
	 */
	fnInsertTextSpan: function ( sText, oLoc, cChar )
	{
		var sReconstructed = "";
		var sLocal = sText;
		aLocal = sLocal.split(cChar);
		for ( i=0 ; i<aLocal.length-1 ; i++ )
		{
			if ( i == oLoc.iOccurrence )
			{
				sReconstructed += aLocal[i] + '<span>'+cChar+'</span>';
			}
			else
			{
				sReconstructed += aLocal[i] + cChar;
			}
		}
		sReconstructed += aLocal[aLocal.length-1];
		return sReconstructed;
	},
	
	
	/*
	 * Function: fnGetDisplayText
	 * Purpose:  Get all of the text which is visible on the page under a particular node
	 * Returns:  string:sReturn - concatenated string
	 * Inputs:   node:nNode - node to find the visible text under
	 * Notes:    This is a recursive function
	 */
	fnGetDisplayText: function ( nNode )
	{
		var sReturn = "";
		
		for ( var i=0 ; i<nNode.childNodes.length ; i++ )
		{
			switch ( nNode.childNodes[i].nodeType )
			{
				case Node.TEXT_NODE:
					sReturn += nNode.childNodes[i].nodeValue+"    ";
					break;
				
				case Node.ELEMENT_NODE:
					/* Check that the node is visible */
					var oStyle = document.defaultView.getComputedStyle( nNode.childNodes[i], null );
					if ( oStyle.display != "none" && oStyle.visibility == "visible" )
					{
						sReturn += this.fnGetText( nNode.childNodes[i] );
					}
					break;
				
				default:
					break;
			}
		}
		
		return sReturn;
	},
	
	/*
	 * Function: fnGetDisplayInfo
	 * Purpose:  Get all of the text which is visible on the page under a particular node
	 * Returns:  string:sReturn - concatenated string
	 * Inputs:   node:nNode - node to find the visible text under
	 * Notes:    This is a recursive function
	 */
	fnGetDisplayInfo: function ( nNode )
	{
		var aReturn = [];
		
		if ( nNode.childNodes )
		{
			for ( var i=0 ; i<nNode.childNodes.length ; i++ )
			{
				switch ( nNode.childNodes[i].nodeType )
				{
					case Node.TEXT_NODE:
						aReturn.push( {
							"sText": nNode.childNodes[i].nodeValue,
							"nNode": nNode.childNodes[i],
							"oChars": this.fnCountChars( nNode.childNodes[i].nodeValue )
						} );
						break;
					
					case Node.ELEMENT_NODE:
						/* Check that the node is visible */
						var oStyle = document.defaultView.getComputedStyle( nNode.childNodes[i], null );
						if ( oStyle.display != "none" && oStyle.visibility == "visible" )
						{
							var innerReturn = this.fnGetDisplayInfo( nNode.childNodes[i] );
							if ( innerReturn.length > 0 )
							{
								aReturn = aReturn.concat( innerReturn );
							}
						}
						break;
					
					default:
						break;
				}
			}
		}
		
		return aReturn;
	},
	
	
	/*
	 * Function: fnLocateChar
	 * Purpose:  Find the character of the target index across multiple nodes
	 * Returns:  object: nNode - the node the target is in
	 *                   iOccurrence - the index nstance in this string of the target
	 * Inputs:   node:nVisNodes - the nodes through which to search
	 *           char:cChar - the target character
	 *           int:iIndex - the instance number in the nodes of the target that we want
	 */
	fnLocateChar: function ( nVisNodes, cChar, iIndex )
	{
		var iInstance = 0;
		for ( var i=0 ; i<nVisNodes.length ; i++ )
		{
			var iChars = typeof nVisNodes[i].oChars[cChar] != 'undefined' ?
				nVisNodes[i].oChars[cChar] : 0;
			
			/* Check if our required index is inside this string */
			if ( iIndex < iInstance + iChars )
			{
				return {
					"oNode": nVisNodes[i],
					"iOccurrence": iIndex - iInstance
				};
			}
			else
			{
				iInstance += iChars;
			}
		}
		return null;
	},
	
	
	/*
	 * Function: fnRandom
	 * Purpose:  Get a random int
	 * Returns:  int: - random int
	 * Inputs:   int:iScale - scale the result by this amount (i.e. random 0 to iScale)
	 *           int:iMax - optional - assume that the first one is the min, this is the max
	 *             and we want a random between the two
	 */
	fnRandom: function ( iScale, iMax )
	{
		if ( typeof iMax == 'undefined' )
		{
			return parseInt( Math.random()*iScale, 10 );
		}
		else
		{
			return parseInt( (Math.random()*( iMax-iScale ))+iScale, 10 );
		}
	},
	
	
	/*
	 * Function: fnCountChars
	 * Purpose:  Count the instances of each character in a string
	 * Returns:  object:aReturn - distribution information on characters
	 * Inputs:   string:sSource - string to get the distribution of
	 */
	fnCountChars: function ( sSource )
	{
		var aSource = sSource.split('');
		var aReturn = {};
		
		for ( var i=0 ; i<aSource.length ; i++ )
		{
			if ( typeof aReturn[ aSource[i] ] == 'undefined' )
			{
				aReturn[ aSource[i] ] = 1;
			}
			else
			{
				aReturn[ aSource[i] ]++;
			}
		}
		
		return aReturn;
	},
	
	
	/*
	 * Function: fnGetVisTextNodes
	 * Purpose:  Get a list of all visible text node in the viewport
	 * Returns:  array:aReturn - list of nodes
	 * Inputs:   node:nNode - base node from which to start searching
	 */
	fnGetVisTextNodes: function ( nNode, bAllWindow )
	{
		var aReturn = [];
		var aScrolling = this.fnGetScrollingPosition();
		var iScrollTop = aScrolling[1];
		var iScrollLeft = aScrolling[0];
		var iViewportHeight = document.documentElement.clientHeight;
		var iViewportWidth = document.documentElement.clientWidth;
		
		if ( bAllWindow == 'undefined' )
		{
			bAllWindow = false;
		}
		
		for ( var i=0 ; i<nNode.childNodes.length ; i++ )
		{
			if ( nNode.childNodes[i].nodeType == Node.ELEMENT_NODE )
			{
				/* 
				 * Check if the node is visible - if so - assume everythign under it is - note that
				 * getBoundingClientRect returns values relative to the current viewport (taking
				 * into account scrolling etc - so we don't need to worry about it
				 */
				var oBox = nNode.childNodes[i].getBoundingClientRect();
				if ( (oBox.top > 0 && oBox.bottom < iViewportHeight) || bAllWindow )
				{
					aReturn.push( nNode.childNodes[i] );
				}
				else
				{
					/* Check that the node is visible */
					var oStyle = document.defaultView.getComputedStyle( nNode.childNodes[i], null );
					if ( oStyle.display != "none" && oStyle.visibility == "visible" )
					{
						var innerReturn = this.fnGetVisTextNodes( nNode.childNodes[i], bAllWindow );
						if ( innerReturn.length > 0 )
						{
							aReturn = aReturn.concat( innerReturn );
							//aReturn.push( innerReturn.slice() );
						}
					}
				}
			}
		}
		
		return aReturn;
	},
	
	
	/*
	 * Function: fnGetScrollingPosition
	 * Purpose:  Cross browser get for scrolling top
	 * Returns:  object: iTop
	 *                   iLeft
	 * Inputs:   -
	 */
	fnGetScrollingPosition: function ()
	{
		var oPos = {};
		if (typeof window.pageYOffset != 'undefined')
		{
			oPos.iTop = window.pageYOffset;
			oPos.iLeft = window.pageXOffset;
		}
		else if (typeof document.documentElement.scrollTop)
		{
			oPos.iTop = document.documentElement.scrollTop;
			oPos.iLeft = document.documentElement.scrollLeft;
		}
		return oPos;
	},
	
	
	/*
	 * Function: fnLog
	 * Purpose:  Log a message to console
	 * Returns:  -
	 * Inputs:   string:sMessage - message to post
	 */
	fnLog: function ( sMessage )
	{
		if ( typeof console != 'undefined' && typeof console.log != 'undefined' )
		{
			console.log( sMessage );
		}
	}
}
})();
