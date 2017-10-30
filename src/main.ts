import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { HeroService } from './app/hero.service';

HeroService.initMode(!/localhost/.test(document.location.host));

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));
