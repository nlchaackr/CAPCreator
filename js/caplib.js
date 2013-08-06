/*
	caplib.js -- Common Alerting Protocol 1.2 helper library
	version 1.1 - 31 July 2013
	
	Copyright (c) 2013, Carnegie Mellon University
	All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted 
	provided that the following conditions are met:
	
	* Redistributions of source code must retain the above copyright notice, this list of conditions
	and the following disclaimer.
	
	* Redistributions in binary form must reproduce the above copyright notice, this list of conditions 
	and the following disclaimer in the documentation and/or other materials provided with the distribution.
	
	* Neither the name of Carnegie Mellon University nor the names of its contributors may be used to endorse or 
	promote products derived from this software without specific prior written permission.
	
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR 
	IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND 
	FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS 
	BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
	BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR 
	BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT 
	LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
	SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

	Contributors:  Art Botterell <art.botterell@sv.cmu.edu>, <acb@incident.com>, <art@raydant.com>
	
	API (see trivial usage example at end of file):
		new Alert() - returns an uninitialized Alert object
		Alert.getJSON() - returns the Alert (including included Infos, Resources and Elements) as a JSON string
		Alert.getCAP() - returns the Alert at CAP 1.2 XML
		Alert.addInfo() - adds an Info object to the Alert.infos array and returns the new Info object
		Info.addCategory( string ) - adds a category value string to the Info.categories array (values are constrained in spec)
		Info.addResponseType( string ) - adds a responseType value string to the Info.responseTypes array (values are constrained in spec)
		Info.addEventCode( string, string ) - adds an eventCode valueName/value pair to the Info.eventCodes array (values may be constrained in 'valueName' namespace)
		Info.addParameter( string, string ) - adds a parameter valueName/value pair to the Info.parameters array (values may be constrained in 'valueName' namespace)
		Alert.addArea( string ) - adds an Area object to the Info.areas array, initializes the areaDesc field from argument and returns the new Area object
		Alert.addResoruce( string ) - adds a Resource object to the Info.resources array, initializes the resourceDesk field from argument and returns the new Resource object
		All other properties are populated by direct assignment.  All reads are performed by direct reference.

  	Version History:
  		1.01	14 June 2013	added getJSON methods to Info, Area and Resource
  		1.0		12 June 2013	initial working version
*/

//////////////////////////////////////////////////
// ALERT Object
var Alert = function() {
	this.identifier = "";	// REQUIRED
	this.sender = "";		// REQUIRED
	this.sent = "";			// REQUIRED	
	this.status = "";		// REQUIRED: values Actual, Exercise, System, Test, Draft
	this.msgType = "";		// REQUIRED: values Alert, Update, Cancel, Ack, Error
	this.source = "";
	this.scope = "";		// REQUIRED: values Public, Restricted, Private
	this.restriction;
	this.addresses;
	this.code;
	this.note = "";
	this.references;
	this.incidents;
	this.infos = [];
}
Alert.prototype.addInfo = function() {
	newInfo = new Info();
	this.infos.push( newInfo );
	return newInfo;
}
Alert.prototype.getJSON = function() {
	return JSON.stringify(this, undefined, 2);
}
Alert.prototype.getCAP = function() {
	var xml = '<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">\n';
	var indent = '  ';
	xml = xml + indent + "<identifier>" + this.identifier + "</identifier>\n";
	xml = xml + indent + "<sender>" + this.sender + "</sender>\n";
	xml = xml + indent + "<sent>" + this.sent + "</sent>\n";
	xml = xml + indent + "<status>" + this.status + "</status>\n";
	xml = xml + indent + "<msgType>" + this.msgType + "</msgType>\n";
	if (this.source && this.source != "") { xml = xml + indent + "<source>" + this.source + "</source>\n"; }
	xml = xml + indent + "<scope>" + this.scope + "</scope>\n";
	if (this.restriction && this.restriction != "") { xml = xml + indent + "<restriction>" + this.restriction + "</restriction>\n"; }
	if (this.address && this.addresses != "") { xml = xml + indent + "<addresses>" + this.addresses + "</addresses>\n"; }
	if (this.code && this.code != "") { xml = xml + indent + "<code>" + this.code + "</code>\n"; }
	if (this.note && this.note != "") { xml = xml + indent + "<note>" + this.note + "</note>\n"; }
	if (this.references && this.references != "") { xml = xml + indent + "<references>" + this.references + "</references>\n"; }
	if (this.incidents && this.incidents != "") { xml = xml + indent + "<incidents>" + this.incidents + "</incidents>\n"; }
	if ( this.infos && this.infos.length > 0 ) {
		for (var i = 0; i < this.infos.length; i++ ) {
			var info = this.infos[i];
			xml = xml + indent + "<info>\n";
			indent = "    ";
			xml = xml + indent + "<language>" + info.lang + "</language>\n";	
			if ( info.categories.length ) {
				for (var i = 0; i < info.categories.length; i++ ) {
					var category = info.categories[i];
					xml = xml + indent + "<category>" + category + "</category>\n";
				}
			}
			xml = xml + indent + "<event>" + info.event + "</event>\n";
			if ( info.responseTypes && info.responseTypes.length ) {
				for (var i = 0; i < info.responseTypes.length; i++ ) {
					var responseType = info.responseTypes[i];
					xml = xml + indent + "<responseType>" + responseType + "</responseType>\n";
				}
			}
			xml = xml + indent + "<urgency>" + info.urgency + "</urgency>\n";
			xml = xml + indent + "<severity>" + info.severity + "</severity>\n";
			xml = xml + indent + "<certainty>" + info.certainty + "</certainty>\n";
			if (this.audience && this.audience != "") { xml = xml + indent + "<audience>" + info.audience + "</audience>\n"; }
			
			if ( info.eventCodes && info.eventCodes.length ) {
				for (var i = 0; i < info.eventCodes.length; i++ ) {
					var eventCode = info.eventCodes[i];
					xml = xml + indent + "<eventCode>" + eventCode + "</eventCode>\n";
				}
			}
			if (info.effective && info.effective != "") { xml = xml + indent + "<effective>" + info.effective + "</effective>\n"; }
			if (info.onset && info.onset != "") { xml = xml + indent + "<onset>" + info.onset + "</onset>\n"; }
			if (info.expires && info.expires != "") { xml = xml + indent + "<expires>" + info.expires + "</expires>\n"; }
			if (info.senderName && info.senderName != "") { xml = xml + indent + "<senderName>" + info.senderName + "</senderName>\n"; }
			if (info.headline && info.headline != "") { xml = xml + indent + "<headline>" + info.headline + "</headline>\n"; }
			if (info.description && info.description != "") { xml = xml + indent + "<description>" + info.description + "</description>\n"; }
			if (info.instruction && info.instruction != "") { xml = xml + indent + "<instruction>" + info.instruction + "</instruction>\n"; }
			if (info.web && info.web != "") { xml = xml + indent + "<web>" + info.web + "</web>\n"; }
			if (info.contact && info.contact != "") { xml = xml + indent + "<contact>" + info.contact + "</contact>\n"; }
			if ( info.parameters && info.parameters.length ) {
				for (var i = 0; i < info.parameters.length; i++ ) {
					var parameter = info.parameters[i];
					xml = xml + indent + "<parameter>\n";
					xml = xml + indent + "  <valueName>" + parameter[0] + "</valueName>\n";
					xml = xml + indent + "  <value>" + parameter[1] + "</value>\n";
					xml = xml + indent + "</parameter>\n";
				}
			}			
			if ( info.resources && info.resources.length > 0 ) {
				for (var i = 0; i < this.info.resources.length; i++ ) {
					var resource = info.resources[i];
					xml = xml + indent + "<resource>\n";
					indent = "      ";
					xml = xml + indent + "<resourceDesc>" + resource.resourceDesc + "</resourceDesc>\n";
					if (resource.mimeType && resource.mimeType != "") { xml = xml + indent + "<mimeType>" + resource.mimeType + "</mimeType>\n"; }
					if (resource.uri && resource.uri != "") { xml = xml + indent + "<uri>" + resource.uri + "</uri>\n"; }
					if (resource.digest && resource.digest != "") { xml = xml + indent + "<digest>" + resource.digest + "</digest>\n"; }
					indent = "  ";
					xml = xml + indent + "</resource>\n";
				}
			}
			if ( info.areas && info.areas.length > 0 ) {
				for (var i = 0; i < info.areas.length; i++ ) {
					var area = info.areas[i];
					xml = xml + indent + "<area>\n";
					indent = "      ";
					xml = xml + indent + "<areaDesc>" + area.areaDesc + "</areaDesc>\n";
					if ( area.polygons && area.polygons.length ) {
						for (var i = 0; i < area.polygons.length; i++ ) {
							xml = xml + indent + "<polygon>" + area.polygons[i] + "</polygon>\n";
						}
					}
					if ( area.circles && area.circles.length ) {
						for (var i = 0; i < area.circles.length; i++ ) {
							xml = xml + indent + "<circle>" + area.circles[i] + "</circle>\n";
						}
					}
					if ( area.geocodes && area.geocodes.length ) {
						for (var i = 0; i < area.geocodes.length; i++ ) {
							var geocode = area.geocodes[i];
							xml = xml + indent + "<geocode>\n";
							xml = xml + indent + "  <valueName>" + geocode[0] + "</valueName>\n";
							xml = xml + indent + "  <value>" + geocode[1] + "</value>\n";
							xml = xml + indent + "</geocode>\n";
						}
					}
					if (area.altitude && area.altitude != "") { xml = xml + indent + "<altitude>" + area.altitude + "</altitude>\n"; }
					if (area.ceiling && area.ceiling != "") { xml = xml + indent + "<ceiling>" + area.ceiling + "</ceiling>\n"; }
					indent = "    ";
					xml = xml + indent + "</area>\n";
				}
			}
			indent = "  ";
			xml = xml + indent + "</info>\n";
		}
	}
	xml = xml + "</alert>";
	return xml;
}


/////////////////////////////////////////////
// INFO Object
var Info = function() {
	this.lang = "";
	this.categories = [];		// REQUIRED (at least one), values Geo, Met, Safety, Security, Rescue, Fire, Health, Env, Transport, Infra, CBRNE, Other
	this.event = "";			// REQUIRED
	this.responseTypes = [];
	this.urgency = "Unknown";	// REQUIRED: values Immediate, Expected, Future, Past, Unknown
	this.severity = "Unknown";	// REQUIRED: values Extreme, Severe, Moderate, Minor, Unknown
	this.certainty = "Unknown";	// REQUIRED: values Observed, Likely, Possible, Unlikely, Unknown
	this.audience = "";
	this.eventCodes = [];
	this.effective = "";
	this.onset = "";
	this.expires = "";
	this.senderName = "";
	this.headline = "";
	this.description = "";
	this.instruction = "";
	this.web = "";
	this.contact = "";
	this.resources = [];
	this.parameters = [];
	this.areas = [];
}

Info.prototype.addCategory = function(category) {	// Geo, Met, Safety, Security, Rescue, Fire, Health, Env, Transport, Infra, CBRNE, Other
	this.categories.push( category );
}

Info.prototype.addResponseType = function(responseType) {	// Shelter, Evacuate, Prepare,  Execute, Avoid, Monitor, Assess, AllClear
	this.responseTypes.push( responseType );
}

var EventCode = function(valueName,value) {
	this.valueName = valueName = value;
	this.value;
}

Info.prototype.addEventCode = function(valueName, value) {
	var eventCode = new EventCode(valueName, value);
	this.eventCodes.push( eventCode );
}

var Parameter = function(valueName, value) {
	this.valueName = valueName;
	this.value = value;
}

Info.prototype.addParameter = function(valueName, value) {
	var parameter = new Parameter(valueName, value);
	this.parameters.push( parameter );
}

Info.prototype.addArea = function(areaDesc) {
	var area = new Area(areaDesc);
	this.areas.push( area );
	return area;
}

Info.prototype.addResource = function(resourceDesc) {
	var resource = new Resource(resourceDesc);
	this.resources.push( resource );
	return resource;
}


///////////////////////////////////////////////////////
// AREA Object
var Area = function() {
	this.areaDesc = "Unspecified Area";	// REQUIRED
	this.polygons = [];
	this.circles = [];
	this.geocodes = [];
	this.altitude = "";
	this.ceiling = "";
}

Area.prototype.addPolygon = function(polygon) {
	this.polygons.push( polygon );
}

Area.prototype.addCircle = function(circle) {
	this.circles.push( circle );
}

var Geocode = function(valueName, value) {
	this.valueName = valueName;
	this.value = value;
}

Area.prototype.addGeocode = function(valueName, value) {
	var geocode = new Geocode(valueName,value);
	this.geocodes.push( geocode );
}


///////////////////////////////////////////////////////
// RESOURCE Object
var Resource = function(resourceDesc) {
	this.resourceDesc = resourceDesc;	// REQUIRED
	this.mimeType;
	this.uri;
	this.digest;
	// note: derefURI is not implemented in this tool
}

Resource.prototype.getJSON = function() {
	return JSON.stringify(this);
}

//////////////////////////////////////////////////////
// trivial example code (uncomment to test on load)
/*
newAlert = new Alert();
info = newAlert.addInfo();
info.addParameter( "parameter_type", "silly");
area = info.addArea("กรุงเทพมหานคร");  // testing unicode, that's Thai for Bangkok
area.addCircle("100.54386,13.81390 30.99990");
alert(newAlert.getJSON() );
*/
