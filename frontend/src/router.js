import {Form} from "./components/form.js";
import {Auth} from "./services/auth.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import '../styles/index.css';
import {Main} from "./components/main.js";
import {Sidebar} from "./components/sidebar.js";
import {Category} from "./components/category.js";
import {Create_category} from "./components/create_category.js";
import {Edit_category} from "./components/edit_category.js";
import {Category_filter} from "./components/category_filter.js";
import {Create_category_filter} from "./components/create_category_filter.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content')
        this.stylesElement = document.getElementById('styles')
        this.titleElement = document.getElementById('page-title')
        this.routes = [
            {
                route: '#/main',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'styles/main.css',
                sidebar: 'templates/sidebar.html',
                load: () => {
                    new Main()
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/form.css',
                sidebar: null,
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/',
                title: 'Вход в систему',
                template: 'templates/login.html',
                styles: 'styles/form.css',
                sidebar: null,
                load: () => {
                    new Form('login');
                }
            },

            {
                route: '#/income',
                title: 'Выбор категории дохода/расхода',
                template: 'templates/category.html',
                styles: 'styles/category.css',
                sidebar: 'templates/sidebar.html',
                load: () => {
                    new Category('income');
                }
            },
            {
                route: '#/expense',
                title: 'Выбор категории дохода/расхода',
                template: 'templates/category.html',
                styles: 'styles/category.css',
                sidebar: 'templates/sidebar.html',
                load: () => {
                    new Category('expense');
                }
            },
            {
                route: '#/create_category_income',
                title: 'Создание категории дохода/расхода',
                template: 'templates/create_category.html',
                styles: 'styles/category.css',
                sidebar: 'templates/sidebar.html',
                load: () => {
                    new Create_category('income');
                }
            },
            {
                route: '#/create_category_expense',
                title: 'Создание категории дохода/расхода',
                template: 'templates/create_category.html',
                styles: 'styles/category.css',
                sidebar: 'templates/sidebar.html',
                load: () => {
                    new Create_category('expense');
                }
            },
            {
                route: '#/edit_category_income',
                title: 'Редактирование категории дохода/расхода',
                template: 'templates/edit_category.html',
                styles: 'styles/category.css',
                sidebar: 'templates/sidebar.html',
                load: () => {
                    new Edit_category('income')
                }
            },
            {
                route: '#/edit_category_expense',
                title: 'Редактирование категории дохода/расхода',
                template: 'templates/edit_category.html',
                styles: 'styles/category.css',
                sidebar: 'templates/sidebar.html',
                load: () => {
                    new Edit_category('expense')
                }
            },
            {
                route: '#/category_filter',
                title: 'Фильтр категории',
                template: 'templates/category_filter.html',
                styles: 'styles/category.css',
                sidebar: 'templates/sidebar.html',
                load: () => {
                    new Category_filter();
                }
            },
            {
                route: '#/create_category_filter_income',
                title: 'Создание фильтра дохода/расхода',
                template: 'templates/create_category_filter.html',
                styles: 'styles/category.css',
                sidebar: 'templates/sidebar.html',
                load: () => {
                    new Create_category_filter('income');
                }
            },
            {
                route: '#/create_category_filter_expense',
                title: 'Создание фильтра дохода/расхода',
                template: 'templates/create_category_filter.html',
                styles: 'styles/category.css',
                sidebar: 'templates/sidebar.html',
                load: () => {
                    new Create_category_filter('expense');
                }
            },
            {
                route: '#/edit_category_filter',
                title: 'Редактирование фильтра дохода/расхода',
                template: 'templates/edit_category_filter.html',
                styles: 'styles/category.css',
                sidebar: 'templates/sidebar.html',
                load: () => {
                    // new Answers();
                }
            },
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/';
            return;
        }
        const newRoute = this.routes.find(item => {
            return item.route === urlRoute
        })
        if (!newRoute) {
            window.location.href = '#/';
            return;
        }
        if (newRoute.sidebar) {
            const sidebar = document.getElementById('sidebar')
            this.stylesElement.setAttribute('href', newRoute.styles);
            this.titleElement.innerText = newRoute.title;
            if (sidebar) {
                const contentInfo = document.getElementById('content-info');
                contentInfo.innerHTML = await fetch(newRoute.template).then(response => response.text())
                this.stylesElement.setAttribute('href', newRoute.styles);
                this.titleElement.innerText = newRoute.title;
            } else {
                this.contentElement.innerHTML =
                    `<div class="d-flex vh-100">
                     ${await fetch(newRoute.sidebar).then(response => response.text())}
                     <div class="content-info" id="content-info"> 
                      ${await fetch(newRoute.template).then(response => response.text())}</div>
                      </div>`
                new Sidebar();
            }
        } else {
            this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
            this.stylesElement.setAttribute('href', newRoute.styles);
            this.titleElement.innerText = newRoute.title;
        }
        newRoute.load();
    }
}

