"use strict";
/**
 * This file contains the response messages assigned to each intents.
 */
const template = require('./templates');

// Links of images used in the Card
const imageWelcomeUser = 'https://static.iris.net.co/dinero/upload/images/2019/8/22/275964_1.jpg';

//  Links of images used in the Location User
const imageMedellin = 'https://braavosconcierge.com/wp-content/uploads/2016/11/Medellin.png';
const imagePereira = 'https://i2.wp.com/blog.soyrappi.com/wp-content/uploads/2020/01/Pereira.jpg?fit=900%2C605&ssl=1';

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
        return [
            template.TextTemplate(
            '¡Hola, ' + body.first_name + '! Te damos la Bienvenida a EnTuBarrio, aquí podras hacer tus compras en tu tienda más cercana.'
            ),
            template.CardTemplate(
            [{
                title: 'EnTuBarrio',
                subtitle: `❤️ Creado con Amor para los negocios locales`,
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
            }])
        ]
    }

    LocationUser () {
        return [
            template.TextTemplate(
            'Puedes buscar tu Ciudad y seleccionar tu barrio'
            ),
            template.CardTemplate(
            [{
                title: 'Medellín',
                subtitle: 'Selecciona tu barrio',
                image_url: imageMedellin,
                buttons: [{
                    title: 'Belén',
                    type: 'postback',
                    payload: 'Medellín-belen',
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
                    title: 'Villa Castilla',
                    type: 'postback',
                    payload: 'Pereira-castilla',
                }
                ]}
            ])
        ]
    }

    AddresHouse () {
        return template.TextTemplate(
            'A que dirección deseas que llevemos tu pedido'
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
                }]
            }]);
        };
        
        OrderStatusChat (msg, url) {
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

            OrderStatusEnd (msg, url) {
                return template.CardTemplate(
                    [{
                        title: msg,
                        subtitle: `Para ver el estado del pedido, presiona el boton.`,
                        image_url: url,
                        buttons: []
                    }]);
                };

    OrderReceipt (dataUser, order_number, products, url) {
        return [template.CardReceipt(
            dataUser.client.name,
            order_number,
            dataUser.client.address,
            products,
        ),
        template.CardTemplate(
            [{
                title: "Nuestro tendero esta seleccionando todo lo que necesitas 🍅🛒",
                subtitle: `Para ver el estado del pedido, presiona el boton.`,
                image_url: url,
                buttons: [{
                    title: 'Estado',
                    type: 'postback',
                    payload: 'Estado',
                }]
            }])
        ]
    };
}