

const staticCacheName = 'site-static-v1.7'


const assets = [
    "./",
    "./index.html",
    "./css/styles.css",
    "./fallback.html"
]


if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js')
	.then(reg => console.log('sw reqistered', reg))
	.catch(err => console.error('sw not registered', err)) 
}

// install
self.addEventListener('install', (event) => {
    console.log('installed');
    
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets)
        })
    )
})

// activation and deleting
self.addEventListener("activate", (event) => {
    console.log("activated");

    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                  .filter((key) => key !== staticCacheName)
                  .map((key) => caches.delete(key))
              );
              
            // const filteredkeys = keys.filter(key => key !== staticCacheName)
            // filteredkeys.map(key => caches.delete(key))
  
        })
    )
})

// Fetch
self.addEventListener('fetch', (event) => {
    console.log('Intercepted a http request', event.request); 
    
})

