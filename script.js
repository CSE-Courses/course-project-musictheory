$(document).ready(function(){
  
var $terms = [
  'Ariana Grande',
  'Billie Eilish',
  'Childish Gambino',
  'Drake',
  'Eminem',
  'Future',
  'Gucci Mane',
  'Halsey',
  'Lil Skies',
  'Justin Bieber',
  'Kendrick Lamar',
  'Lil Uzi Vert',
  'Meek Mill',
  'NAV',
  'One Direction',
  'Pop Smoke' ,
  'Quavo' , 
  'Rich Brian' ,
  'Shoreline Mafia' , 
  'Travis Scott' , 
  'Usher',
  'Vedo',
  'Wiz Khalifa',
  'XXXTENTACION',
  'YG',
  'Zedd',


   ].sort(),
   $return = [];
  
function strInArray(str, strArray) {
  for (var j=0; j<strArray.length; j++) {
    if (strArray[j].match(str) && $return.length < 5) {
      var $h = strArray[j].replace(str, '<strong>'+str+'</strong>');
      $return.push('<li class="prediction-item"><span class="prediction-text">' + $h + '</span></li>');
    }
  }
}
  
function nextItem(kp) {
  if ( $('.focus').length > 0 ) {
    var $next = $('.focus').next(),
        $prev = $('.focus').prev();
  }
  
  if ( kp == 38 ) { // Up
  
    if ( $('.focus').is(':first-child') ) {
      $prev = $('.prediction-item:last-child');
    }
    
    $('.prediction-item').removeClass('focus');
    $prev.addClass('focus');
    
  } else if ( kp == 40 ) { // Down
  
    if ( $('.focus').is(':last-child') ) {
      $next = $('.prediction-item:first-child');
    }
    
    $('.prediction-item').removeClass('focus');
    $next.addClass('focus');
  }
}

$(function(){  
  $('#search-bar').keydown(function(e){
    $key = e.keyCode;
    if ( $key == 38 || $key == 40 ) {
      nextItem($key);
      return;
    }
    
    setTimeout(function() {
      var $search = $('#search-bar').val();
      $return = [];
      
      strInArray($search, $terms);
      
      if ( $search == '' || ! $('input').val ) {
        $('.output').html('').slideUp();
      } else {
        $('.output').html($return).slideDown();
      }
  
      $('.prediction-item').on('click', function(){
        $text = $(this).find('span').text();
        $('.output').slideUp(function(){
          $(this).html('');
        });
        $('#search-bar').val($text);
      });
      
      $('.prediction-item:first-child').addClass('focus');
      
    }, 50);
  });
});
  
  $('#search-bar').focus(function(){
    if ( $('.prediction-item').length > 0 ) {
      $('.output').slideDown();
    }
    
    $('#searchform').submit(function(e){
      e.preventDefault();
      $text = $('.focus').find('span').text();
      $('.output').slideUp();
      $('#search-bar').val($text);
      $('input').blur();
    });
  });
  
  $('#search-bar').blur(function(){
    if ( $('.prediction-item').length > 0 ) {
      $('.output').slideUp();
    }
  });
  
});