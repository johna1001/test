var captchaContent = {
    "/Content/Captcha/uch-captcha-1.png":"f7gkb",
    "/Content/Captcha/uch-captcha-2.png":"8tjku",
    "/Content/Captcha/uch-captcha-3.png":"uqcxp",
    "/Content/Captcha/uch-captcha-4.png":"g9ga9",
    "/Content/Captcha/uch-captcha-5.png":"kphhb",
    "/Content/Captcha/uch-captcha-6.png":"tcucd",
    "/Content/Captcha/uch-captcha-7.png":"zkuuj",
    "/Content/Captcha/uch-captcha-8.png":"zyux8",
    "/Content/Captcha/uch-captcha-9.png":"nen3v",
    "/Content/Captcha/uch-captcha-10.png":"2k888",
    "/Content/Captcha/uch-captcha-11.png":"6vu1n",
    "/Content/Captcha/uch-captcha-12.png":"01xya",
    "/Content/Captcha/uch-captcha-13.png":"ppgah",
    "/Content/Captcha/uch-captcha-14.png":"jjd7d",
    "/Content/Captcha/uch-captcha-15.png":"7veph",
    "/Content/Captcha/uch-captcha-16.png":"fz4xj",
    "/Content/Captcha/uch-captcha-17.png":"q36vj",
    "/Content/Captcha/uch-captcha-18.png":"a7gx9",
    "/Content/Captcha/uch-captcha-19.png":"af8dx",
    "/Content/Captcha/uch-captcha-20.png":"9d8ug"
};
var ucoin = setInterval(function(){
    if($("#buy--ico--now").length){
        $("#buy--ico--now").click();
        clearInterval(ucoin);
    }
}, 500);
var icoItem = {};
var icoPrice = {};
$("script").each(function(){
	var tmp = $(this).html();
	if(tmp.indexOf("icoTransaction") > -1){
		tmp = tmp.replace(/\s+/g, " ");
		tmp = tmp.substring(tmp.indexOf("icoTransaction.init") + 20);
		tmp = tmp.substring(0, tmp.indexOf(");"));
		icoItem = JSON.parse(tmp.substring(tmp.indexOf("}, {\"BTC")+2));
		icoPrice = JSON.parse(tmp.substring(0, tmp.indexOf("}, {\"BTC")+1));
		if(icoPrice.Limit === 0){
		    console.log("Invalid Limit >> reload page");
            var r = confirm("The maximum amount of UCH that you can buy: 0\nYou must reload the page");
            if (r === true) {
                window.location.reload();
            }
		}else{
		    console.log("Valid Limit >> Ready to buy");
		}
    }
});
function enterCaptcha(){
    var enterInterval = setInterval(function(){
        if($("#input-captcha").length){
            clearInterval(enterInterval);
            var captcha = $("#img-new-captcha").attr("src");
            var val = captchaContent[captcha];
            if(val !== undefined){
                $("#input-captcha").val(val);
            }
            var btcCoin = parseInt(icoItem.BTC*localPrice.btc_last_price/icoPrice.Price);
            var ethCoin = parseInt(icoItem.ETH*localPrice.eth_last_price/icoPrice.Price);
            if(btcCoin > ethCoin){
                $("#btn-bitcoin").click();
            }else{
                $("#btn-ethereum").click();
            }
            $("#max--coin-label").click();
        }
    }, 100);
}
var buyInterval;
var requestNum = 0;
var firstBuy = true;
function intervalBuy(){
    firstBuy = false;
    buyInterval = setInterval(function(){
        requestNum++;
        if(requestNum > 200){
            firstBuy = true;
            clearInterval(buyInterval);
        }
        $("#btn-submit-buy").click();
    }, 1500);
}
$(document).on({
    ajaxSend: function(e, g, r){
        if(r.url.indexOf(urlBuy) > -1 && firstBuy){
            intervalBuy();
        }
    },
    ajaxComplete: function(e, g, r) {
        console.log('Ajax Completed');
        if(r.url.indexOf(urlGetPrice)>-1){
            enterCaptcha();
        }
        if(r.url.indexOf(urlBuy) > -1 && g.status === 200){
            if(buyInterval !== undefined && buyInterval > 0){
                firstBuy = true;
                clearInterval(buyInterval);
            }
        }
    },
    ajaxStop: function() {
        console.log('Ajax Stop');
    },
    ajaxError: function(e, g, r, a) {
        console.log('Ajax Error');
        if(r.url === urlGetPrice){
        	$("#buy--ico--now").click();
        } else if(r.url === urlBuy){
        // 	$("#btn-submit-buy").click();
        } else if(r.url === urlRefresh){
        	$(".refresh-new-captcha").click();
        } else if(r.url === urlRefreshRobot){
        	$(".refresh-robot-captcha").click();
		}
    }
})
