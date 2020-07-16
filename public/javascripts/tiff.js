define(['jquery', 'jquery-ui', 'jquery-color', 'webfont', 'zoomooz', 'messenger', 'messenger-theme-future'], function ($) {
  Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-top messenger-on-right',
    theme: 'future'
  }

  $(document).ready(function () {
    function main(fid, context) {
      var
        control,
        experiment,
        $this = $(context);

      if (fid === 1) {
        control = $('#control').val();
        experiment = $('#experiment').val();
      } else {
        control = $('#experiment').val();
        experiment = $('#control').val();
      }

      if (control.length < 1) {
        return;
      }

      // Display vs. Reset
      if ($this.text().toLowerCase() === "display") {
        $('#select' + fid).find('input').attr('disabled', true);
        $this.text("Hide");

        WebFont.load({
          google: {
            families: [control]
          },
          fontactive: function (name, description) {
            displayAll(fid, name);
          },
          fontinactive: function (name, description) {
            Messenger().post({
              message: "Sadly Tiff couldn't recognize that font.",
              type: 'error',
              showCloseButton: true
            });
          }
        });
      } else {
        $('#select' + fid).find('input').attr('disabled', false);
        $this.text("Display");
        hideAll(fid);
      }
    }

    function displayAll(id, name) {
      $('.font' + id).each(function () {
        this.style.fontFamily = name;

        $(this).animate({
          opacity: 0.5
        }, 500)
      });
    }

    function hideAll(id) {
      $('.font' + id).animate({
        opacity: 0
      }, 500);
    }

    $('#select1 a.btn').click(function () {
      main(1, this);
      return false;
    });

    $('#select2 a.btn').click(function () {
      main(2, this);
      return false;
    });

    $('figure.canvas').hover(function () {
      $(this).stop().animate({ backgroundColor: "#EEEEEE" }, 'slow');
    }, function () {
      $(this).stop().animate({ backgroundColor: "#FFFFFF" }, 'slow'); // original color
    });

    // View mode toggle
    $('#overlay').click(function () {
      $('#switch').animate({ 'marginLeft': '0px' }, 300);

      $(this).removeClass('inactive');
      $('#sideways').addClass('inactive');

      $('.font-display .canvas span').animate({
        width: '100%',
        marginRight: '-100%'
      }, 300);
    });

    $('#sideways').click(function () {
      $('#switch').animate({ 'marginLeft': '25px' }, 300);

      $(this).removeClass('inactive');
      $('#overlay').addClass('inactive');

      $('.font-display .canvas span').animate({
        width: '50%',
        marginRight: 0
      }, 300)
    });

    // Edit letters
    $('.edit-letters input').focus(function () {
      var $this = $(this);
      var id = $this.attr('class');
      var letter = $this.val();

      $this.val('');
      $this.focusout(function () { $this.val(letter); });
      $this.keypress(function (e) {
        letter = String.fromCharCode(e.which);
        $this.val(letter);
        $('.font-display .canvas span.' + id).text(letter);
      });
    });

    // Reset letters
    $('#reset').click(function() {
      $('.font-display span.letter1').text('R');
      $('.font-display span.letter2').text('g');
      $('.font-display span.letter3').text('h');
      $('.font-display span.letter4').text('e');
      $('.edit-letters .letter1').val('R');
      $('.edit-letters .letter2').val('g');
      $('.edit-letters .letter3').val('h');
      $('.edit-letters .letter4').val('e');
    });

    // Footer styling
    $("footer a").hover(function () {
      $(this).stop().animate({ color: "#00B7FF" }, 'slow');
    }, function () {
      $(this).stop().animate({ color: "#AAAAAA" }, 'slow'); // original color
    });

    // Generate font list for autocompletion
    var GoogleAPIKey = "AIzaSyBL9K--BHmB9QPY-Yr_Fd5NZYVOfGmBTKs";
    var WebFontAPI = "https://www.googleapis.com/webfonts/v1/webfonts?callback=?";
    var fontList = [];

    $.getJSON(WebFontAPI, {
      dataType: "jsonp",
      key: GoogleAPIKey
    })
      .done(function (data) {
        $.each(data.items, function (index, item) {
          fontList.push(item.family);
        });

        $('.font-select input').autocomplete({ source: fontList });
      });
  });
});
