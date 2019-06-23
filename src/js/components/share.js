function getIcon(el) {
  let icon = '';
  if (el.hasClass('ya-share2__item_service_vkontakte')) {
    icon = 'vk';
  }
  if (el.hasClass('ya-share2__item_service_facebook')) {
    icon = 'fb';
  }
  if (el.hasClass('ya-share2__item_service_twitter')) {
    icon = 'tw';
  }
  if (el.hasClass('ya-share2__item_service_odnoklassniki')) {
    icon = 'ok';
  }
  return '<svg class="icon social-icon"><use xlink:href="#' + icon + '"/></svg>';
}
function fillIcons() {
  $('#share .ya-share2__item').each(function(){
    $(this).find('.ya-share2__icon').html(getIcon($(this)));
  });
}
function init() {
  let services = $('#share').data('services');
  let ogTitle = document.querySelector("meta[property='og:title']").getAttribute('content');
  let ogDescription = document.querySelector("meta[property='og:description']").getAttribute('content');
  let ogImage = document.querySelector("meta[property='og:image']").getAttribute('content');
  Ya.share2('share', {
    content: {
      url: window.location.href,
      title: ogTitle,
      description: ogDescription,
      image: ogImage
    },
    theme: {
      services: services,
      bare: true,
      lang: 'ru'
    },
    hooks: {
      onready: function() {
        fillIcons();
      }
    }
  });
}
module.exports = {init};