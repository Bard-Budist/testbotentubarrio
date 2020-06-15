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

  static CardReceipt() {
    let template = {
      attachment:{
        type:"template",
        payload:{
          template_type:"receipt",
          recipient_name:"Stephane Crozatier",
          order_number:"12345678902",
          currency:"USD",
          payment_method:"Visa 2345",        
          order_url:"http://petersapparel.parseapp.com/order?order_id=123456",
          timestamp:"1428444852",         
          address:{
            street_1:"1 Hacker Way",
            street_2:"",
            city:"Menlo Park",
            postal_code:"94025",
            state:"CA",
            country:"US"
          },
          summary:{
            subtotal:75.00,
            shipping_cost:4.95,
            total_tax:6.19,
            total_cost:56.14
          },
          adjustments:[
            {
              name:"New Customer Discount",
              amount:20
            },
            {
              name:"$10 Off Coupon",
              amount:10
            }
          ],
          elements:[
            {
              title:"Classic White T-Shirt",
              subtitle:"100% Soft and Luxurious Cotton",
              quantity:2,
              price:50,
              currency:"USD",
              image_url:"http://petersapparel.parseapp.com/img/whiteshirt.png"
            },
            {
              title:"Classic Gray T-Shirt",
              subtitle:"100% Soft and Luxurious Cotton",
              quantity:1,
              price:25,
              currency:"USD",
              image_url:"http://petersapparel.parseapp.com/img/grayshirt.png"
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
