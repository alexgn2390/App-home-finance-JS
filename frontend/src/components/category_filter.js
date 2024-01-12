import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Category_filter {
    constructor() {
        this.operations = []
        this.init()
    }

    async init() {
        document.getElementById('create_income_filter').onclick = function () {
            window.location.href = '#/create_category_filter_income?type=Доходы';
        };

        document.getElementById('create_expense_filter').onclick = function () {
            window.location.href = '#/create_category_filter_expense?type=Расходы';
        };

        function getCurrentDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const currentDate = `${year}-${month}-${day}`;
            return currentDate;
        }

        function getStartDateOfWeek() {
            const today = new Date();
            const dayOfWeek = today.getDay(); // Получаем номер текущего дня недели (0 - воскресенье, 1 - понедельник, и т.д.)
            const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Вычисляем разницу между текущим днем и началом недели
            const startDate = new Date(today.setDate(diff)); // Устанавливаем дату на начало недели
            const year = startDate.getFullYear();
            const month = String(startDate.getMonth() + 1).padStart(2, '0');
            const day = String(startDate.getDate()).padStart(2, '0');
            const startDateOfWeek = `${year}-${month}-${day}`;
            return startDateOfWeek;
        }

        function getStartDateOfMonth() {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            const startDate = new Date(year, month, 1); // Устанавливаем дату на первый день месяца
            const startDateOfMonth = startDate.toISOString().split('T')[0]; // Преобразуем дату в формат 'YYYY-MM-DD' и возвращаем только дату
            return startDateOfMonth;
        }


        function getStartDateOfYear() {
            const today = new Date();
            const year = today.getFullYear();
            const startDate = new Date(year, 0, 1); // Устанавливаем дату на первый день года (месяц 0 - январь)
            const startDateOfYear = startDate.toISOString().split('T')[0]; // Преобразуем дату в формат 'YYYY-MM-DD' и возвращаем только дату
            return startDateOfYear;
        }

        function getIntervalDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
        }

        function clearData() {
            const dataContainer = document.getElementById('tableElement');
            while (dataContainer.firstChild) {
                dataContainer.removeChild(dataContainer.firstChild);
            }
            // Сброс флагов
            todayDataAdded = false;
            weekDataAdded = false;
            monthDataAdded = false;
            yearDataAdded = false;
            allDataAdded = false;
            intDataAdded = false;
        }

        let todayDataAdded = false;
        let weekDataAdded = false;
        let monthDataAdded = false;
        let yearDataAdded = false;
        let allDataAdded = false;
        let intDataAdded = false;

        document.getElementById('todayButton').addEventListener('click', async () => {
            if (!todayDataAdded) {
                clearData()
                const period = 'day';
                const dateFrom = getCurrentDate(); // Ваш метод для получения текущей даты
                const dateTo = getCurrentDate(); // Ваш метод для получения текущей даты
                await this.getCategoryFilter(period, dateFrom, dateTo);
                todayDataAdded = true
            }

        });

        // Обработчик для кнопки "неделя"
        document.getElementById('weekButton').addEventListener('click', async () => {
            clearData()
            if (!weekDataAdded) {
                const period = 'week';
                const dateFrom = getStartDateOfWeek(); // Ваш метод для получения начальной даты недели
                const dateTo = getCurrentDate(); // Ваш метод для получения текущей даты

                await this.getCategoryFilter(period, dateFrom, dateTo);
                weekDataAdded = true
            }

        });

        // Обработчик для кнопки "месяц"
        document.getElementById('monthButton').addEventListener('click', async () => {
            if (!monthDataAdded) {
                clearData()
                const period = 'month';
                const dateFrom = getStartDateOfMonth(); // Ваш метод для получения начальной даты месяца
                const dateTo = getCurrentDate(); // Ваш метод для получения текущей даты
                await this.getCategoryFilter(period, dateFrom, dateTo);
                monthDataAdded = true
            }
        });

        // Обработчик для кнопки "год"
        document.getElementById('yearButton').addEventListener('click', async () => {
            clearData()
            if (!yearDataAdded) {
                const period = 'year';
                const dateFrom = getStartDateOfYear(); // Ваш метод для получения начальной даты года
                const dateTo = getCurrentDate(); // Ваш метод для получения текущей даты
                await this.getCategoryFilter(period, dateFrom, dateTo);
                yearDataAdded = true
            }
        });

        // Обработчик для кнопки "все"
        document.getElementById('allButton').addEventListener('click', async () => {
            clearData()
            if (!allDataAdded) {
                const period = 'all';
                const dateFrom = ''; // Пустая строка или null, чтобы указать отсутствие фильтрации по дате
                const dateTo = ''; // Пустая строка или null, чтобы указать отсутствие фильтрации по дате
                await this.getCategoryFilter(period, dateFrom, dateTo);
                allDataAdded = true
            }
        });

        // Обработчик для кнопки "интервал"
        document.getElementById('intervalButton').addEventListener('click', async () => {
            clearData()
            if (!intDataAdded) {
                const fromDateInterval = document.getElementById('fromDate').value;
                const toDateInterval = document.getElementById('toDate').value;
                const period = 'custom';
                const dateFrom = getIntervalDate(fromDateInterval);
                const dateTo = getIntervalDate(toDateInterval);
                // Ваш код для получения значений начальной даты и конечной даты из выбранного пользователем интервала
                // console.log(dateFrom)
                // console.log(dateTo)
                await this.getCategoryFilter(period, dateFrom, dateTo);
                intDataAdded = true
            }
        });
    }

    async getCategoryFilter(period, dateFrom, dateTo) {
        const filteredOperations = this.operations.filter(operation => {
            const operationDate = new Date(operation.date);
            return operationDate >= dateFrom && operationDate <= dateTo;
        });
        console.log(filteredOperations)
        const queryUrl = `${config.host}/operations?period=${period}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        try {
            const result = await CustomHttp.request(queryUrl);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                this.operations = result;
                this.renderCategoryCards();
                // console.log(this.operations)
            }
        } catch (error) {
            console.log(error);
        }
    }

    renderCategoryCards() {
        if (this.operations) {
            const tableElement = document.getElementById('tableElement')
            this.operations.forEach(item => {
                const trElement = document.createElement('tr')
                trElement.id = 'trElement'
                const tdElementId = document.createElement('td')
                tdElementId.className = 'table-col'
                tdElementId.innerText = item.id
                // console.log(item.id)
                const tdElementType = document.createElement('td')
                tdElementType.className = 'table-col'
                tdElementType.innerText = item.type
                const tdElementCategory = document.createElement('td')
                tdElementCategory.className = 'table-col'
                tdElementCategory.innerText = item.category
                const tdElementAmount = document.createElement('td')
                tdElementAmount.className = 'table-col'
                tdElementAmount.innerText = item.amount
                const tdElementDate = document.createElement('td')
                tdElementDate.className = 'table-col'
                tdElementDate.innerText = item.date
                const tdElementComment = document.createElement('td')
                tdElementComment.className = 'table-col'
                tdElementComment.innerText = item.comment
                const tdElementLink = document.createElement('td')
                tdElementLink.className = 'table-col'
                const aElementLinkDelete = document.createElement('span')
                aElementLinkDelete.className = 'table-link'
                const aElementLinkEdit = document.createElement('span')
                aElementLinkEdit.className = 'table-link'

                const svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                const path1_1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const path1_2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const path1_3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const path1_4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');

                svg1.setAttribute('width', '14');
                svg1.setAttribute('height', '15');
                svg1.setAttribute('viewBox', '0 0 14 15');

                path1_1.setAttribute('d', 'M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z');
                path1_1.setAttribute('fill', 'black');

                path1_2.setAttribute('d', 'M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z');
                path1_2.setAttribute('fill', 'black');

                path1_3.setAttribute('d', 'M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z');
                path1_3.setAttribute('fill', 'black');

                path1_4.setAttribute('fill-rule', 'evenodd');
                path1_4.setAttribute('clip-rule', 'evenodd');
                path1_4.setAttribute('d', 'M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z');
                path1_4.setAttribute('fill', 'black');

                svg1.appendChild(path1_1);
                svg1.appendChild(path1_2);
                svg1.appendChild(path1_3);
                svg1.appendChild(path1_4);
                aElementLinkDelete.appendChild(svg1);

                svg2.setAttribute('width', '16');
                svg2.setAttribute('height', '16');
                svg2.setAttribute('viewBox', '0 0 16 16');
                path2.setAttribute('d', 'M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z');
                path2.setAttribute('fill', 'black');
                svg2.appendChild(path2);
                aElementLinkEdit.appendChild(svg2);

                tdElementLink.appendChild(aElementLinkDelete)
                tdElementLink.appendChild(aElementLinkEdit)

                trElement.appendChild(tdElementId)
                trElement.appendChild(tdElementType)
                trElement.appendChild(tdElementCategory)
                trElement.appendChild(tdElementAmount)
                trElement.appendChild(tdElementDate)
                trElement.appendChild(tdElementComment)
                trElement.appendChild(tdElementLink)
                tableElement.appendChild(trElement)
            })
        }
    }
}