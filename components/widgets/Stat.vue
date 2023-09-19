<script>
import countTo from "vue-count-to";
/**
 * Stat component
 */
export default {
    components: {
        countTo
    },
    data() {
        return {
            series: [{
                data: [25, 66, 41, 89, 63, 25, 44, 20, 36, 40, 54]
            }],
            chartOptions: {
                fill: {
                    colors: ["#5b73e8"]
                },
                chart: {
                    type: "bar",
                    sparkline: {
                        enabled: true
                    }
                },
                plotOptions: {
                    bar: {
                        columnWidth: "50%"
                    }
                },
                labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                xaxis: {
                    crosshairs: {
                        width: 1
                    }
                },
                tooltip: {
                    fixed: {
                        enabled: false
                    },
                    x: {
                        show: false
                    },
                    y: {
                        title: {
                            formatter: function (seriesName) {
                                return "";
                            }
                        }
                    },
                    marker: {
                        show: false
                    }
                }
            },
            growthChartOptions: {
                fill: {
                    colors: ["#f1b44c"]
                },
                chart: {
                    type: "bar",
                    sparkline: {
                        enabled: true
                    }
                },
                plotOptions: {
                    bar: {
                        columnWidth: "50%"
                    }
                },
                labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                xaxis: {
                    crosshairs: {
                        width: 1
                    }
                },
                tooltip: {
                    fixed: {
                        enabled: false
                    },
                    x: {
                        show: false
                    },
                    y: {
                        title: {
                            formatter: function (seriesName) {
                                return "";
                            }
                        }
                    },
                    marker: {
                        show: false
                    }
                }
            },
            orderseries: [70],
            orderRadial: {
                fill: {
                    colors: ["#34c38f"]
                },
                chart: {
                    sparkline: {
                        enabled: true
                    }
                },
                dataLabels: {
                    enabled: false
                },
                plotOptions: {
                    radialBar: {
                        hollow: {
                            margin: 0,
                            size: "60%"
                        },
                        track: {
                            margin: 0
                        },
                        dataLabels: {
                            show: false
                        }
                    }
                }
            },
            customerseries: [55],
            customerRadial: {
                fill: {
                    colors: ["#5b73e8"]
                },
                chart: {
                    sparkline: {
                        enabled: true
                    }
                },
                dataLabels: {
                    enabled: false
                },
                plotOptions: {
                    radialBar: {
                        hollow: {
                            margin: 0,
                            size: "60%"
                        },
                        track: {
                            margin: 0
                        },
                        dataLabels: {
                            show: false
                        }
                    }
                }
            }
        };
    }
};
</script>

<template>
<div class="row dashboardCard">
    <dashboard-card class="item" :value="1" :icon="'wifi'" :title="'Visits'" />
    <dashboard-card class="item" :value="1" :icon="'wifi'" :title="'Add To Card'" />
    <dashboard-card class="item" :value="1" :icon="'wifi'" :title="'Checkout'" />
    <dashboard-card class="item" :value="1" :icon="'wifi'" :title="'Created Campaigns'" />
    <dashboard-card class="item" :value="1" :icon="'wifi'" :title="'Order/AOV'" />
    <dashboard-card class="item" :value="1" :icon="'wifi'" :title="'Items/AOI'" />
    <dashboard-card class="item" :value="1" :icon="'wifi'" :title="'Conversion Rate'" />
    <dashboard-card class="item" :value="1" :icon="'wifi'" :title="'Pending Payment'" />
    <dashboard-card class="item" :value="1" :icon="'wifi'" :title="'Sales/Tip'" />
    <dashboard-card class="item" :value="1" :icon="'wifi'" :title="'Profits'" />
    <dashboard-card class="item" :value="1" :icon="'wifi'" :title="'Fulfillment Orders'" />
    <dashboard-card class="item" :value="1" :icon="'wifi'" :title="'Balance'" />
</div>
<!-- end row-->
</template>
