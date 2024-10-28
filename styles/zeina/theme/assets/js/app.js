const zeina = {};

(function($) { 
  'use strict';

  $(document).ready(function ()
  {
    // Calculate scroll width
    zeina.scrollWidth = window.innerWidth - document.documentElement.clientWidth;

    // Check if the touch screen
    zeina.isTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    // The default width for mobile mode
    zeina.mobileScreen = 768;

    // Store backdrop close mode animation
    zeina.backdropTimeout = null;

    /**
     * Create a blurred backdrop
     * @param {boolean} show Enable or Disable Backdrop
     * @param {boolean} mobileOnly Enable Backdrop only on mobile phone screens
     */
    zeina.backdrop = (show = true, mobileOnly = false) => {
      // Abort if mobile mode is active and screen width larger than default size 
      if (mobileOnly && window.innerWidth >= zeina.mobileScreen) return;

      // Check if backdrop enabled
      const isBackdrop = $('body').hasClass("backdrop-show");

      // Check if there is a dialog box open
      const isDialog = $(".zn-overlay.open").length;

      // Check if the backdrop is still visible
      if (show && isBackdrop)
      {
        // If it starts a hide mode animation, wait for it to hide and show it again
        if ($('body').hasClass("backdrop-hide")) {
          setTimeout(() => { zeina.backdrop(show, mobileOnly) }, 300);
        }
        else { // If it has not started a hide mode animation yet, prevent it from starting
          clearTimeout(zeina.backdropTimeout);
        }
      }
      // If backdrop is hidden, show it
      else if (show && !isBackdrop) {
        $('body').addClass("backdrop-show");
        $('body').css("padding-right", zeina.scrollWidth + "px");
      }
      // If backdrop is shown, hide it
      else if (!show && isBackdrop && !isDialog) {
        zeina.backdropTimeout = setTimeout(() => {
          // Start animation for hide mode
          $('body').addClass("backdrop-hide");
          
          // Remove the backdrop and clear body style
          setTimeout(() => {
            $('body').removeClass("backdrop-show backdrop-hide");
            $('body').removeAttr("style");
          }, 300);

        }, 100);
      }
    };

    /**
     * Open / Close dropdown menus
     * @param {object} item   Dropdown element
     */
    zeina.dropdown = function (item, open = true) {
      if (item) {
        if (open) {
          // Open the new one
          $(item).find('> .dropdown').show(0);

            // Show backdrop effect
          zeina.backdrop(true, true);

          setTimeout(() => { $(item).addClass('open') }, 10);
        }
        else {
          // Hide backdrop effect
          zeina.backdrop(false, true);

          // Close dropdown
          $(item).removeClass('open');
          setTimeout(() => { $(item).find('> .dropdown').removeAttr('style') }, 350);

          $(item).find('.zn-dropdown.open').each(function () {
            zeina.dropdown(this, false);
          });
        }
      } else {
        $(".zn-dropdown.open").each(function () {
          zeina.dropdown(this, false);
        });
      }
    }

    // Open / Close dropdown menus
    $(document).on("click", ".zn-dropdown-toggle", function ()
    {
      let dropdown = $(this).parentsUntil('.zn-dropdown');
          dropdown = dropdown.length ? dropdown.parent() : $(this).parent();
      let s_opened = dropdown.hasClass('open');

      if (window.innerWidth >= zeina.mobileScreen) {
        zeina.dropdown(dropdown, !s_opened);
      }
      else {
        if ($(dropdown).hasClass('sub-dropdown')) {
          $(dropdown).toggleClass('open', !s_opened).find('> .dropdown').slideToggle(300);
          if (s_opened)
            $(dropdown).find('.zn-dropdown.open').removeClass('open').find('> .dropdown').slideUp(0);
        } else {
          zeina.dropdown(dropdown, !s_opened);
        }
      }
    });

    // Collapse Panels
    $(document).on("click", ".zn-collapse-toggle", function () {
      let s_opened = $(this).hasClass('open');
      $(this).toggleClass('open', !s_opened);

      $($(this).attr('data-zn-collapse')).slideToggle(300, function () {
        if (s_opened && $(this).hasClass('hidden'))
          $(this).removeAttr('style');
      });
    });

    // Password toggle
    $(document).on("click", ".zn-password-toggle", function () {
      let s_opened = $(this).hasClass('open');
      $(this).toggleClass('open', !s_opened);
      $($(this).attr('data-zn-password')).attr('type', !s_opened ? 'text' : 'password');
    });

    // show/hide tabs
    $(document).on("click", "[data-zn-tab]", function () {
      $("[data-zn-tab]").removeClass('active');
      $('[role="tabpanel"]').addClass('hidden');
      // Show the request tab
      $(this).addClass('active');
      $($(this).attr('data-zn-tab')).removeClass('hidden');
    });

    // preventDefault for dropdown & collapse links
    $(document).on("click", ".zn-dropdown-toggle, .zn-collapse-toggle", (event) => {
      event.preventDefault();
    });

    // Close active dropdown & active modal on click outside
    $(document).on("click", function (e) {
      let dropdown = $(".zn-dropdown.open");
      let modal = $(".zn-overlay.open");

      // if the target of the click isn't the dropdown not a descendant of the dropdown
      if (
        (!dropdown.is(e.target) && dropdown.has(e.target).length === 0) ||
        (dropdown.has(e.target).length && (dropdown.find('a').is(e.target) || dropdown.find('a').has(e.target).length) && !$(e.target).hasClass('zn-dropdown-toggle'))
      ) {
        zeina.dropdown(false);
      }

      // if the target of the click isn't the modal not a descendant of the modal
      if (modal.length && !modal.is(e.target) && modal.has(e.target).length === 0) {
        $(".zn-overlay.open").close();
      }
    });

    // Close all dropdown menus & modals when pressing escape key
    $(window).on("keydown", function (e) {
      if (e.key == "Escape") {
        zeina.dropdown(false);
        $(".zn-overlay.open").close();
      }
    });

    // Close all dropdown menus when resizing the window
    $(window).on("resize", function () {
      if (!zeina.isTouchScreen) {
        zeina.dropdown(false);

        // Calc the scroll width
        zeina.scrollWidth = window.innerWidth - document.documentElement.clientWidth;

        // Close open navbar
        $('[data-zn-collapse="#navbar-alignment"].open, [data-zn-collapse="#navbar-footer"].open')
          .each(function () {
            $(this).removeClass('open');
            $($(this).attr('data-zn-collapse')).removeAttr('style');
          });
      }
    });

    // Scroll to the post
    var hash_el = $(location.hash)[0];
    if (hash_el) {
      hash_el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    // Set min-width and min-height to all icons
    $('.iconify').each(function() {
      $(this).css({
        minHeight: $(this).attr('data-height') + "px",
        minWidth: $(this).attr('data-width') + "px"
      });
    });

    /* Removed animation from error button after showing the cause of the error
    * (Attachments Tab -> Post a new topic Page)
    */
    $(document).on('click', '.file-error', function () {
      $(this).next().removeClass('file-status-animate');
    });

    if (typeof phpbb !== "undefined")
    {
      // Create Modals
      const phpbb_alert   = $("#phpbb_alert");
      const phpbb_confirm = $("#phpbb_confirm");

      jQuery.fn.extend({
        open: function () {
          return this.each(function () {
            $(this).removeClass('hidden');
            setTimeout(() => { $(this).addClass('open') }, 10);
          });
        },
        close: function () {
          return this.each(function () {
            $(this).removeClass('open');
            setTimeout(() => { $(this).addClass('hidden') }, 350);
          });
        },
      });

      // Alert phpbb dialog
      var orig_alert = phpbb.alert;
      phpbb.alert = function (title, msg) {
        if (title && title.toLowerCase().includes("error")) {
          phpbb_alert.addClass('alert-error');
        }
        return orig_alert.apply(this, arguments);
      };

      // Open dialog
      phpbb.alert.open = function (dialog) {
        zeina.backdrop(true);
        $(dialog).attr('id') == 'phpbb_confirm' ? phpbb_confirm.open() : phpbb_alert.open();
      }

      // Close dialog
      phpbb.alert.close = function (dialog) {
        $(dialog).attr('id') == 'phpbb_confirm' ? phpbb_confirm.close() : phpbb_alert.close();        
        $(document).off('keydown.phpbb.alert');
        setTimeout(() => zeina.backdrop(false), 200);
        setTimeout(() => phpbb_alert.removeClass('alert-error'), 500);
      }

      // Prevent Default phpBB Codes
      var orig = $.fn.hide;
      $.fn.hide = function() {
        return $(this).hasClass('phpbb_alert') ? phpbb.alert.close(this) : orig.apply(this, arguments);
      }

      // Close on click outside
      $(document).on('click', 'body.backdrop-show', function (e) {
        if ( $('.zn-overlay.open').length && !$(e.target).parents('.zn-overlay').length )
          phpbb.alert.close( $('.zn-overlay.open') );
      });

      // Close by pressing the close button
      $(document).on('click', '.zn-overlay .alert_close', function () {
        phpbb.alert.close( $(this).parents('.zn-overlay') );
      });
    }
  });

})(jQuery);
