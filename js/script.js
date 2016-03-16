var container = document.querySelector('#container')
var etsyKey = 'uhdk37cf5h6h7dcxamb6eb9x'
var url = 'https://openapi.etsy.com/v2/listings/active?'
var images = 'includes=Images,Shop'

//---------------------------------------------Models
var EtsyScrollModel = Backbone.Model.extend ({

		url: 'https://openapi.etsy.com/v2/listings/active.js?includes=Images,Shop&api_key=aavnvygu0h5r52qes74x9zvo&callback=?'
})

var EtsyDetailModel = Backbone.Model.extend ({
	
		_generateUrl: function(id) {
		this.url = 'https://openapi.etsy.com/v2/listings/'+ id +'.js?includes=Images,Shop&api_key=aavnvygu0h5r52qes74x9zvo&callback=?'
	}
})


//---------------------------------------------Views

var EtsyScrollView = Backbone.View.extend ({
	el: "#container",

	initialize: function(someModel) { 
		this.model = someModel
		var boundRender = this._render.bind(this)
		this.model.on("sync",boundRender)
	},


	events: { 
		"click img": "_triggerDetailView",
		'keydown input':'_searchByKeyword'
	},

	_searchByKeyword: function (keyEvent){
		var searchTerm = keyEvent.target.value
		if(keyEvent.keyCode === 13){
			location.hash = 'search/' + searchTerm
		}
	},

	_triggerDetailView: function(clickEvent) {
		
		var imgNode = clickEvent.target
		console.log([imgNode])
		window.location.hash = "detail/" + imgNode.getAttribute('value')
	},

	_render: function (){
		console.log(this.model)
		
		var objArr = this.model.get('results')
		var htmlString = '<input type="text" placeholder="Search meh">'
			for(var i = 0; i<objArr.length; i++){
				var obj = objArr[i]
				var img = obj.Images[0].url_75x75
				var seller = obj.Shop.shop_name
				htmlString += '<div class="daddyDiv"><div class="imgDiv"><img src="'+ img +'" value="'+ obj.listing_id +'" class="scrollImg"></div><div class="miniDescription">' 
				htmlString += '<h1 class="listingTitle">'+ obj.title + '</h1><div class="bottom"><h1 class="sellerName">'+seller+'</h1><h1 class="money">' 
				htmlString += obj.price + ' ' + obj.currency_code + '</h1></div></div></div>'
			}
			this.el.innerHTML = htmlString
	}
})

var EtsyDetailView = Backbone.View.extend ({
	
	el: "#container",

	initialize: function(someModel) { 
		this.model = someModel
		var boundRender = this._render.bind(this)
		this.model.on("sync",boundRender)
	},
	events: { 
		"click img": "_triggerScrollView"
	},
	_triggerScrollView: function(clickEvent) {
		var logoNode = clickEvent.target
		window.location.hash = "scroll"
	},
	_render: function (){
		console.log(this.model)
		var objListing = this.model.get('results')[0]
		var htmlString = ''
		var img = objListing.Images[0].url_fullxfull
				htmlString += '<div id="listingContainer"><div id="bigImg"><img src="' + img +'" id="listingImage"><h1>Click on the image to go back!</h1>'
				htmlString += '</div><div id="right"><div id="listingDescription"><h1 id="title">'+ objListing.title +'</h1>'
				htmlString += '<h1 id="shop"> By: ' + objListing.Shop.shop_name +'</h1>'+'<h1 id="description">'+ objListing.description +'</h1>'
				htmlString += '<div id="listingPosition"><h1 id="money">'+ objListing.price + ' ' + objListing.currency_code +'</h1>'
				htmlString += '<h1 id="quantity" > Quantity:'+ objListing.quantity +'</h1></div></div>'
			
			this.el.innerHTML = htmlString
	}
})



//---------------------------------------------Router
var EtsyRouter = Backbone.Router.extend ({
routes: {														
		"scroll": "handleEtsyScrollData",				
		"detail/:id": "handleEtsyDetailData",
		'search/:searchTerm': "handleEtsySeachData",															
		"*default": "handleEtsyScrollData"
	},
	handleEtsyScrollData: function (){
	var esm = new EtsyScrollModel ()
	var esv = new EtsyScrollView (esm)
	esm.fetch()
},
	handleEtsyDetailData: function (id){
		var edm = new EtsyDetailModel ()
		edm._generateUrl(id)
		var edv = new EtsyDetailView (edm)
		edm.fetch()
},
	handleEtsySeachData:function (searchTerm){
		var esm =new EtsyScrollModel ()
		var esv = new EtsyScrollView(esm)
		esm.fetch({data:{
				keywords:searchTerm	
			}})
	},

	initialize: function() {
		Backbone.history.start()
	}

})

var myRtr = new EtsyRouter ()
