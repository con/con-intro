
//list of text to show (picked randomly)

const episodes = [
    {
        "center": true,
        "intro": "A long time ago in a galaxy far,\nfar away....",
        
        //we can do 2 lines like "Star/Wars" but it doesn't look good
        //"logo": "CenterFor\nOpenNeuroScience", 
        "logo": "CON",
        "episode": "Episode I",
        "title": "Center for Open NeuroScience", //will be uppercased (must be short)

        "text": "Open source is not only the most efficient paradigm for scalability and collaboration, it facilitates verification and reproducibility.\n\nScientific community is blooming with bright minds doing great research and sharing powerful software solutions and data collections.\n\nScientific software is developed by enthusiasts, who neither have facilities nor funds to support large-scale promotion or reliable distribution.",
    },
    {
        "center": true,
        "intro": "A long time ago in a galaxy far,\nfar away....",
        "logo": "CON",

        "episode": "Episode II",
        "title": "brainlife.io", //will be uppercased (keep it short!)

        "text": "brainlife.io: A Free cloud platform for secure neuroscience data analysis!\n\nNeuroscience is engaging at the forefront of science by dissolving disciplinary boundaries and promoting transdisciplinary research. This process can facilitate discovery by convergent efforts from theoretical, experimental and cognitive neuroscience, as well as computer science and engineering.\n\nTo assure the success of this process, the current lack of established mechanisms to promote open sharing data, software and scientific results must be overcome. Promoting open software and data sharing has become paramount to addressing the problem of scientific reproducibility.\n\nbrainlife.io addresses challenges to neuroscience open sharing and reproducibility by providing integrative mechanisms for publishing data, and algorithms while embedding them with computing resources to impact multiple scientific communities.\n\nTry brainlife.io today to experience the power of open platform!",
    },
];


// make audio load on mobile devices
var audio = document.getElementsByTagName('audio')[0];
var audioIsLoaded = false;
var loadData = function () {
    if(!audioIsLoaded){
        audio.load();
        audioIsLoaded = true;
    }
};
document.body.addEventListener('touchstart', loadData);

function punchit() {
    document.location = 'https://centerforopenneuroscience.org/';
}

// prevent arrow scrolling in firefox
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    var type = document.activeElement.type || '';
    if(!type.startsWith('text')){
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }
}, false);

var notPlayed = true;

/*
$('#form-starwars').submit(function(event) {
  event.preventDefault();
  var opening = getOpeningFormValues();
  var before = StarWars.opening;
  if(!isOpeningsDifferents(opening, before)){ // User replay the same intro without modification, doesn't need to create a new one
      var hashbefore = location.hash;
      var hashnow = '!/'+OpeningKey;
      location.hash = hashnow;
      if(hashbefore !== hashnow){ // if user is in edit form but not in /edit url, force hashchange because the hash will be the same.
          window.dispatchEvent(new Event('hashchange'));
      }
    return;
  }

  if(!isOpeningsDifferents(opening,defaultOpening)){
      setLoading();
      location.hash = '!/Episode8';
      return;
  }

  var aLogo = opening.logo.split('\n');
  if(aLogo.length > 2){
      sweetAlert("Oops...", "Logo can't have more than 2 lines.", "warning");
      return;
  }
  var aIntro = opening.intro.split('\n');
  if(aIntro.length > 2){
      sweetAlert("Oops...", "Intro text can't have more than 2 lines.", "warning");
      return;
  }


    for(var key in opening){
        if(opening[key] == "string" && opening[key].indexOf("??") > -1){
            sweetAlert("Oops...", "Your text can't contain the sequence \"??\", please fix it and submit again.", "error");
            return;
        }
    }

  setLoading();
  $.ajax({
      url: "https://starwarsopeninga.firebaseio.com/openings.json",
      method: "POST",
      data: JSON.stringify(opening),
      dataType: "json",
      success: function(data){
          var key = 'A'+data.name.substring(1);
          CreatedIntros.save(key,opening);
          location.hash = '!/'+key;
      },
      error: ajaxErrorFunction('Error when creating the intro.\n\n'+JSON.stringify(opening))
  });
});
*/

$(window).on('hashchange', function() {

    /*
    var urlByKey = function(key){
        var code = key.charAt(0);
        if(code === "A"){
            key = key.substr(1);
            return 'https://starwarsopeninga.firebaseio.com/openings/-'+key+'.json';
        }else{
            return 'https://starwarsopening.firebaseio.com/openings/-'+key+'.json';
        }
    };
    */

    //$("#playBut").remove();
    //var params = location.hash.replace('#!/', '').split('/');
    //var key = params[0];
    //var edit = false;
    //try{
    //    edit = params[1] === "edit";
    //}catch(e){}
    $('body').removeClass('running');
    let counter = localStorage.getItem("counter") || Math.floor(Math.random()*100);
    counter++;
    localStorage.setItem("counter", counter);
    const opening = episodes[counter%episodes.length]; 
    StarWars.opening = opening;
    console.log("picked episode", opening, counter);

    var intro = opening.intro.replace(/</g,"&lt;");
    intro = intro.replace(/>/g,"&gt;");
    intro = intro.replace(/\n/g,"<br>");
    StarWars.animation.find("#intro").html(intro);
    StarWars.animation.find("#episode").text(opening.episode);

    var title = StarWars.animation.find("#title")
    if(checkCompatibleSWFont(opening.title)){
        title.addClass('SWFont');
    }
    title.text(opening.title);

    var ps = opening.text.split('\n');

    var div = StarWars.animation.find("#text");
    div.text('');
    for(var i in ps){
        div.append($('<p>').text(ps[i]));
    }

    div.css('text-align',opening.center ? 'center':'');

    $('#logosvg',StarWars.animation).css('width',$(window).width()+'px'); // set width of the logo
    $('#logoimg',StarWars.animation).css('width',$(window).width()+'px');

    var logoText = opening.logo ? opening.logo : "star\nwars";
    var aLogo = logoText.split('\n'); // breaks logo text in 2 lines
    var logo1 = aLogo[0];
    var logo2 = aLogo[1] || "";
    var texts = $('#logosvg text',StarWars.animation);
    texts[0].textContent = logo1;
    texts[1].textContent = logo2;

    // calculate the svg viewBox using the number of characters of the longest world in the logo.
    var logosize = logo1.length > logo2.length ? logo1 : logo2;
    var vbox = '0 0 '+logosize.length*200+' 500';
    $('#logosvg',StarWars.animation).each(function () {$(this)[0].setAttribute('viewBox', vbox) });
    $('#logosvg',StarWars.animation).show();
    $('#logoimg',StarWars.animation).hide();

    $.when(StarWars.audioDefer).then(function(){
        var buffered = StarWars.audio.buffered.end(StarWars.audio.buffered.length-1);
        if(buffered == 0 && !audioIsLoaded){
            //unsetLoading();
            /*
            playbutton = $('<div class="verticalWrapper"><div class="playAudio"><button id="playBut" class="playButton" style="font-size: 80px">Play</button></div></div>');
            $('body').append(playbutton);
            $('#playBut',playbutton).click(function(){
                //setLoading();
                //playbutton.remove();
            });
            */
            StarWars.audio.oncanplaythrough = function () {
                notPlayed = false;
                StarWars.play();
            };
        }else{
            notPlayed = false;
            StarWars.play();
        }
    });
});

function getInternetExplorerVersion()
{
  var rv = -1;
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  else if (navigator.appName == 'Netscape')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

$(document).ready(function() {
    window.dispatchEvent(new Event('hashchange'));

    $('#f-center').change(function(){
        var center = $(this).is(':checked');
        $('#f-text').css('text-align', center == true ? 'center' : 'initial');
    });
});

var calcTime = function(queue){
    var minutes = (queue+1)*30;
    var hours = Math.floor(minutes/60);
    var days = Math.floor(hours/24);
    var time = "";
    if(days > 0){
        time += days + " days";
    }
    if(days < 3){
        hours = hours%24;
        minutes = minutes%60;
        if(hours > 0){
            time += " " +hours + " hours";
        }
        if(minutes > 0){
            time += " " +minutes + " minutes";
        }
    }
    return time;
};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var termsOfServiceText = 'By using this website you are agreeing to our <a style="color: #ffd54e;font-weight:bold;" href="termsOfService.html" target="_blank">Terms of Service</a>.';

function isOpeningsDifferents(a,b){ // compare two openings texts to see if they are different
    var changes =[];
    if(a === null || b == null ){
        return true;
    }
    changes.push(a.intro !== b.intro);
    changes.push(a.logo !== b.logo);
    changes.push(a.episode !== b.episode);
    changes.push(a.title !== b.title);
    changes.push(a.text !== b.text);
    changes.push(a.center !== b.center && b.center !== undefined);

    return changes.reduce(function(c,e){
        return c || e;
    },false);
};

/*
function parseSpecialKeys(key){
    switch (key) {
        case "Episode7": // Episode7 is a special key for URL, it plays the Episode 7 opening
            return "AKcKeYMPogupSU_r1I_g";
        case "Episode8":
            return "AL6yNfOxCGkHKBUi54xp";
        // TODO other eps
        default:
            return key;
    }
}
*/

function checkCompatibleSWFont(title){
    var supportedChars = " qwertyuiopasdfghjklzxcvbnm0123456789!$".split(''); // all supported supported chars
    var unique = title.toLowerCase().split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }); // get unique characters from the input string
    for(var i=0;i<unique.length;i++){
        if(supportedChars.indexOf(unique[i]) == -1){
            return false;
        }
    }
    return true;
}
