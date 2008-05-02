/*********************************

	Color Palette Creator
	v1.6.1
	last revision:
		v1.6.1: 02.10.2006
		v1.6: 07.31.2004
	steve@slayeroffice.com

	based on Andy Clarke's article here:
	http://www.stuffandnonsense.co.uk/archives/creating_colour_palettes.html

	PLEASE leave this notice intact!

	Should you modify/improve this source
	please let me know about it so I can
	update the version hosted at slayeroffice.	

*********************************/

window.onload = init;
var d=document;
var baseColor = new Array(167,70,97);
var swatch=new Array();
var colorValues = new Array();
var outputType="hex";
var baseHistory = new Array();

var lightRGB = new Array(255,255,255);
var darkRGB= new Array(0,0,0);

var storedBase = "";

function init() {
	if(!d.getElementById)return;
	testCookies();
	lObj = d.getElementById("lightLayer");
	dObj=d.getElementById("darkLayer");
	for(i=0;i<10;i++) {
		swatch[i]=i<5?lObj.appendChild(d.createElement("div")):dObj.appendChild(d.createElement("div"));
		swatch[i].className = "swatch";
	}
	pObj=d.getElementById("mContainer").appendChild(d.createElement("div"));
	pObj.id="previewContainer";
	createSwatches();
}

function testCookies() {
	document.cookie = "testCookie=1;path=/";
	if(document.cookie.indexOf("testCookie=1")==-1)return alert("The Save functionality of this application requires cookies to be enabled. You have them disabled, so its not going to work.\n\n\nJust so you know.");
}

function isInHistory(val) {
	for(i=0;i<baseHistory.length;i++) if(baseHistory[i]==val)return true;
	return false;
}

function createSwatches() {
	nHex=d.getElementById("newBaseColor").value;
	if(!isInHistory(nHex)) {
		baseHistory[baseHistory.length] = nHex;
		appendHistory(nHex);
	}
	if(!isHex(nHex))return alert("Please enter a valid six character hex value.");
	baseColor = longHexToDec(nHex);
	opArray=new Array(1.0,.75,.50,.25,.10,.85,.75,.50,.25,.10);
	for(i=0;i<10;i++) {
		nMask = i<5?lightRGB:darkRGB;
		nColor=setColorHue(baseColor,opArray[i],nMask);
		nHex = toHex(nColor[0])+toHex(nColor[1])+toHex(nColor[2]);
		colorValues[i]=new Array();
		colorValues[i][0] = nHex;
		colorValues[i][1] = nColor;
		swatch[i].style.backgroundColor = "#"+nHex;
		swatch[i].title = "Click to set as new base color.";
		swatch[i].xid=i;
		swatch[i].onclick=function(){ toneToBase(this.xid); }
		d.getElementById("hex"+i).innerHTML = nHex;
	}
	if(d.getElementById("perma")) {
		d.getElementById("perma").setAttribute("href","http://slayeroffice.com/tools/color_palette/?hex=" + d.getElementById("newBaseColor").value);
		d.getElementById("perma").setAttribute("title","#" + d.getElementById("newBaseColor").value);
	}
	showVals(outputType);
}

function clearBaseHistory() {
	baseHistory=new Array();
	d.getElementById("bHistory").innerHTML = "";
}

function appendHistory(val) {
	o=d.getElementById("bHistory").appendChild(d.createElement("option"));
	o.value=val;
	o.style.backgroundColor="#"+val;
	o.appendChild(d.createTextNode(val));
}

function toneToBase(swatchIndex) {
	d.getElementById("newBaseColor").value = colorValues[swatchIndex][0];
	createSwatches();
}

function isHex(hex) {
	// temp fix for safari
	if(navigator.userAgent.indexOf("Safari")>-1)return true;
	if(hex.length!=6)return false;
	exp = new RegExp(/[a-f0-9]/gi);
	h=hex.match(exp,hex);
	if(h.length==6) {
		return true;
	} else {
		return false;
	}
}

function setColorHue(originColor,opacityPercent,maskRGB) {
	returnColor=new Array();
	for(w=0;w<originColor.length;w++) returnColor[w] = Math.round(originColor[w]*opacityPercent) + Math.round(maskRGB[w]*(1.0-opacityPercent));
	return returnColor;
}

function longHexToDec(longHex) {
	r=toDec(longHex.substring(0,2));
	g=toDec(longHex.substring(2,4));
	b=toDec(longHex.substring(4,6));
	return new Array(r,g,b);
}

function toHex(dec) {
	hex=dec.toString(16);
	if(hex.length==1)hex="0"+hex;
	if(hex==100)hex="FF";
	return hex.toUpperCase();
}

function toDec(hex) {
	return parseInt(hex,16);
}

function randomBaseColor() {
	r=toHex(Math.floor(Math.random() * 255));
	g=toHex(Math.floor(Math.random() * 255));
	b=toHex(Math.floor(Math.random() * 255));

	d.getElementById("newBaseColor").value = r+g+b;
	createSwatches();
}

function showVals(val) {
	outputType=val;
	txtArea = d.getElementById("txt");
	txtArea.value="";
	if(val=="hex") {
		index=0;
	} else {
		index=1;
	}
	for(i=0;i<colorValues.length;i++) {
		if(window.opera)d.getElementById("c"+i).innerHTML="&nbsp;";
		d.getElementById("c"+i).style.backgroundColor = "#"+colorValues[i][0];
		d.getElementById("v"+i).innerHTML= colorValues[i][index];
	}

}

function changeBlend(which) {
	color = which?d.getElementById("newDarkBlend").value:d.getElementById("newLightBlend").value;
	if(!isHex(color))return alert("Please enter a valid six character hex value.");

	if(which) {
		darkRGB = longHexToDec(color);
	} else {
		lightRGB = longHexToDec(color);
	}
	createSwatches();
}

function saveBase() {
	c=document.cookie;
	bColor = d.getElementById("newBaseColor").value;
	if(c.indexOf("color_history")==-1) {
		document.cookie = "color_history="+bColor+",;domain="+location.host+";path=/tools/color_palette/;expires=Thu, 01 Jul 2010 23:45:56 GMT";
	} else {
		c=c.split(";");
		for(i=0;i<c.length;i++) {
			if(c[i].indexOf("color_history")>-1) { 
				nCookie = c[i];
				break;
			}
		}
		nCookie = nCookie.replace(/color_history=/,"");
		nCookie+=bColor;
		document.cookie =	"color_history="+nCookie+",;domain="+location.host+";path=/tools/color_palette/;expires=Thu, 01 Jul 2010 23:45:56 GMT";
	}
	return alert("Color value " + bColor + " has been saved.");
}

function viewSaved() {
	c=document.cookie;
	if(c.indexOf("color_history")==-1) return alert("You currently have no saved base colors. Click the \"save base\" button to do so.");
	if(d.all)d.getElementById("bHistory").style.visibility="hidden";
	c=c.split(";");
	for(i=0;i<c.length;i++) {
		if(c[i].indexOf("color_history")>-1) {
			nCookie = c[i];
			break;
		}
	}

	nCookie = nCookie.replace(/color_history=/,"");
	savedColors = nCookie.split(",");

	mHTML = "<div id=\"scrollContainer\"><table cellpadding=\"0\" cellspacing=\"2\">"
	rowCount = 0;
	for(i=0;i<savedColors.length;i++) {
		if(savedColors[i]) {
			if(rowCount==0)mHTML+="<tr>";
			mHTML+="<td><div onclick=\"doHighlights(this);storedBase='"+savedColors[i]+"'\" class=\"previewColor\" title=\""+savedColors[i]+"\" style=\"background-color:#"+savedColors[i]+"\"></div></td>";
			rowCount++;
			if(rowCount>=5) {
				rowCount=0;
				mHTML+="</tr>";
			}
		}
	}
	mHTML+="</table></div>";
	mHTML+="<div class=\"ctrl\">Select a color swatch above and then select an action from the buttons below.<br /><input type=\"button\" class=\"btn\" value=\"set as base\" onclick=\"newBaseFromStored();\" title=\"Set this color as the base color.\"><input title=\"Delete this color from your saved base colors.\" type=\"button\" class=\"btn\" value=\"delete\" onclick=\"removeFromStored();\">";
	mHTML+="<input type=\"button\" class=\"btn\" value=\"delete all\" onclick=\"clearSaves();\" />";
	mHTML+="<br /><input type=\"button\" class=\"btn\" title=\"Output saved palettes to a PNG.\" value=\"Create PNG\" onclick=\"createPNG();\"><input type=\"button\" class=\"btn\" title=\"Close this window and return to the application.\" value=\"cancel\" onclick=\"hideSavedWindow();\" />";
	mHTML+="</div>";
	d.getElementById("previewContainer").innerHTML = mHTML;
	d.getElementById("previewContainer").style.display = "block";
}

function clearSaves() {
	if(confirm("This will delete all of your saved base colors.\n\nContinue?")) {
		document.cookie =	"color_history=;domain="+location.host+";path=/tools/color_palette/;expires=Tue, 01 Jul 2003 23:45:56 GMT";
		hideSavedWindow();
	}
}

function hideSavedWindow() {
	if(d.all)d.getElementById("bHistory").style.visibility="visible";
	d.getElementById("previewContainer").style.display="none";
}

function newBaseFromStored() {
	if(storedBase=="")return;
	if(d.all)d.getElementById("bHistory").style.visibility="visible";
	d.getElementById("newBaseColor").value = storedBase;
	storedBase="";
	d.getElementById("previewContainer").style.display="none";
	createSwatches();
}

function doHighlights(obj) {
	previewObj = document.getElementById("scrollContainer");
	for(i=0;i<previewObj.getElementsByTagName("div").length;i++) {
		previewObj.getElementsByTagName("div")[i].style.height="50px";
		previewObj.getElementsByTagName("div")[i].style.width="50px";
		previewObj.getElementsByTagName("div")[i].style.margin="0 0 0 0";
	}
	obj.style.width="25px";
	obj.style.height="25px";
	obj.style.margin="12px 12px 12px 12px";
}

function createPNG() {
	c=document.cookie;
	if(c.indexOf("color_history")==-1) return alert("You currently have no saved base colors. Click the \"save base\" button to do so.");
	c=c.split(";");
	for(i=0;i<c.length;i++) {
		if(c[i].indexOf("color_history")>-1) {
			nCookie = c[i];
			break;
		}
	}
	nCookie = nCookie.replace(/color_history=/,"");
	nCookie = nCookie.split(",");

	frmObj = d.body.appendChild(d.createElement("form"));
	frmObj.method="POST";
	frmObj.action = "createPNG.php";
	frmObj.target = "_blank";

	for(i=0;i<nCookie.length;i++) {
		if(nCookie[i]) {
			/*
			// why cant IE support the type attribute with a value of hidden?
			// both obj.type and setAttribute throw exceptions!
			inputObj = frmObj.appendChild(d.createElement("input"));
			inputObj.setAttribute("type","hidden");
			inputObj.name = "colors"+i;
			inputObj.value = longHexToDec(nCookie[i]);
			*/
			frmObj.innerHTML+= "<input type=\"hidden\" name=\"colors"+i+"\" value=\""+ longHexToDec(nCookie[i]) + "\" />";
			
		}
	}
	frmObj.submit();
}

function removeFromStored() {
	c=document.cookie;
	c=c.split(";");
	for(i=0;i<c.length;i++) {
		if(c[i].indexOf("color_history")>-1) {
			nCookie = c[i];
			break;
		}
	}

	nCookie = nCookie.replace(/color_history=/,"");
	nCookie = nCookie.split(",");
	newSaves = "";
	for(i=0;i<nCookie.length;i++) {
		if(nCookie[i]!=storedBase && nCookie[i]!="") newSaves+=nCookie[i]+",";
	}
	document.cookie =	"color_history="+newSaves+";domain="+location.host+";path=/tools/color_palette/;expires=Thu, 01 Jul 2010 23:45:56 GMT";
	storedBase="";
	viewSaved();
}