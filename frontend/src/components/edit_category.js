import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UrlManager} from "../utils/url-manager.js";

export class Edit_category {
    constructor(category) {
        this.category = category
        this.categorySaveInputElement = document.getElementById('edit_category_input')
        this.categoryId = null
        this.cancelButton = document.getElementById('cancel')
        this.init()
    }

    async init() {
        const params = UrlManager.getQueryParams();
        this.categoryId = params.categoryId;
        const titleParam = params.title;
        if ( this.category === 'income') {
            this.categorySaveInputElement.value = titleParam;
            document.getElementById('save_category').onclick = () => this.saveCategoryTitle();
            this.cancelButton.onclick = () => this.cancel();
        }
        else if ( this.category === 'expense') {
            this.categorySaveInputElement.value = titleParam;
            document.getElementById('save_category').onclick = () => this.saveCategoryTitle();
            document.getElementById('edit_category_title').innerText = 'Редактирование категории расходов'
            this.cancelButton.onclick = () => this.cancel();
        }
    }


    async saveCategoryTitle() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' + this.category + '/' + this.categoryId, 'PUT', {
                title: this.categorySaveInputElement.value
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