class Cart {
    constructor() {
        this.countGoods = 0; //Общее количество товаров в корзине
        this.amount = 0; // общая стоимость товаров
        this.cartItems = []; //массив с товарами
    }

    addProduct(element) {

            console.log(element);
            console.log(this.cartItems);
            let productId = +$(element).data('id');
            let find = this.cartItems.find(product => product.id === productId);
            if (find) {
                find.quantity++;
                //this.countGoods++;
                this._countGoodsCounter();
                //this.amount += find.price;
                this._amountCounter();
                $(`.cart-header[data-id = ${productId}]`).remove();
                this._renderCartInCartPage(find);

            } else {
                let product = {
                    id: productId,
                    price: +$(element).data('price'),
                    quantity: 1,
                    productImgSrc: $(element).data('productimgsrc'),
                    alt: $(element).data('alt'),
                    name: $(element).data('name'),
                    color: $(element).data('color'),
                    size: $(element).data('size'),
                    shippingTerms: $(element).data('shippingterms')
                };
                this.cartItems.push(product);
                //this.countGoods += product.quantity;
                this._countGoodsCounter();
                //this.amount += product.price;
                this._amountCounter();
                this._renderCartInCartPage(product);

                $('.cart-header').off('click').on('click', '.delete-button', e => {
                    console.log(e.target);
                    let productId = +e.target.closest('.cart-header').dataset.id;
                    let find = this.cartItems.find(product => product.id === productId);
                    console.log(find);
                    this.cartItems.splice(this.cartItems.indexOf(find), 1);
                    this._countGoodsCounter();
                    this._amountCounter();
                    console.log(this.cartItems);
                    e.target.closest('.cart-header').remove();
                    localStorage.setItem('myCart', JSON.stringify(this.cartItems));
                    localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
                    localStorage.setItem('amount', JSON.stringify(this.amount));
                    myCart._renderTotalSum();
                    myCart._render();
                });

                $('.cart-header').on('click', '.quantityInputForm', function (event) {
                    $('.quantityInputForm:focus').on('input', () => {
                        let $newQuantity = +$('.quantityInputForm:focus').val();

                        let productId = +event.target.closest('.cart-header').dataset.id;
                        console.log(productId);

                        let find = myCart.cartItems.find(product => product.id === productId);
                        find.quantity = $newQuantity;
                        console.log(myCart.cartItems);

                        let $getProductPrice = +$('.quantityInputForm:focus')
                            .closest('.info-properties')
                            .find('.price')
                            .text()
                            .replace(/\D+/g, "");

                        $('.quantityInputForm:focus')
                            .closest('.info-properties')
                            .find('.subtotal')
                            .text('$' + $newQuantity * $getProductPrice);
                        myCart._countGoodsCounter();
                        myCart._amountCounter();
                        localStorage.setItem('myCart', JSON.stringify(myCart.cartItems));
                        localStorage.setItem('countGoods', JSON.stringify(myCart.countGoods));
                        localStorage.setItem('amount', JSON.stringify(myCart.amount));
                        myCart._renderTotalSum();

                    });
                });
            }
            localStorage.setItem('myCart', JSON.stringify(this.cartItems));
            localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
            localStorage.setItem('amount', JSON.stringify(this.amount));
            this._render();
    }

    //Отрисовка количества товаров в корзине в маленьком красном кружочке
    _render() {
        let $cartAmountLabel = $('#amount-in-cart');
        $cartAmountLabel.removeClass('invisible');
        $cartAmountLabel.text(`${this.cartItems.length}`);
    }

    //Выгрузка списка товаров из json-файла
    cartRender(jsonLink) {
        if (!localStorage.getItem('myCart')) {
            fetch(jsonLink)
                .then(result => result.json())
                .then(data => {
                    for (let product of data) {
                        this.cartItems.push(product);
                        this._render();
                        if ($('title').text() === 'Shopping-cart' || $('title').text() === 'Product'
                            || $('title').text() === 'Single page' || $('title').text() === 'Index') {
                            this._renderCartInCartPage(product);
                        }
                    }
                    this._countGoodsCounter();
                    this._amountCounter();
                    localStorage.setItem('myCart', JSON.stringify(this.cartItems));
                    localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
                    localStorage.setItem('amount', JSON.stringify(this.amount));
                });
        } else {
            this.cartItems = JSON.parse(localStorage.getItem('myCart'));
            for (let product of this.cartItems){
                this._render();
                if ($('title').text() === 'Shopping-cart' || $('title').text() === 'Product'
                    || $('title').text() === 'Single page' || $('title').text() === 'Index') {
                    this._renderCartInCartPage(product);
                }
            }
            this._countGoodsCounter();
            this._amountCounter();
            this.countGoods = JSON.parse(localStorage.getItem('countGoods'));
            this.amount = JSON.parse(localStorage.getItem('amount'));
        }
    }

    _renderCartInCartPage(product) {
        let $container = $('#cart-container');  //Сюда добавляются товары по порядку
        let $cartItem = $('<div/>', {
            class: 'container cart-header',
            'data-id': product.id
        });                                     //Обёртка для одного товара в корзине
        let $cartItemLeftPart = $('<div/>', {
            class: 'cart-header-left product-in-cart'
        });                                     //Левая часть верстки товара в корзине

        let $cartItemImgDiv = $('<div/>', {
            class: 'prod-image'
        });                                     //Обертка для изображения товара в корзине
        let $cartItemImg = $('<img/>', {
            src: `${product.productImgSrc}`,
            alt: `${product.alt}`
        });                                     //Непосредственно картинка товара

        let $cartItemNameColorSize = $('<div/>', {
            class: 'name-color-size'
        });                                     //Обертка для блока ИмяТовара-Цвет-Размер

        let $cartItemName = $('<div/>', {
            class: 'chr-legend',
            text: product.name
        });                                     //Блок ИмяТовара, само имя вставить из json

        let $cartItemColorSize = $('<div/>', {
            class: 'color-size'
        });                                     //Блок Цвет-Размер товара

        let $cartItemTitleColor = $('<span/>', {
            class: 'pic-color',
            text: 'Color: '
        });                                     //Надпись Color

        let $cartItemColor = $('<span/>', {
            class: 'pic-color-name',
            text: product.color
        });                                     //Цвет товара - вставить из json

        let $cartItemTitleSize = $('<span/>', {
            class: 'pic-color',
            text: 'Size: '
        });                                     //Надпись Size

        let $cartItemSize = $('<span/>', {
            class: 'pic-color-name',
            text: product.size
        });                                     //Размер товара - вставить из json

        //Выше описаны детали левой части товара


        let $cartItemRightPart = $('<div/>', {
            class: 'cart-header-right info-properties'
        });                                     //Правая часть верстки товара в корзине

        let $cartItemPrice = $('<div/>', {
            class: 'chr-legend price',
            text: '$' + product.price
        });                                     //Цена товара, вставить из json

        let $cartItemQuantityBlock = $('<div/>', {
            class: 'chr-legend quantity'
        });                                     //Обертка для кол-ва товара

        let $cartItemQuantityForm = $('<form/>', {
            action: '#',

        });                                     //Форма для кол-ва товара

        let $cartItemQuantityInput = $('<input/>', {
            type: 'number',
            size: 1,
            name: 'quantity',
            min: 0,
            max: 99,
            value: `${product.quantity}`,
            class: 'quantityInputForm'
        });                                     //Поле инпут для кол-ва товара

        let $cartItemShippingTerms = $('<div/>', {
            class: 'chr-legend',
            text: product.shippingTerms
        });                                     //Обертка для условий доставки, вставить из json

        let $cartItemSubTotal = $('<div/>', {
            class: 'chr-legend subtotal',
            text: '$' + product.quantity * product.price
        });                                     //Обертка для промежуточного итога стоимости этого товара

        let $cartItemDelBtnDiv = $('<div/>', {
            class: 'chr-legend delete-button',
        });                                     //Обертка для кнопки удаления товара

        let $cartItemDeleteBtnImg = $('<img/>', {
            src: 'images/cros-del.jpg',
            alt: 'Удалить товар'
        });                                     //Картинка кнопки удаления товара

        //Выше созданы детали правой части товара

        //Ниже сборка HTML-кода товара в корзине

        $container.append($cartItem);
        $cartItem.append($cartItemLeftPart);
        $cartItem.append($cartItemRightPart);

        //Сборка левой части
        $cartItemLeftPart.append($cartItemImgDiv);
        $cartItemImgDiv.append($cartItemImg);

        $cartItemLeftPart.append($cartItemNameColorSize);

        $cartItemNameColorSize.append($cartItemName);
        $cartItemNameColorSize.append($cartItemColorSize);

        $cartItemColorSize.append($cartItemTitleColor);
        $cartItemColorSize.append($cartItemColor);
        $cartItemColorSize.append($('<br>'));

        $cartItemColorSize.append($cartItemTitleSize);
        $cartItemColorSize.append($cartItemSize);

        //Сборка правой части
        $cartItemRightPart.append($cartItemPrice);

        $cartItemRightPart.append($cartItemQuantityBlock);
        $cartItemQuantityBlock.append($cartItemQuantityForm);
        $cartItemQuantityForm.append($cartItemQuantityInput);

        $cartItemRightPart.append($cartItemShippingTerms);
        $cartItemRightPart.append($cartItemSubTotal);

        $cartItemRightPart.append($cartItemDelBtnDiv);
        $cartItemDelBtnDiv.append($cartItemDeleteBtnImg);

        this._renderTotalSum();
    }

    recountSum() {
        setTimeout(() => {

            //Изменение количества товара в корзине

            $('.cart-header').on('click', '.quantityInputForm', function (event) {
                $('.quantityInputForm:focus').on('input', () => {
                    let $newQuantity = +$('.quantityInputForm:focus').val();

                    let productId = +event.target.closest('.cart-header').dataset.id;
                    console.log(productId);

                    let find = myCart.cartItems.find(product => product.id === productId);
                    find.quantity = $newQuantity;
                    console.log(myCart.cartItems);

                    let $getProductPrice = +$('.quantityInputForm:focus')
                        .closest('.info-properties')
                        .find('.price')
                        .text()
                        .replace(/\D+/g, "");

                    $('.quantityInputForm:focus')
                        .closest('.info-properties')
                        .find('.subtotal')
                        .text('$' + $newQuantity * $getProductPrice);
                    myCart._countGoodsCounter();
                    myCart._amountCounter();
                    localStorage.setItem('myCart', JSON.stringify(myCart.cartItems));
                    localStorage.setItem('countGoods', JSON.stringify(myCart.countGoods));
                    localStorage.setItem('amount', JSON.stringify(myCart.amount));
                    myCart._renderTotalSum();
                });
            });

            //Удаление товара из корзины

            $('.cart-header').on('click', '.delete-button', e => {
                console.log(e.target);
                let productId = +e.target.closest('.cart-header').dataset.id;
                let find = this.cartItems.find(product => product.id === productId);
                console.log(find);
                this.cartItems.splice(this.cartItems.indexOf(find), 1);
                console.log(this.cartItems);
                e.target.closest('.cart-header').remove();
                this._countGoodsCounter();
                this._amountCounter();
                localStorage.setItem('myCart', JSON.stringify(this.cartItems));
                localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
                localStorage.setItem('amount', JSON.stringify(this.amount));
                myCart._renderTotalSum();
                myCart._render();
            });

            //Очистка корзины

            $('#clear-cart').on('click', e =>{
                e.preventDefault();
                $('.cart-header:not(.cart-title)').fadeOut();
                setTimeout(() => $('.cart-header:not(.cart-title)').remove(), 500);
                myCart.cartItems = [];
                this._countGoodsCounter();
                this._amountCounter();
                localStorage.setItem('myCart', JSON.stringify(this.cartItems));
                localStorage.setItem('countGoods', JSON.stringify(this.countGoods));
                localStorage.setItem('amount', JSON.stringify(this.amount));
                myCart._render();
                myCart._renderTotalSum();
            })

        }, 300);
    }



    //Отображение новой итоговой суммы

    _renderTotalSum(){
        $('.sub-total-count').text('$' + this.amount);
        $('.grand-total-count').text('$' + this.amount);

    };

    //Счетчик количества единиц товаров
    _countGoodsCounter(){
        this.countGoods = 0;
        for(let product of this.cartItems) {
            this.countGoods += product.quantity;
        }
    };

    //Счетчик общей суммы товаров
    _amountCounter(){
        this.amount = 0;
        for(let product of this.cartItems) {
            this.amount += product.quantity*product.price;
        }
    }
}