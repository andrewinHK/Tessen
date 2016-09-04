document.addEventListener('DOMContentLoaded', function(e) {
    // TODO: Alarm
    reloadIcon();
    setInterval(function() {
        reloadIcon();
    }, 1000 * 10);
});

