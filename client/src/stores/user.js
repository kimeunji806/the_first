import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user_no: null,
    role: '',
    user_id: '',
    user_name: '',
    approval: 0
  }),
  actions: {
    setUser(user) {
      this.user_no = user.user_no
      this.role = user.role
      this.user_id = user.user_id
      this.user_name = user.user_name
      this.approval = user.approval


      localStorage.setItem('user', JSON.stringify(user))
    },
    loadUser() {
      const data = localStorage.getItem('user')
      if (data) {
        const user = JSON.parse(data)
        this.setUser(user)
      }
    },
    logout() {
      this.$reset()
      localStorage.removeItem('user')
    }
  }
})