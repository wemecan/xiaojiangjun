<template>
	<view>
		<view class="header">
			<view class="h-title">收货方式</view>
			<uni-list>
			    <uni-list-item title="到店自提" :thumb="imgSrc+'public/shop-icon.png'" @click="gotoDorPages"></uni-list-item>
			</uni-list>
			<view class="storeName" v-if="isStoreName&&!orderInfo.address">{{storeName}}</view>
			
			<view v-if="!onlyStore">
			
			<uni-list>
			    <uni-list-item title="快递邮寄" :show-arrow="false" notHighLight @tap="gotoAddressManagement" :thumb="imgSrc+'public/adress1.png'"></uni-list-item>
			</uni-list>
		<!-- 	<uni-list v-if="orderInfo.address">
				<uni-list-item title="添加收货地址" :show-arrow="false" notHighLight></uni-list-item>
			</uni-list> -->
			
			<view class="address-info" v-if="!isStoreName &&orderInfo.address.realname && isAdress" @tap="gotoAddressManagement">
				<view class="top">
					<view class="name">{{orderInfo.address.realname}}</view>
					<view class="phone">{{orderInfo.address.mobile}}</view>
				</view>
				<uni-list>
					<uni-list-item notHighLight :title="orderInfo.address.city+orderInfo.address.area+orderInfo.address.address"></uni-list-item>
				</uni-list>
			</view>
			
			</view>
		</view>
		<view class="c-info" v-for="(item , index) in goods" :key="index">
			<product-title
				:img="item.thumb"
				:title="item.title"
				:details="'净含量：'+item.weight+'克'"
				:stock="'库存：'+item.kucun+'件'"
				:num="2"
			></product-title>
			<view class="c-bottom" v-if="item.optiontitle">
				<view class="c-b-word">产品规格</view>
				<view class="r-wrap-c">{{item.optiontitle}}</view>
			</view>
			<view class="c-bottom">
				<view class="c-b-word">购买数量</view>
				<view class="r-wrap">
					<!-- <button class="symbol" @tap="delNum(index)">-</button> -->
					<!-- <input class="ipt" type="number" v-model="item.total" /> -->
					<!-- <button class="symbol" @tap="addNum(index)">+</button> -->
					<view>X {{item.total}}</view>
				</view>
			</view>
			<view class="totalPrice">
				<text class="txt1">共{{item.total}}件商品</text>
				<text class="txt2">合计：</text>
				<text class="txt3">￥{{fromOrder ? item.price*item.total :item.marketprice*item.total}}</text>
			</view>
			<view class="integral">
				<view class="leftWord">可用560个积分抵用5.60元</view>
				<radio value="r1" :checked="false" class="radio"/>
			</view>	
			<picker mode="selector" :range="couponList">
				<view class="y-h-q">
					<view>
						<text class="txt1">优惠券：</text>
						<text class="txt2">couponList</text>
					</view>
					<view>
						<text class="txt3">-￥10</text>
						<image lazy-load :src="imgSrc+'public/arrow.png'"></image>
					</view>
				</view>
			</picker>
			
		</view>
		<view style="height: 116rpx;"></view>
		<view class="b-footer">
			<view class="txtWrap">
				<view class="txt1">合计</view>
				<view class="txt2">￥{{fromOrder ? orderInfo.order.price : orderInfo.realprice}}</view>
			</view>
			<button type="default" class="btn" @tap="fromOrder ? zfOrder() : pay()">立即支付</button>
		</view>
	</view>
</template>

<script>
	import uniList from "@/components/uni/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni/uni-list-item/uni-list-item.vue"
	import productTitle from '@/components/productTitle/productTitle.vue'
	import './index.scss'
	import { Request } from '../../public/utils.js'
	import _app from '../../js_sdk/QuShe-SharerPoster/util/QS-SharePoster/app.js';
	export default {
		components: {
			uniList,
			uniListItem,
			productTitle
		},
		data() {
			return {
				imgSrc: this.$store.state.imgSrc,
				isStoreName: false, // 是否到店自提
				isAdress: true, // 控制快递地址
				productNum: 1,
				orderInfo:{},
				goods:[],
				chooseAddress:'',
				chooseStore:'',
				storeName:'请选择门店',//选择的门店名
				aa:'',
				bb:'',
				couponList: ['不使用优惠券','满300减10元','满300减20元'],
				checkToPay:false,
				fromOrder:false,//是否来自订单
				onlyStore:false//只能上门自提
			};
		},
		onLoad(options) {
			if(options.type){//有值代表全部订单中点击去支付
				console.log('a')
				this.fromOrder = true
				this.getOrderDetail(options.id);
			}else{
				this.id = options.id;
				this.num = options.num;
				this.optionid = options.optionid;
				this.getData(this.id,this.num,this.optionid);
			}
			
		},
		onShow(e) {
			// console.log(this.chooseAddress)
			// console.log(this.chooseStore)
		},
		methods:{
			// delNum(id){
			// 	// console.log(id,this.goods[id][total])
			// 	this.goods[id]['total'] = Number(this.goods[id]['total']) - 1
			// 	this.updataNum(id);
			// },
			// addNum(id){
			// 	// 
			// 	// console.log(id,this.goods[id]['total'])
			// 	this.goods[id]['total'] = Number(this.goods[id]['total']) + 1
			// 	this.updataNum(id);
			// },
			// updataNum(id){
			// 	Request(
			// 		'member.cart.update',
			// 		{
			// 			id:this.goods[id]['id'],
			// 			total:this.goods[id]['total']
			// 		}
			// 	).then((res)=>{
			// 		console.log(res)
			// 		this.getData(this.id,this.num,this.optionid);
			// 	})
			// 	.catch((res)=>{
			// 		// 失败方法
			// 	})
			// },
			// 门店页跳转
			gotoDorPages(){
				uni.navigateTo({
					url: '/pages/chooiseStoreName/chooiseStoreName'
				})
			},
			// 地址页面跳转
			gotoAddressManagement(){
				uni.navigateTo({
					url: '/pages/addressManagement/addressManagement'
				})
			},
			// 支付
			pay() {
				var that = this;
				
				if(this.checkToPay){
					
					console.log('进入购买')
					
					Request(
						'order.create.submit',
						{
							id: 0,//0 
							goods: JSON.stringify(this.goods),//商品
							dispatchtype : this.isStoreName ? 1:0 ,//0快递,1上门
							fromcart: 1,//1来至购物车
							carrierid: this.isStoreName ? this.chooseStore : 0,//0
							addressid: this.chooseAddress ? this.chooseAddress : 0,//地址id
							couponid: this.optionid ? this.optionid : 0,//0 优惠券
							submit: true,
							packageid: 0,//0
							diydata: false,//false
							fromquick: 0   //0  快速购买
						}
					).then((res)=>{
						this.orderid = res.data.orderid
						console.log(res.data.error) 
						if(res.data.error != '0' ){
							_app.showToast(res.data.message)
							return false
						}
						return true
					})
					.then((res)=>{
						if(res){
							this.zfOrder()
						}
					})
					.catch((res)=>{
						// 失败方法
					})
				}else{
					_app.showToast('请选择到店自提或者快递地址')
				}	
			},
			zfOrder(){//支付方法
				Request(
					'order.pay',
					{
						id:this.orderid,
						comefrom:'wxapp'
					}
				).then((res)=>{
					console.log(res)
					return res.data.wechat.payinfo
				})
				.then((res)=>{
					console.log(res)
					//微信
					wx.requestPayment({
					  timeStamp: res.timeStamp,
					  nonceStr: res.nonceStr,
					  package: res.package,
					  signType: 'MD5',
					  paySign: res.paySign,
					  success (res) {
						console.log(res)
						if(res.errMsg=="requestPayment:ok"){
							uni.navigateTo({
								url: '/pages/paySuccess/paySuccess?id='+that.orderid
							})
						}
					  },
					  fail (res) { }
					})
					
					
					//余额
					// Request(
					// 	'order.pay.complete',
					// 	{
					// 		id:this.orderid,
					// 		type:'credit',
					// 		comefrom:'wxapp'
					// 	},
					// 	"POST",
					// 	'application/x-www-form-urlencoded'
					// ).then((res)=>{
					// 	// this.orderid = res.data.orderid
					// 	uni.navigateTo({
					// 		url: '/pages/paySuccess/paySuccess?id='+that.orderid
					// 	})			
					// })
					// .catch((res)=>{
					// 	// 失败方法
					// })
				})
				.catch((res)=>{
					// 失败方法
				})
			},
			getData(id='',num='',optionid=''){
				Request(
					'order.create',
					{
						id:id,
						total:num,
						optionid:optionid
					}
				).then((res)=>{
					
					// 成功方法
					// this.aa = JSON.stringify(res)
					// this.bb = JSON.parse(this.aa)
					this.orderInfo = res.data
					this.chooseAddress = res.data.address.id ? res.data.address.id : ''
					this.goods = res.data.goods[0]['goods']
					
					for(var i=0 ; i<this.goods.length;i++){
						console.log(this.goods[i]['type'])
						if(this.goods[i]['type']==2){
							this.onlyStore =true
						}
					}
					
					// console.log(this.chooseAddress,this.chooseAddress == '')
					if(this.chooseAddress != ''){
						this.checkToPay = true
					}
					
				})
				.catch((res)=>{
					// 失败方法
				})
				
				Request(
					'sale.coupon.my.getlist',
					{
						page:this.page
					}
				)
				.then((res)=>{
					this.couponList = res.data.list
				})
				.catch((res)=>{
					
				})
			},
			updataOrder(){
				console.log(this.goods)
				Request(
					'order.create.caculate',
					{
						goods: JSON.stringify(this.goods),
						addressid: this.chooseAddress ? this.chooseAddress : this.orderInfo.address.id,//选择收货地址id
						packageid: this.orderInfo.packageid,
						discountprice: this.orderInfo.discountprice,
						dflag:this.chooseAddress ? 0 : 1//1自提 0快递
					},
					'POST',
					'application/x-www-form-urlencoded'
				).then((res)=>{
					console.log(res)
					this.getData()
					// 成功方法
				})
				.catch((res)=>{
					// 失败方法
				})
			},
			getOrderDetail(id){
				this.orderid = id
				Request(
					'order.detail',
					{
						id:id,
					}
				).then((res)=>{
					this.orderInfo = res.data
					console.log(this.orderInfo,'232323')
					this.chooseAddress = res.data.address.id ? res.data.address.id : ''
					this.goods = res.data.goods
					if(this.chooseAddress != ''){
						this.checkToPay = true
					}
				})
				.catch((res)=>{
					// 失败方法
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
