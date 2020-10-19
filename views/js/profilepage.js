$('.tab-menu > li').on('click', function() {
   $('.tab-menu > li.active').removeClass('active');
   $(this).addClass('active');
});

function addClassBlock($id) {
   return $id.addClass('btn-block');
}

function removeClassBlock($id) {
   return $id.removeClass('btn-block');
}

function custom_css() {
   if(window.innerWidth >= 768) {
      removeClassBlock($('#save_changed'));
      removeClassBlock($('#save_new_password'));
      $('#line-vertical').addClass('line-vertical');
   }
   else { 
      addClassBlock($('#save_changed'));
      addClassBlock($('#save_new_password'));
      $('#line-vertical').removeClass('line-vertical');
      $('#modal_crop_image').css({'padding-right': '0'});
   }
   
   $('.img-profile').css({height: $('.img-profile').width() + 'px'});
   $('.bottom-column').css({height: $('.img-profile').width() + 'px'});
}

custom_css();

$(window).resize(function() {
   custom_css();
});

function slide_password() {
   $('.btn-change-password').on('click', function() {
      $('#show_old_password').hide();
      $('#hidden_change_password').show();
      $("html, body").animate({ scrollTop: $(document).height() }, 1);
      $('#old_password').focus();
   });
   
   $('#cancel').on('click', function() {
      $('#hidden_change_password').hide();
      $('#show_old_password').show();
   });
}

slide_password();
