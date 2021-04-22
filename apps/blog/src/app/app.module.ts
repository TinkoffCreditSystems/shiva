import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {RooferAppModule, RooferHostModule} from '@roofer/angular/host';
import {HttpClientModule} from '@angular/common/http';
import {RxnodeComponent} from './rxnode/rxnode.component';
import {SsrComponent} from './ssr/ssr.component';
import {MainComponent} from './main/main.component';
import {SandboxComponent} from './sandbox/sandbox.component';
import {ComponentsModule} from './components/components.module';

@NgModule({
  declarations: [
    AppComponent,
    RxnodeComponent,
    SsrComponent,
    MainComponent,
    SandboxComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: '',
        component: MainComponent,
      },
      {
        path: 'ssr',
        component: SsrComponent,
      },
      {
        path: 'rxnode',
        component: RxnodeComponent,
      },
      {
        path: 'sandbox',
        component: SandboxComponent,
      },
    ]),
    RooferAppModule,
    RooferHostModule.register({
      apps: [
        {
          name: 'ssr-article',
          assetMap: '/ssr-article/roofer.json',
        },
        {
          name: 'rxnode-article',
          assetMap: '/rxnode-article/roofer.json',
        },
      ],
    }),
    ComponentsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
