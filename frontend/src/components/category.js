import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UrlManager} from "../utils/url-manager.js";

export class Category {
    constructor(category) {
        this.category = category
        this.cardCategory = [];
        const params = UrlManager.getQueryParams();
        this.categoryId = params.categoryId;
        this.popup = document.getElementById('popup')
        this.init();
    }

    async init() {
        if (this.category === 'income') {
            try {
                const result = await CustomHttp.request(config.host + '/categories/' + this.category)

                if (result) {
                    if (result.error) {
                        throw new Error(result.message)
                    }
                    this.cardCategory = result;
                    this.getCategoryIncome()
                }
            } catch (error) {
                return console.log(error)
            }
        } else {
            try {
                const result = await CustomHttp.request(config.host + '/categories/' + this.category)
                if (result) {
                    if (result.error) {
                        throw new Error(result.message)
                    }
                    this.cardCategory = result;
                    this.getCategoryExpense()
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    getCategoryIncome() {
        console.log(this.cardCategory)
        const categoryCardsElement = document.getElementById('category-cards')
        if (this.cardCategory && this.cardCategory.length > 0) {
            this.cardCategory.forEach(quiz => {
                const categoryCardElement = document.createElement('div')
                categoryCardElement.className = 'category-card';
                categoryCardElement.setAttribute('data-id', quiz.id);
                const categoryCardTitle = document.createElement('div');
                categoryCardTitle.className = 'category-card-title';
                categoryCardTitle.innerText = quiz.title;
                const categoryCardActions = document.createElement('div');
                categoryCardActions.className = 'category-card-actions';
                const categoryCardButtonBlue = document.createElement('button');
                categoryCardButtonBlue.textContent = 'Редактировать'
                categoryCardButtonBlue.className = 'button button_blue';
                const that = this
                categoryCardButtonBlue.addEventListener('click', async function () {
                    const categoryId = quiz.id;
                    try {
                        const result = await CustomHttp.request(config.host + '/categories/' + that.category + '/' + categoryId);
                        if (result) {
                            if (result.error) {
                                throw new Error(result.error);
                            }
                            const title = result.title;
                            const editCategoryUrl = `#/edit_category_${that.category}?categoryId=${categoryId}&title=${encodeURIComponent(title)}`;
                            location.href = editCategoryUrl;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                });
                const categoryCardButtonRed = document.createElement('button');
                categoryCardButtonRed.textContent = 'Удалить'
                categoryCardButtonRed.className = 'button button_red';
                categoryCardButtonRed.onclick = function () {
                    this.popup = document.getElementById('popup')
                    this.popup.style.display = 'block'
                    const popupText = document.getElementById('popup-text')
                    if (that.category === 'income') {
                        popupText.innerHTML = ' Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.'
                    } else {
                        popupText.innerHTML = ' Вы действительно хотите удалить категорию? Связанные расходы будут удалены навсегда.'
                    }
                    const removeCategory = document.getElementById('remove_category')
                    removeCategory.onclick = function () {
                        that.removeCategoryElement(quiz.id)
                    }
                }
                categoryCardActions.appendChild(categoryCardButtonBlue);
                categoryCardActions.appendChild(categoryCardButtonRed);
                categoryCardElement.appendChild(categoryCardTitle);
                categoryCardElement.appendChild(categoryCardActions);
                categoryCardsElement.insertBefore(categoryCardElement, categoryCardsElement.firstChild);
                localStorage.setItem('category_' + quiz.id, JSON.stringify(quiz));
            })
            const createCategoryCard = document.getElementById('create_category_card')
            const that = this
            createCategoryCard.addEventListener('click', function () {
                location.href = '#/create_category_' + that.category
            })
        }
        const noRemoveCategory = document.getElementById('no_remove_category');
        const that = this; // Сохраняем ссылку на текущий объект Category
        noRemoveCategory.onclick = () => {
            that.popup.style.display = 'none';
        };
    }

    getCategoryExpense() {
        const categoryTitle = document.getElementById('category-title')
        categoryTitle.innerHTML = ' '
        categoryTitle.innerHTML = 'Расходы'
        this.getCategoryIncome()
    }

    async removeCategoryElement(id) {
            try {
                const result = await CustomHttp.request(config.host + '/categories/' + this.category + '/' + id, 'DELETE')

                if (result) {
                    if (result.error) {
                        throw new Error(result.error)
                    }
                    this.popup.style.display = 'none'
                    window.location.href = '#/' + this.category
                }
            } catch (error) {
                console.log(error)
            }
        }

}