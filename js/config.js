// Tus IDs de Amazon Afiliados, uno por tienda. Cada visitante va a la tienda de su país (según su zona horaria);
// si su país no está aquí, va a la principal. Un tag vacío = enlaces sin comisión.
window.CONFIG = {
  principal: 'es',
  tiendas: {
    es: { dominio: 'www.amazon.es', tag: 'bestfinds0c06-21', idioma: 'es' },
    us: { dominio: 'www.amazon.com', tag: 'bestfinds07cb-20', idioma: 'en' }
  }
};
