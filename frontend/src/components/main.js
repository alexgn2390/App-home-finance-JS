
export class Main {
    constructor() {
        this.init()
        this.chart()
    }
    async init() {
    }
    chart() {
        const myChart_1 = document.getElementById("myChart_1").getContext('2d');
        const tags_1 = ["red", "orange", "yellow", "green", "blue"]
        const dataTraffic_1 = {
            data: [1500, 400, 2000, 6000, 1000],
            backgroundColor: [
                '#DC3545',
                '#FD7E14',
                '#FFC107',
                '#20C997',
                '#0D6EFD',
            ],// Цвет фона
            borderColor: [
                '#DC3545',
                '#FD7E14',
                '#FFC107',
                '#20C997',
                '#0D6EFD',
            ],// Цвет границы
            borderWidth: 1,// Толщина границ
        };
        new Chart(myChart_1, {
            type: 'pie',
            data: {
                labels: tags_1,
                datasets: [
                    dataTraffic_1,
                ]
            },
            options: {
                responsive: true,
            }
        });
        const myChart_2 = document.getElementById("myChart_2");
        const tags_2 = ["red", "orange", "yellow", "green", "blue"]
        const dataTraffic_2 = {
            data: [1500, 1000,
                // 2000, 6000, 1000
            ],
            backgroundColor: [
                '#DC3545',
                // '#FD7E14',
                // '#FFC107',
                '#20C997',
                // '#0D6EFD',
            ],// Цвет фона
            borderColor: [
                '#DC3545',
                // '#FD7E14',
                // '#FFC107',
                '#20C997',
                // '#0D6EFD',
            ],// Цвет границы
            borderWidth: 1,// Толщина границ
        };
        new Chart(myChart_2, {
            type: 'pie',
            data: {
                labels: tags_2,
                datasets: [
                    dataTraffic_2,
                ]
            },
        });
    }
}