// jQuery Initialize
// https://github.com/pie6k/jquery.initialize
(function($){"use strict";var combinators=[" ",">","+","~"];var fraternisers=["+","~"];var complexTypes=["ATTR","PSEUDO","ID","CLASS"];function grok(msobserver){if(!$.find.tokenize){msobserver.isCombinatorial=true;msobserver.isFraternal=true;msobserver.isComplex=true;return}msobserver.isCombinatorial=false;msobserver.isFraternal=false;msobserver.isComplex=false;var token=$.find.tokenize(msobserver.selector);for(var i=0;i<token.length;i++){for(var j=0;j<token[i].length;j++){if(combinators.indexOf(token[i][j].type)!=-1)msobserver.isCombinatorial=true;if(fraternisers.indexOf(token[i][j].type)!=-1)msobserver.isFraternal=true;if(complexTypes.indexOf(token[i][j].type)!=-1)msobserver.isComplex=true}}}var MutationSelectorObserver=function(selector,callback,options){this.selector=selector.trim();this.callback=callback;this.options=options;grok(this)};var msobservers=[];msobservers.initialize=function(selector,callback,options){var seen=[];var callbackOnce=function(){if(seen.indexOf(this)==-1){seen.push(this);$(this).each(callback)}};$(options.target).find(selector).each(callbackOnce);var msobserver=new MutationSelectorObserver(selector,callbackOnce,options);this.push(msobserver);var observer=new MutationObserver(function(mutations){var matches=[];for(var m=0;m<mutations.length;m++){if(mutations[m].type=="attributes"){if(mutations[m].target.matches(msobserver.selector))matches.push(mutations[m].target);if(msobserver.isFraternal)matches.push.apply(matches,mutations[m].target.parentElement.querySelectorAll(msobserver.selector));else matches.push.apply(matches,mutations[m].target.querySelectorAll(msobserver.selector))}if(mutations[m].type=="childList"){for(var n=0;n<mutations[m].addedNodes.length;n++){if(!(mutations[m].addedNodes[n]instanceof Element))continue;if(mutations[m].addedNodes[n].matches(msobserver.selector))matches.push(mutations[m].addedNodes[n]);if(msobserver.isFraternal)matches.push.apply(matches,mutations[m].addedNodes[n].parentElement.querySelectorAll(msobserver.selector));else matches.push.apply(matches,mutations[m].addedNodes[n].querySelectorAll(msobserver.selector))}}}for(var i=0;i<matches.length;i++)$(matches[i]).each(msobserver.callback)});var defaultObeserverOpts={childList:true,subtree:true,attributes:msobserver.isComplex};observer.observe(options.target,options.observer||defaultObeserverOpts);return observer};$.fn.initialize=function(callback,options){return msobservers.initialize(this.selector,callback,$.extend({},$.initialize.defaults,options))};$.initialize=function(selector,callback,options){return msobservers.initialize(selector,callback,$.extend({},$.initialize.defaults,options))};$.initialize.defaults={target:document.documentElement,observer:null}})(jQuery);

(function( $ ) {
	'use strict';

	// Get the current uploads directory
	let preview_path = window.acf_fc_layout_previews_uploads_url;

	// Define the tooltip class that appears from the layout selection buttons
	let el = '.acf-fc-popup';

	// Other vars
	let hasImg = false;
	let intPopupCheck = null;

	// Wait for the tooltip to appear in the DOM. We are using jQuery Initialize for our Mutation Observer. It's just easier that way for me.
	$.initialize(el, function() {
		$("ul li", el).each(function () {
			let $self = $(this);
			let $list_item = $self.find("a");
			let layout = $list_item.data("layout");
			let img_url = preview_path + layout + '.jpg';
			let layout_name = $list_item.text();

			// Attempt to download the preview image. This allows us to test if the image exists or not.
			$.get(img_url).done(function() {
				hasImg = true;
				// Append the image. This is rough and could be refactored, but it works for now.
				$list_item.html(layout_name + "<br><img src='" + img_url + "'>");
			}).fail(function () {
				// We do this check in the case of if any image exists, then all non-existent areas will show an error.
				// If there are no images, we don't change the layout selection tooltip
				if (hasImg) {
					// Again, I'm sure this could be refactored
					$list_item.html(layout_name + "<br><em>(Example preview not available, image <abbr title='" + img_url + "'>" + layout + ".jpg</abbr> missing.)</em><hr>");
				}
			});
		});
	});

	// Here, we check if any image exists for layout previews. If so, we display the background and modify the tooltip container.
	$.initialize(el + " ul li img", function() {
		if(!$(el).find(".wrapper").length) {
			// Remove forced positioning applied to tooltip and add our class
			$(el).removeAttr("style").addClass('acf-admin-popup-enabled');

			// Wrap the ul in a container. This was done because when applying a left: 50% / transform: translateX(-50%)
			// it results in the entire container having blurry content (text, images). I could not get any "fix" to actually
			// work here. Please feel free to suggest alternatives if necessary.
			$(el).find("ul").wrap("<div class='wrapper'></div>");

			// On click of the background overlay, remove it. Clicking outside of the tooltip also closes the tooltip,
			// so we don't need to worry about that.
			$('<div/>').addClass("acf-admin-popup-background").appendTo("body").on("click", function() { $(this).remove(); });

			// We can't listen to the element as usual because of stopPropagation being used...
			// This is the only workaround I have found to work. If you have another idea, please submit it!
			intPopupCheck = setInterval(function() {
				// Check if the tooltip no longer exists
				if(!$(el).length) {
					// If the tooltip is non-existent, remove the background overlay and stop the interval timer check
					$(".acf-admin-popup-background").remove();
					clearInterval(intPopupCheck);
				}
			}, 100);
		}
	});

})( jQuery );
