"use strict";
/**
 * This file have templates for response in Payload
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
      if (card.buttons != undefined) {
        console.log('button');
        newCard.buttons = [];
        for (let button of card.buttons) {
          newCard.buttons.push(button);
        }
      }
      template.attachment.payload.elements.push(newCard);
    }
  }
    return template;
  }

  static CardReceipt(name_User, order_number, address, list_products) {
    const listProducts = JSON.parse(list_products);
    const city = address.split('/')[0];
    const street = address.split('/')[1];
    let template = {
      attachment:{
        type:"template",
        payload:{
          template_type:"receipt",
          recipient_name:name_User,
          order_number:order_number,
          currency:"USD",
          payment_method:"Contra Entrega",
          order_url:"http://petersapparel.parseapp.com/order?order_id=123456",
          timestamp:"1428444852",         
          // address:{
          //   street_1:street,
          //   street_2:"",
          //   city:city,
          //   postal_code:"050021",
          //   state:"Ant",
          //   country:"COL"
          // },
          summary:{
            subtotal:7500,
            // shipping_cost:0,
            // total_tax:0,
            total_cost:
          },
          adjustments:[
            {
              name:"Costos de Envio",
              amount:1000
            }
          ],
          elements:[]
        }
    }
  };
  let total = 0;
  if (listProducts !=  undefined) {
    for (let product of listProducts) {
      console.log(product);
      let newCard = {};
      newCard.title = product.name;
      newCard.quantity = product.quantity;
      newCard.price = product.price;
      const price = parseInt(product.price);
      total += price;
      // newCard.image_url = card.image_url;
      template.attachment.payload.elements.push(newCard);
    }
  };
  template.attachment.payload.summary.total_cost= total;
  console.log('TOTAL --------->: ', total);
  return template;
}

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
}
