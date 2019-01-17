function hideEverything() {
  $("#verified").hide();
  $("#blocked").hide();
  $("#neutral").hide();
  $("#help").hide();
}


window.addEventListener("load", function() {
  $('.search-btn').click(function() {
      var encodedSearch = encodeURIComponent($("input").val().replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0]);
      var secondEncodedSearch = encodeURI($("input").val().toLowerCase().replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0]);
      $.getJSON("https://api.cryptoscamdb.org/v1/check/" + encodedSearch, function(result) {
        if (result.success) {
          if (result.result.status === 'verified') {
              hideEverything();
              var strLinkVerified = '';
              $("#verifiedmessage").html('<b>' + secondEncodedSearch + '</b> is a verified domain. You can trust the contents.');
              strLinkVerified = '<a id="details" href="/domain/' + encodeURI($("input").val()) + '">Details on this domain <i class="chevron right small icon"></i></a>';
              $("#verifiedmessage").html($("#verifiedmessage").html() + ' ' + strLinkVerified);
              $("#verified").css('display', 'flex');
          } else if (result.result.status === 'neutral') {
              hideEverything();
              var strLinkNeutral = '';
              if(result.result.type === 'address'){
                $.getJSON("https://api.cryptoscamdb.org/v1/coininfo/" + result.coin, function(coininfo) {
                  $("#neutralmessage").html('<b>' + secondEncodedSearch + '</b> wasn\'t a recognized ' + result.coin + ' address.');
                  strLinkNeutral = '<a id="details" target="_blank" href="' + coininfo.result.blockExplorer + $("input").val() + '">View this address on a block explorer <i class="chevron right small icon"></i></a>';
                  $("#neutralmessage").html($("#neutralmessage").html() + ' ' + strLinkNeutral);
                  $("#neutral").css('display', 'flex');
                });
              }
              else{
                  $("#neutralmessage").html('<b>' + secondEncodedSearch + '</b> wasn\'t recognized as a malicious domain, nor as verified domain. Be careful!');
                  strLinkNeutral = '<a id="details" href="/domain/' + encodeURI($("input").val()) + '">Details on this domain <i class="chevron right small icon"></i></a>';
                  $("#neutralmessage").html($("#neutralmessage").html() + ' ' + strLinkNeutral);
                  $("#neutral").css('display', 'flex');
              }
          } else if (result.result.status === 'whitelisted') {
              hideEverything();
              var strLinkWhitelisted = '';
              $("#verifiedmessage").html('<b>' + secondEncodedSearch + '</b> is a whitelisted address. You can trust it.');
              strLinkWhitelisted = '<a id="details" href="/address/' + encodeURI($("input").val()) + '">Details on this address <i class="chevron right small icon"></i></a>';
              $("#verifiedmessage").html($("#verifiedmessage").html() + ' ' + strLinkWhitelisted);
              $("#verified").css('display', 'flex');
          } else if (result.result.status === 'blocked') {
              hideEverything();
              blocked = true;
              var strLinkBlocked = '';
              if (result.result.type === 'domain' && 'category' in result.result.entries[0]) {
                  $("#blacklistmessage").html('<b>' + secondEncodedSearch + '</b> was put on the blacklist for ' + result.result.entries[0].category.toLowerCase() + '.');
                  strLinkBlocked = '<a id="details" href="/domain/' + encodeURI($("input").val()) + '">Details on this domain <i class="chevron right small icon"></i></a>';
              } else if(result.result.type === 'address') {
                  $("#blacklistmessage").html('<b>' + encodeURI($("input").val().toLowerCase()) + ' was put on the blacklist and is associated with '+ result.result.entries.length +' blocked domain(s).');
                  strLinkBlocked = '<a id="details" href="/address/' + encodeURI($("input").val()) + '">Details on this address <i class="chevron right small icon"></i></a>';
              } else if(result.result.type === 'ip') {
                  $("#blacklistmessage").html('<b>' + secondEncodedSearch + '</b> was put on the blacklist and is associated with '+ result.result.entries.length +' blocked domain(s)');
                  strLink = '<a id="details" href="/ip/' + encodeURI($("input").val()) + '">Details on this domain <i class="chevron right small icon"></i></a>';
              }
              $("#blacklistmessage").html($("#blacklistmessage").html() + ' ' + strLinkBlocked);
              $("#blocked").css('display', 'flex');
          }
        } else {
          hideEverything();
          strLink = 'Error: ' + result.message + '.'
          $("#helpmessage").html($("#helpmessage").html() + '<br>' + strLink);
          $("#help").css('display', 'flex');
        }
      });
  });
});
