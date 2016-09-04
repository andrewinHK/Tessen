var datacenter = 'fred';
var criticalColour = "#b94a48";
var warningColour = "#f89406";

var uchiwaURL = localStorage.uchiwaURL;
var sensuApiURL = localStorage.sensuApiURL;

function getEvents(callback) {
    $.ajax({
        dataType: 'json',
        url: sensuApiURL + '/events',
        success: function(data) {
            callback(data);
        }
    });
}

function reloadIcon() {
    getEvents(updateIconBadge);

}

function reloadPopup() {
    getEvents(setPopup);
    setFooter();
}

function updateIconBadge(data) {
    var warn = 0;
    var crit = 0;

    for (i in data) {
        if (data[i].check.status == 2) { crit += 1; }
        if (data[i].check.status == 1) { warn += 1; }
    }

    var icon;

    if (crit > 0) {
        color = criticalColour;
        icon = 'images/sensu-red38.png';
    }
    else {
        color = warningColour;
        icon = 'images/sensu-amber38.png';
    }

    if (data.length > 0) {
        chrome.browserAction.setBadgeText({text: data.length.toString()});
        chrome.browserAction.setBadgeBackgroundColor({color: color});
        chrome.browserAction.setIcon({path: icon});
    } else {
        chrome.browserAction.setBadgeText({text: ""});
        chrome.browserAction.setIcon({path: 'images/sensu-green38.png'});
    }
}

function setPopup(data) {
    if (data.length == 0) {
        $('#main').text = 'No events';
    } else {
        var d = {};
        for (i in data) {
            var client = data[i].client;
            check  = data[i].check;
            if (client.name in d) {
            } else {
                d[client.name] = {
                    "check": [],
                    "address": client.address,
                    "subscriptions": client.subscriptions
                };
            }
            var item = {
                "name": client.name,
                "command": check.command,
                "check": check.name,
                "output": check.output,
                "status": check.status,
                "history": check.history,
                "subscribers": check.subscribers,
                "issued": check.issued,
                "id": data[i].id
            };
            d[client.name]["check"].push(item);
        }

        for (var client in d) {

            // error message
            var body = $('<div class="panel-collapse collapse">');
            body.attr('id', client + '_body');

            var crit = 0;
            var warn = 0;
            for (var error in d[client]["check"]) {
                var e = d[client]["check"][error];

                var check = $('<span class="label">');
                check
                    .addClass((e.status == 2)? 'label-danger':
                        'label-warning')
                    .text(e.check);

                var uchiwa = [uchiwaURL,
                    '#',
                    'client',
                    datacenter,
                    e.name + '?check=' + e.check].join('/');
                var link = $('<a>');
                link
                    .attr({
                        'href': uchiwa,
                        'target': '_blank'
                    })
                    .text(e.output + ' ');

                var hr = $('<hr>');

                var dt = new Date(e.issued * 1000).toISOString();
                var issued = $('<div class="issued">');
                issued.append(
                    $('<abbr class="timeago">').attr('title', dt).text(dt)
                );

                var history = $('<div class="history">');
                history.append(
                    $('<span class="glyphicon glyphicon-bullhorn">'));
                for (i in e.history) {
                    history.append(
                        $('<span>')
                            .addClass('history_color_' + e.history[i])
                            .text("●")
                    );
                }

                var c = $('<div class="panel-body">');
                c.append(link).append(check).append(hr).append(issued).
                append(history);


                body.append(c);
                if (e.status == 2) { crit += 1; }
                if (e.status == 1) { warn += 1; }
            }

            // header
            var panel = $('<div class="panel panel-default">');
            var title = $('<a>');
            title
                .attr({
                    'data-toggle': 'collapse',
                    'data-parent': '#main',
                    'href': '#' + client + '_body',
                    'id': 'id_' + client,
                    'data-placement': 'right',
                    'title': 'Address: ' + d[client].address
                })
                .text(client)
                .append(getClientInfo(e))
                .append(getCheckInfo(e))
                .append(getHeaderBadge(crit, warn))
                .append(getSubscriptions(d[client]))
                .appendTo($('<h4 class="panel-title">')).parent()
                .appendTo($('<div class="panel-heading">')).parent()
                .appendTo(panel);

            body.appendTo(panel);
            $('#main').append(panel);

            $('#id_' + client).tooltip();
        }
        $('abbr.timeago').timeago();
        $('.collapse').collapse();
    }
}

function getSubscriptions(c) {

    var subscriptions = $('<div>');

    for (i in c.subscriptions) {
        var labelColor = 0;
        var l = c.subscriptions[i];

        for (e in c.check) {
            var check = c.check[e];

            if (check.subscribers && check.subscribers.indexOf(l) >= 0) {

                if (labelColor == 0 && check.status == 1) {
                    labelColor = 1;
                } else {
                    labelColor = 2;
                }
            }
        }
        var label = ['label-success', 'label-warning', 'label-danger'];

        subscriptions.append(
            $('<div class="label" style="margin-left:3px">')
                .addClass(label[labelColor])
                .text(l)
        );
    }
    return subscriptions;
}

function getCheckInfo(e) {
}

function getClientInfo(e) {
}

function getHeaderBadge(crit, warn) {
    var bgcolor = (crit > 0) ? criticalColour :
        warningColour;
    var badge = $('<span class="badge pull-right">');
    badge
        .css('backgroundColor', bgcolor)
        .text(crit + warn);
    return badge;
}

function setFooter() {
    $.ajax({
        dataType: 'json',
        url: chrome.extension.getURL('/manifest.json'),
        success: function(data) {
            $('#footer').text("Listening to " + sensuApiURL);
        }
    });
}


function saveOptions() {

    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Saving...';
    setTimeout(function() {
        status.textContent = '';
    }, 750);

    uchiwaURL = document.getElementById("uchiwa").value;
    sensuApiURL = document.getElementById("sensu").value;

    alert('U: ' + uchiwaURL + '\nS: ' + sensuApiURL)

    localStorage.uchiwaURL = uchiwaURL;
    localStorage.sensuApiURL = sensuApiURL;
//    localStorage.refresh = refresh;
    alert('U: ' + localStorage.uchiwaURL + '\nS: ' + localStorage.sensuApiURL);

}

function displayOptions() {
    document.getElementById('uchiwa').value = uchiwaURL;
    document.getElementById('sensu').value = sensuApiURL;
}
