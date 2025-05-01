
	var AdvicoCounter = {
	  /**
	   * Initialize counter.
	   *
	   * @param {object} args
	   */
	  init: function (args) {
		this.args = args;
		
		function getCookie(name) {
			const cookies = document.cookie.split('; ');
			for (let i = 0; i < cookies.length; i++) {
			  const [key, value] = cookies[i].split('=');
			  if (decodeURIComponent(key) === name) {
				return decodeURIComponent(value);
			  }
			}
			return null;
		  }
		// Build the payload
		const data = {
		  postId: args.postId,
		  userInfo: args.userInfo,
		  visitId:getCookie(`avc_views[${args.postId}]`)
		};
		
		// Log the visit
		this.request(args.apiUrl + '/visit', data, 'POST', {
		  'Content-Type': 'application/json',
		  'Referer': document.referrer,
		  'X-WP-Nonce': args.nonce
		})
		.then(data => {

			if (data?.counted && data?.cookie) {
				const expiresIn = data.cookie.expiry - Math.floor(Date.now() / 1000);
				document.cookie = `${data.cookie.name}=${data.cookie.value}; max-age=${expiresIn}; path=/`;
				
			  } else {
				console.log(`Post ${data.post_id} already viewed.`);
			  }
		});
  
		// Get initial views count
		this.getViews();
	  },
  
	  getViews: function() {
		const data = {
		  postId: this.args.postId
		};
  
		this.request(this.args.apiUrl + '/views', data, 'POST', {
		  'Content-Type': 'application/json',
		  'X-WP-Nonce': this.args.nonce
		})
		.then(response => {
			
			if (response.status === 'success') {
				
				const counters = document.querySelector('#advico-views-count');
				
					counters.textContent = response.data.total_views;
				
			}
		});
	  },
  
	  /**
	   * Make request to REST API with JSON
	   *
	   * @param {string} url
	   * @param {object} params
	   * @param {string} method
	   * @param {object} headers
	   */
	  request: function (url, params, method, headers) {
		return fetch(url, {
			method: method,
			headers: headers,
			body: JSON.stringify(params)
		  })
			.then(response => {
			  if (!response.ok) throw new Error(response.statusText);
			  return response.json();
			})
			.then(response => {
			  
			  this.triggerEvent('avcVisitLogged', response);
			  return response; // <- penting untuk meneruskan response ke .then selanjutnya
			})
			.catch(error => {
			  console.error('AVC Error:', error);
			});
	  },
  
	  /**
	   * Trigger custom event
	   *
	   * @param {string} eventName
	   * @param {object} data
	   */
	  triggerEvent: function (eventName, data) {
		const event = new CustomEvent(eventName, {
		  bubbles: true,
		  detail: data
		});
		document.dispatchEvent(event);
	  }
	};
  
	
  
document.addEventListener('DOMContentLoaded', function () {
	AdvicoCounter.init(advicoFrontend); // make sure avcFrontend is available
});
  