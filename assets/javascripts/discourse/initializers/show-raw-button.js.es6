import PostMenuComponent from 'discourse/components/post-menu';
import { Button } from 'discourse/components/post-menu';

export default {
  name: 'show-raw-button',
  initialize: function() {
    PostMenuComponent.registerButton(function(visibleButtons){
      if (this.get('collapsed')) { return; }
      var position = visibleButtons.length - 2;
      visibleButtons.splice(position,0,new Button('showRawPost', 'show-raw-button.button_text', 'code', {className: 'raw-button'}));
    });

    PostMenuComponent.reopen({
      clickShowRawPost: function(post){
        var topicID = post.topic_id,
            postID =  post.post_number,
            postArea = $("article[data-post-id='"+post.id+"'] div.contents"),
            $rawButton = $(this.element).find("button.raw-button")

        if (postArea.find('.show-raw-area').length == 0){
          var postArea_raw_content = $('<pre class="show-raw-area"></pre>'),
              cooked = postArea.find('.cooked');

          cooked.after(postArea_raw_content);

          $.get('/raw/' + topicID + '/' + postID) .done(function (content) {
            postArea_raw_content.addClass("active");
            $rawButton.addClass("active");
            postArea_raw_content.css({"white-space":"pre-wrap", 'border':'2px dashed #E7E7E7','padding':'3px'}) .text(content);
            cooked.hide();
          });
        } else {
          var postArea_raw_content = postArea.find('.show-raw-area');
          if ( !postArea_raw_content.hasClass("active") ){  //raw no active
            postArea.find('.cooked').hide();
            postArea.find('.show-raw-area').show();
            postArea_raw_content.addClass("active");
            $rawButton.addClass("active");
          } else{
            postArea.find('.cooked').show();
            postArea.find('.show-raw-area').hide();
            postArea_raw_content.removeClass("active");
            $rawButton.removeClass("active");
          }
        }
      }
    });
  }
};
