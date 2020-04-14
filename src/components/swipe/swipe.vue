<template>
    <!--轮播图-->
    <div class="jd_banner" id = "jd_banner" ref="jd_banner" >
        <ul class="jd_bannerImg clearfix" ref='jd_bannerImg' v-if="imagesList.length">
            <!-- <li><a href="javascript:;"><img src="../../common/images/l1.jpg"/></a></li>
            <li><a href="javascript:;"><img src="../../common/images/l2.jpg"/></a></li>
            <li><a href="javascript:;"><img src="../../common/images/l3.jpg"/></a></li>
            <li><a href="javascript:;"><img src="../../common/images/l4.jpg"/></a></li>
			<li><a href="javascript:;"><img src="../../common/images/l5.jpg"/></a></li>
            <li><a href="javascript:;"><img src="../../common/images/l6.jpg"/></a></li>
            <li><a href="javascript:;"><img src="../../common/images/l7.jpg"/></a></li>
            <li><a href="javascript:;"><img src="../../common/images/l8.jpg"/></a></li> -->
			<li  v-for="item in imagesList" :key="item.id"><a href="javascript:;"><img :src="item.img_url" @click="imgclick"/></a></li>
        </ul>
        <ul class="jd_bannerIndicator" ref="jd_bannerIndicator">
            <li :class="key==0?'active':''" v-for="(item, key) in imagesList" :key="item.id"></li>
            <!-- <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li> -->
        </ul>
    </div>
</template>

<script>
export default {
  data () {
    return {
	  imagesList:[],
	  
    }
  },
  created() {
	this.getBannerImages();
  },
  mounted() { 
	  var _self = this; //记录当前this 否则在setTimeout里的this就是指向window了 ，会导致找不到函数的错误
	  setTimeout(function(){  //设置延迟 防止获取不到dom
		_self.bannerEffect();
	  },1000)
	
  },
  methods: {
	  bannerEffect() {  //轮播图
		/*1,修改轮播图的页面结构 前后插入*/
		var banner =this.$refs.jd_banner;
		var imgBox = this.$refs.jd_bannerImg;
		// console.log(banner.firstChild)
		// console.log(imgBox)
		var firstImg = imgBox.firstChild;
		var lastImg = imgBox.lastChild;
		
		var index = 1; 
		//前后插入
		imgBox.appendChild(firstImg.cloneNode(true));
		imgBox.insertBefore(lastImg.cloneNode(true), imgBox.firstChild);
		
		//2，修改相应样式
		var lis = imgBox.children;
		var count = lis.length;
		var bannerWidth = banner.offsetWidth;
		//重新设置盒子宽度与li的宽度
		imgBox.style.width = count*bannerWidth + "px";
		for(var i=0; i<lis.length; i++) {
			lis[i].style.width = bannerWidth + "px";
		}
		//设置默认偏移
		imgBox.style.left = -(index*bannerWidth) + "px";
		
		
		//3, 自动轮播
		var t1 = null;
		var startTimer = function() {
			t1 = setInterval(function(){
				index++;
				//console.log(index)
				//设置过渡效果
				imgBox.style.transition = "left 1.5s ease-in-out"
				imgBox.style.left = -(index*bannerWidth) + "px";
				//判断是否到最后一张
				setTimeout(function(){   //应为if判断 与前面的 index++ 几乎是同步的 如果不设置延迟 就到不了最后一张
					if(index == count-1) {
						index = 1;
						imgBox.style.transition = "none";
						imgBox.style.left = -(index*bannerWidth) + "px"
					}
				}, 1500)
			},2000)
		}
		startTimer();
		
		//4，手动轮播
		var startX = 0;
		var offsetX =0;
		var isEnd = true;
		imgBox.addEventListener("touchstart", function(e) {
			startX = e.targetTouches[0].clientX;
			clearInterval(t1);
		})
		
		imgBox.addEventListener("touchmove", function(e) {
			
			if (isEnd) {   //当过渡效果完成后才能继续拖动
				offsetX = e.targetTouches[0].clientX - startX;
				//console.log(offsetX)
				//拖动
				imgBox.style.transition = "none"; //清除过渡 因为有延迟
				imgBox.style.left = -index*bannerWidth +offsetX + "px";
			}
			
		})
		
		imgBox.addEventListener("touchend", function(e) {
			/*松开手指，标记当前过渡正在执行*/
			isEnd = false;
			if(Math.abs(offsetX)> bannerWidth/4) { //如果大于1/4 才滑动到下一张，否则回弹
				if(offsetX>0) {
					index--;  //移动坐标
				}else {
					index++;
				}
				imgBox.style.transition = "left 1.5s ease-in-out"
				imgBox.style.left = -(index*bannerWidth) + "px";

			}else if(Math.abs(offsetX)>0) {    //确保用户确实滑动过 才做回弹操作      
				//回弹操作
				imgBox.style.transition = "left 1.5s ease-in-out"
				imgBox.style.left = -(index*bannerWidth) + "px";
			}
			/*将上一次的坐标数据重置*/
			startX = 0;
			offsetX =0;
			
			startTimer();
		})
		
		//webkitTransitionEnd 事件 ：当一个元素的过渡效果完成后触发
		imgBox.addEventListener("webkitTransitionEnd", function() { 
			
			if(index == 0) {      //判断跳转图片
				index = count -2;
				imgBox.style.transition = "none"; //清除过渡
				imgBox.style.left = -index*bannerWidth + "px";
			}else if(index == count-1) {
				index = 1;
				imgBox.style.transition = "none"; 
				imgBox.style.left = -index*bannerWidth + "px";
			}
			setLi(index);   //设置li
			setTimeout(function(){
				isEnd = true;  //过渡完成标记
			},500)
		})
		
		//5, li点标记
		var setLi = function(index) {
			var indicators = banner.lastChild.children;
			for(var i =0; i<indicators.length; i++) {  //排他
				indicators[i].removeAttribute("class", "active");
			}
			indicators[index-1].setAttribute("class", "active");	
		}

		//当屏幕改变时 响应式改变样式
		window.onresize = function() {
			bannerWidth = banner.offsetWidth;
			imgBox.style.width = count*bannerWidth + "px";
			for(var i=0; i<lis.length; i++) {
				lis[i].style.width = bannerWidth + "px";
			}
			imgBox.style.left = -index*bannerWidth + "px";
		}
		
	},
	getBannerImages() {
		this.$http.get(this.dataIp+'/recommend/getBannerImages')
		.then(result => {
				//console.log(result.body);
				this.imagesList = result.body.message;	
		})
		.catch(err => {
			console.log(err);
		})
	},
	imgclick() {
		console.log("click")
	}

  }
}
</script>

<style scoped>
.clearfix::before, .clearfix:after {
content: "";
display: table;
}
.clearfix::after {
	clear: both;
}
.clearfix {
	*zoom: 1;
}


/*banner部分*/
.jd_banner {
	width: 100%;
	overflow: hidden;
	position: relative;  
}
.jd_bannerImg {
	width: 1000%;
	position: relative; /*这里不能使用绝对定位  父盒子不能获取撑开的高度会为零*/
	/*left: -100%; 		偏移一张图的位置*/
}
.jd_bannerImg>li {
	width: 10%; /*八张图 所有设置1/8  前后加俩张 1/10*/
	float: left;
}
.jd_bannerImg img {
	width: 100%;
	/*清除底部空系
	 * 1.设置为块元素
	 2.可以将文本的字体设置为零
	 3.vertical-align：bottom*/
	display: block;
}
.jd_bannerIndicator {
	position: absolute;
	height: 10px;
	width: 128px;
	bottom: 8px;
	left: 50%;
	transform: translateX(-50%);
}
.jd_bannerIndicator li {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	float: left;
	padding: 1px ;
	margin-left: 8px;
	background-color: rgba(255,255,255, .3);
}
.jd_bannerIndicator li:first-of-type {
	margin-left: 0;
}
.jd_bannerIndicator .active {
	width: 7px;
	height: 7px;
	border-radius: 50%;
	background-color: rgba(255,255,255, .8);
}
</style>