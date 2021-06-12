$(document).ready(function () {
    //$( "#draggable" ).draggable();
    $("#draggable").draggable();
    $("#droppable").droppable({
        drop: function (event, ui) {
            $(this).addClass("ui-state-highlight").find("p").html("Dropped Success");
        },
    });
    //Resizable
    $("#resizable").resizable();

    //SELECT
    $("#selectable").selectable({
        stop: function () {
            var result = $("#select-result").empty();
            $(".ui-selected", this).each(function () {
                var index = $("#selectable li").index(this);
                result.append(" #" + (index + 1));
            });
        },
    });
    //SHORTABLE
    $("#sortable").sortable({
        placeholder: "ui-state-highlight",
    });
    $("#sortable").disableSelection();

    //acordion
    $("#accordion").accordion({
        collapsible: true,
    });
    //AUTOCOMPLETE

    $.widget("custom.combobox", {
        _create: function () {
            this.wrapper = $("<span>").addClass("custom-combobox").insertAfter(this.element);

            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },

        _createAutocomplete: function () {
            var selected = this.element.children(":selected"),
                value = selected.val() ? selected.text() : "";

            this.input = $("<input>")
                .appendTo(this.wrapper)
                .val(value)
                .attr("title", "")
                .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
                .autocomplete({
                    delay: 0,
                    minLength: 0,
                    source: $.proxy(this, "_source"),
                })
                .tooltip({
                    classes: {
                        "ui-tooltip": "ui-state-highlight",
                    },
                });

            this._on(this.input, {
                autocompleteselect: function (event, ui) {
                    ui.item.option.selected = true;
                    this._trigger("select", event, {
                        item: ui.item.option,
                    });
                },

                autocompletechange: "_removeIfInvalid",
            });
        },

        _createShowAllButton: function () {
            var input = this.input,
                wasOpen = false;

            $("<a>")
                .attr("tabIndex", -1)
                .attr("title", "Show All Items")
                .tooltip()
                .appendTo(this.wrapper)
                .button({
                    icons: {
                        primary: "ui-icon-triangle-1-s",
                    },
                    text: false,
                })
                .removeClass("ui-corner-all")
                .addClass("custom-combobox-toggle ui-corner-right")
                .on("mousedown", function () {
                    wasOpen = input.autocomplete("widget").is(":visible");
                })
                .on("click", function () {
                    input.trigger("focus");

                    // Close if already visible
                    if (wasOpen) {
                        return;
                    }

                    // Pass empty string as value to search for, displaying all results
                    input.autocomplete("search", "");
                });
        },

        _source: function (request, response) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            response(
                this.element.children("option").map(function () {
                    var text = $(this).text();
                    if (this.value && (!request.term || matcher.test(text)))
                        return {
                            label: text,
                            value: text,
                            option: this,
                        };
                })
            );
        },

        _removeIfInvalid: function (event, ui) {
            // Selected an item, nothing to do
            if (ui.item) {
                return;
            }

            // Search for a match (case-insensitive)
            var value = this.input.val(),
                valueLowerCase = value.toLowerCase(),
                valid = false;
            this.element.children("option").each(function () {
                if ($(this).text().toLowerCase() === valueLowerCase) {
                    this.selected = valid = true;
                    return false;
                }
            });

            // Found a match, nothing to do
            if (valid) {
                return;
            }

            // Remove invalid value
            this.input
                .val("")
                .attr("title", value + " didn't match any item")
                .tooltip("open");
            this.element.val("");
            this._delay(function () {
                this.input.tooltip("close").attr("title", "");
            }, 2500);
            this.input.autocomplete("instance").term = "";
        },

        _destroy: function () {
            this.wrapper.remove();
            this.element.show();
        },
    });

    $("#combobox").combobox();
    $("#toggle").on("click", function () {
        $("#combobox").toggle();
    });



//DATE

$( "#datepicker" ).datepicker({
      showOtherMonths: true,
      selectOtherMonths: true
    });

 //DIALOG BUTTON
    $( "#dialog" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      }
    });
 
    $( "#opener" ).on( "click", function() {
      $( "#dialog" ).dialog( "open" );
    });

//MENU
 $( "#menu" ).menu();

//Progressbar
var progressTimer,
      progressbar = $( "#progressbar" ),
      progressLabel = $( ".progress-label" ),
      dialogButtons = [{
        text: "Cancel Download",
        click: closeDownload
      }],
      dialog = $( "#dialog" ).dialog({
        autoOpen: false,
        closeOnEscape: false,
        resizable: false,
        buttons: dialogButtons,
        open: function() {
          progressTimer = setTimeout( progress, 2000 );
        },
        beforeClose: function() {
          downloadButton.button( "option", {
            disabled: false,
            label: "Start Download"
          });
        }
      }),
      downloadButton = $( "#downloadButton" )
        .button()
        .on( "click", function() {
          $( this ).button( "option", {
            disabled: true,
            label: "Downloading..."
          });
          dialog.dialog( "open" );
        });
 
    progressbar.progressbar({
      value: false,
      change: function() {
        progressLabel.text( "Current Progress: " + progressbar.progressbar( "value" ) + "%" );
      },
      complete: function() {
        progressLabel.text( "Complete!" );
        dialog.dialog( "option", "buttons", [{
          text: "Close",
          click: closeDownload
        }]);
        $(".ui-dialog button").last().trigger( "focus" );
      }
    });
 
    function progress() {
      var val = progressbar.progressbar( "value" ) || 0;
 
      progressbar.progressbar( "value", val + Math.floor( Math.random() * 3 ) );
 
      if ( val <= 99 ) {
        progressTimer = setTimeout( progress, 50 );
      }
    }
 
    function closeDownload() {
      clearTimeout( progressTimer );
      dialog
        .dialog( "option", "buttons", dialogButtons )
        .dialog( "close" );
      progressbar.progressbar( "value", false );
      progressLabel
        .text( "Starting download..." );
      downloadButton.trigger( "focus" );
    }
//Selectmenu
 var circle = $( "#circle" );
 
    $( "#radius" ).selectmenu({
      change: function( event, data ) {
        circle.css({
          width: data.item.value,
          height: data.item.value
        });
      }
     });
 
    $( "#color" ).selectmenu({
       change: function( event, data ) {
         circle.css( "background", data.item.value );
       }
     });

//Slider

 function hexFromRGB(r, g, b) {
      var hex = [
        r.toString( 16 ),
        g.toString( 16 ),
        b.toString( 16 )
      ];
      $.each( hex, function( nr, val ) {
        if ( val.length === 1 ) {
          hex[ nr ] = "0" + val;
        }
      });
      return hex.join( "" ).toUpperCase();
    }
    function refreshSwatch() {
      var red = $( "#red" ).slider( "value" ),
        green = $( "#green" ).slider( "value" ),
        blue = $( "#blue" ).slider( "value" ),
        hex = hexFromRGB( red, green, blue );
      $( "#swatch" ).css( "background-color", "#" + hex );
    }
 
    $( "#red, #green, #blue" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: 127,
      slide: refreshSwatch,
      change: refreshSwatch
    });
    $( "#red" ).slider( "value", 255 );
    $( "#green" ).slider( "value", 140 );
    $( "#blue" ).slider( "value", 60 );

  //Tabs
  $( "#tabs" ).tabs({
      collapsible: true
    });
  //Tooltips
  $( document ).tooltip({
      track: true
    });
 

//Color Animation


});














