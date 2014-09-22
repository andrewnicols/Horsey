var UI = require('ui'),
    Vibe = require('ui/vibe');

var main = new UI.Card({
    title: 'Horsey',
    subtitle: 'Select Grade'
});

main.show();

main.on('click', function(e) {
    console.log(e);
    Vibe.vibrate('short');
});
