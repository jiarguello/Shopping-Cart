function totaldoCarrinho(valor) {
  let 
  
  if (valor === undefined) {

  }
  
  let total = total + valor

  return total
}

const createTotalPrice = () => {
  const whereTotalPrice = document.querySelector('.cart');

  if (document.querySelectorAll('.total-price').length === 0) {
    const totalPrice = document.createElement('span');
    totalPrice.classList.add('total-price');
    totalPrice.innerText = '0';

    whereTotalPrice.appendChild(totalPrice);
  }
};

// const updatePrice = (price) => {
//   const whereTotalPrice = document.querySelector('.total-price');
//   const newTotal = Number(price) + Number(whereTotalPrice.innerText);

//   whereTotalPrice.innerText = `${newTotal}`;
// };

  // whereTotalPrice.innerText = `${Number(whereTotalPrice.innerText) - Number(clickedItem.substring(clickedItem.indexOf('$') + 1))}`;
  // whereTotalPrice.innerText = `O valor total do carrinho é de ${newPrice.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}`;

const updatePrice = (price) => {
  const whereTotalPrice = document.querySelector('.total-price');
  const oldTotalString = whereTotalPrice.innerText;

  if(oldTotalString.length === 1) {
    return whereTotalPrice.innerText = `O valor total do carrinho é de ${price.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}`;
  }
  
  const oldTotal = oldTotalString.substring(oldTotalString.indexOf('$') + 2).replace('.','').replace(',','.');
  console.log(oldTotal)
  const newTotal = Number(price) + Number(oldTotal);
  whereTotalPrice.innerText = `O valor total do carrinho é de ${newTotal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}`;
};

const loadingMessage = () => {
  const localOfMessage = document.querySelector('.items');

  const message = document.createElement('p');
  message.classList.add('loading');
  message.innerText = 'loading...';

  localOfMessage.appendChild(message);
};

function cartItemClickListener(event) {
  const whereTotalPrice = document.querySelector('.total-price');
  const clickedItem = event.target.innerText;
  const oldTotalString = whereTotalPrice.innerText;

  const oldTotal = oldTotalString.substring(oldTotalString.indexOf('$') + 2).replace('.','').replace(',','.');
  const newTotal = Number(oldTotal) - Number(clickedItem.substring(clickedItem.indexOf('$') + 1))
  // Como extrair final texto foi retirado do link abaixo.
  // https://www.devmedia.com.br/javascript-substring-selecionando-parte-de-uma-string/39232
  if(newTotal === 0) {
    document.querySelector('.total-price').remove();
  }

  whereTotalPrice.innerText = `O valor total do carrinho é de ${newTotal.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}`

  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `Cód: ${sku} | Nome: ${name} | Preço: R$${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const returnOfAPIItem = async (idItem) => {
  const endPointItem = `https://api.mercadolibre.com/items/${idItem}`;

  fetch(endPointItem)
    .then(obj => obj.json())
    .then(({ id: sku, title: name, price: salePrice }) => {
      const shoppingCart = document.querySelector('.cart__items');
      createTotalPrice();
      updatePrice(salePrice);
      return (shoppingCart.appendChild(createCartItemElement({ sku, name, salePrice })));
    });
};

const buttonAddToCartListenner = () => {
  const listOfButtons = document.querySelectorAll('.item__add');
  const buttonEmptCart = document.querySelector('.empty-cart');

  listOfButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      returnOfAPIItem(event.target.parentNode.firstChild.innerText);
      buttonEmptCart.innerText = "Esvaziar carrinho"
    });
  });
};

const clearShoppingCartButton = () => {
  const buttonEmptCart = document.querySelector('.empty-cart');
  const listOfItemsOfCart = document.querySelector('.cart__items');

  buttonEmptCart.addEventListener('click', () => {
    buttonEmptCart.innerText = "Carrinho vazio"
    listOfItemsOfCart.innerHTML = '';
    document.querySelector('.total-price').remove();
  });
};

const searchProductButton = () => {
  const searchButton = document.querySelector('.search-button');
  const productToSearch = document.querySelector('.input-product');

  searchButton.addEventListener("click", function(event) {
    returnOfAPIList(`${productToSearch.value}`)
    event.preventDefault();
  })

}

const returnOfAPIList = async (product) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;

  const retrieveOfAPI = await fetch(endPoint)
    .then(response => response.json())
    .then(object => object.results)
    .catch(error => console.log(error));

  document.querySelector('.items').innerText = '';
  retrieveOfAPI.forEach((element) => {
    const objectItems = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };

    const newItem = createProductItemElement(objectItems);
    document.querySelector('.items').appendChild(newItem);
  });
  buttonAddToCartListenner();
  clearShoppingCartButton();
  searchProductButton();
};

window.onload = function onload() {
  returnOfAPIList('computador');
  loadingMessage();
};
