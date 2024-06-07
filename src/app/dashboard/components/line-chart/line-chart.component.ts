import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Chart, ChartModule } from 'angular-highcharts';
import { Options } from 'highcharts';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './line-chart.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  @Input() data: any;
  leftText: string = '';
  bottomText: string = '';
  firstData: any[] = [];
  secondData: any[] = [];
  categories: any[] = [];

  areaChartOptions: Options = {
    chart: {
      type: 'spline',
    },
    credits: {
      enabled: false,
    },
    // tooltip: {
    //   valueSuffix: ' °C',
    // },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
      spline: {
        marker: {
          radius: 4,
          lineColor: '#F2F4F7',
          lineWidth: 0.5,
        },
      },
    },
    title: {
      verticalAlign: 'middle',
      floating: true,
      text: '',
    },
    legend: {
      enabled: false,
    },
    yAxis: {
      visible: true,
      lineColor: '#F2F4F7',
      lineWidth: 0.5,
      title: {
        text: '',
      },
      labels: {
        formatter: function () {
          return this.value + '';
        },
      },
    },
    xAxis: {
      visible: true,
      lineColor: '#F2F4F7',
      lineWidth: 0.5,
      title: {
        text: this.bottomText || '',
      },
      categories: this.categories,
    },
    defs: {
      gradient0: {
        tagName: 'linearGradient',
        id: 'gradient-0',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 1,
        children: [
          {
            tagName: 'stop',
            offset: 0,
          },
          {
            tagName: 'stop',
            offset: 0,
          },
        ],
      },
    } as any,
    series: [
      {
        color: '#8F380E',
        type: 'spline',
        keys: ['y', 'selected'],
        data: this.firstData,
      },
      {
        color: '#EF5E17',
        // dashStyle: 'Dash 2023',
        type: 'spline',
        keys: ['y', 'selected'],
        data: this.secondData,
      },
    ],
  };

  areaSpline: any = new Chart(this.areaChartOptions);

  initData() {
    this.leftText = this.data?.leftText;
    this.bottomText = this.data?.bottomText;
    if (this.data?.data?.first?.data) {
      this.data?.data?.first?.data?.filter((name: any) => {
        this.firstData.push([name[0], name[1]]);
      });
    }

    if (this.data?.data?.categories) {
      for (let c of this.data?.data?.categories) {
        this.categories.push(c);
      }
    }

    if (this.data?.data?.second?.data) {
      this.data?.data?.second?.data?.filter((name: any) => {
        this.secondData.push([name[0], name[1]]);
      });
    }
  }

  ngOnInit(): void {
    this.initData();
  }
}
