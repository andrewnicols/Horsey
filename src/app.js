var UI = require('ui'),
    Vibe = require('ui/vibe'),
    timer = require('timer');


    timer = {
    /**
     * The timer configuration
     */
    config: {},

    maintimer: null,
    
    startTime: null,
    
    minuteSeconds: 0,
    
    configure: function(config) {
        config = config || {};
        this.config.minuteMarker = (typeof config.minuteMarker !== 'undefined') ? config.minuteMarker : true;
        this.config.optimalTime = (typeof config.optimalTime !== 'undefined') ? config.optimalTime : null;
        this.config.warnUnderTime = (typeof config.warnUnderTime !== 'undefined') ? config.warnUnderTime : 20;
        this.config.warnOverTime = (typeof config.warnOverTime !== 'undefined') ? config.warnOverTime : true;
    },
    start: function() {
        // Reset the seconds through the minute before we start.
        timer.minuteSeconds = 0;

        this.startTime = new Date();
        this.processtimer();
        console.log(JSON.stringify(timer.config));
    },
    
    processtimer: function() {
        // Start the timer immediately.
        timer.maintimer = setTimeout(timer.processtimer, 1000);

        var currentTime = new Date(),
            secondsElapsed = parseInt((currentTime - timer.startTime) / 1000),
            handleMinuteMarker = timer.config.minuteMarker;
        
        if (timer.config.optimalTime) {
            // Only handle the minute marker if the time penalties didn't alert.
            handleMinuteMarker = handleMinuteMarker && timer._handleTimePenalties(secondsElapsed);
        }
        
        if (handleMinuteMarker) {
            timer._handleMinuteMarker(secondsElapsed);
        }
        
    },
    
    _handleMinuteMarker: function(secondsElapsed) {
        var minuteSeconds = secondsElapsed % 60;
        
        if (minuteSeconds < timer.lastMinuteSeconds) {
            console.log("Calling minute marker at " + minuteSeconds);
            Vibe.vibrate('double');
        }
        
        timer.lastMinuteSeconds = minuteSeconds;
    },
    
    _handleTimePenalties: function(secondsElapsed) {
        if (timer.config.warnOverTime && secondsElapsed >= timer.config.optimalTime) {
            console.log('Sending over time warning');
            Vibe.vibrate('long');
            return true;
        } else if (timer.config.warnUnderTime && (secondsElapsed >= (timer.config.optimalTime - timer.config.warnUnderTime))) {
            console.log('Sending under time warning');
            Vibe.vibrate('short');
            return true;
        }
        return false;
    }
};


var main = new UI.Card({
    title: 'Horsey',
    subtitle: 'Select Grade'
});


main.on('click', 'up', function(e) {
    // Thanks - we heard you.
    Vibe.vibrate('short');
    
    // Hide the main screen.
    //main.hide();
    
    // Display the status screen.
    console.log(JSON.stringify(timer));

    timer.configure({
        optimalTime: 25
    });
    timer.start();
});

main.show();