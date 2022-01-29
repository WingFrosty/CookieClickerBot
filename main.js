if(CCBot === undefined) var CCBot = {};
CCBot.name = "CCBot";
CCBot.version = "0.1";
CCBot.GameVersion = "2.043";

CCBot.launch = function(){
	CCBot.init = function(){
		CCBot.isLoaded = 1;
        CCBot.config = CCBot.defaultConfig();
        
        Game.customStatsMenu.push(function(){
            CCSE.AppendStatsVersionNumber(CCBot.name, CCBot.version);
		});
        
        Game.customOptionsMenu.push(function(){
            CCSE.AppendCollapsibleOptionsMenu(CCBot.name, CCBot.getMenuString());
		});
        
        CCBot.run();
		
        // ======================================
        // Post-Load Hooks
        // To support other mods interfacing with this one
        // ======================================
		if(CCBot.postloadHooks) {
			for(var i = 0; i < CCBot.postloadHooks.length; ++i) {
				(CCBot.postloadHooks[i])();
			}
		}
		
		if (Game.prefs.popups) Game.Popup("CCBot loaded!");
		else Game.Notify("CCBot loaded!", "", "", 1, 1);
	}

    // ======================================
    // Config Functions
    // ======================================
    CCBot.save = function(){
		return JSON.stringify(CCBot.config);
	}

	CCBot.load = function(str){
		var config = JSON.parse(str);
        for(var c in config){
            CCBot.config[c] = config[c];
        }
	}
    
    CCBot.defaultConfig = function() {
        return {
            chaseAchievements: false,
            clickInterval: 300,
            clickBigCookie: false,
            clickSpecialCookie: false,
            clickLump: false,
            clickFortuneTicker: false,
            buyBuildings: false,
            buyUpgrades: false,
            buyBuildingLevel: false,
            playMinigameGarden: false,
            playMinigamePantheon: false,
            playMinigameGrimoire: false,
            playMinigameStockMarket: false,
            ascend: false
        }
    }
    
    CCBot.updateToggleButton = function(configId, buttonId, textOn, textOff, invert) {
        if (CCBot.config[configId]) {
            l(buttonId).innerHTML = textOff;
            l(buttonId).className += " off";
            CCBot.config[configId] = 0;
        }
        else {
            l(buttonId).innerHTML = textOn;
            l(buttonId).className = l(buttonId).className.replace(/(?:^|\s)off(?!\S)/g, "");
            CCBot.config[configId] = 1;
        }
        //l(buttonId).className = "smallFancyButton option" + ((CCBot.config[configId] ^ invert) ? "" : " off");
    }
    
    CCBot.getClickInterval = function() {
        return CCBot.config["clickInterval"] + "ms";
    }
    
    CCBot.updateSlider = function(configId, sliderId, rightText) {
        CCBot.config[configId] = Math.round(l(sliderId).value);
        l(sliderId+"RightText").innerHTML = rightText;
    }
    
    CCBot.getMenuString = function() {
        let menu = CCSE.MenuHelper;
        
        var clickIntervalText = "Clicking Interval";
        var clickBigCookieText = "Click Big Cookie";
        var clickSpecialCookieText = "Click Special Cookie";
        var clickLumpText = "Harvest Sugar Lump";
        var clickFortuneTickerText = "Click the News Ticker";
        
        var str = menu.Header("Clicking")
            + CCUtils.menu.slider(
                sliderId = "clickIntervalSlider",
                leftText = clickIntervalText,
                rightText = CCBot.getClickInterval(),
                value = function(){return CCBot.config.clickInterval;},
                minValue = 30,
                maxValue = 1000,
                step = 10,
                callback = "CCBot.updateSlider('clickInterval', 'clickIntervalSlider', CCBot.getClickInterval());"
            )
            + CCUtils.menu.toggleButton(
                config = CCBot.config,
                configId = "clickBigCookie",
                buttonId = "clickBigCookieButton",
                textOn = CCUtils.menu.buttonTextOn(clickBigCookieText),
                textOff = CCUtils.menu.buttonTextOff(clickBigCookieText),
                callback = "CCBot.updateToggleButton",
                description = "Click the big cookie."
            )
            + CCUtils.menu.toggleButton(
                config = CCBot.config,
                configId = "clickSpecialCookie",
                buttonId = "clickSpecialCookieButton",
                textOn = CCUtils.menu.buttonTextOn(clickSpecialCookieText),
                textOff = CCUtils.menu.buttonTextOff(clickSpecialCookieText),
                callback = "CCBot.updateToggleButton",
                description = "Click special cookies that appear on screen like golden cookies or reindeers."
            )
            + CCUtils.menu.toggleButton(
                config = CCBot.config,
                configId = "clickLump",
                buttonId = "clickLumpButton",
                textOn = CCUtils.menu.buttonTextOn(clickLumpText),
                textOff = CCUtils.menu.buttonTextOff(clickLumpText),
                callback = "CCBot.updateToggleButton",
                description = "Harvest sugar lump when ripe."
            )
            + CCUtils.menu.toggleButton(
                config = CCBot.config,
                configId = "clickFortuneTicker",
                buttonId = "clickFortuneTickerButton",
                textOn = CCUtils.menu.buttonTextOn(clickFortuneTickerText),
                textOff = CCUtils.menu.buttonTextOff(clickFortuneTickerText),
                callback = "CCBot.updateToggleButton",
                description = "Click the News Ticker when a fortune appears."
            )
        ;
        
        return str;
    }
    
    // ======================================
    // CCBot Functions
    // ======================================
    
    CCBot.run = function() {
        var fasterInterval = 1000; //1s
        var slowerInterval = 1 * 60 * 1000; //1min

        CCBot.clickingLoop();
    }
    
    CCBot.clickingLoop = function() {
        CCBot.clickBigCookie();
        CCBot.clickSpecialCookie();
        CCBot.clickLump();
        CCBot.clickFortuneTicker();
        
        setTimeout(CCBot.clickingLoop, CCBot.config.clickInterval);
    }
    
    // ======================================
    // Clicking Functions
    // ======================================
    CCBot.clickBigCookie = function() {
        if (CCBot.config.clickBigCookie) {
            CCUtils.clickBigCookie();
        }
    }
    
    CCBot.clickSpecialCookie = function() {
        
    }
    
    CCBot.clickLump = function() {
        
    }
    
    CCBot.clickFortuneTicker = function() {
        
    }
    
    // ======================================
    // Buying Functions
    // ======================================
	
	if(CCSE.ConfirmGameVersion(CCBot.name, CCBot.version, CCBot.GameVersion)) Game.registerMod(CCBot.name, CCBot);
}

if(!CCBot.isLoaded){
	if(CCSE && CCSE.isLoaded){
		CCBot.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(CCBot.launch);
	}
}