define( ["qlik", "text!./Accordion-Menu.ng.html", "css!./Accordion-Menu.css"],
function ( qlik, template ) {
	"use strict";

	var subheader0_1 = {
		label: "0.1 Subheader under Appearance",
		type: "items",
		items: [
			{
				label: "0.1.1 Simple text here",
				component: "text"
			},{
				label: "0.1.2 Get Script",
				component: "button",
				action: function(arg) { 

					qlik.currApp().getScript().then( function(script){
					  	console.log(script.qScript);

						//script.toString().then (function(txt) { console.log('now string: ', txt); });
						
					   	var element = document.createElement('a');
						element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(script.qScript));
						element.setAttribute('download', 'script.txt');
						element.style.display = 'none';
						document.body.appendChild(element);
						element.click();
						document.body.removeChild(element);
					});
				}
			}
		]
	}

	var subheader1_1  = {
		label: '1.1 Subheader lightgrey',
		type: 'items',
		items: [
			{
				 label: '1.1.1 Field',
				 type: 'string',
				 expression: 'optional',
				 ref: 'setting_1_1_1',
				 defaultValue: ''
			},
			{
				label: '1.1.2 alignment',
				type: 'string',
				component: 'item-selection-list',
				icon: true,
				horizontal: true,
				ref: 'setting_1_1_2',
				defaultValue: 'left',
				items: [{
					value: 'left',
					component: 'icon-item',
					icon: 'M'
				},{
					value: 'center',
					icon: 'O',
					component: 'icon-item'
				},{
					value: 'right',
					icon: 'N',
					component: 'icon-item'
				}]
			}
		]
	}; 

	var subheader1_2 = {
		label: '1.2 Subheader lightgrey',
		type: 'items',
		items: [
			{
				label: "1.2.1 Button",
				component: "button",
				action: function(arg) { alert('qlicked!'); }
			},{
				label: "1.2.3 Toggle Switch",
				type: "boolean",
				component: "switch",
				ref: "disableInteractionTopDims",
				defaultValue: false,
				trueOption: {
					value: true,
					translation: "properties.on"
				},
				falseOption: {
					value: false,
					translation: "properties.off"
				}			
			}
		]							
	}

	var mainsection1 = {
		label: 'Main Section 1 with subheaders',
		type: 'items',
		component: 'expandable-items',
		items: {
			i1: subheader1_1,
			i2: subheader1_2
		}
	}
	var mainsection2 = {
		label: "Main Section 2 (no subheaders)",
		type: "items",
		items: [
			{	
				label: "2.1 Simple Text"
				,component: "text"
			},{
				label: "2.2 Button"
				,component: "button"
			}
		]					
	}
	
	return {
		template: template,
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 2,
					qHeight: 50
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 0,
					max: 1
				},
				measures: {
					uses: "measures",
					min: 0,
					max: 1
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings",
					items: {
						i1: subheader0_1
					}
				},
				mysection1: mainsection1,
				mysection2: mainsection2,
				about: {label: "About", type: "items", items: [
					{label: "by Christof Schwarz", component: "text"}
					,{label: "Open on Github",component: "button", action: function(arg) {
						window.open('https://github.com/ChristofSchwarz','_blank');
					}}]
				}
			}
		},
		support: {
			snapshot: true,
			export: true,
			exportData: true
		},
		paint: function () {
			//needed for export
			this.$scope.selections = [];
			return qlik.Promise.resolve();
		},
		controller: ["$scope", "$element", function ( $scope ) {
			$scope.getPercent = function ( val ) {
				return Math.round( (val * 100 / $scope.layout.qHyperCube.qMeasureInfo[0].qMax) * 100 ) / 100;
			};

			$scope.selections = [];

			$scope.sel = function ( $event ) {
				if ( $event.currentTarget.hasAttribute( "data-row" ) ) {
					var row = parseInt( $event.currentTarget.getAttribute( "data-row" ), 10 ), dim = 0,
						cell = $scope.$parent.layout.qHyperCube.qDataPages[0].qMatrix[row][0];
					if ( cell.qIsNull !== true ) {
						cell.qState = (cell.qState === "S" ? "O" : "S");
						if ( $scope.selections.indexOf( cell.qElemNumber ) === -1 ) {
							$scope.selections.push( cell.qElemNumber );
						} else {
							$scope.selections.splice( $scope.selections.indexOf( cell.qElemNumber ), 1 );
						}
						$scope.selectValues( dim, [cell.qElemNumber], true );
					}
				}
			};
		}]
	};

} );
