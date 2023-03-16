import { inspectionPath } from '../constants'
import axiosClient from '../utils/axiosClient'

interface Inspection {
  time: string
  isChecked: boolean
  habitId?: string
}

const habitsInspectionApi = {
  patchInspection(inspection: Inspection, inspectId: string): Promise<any> {
    return axiosClient.patch(`${inspectionPath}/${inspectId}`, inspection).catch((error) => {
      throw error.toJSON()
    })
  },

  postInspection(inspection: Inspection): Promise<any> {
    return axiosClient.post(`${inspectionPath}`, inspection).catch((error) => {
      throw error.toJSON()
    })
  },
}

export default habitsInspectionApi
