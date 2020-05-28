"use strict";
/**
 * This file contains the response messages assigned to each intents.
 */
const template = require('./templates');

// Links of images used in the Card
const imageWelcomeUser = 'https://lh3.googleusercontent.com/proxy/GcA6CqAzJ94Q8GMS9RgKYkys-xXNX93K_JC0b8VuXj7oMcDcztpAX1hOZlZNfyEDQYyi12jwPBRqx1jkSuPtrl9XulREZF13ItQa2tkSWbxwfQBmQjVRqdkVNBz59ydfGWlCI8c_r4yCsgkzr4FyOagndcB1CQAhHglk6Y7nWgm_mtZjexI';

//  Links of images used in the Location User
const imageMedellin = 'https://medellin.travel/wp-content/uploads/2018/10/Plaza-Botero3.jpg';
const imagePereira = 'https://blogapi.uber.com/wp-content/uploads/2017/06/viaducto-pereira-panoramio.jpg';

module.exports = class Messages {

    WelcomeUser (body) {
        return template.CardTemplate(
            body.first_name + ` Bienvenido`,
            '👵 Soy el asistente de EnTuBarrio y te ayudare a hacer tu pedido \
            en la tienda mas cercana. Te lo llevamos a la puerta de tu casa. 🏡🚴',
            imageWelcomeUser,
            [{
                title: 'Pedir Orden',
                type: 'postback',
                payload: 'comenzar',
            },{
                title: 'Soporte',
                type: 'postback',
                payload: 'soporte',
            }]);
    };

    LocationUser () {
        return [template.CardTemplate(
            'Medellín',
            'Selecciona tu barrio',
            imageMedellin,
            [{
                title: 'Poblado',
                type: 'postback',
                payload: 'poblado',
              },{
                title: 'Ciudad del Rio',
                type: 'postback',
                payload: 'ciudad del rio',
              }]),
        template.CardTemplate(
            'Pereira',
            'Selecciona tu barrio',
            imagePereira,
            [{
                title: 'Macarena',
                type: 'postback',
                payload: 'macarena',
              },{
                title: 'Castilla',
                type: 'postback',
                payload: 'castilla',
              }])];
    }
}