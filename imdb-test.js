(function () {
  function showMessage(text) {
    try {
      Lampa.Noty.show(text);
    } catch (e) {
      console.log(text);
    }
  }

  function testImdb() {
    var network = new Lampa.Reguest();

    showMessage('Проверяю IMDb...');

    network.native(
      'https://www.imdb.com/title/tt15398776/parentalguide/',
      function (result) {
        console.log('IMDb SUCCESS:', result);

        var text =
          typeof result === 'string'
            ? result
            : JSON.stringify(result);

        showMessage(
          'IMDb OK. Ответ: ' + text.slice(0, 150)
        );
      },
      function (error) {
        console.error('IMDb ERROR:', error);

        var text;

        try {
          text = JSON.stringify(error);
        } catch (e) {
          text = String(error);
        }

        showMessage(
          'IMDb ERROR: ' + text.slice(0, 150)
        );
      }
    );
  }

  if (window.appready) {
    setTimeout(testImdb, 2000);
  } else {
    Lampa.Listener.follow('app', function (event) {
      if (event.type === 'ready') {
        setTimeout(testImdb, 2000);
      }
    });
  }
})();
