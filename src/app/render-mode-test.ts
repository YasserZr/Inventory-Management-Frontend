import { RenderMode } from '@angular/ssr';

// Log the available values of RenderMode to help debugging
console.log('RenderMode:', RenderMode);

// Check if it has a Server property
if ('Server' in RenderMode) {
  console.log('RenderMode.Server:', RenderMode.Server);
} else {
  console.log('No Server property found in RenderMode');
}

// Check for direct values
console.log('Direct values:');
if ('dynamic' in RenderMode) console.log('- dynamic is available');
if ('prerender' in RenderMode) console.log('- prerender is available');
if ('Dynamic' in RenderMode) console.log('- Dynamic is available');
if ('PreRender' in RenderMode) console.log('- PreRender is available');
if ('DYNAMIC' in RenderMode) console.log('- DYNAMIC is available');
if ('PRERENDER' in RenderMode) console.log('- PRERENDER is available');