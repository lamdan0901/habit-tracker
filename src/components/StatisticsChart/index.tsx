import React, { useEffect, useRef, useState } from 'react'
import { Chart } from 'react-chartjs-2'
import type { ChartData, ChartArea } from 'chart.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  registerables,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ...registerables,
)

interface ChartConfig {
  disabledChart?: boolean
  title: string
  labels: string[]
  chartData: number[]
  displayLegend?: boolean
  tension?: number
}

interface SpotPricingChartProps {
  config: ChartConfig
}

const SpotPricingChart = ({ config }: SpotPricingChartProps) => {
  const chartRef = useRef<ChartJS>(null)
  const { disabledChart, title, labels, chartData, displayLegend = false, tension } = config
  console.log('render chart')

  const [ChartData, setChartData] = useState<ChartData<'bar'>>({
    datasets: [],
  })

  const createGradient = (ctx: CanvasRenderingContext2D, area: ChartArea) => {
    const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom)
    gradient?.addColorStop(0.25, 'rgba(108, 90, 238, 0.75)')
    gradient?.addColorStop(0.9, 'rgba(255, 255, 255, 0)')
    return gradient
  }

  const options = {
    plugins: {
      legend: {
        display: displayLegend,
      },
      title: {
        display: true,
        text: title,
      },
    },
  }

  useEffect(() => {
    const chart = chartRef.current

    if (chart === null) {
      return
    }

    chart.canvas.style.opacity = disabledChart ? '0.25' : '1'
    chart.canvas.style.pointerEvents = disabledChart ? 'none' : 'auto'

    const data = {
      labels,
      datasets: [
        {
          label: '',
          data: chartData,
          borderColor: '#6c5aee',
          backgroundColor: createGradient(chart.ctx, chart.chartArea),
          tension: tension || 0.4,
          fill: true,
        },
      ],
    }

    setChartData(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabledChart, chartRef.current, chartData])

  return <Chart type="line" options={options} data={ChartData} ref={chartRef} />
}

export default SpotPricingChart
