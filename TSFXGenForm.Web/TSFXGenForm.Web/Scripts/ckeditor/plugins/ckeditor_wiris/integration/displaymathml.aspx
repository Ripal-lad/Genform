<%@ Page Language="C#" AutoEventWireup="false" CodeFile="displaymathml.aspx.cs" Inherits="displaymathml" %>
var url = "<asp:Literal ID="Literal1" runat="server"></asp:Literal>";

function generateEntities(s) {
    var i,c,d;
	d = "";
	for (i=0;i<s.length;i++) {
		c = s.charCodeAt(i);
		if (c>=128) {
			d+="&#"+c+";";
		} else {
			d+=s.charAt(i);
		}
	}
	return d;
}

function isInAContentEditableElement(element) {
	if (element == null) {
		return false;
	}
			
	if (element.contentEditable && element.contentEditable !== 'inherit') {
		return true;
	}

	return isInAContentEditableElement(element.parentNode);
}

function fixVerticalAlign(img) {
	img.align = '';
	img.style.verticalAlign = (-img.height / 2) + 'px';
}

function fixVerticalAlignForAll() {
	var images = document.getElementsByTagName('img');
		
	for (var i = images.length - 1; i >= 0; --i) {
		if (images[i].className == 'Wirisformula' && !isInAContentEditableElement(images[i])) {
			images[i].align = '';
			images[i].style.verticalAlign = (-images[i].height / 2) + 'px';
		}
	}
}

function mathmlFunction() {

	var maths = document.getElementsByTagName('math');
	var as = new Array();
	var i;
	
	for (i = 0; i < maths.length; i++) {
	    as.push(maths[i]);
	}
	
	for (i = 0; i < as.length; i++) {
		var mathNode = as[i];
		var container = document.createElement('span');
		container.className = 'wrs_viewer';
		mathNode.parentNode.replaceChild(container, mathNode);
		container.appendChild(mathNode);
		
		var mathml = container.innerHTML;
		if (mathml.indexOf("<?XML")==0) {
			j=mathml.indexOf("/>");
			if (j>=0)
				mathml=mathml.substring(j+2);
		}
		var img = document.createElement('img');
		mathml = generateEntities(mathml);
		// Needed only for ie
		if (img.attachEvent!=null) {
			img.attachEvent( "onload", function() {fixVerticalAlign(img);});
		}
		img.src = url + '?mml='+encodeURIComponent(mathml);
		img.align = 'middle';
		img.className = 'Wirisformula';
		
		container.parentNode.replaceChild(img, container);
	}
	// setTimeout(fixVerticalAlignForAll,1);
}

if (window.attachEvent) {
	window.attachEvent('onload', mathmlFunction);
}

window.addEventListener('load',mathmlFunction,false);

