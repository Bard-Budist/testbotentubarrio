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
  static normalTemplate(title, subtitle, image_url, list_button) {
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


  static cardTemplate() {
    
  }
}
