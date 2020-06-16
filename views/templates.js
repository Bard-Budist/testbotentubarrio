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

  static CardReceipt(name_User, order_number, address) {
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
          address:{
            street_1:street,
            street_2:"",
            city:city,
            postal_code:"050021",
            state:"Ant",
            country:"COL"
          },
          summary:{
            subtotal:7500,
            shipping_cost:0,
            total_tax:0,
            total_cost:8500
          },
          adjustments:[
            {
              name:"New Customer Discount",
              amount:20
            },
            {
              name:"Costos de Envio",
              amount:1000
            }
          ],
          elements:[
            {
              title:"Gaseosa Coca-Cola",
              subtitle:"1.5 Litros",
              quantity:1,
              price:5000,
              currency:"USD",
              image_url:"https://metrocolombiafood.vteximg.com.br/arquivos/ids/251879-400-400/7702535005941.jpg?v=637115014244030000"
            },
            {
              title:"Doritos",
              subtitle:"150 g",
              quantity:1,
              price:1500,
              currency:"USD",
              image_url:"https://jumbocolombiafood.vteximg.com.br/arquivos/ids/3484386-1000-1000/7702189045782.jpg?v=637175561819070000"
            }
          ]
        }
    }
  }
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
