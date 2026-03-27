import { defineStore } from 'pinia'

export const useBeneStore = defineStore('bene', {
  state: () => ({
    beneficiaries_no: 0,
    survey_no: 0,
    refreshCounsel: false
  }),
  actions: {
    async fetchUsers(user_no) {
      try {
        
        const resp = await fetch(`/api/beneficiaries/${user_no}`)
        const data = await resp.json()
        this.beneficiaries_no = data[0].beneficiaries_no;
        this.survey_no = data[0].survey_no;
      } catch (err) {
        console.log(err)
      }
    }
  }
})