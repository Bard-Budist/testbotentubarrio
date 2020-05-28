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
  static CardTemplate(title, subtitle, image_url, list_button) {
    let template = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              buttons: []
            }
          ]
        }
      }
    };
    if (list_button != undefined) {
      for (let button of list_button) {
        template.attachment.payload.elements[0].buttons.push(button);
      }
    }
    return template;
  }


  static numberTemplate() {
    let template = {
      text: 'Para que nuestro vecino autorizado pueda comunicarce con tigo por favor selecciona tu úmero de celular,\
            de lo contrario digitalo',
      quick_replies: [
      {
        content_type:"user_phone_number"
      }]
    }
    return template;
  }

  static emailTemplate() {
    let template = {
      text: 'Selecciona tu correo de lo contrario digitalo por favor',
      quick_replies: [
      {
        content_type:"user_email"
      }]
    }
    return template;
  }
}
