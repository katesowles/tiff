define(['jquery', 'jquery-ui', 'jquery-color', 'webfont', 'zoomooz', 'messenger', 'messenger-theme-future'], function ($) {
  Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-top messenger-on-right',
    theme: 'future'
  }

  $(document).ready(function () {
    const fullList = generateListOfCharacters()
    $('#fontcheck1').text(fullList)
    $('#fontcheck2').text(fullList)

    fullList.map((char, index) => {

      $('.putCanvasesHere').append(`
        <figure class="canvas zoomTarget" data-closeclick="true">
          <span class="letter${index + 1} font1">${char}</span>
          <span class="letter${index + 1} font2">${char}</span>
        </figure>
      `)

      $('.putInputsHere').append(`
        <input class="letter${index + 1}" value="${char}" maxlength="1" />
      `)
    })

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

    function generateListOfCharacters() {
      // TODO: sort upper and lower case next to each other -- could use uppercase loercase and only one of the charFromCode sets
      const ranges = [
        { start: 65, end: 90 }, // A-Z
        { start: 97, end: 122 }, // a-z
        { start: 48, end: 57 }, // 0-9
      ]

      const characterSets = ranges.map((range) => {
        const set = []
        for (let i = range.start; i <= range.end; i++) set.push(i);
        return set;
      })

      const allCharacters = characterSets[0].concat(characterSets[1], characterSets[2]);

      return allCharacters.map(code => String.fromCharCode(code));
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
    $('#reset').click(function () {
      generateListOfCharacters().map((char, index) => {
        $(`.font-display span.letter${index + 1}`).text(char);
        $(`.edit-letters .letter${index + 1}`).val(char);
      })
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
