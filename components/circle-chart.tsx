import * as echarts from 'echarts';
import { useEffect } from 'react';

/* 本月打卡率 */
export default function CircleChart(props: {percent: number}) {
    useEffect(() => {
        const chartDom = document.getElementById('echartT');
        if (chartDom) {
            const myChart = echarts.init(chartDom);
            const getfpkszb = [props.percent]; //非贫困生占比
            const getfpkszb1 = [0.01];
            const option = {
                title: {
                    show: true,
                    text: '本月打卡率',
                    textStyle: {
                        color: 'rgba(51,51,51,.9)',
                        fontSize: 14,
                        fontWeight: 400
                    },
            
                    subtext: [`{a|${props.percent.toFixed(1) || 0}} {b|%}`],
                    subtextStyle: {
                        color: '#008FFF',
                        rich: {
                            a: {
                                fontSize: 24,
                                color: '#008FFF'
                            },
                            b: {
                                fontSize: 14,
                                color: 'rgba(51,51,51,.7)',
                            }
                        }
                    },
                    itemGap: 8,
                    left: 'center',
                    top: '33%'
                },
                tooltip: {
                    formatter: function() {
                        return null;
                    }
                },
                angleAxis: {
                    max: 100,
                    clockwise: false, // 逆时针
                    // 隐藏刻度线
                    show: false
                },
                radiusAxis: {
                    type: 'category',
                    show: false
                },
                polar: {
                    center: ['50%', '50%'],
                    radius: 108 //图形大小
                },
                legend: {
                    show: false
                },
                series: [{
                    stack: '测试',
                    type: 'bar',
                    data: getfpkszb,
                    showBackground: true,
                    backgroundStyle: {
                        color: '#fff',
                        borderColor: '#fff',
                        borderWidth: 4
                    },
                    coordinateSystem: 'polar',
                    roundCap: true,
                    barWidth: 10,
                    silent: true,
                    itemStyle: {
                        opacity: 1,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00D7FF'
                        }, {
                            offset: 1,
                            color: '#008FFF'
                        }]),
                        borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00D7FF'
                        }, {
                            offset: 1,
                            color: '#008FFF'
                        }]),
                        borderWidth: 0
                    },
                }, {
                    stack: '测试',
                    type: 'bar',
                    data: getfpkszb1,
                    showBackground: true,
                    backgroundStyle: {
                        color: '#EFF2F5',
                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                        shadowBlur: 10,
                        shadowOffsetY: 2,
            
                    },
                    coordinateSystem: 'polar',
                    roundCap: true,
                    barWidth: 10,
                    itemStyle: {
                        color: '#fff',
                        borderColor: '#00D7FF',
                        borderWidth: 3
                    },
                }]
            };
            option && myChart.setOption(option as any);
        }
    }, [props.percent]);
    return (
        <div id='echartT' className='w-[130px] h-[130px] absolute top-[10px] right-[29px]'></div>
    )
}