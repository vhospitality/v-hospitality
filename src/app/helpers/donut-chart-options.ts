import { Options } from 'highcharts';

export const donutChartOptions: Options = {
  chart: {
    type: 'pie',
    plotShadow: false,
  },
  credits: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      // innerSize: '100%',
      borderWidth: 20,
      borderColor: '',
      slicedOffset: 20,
      dataLabels: {
        connectorWidth: 0,
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
  series: [
    {
      type: 'pie',
      data: [
        { name: '10%', y: 2, color: '#286C65' },
        { name: '20%', y: 4, color: '#4B9934' },
        { name: '30%', y: 6, color: '#C36F38' },
        { name: '40%', y: 8, color: '#BC333E' },
        { name: '5%', y: 10, color: '#224478' },
      ],
    },
  ],
   };

export const donutChartOptions2: Options = {
  chart: {
    type: 'pie',
    plotShadow: false,
  },
  credits: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      // innerSize: '100%',
      borderWidth: 20,
      borderColor: '',
      slicedOffset: 20,
      dataLabels: {
        connectorWidth: 0,
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
  series: [
    {
      type: 'pie',
      data: [
        { name: '20%', y: 2, color: '#4F3F8E' },
        { name: '30%', y: 4, color: '#4D3E00' },
        { name: '40%', y: 6, color: '#2E1301' },
        { name: '10%', y: 8, color: '#69388A' },
        { name: '50%', y: 10, color: '#CECB4C' },
      ],
    },
  ],
};
