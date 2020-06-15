"use strict";
/**
 * This file contains the response messages assigned to each intents.
 */
const template = require('./templates');

// Links of images used in the Card
const imageWelcomeUser = 'https://static.iris.net.co/dinero/upload/images/2019/8/22/275964_1.jpg';

//  Links of images used in the Location User
const imageMedellin = 'https://medellin.travel/wp-content/uploads/2018/10/Plaza-Botero3.jpg';
const imagePereira = 'https://blogapi.uber.com/wp-content/uploads/2017/06/viaducto-pereira-panoramio.jpg';

// links of image for webview
const imageWeb = 'http://www.suppliescolombia.com/wp-content/uploads/2019/04/AimentosYBebidas.png';

module.exports = class Messages {

    WelcomeUser (body) {
        // change to ""
        let dinamycGreet = " Bienvenido";
        // genderData = JSON.parse(genderData)
        // if (genderData.gender == "male") {
        //     dinamycGreet = " Bienvenido🖐";
        // } else {
        //     dinamycGreet = " Bienvenida🖐";
        // }
        return template.CardTemplate(
            [{
                title: body.first_name + dinamycGreet,
                subtitle: `Soy el asistente de EnTuBarrio y te ayudare a hacer tu pedido 🏡🚴`,
                image_url: imageWelcomeUser,
                buttons: [{
                    title: 'Pedir Orden',
                    type: 'postback',
                    payload: 'comenzar',
                },{
                    title: 'Soporte',
                    type: 'postback',
                    payload: 'soporte',
                }]
            }]);
    };

    LocationUser () {
        return template.CardTemplate(
            [{
                title: 'Medellín',
                subtitle: 'Selecciona tu barrio',
                image_url: imageMedellin,
                buttons: [{
                    title: 'Poblado',
                    type: 'postback',
                    payload: 'Medellín-poblado',
                },{
                    title: 'Ciudad del Rio',
                    type: 'postback',
                    payload: 'Medellín-ciudad del rio',
                }]
            },{
                title: 'Pereira',
                subtitle: 'Selecciona tu barrio',
                image_url: imagePereira,
                buttons: [{
                    title: 'Macarena',
                    type: 'postback',
                    payload: 'Pereira-macarena',
                },{
                    title: 'Castilla',
                    type: 'postback',
                    payload: 'Pereira-castilla',
                }
                ]}
            ]);
    }

    AddresHouse () {
        return template.TextTemplate(
            'Por favor indicanos la dirección de tu Casa'
        );
    }

    PhoneNumber () {
        return template.QuickRepliesTemplate(
            'Por favor indicanos tu número de Celular 📱',
            'user_phone_number'
        );
    }

    EmailUser () {
        return template.QuickRepliesTemplate(
            'Por favor indicanos tu email 📬',
            'user_email'
        );
    }

    AddressUser (list_address) {
        let buttons = [];
        let dataButton = {};
        for (let address of list_address) {
            dataButton = {title: address, payload:"Address"};
            buttons.push(dataButton);
            dataButton = {};
        }
        buttons.push({title:"Otra", payload:"newAddress"});
        return template.QuickReplies(
            'A que dirección deseas que llevemos tu pedido:',
            buttons
            );
    };

    OrderUser () {
        return template.CardTemplate(
            [{
                title: 'Ir a la tienda',
                subtitle: '🏡',
                image_url: imageWeb,
                buttons: [{
                    title: 'Hacer pedido',
                    type: 'web_url',
                    url: "https://entubarrio.co/crear_pedido/",
                    webview_height_ratio: 'tall',
                    messenger_extensions: true               
                }]
            }]
        );
    };

    OrderStatus (msg, url) {
        return template.CardTemplate(
            [{
                title: msg,
                subtitle: `Para ver el estado del pedido, presiona el boton.`,
                image_url: url,
                buttons: [{
                    title: 'Estado',
                    type: 'postback',
                    payload: 'Estado',
                },{
                    title: 'Chat Vecino Autorizado 💬',
                    type: 'web_url',
                    url: "https://chatentubarrio.herokuapp.com/",
                    webview_height_ratio: 'tall',
                    messenger_extensions: true   
                }]
            }]);

    };

    OrderReceipt () {
        return template.CardReceipt ();
    }
}