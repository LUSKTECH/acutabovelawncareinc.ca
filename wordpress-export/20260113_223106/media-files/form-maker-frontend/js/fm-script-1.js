    var fm_currentDate = new Date();
    var FormCurrency_1 = '$';
    var FormPaypalTax_1 = '0';
    var check_submit1 = 0;
    var check_before_submit1 = {};
    var required_fields1 = ["2","3","5"];
    var labels_and_ids1 = {"2":"type_text","3":"type_submitter_mail","6":"type_phone","5":"type_textarea","7":"type_recaptcha","1":"type_submit_reset"};
    var check_regExp_all1 = [];
    var check_paypal_price_min_max1 = [];
    var file_upload_check1 = [];
    var spinner_check1 = [];
    var scrollbox_trigger_point1 = '20';
    var header_image_animation1 = 'none';
    var scrollbox_loading_delay1 = '0';
    var scrollbox_auto_hide1 = '1';
    var inputIds1 = '[]';
        var update_first_field_id1 = 0;
    var form_view_count1 = 0;
    // Occurs before the form is loaded
function before_load1() {
     
}

// Occurs just before submitting  the form
function before_submit1() {
     // IMPORTANT! If you want to interrupt (stop) the submitting of the form, this function should return true. You don't need to return any value if you don't want to stop the submission.
}

// Occurs just before resetting the form
function before_reset1() {
     
}
// Occurs after form is submitted and reloaded
function after_submit1() {
     
}    function onload_js1() {    }

    function condition_js1() {    }

    function check_js1(id, form_id) {
      if (id != 0) {
        x = jQuery("#" + form_id + "form_view"+id);
      }
      else {
        x = jQuery("#form"+form_id);
      }
          }

    function onsubmit_js1() {
      
    var disabled_fields = "";
    jQuery("#form1 div[wdid]").each(function() {
      if(jQuery(this).css("display") == "none") {
        disabled_fields += jQuery(this).attr("wdid");
        disabled_fields += ",";
      }
    })
    if(disabled_fields) {
      jQuery("<input type=\"hidden\" name=\"disabled_fields1\" value =\""+disabled_fields+"\" />").appendTo("#form1");
    };    }

    function unset_fields1( values, id, i ) {
      rid = 0;
      if ( i > 0 ) {
        jQuery.each( values, function( k, v ) {
          if ( id == k.split('|')[2] ) {
            rid = k.split('|')[0];
            values[k] = '';
          }
        });
        return unset_fields1(values, rid, i - 1);
      }
      else {
        return values;
      }
    }

    function ajax_similarity1( obj, changing_field_id ) {
      jQuery.ajax({
        type: "POST",
        url: fm_objectL10n.form_maker_admin_ajax,
        dataType: "json",
        data: {
          nonce: fm_ajax.ajaxnonce,
          action: 'fm_reload_input',
          page: 'form_maker',
          form_id: 1,
          inputs: obj.inputs
        },
        beforeSend: function() {
          if ( !jQuery.isEmptyObject(obj.inputs) ) {
            jQuery.each( obj.inputs, function( key, val ) {
              wdid = key.split('|')[0];
              if ( val != '' && parseInt(wdid) == parseInt(changing_field_id) ) {
                jQuery("#form1 div[wdid='"+ wdid +"']").append( '<div class="fm-loading"></div>' );
              }
            });
          }
        },
        success: function (res) {
          if ( !jQuery.isEmptyObject(obj.inputs) ) {
            jQuery.each( obj.inputs, function( key, val ) {
              wdid = key.split('|')[0];
              jQuery("#form1 div[wdid='"+ wdid +"'] .fm-loading").remove();
              if ( !jQuery.isEmptyObject(res[wdid]) && ( !val || parseInt(wdid) == parseInt(changing_field_id) ) ) {
                jQuery("#form1 div[wdid='"+ wdid +"']").html( res[wdid].html );
              }
            });
          }
        },
        complete: function() {
        }
      });
    }

    function fm_script_ready1() {
      if (jQuery('#form1 .wdform_section').length > 0) {
        fm_document_ready( 1 );
      }
      else {
        jQuery("#form1").closest(".fm-form-container").removeAttr("style")
      }
      if (jQuery('#form1 .wdform_section').length > 0) {
        formOnload(1);
      }
      var ajaxObj1 = {};
      var value_ids1 = {};
      jQuery.each( jQuery.parseJSON( inputIds1 ), function( key, values ) {
        jQuery.each( values, function( index, input_id ) {
          tagName =  jQuery('#form1 [id^="wdform_'+ input_id +'_elemen"]').attr("tagName");
          type =  jQuery('#form1 [id^="wdform_'+ input_id +'_elemen"]').attr("type");
          if ( tagName == 'INPUT' ) {
            input_value = jQuery('#form1 [id^="wdform_'+ input_id +'_elemen"]').val();
            if ( jQuery('#form1 [id^="wdform_'+ input_id +'_elemen"]').is(':checked') ) {
              if ( input_value ) {
                value_ids1[key + '|' + input_id] = input_value;
              }
            }
            else if ( type == 'text' ) {
              if ( input_value ) {
                value_ids1[key + '|' + input_id] = input_value;
              }
            }
          }
          else if ( tagName == 'SELECT' ) {
            select_value = jQuery('#form1 [id^="wdform_'+ input_id +'_elemen"] option:selected').val();
            if ( select_value ) {
              value_ids1[key + '|' + input_id] = select_value;
            }
          }
          ajaxObj1.inputs = value_ids1;
          jQuery(document).on('change', '#form1 [id^="wdform_'+ input_id +'_elemen"]', function() {
          var id = '';
          var changing_field_id = '';
          if( jQuery(this).attr("tagName") == 'INPUT' ) {
            if( jQuery(this).is(':checked') ) {
              id = jQuery(this).val();
            }
            if( jQuery(this).attr('type') == 'text' ) {
              id = jQuery(this).val();
            }
          }
          else {
            id = jQuery(this).val();
          }
          value_ids1[key + '|' + input_id] = id;
          jQuery.each( value_ids1, function( k, v ) {
            key_arr = k.split('|');
            if ( input_id == key_arr[2] ) {
              changing_field_id = key_arr[0];
              count = Object.keys(value_ids1).length;
              value_ids1 = unset_fields1( value_ids1, changing_field_id, count );
            }
          });
          ajaxObj1.inputs = value_ids1;
          ajax_similarity1( ajaxObj1, changing_field_id );
          });
        });
      });
      if ( update_first_field_id1 && !jQuery.isEmptyObject(ajaxObj1.inputs) ) {
        ajax_similarity1( ajaxObj1, update_first_field_id1 );
      }
      form_load_actions();
      	  }
    jQuery(function () {
      fm_script_ready1();
    });
        