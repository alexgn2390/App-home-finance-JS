import config from "../../config/config.js";
import {CustomHttp} from "../services/custom-http.js";

export class Create_category {
    constructor(category) {
        this.createCategoryButton = document.getElementById('create_category')
        this.categoryInputElement = document.getElementById('category-input')
        this.cancelCategoryButton = document.getElementById('cancel_category')
        this.category = category
        this.init()
    }

    async init() {
        if ( this.category === 'income') {
            this.createCategoryButton.onclick = () => this.saveCategory();
            this.cancelCategoryButton.onclick = () => this.cancel();
        }
        else if ( this.category === 'expense') {
            this.createCategoryButton.onclick = () => this.saveCategory();
            document.getElementById('create_category_title').innerText = 'Создание категории расходов'
            this.cancelCategoryButton.onclick = () => this.cancel();
        }
    }

    async saveCategory () {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' + this.category, 'POST', {
                title: this.categoryInputElement.value
            })
            if (result) {
                if (result.error) {
                    throw new Error(result.error)
                }
                location.href = '#/' + this.category
            }
        } catch (error) {
            console.log(error)
        }
    }
    cancel() {
        window.location.href = '#/' + this.category;
    }
}