import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		// imgSrc: '../../static/',
		imgSrc: 'http://xiaojiangjun.cduxj.com/attachment/images/',
		// hasLogin: false,
		// userInfo: {},
	},
	mutations: {
		// login(state, provider) {

		// 	state.hasLogin = true;
		// 	state.userInfo = provider;
		// 	uni.setStorage({//缓存用户登陆状态
		// 	    key: 'userInfo',  
		// 	    data: provider  
		// 	}) 
		// 	console.log(state.userInfo);
		// },
		// logout(state) {
		// 	state.hasLogin = false;
		// 	state.userInfo = {};
		// 	uni.removeStorage({  
  //               key: 'userInfo'  
  //           })
		// }
	},
	actions: {
	
	}
})

export default store
