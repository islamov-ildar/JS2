class Feedback {
    constructor(source, container = '#feedback-block') {
        this.source = source;
        this.container = container;
        this.feedbackItems = [];
        this._init(this.source);
    }

    _render() {
        let $feedbackDiv = $('<div/>', {
            class: 'feedback-items-wrapper'
        });

        let $feedbackCreate = $('<div/>', {
            class: 'feedbackCreate'
        });

        $(this.container).append($('<div id="feedbackBlockTitle">Feedbacks:</div>'));
        $feedbackDiv.appendTo($(this.container));
        $feedbackCreate.appendTo($(this.container));

        this._renderFeedbackCreate();
    }

    _renderFeedback(feedback) {

        let $container = $('<div/>', {
            class: 'feedback-item',
            'data-id': feedback.id
        });

        $container.append($(`<p class="author">Author: ${feedback.author}</p>`));
        $container.append($(`<p class="feed-back-text">Feedback text:<br> ${feedback.text}</p>`));
        $container.append($(`<button class="feed-back-approved-btn " data-id="${feedback.id}">Feedback approved</button>`));
        $container.append($(`<button class="feed-back-delete-btn" data-id="${feedback.id}">Delete feedback</button>`));

        $container.appendTo($('.feedback-items-wrapper'));
    }

    _renderFeedbackCreate() {
        let $container = $('.feedbackCreate');

        $container.text('Create feedback');

        $container.append($(`<form class="feedback-create-form">
        <textarea class="feedback-create-text"></textarea>
        <p>Your Name</p>
        <input type="text" id="feedBackAuthor">
        <button id="sentFeedback">Add feedback</button>
        </form>`));
    }

    _init(source) {
        this._render();
        fetch(source)
            .then(result => result.json())
            .then(data => {
                for(let feedback of data) {
                    this.feedbackItems.push(feedback);
                    this._renderFeedback(feedback);
                }
            })
    }

    _checkingFeedbackId(){
        if (this.feedbackItems.length === 0){
            return 11;
        } else {
            return this.feedbackItems[this.feedbackItems.length-1].id + 1;
        }
    }

    delFeedback(targetBtn){
        let feedbackId = +$(targetBtn).data('id');
        $(`[data-id = "${feedbackId}"]`).fadeOut();
        setTimeout(() => $(`[data-id = "${feedbackId}"]`).remove(), 1000);
        let find = this.feedbackItems.find(feedback => feedback.id === feedbackId);
        this.feedbackItems.splice(this.feedbackItems.indexOf(find), 1);
        console.log(this.feedbackItems);
    };

    approvedFeedback(targetBtn){
        let feedbackId = +$(targetBtn).data('id');
        $(`[data-id = "${feedbackId}"]`).find('.feed-back-text').addClass('approvedFeedback');
        targetBtn.remove();
    };

    addFeedback(targetBtn){
        let feedback = {
            author: $('#feedBackAuthor').val(),
            text: $('textarea').val(),
            id: this._checkingFeedbackId()
        };
        if(feedback.author !== '' && feedback.text !== ''){
        this.feedbackItems.push(feedback);
        this._renderFeedback(feedback);
        $('#feedBackAuthor').val('');
        $('textarea').val('');
        console.log(this.feedbackItems);
        } else {
            alert('Field "Your Name" and "Create feedback" can not be blank')
        }
    };


}