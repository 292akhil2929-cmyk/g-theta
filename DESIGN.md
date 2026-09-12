# G Theta theatre

The storefront is a camera-led Hyderabad first-show experience. Photographic amber environments carry the identity; small vermilion admission controls and a yellow merchandise room provide contrast. Archivo Black is reserved for display labels, with Space Grotesk for controls and product details.

## Spatial sequence

Forecourt → interval lobby → auditorium. Drag controls yaw and pitch with no automatic rotation. Wheel input moves between environments, while explicit room buttons provide keyboard and touch alternatives. The lobby places the snack interaction to the left and a world-anchored merchandise display to the right.

## Motion and implementation boundaries

Three.js renders existing panoramic photographs, hinged entry gates, product fixtures and instanced paper. Room travel is a damped zoom/crossfade, not free movement through reconstructed architecture. People within the photographs are not animated. Reduced motion disables paper and zoom; effects can also be paused. WebGL failure falls back to photographic backgrounds with accessible room actions.

## Commerce and sound

The yellow wardrobe uses canonical product data and supplied product photographs. Search, size selection and cart integration remain available. Entry is the audio-unlock gesture; the supplied soundtrack begins at twenty seconds and does not loop. Browser-denied playback exposes a manual audio control rather than claiming playback succeeded.

## Scope

Frontend presentation only. Existing cart, configurator, checkout components and backend data are preserved. Global ornamental overlays and competing scroll controllers are removed so the theatre owns its viewport.
