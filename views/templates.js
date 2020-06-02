"use strict";
/**
 * This file have templates for response in Payload
 * :D
 * 
 * 
 */

module.exports = class Templates {
  /**
   * @description Generic template for Payload
   * @param {string} title Title String
   * @param {string} subtitle Subtitle String
   * @param {string} image_url Image URL
   * @param {buttons[]} buttons List of Buttons in template
   * 
  */
 static CardTemplate(list_cards) {
  let template = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: []
      }
    }
  };
  if (list_cards !=  undefined) {
    for (let card of list_cards) {
      let newCard = {};
      newCard.title = card.title;
      newCard.subtitle = card.subtitle;
      newCard.image_url = card.image_url;
      if (list_button != undefined) {
        console.log('button');
        for (let button of card.buttons) {
          newCard.buttons.push(button);
        }
      }
      template.attachment.payload.elements.push(newCard);
    }
  }
  return template;
}
  // static CardTemplate(title, subtitle, image_url, list_button) {
  //   let template = {
  //     attachment: {
  //       type: "template",
  //       payload: {
  //         template_type: "generic",
  //         elements: [
  //           {
  //             title: title,
  //             subtitle: subtitle,
  //             image_url: image_url,
  //             buttons: []
  //           }
  //         ]
  //       }
  //     }
  //   };
  //   if (list_button != undefined) {
  //     console.log('button');
  //     for (let button of list_button) {
  //       template.attachment.payload.elements[0].buttons.push(button);
  //     }
  //   }
  //   return template;
  // }

  static QuickRepliesTemplate(text, content_type) {
    let template = {
      text: text,
      quick_replies: [
      {
        content_type:content_type
      }]
    }
    return template;
  }

  static TextTemplate(text) {
    let template = {
      text: text
    }
    return template;
  }

  static QuickReplies(text, quickReplies) {
    let template = {
        text: text,
        quick_replies: []
      }
     for (let quickReply of quickReplies) {
        template.quick_replies.push({
          content_type: 'text',
          title: quickReply['title'],
          payload: quickReply['payload']
        });
      }
    return template;
  }

  // static emailTemplate() {
  //   let template = {
  //     text: 'Selecciona tu correo de lo contrario digitalo por favor',
  //     quick_replies: [
  //     {
  //       content_type:"user_email"
  //     }]
  //   }
  //   return template;
  // }
}
