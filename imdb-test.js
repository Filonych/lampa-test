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

    var headers = {
        'User-Agent':
            'Mozilla/5.0 (Linux; Android 10; Android TV) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) ' +
            'Chrome/120.0.0.0 Safari/537.36',
        'Accept':
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    };

    function requestPage(name, url, callback) {
        var network = new Lampa.Reguest();

        show('Проверяю ' + name + '...');

        network.native(
            url,
            function (result) {
                var text = safeText(result);

                console.log(name + ' SUCCESS:', result);

                show(
                    name + ' OK: ' +
                    text.substring(0, 180)
                );

                if (callback) {
                    setTimeout(callback, 4000);
                }
            },
            function (error) {
                var text = safeText(error);

                console.log(name + ' ERROR:', error);

                show(
                    name + ' ERROR: ' +
                    text.substring(0, 180)
                );

                if (callback) {
                    setTimeout(callback, 4000);
                }
            },
            false,
            {
                headers: headers
            }
        );
    }

    function start() {
        requestPage(
            'MAIN PAGE',
            'https://www.imdb.com/title/tt15398776/',
            function () {
                requestPage(
                    'PARENTS GUIDE',
                    'https://www.imdb.com/title/tt15398776/parentalguide/'
                );
            }
        );
    }

    if (window.appready) {
        setTimeout(start, 2000);
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                setTimeout(start, 2000);
            }
        });
    }
})();
