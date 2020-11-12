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

  function create() {
	var usr = document.getElementById("first").value;
	var ema = document.getElementById("email").value;
	var pwd = document.getElementById("pwd").value;
	var values = {Key: Math.floor(100000000000000 + Math.random() * 900000000000000), Username: usr, Email: ema,  Password:pwd};
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "registration", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(JSON.stringify(values));
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		if(this.responseText == "1") {
		  localStorage.setItem("key", values.Key);
		  localStorage.setItem("user", usr);
		  nextUp();
		}
	  } 
	}; 
  }

  function check() {
	var unknown = document.getElementById("userA").value;
	var pwd = document.getElementById("pwdA").value;
	var values = {Unknown: unknown,  Password:pwd};
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "check", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(JSON.stringify(values));
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		if(this.responseText == "false") {
		  alert("Login Failure");
		} else {
			localStorage.setItem("key", this.responseText);
		  localStorage.setItem("user", unknown);
		  nextUp();
		}
	  } 
	}; 
  }

  function nextUp() {
	  closeIt();
	  document.getElementById("acct").innerHTML = "<i class=\"fa fa-lock\" style=\"font-size:25px;\" aria-hidden=\"true\"></i>";
  }
  if(localStorage.getItem("key") && localStorage.getItem("user")) {
	document.getElementById("locked").style.display = "block";
	document.getElementById("acct").innerHTML = "<i class=\"fa fa-lock\" style=\"font-size:25px;\" aria-hidden=\"true\"></i>";
  } else {
	document.getElementById("unlocked").style.display = "block";
	document.getElementById("acct").innerHTML = "<i class=\"fa fa-unlock-alt\" style=\"font-size:25px;\" aria-hidden=\"true\"></i>";
  }

  function signOut() {
	localStorage.clear();location.reload();
  }