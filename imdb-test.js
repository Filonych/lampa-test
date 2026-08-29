(function () {
  function show(text) {
    try {
      Lampa.Noty.show(text);
    } catch (e) {
      console.log(text);
    }
  }

  function stringifySafe(value) {
    try {
      return typeof value === 'string'
        ? value
        : JSON.stringify(value);
    } catch (e) {
      return String(value);
    }
  }

  function testHtml() {
    return new Promise(function (resolve) {
      var network = new Lampa.Reguest();

      network.native(
        'https://www.imdb.com/title/tt15398776/parentalguide/',
        function (result) {
          resolve({
            name: 'HTML',
            ok: true,
            result: stringifySafe(result)
          });
        },
        function (error) {
          resolve({
            name: 'HTML',
            ok: false,
            result: stringifySafe(error)
          });
        },
        false,
        {
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9'
          }
        }
      );
    });
  }

  function testGraphQL() {
    return new Promise(function (resolve) {
      var network = new Lampa.Reguest();

      var query = `
        query {
          title(id: "tt15398776") {
            id
            titleText {
              text
            }
            parentsGuide {
              categories {
                category {
                  text
                }
                severity {
                  text
                }
              }
            }
          }
        }
      `;

      network.native(
        'https://api.graphql.imdb.com/',
        function (result) {
          resolve({
            name: 'GraphQL',
            ok: true,
            result: stringifySafe(result)
          });
        },
        function (error) {
          resolve({
            name: 'GraphQL',
            ok: false,
            result: stringifySafe(error)
          });
        },
        JSON.stringify({
          query: query
        }),
        {
          type: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
    });
  }

  async function run() {
    show('Тест IMDb: HTML...');

    var html = await testHtml();

    show(
      (html.ok ? '✅ ' : '❌ ') +
      'HTML: ' +
      html.result.slice(0, 180)
    );

    setTimeout(async function () {
      show('Тест IMDb: GraphQL...');

      var graphql = await testGraphQL();

      show(
        (graphql.ok ? '✅ ' : '❌ ') +
        'GraphQL: ' +
        graphql.result.slice(0, 180)
      );

      console.log('IMDb HTML RESULT:', html);
      console.log('IMDb GRAPHQL RESULT:', graphql);
    }, 3500);
  }

  if (window.appready) {
    setTimeout(run, 2000);
  } else {
    Lampa.Listener.follow('app', function (event) {
      if (event.type === 'ready') {
        setTimeout(run, 2000);
      }
    });
  }
})();          text = String(error);
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
