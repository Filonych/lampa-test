(function () {
    function show(text) {
        try {
            Lampa.Noty.show(text);
        } catch (e) {
            console.log(text);
        }
    }

    function safeText(value) {
        try {
            if (typeof value === 'string') return value;
            return JSON.stringify(value);
        } catch (e) {
            return String(value);
        }
    }

    function testGraphQL() {
        show('2/2 Проверяю IMDb GraphQL...');

        var network = new Lampa.Reguest();

        var query =
            'query {' +
                ' title(id: "tt15398776") {' +
                    ' id' +
                    ' titleText { text }' +
                    ' parentsGuide {' +
                        ' categories {' +
                            ' category { text }' +
                            ' severity { text }' +
                        ' }' +
                    ' }' +
                ' }' +
            '}';

        network.native(
            'https://api.graphql.imdb.com/',
            function (result) {
                var text = safeText(result);

                console.log('GraphQL SUCCESS:', result);

                show(
                    'GraphQL OK: ' +
                    text.substring(0, 180)
                );
            },
            function (error) {
                var text = safeText(error);

                console.log('GraphQL ERROR:', error);

                show(
                    'GraphQL ERROR: ' +
                    text.substring(0, 180)
                );
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
    }

    function testHtml() {
        show('1/2 Проверяю страницу IMDb...');

        var network = new Lampa.Reguest();

        network.native(
            'https://www.imdb.com/title/tt15398776/parentalguide/',
            function (result) {
                var text = safeText(result);

                console.log('HTML SUCCESS:', result);

                show(
                    'HTML OK: ' +
                    text.substring(0, 180)
                );

                setTimeout(testGraphQL, 4000);
            },
            function (error) {
                var text = safeText(error);

                console.log('HTML ERROR:', error);

                show(
                    'HTML ERROR: ' +
                    text.substring(0, 180)
                );

                setTimeout(testGraphQL, 4000);
            },
            false,
            {
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            }
        );
    }

    function start() {
        setTimeout(testHtml, 2000);
    }

    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                start();
            }
        });
    }
})();
