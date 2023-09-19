<script>
import countTo from "vue-count-to";
/**
 * Sales-analytics component
 */
export default {
    components: {
        countTo
    },
    data() {
        return {
            series: [{
            name: "Session Duration",
            data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
          },
          {
            name: "Page Views",
            data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
          },
          {
            name: 'Total Visits',
            data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 26, 45, 47]
          },
          {
            name: 'Total Visits 2',
            data: [87, 57, 74, 99, 75, 38, 62, 47, 12, 46, 35, 49]
          },
          {
            name: 'Total Visits 3',
            data: [87, 27, 54, 59, 75, 28, 32, 47, 82, 56, 45, 57]
          }
        ],
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [5, 7, 5],
          curve: 'straight',
          dashArray: [0, 8, 5]
        },
        title: {
          text: 'Page Statistics',
          align: 'left'
        },
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
          }
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
            '10 Jan', '11 Jan', '12 Jan'
          ],
        },
        
        grid: {
          borderColor: '#f1f1f1',
        }
        };
    }
};
</script>

<template>

    <div class="card">
        <div class="card-body">
            <h4 style="text-align: center; font-weight: bold;" class="card-title mb-4">Stats last 14 days</h4>
            <apexchart type="line" class="apex-charts" dir="ltr" height="339" :options="chart" :series="series"></apexchart>
        </div>
    </div>
</template>
