$(document).on('scroll', function() {
	if(document.getElementById('vid')) {
		if ($(this).scrollTop() >= $('#vid').position().top) {
			document.getElementById('vid').play();
		  }
	}
  })
  

$(document).ready(function() {
  $('button').on('click', function() {
    if($(this).hasClass('nav-button')) {
      $('nav div').addClass('show');
    } else if($(this).hasClass('exit-menu')) {
      $('nav div').removeClass('show');
    } 
    else if($(this).hasClass('to-top')) {
      $('html,body').animate({scrollTop:0}, 'slow');
    }
  });

  AOS.init({      
        duration: 1800,
    easing: 'ease'
  }); 
})

var language = window.navigator.userLanguage || window.navigator.language;
switch((window.navigator.userLanguage || window.navigator.language).substring(0,2)) {
  case "zh": //chinese
    localiseLanguage("chinese");
    break;
  case "es": //Spanish
    localiseLanguage("spanish");
    break;
  case "fr": // French
    localiseLanguage("french");
    break;
  case "de": // German
	localiseLanguage("german");
    break;
  default: // English 
	localiseLanguage("english");
}

function localiseLanguage(language) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var data = JSON.parse(this.responseText);
			switch(language) {
				case "chinese": //chinese
					changeText(data.chinese);
					break;
				case "spanish": //Spanish
					changeText(data.spanish);
					break;
				case "french": // French
					changeText(data.french);
					break;
				case "german": // German
					changeText(data.german);
					break;
				default: // English 
					changeText(data.english);
			}
		}
	};
	xmlhttp.open("GET", "components/languages.json", true);
	xmlhttp.send();
}

function changeText(content) {
	for(id in content) {
		if($("#" + id)) {
			$("#" + id).html(content[id]);
		}
	}
}
if($('.js-input')) {
	$('.js-input').keyup(function () {
	if ($(this).val()) {
		$(this).addClass('not-empty');
	} else {
		$(this).removeClass('not-empty');
	}
	});
}
var count = 0;
function display() {
	if(count % 2 == 0) {
		document.getElementById("dropdown").style.display = "block";
	} else {
		document.getElementById("dropdown").style.display = "none";
	}
	count++;
}

function signIn() {
	$("#account").fadeIn();$("#arrow").fadeIn();
}

function closeIt() {
	$("#account").fadeOut();
	$("#arrow").fadeOut();
}

$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
    var $this = $(this),
        label = $this.prev('label');
  
        if (e.type === 'keyup') {
              if ($this.val() === '') {
            label.removeClass('active highlight');
          } else {
            label.addClass('active highlight');
          }
      } else if (e.type === 'blur') {
          if( $this.val() === '' ) {
              label.removeClass('active highlight'); 
              } else {
              label.removeClass('highlight');   
              }   
      } else if (e.type === 'focus') {
        
        if( $this.val() === '' ) {
              label.removeClass('highlight'); 
              } 
        else if( $this.val() !== '' ) {
              label.addClass('highlight');
              }
      }
  
  });
  
  $('.tab a').on('click', function (e) {
    
    e.preventDefault();
    
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
    
    target = $(this).attr('href');
  
    $('.tab-content > div').not(target).hide();
    
    $(target).fadeIn(600);
    
  });



if(document.getElementsByClassName("column")) {
  
var elements = document.getElementsByClassName("column");

four();

}
function four() {
  var i;
  
    for (i = 0; i < elements.length; i++) {
      elements[i].style.msFlex = "25%";  // IE10
      elements[i].style.flex = "25%";
    }
  }