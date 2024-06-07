import { Options } from 'highcharts';

export const AreaChartOptions: Options = {
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
        lineColor: '#C28C30',
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
    lineColor: '#C28C30',
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
    lineColor: '#C28C30',
    lineWidth: 0.5,
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
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
      color: '#C28C30',
      type: 'spline',
      keys: ['y', 'selected'],
      data: [
        [131.9, false],
        [223.9, false],
        [333.9, false],
        [434.9, false],
        [222.9, false],
        [333.9, false],
        [444.9, false],
        [131.9, false],
        [223.9, false],
        [333.9, false],
        [434.9, false],
        [222.9, false]
      ],
    },
    {
      color: 'rgba(194,140,48,0.5)',
      dashStyle: 'Dash',
      type: 'spline',
      keys: ['y', 'selected'],
      data: [
        [222.9, false],
        [434.9, false],
        [333.9, false],
        [223.9, false],
        [131.9, false],
        [444.9, false],
        [333.9, false],
        [222.9, false],
        [434.9, false],
        [333.9, false],
        [223.9, false],
        [131.9, false],
      ],
    },
  ],
};
