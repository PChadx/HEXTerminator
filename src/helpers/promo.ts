 
    const text = 'Powered by';
 
    const textlink = 'HEX Community';
  
    const link = 'https://HEX.com/';
 

function promoFromStruct (text, textlink, link) {
  return `\n\n${text} <a href="${link}">${textlink}</a>`
}

export const promoAdditions = {
  en: () => promoFromStruct(text, textlink, link),
}


export const promoExceptions = [
//  -1001000000000, //add groups here.
]


/**
function promoFromStructWithoutHtml (promo) {
  const text = promo.links.reduce(
    (s, item) => s + item.prefix + item.text + item.postfix,
    promo.prelinks,
  ) + promo.postlinks;

  let s = promo.prelinks.length;
  return {
    text,
    links: promo.links.map(item => {
      s += (item.prefix.length + item.text.length + item.postfix.length);
      return {
        offset: s - (item.text.length + item.postfix.length),
        length: item.text.length,
        link: item.link,
      };
    }),
  }
}
 */



/*
export const promoAdditionsWithoutHtml = {
  en: (rand) => promoFromStructWithoutHtml(enPromoAdditionsArray[Math.trunc(rand * enPromoAdditionsArray.length)]),
}
*/
