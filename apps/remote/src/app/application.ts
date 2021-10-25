import {createApp} from '@microzord/angular/child';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app.module';

export const App = createApp(
  () => platformBrowserDynamic([]).bootstrapModule(AppModule),
  'microzord-root',
);