(function($) { 
  'use strict';

  $(document).ready(function ()
  {
    var win, preview;

    /**
    * Display a loading spinner
    *
    * @param {Boolean} active   Enable/Disable loadingIndicator
    * @param {Number} type      Loading for modals (Searching for icons and fonts) or preview area or saving button
    */
    function loadingIndicator(active = true, type = 0) {
      if (type == 1)
        $('.preview .loading-data').toggleClass('hidden', !active);
      else
        $('#submit-settings').toggleClass('saving', active);
    }

    /**
    * Display Notification
    *
    * @param {String} message  Message for notification
    * @param {Boolean} s_error Notification in red or green
    */
    function notification(message, s_error = false) {
      $('.notification').addClass('show').toggleClass('error', s_error);
      $('.notification .message').html(message);

      setTimeout(() => {
        $('.notification').removeClass('show');
      }, 4000);
    }

    // Change preview size
    $(".device").on("click", function () {
      $(".device").removeClass('active');
      $(this).addClass("active");

      // Set new size
      let newSize = $(this).attr('data-size');
      if (newSize)
        $(".screen-size").css("max-width", newSize + "px");
      else
        $(".screen-size").removeAttr('style');
    });


    // Image upload process
    $('.upload-image').change(function ()
    {
      const target_image = this.name;
      const elm_parent = $(this).parent();

      if (this.files && this.files[0]) {
        // Load the image and display it
        var reader = new FileReader();
        reader.onload = function (e) {
          let source = document.createElement('img');
          source.src = e.target.result;

          let preview_image = elm_parent.find('.add-image');
          preview_image.append($(source));

          // Add a class that the image has been uploaded
          preview_image.addClass('image-loaded');
          preview_image.removeAttr('for');

          update_preview(target_image);
        }

        reader.readAsDataURL(this.files[0]);
      }
    });

    // Remove the current image
    $(document).on("click", ".image-loaded", function ()
    {
      $(this).removeClass('image-loaded').find('img').remove();
      $(this).parent().find('.upload-image').val(null);
      $(this).parent().find('.image-location').val('');

      setTimeout(() => {
        $(this).attr('for', $(this).next().attr('id'));
        update_preview($(this).parent().find('.upload-image').attr('name'));
      }, 100);
    });

    // Save style settings
    $('#submit-settings').click(function (e) {
      e.preventDefault();

      // Show loading spinner
      loadingIndicator();

      // Get the data
      const form_data = new FormData(this.form);

      // Add submit to the request
      form_data.append("submit", "submit");

      // Send the request
      $.ajax({
        url: this.form.action,
        data: form_data,
        processData: false,
        contentType: false,
        enctype: 'multipart/form-data',
        type: 'POST',
        success: function(data) {
          if (typeof data == "object")
            notification(data.MESSAGE);
          else
            location.href = "./../ucp.php?mode=login";
        },
        error: function(data) {
          if (data.responseJSON)
            notification(data.responseJSON.MESSAGE, true);
        },
        complete: function() {
          loadingIndicator(false);
        }
      });
    });

    $('#preview_area').on("load", function() {
      // Get the template content
      win = this.contentWindow;
      preview = win.document.documentElement;

      // Prevent load preview section when clicking on the collapse button and dropdown buttons
      $(preview).on('click', 'a', function (e) {
        e.preventDefault();
        if (
          !$(this).hasClass('zn-dropdown-toggle') &&
          !$(this).hasClass('zn-collapse-toggle') &&
          !this.hasAttribute('data-ajax') &&
          !this.hasAttribute('onclick') &&
          !$(this).parents('.user_data_dropdown').length
        ) {
          // Load iframe with new link
          let new_link = this.href + (this.href.indexOf('?') > -1 ? '&' : '?') + "preview_mode=1";
          win.location.href = new_link;

          // Show loading message
          $("#preview_area").removeClass('show');
          loadingIndicator(true, 1);
        }
      });

      // Update all elements in the preview section
      update_preview('all');

      setTimeout(() => {
        loadingIndicator(false, 1);
        $(this).addClass('show');
      }, 400);
    });

    // Update Preview Section
    $('input:not([type="file"]), select').on('change', function () {
      update_preview(this.name);
    });


    /**
     * Update Preview Section
     */
    function update_preview(target)
    {
      if (typeof target == "object" && Array.isArray(target)) {
        for (let i in target)
          update_preview(target[i]);
        return;
      }

      // All Values
      let data = new FormData(document.forms[0]);

      // Logo Image
      if (target == "logo_image" || target == 'all')
      {
        let logo_image = data.get('logo_image')['name'] !== '';
        if (logo_image) {
          let logo_elm = $(preview).find('.logo');

          if ($('.logo-image img').length)
          {
            if (logo_elm.prop('tagName') == 'IMG') {
              logo_elm.replaceWith(`<img class="logo" src="${$('.logo-image img').attr('src')}">`);
            } else {
              logo_elm.removeClass('hidden').html(`<img src="${$('.logo-image img').attr('src')}">`);
            }
          }
        }
        else if (data.get('logo_image_location') == '') {
          $(preview).find('.logo').toggleClass('hidden', !logo_image);
        }
      }
      
      // Logo Size
      if (target == "logo_image" || target == "logo_width" || target == "logo_height" || target == 'all')
      {
        let logo_image = data.get('logo_image')['name'] !== '' || data.get('logo_image_location') !== '';
        if (logo_image) {
          $(preview).find('.logo').css({
            width: data.get('logo_width') ? data.get('logo_width') + "px" : "auto",
            height: data.get('logo_height') ? data.get('logo_height') + "px" : "auto",
          });
        }
      }

      // Theme Color
      if (
        [
          "all",
          "theme_color",
          "theme_color_mode",
        ]
        .indexOf(target) > -1
      ) {
        // Get primary color
        let color = $(`[for="${data.get('theme_color')}"]`).attr('data-color');
        color = color.split('rgb(').slice(-1)[0].split(')').join('');
       
        $(preview).css({ "--color-primary": color });
        update_preview('colorful_panel');
      }

      // Header Image
      if (
        [
          "all",
          "header_image",
        ]
        .indexOf(target) > -1
      ) {
        let header_image = data.get('header_image')['name'] !== '' || data.get('header_image_location') !== '';
        if (header_image) {
          // Add new data
          let img_val = "center center / cover no-repeat url('" + (data.get('header_image_location') ? '../../' + data.get('header_image_location') : $('.header-image img').attr('src')) + "')";
          $(preview).css({"--header-image": img_val});
        }
        else if (data.get('header_image_location') == '') {
          // Clear the old data
          $(preview).css({"--header-image": "none"});
        }
      }

      // Panel Color
      if (
        [
          "all",
          "colorful_panel",
        ]
        .indexOf(target) > -1
      ) {
        // Default background color
        let color = "#f9fafb";

        if (data.get('colorful_panel') == 1)
        {
          color = 'rgb(' + $(`[for="${data.get('theme_color')}"]`).attr('data-color') + ')';
        }

        $(preview).css({ "--panel-bg": color });
      }

      // Collapse Panel
      if (target == "collapse_panel" || target == 'all')
        $(preview).find('.collapse-panel').toggleClass('hidden', !data.get('collapse_panel'));

      // Colorful Panel
      if (target == "colorful_panel" || target == 'all')
        $(preview).find('body').toggleClass('card-primary', data.get('colorful_panel') == 1);
    }
  });

})(jQuery);
