
// Var med navn på statisk cache
const staticCacheName = 'site-static-v1.7'
// Var med navn på dynamisk cache
const dynamicCacheName = 'site-dynamic-v1.0'

// Array med filer til statisk cache
const assets = [
    "./",
    "./index.html",
    "./css/styles.css",
    "./fallback.html"
]


// Registrerer service worker / sw
if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js')
	.then(reg => console.log('sw reqistered', reg))
	.catch(err => console.error('sw not registered', err)) 
}


// Installerer SW - og cacher nødvendig filer
self.addEventListener('install', (event) => {
    console.log('SW installed');
    
    // Skriver filer og tilføjer til statisk cashe
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('Skriver til statisk cache');
            cache.addAll(assets)
        })
    )
})


// Activate SW
self.addEventListener("activate", (event) => {
	// console.log('SW activated', event);

    //filtrerer og sletter caches, der ikke matcher opdateret ny version
    event.waitUntil(
        caches.keys().then(keys => {
            const filteredkeys = keys.filter(key => key !== staticCacheName)
            filteredkeys.map(key => caches.delete(key))

            // console.log(filteredkeys);       
        })
    )
})


// Fetch event
self.addEventListener('fetch', (event) => {
    // console.log('Fetch event', event)
    // console.log('Fetch event', event.request);

    // if(!(event.request.url.indexOf('http') === 0)) return

	// Kontroller svar på request
	event.respondWith(
		// Kig efter file match i cache 
		caches.match(event.request).then(cacheResult => {
			// Returner match fra cache - ellers hent fil på server
			return cacheResult || 
            fetch(event.request).then(async fetchRes => {
				// Tilføjer nye sider til cachen
				return caches.open(dynamicCacheName).then(cache => {
					// Bruger put til at tilføje sider til vores cache
					// Læg mærke til metoden clone
					cache.put(event.request.url, fetchRes.clone())
					// Returnerer fetch request
					return fetchRes
				})
			})
        
        //fanger fejl og returnerer en reserveside
		}).catch(() => {
            return caches.match('fallback.html')

            // if(event.request.url.indexOf('.html') > -1) {
			// 	return caches.match('./pages/fallback.html')
			// }
        })
	)

    // Kalder limit cache funktion
    limitCacheSize(dynamicCacheName, 20)
    // console.log("test", dynamicCacheName);
    
})


// Funktion til styring af antal filer i en given cache
const limitCacheSize = (cacheName, numberOfAllowedFiles) => {
	// Åbn den angivede cache
	caches.open(cacheName).then(cache => {
		// Hent array af cache keys 
		cache.keys().then(keys => {
			// Hvis mængden af filer overstiger det tilladte
			if(keys.length > numberOfAllowedFiles) {
				// Slet første index (ældste fil) og kør funktion igen indtil antal er nået
				cache.delete(keys[0]).then(limitCacheSize(cacheName, numberOfAllowedFiles))
			}
		})
	})
}



























































// const staticCacheName = 'site-static-v1.1'

// const assets = [
//     "/",
//     "/index.html",
//     "/css/styles.css"
// ]



// if('serviceWorker' in navigator) {
// 	navigator.serviceWorker.register('./sw.js')
// 	.then(reg => console.log('service worker registered', reg))
// 	.catch(err => console.error('service worker not registered', err)) 
// }

// // Install Event Service Worker
// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open(staticCacheName).then(cache => {
//             console.log('write something');
//             cache.addAll(assets)
//         })
//     )
// 	console.log('Service Worker has been installed');
// })


// // Activate event Service Worker
// self.addEventListener("activate", (event) => {
// 	console.log('Service Worker has been activated');

    // event.waitUntil(
    //     caches.keys().then(keys => {
    //         const filteredkeys = keys.filter(key => key != staticCacheName)
    //         filteredkeys.map(key => {
    //             caches.delete(key)
    //         })
    //     })
    // )
// })


// // Fetch event
// self.addEventListener('fetch', event => {
//     // console.log('Fetch event', event)
//     // console.log('Fetch event', event.request);

// 	// Kontroller svar på request
// 	event.respondWith(
// 		// Kig efter file match i cache 
// 		caches.match(event.request).then(cacheRes => {
// 			// Returner match fra cache - ellers hent fil på server
// 			return cacheRes || fetch(event.request).then(fetchRes => {
// 				// Tilføjer nye sider til cachen
// 				return caches.open(staticCacheName).then(cache => {
// 					// Bruger put til at tilføje sider til vores cache
// 					// Læg mærke til metoden clone
// 					cache.put(event.request.url, fetchRes.clone())
// 					// Returnerer fetch request
// 					return fetchRes
// 				})
// 			})
// 		})
// 	)
// })




// install event
// self.addEventListener("install", (event) => {
//     console.log("Service Worker has been installed");
//     event.waitUntil(self.skipWaiting()); // Akriver service worker med det samme
// });


// activate event
// self.addEventListener("activate", (event) => {
//     console.log("Service Worker has been activated");
//     event.waitUntil(self.clients.claim()); // Aktiver på ALLE sider
// });