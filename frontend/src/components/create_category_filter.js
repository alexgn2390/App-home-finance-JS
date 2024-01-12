import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UrlManager} from "../utils/url-manager.js";


export class Create_category_filter {
    constructor(category) {
        this.category = category;
        this.cardCategory = [];
        this.balance = document.getElementById('balance');
        this.date = document.getElementById('date');
        this.comment = document.getElementById('comment');
        this.typeOptions = document.querySelectorAll('.ul-content li');
        this.typeOption = document.getElementById('selected-button');
        this.params = UrlManager.getQueryParams();
        this.type = this.params.type;
        console.log(typeof this.type);
        this.operations = [];
        this.categoryId = this.params.categoryId;
        this.init();
    }

    async init() {
        let categoryOption = document.getElementById('category-option');
        const that = this;
        this.typeOption.addEventListener('click', function () {
            let typeContent = document.querySelector('#selected-button + .ul-content');
            typeContent.style.display = (typeContent.style.display === 'none') ? 'block' : 'none';
        });
        this.typeOptions.forEach(function (type) {
            type.addEventListener('click', function () {
                that.typeOption.textContent = type.textContent;
                hideOptions(type.parentNode);
                loadCategories(type.textContent);
            });
        });
        const liIncomeSelectedButton = document.getElementById('selected-button');
        liIncomeSelectedButton.textContent = this.type;
        let categoryOptions = document.getElementById('category-options');
        categoryOptions.innerHTML = '';
        if (this.type) {
            try {
                const result = await CustomHttp.request(config.host + '/categories/' + this.category);

                if (result) {
                    if (result.error) {
                        throw new Error(result.message);
                    }
                    this.cardCategory = result;
                    this.type = 'доход'
                    console.log(that.cardCategory);
                }
            } catch (error) {
                return console.log(error);
            }
            this.cardCategory.forEach(title => {
                const titleIncome = title.title;
                let li = document.createElement('li');
                li.textContent = titleIncome;
                li.setAttribute('data-category-id', title.id);
                li.addEventListener('click', function () {
                    categoryOption.innerText = titleIncome;
                    let categoryContent = document.querySelector('#category-option + .ul-content');
                    hideOptions(categoryContent);

                    // const categoryId = this.getAttribute('data-category-id');
                    const createCategoryFilterButton = document.getElementById('create_category_filter');
                    createCategoryFilterButton.onclick = function () {
                        that.saveCategory(title.id);
                    };
                });
                categoryOptions.appendChild(li);
            });
        }

        categoryOption.addEventListener('click', function () {
            let categoryContent = document.querySelector('#category-option + .ul-content');
            categoryContent.style.display = (categoryContent.style.display === 'none') ? 'block' : 'none';
        });
        async function loadCategories(type) {
            let categoryOptions = document.getElementById('category-options');
            categoryOptions.innerHTML = '';

            if (type === 'Доходы') {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/income');
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }
                        that.cardCategory = result;
                    }
                } catch (error) {
                    return console.log(error);
                }

                that.cardCategory.forEach(title => {
                    const titleIncome = title.title;
                    let li = document.createElement('li');
                    li.textContent = titleIncome;
                    li.setAttribute('data-category-id', title.id);
                    li.addEventListener('click', function () {
                        categoryOption.innerText = titleIncome;
                        let categoryContent = document.querySelector('#category-option + .ul-content');
                        hideOptions(categoryContent);
                        const createCategoryFilterButton = document.getElementById('create_category_filter');
                        createCategoryFilterButton.onclick = function () {
                            that.saveCategory(title.id);
                        };
                    });
                    categoryOptions.appendChild(li);
                });
            } else if (type === 'Расходы') {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/expense');
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }
                        that.cardCategory = result;
                        console.log(that.cardCategory);
                    }
                } catch (error) {
                    return console.log(error);
                }
                that.cardCategory.forEach(title => {
                    const titleExpense = title.title;
                    let li = document.createElement('li');
                    li.textContent = titleExpense;
                    li.setAttribute('data-category-id', title.id);
                    li.addEventListener('click', function () {
                        categoryOption.innerText = titleExpense;
                        let categoryContent = document.querySelector('#category-option + .ul-content');
                        hideOptions(categoryContent);

                        // const categoryId = this.getAttribute('data-category-id');
                        const createCategoryFilterButton = document.getElementById('create_category_filter');
                        createCategoryFilterButton.onclick = function () {
                            that.saveCategory(title.id);
                        };
                    });
                    categoryOptions.appendChild(li);
                });
            }
        }
        function hideOptions(content) {
            if (content) {
                content.style.display = 'none';
            } else {
                console.log('content is undefined or null');
            }
        }
    }

    async saveCategory(categoryId) {
        const queryUrl = `${config.host}/operations`;
        try {
            const result = await CustomHttp.request(queryUrl, 'POST', {
                type: this.type,
                amount: Number(this.balance.value),
                date: this.date.value,
                comment: this.comment.value,
                category_id: Number(categoryId),
            });
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
                this.operations = result;
                location.href = '#/category_filter';
                console.log(this.operations);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
