// Generated by CoffeeScript 1.4.0
var delay, playing, render, show,
  __slice = [].slice;

show = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  if ((typeof console !== "undefined" && console !== null) && (console.log != null) && (console.log.apply != null)) {
    return console.log.apply(console, args);
  }
};

delay = function(t, f) {
  return setTimeout(f, t);
};

playing = void 0;

soundManager.url = './lib/sm2/swf';

render = function(user, item) {
  var auther;
  auther = item.member[0];
  $('#cover').attr('src', "./data/feel/" + auther + "/head.jpg");
  $('#dj-avatar').attr('src', "./data/feel/" + auther + "/face.jpg");
  $('#dj-name').text(user.nickname);
  $('#dj-name').attr('href', "dj/page/index.html#" + auther);
  $('#program-intro').text(item.intro);
  $('#dj-intro').text(user.intro);
  return $('#sina').attr('href', user['weibo-url']);
};

soundManager.onload = function() {
  var elem, hash;
  hash = String(location.hash);
  elem = $(hash);
  if (elem.length > 0) {
    return elem.click();
  } else {
    return $('#inside').children().first().click();
  }
};

$(function() {
  var bind_program, use_pause_icon, use_play_icon;
  $('#progress').hide();
  $('#ctrl').hide();
  use_play_icon = function() {
    return $('#toggle').attr('src', './pic/ctrl/play.png');
  };
  use_pause_icon = function() {
    return $('#toggle').attr('src', './pic/ctrl/pause.png');
  };
  bind_program = function(elem, item) {
    return elem.click(function(event) {
      var auther, sound;
      $('#progress').fadeIn();
      $('#ctrl').fadeIn();
      $('.last').removeClass('last');
      elem.addClass('last');
      auther = encodeURI(item.member[0]);
      $.getJSON("./data/feel/" + auther + "/detail.json", function(user) {
        return render(user, item);
      });
      try {
        playing.stop();
      } catch (_error) {}
      sound = {
        id: item.number,
        url: "./data/mp3/" + item.number + ".mp3",
        whileplaying: function() {
          var percent;
          percent = playing.position / playing.duration * 100;
          $('#step').css('width', "" + percent + "%");
          if (percent > 99) {
            return use_play_icon();
          }
        },
        onplay: use_pause_icon,
        onresume: use_pause_icon,
        onpause: use_play_icon,
        onstop: function() {
          return use_play_icon;
        },
        onfinish: function() {
          return $(".last").next().click();
        }
      };
      playing = soundManager.createSound(sound);
      try {
        return playing.play();
      } catch (_error) {}
    });
  };
  $.getJSON('./data/list.json', function(list) {
    $.each(list, function(i) {
      var elem, item, number, place, _ref;
      item = list[i];
      number = String(item.number);
      place = $("#inside");
      if ((_ref = number.slice(0, 3)) === "000" || _ref === "001") {
        place = $("#insidelist");
      }
      elem = $("<div class='program' id='" + number + "'>" + item.name + "</div>");
      place.append(elem);
      return bind_program(elem, item);
    });
    $(".nano").nanoScroller();
    $("#slide").click();
    return $('#inside').children().first().click();
  });
  $.getJSON("./data/interview.json", function(list) {
    $.each(list, function(i) {
      var elem, item, number, record;
      item = list[i];
      number = String(item.number);
      elem = $("<div class='program' id='" + number + "'>" + item.name + "</div>");
      record = $("#record");
      record.append(elem);
      return bind_program(elem, item);
    });
    return $(".nano").nanoScroller();
  });
  $('#program span').click(function() {
    return $('#drop').slideToggle();
  });
  $('#top10 span').click(function() {
    return $('#some').slideToggle();
  });
  $('#toggle').click(function() {
    var src;
    src = $('#toggle').attr('src');
    if (playing != null) {
      if (src.indexOf('pause') > 0) {
        playing.togglePause();
        return use_play_icon();
      } else {
        playing.togglePause();
        return use_pause_icon();
      }
    }
  });
  $('#progress').click(function(event) {
    var base, percent, reach, whole;
    if (playing != null) {
      base = $('#progress').offset().left;
      reach = event.pageX;
      whole = $('#progress').width();
      percent = (reach - base) / whole;
      return playing.setPosition(percent * playing.duration);
    }
  });
  $('#backward').click(function() {
    if (playing != null) {
      return playing.setPosition(playing.position - playing.duration * 0.1);
    }
  });
  $('#forward').click(function() {
    if (playing != null) {
      return playing.setPosition(playing.position + playing.duration * 0.1);
    }
  });
  return $('#slide').click(function() {
    var w;
    w = $('#list').width();
    return $("#list").animate({
      width: "toggle"
    });
  });
});
