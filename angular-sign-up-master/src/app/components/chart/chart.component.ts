import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { registerables } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('myChart', { static: false }) chartRef!: ElementRef;
  @Input() chartData: any;
  @Input() chartLabels: string[] = [];

  constructor() {
    Chart.register(...registerables); // تسجيل كل الأنواع في Chart.js
  }

  ngAfterViewInit(): void {
    
    if(this.chartLabels[0]=="إتمام الواجبات"){
    this.createChart();
  }else{
    this.createChart2();
  }}

  createChart(): void {
    if (!this.chartRef || !this.chartData) {
      console.error('Canvas or chartData not found');
      return;
    }

    const canvas = this.chartRef.nativeElement;
    new Chart(canvas, {
      type: 'bar', // أو أي نوع آخر من الرسم البياني
      data: {
        labels: this.chartLabels,
        datasets: [{
          backgroundColor: ["#FFBC01", "#0097FF", "#48D5FF"], // يمكن تخصيص الألوان
          data: this.chartData
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'بيانات ومؤشرات الدراسة'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  


  createChart2(): void {
    if (!this.chartRef || !this.chartData) {
      console.error('Canvas or chartData not found');
      return;
    }

    const canvas = this.chartRef.nativeElement;
    new Chart(canvas, {
      type: 'bar', // أو أي نوع آخر من الرسم البياني
      data: {
        labels: this.chartLabels,
        datasets: [{
          backgroundColor: ["#FFBC01", "#0097FF", "#48D5FF"], // يمكن تخصيص الألوان
          data: this.chartData
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'بيانات ومؤشرات العمل'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
