sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("gve.controller.LandingPage", {
        onInit: function () {
            //Set HERE map instead of standard SAP one
            //I use my own HERE app_id & app_code => Should be changed to DXC's one
            var oGeoMap = this.getView().byId("ThingMap");
            var oMapConfig = {
                    "MapProvider": [
                        {
                            "name": "HEREMAPS",
                            "type": "",
                            "description": "",
                            "tileX": "256",
                            "tileY": "256",
                            "maxLOD": "20",
                            "copyright": "Tiles Courtesy of HERE Maps",
                            "Source": [
                                {
                                    "id": "s1",
                                    "url": "https://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/reduced.day/{LOD}/{X}/{Y}/256/png8?app_id=HgBBzVzzwlLbdx8JIoQX&app_code=19q37KlwRfPiSTuG2iEnlQ"
                                }, 
                                {
                                    "id": "s2",
                                    "url": "https://2.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/reduced.day/{LOD}/{X}/{Y}/256/png8?app_id=HgBBzVzzwlLbdx8JIoQX&app_code=19q37KlwRfPiSTuG2iEnlQ"
                                }
                            ]
                        }
                    ],
                    "MapLayerStacks": [
                        {
                            "name": "DEFAULT",
                            "MapLayer": {
                                "name": "layer1",
                                "refMapProvider": "HEREMAPS",
                                "opacity": "1.0",
                                "colBkgnd": "RGB(255,255,255)"
                            }
                        }
                    ]
                 };
                
            oGeoMap.setMapConfiguration(oMapConfig);
            oGeoMap.setRefMapLayerStack("DEFAULT");            
        },

		zoomToMap: function (oEvent) {
            oEvent.getParameters().context = oEvent.getParameter("thing");
            //var oThingObject = oEvent.getParameter("context").getParameters("thing").thingData;
			//this.byId("idMap").openThingCardOnZoom(oEvent);
			this.byId("idMap").doMapZoom(oEvent);
        },


        onSelectionChange:  async function (oEvent) {
            var sItem = oEvent.getParameter("listItem");
            var sThingId = sItem.getTitle();
var startDate = "2020-12-04T00:00:00";
			
			var endDate = "2020-12-07T00:00:00";

/*var startDate = new Date();
			startDate.setMonth(startDate.getMonth() - 1);
			var endDate = new Date();

            new sap.ui.model.Filter({
							path: "latitude",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: "50.85033"
						}),
*/            var aFilters = [
				new sap.ui.model.Filter({
					filters: [
            new sap.ui.model.Filter({
							path: "latitude",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: "50.85033"
						}),                        
                        new sap.ui.model.Filter({
							path: "id",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: sThingId
						}),
						new sap.ui.model.Filter({
							path: "time",
							operator: sap.ui.model.FilterOperator.GE,
							value1: startDate
						}),
						new sap.ui.model.Filter({
							path: "time",
							operator: sap.ui.model.FilterOperator.LT,
							value1: endDate
						})
					],
					and: true
				})
			];            

            var that = this;
            var oDataModel = this.getView().getModel("thingAnalytics");
            var oBindingInfo = this.byId("tabCoord"); //.oThingTable.getBindingInfo("items");
            var oModel = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oModel, "thingAnalyticsModel");
            var sURL = "/IOTAS-ANALYTICS-THING-ODATA/iot.529406714d2841ad82361fa3bc692b1d.gve.geo:propsetMeasures/measurements";
            
            var sHeaders = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            };


            oDataModel.read("/measurements", {
                filters: aFilters,
                success: function (oResult) {
                    console.log(oResult);
                    //oDataModel.setProperty("/measurements",oResult.results);
                    
                    //var myDataz = oDataModel.getData();
                    oModel.setData(oResult);
                    that._setRoute(oModel);
                    
//                    oDataModel.setProperty('/measurements', oResult.results);
//                    that.getView().setModel(oDataModel, "thingAnalyticsModel");
                    //that.getView().getModel("thingAnalyticsModel").setProperty("/measurements", oResult);
                    //var x = that.getView();
                    //var y = x.getModel("thingAnalyticsModel");
                    //y.setProperty("/measurements", oResult);
                    //var mmm = that.byId("tabCoord");
                    
                },
                error: function (oError){
                    console.log(oError);
                }
            });

//this.getView().setModel(oDataModel, "thingAnalyticsModel");
        //sending request
/*        await oModel.loadData(
            sURL, 
        {
            "$filter": "id eq '"+sThingId+"' and time ge datetime'2020-10-01T00:00:00' and time lt datetime'2021-12-01T00:00:00'"
        }, true, "GET", null, false, sHeaders);
 */       

 /*
     var oRouteCollection = new sap.ui.vbm.Routes();
     var oRoute = new sap.ui.vbm.Route();
var oSpots = new sap.ui.vbm.Spots();

    var oGeoMap = this.getView().byId("ThingMap");

        var myData = oModel.getData();
        var sPosition = "";
//const parsedJSON = JSON.parse(myData);
var iTotalNrPos = myData.d.results.length;
var iMiddle = Math.round(iTotalNrPos / 2);
for( let prop in myData.d.results ){
    if (prop === "0"){
        var oEndSpot = new sap.ui.vbm.Spot();
        oEndSpot.setPosition(myData.d.results[prop].longitude+";"+myData.d.results[prop].latitude+
                                    ";0;");
        oSpots.addItem(oEndSpot);
    }
    var mydate = myData.d.results[prop].datetime;
    mydate = mydate.replace('/Date(','');
    mydate = mydate.replace(')/','');
    var mymilli = parseFloat(mydate);
    var mynewdate = new Date(mymilli);
    myData.d.results[prop].datetime = mynewdate.toLocaleString();

   if (prop === iMiddle.toString()){
        var sCenterPosition = "";
        sCenterPosition = sCenterPosition.concat(myData.d.results[prop].longitude, ";", myData.d.results[prop].latitude);
    }
    var lPos = "";
    lPos = lPos.concat(myData.d.results[prop].longitude, ";", myData.d.results[prop].latitude,
                                    ";0;");
    sPosition = lPos+sPosition;
    if (prop === (iTotalNrPos - 1).toString()){
        var oStartSpot = new sap.ui.vbm.Spot();
        oStartSpot.setPosition(myData.d.results[prop].longitude+";"+myData.d.results[prop].latitude+
                                    ";0;");
        oSpots.addItem(oStartSpot);
    }
}        
sPosition = sPosition.substring(0,sPosition.length-1);
oRoute.setPosition(sPosition);
oRoute.setEnd("1");

oRouteCollection.addItem(oRoute);

     oGeoMap.addVo(oRouteCollection);
     oGeoMap.addVo(oSpots);
     
    oGeoMap.setCenterPosition(sCenterPosition);
    oGeoMap.setZoomlevel(10);
*/
//oModel.setData(myData);
//console.log(oModel.getData()); 

        },

        _setRoute: function(oModel){
     var oRouteCollection = new sap.ui.vbm.Routes();
     var oRoute = new sap.ui.vbm.Route();
var oSpots = new sap.ui.vbm.Spots();

    var oGeoMap = this.getView().byId("ThingMap");
    oGeoMap.destroyVos();
        var myData = oModel.getData();
        var sPosition = "";
//const parsedJSON = JSON.parse(myData);
var iTotalNrPos = myData.results.length;
var iMiddle = Math.round(iTotalNrPos / 2);
for( let prop in myData.results ){
    if (prop === "0"){
        var oEndSpot = new sap.ui.vbm.Spot();
        oEndSpot.setPosition(myData.results[prop].longitude+";"+myData.results[prop].latitude+
                                    ";0;");
        oSpots.addItem(oEndSpot);
    }
/*    var mydate = myData.d.results[prop].datetime;
    mydate = mydate.replace('/Date(','');
    mydate = mydate.replace(')/','');
    var mymilli = parseFloat(mydate);
    var mynewdate = new Date(mymilli);
    myData.d.results[prop].datetime = mynewdate.toLocaleString();
 */
   if (prop === iMiddle.toString()){
        var sCenterPosition = "";
        sCenterPosition = sCenterPosition.concat(myData.results[prop].longitude, ";", myData.results[prop].latitude);
    }
    var lPos = "";
    lPos = lPos.concat(myData.results[prop].longitude, ";", myData.results[prop].latitude,
                                    ";0;");
    sPosition = lPos+sPosition;
    if (prop === (iTotalNrPos - 1).toString()){
        var oStartSpot = new sap.ui.vbm.Spot();
        oStartSpot.setPosition(myData.results[prop].longitude+";"+myData.results[prop].latitude+
                                    ";0;");
        oSpots.addItem(oStartSpot);
    }
}        
sPosition = sPosition.substring(0,sPosition.length-1);
oRoute.setPosition(sPosition);
oRoute.setEnd("1");

oRouteCollection.addItem(oRoute);

     oGeoMap.addVo(oRouteCollection);
     oGeoMap.addVo(oSpots);
     
    oGeoMap.setCenterPosition(sCenterPosition);
    oGeoMap.setZoomlevel(10);

        },

        _readDetailsService: function (oDetailsModel, sThingId) {
			var that = this;
			oDetailsModel.read({
				urlParameters: {
                    "$filter": "id eq '" + sThingId + "' and time ge datetime'2020-10-01T00:00:00' and time lt datetime'2021-12-01T00:00:00'",
                    "$orderby": "time asc"
                },
				success: function (oData) {
					that.getView().getModel("thingAnalyticsModel").setProperty("/analyticsData", oData);
					
					sap.ui.getCore().byId("idBusy").close();
				},
				error: function (oError) {
					jQuery.sap.log.error(oError);
					sap.ui.getCore().byId("idBusy").close();
				}
			});

        },
        
        oMultiRowSelect: function (oEvent) {
			if (this.getOwnerComponent().isTimedOut) {
				this.getOwnerComponent().showTimeoutMessage();
			} else {
				sap.ui.getCore().byId("idBusy").open();
			}
			var oThingObject = oEvent.getParameter("context").getParameters("thing").thingData;
			this.getOwnerComponent().getRouter().navTo("thingpage", {
				thingId: oThingObject.ThingId,
				thingType: oThingObject.ThingType,
				highSeverity: oThingObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.High || 0,
				mediumSeverity: oThingObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.Medium || 0,
				lowSeverity: oThingObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.Low || 0
			});
		},

		oMultiFooterSelect: function (oEvent) {
			if (this.getOwnerComponent().isTimedOut) {
				this.getOwnerComponent().showTimeoutMessage();
			} else {
				sap.ui.getCore().byId("idBusy").open();
			}
			this.getOwnerComponent().getRouter().navTo("thinglistpage", false);
		},

		oSingleHeaderSelect: function (oEvent) {
			if (this.getOwnerComponent().isTimedOut) {
				this.getOwnerComponent().showTimeoutMessage();
			} else {
				sap.ui.getCore().byId("idBusy").open();
			}
			var oThingObject = oEvent.getParameter("context").getParameters("thing").thingData;
			this.getOwnerComponent().getRouter().navTo("thingpage", {
				thingId: oThingObject.ThingId,
				thingType: oThingObject.ThingType,
				highSeverity: oThingObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.High || 0,
				mediumSeverity: oThingObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.Medium || 0,
				lowSeverity: oThingObject.DYN_ENT_com_sap_appiot_eventtypes__StandardEventType.Low || 0
			});
		},

		oSingleFooterSelect: function (oEvent) {
			if (this.getOwnerComponent().isTimedOut) {
				this.getOwnerComponent().showTimeoutMessage();
			} else {
				sap.ui.getCore().byId("idBusy").open();
			}
			var oThingObject = oEvent.getParameter("context").getParameters("thing").thingData;
			this.getOwnerComponent().getRouter().navTo("analysispage", {
				thingId: oThingObject.ThingId,
				headerTitle: oThingObject.ThingName,
				subHeaderTitle: oThingObject.ThingExternalId
			});
		},

		onAfterRendering: function () {
			sap.ui.getCore().byId("idBusy").close();
		}

	});
});