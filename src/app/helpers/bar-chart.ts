import { Options } from 'highcharts';

export const barChart: Options = {
  chart: {
    type: 'line',
  },
  credits: {
    enabled: false,
  },
  title: {
    text: '',
  },
  yAxis: {
    visible: true,
    gridLineColor: 'gray',
  },
  legend: {
    enabled: false,
  },
  xAxis: {
    lineColor: '#fff',
    categories: ['#', '#', '#', '#', '#', '#'],
  },

  plotOptions: {
    column: {
      allowPointSelect: true,
    },
    series: {
      borderRadius: 5,
    } as any,
  },
  series: [
    {
      type: 'column',
      // color: '#506ef9',
      data: [
        { y: 2, color: '#eeeeee' },
        { y: 4, color: '#506ef9' },
        { y: 5, color: '#ffe8df' },
        { y: 8, color: '#fc5185' },
        { y: 10, color: '#00adb5' },
        { y: 12, color: '#393e46' },
      ],
    },
  ],
};

// export const barChart: Options = {
//   chart: {
//     type: 'line',
//   },
//   credits: {
//     enabled: false,
//   },
//   title: {
//     text: '',
//   },
//   yAxis: {
//     visible: true,
//     gridLineColor: 'gray',
//   },
//   legend: {
//     enabled: false,
//   },
//   xAxis: {
//     lineColor: '#fff',
//     categories: ['Transaction', 'Withdrawal', 'Beneficiary'],
//   },

//   plotOptions: {
//     column: {
//       allowPointSelect: true,
//     },
//     series: {
//       borderRadius: 5,
//     } as any,
//   },
//   series: [
//     {
//       type: 'column',
//       color: '#506ef9',
//       data: [
//         { y: 4, color: '#495579' },
//         { y: 4, color: '#506ef9' },
//         { y: 5, color: '#ffe8df' },
//       ],
//     },
//   ],
// };

//
export const barChart2: Options = {
  chart: {
    type: 'line',
  },
  credits: {
    enabled: false,
  },
  title: {
    text: '',
  },
  yAxis: {
    visible: true,
    gridLineColor: 'gray',
  },
  legend: {
    enabled: false,
  },
  xAxis: {
    lineColor: '#fff',
    categories: ['Free booking code', 'Paid booking code'],
  },

  plotOptions: {
    column: {
      allowPointSelect: true,
    },
    series: {
      borderRadius: 5,
    } as any,
  },
  series: [
    {
      type: 'column',
      color: '#506ef9',
      data: [
        { y: 4, color: '#506ef9' },
        { y: 5, color: '#ffe8df' },
      ],
    },
  ],
};
