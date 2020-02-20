let myCart = new Cart;
console.log(myCart);

$('.productItem').on('click', '.add-flex', e => {
    e.preventDefault();
    myCart.addProduct(e.target);
});
$('.description-of-select').on('click', '.add-to-cart-button', e => {
    e.preventDefault();
    myCart.addProduct(e.target);
});

$(document).ready(() => {
    myCart.cartRender('cart.json');
});

//Drag-and-Drop functional
$(document).ready(() => {
    let targetProductDataAttr;
    $(function () {
        $(".draggable").draggable({
            revert: true,
            start: function (event, ui) {
                targetProductDataAttr = event.target.closest('.productItem');
                setTimeout(() => $('.cartBorder').removeClass('invisible'), 100);
            }
        });

        $('.productItem').mouseup(e => {
            setTimeout(() => $('.cartBorder').addClass('invisible'), 20);
        });

        $(".header").droppable({
            classes: {
                "ui-droppable-active": "ui-state-active",
                "ui-droppable-hover": "ui-state-hover"
            },
            drop: function (event, ui) {
                $(this)
                    .addClass("ui-state-highlight");
                myCart.addProduct(targetProductDataAttr);
                setTimeout(() => $('.cartBorder').addClass('invisible'), 100);
            },

        });
    });
});

//Разворачивание/сворачивание корзины при наведении/снятии мыши на иконку корзины
$(document).ready(() => {
   let cartImage = $(".header-right-img");
   cartImage.hover(
       () => {
           setTimeout(() => $('.cartBorder').removeClass('invisible'), 100);
           $('.header').addClass('ui-state-active ui-droppable-active');
       }
   );
   $('.header').mouseleave(() => {
       setTimeout(() => $('.cartBorder').addClass('invisible'), 10);
       $('.header').removeClass('ui-state-active ui-droppable-active');
   })
});

//Отрисовка итоговой суммы в корзине
$(document).ready(() => {
    myCart._renderTotalSum();
});

//Пересчет общей суммы
$(document).ready(() => {
    myCart.recountSum();
});

//Работа с отзывами
if ($('title').text() === 'Single page'){
    $(document).ready(() => {

        let feedBack = new Feedback('feedback.json');

        //Удаление отзыва
        $('.feedback-items-wrapper').on('click', '.feed-back-delete-btn', e => {
            feedBack.delFeedback(e.target);
        });
//Одобрение отзыва
        $('.feedback-items-wrapper').on('click', '.feed-back-approved-btn', e => {
            feedBack.approvedFeedback(e.target);
        });
//Добавление отзыва
        $('.feedbackCreate').on('click', '#sentFeedback', e => {
            e.preventDefault();
            feedBack.addFeedback(e.target);
        });
    });
}


